import { computed, inject, Injectable } from '@angular/core';
import { Habit, Task, HabitConfig } from '@app/entities';
import { FbBatch, readFbCollection, updateFbDocument } from '@app/firebase';
import { AuthClient } from './auth';
import { Observable, switchMap, take, tap } from 'rxjs';
import { GavListCache } from '@lib/helpers';
import { Timestamp } from 'firebase/firestore/lite';
import { HabitGoal, HabitUtils } from '@app/entities/non-zero';

const xDaysAgo = (x: number): Date => {
  const today = new Date();
  return new Date(today.getFullYear(), today.getMonth(), today.getDate() - x);
}

@Injectable({ providedIn: 'root' })
export class NonZeroClient {
  private auth = inject(AuthClient);

  habitConfigCache = new GavListCache<HabitConfig>(
    readFbCollection(`non-zero-tracker/${this.auth.user()?.uid}/v1`, { asMap: true }),
  );
  tasksCache = new GavListCache<Task>(
    readFbCollection(
      `non-zero-tracker/${this.auth.user()?.uid}/habits`,
      {
        asMap: true,
        orderBy: ['date', 'asc'],
        startAfter: Timestamp.fromDate(xDaysAgo(28)),
      },
    ),
  );

  habits = computed<Habit[]>(() => {
    const habitConfigMap = this.habitConfigCache.listMap() as { [habitId: string]: Habit };
    const tasks28DaysAgo = this.tasksCache.list();

    const habits = tasks28DaysAgo.reduce((habitMap, task) => {
      const date = new Date(task.date.seconds * 1000);
      const habit = habitMap?.[task.habitId] || {};
      const habitConfig = {
        ...habit,
        lastWeeks: {
          ...habit.lastWeeks,
          [HabitUtils.dateToNonZeroDate(date)]: {
            done: task.done,
            message: task.message,
          },
        },
      };
      habitMap[task.habitId] = habitConfig;

      return habitMap;
    }, habitConfigMap);

    return Object.values(habits);
  });

  saveHabit(habit: HabitConfig): Observable<void> {
    const userId = this.auth.user()?.uid;
    const { id, ...partialHabit } = habit;

    return updateFbDocument(`non-zero-tracker/${userId}/v1/${id}`, partialHabit)
      .pipe(
        tap(() => this.habitConfigCache.put(habit)),
        take(1),
      );
  }

  postTask(task: Task): Observable<void> {
    const userId = this.auth.user()?.uid;
    const { id, ...partialTask } = task;
    const batch = new FbBatch();
    batch.update(`non-zero-tracker/${userId}/habits/${id}`, partialTask);

    const today = HabitUtils.dateToNonZeroDate(new Date());
    const taskDate = HabitUtils.dateToNonZeroDate(new Date(partialTask.date.seconds * 1000));
    const taskIsToday = taskDate === today;
    const habitGoal = this.habitConfigCache.get(partialTask.habitId)?.goal;

    if (habitGoal && taskIsToday) {
      const outdatedTodayTask = this.tasksCache.get(id) || { done: 0 };
      const yesterday = HabitUtils.dateToNonZeroDate(xDaysAgo(1));
      const lastModifiedIsToday = today === habitGoal.lastModified;
      const lastModifiedIsYesterday = yesterday === habitGoal.lastModified;

      habitGoal.lastModified = today;
      
      if (lastModifiedIsToday) {
        habitGoal.effort += (Math.max(partialTask.done, 0) - Math.max(outdatedTodayTask.done, 0));
      } else if (lastModifiedIsYesterday) {
        habitGoal.effort += Math.max(partialTask.done, 0);
        habitGoal.streak += 1;
      } else {
        habitGoal.streak = 1;
      }
      batch.update(`non-zero-tracker/${userId}/v1/${task.habitId}`, { goal: habitGoal });
    }

    return batch.commit().pipe(
      tap(() => {
        this.tasksCache.put({ id, ...partialTask });
        if (habitGoal) {
          this.habitConfigCache.put({ id: partialTask.habitId, goal: habitGoal });
        }
      }),
      take(1),
    );
  }

  deleteHabit(habitId: string): Observable<void> {
    const userId = this.auth.user()?.uid;
    const relatedHabitDays = readFbCollection<Task>(`non-zero-tracker/${userId}/habits`, { where: ['habitId', '==', habitId] });
    
    return relatedHabitDays.pipe(
      switchMap(habitsToDelete => {
        const batch = new FbBatch();
        batch.delete(`non-zero-tracker/${userId}/v1/${habitId}`);
        habitsToDelete.forEach(habit => batch.delete(`non-zero-tracker/${userId}/habits/${habit.id}`));
        
        return batch.commit();
      }),
      tap(() => {
        this.habitConfigCache.delete(habitId);
        this.tasksCache.delete_substr(habitId);
      }),
      take(1),
    );
  }

  submitNewGoal(habitId: string, goalTitle: string): Observable<void> {
    const userId = this.auth.user()?.uid;
    const today = HabitUtils.dateToNonZeroDate(new Date());
    const todaysHabitId = HabitUtils.buildTaskId(habitId, new Date());
    const todaysValue = this.tasksCache.get(todaysHabitId);
    const goal: HabitGoal = {
      start: today,
      lastModified: today,
      effort: Math.max(todaysValue?.done || 0, 0),
      streak: todaysValue ? 1 : 0,
      title: goalTitle,
    };

    return updateFbDocument(`non-zero-tracker/${userId}/v1/${habitId}`, { goal }).pipe(
      tap(() => this.habitConfigCache.put({ id: habitId, goal })),
      take(1),
    );
  }
}

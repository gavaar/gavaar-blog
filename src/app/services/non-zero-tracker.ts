import { computed, inject, Injectable } from '@angular/core';
import { Habit, HabitDay, HabitConfig } from '@app/entities';
import { deleteFbDocument, readFbCollection, updateFbDocument } from '@app/firebase';
import { AuthClient } from './auth-client';
import { Observable, take, tap } from 'rxjs';
import { GavListCache } from '@lib/list-cache';
import { Timestamp } from 'firebase/firestore/lite';

const xDaysAgo = (x: number): Date => {
  const today = new Date();
  return new Date(today.getFullYear(), today.getMonth(), today.getDate() - x);
}

@Injectable({ providedIn: 'root' })
export class NonZeroTrackerClient {
  private auth = inject(AuthClient);

  habitConfigCache = new GavListCache<HabitConfig>(
    readFbCollection(`non-zero-tracker/${this.auth.user()?.uid}/v1`, { asMap: true }),
  );
  habitDaysCache = new GavListCache<HabitDay>(
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
    const habits28DaysAgo = this.habitDaysCache.list();

    const habits = habits28DaysAgo.reduce((habitMap, day) => {
      const date = new Date(day.date.seconds * 1000);
      const habitDay = habitMap?.[day.habitId] || {};
      const habitConfig = {
        ...habitDay,
        lastWeeks: {
          ...habitDay.lastWeeks,
          [`${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`]: {
            done: day.done,
            message: day.message,
          },
        }
      };
      habitMap[day.habitId] = habitConfig;

      return habitMap;
    }, habitConfigMap);

    return Object.values(habits);
  });

  saveHabit(habit: HabitConfig): Observable<void> {
    const userId = this.auth.user()?.uid;
    const { id, ...partialHabit } = habit;

    return updateFbDocument(`non-zero-tracker/${userId}/v1/${habit.id}`, partialHabit)
      .pipe(
        tap(() => this.habitConfigCache.put(habit)),
        take(1),
      );
  }

  postHabitEntry(habit: HabitDay): Observable<void> {
    const userId = this.auth.user()?.uid;
    const { id, ...partialHabit } = habit;

    return updateFbDocument(`non-zero-tracker/${userId}/habits/${id}`, partialHabit).pipe(
      tap(() => this.habitDaysCache.put({ id, ...partialHabit })),
      take(1),
    );
  }

  deleteHabit(habitId: string): Observable<void> {
    const userId = this.auth.user()?.uid;
    return deleteFbDocument(`non-zero-tracker/${userId}/v1/${habitId}`)
      .pipe(take(1));
  }
}

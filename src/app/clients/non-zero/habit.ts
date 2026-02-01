import { computed, inject, Injectable } from '@angular/core';
import { Habit } from '@app/entities/non-zero';
import { deleteFbDocument, readFbCollection, updateFbDocument } from '@app/firebase';
import { AuthClient } from '../auth';
import { GavListCache } from '@lib/helpers';
import { HabitUtils } from '@app/entities/non-zero';
import { sum, Timestamp } from 'firebase/firestore/lite';

@Injectable({ providedIn: 'root' })
export class HabitClient {
  private userId = computed(() => inject(AuthClient).user()?.uid || '');
  habits = new GavListCache<Habit>(this.getHabitData());

  async saveHabit(habit: Habit): Promise<void> {
    const { id, ...partialHabit } = habit;

    await updateFbDocument(`non-zero/${this.userId()}/habit/${id}`, partialHabit);
    this.habits.put(habit);
  }

  async deleteHabit(habitId: string): Promise<void> {
    await deleteFbDocument(`non-zero/${this.userId()}/habit/${habitId}`);
  
    this.habits.delete(habitId);
  }

  async submitNewGoal(habitId: string, goalTitle: string): Promise<void> {
    const today = HabitUtils.dateToNonZero(new Date());
    const currentGoal = {
      started: today,
      title: goalTitle,
    };

    await updateFbDocument(`non-zero/${this.userId()}/habit/${habitId}`, { currentGoal });
    this.habits.put({ id: habitId, currentGoal });
  }

  async getHabitData(): Promise<{ [id: string]: Habit }> {
    const habitMap = await readFbCollection<Habit>(`non-zero/${this.userId()}/habit`, { asMap: true });
    const habitIds = Object.keys(habitMap);

    for (const habitId of habitIds) {
      const habit = habitMap[habitId];
      const goalStart = habit.currentGoal?.started;

      if (goalStart) {
        const goalStartDate = HabitUtils.nonZeroToDate(goalStart);
        const sumQueryParams = {
          where: ['effort', '>', 0],
          orderBy: ['date', 'asc'],
          startAfter: Timestamp.fromDate(goalStartDate),
          aggregate: { effort: sum('effort') }
        };
        const effortSum = await readFbCollection(`non-zero/${this.userId()}/habit/${habitId}/task`, sumQueryParams);
        habitMap[habitId].effort = effortSum['effort'];
      }
    }

    return habitMap;
  }
}

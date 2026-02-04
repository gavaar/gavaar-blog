import { computed, inject, Injectable, signal } from '@angular/core';
import { Habit } from '@app/entities/non-zero';
import { deleteFbDocument, readFbCollection, updateFbDocument } from '@app/firebase';
import { AuthClient } from '../auth';
import { GavListCache } from '@lib/helpers';
import { HabitUtils } from '@app/entities/non-zero';
import { sum, Timestamp } from 'firebase/firestore/lite';

@Injectable({ providedIn: 'root' })
export class HabitClient {
  private userId = computed(() => inject(AuthClient).user()?.uid || '');
  habits = new GavListCache<Habit>();
  initialized = signal(false);

  constructor() {
    this.initialize();
  }

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
    const today = HabitUtils.today();
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

    const effortPromise: Promise<{ id: string; effort: number }>[] = habitIds
      .filter(habitId => habitMap[habitId].currentGoal?.started != null)
      .map(async habitId => {
        const goalStart = habitMap[habitId].currentGoal!.started;
        const goalStartDate = HabitUtils.nonZeroToDate(goalStart);

        const sumQueryParams = {
          where: ['effort', '>', 0],
          orderBy: ['date', 'asc'],
          startAfter: Timestamp.fromDate(goalStartDate),
          aggregate: { effort: sum('effort') }
        };

        const { effort } = await readFbCollection<number>(`non-zero/${this.userId()}/habit/${habitId}/task`, sumQueryParams);
        return { id: habitId, effort };
      });

    const efforts = await Promise.all(effortPromise);
    efforts.forEach(({ effort, id }) => habitMap[id].effort = effort);

    return habitMap;
  }

  private async initialize(): Promise<void> {
    const habitData = await this.getHabitData();
    this.habits.listMap.set(habitData);
    const today = HabitUtils.today();
    this.habits.setSort((habitA, _) => habitA.latestTasks[today] != null ? 1 : 0);

    this.initialized.set(true);
  }
}

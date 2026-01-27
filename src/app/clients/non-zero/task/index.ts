import { computed, inject, Injectable } from '@angular/core';
import { Task } from '@app/entities/non-zero';
import { AuthClient } from '../../auth';
import { GavListCache } from '@lib/helpers';
import { HabitClient } from '../habit';
import { TaskUpdater } from './task-updater';

@Injectable({ providedIn: 'root' })
export class TaskClient {
  private authClient = inject(AuthClient);
  private userId = computed(() => this.authClient.user()?.uid || '');
  private habitClient = inject(HabitClient);

  tasks = new GavListCache<Task>();

  async saveTask(habitId: string, task: Task): Promise<void> {
    const habit = this.habitClient.habits.get(habitId);
    if (!habit) throw Error(`Habit ${habitId} does not exist`);

    const taskUpdater = new TaskUpdater(habit, task, this.userId());
    const updateRequest = taskUpdater
      .updateTaskMemory()
      .updateStreak()
      .appendTask();

    try {
      await updateRequest.batch.commit();
      this.habitClient.habits.put(updateRequest.habit);
      this.tasks.put({ id: `${updateRequest.habit.id}_${updateRequest.taskDate}`, ...task });
    } catch {
      console.error('Something went wrong when patching task for habit ', habitId);
    }
  }
}

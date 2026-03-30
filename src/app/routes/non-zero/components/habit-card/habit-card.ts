import { ChangeDetectionStrategy, Component, computed, effect, inject, input, linkedSignal, output, signal } from '@angular/core';
import { form, FormField, required } from '@angular/forms/signals';
import { Habit, Task } from '@app/entities/non-zero';
import { HabitClient, TaskClient } from '@app/clients/non-zero';
import { GavInput } from '@lib/components';
import { SelectedDayState } from '../../state/selected-day.state';
import { Timestamp } from 'firebase/firestore/lite';
import { HabitCardActions, HabitCardGoal, HabitCardHeader, HabitCardHistory, HabitCardInput } from './components';

interface CardValues {
  effort: number | '';
  context: string;
  goal: boolean;
}

@Component({
  selector: 'habit-card',
  imports: [
    FormField,
    GavInput,
    HabitCardHeader,
    HabitCardGoal,
    HabitCardHistory,
    HabitCardInput,
    HabitCardActions,
],
  templateUrl: './habit-card.html',
  styleUrl: './habit-card.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HabitCard {
  habit = input.required<Habit>();

  editHabit = output();

  private selectedDayState = inject(SelectedDayState);
  private taskClient = inject(TaskClient);
  private habitClient = inject(HabitClient);

  private _cardOpener = effect(() => {
    const selectedTask = this.selectedTask();
    if (selectedTask?.effort == null) {
      this.open.set(true);
    }
  });

  protected selectedTask = computed<Pick<Task, 'message' | 'effort'> | undefined>(() => {
    const habit = this.habit();
    const selectedDay = this.selectedDayState.selectedTimestamp();
    return habit.latestTasks[selectedDay];
  });
  protected open = signal(false);
  protected disableCard = signal(false);
  protected cardValues = linkedSignal<CardValues>(() => {
    const latestTasks = this.habit().latestTasks || {};
    const selectedDay = this.selectedDayState.selectedTimestamp();
    const effort = latestTasks[selectedDay]?.effort ?? '';
    const context = latestTasks[selectedDay]?.message ?? '';

    return { effort, context, goal: false };
  })
  protected cardValuesForm = form(this.cardValues, (schema) => {
    required(schema.effort);
  });

  protected toggleMinimize(): void {
    if (this.selectedTask()?.effort != null) {
      this.open.set(!this.open());
    }
  }

  protected resetForm(): void {
    const { latestTasks } = this.habit();
    const selectedDay = this.selectedDayState.selectedTimestamp();
    const effort = latestTasks[selectedDay]?.effort || '';
    const context = latestTasks[selectedDay]?.message || '';
    this.cardValues.set({ effort, context, goal: false });
  }
  
  protected async patchHabit(): Promise<void> {
    if (this.cardValuesForm().invalid()) return;
    this.disableCard.set(true);

    const { context, effort, goal } = this.cardValues() as { context: string; effort: number; goal: boolean };
    const task = { message: context, effort, date: Timestamp.fromDate(this.selectedDayState.selectedDate()) };
    
    await this.taskClient.saveTask(this.habit().id, task, { completeGoal: goal });
    this.disableCard.set(false);
    this.open.set(false);
  }

  protected deleteHabit(): void {
    const habitId = this.habit().id;
    if (confirm(`You are about to delete habit [${habitId}].\nAre you sure?`)) {
      this.habitClient.deleteHabit(habitId);
    }
  }
}

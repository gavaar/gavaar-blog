import { ChangeDetectionStrategy, Component, computed, effect, inject, input, linkedSignal, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { toSignal } from '@angular/core/rxjs-interop';
import { Habit, HabitUtils, Task } from '@app/entities/non-zero';
import { HabitClient, TaskClient } from '@app/clients/non-zero';
import { GavIcon, GavInput } from '@lib/components';
import { SelectedDayState } from '../../state/selected-day.state';
import { NonZeroDateString } from '@app/entities/non-zero';
import { Timestamp } from 'firebase/firestore/lite';

const getLastWeeks = (): NonZeroDateString[] => {
  const date = new Date();
  const year = date.getFullYear();
  const month = date.getMonth();
  const day = date.getDate();
  const arrayLength = 56;

  return Array(arrayLength).fill(null).map((_, idx) => {
    const targetDate = new Date(year, month, day - (arrayLength - 1) + idx, date.getHours());
    return `${targetDate.getFullYear()}-${targetDate.getMonth()}-${targetDate.getDate()}` as NonZeroDateString;
  });
}

@Component({
  selector: 'habit-card',
  imports: [ReactiveFormsModule, GavIcon, GavInput],
  templateUrl: './habit-card.html',
  styleUrl: './habit-card.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HabitCard {
  habit = input.required<Habit>();
  
  private habitClient = inject(HabitClient);
  private taskClient = inject(TaskClient);
  protected saving = signal(false);
  protected open = linkedSignal(() => {
    const today = HabitUtils.today();
    const habit = this.habit();
    const selectedDate = this.selectedDayService.selectedTimestamp();

    return selectedDate === today && habit.latestTasks[today]?.effort == null;
  });
  protected selectedDayService = inject(SelectedDayState);
  protected lastWeeks = getLastWeeks();
  protected habitForm = new FormGroup({
    message: new FormControl<string|null>(null, Validators.maxLength(140)),
    effort: new FormControl<number|null>(null, [Validators.required, Validators.min(-3), Validators.max(3)]),
  });
  protected habitFormValue = toSignal(this.habitForm.valueChanges);
  protected todaysTask = computed(() => this.habit().latestTasks[this.selectedDayService.today]);
  protected habitIsReset = computed(() => {
    const habit = this.habit();
    const habitValue = this.habitFormValue();
    const selectedTimestamp = this.selectedDayService.selectedTimestamp();
    const todayHabitData = habit.latestTasks?.[selectedTimestamp];

    return todayHabitData?.message == habitValue?.message && todayHabitData?.effort == habitValue?.effort;
  });
  protected newGoalForm = new FormControl('', Validators.required);
  protected _habitUpdateEffect = effect(() => this.resetHabit());

  protected async patchHabit(): Promise<void> {
    if (this.habitForm.invalid) return;

    this.saving.set(true);
    const { message, effort } = this.habitForm.value as { message: string; effort: number };
    const task: Task = { message, effort, date: Timestamp.fromDate(this.selectedDayService.selectedDate()) };

    await this.taskClient.saveTask(this.habit().id, task);
    this.saving.set(false);
  }

  protected resetHabit(): void {
    const habit = this.habit();
    const selectedTimestamp = this.selectedDayService.selectedTimestamp();
    const todayHabitData = habit.latestTasks[selectedTimestamp];

    const { effort, message } = todayHabitData || { effort: null, message: null };
    this.habitForm.patchValue({ message, effort });
  }

  protected async submitNewGoal(): Promise<void> {
    if (this.newGoalForm.invalid) return alert('Goal input is empty');

    if (this.newGoalForm.value && confirm(`You won't be able to edit this goal, and you will only be able to abandon it later.\nProceed?`)) {
      this.saving.set(true);
      await this.habitClient.submitNewGoal(this.habit().id, this.newGoalForm.value!);
      this.saving.set(false);
    }
  }
}

import { ChangeDetectionStrategy, Component, computed, effect, inject, input, linkedSignal, Signal, signal } from '@angular/core';
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
  protected isTodaySelected = computed(() => {
    const selectedDate = this.selectedDayService.selectedTimestamp();
    const today = HabitUtils.today();
    return selectedDate === today;
  });
  protected saving = signal(false);
  protected open = linkedSignal(() => {
    const today = HabitUtils.today();
    const habit = this.habit();
    const todaySelected = this.isTodaySelected();

    return todaySelected && habit.latestTasks[today]?.effort == null;
  });
  protected selectedDayService = inject(SelectedDayState);
  protected lastWeeks = getLastWeeks();
  protected habitForm = new FormGroup({
    message: new FormControl<string|null>(null, Validators.maxLength(140)),
    effort: new FormControl<number|null>(null, [Validators.required, Validators.min(-3), Validators.max(3)]),
  });
  protected habitFormValue = toSignal(this.habitForm.valueChanges);
  protected habitIsReset = computed(() => {
    const habit = this.habit();
    const habitValue = this.habitFormValue();
    const selectedTimestamp = this.selectedDayService.selectedTimestamp();
    const todayHabitData = habit.latestTasks?.[selectedTimestamp];

    return todayHabitData?.message == habitValue?.message && todayHabitData?.effort == habitValue?.effort;
  });
  protected streaks = computed<{ selected?: number; previous?: number }>(() => {
    const habit = this.habit();
    const selectedDate = this.selectedDayService.selectedTimestamp();

    const [y,m,d] = selectedDate.split('-');
    const prevDate = HabitUtils.dateToNonZero(new Date(+y, +m, +d - 1));

    const selected = habit.latestTasks[selectedDate]?.streak;
    const previous = habit.latestTasks[prevDate]?.streak;

    return { selected, previous };
  });
  protected newGoalForm = computed(() => {
    return new FormControl({ value: '', disabled: !this.isTodaySelected() }, Validators.required);
  });

  private _habitUpdateEffect = effect(() => this.resetHabit());

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

  protected toggleOpen(): void {
    if (HabitUtils.today() === this.selectedDayService.selectedTimestamp()) {
      if (this.habitFormValue()?.effort == null) { return; }
    }

    if (this.habitIsReset()) {
      this.open.set(!this.open());
    }
  }

  protected async submitNewGoal(): Promise<void> {
    if (this.newGoalForm().invalid) return alert('Goal input is empty');

    const value = this.newGoalForm().value;
    if (value && confirm(`You won't be able to edit this goal, and you will only be able to abandon it later.\nProceed?`)) {
      this.saving.set(true);
      await this.habitClient.submitNewGoal(this.habit().id, value);
      this.saving.set(false);
    }
  }
}

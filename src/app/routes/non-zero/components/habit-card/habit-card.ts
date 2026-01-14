import { ChangeDetectionStrategy, Component, computed, effect, inject, input, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { toSignal } from '@angular/core/rxjs-interop';
import { Habit, Task } from '@app/entities';
import { NonZeroClient } from '@app/clients/non-zero';
import { GavIcon, GavInput } from '@lib/components';
import { Timestamp } from 'firebase/firestore/lite';
import { SelectedDayState } from '../../state/selected-day.state';
import { HabitUtils, NonZeroDateString } from '@app/entities/non-zero';

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
  
  private nonZeroClient = inject(NonZeroClient);
  protected saving = signal(false);
  protected selectedDayService = inject(SelectedDayState);

  private selectedDateHabitId = computed<`${string}::${NonZeroDateString}`>(() => {
    const habitId = this.habit().id;
    const selectedDate = this.selectedDayService.selectedDate();
    return HabitUtils.buildTaskId(habitId, selectedDate);
  });

  protected lastWeeks = getLastWeeks();
  protected habitForm = new FormGroup({
    message: new FormControl('', Validators.maxLength(140)),
    effort: new FormControl(0, [Validators.min(-3), Validators.max(3)]),
  });
  protected habitFormValue = toSignal(this.habitForm.valueChanges);
  protected habitIsReset = computed(() => {
    const habit = this.habit();
    const habitValue = this.habitFormValue();
    const selectedTimestamp = this.selectedDayService.selectedTimestamp();
    const todayHabitData = habit.lastWeeks?.[selectedTimestamp];

    return todayHabitData?.message == habitValue?.message && todayHabitData?.done == habitValue?.effort;
  });
  protected newGoalForm = new FormControl('', Validators.required);

  protected _habitUpdateEffect = effect(() => {
    this.resetHabit()
  });

  protected patchHabit(): void {
    this.saving.set(true);
    const { message, effort } = this.habitForm.value as { message: string; effort: number };

    const task: Task = {
      habitId: this.habit().id,
      message,
      id: this.selectedDateHabitId(),
      date: Timestamp.fromDate(this.selectedDayService.selectedDate()),
      done: effort,
    };

    this.nonZeroClient
      .postTask(task)
      .subscribe(() => this.saving.set(false));
  }

  protected resetHabit(): void {
    const habit = this.habit();
    const selectedTimestamp = this.selectedDayService.selectedTimestamp();

    const todayHabitData = habit.lastWeeks?.[selectedTimestamp];
    const { done, message } = todayHabitData || { done: null, message: null };
    this.habitForm.patchValue({ message, effort: done });
  }

  protected submitNewGoal(): void {
    if (this.newGoalForm.invalid) return alert('Goal input is empty');

    if (this.newGoalForm.value && confirm(`You won't be able to edit this goal, and you will only be able to abandon it later. Proceed?`)) {
      this.saving.set(true);

      this.nonZeroClient
        .submitNewGoal(this.habit().id, this.newGoalForm.value!)
        .subscribe({ next: () => this.saving.set(false) });
    }
  }
}

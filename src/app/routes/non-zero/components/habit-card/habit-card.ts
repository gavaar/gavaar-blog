import { ChangeDetectionStrategy, Component, computed, effect, inject, input, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { toSignal } from '@angular/core/rxjs-interop';
import { Habit, HabitDay } from '@app/entities';
import { NonZeroClient } from '@app/clients/non-zero';
import { GavIcon, GavInput } from '@lib/components';
import { Timestamp } from 'firebase/firestore/lite';
import { SelectedDayState } from '../../state/selected-day.state';
import { NonZeroDateString } from '@app/entities/non-zero';

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
  
  private NonZeroClient = inject(NonZeroClient);
  protected saving = signal(false);
  protected selectedDayService = inject(SelectedDayState);

  private todayHabitId = computed<`${string}::${number}-${number}-${number}`>(() => {
    const habitId = this.habit().id;
    const selectedTimestamp = this.selectedDayService.selectedTimestamp();
    return `${habitId}::${selectedTimestamp}`;
  });

  protected lastWeeks = getLastWeeks();
  protected habitForm = new FormGroup({
    message: new FormControl(''),
    weightedDone: new FormControl(0, [Validators.min(-3), Validators.max(3)]),
  });
  protected habitFormValue = toSignal(this.habitForm.valueChanges);
  protected habitIsReset = computed(() => {
    const habit = this.habit();
    const habitValue = this.habitFormValue();
    const selectedTimestamp = this.selectedDayService.selectedTimestamp();
    const todayHabitData = habit.lastWeeks?.[selectedTimestamp];

    return todayHabitData?.message == habitValue?.message && todayHabitData?.done == habitValue?.weightedDone;
  });

  protected _habitUpdateEffect = effect(() => {
    this.resetHabit()
  });

  protected patchHabit(): void {
    this.saving.set(true);
    const { message, weightedDone } = this.habitForm.value as { message: string; weightedDone: number };

    const task: HabitDay = {
      habitId: this.habit().id,
      message,
      id: this.todayHabitId(),
      date: Timestamp.fromDate(this.selectedDayService.selectedDate()),
      done: weightedDone,
    };

    this.NonZeroClient
      .postTask(task)
      .subscribe(() => this.saving.set(false));
  }

  protected resetHabit(): void {
    const habit = this.habit();
    const selectedTimestamp = this.selectedDayService.selectedTimestamp();

    const todayHabitData = habit.lastWeeks?.[selectedTimestamp];
    const { done, message } = todayHabitData || { done: null, message: null };
    this.habitForm.patchValue({ message, weightedDone: done });
  }
}

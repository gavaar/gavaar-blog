import { ChangeDetectionStrategy, Component, computed, effect, inject, input, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { toSignal } from '@angular/core/rxjs-interop';
import { Habit, HabitDay } from '@app/entities';
import { NonZeroTrackerClient } from '@app/services/non-zero-tracker';
import { GavIcon, GavInput } from '@lib/components';
import { Timestamp } from 'firebase/firestore/lite';
import { SelectedDayService } from '../../services/selected-day.service';

const getLastWeeks = (): `${number}-${number}-${number}`[] => {
  const date = new Date();
  const year = date.getFullYear();
  const month = date.getMonth();
  const day = date.getDate();
  const arrayLength = 56;

  return Array(arrayLength).fill(null).map((_, idx) => {
    const targetDate = new Date(year, month, day - (arrayLength - 1) + idx, date.getHours());
    return `${targetDate.getFullYear()}-${targetDate.getMonth()}-${targetDate.getDate()}` as `${number}-${number}-${number}`;
  });
}

@Component({
  selector: 'task-card',
  imports: [ReactiveFormsModule, GavIcon, GavInput],
  templateUrl: './task-card.html',
  styleUrl: './task-card.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TaskCard {
  habit = input.required<Habit>();
  
  private nonZeroTrackerClient = inject(NonZeroTrackerClient);
  protected saving = signal(false);
  protected selectedDayService = inject(SelectedDayService);

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

    this.nonZeroTrackerClient
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

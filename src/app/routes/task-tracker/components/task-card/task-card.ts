import { ChangeDetectionStrategy, Component, computed, effect, inject, input } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Habit, HabitDay } from '@app/entities';
import { NonZeroTrackerClient } from '@app/services/non-zero-tracker';
import { GavIcon } from '@lib/icon';
import { Timestamp } from 'firebase/firestore/lite';

const HOUR_OFFSET = 8;

@Component({
  selector: 'task-card',
  imports: [ReactiveFormsModule, GavIcon],
  templateUrl: './task-card.html',
  styleUrl: './task-card.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TaskCard {
  habit = input.required<Habit>();

  private nonZeroTrackerClient = inject(NonZeroTrackerClient);
  private timestampDate: Date = this.getTimestamptDate();
  private timestampString: `${number}-${number}-${number}` = `${this.timestampDate.getFullYear()}-${this.timestampDate.getMonth()}-${this.timestampDate.getDate()}`;
  private todayHabitId = computed<`${string}::${number}-${number}-${number}`>(() => {
    const habitId = this.habit().id;
    return `${habitId}::${this.timestampString}`;
  });

  protected lastWeeks = this.getLastWeeks();
  protected habitForm = new FormGroup({
    message: new FormControl(''),
    weightedDone: new FormControl(0, [Validators.min(-3), Validators.max(3)]),
  });
  protected _habitUpdateEffect = effect(() => {
    const habit = this.habit();
    const todayHabitData = habit.lastWeeks?.[this.timestampString];
    if (todayHabitData) {
      const { done, message } = todayHabitData;
      this.habitForm.patchValue({ message, weightedDone: done })
    }
  });

  protected patchHabit(): void {
    const { message, weightedDone } = this.habitForm.value as { message: string; weightedDone: number };

    const habit: HabitDay = {
      habitId: this.habit().id, 
      message,
      id: this.todayHabitId(),
      date: Timestamp.fromDate(this.timestampDate),
      done: weightedDone,
    };

    this.nonZeroTrackerClient.addHabitEntry(habit).subscribe();
  }

  private getLastWeeks(): `${number}-${number}-${number}`[] {
    const date = new Date();
    const year = date.getFullYear();
    const month = date.getMonth();
    const day = date.getDate();
    const arrayLength = 56;

    return Array(arrayLength).fill(null).map((_, idx) => {
      const targetDate = new Date(year, month, day - (arrayLength - 1) + idx, date.getHours() - HOUR_OFFSET);
      return `${targetDate.getFullYear()}-${targetDate.getMonth()}-${targetDate.getDate()}` as `${number}-${number}-${number}`;
    });
  }

  private getTimestamptDate(): Date {
    const date = new Date();
    return new Date(date.getFullYear(), date.getMonth(), date.getDate(), date.getHours() - HOUR_OFFSET);;
  }
}

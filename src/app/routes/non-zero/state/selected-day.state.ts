import { computed, Injectable, signal } from '@angular/core';
import { HabitUtils, NonZeroDateString } from '@app/entities/non-zero';

@Injectable()
export class SelectedDayState {
  today = HabitUtils.today();
  yesterday = HabitUtils.yesterday();
  selectedDate = signal(HabitUtils.dateWithOffset());
  selectedTimestamp = computed<NonZeroDateString>(() => {
    const date = this.selectedDate();
    return HabitUtils.dateToNonZero(date);
  });

  setToday(): void {
    this.selectedDate.set(HabitUtils.dateWithOffset());
  }

  moveSelectedDate(offset: number): void {
    const selectedDate = this.selectedDate();
    const newDate = new Date(
      selectedDate.getFullYear(),
      selectedDate.getMonth(),
      selectedDate.getDate() + offset
    );

    this.selectedDate.set(newDate);
  }
}

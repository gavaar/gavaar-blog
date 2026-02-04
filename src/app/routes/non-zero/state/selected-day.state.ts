import { computed, Injectable, signal } from '@angular/core';
import { HabitUtils, NonZeroDateString } from '@app/entities/non-zero';

@Injectable()
export class SelectedDayState {
  today = HabitUtils.today();
  selectedDate = signal(new Date());
  selectedTimestamp = computed<NonZeroDateString>(() => {
    const date = this.selectedDate();
    return HabitUtils.dateToNonZero(date);
  });

  setToday(): void {
    this.selectedDate.set(new Date());
  }

  updateDate(daysDiff: number): void {
    const selectedDate = this.selectedDate();
    const newDate = new Date(
      selectedDate.getFullYear(),
      selectedDate.getMonth(),
      selectedDate.getDate() + daysDiff
    );

    this.selectedDate.set(newDate);
  }
}

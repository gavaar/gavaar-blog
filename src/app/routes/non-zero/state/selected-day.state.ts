import { computed, Injectable, signal } from '@angular/core';
import { NonZeroDateString } from '@app/entities/non-zero';

const extractTimestampStringFromDate = (date: Date): NonZeroDateString => {
  return `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
};

@Injectable()
export class SelectedDayState {
  selectedDate = signal(new Date());
  lastDayTimestamp = extractTimestampStringFromDate(new Date());
  selectedTimestamp = computed<NonZeroDateString>(() => {
    const date = this.selectedDate();
    return extractTimestampStringFromDate(date);
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

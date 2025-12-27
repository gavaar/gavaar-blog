import { computed, Injectable, signal } from '@angular/core';

const extractTimestampStringFromDate = (date: Date): `${number}-${number}-${number}` => {
  return `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
};

@Injectable()
export class SelectedDayService {
  selectedDate = signal(new Date());
  lastDayTimestamp = extractTimestampStringFromDate(new Date());
  selectedTimestamp = computed<`${number}-${number}-${number}`>(() => {
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

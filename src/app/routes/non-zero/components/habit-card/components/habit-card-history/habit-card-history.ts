import { NgTemplateOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';
import { Habit, HabitUtils, NonZeroDateString } from '@app/entities/non-zero';
import { SelectedDayState } from '@app/routes/non-zero/state/selected-day.state';

@Component({
    selector: 'habit-card-history',
    templateUrl: './habit-card-history.html',
    styleUrl: './habit-card-history.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [NgTemplateOutlet],
})
export class HabitCardHistory {
    open = input.required<boolean>();
    latestTasks = input.required<Habit['latestTasks']>();

    protected selectedDay = inject(SelectedDayState);
    protected lastWeeks = this.getLastWeeks();

    private getLastWeeks(): [NonZeroDateString[], NonZeroDateString[]] {
        const today = HabitUtils.dateWithOffset();
        const year = today.getFullYear();
        const month = today.getMonth();
        const day = today.getDate();
        const arrayLength = 56;

        const oldWeeks: NonZeroDateString[] = [];
        const last2Weeks: NonZeroDateString[] = [];
      
        Array(arrayLength).fill(null).forEach((_, idx) => {
          const targetDate = new Date(year, month, day - (arrayLength - 1) + idx);
          const nonZeroDate = `${targetDate.getFullYear()}-${targetDate.getMonth()}-${targetDate.getDate()}` as NonZeroDateString;

          if (idx < 42) {
            oldWeeks.push(nonZeroDate);
          } else {
            last2Weeks.push(nonZeroDate);
          }
        });

        return [oldWeeks, last2Weeks];
    }
}

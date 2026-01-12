import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { NonZeroClient } from '@app/clients/non-zero';
import { DayTracker, HabitCard, HabitEditCard } from './components';
import { SelectedDayState } from './state/selected-day.state';
import { GavIcon } from "@lib/components";

@Component({
  selector: 'non-zero',
  templateUrl: './non-zero.html',
  styleUrl: './non-zero.scss',
  imports: [HabitCard, DayTracker, HabitEditCard, GavIcon],
  providers: [SelectedDayState],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NonZero {
  private nonZeroTracker = inject(NonZeroClient);
  protected selectedDayService = inject(SelectedDayState);
  protected taskList = this.nonZeroTracker.habits;
  protected editingIds: { [key: string]: boolean } = {};

  protected deleteHabit(habitId: string): void {
    if (confirm(`You are about to delete habit [${habitId}].\nAre you sure?`)) {
      this.nonZeroTracker.deleteHabit(habitId).subscribe();
    }
  }
}

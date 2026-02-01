import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { HabitClient } from '@app/clients/non-zero/habit';
import { DayTracker, HabitCard, HabitEditCard } from './components';
import { SelectedDayState } from './state/selected-day.state';
import { GavIcon } from "@lib/components";
import { GavLoading } from "@app/components";

@Component({
  selector: 'non-zero',
  templateUrl: './non-zero.html',
  styleUrl: './non-zero.scss',
  imports: [HabitCard, DayTracker, HabitEditCard, GavIcon, GavLoading],
  providers: [SelectedDayState],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NonZero {
  private habitClient = inject(HabitClient);
  protected loading = computed(() => !this.habitClient.initialized());
  protected selectedDayService = inject(SelectedDayState);
  protected habits = this.habitClient.habits.list;
  protected editing: { [habitId: string]: boolean } = {};

  protected deleteHabit(habitId: string): void {
    if (confirm(`You are about to delete habit [${habitId}].\nAre you sure?`)) {
      this.habitClient.deleteHabit(habitId);
    }
  }
}

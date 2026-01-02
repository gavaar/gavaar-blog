import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { NonZeroTrackerClient } from '@app/services/non-zero-tracker';
import { DayTracker, TaskCard, NewTaskCard } from './components';
import { SelectedDayService } from './services/selected-day.service';
import { GavIcon } from "@lib/icon";

@Component({
  selector: 'task-tracker',
  templateUrl: './task-tracker.html',
  styleUrl: './task-tracker.scss',
  imports: [TaskCard, DayTracker, NewTaskCard, GavIcon],
  providers: [SelectedDayService],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TaskTracker {
  private nonZeroTracker = inject(NonZeroTrackerClient);
  protected selectedDayService = inject(SelectedDayService);
  protected taskList = this.nonZeroTracker.habits;
  protected editingIds: { [key: string]: boolean } = {};

  protected deleteHabit(habitId: string): void {
    if (confirm('sure?')) {
      this.nonZeroTracker.deleteHabit(habitId).subscribe();
    }
  }
}

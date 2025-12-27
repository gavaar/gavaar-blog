import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { GavIcon } from "@lib/icon";
import { SelectedDayService } from '../../services/selected-day.service';

@Component({
  selector: 'day-tracker',
  templateUrl: 'day-tracker.html',
  styleUrl: 'day-tracker.scss',
  imports: [GavIcon],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DayTracker {
  protected selectedDayService = inject(SelectedDayService);

  protected presentationDate = computed<string>(() => {
    const [y, m, d] = this.selectedDayService.selectedTimestamp().split('-');
    return `${d} - ${+m + 1} - ${y}`;
  });
}

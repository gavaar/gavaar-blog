import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { GavIcon } from "@lib/components";
import { SelectedDayState } from '../../state/selected-day.state';

const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Spet','Oct','Nov','Dec'];

@Component({
  selector: 'day-tracker',
  templateUrl: 'day-tracker.html',
  styleUrl: 'day-tracker.scss',
  imports: [GavIcon],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DayTracker {
  protected selectedDayService = inject(SelectedDayState);

  protected presentationDate = computed<string>(() => {
    const [y, m, d] = this.selectedDayService.selectedTimestamp().split('-');
    return `${d} - ${MONTHS[+m]} - ${y}`;
  });
}

import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { GavIcon } from '@lib/components';

@Component({
  selector: 'habit-card-header',
  templateUrl: './habit-card-header.html',
  styleUrl: './/habit-card-header.scss',
  imports: [
    GavIcon,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HabitCardHeader {
  icon = input.required<string>();
  title = input.required<string>();
  id = input.required<string>();
  description = input<string>();
  open = input.required<boolean>();
  showCaret = input<boolean>();
}

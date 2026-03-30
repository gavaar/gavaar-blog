import { ChangeDetectionStrategy, Component, output } from '@angular/core';
import { GavIcon } from '@lib/components';

@Component({
  imports: [ GavIcon ],
  selector: 'habit-card-actions',
  templateUrl: './habit-card-actions.html',
  styleUrl: './habit-card-actions.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HabitCardActions {
  onReset = output();
  onEdit = output();
  onDelete = output();
  onSave = output();
}

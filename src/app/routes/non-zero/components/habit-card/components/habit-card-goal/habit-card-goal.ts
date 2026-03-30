import { ChangeDetectionStrategy, Component, input, model } from '@angular/core';
import { FormValueControl } from '@angular/forms/signals';
import { GavIcon } from '@lib/components';

@Component({
  selector: 'habit-card-goal',
  imports: [
    GavIcon,
  ],
  templateUrl: './habit-card-goal.html',
  styleUrl: './habit-card-goal.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HabitCardGoal implements FormValueControl<boolean> {
  value = model<boolean>(false);
  goal = input<string>();
  open = input.required<boolean>();
}

import { ChangeDetectionStrategy, Component, model } from '@angular/core';
import { GavInput } from "@lib/components";
import { form, FormField, FormValueControl } from "@angular/forms/signals";

@Component({
  selector: 'habit-card-input',
  templateUrl: './habit-card-input.html',
  styleUrl: './habit-card-input.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [GavInput, FormField],
})
export class HabitCardInput implements FormValueControl<string> {
  value = model<string>('');
  protected contextForm = form(this.value);
}

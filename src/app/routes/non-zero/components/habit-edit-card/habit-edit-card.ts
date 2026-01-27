import { ChangeDetectionStrategy, Component, computed, inject, input, output, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Habit } from '@app/entities/non-zero';
import { HabitClient } from '@app/clients/non-zero/habit';
import { GavInput, GavIcon, Icon } from "@lib/components";

@Component({
  selector: 'habit-edit-card',
  templateUrl: './habit-edit-card.html',
  styleUrl: './habit-edit-card.scss',
  imports: [ReactiveFormsModule, GavIcon, GavInput],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HabitEditCard {
  habitId = input<string | undefined>();
  cancel = output();

  private habitClient = inject(HabitClient);
  protected allIcons = Object.entries(Icon).map(([_key, value]) => ({ key: value, value }));

  private habit = computed(() => this.habitClient.habits.get(this.habitId()));
  protected saving = signal(false);
  protected habitForm = computed(() => {
    const habitId = this.habitId();
    const habit = this.habit();

    return new FormGroup({
      id: new FormControl({ value: habitId ?? '', disabled: habitId != null }, Validators.required),
      title: new FormControl(habit?.title, Validators.required),
      icon: new FormControl(habit?.icon, Validators.required),
      description: new FormControl(habit?.description),
    });
  });

  protected patchHabit(): void {
    const habitForm = this.habitForm();

    if (habitForm.invalid) {
      return alert('Invalid habit');
    }

    const updatedHabit = {
      streak: 0,
      latestTasks: {},
      ...(this.habit() || {}),
      ...habitForm.getRawValue()
    } as Habit;

    this.habitClient.saveHabit(updatedHabit).then(() => {
      this.saving.set(false);
      this.cancel.emit();
    });
  }
}

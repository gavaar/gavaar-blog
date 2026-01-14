import { ChangeDetectionStrategy, Component, computed, inject, input, output, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HabitConfig } from '@app/entities';
import { NonZeroClient } from '@app/clients/non-zero';
import { GavInput, GavIcon, Icon } from "@lib/components";

@Component({
  selector: 'habit-edit-card',
  templateUrl: './habit-edit-card.html',
  styleUrl: './habit-edit-card.scss',
  imports: [ReactiveFormsModule, GavIcon, GavInput],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HabitEditCard {
  taskId = input<string | undefined>();
  cancel = output();

  private NonZeroClient = inject(NonZeroClient);
  protected allIcons = Object.entries(Icon).map(([_key, value]) => ({ key: value, value }));

  protected saving = signal(false);
  protected taskForm = computed(() => {
    const taskId = this.taskId();
    const task = this.NonZeroClient.habitConfigCache.get(taskId);

    return new FormGroup({
      id: new FormControl({ value: task?.id ?? '', disabled: this.taskId() != null }, Validators.required),
      title: new FormControl(task?.title, Validators.required),
      icon: new FormControl(task?.icon, Validators.required),
      description: new FormControl(task?.description),
    });
  });

  protected patchHabit(): void {
    const taskForm = this.taskForm();

    if (taskForm.invalid) {
      return alert('Invalid new task');
    }

    this.cancel.emit()
    this.NonZeroClient
      .saveHabit(taskForm.getRawValue() as HabitConfig)
      .subscribe();
  }
}

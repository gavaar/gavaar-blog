import { ChangeDetectionStrategy, Component, computed, inject, input, output } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HabitConfig } from '@app/entities';
import { NonZeroTrackerClient } from '@app/services/non-zero-tracker';
import { GavInput, GavIcon, Icon } from "@lib/components";

@Component({
  selector: 'new-task-card',
  templateUrl: './new-task-card.html',
  styleUrl: './new-task-card.scss',
  imports: [ReactiveFormsModule, GavIcon, GavInput],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NewTaskCard {
  taskId = input<string | undefined>();
  cancel = output();

  private nonZeroTrackerClient = inject(NonZeroTrackerClient);
  protected allIcons = Object.entries(Icon).map(([_key, value]) => ({ key: value, value }));

  taskForm = computed(() => {
    const taskId = this.taskId();
    const task = this.nonZeroTrackerClient.habitConfigCache.get(taskId);

    return new FormGroup({
      id: new FormControl({ value: task?.id ?? '', disabled: this.taskId() != null }, Validators.required),
      title: new FormControl(task?.title, Validators.required),
      icon: new FormControl(task?.icon, Validators.required),
      description: new FormControl(task?.description),
    });
  });

  protected submitNewTask(): void {
    const taskForm = this.taskForm();

    if (taskForm.invalid) {
      return alert('Invalid new task');
    }

    this.nonZeroTrackerClient
      .saveHabit(taskForm.getRawValue() as HabitConfig)
      .subscribe(() => taskForm.reset());
  }
}

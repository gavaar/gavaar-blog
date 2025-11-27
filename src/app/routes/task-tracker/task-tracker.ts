import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HabitConfig } from '@app/entities';
import { NonZeroTrackerClient } from '@app/services/non-zero-tracker';
import { TaskCard } from './components';

@Component({
  selector: 'task-tracker',
  templateUrl: './task-tracker.html',
  styleUrl: './task-tracker.scss',
  imports: [ReactiveFormsModule, TaskCard],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TaskTracker {
  private nonZeroTrackerClient = inject(NonZeroTrackerClient);

  protected newTaskForm = new FormGroup({
    id: new FormControl<string>('', { validators: Validators.required, nonNullable: true }),
    title: new FormControl<string>('', { validators: Validators.required, nonNullable: true }),
    icon: new FormControl<string>('', { validators: Validators.required, nonNullable: true }),
    description: new FormControl<string|null>(null),
  });
  protected taskList = this.nonZeroTrackerClient.habits;

  protected submitNewTask(): void {
    if (this.newTaskForm.invalid) {
      return alert('Invalid new task');
    }

    this.nonZeroTrackerClient
      .saveHabit(this.newTaskForm.value as HabitConfig)
      .subscribe(() => this.newTaskForm.reset());
  }
}

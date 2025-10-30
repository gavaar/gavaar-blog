import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NonZeroHabit } from '@app/entities';
import { NonZeroTrackerClient } from '@app/services/non-zero-tracker';

@Component({
  selector: 'task-tracker',
  templateUrl: './task-tracker.html',
  styleUrl: './task-tracker.scss',
  imports: [ReactiveFormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TaskTracker {
  private nonZeroTracker = inject(NonZeroTrackerClient);

  protected newTaskForm = new FormGroup({
    id: new FormControl<string>('', { validators: Validators.required, nonNullable: true }),
    title: new FormControl<string>('', { validators: Validators.required, nonNullable: true }),
    icon: new FormControl<string>('', { validators: Validators.required, nonNullable: true }),
    description: new FormControl<string|null>(null),
  });

  protected submitNewTask(): void {
    if (this.newTaskForm.invalid) {
      return alert('Invalid new task');
    }

    this.nonZeroTracker
      .saveHabit(this.newTaskForm.value as NonZeroHabit)
      .subscribe(_habit => this.newTaskForm.reset());
  }
}

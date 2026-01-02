import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { HabitConfig } from '@app/entities';
import { NonZeroTrackerClient } from '@app/services/non-zero-tracker';
import { GavIcon } from "@lib/icon";
import { GavInput } from '@lib/input';

@Component({
  selector: 'new-task-card',
  templateUrl: './new-task-card.html',
  styleUrl: './new-task-card.scss',
  imports: [ReactiveFormsModule, GavIcon, GavInput],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NewTaskCard {
  private nonZeroTrackerClient = inject(NonZeroTrackerClient);

  newTaskForm = new FormGroup({
    id: new FormControl(''),
    title: new FormControl(''),
    icon: new FormControl(''),
    description: new FormControl(''),
  });

  protected submitNewTask(): void {
    if (this.newTaskForm.invalid) {
      return alert('Invalid new task');
    }

    this.nonZeroTrackerClient
      .saveHabit(this.newTaskForm.value as HabitConfig)
      .subscribe(() => this.newTaskForm.reset());
  }
}

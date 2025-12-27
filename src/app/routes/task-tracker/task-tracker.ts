import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HabitConfig } from '@app/entities';
import { NonZeroTrackerClient } from '@app/services/non-zero-tracker';
import { DayTracker, TaskCard } from './components';
import { GavInput } from "@lib/input";
import { SelectedDayService } from './services/selected-day.service';

const extractTimestampStringFromDate = (date: Date): `${number}-${number}-${number}` => {
  return `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
};

@Component({
  selector: 'task-tracker',
  templateUrl: './task-tracker.html',
  styleUrl: './task-tracker.scss',
  imports: [ReactiveFormsModule, TaskCard, GavInput, DayTracker],
  providers: [SelectedDayService],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TaskTracker {
  private nonZeroTrackerClient = inject(NonZeroTrackerClient);
  protected selectedDayService = inject(SelectedDayService);

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

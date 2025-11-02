import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HabitConfig, HabitDay } from '@app/entities';
import { NonZeroTrackerClient } from '@app/services/non-zero-tracker';
import { GavIcon } from "@lib/icon";
import { Timestamp } from 'firebase/firestore/lite';

@Component({
  selector: 'task-tracker',
  templateUrl: './task-tracker.html',
  styleUrl: './task-tracker.scss',
  imports: [ReactiveFormsModule, GavIcon],
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
  protected lastWeeks = this.getLastWeeks();

  protected submitNewTask(): void {
    if (this.newTaskForm.invalid) {
      return alert('Invalid new task');
    }

    this.nonZeroTrackerClient
      .saveHabit(this.newTaskForm.value as HabitConfig)
      .subscribe(() => this.newTaskForm.reset());
  }

  protected patchHabit(habitId: string, message: string, value: number) {
    const date = new Date();
    const timestampDate = new Date(date.getFullYear(), date.getMonth(), date.getDate(), date.getHours() - 8);
    const habit: HabitDay = {
      habitId, 
      message,
      id: `${habitId}::${timestampDate.getFullYear()}-${timestampDate.getMonth()}-${timestampDate.getDate()}`,
      date: Timestamp.fromDate(timestampDate),
      done: value,
    };

    this.nonZeroTrackerClient.addHabitEntry(habit).subscribe();
  }

  private getLastWeeks(): `${number}-${number}-${number}`[] {
    const date = new Date();
    const year = date.getFullYear();
    const month = date.getMonth();
    const day = date.getDate();
    const arrayLength = 56;

    return Array(arrayLength).fill(null).map((_, idx) => {
      const targetDate = new Date(year, month, day - (arrayLength - 1) + idx)
      return `${targetDate.getFullYear()}-${targetDate.getMonth()}-${targetDate.getDate()}` as `${number}-${number}-${number}`;
    });
  }
}

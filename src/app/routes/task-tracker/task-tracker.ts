import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'task-tracker',
  templateUrl: './task-tracker.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TaskTracker {}

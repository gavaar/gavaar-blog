import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  standalone: true,
  selector: 'task-tracker',
  templateUrl: './task-tracker.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TaskTracker {}

import { ChangeDetectionStrategy, Component, effect, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthClient } from '@app/services/auth-client';

@Component({
  selector: 'task-tracker',
  templateUrl: './task-tracker.html',
  styleUrl: './task-tracker.scss',
  imports: [ReactiveFormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TaskTracker {
  private router = inject(Router);
  private auth = inject(AuthClient);

  protected newTaskForm = new FormGroup({
    id: new FormControl('', Validators.required),
    title: new FormControl('', Validators.required),
    description: new FormControl(''),
    icon: new FormControl('', Validators.required),
  });

  private _authRedirect = effect(() => {
    const user = this.auth.user();  
    if (!user) this.router.navigateByUrl('acc', { state: { redirect: 'task-tracker' } });
  });

  protected submitNewTask(): void {
    if (this.newTaskForm.invalid) {
      alert('Invalid new task');
    }

    console.log('Add task here');
  }
}

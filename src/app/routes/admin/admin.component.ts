import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { JsonPipe } from '@angular/common';
import { AuthService } from '@app/services/auth.service';

@Component({
  standalone: true,
  imports: [JsonPipe],
  selector: 'admin',
  template: `
    <p>User: {{ authService.user() | json }}</p>
    <button (click)="authService.login()">Login</button>
    <button (click)="authService.logout()">Logout</button>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminComponent {
  authService = inject(AuthService);
}

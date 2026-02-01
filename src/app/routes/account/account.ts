import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { AuthClient } from '@app/clients/auth';

@Component({
  selector: 'account',
  template: `
    @if (authService.user()) {
      <p>Logged in as: {{ authService.user()?.displayName }}</p>
      <button (click)="authService.logout()">Logout</button>
    } @else {
      <button (click)="authService.login()">Login</button>
    }
  `,
  styles: [`
    :host {
      display: flex;
      flex-flow: column;
      align-items: center;
      row-gap: 0.5rem;
    }  
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Account {
  protected authService = inject(AuthClient);
}

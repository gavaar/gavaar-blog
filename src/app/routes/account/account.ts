import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { AuthClient } from '@app/services/auth-client';

@Component({
  selector: 'account',
  template: `
    @if (authService.user()) {
      <p>Logged in as: {{ authService.user()?.displayName }}</p>
      <button (click)="authService.logout()">Logout</button>
    } @else {
      <p>You can log in (although it will do nothing for now)</p>
      <button (click)="authService.login()">Login</button>
    }
    <small>Account login does nothing.. but eventually it will be used for some tooling I'm attempting to make.. so.. Coming soon (?)</small>
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
  authService = inject(AuthClient);
}

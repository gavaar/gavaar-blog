import { ChangeDetectionStrategy, Component, effect, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthClient } from '@app/services/auth-client';

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
  authService = inject(AuthClient);
  private router = inject(Router);

  private _redirectCallback = effect(() => {
    const user = this.authService.user();
    const redirect = history.state.redirect;

    if (user && redirect) {
      this.router.navigateByUrl(redirect);
    }
  });
}

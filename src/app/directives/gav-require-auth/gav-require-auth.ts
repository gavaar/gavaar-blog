import { ChangeDetectionStrategy, Component, Directive, effect, inject, TemplateRef, ViewContainerRef } from '@angular/core';
import { AuthClient } from '@app/clients/auth';

@Component({
  template: `
    <div class="loading-view">
      <p>You need to login to see this page:</p>
      <button (click)="authClient.login()">Login</button>
    </div>
  `,
  styles: [`
    .loading-view {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GavRequireAuthRedirect {
  protected authClient = inject(AuthClient);
}

@Directive({
  selector: '[gav-require-auth]',
})
export class GavRequireAuth {
  private authClient = inject(AuthClient);
  private vcr = inject(ViewContainerRef);
  private templateRef = inject(TemplateRef);
  private _render = effect(() => {
    const user = this.authClient.user();
    this.vcr.clear();

    if (user) {
      this.vcr.createEmbeddedView(this.templateRef);
      return;
    }

    if (this.authClient.notAuthenticated()) {
      this.vcr.createComponent(GavRequireAuthRedirect);
    }
  });
}

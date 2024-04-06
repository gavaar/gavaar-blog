import { ChangeDetectionStrategy, Component, Signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivationEnd, Router, RouterLink } from '@angular/router';
import { GavEgoHeader } from '../../../lib/ego-header/ego-header.component';
import { GavIconComponent } from '../../../lib/icon';
import { filter, map } from 'rxjs';

@Component({
  imports: [
    GavEgoHeader,
    GavIconComponent,
    RouterLink,
  ],
  selector: 'gav-header',
  standalone: true,
  template: `
    <gav-ego-header
      profileImgUrl="assets/images/me_emosido_enganado.jpg"
      [backgroundImgUrl]="'assets/images/' + bgImg()">
      <nav style="cursor: pointer" class="gav-ego-header__left header__theme-toggle" routerLink="cl">(clickMe)</nav>
      <!-- left and right content of the header -->
      <div class="gav-ego-header__right">
        <span class="header__theme-toggle">
          <gav-icon class="header__icon" [icon]="darkTheme ? 'moon' : 'sun'" (click)="toggleTheme()" />
          <small class="header__theme-text">{{ darkTheme ? 'Dark' : 'Psychopath' }}</small>
        </span>
      </div>
    </gav-ego-header>
  `,
  styleUrl: 'header.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent {
  darkTheme = true;
  bgImg: Signal<string>;

  constructor(router: Router) {
    this.bgImg = toSignal(router.events.pipe(
      filter((r: any) => r instanceof ActivationEnd),
      map((r: ActivationEnd) => r.snapshot.data['bgImg']),
    ));
  }

  toggleTheme(): void {
    this.darkTheme = !this.darkTheme;
    document.body.setAttribute('class', this.darkTheme ? '' : 'light');
  }
}

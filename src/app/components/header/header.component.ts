import { ChangeDetectionStrategy, Component, Signal, computed, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRouteSnapshot, ActivationEnd, Data, Router, RouterLink } from '@angular/router';
import { GavEgoHeader } from '../../../lib/ego-header/ego-header.component';
import { GavIconComponent } from '../../../lib/icon';
import { filter, map, tap, throttleTime } from 'rxjs';

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
      [profileImgUrl]="'assets/images/' + portraitImg()"
      [backgroundImgUrl]="'assets/images/' + bgImg()">
      <nav style="cursor: pointer" class="gav-ego-header__left header__theme-toggle">
        <a [routerLink]="parentUrl().parentLink">{{ parentUrl().currentMessage }}</a>
      </nav>
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
  bgImg = computed(() => this.routerData()?.data['bgImg'] || 'default_background.png');
  portraitImg = computed(() => this.routerData()?.data['portraitImg'] || 'loading/rolling.gif');
  parentUrl = signal({ parentLink: 'cl', currentMessage: '(changelog)' });

  private routerData: Signal<ActivatedRouteSnapshot | undefined> = toSignal(this.router.events.pipe(
    filter((r: any) => r instanceof ActivationEnd),
    throttleTime(50),
    map((r: ActivationEnd) => r.snapshot),
    tap(() => {
      const routes = this.router.url.split('/');
      const currentRoute = routes?.at(-1) || '';

      this.parentUrl.set({
        parentLink: currentRoute === '' ? 'cl' : routes.at(-2)!,
        currentMessage: currentRoute === '' ? '(changelog)' : '< Back',
      });
    }),
  ));

  constructor(private router: Router) {}

  toggleTheme(): void {
    this.darkTheme = !this.darkTheme;
    document.body.setAttribute('class', this.darkTheme ? '' : 'light');
  }
}

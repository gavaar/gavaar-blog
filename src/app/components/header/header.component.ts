import { ChangeDetectionStrategy, Component, Signal, computed, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRouteSnapshot, ActivationEnd, Router, RouterLink } from '@angular/router';
import { filter, map, tap, throttleTime } from 'rxjs';
import { GavEgoHeaderComponent } from '@lib/ego-header';
import { GavIconComponent } from '@lib/icon';
import { BgImgUrlPipe } from '@app/pipes/bg-img-url.pipe';

@Component({
  imports: [
    GavEgoHeaderComponent,
    GavIconComponent,
    RouterLink,
    BgImgUrlPipe,
  ],
  selector: 'gav-header',
  standalone: true,
  template: `
    <gav-ego-header
      [profileImgUrl]="portraitImg() | bgImgUrl"
      [backgroundImgUrl]="bgImg() | bgImgUrl">
      <div class="gav-ego-header__left">
        <gav-icon
        [icon]="darkTheme ? 'moon' : 'sun'"
        [text]="darkTheme ? 'Dark' : 'Psychopath'"
        (click)="toggleTheme()" />
        
        @if (parentUrl().currentRoute) {
          <gav-icon
          routerLink="/"
          icon="home"
          text="Home" />
        }
      </div>

      <div class="gav-ego-header__right">
        <gav-icon
          [routerLink]="parentUrl().parentLink"
          [icon]="parentUrl().parentLink === 'cl' ? 'changelog' : 'back-arrow'"
          [text]="parentUrl().currentMessage" />
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
  parentUrl = signal({ currentRoute: '', parentLink: 'cl', currentMessage: 'loading...' });

  private routerData: Signal<ActivatedRouteSnapshot | undefined> = toSignal(this.router.events.pipe(
    filter((r: any) => r instanceof ActivationEnd),
    throttleTime(50),
    map((r: ActivationEnd) => r.snapshot),
    tap(() => {
      const routes = this.router.url.split('/');
      const currentRoute = routes?.at(-1) || '';

      this.parentUrl.set({
        currentRoute,
        parentLink: currentRoute === '' ? 'cl' : routes.at(-2)!,
        currentMessage: currentRoute === '' ? 'Changelog' : 'Back',
      });
    }),
  ));

  constructor(private router: Router) {}

  toggleTheme(): void {
    this.darkTheme = !this.darkTheme;
    document.body.setAttribute('class', this.darkTheme ? '' : 'light');
  }
}

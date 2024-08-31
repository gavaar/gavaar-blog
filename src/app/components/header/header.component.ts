import { ChangeDetectionStrategy, Component, Signal, computed, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRouteSnapshot, ActivationEnd, Router, RouterLink } from '@angular/router';
import { filter, map, tap, throttleTime } from 'rxjs';
import { BgImgUrlPipe } from '@app/pipes/bg-img-url.pipe';
import { GavEgoHeaderComponent } from '@lib/ego-header';
import { GavIconComponent, GavIcon } from '@lib/icon';
import { GavSidenavApi } from '@lib/sidenav';

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
      [profileImgUrl]="portrait() | bgImgUrl"
      [backgroundImgUrl]="bg() | bgImgUrl">
      <div class="gav-ego-header__left">
        <!-- <gav-icon
        [icon]="darkTheme ? 'moon' : 'sun'"
        [text]="darkTheme ? 'Dark' : 'Psychopath'"
        (click)="toggleTheme()" /> -->
        
        <gav-icon class="gav-header__nav-toggle"
          [icon]="GavIcon.ThreeLines"
          (click)="navApi.open.set(!navApi.open())"/>
      </div>

      <div class="gav-ego-header__right">
        <gav-icon
          [routerLink]="parentUrl().parentLink"
          [icon]="parentUrl().parentLink === 'cl' ? GavIcon.Changelog : GavIcon.BackArrow"
          [text]="parentUrl().currentMessage" />
      </div>
    </gav-ego-header>
  `,
  styleUrl: 'header.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent {
  darkTheme = true;

  parentUrl = signal({ currentRoute: '', parentLink: 'cl', currentMessage: 'loading...' });
  bg = computed(() => this.routerData()?.data['bg'] || 'default_bg.jpg');
  portrait = computed(() => this.routerData()?.data['portrait'] || 'loading/rolling.gif');

  GavIcon = GavIcon;

  protected navApi = inject(GavSidenavApi);

  private routerData: Signal<ActivatedRouteSnapshot | undefined> = toSignal(this.router.events.pipe(
    filter((r: any) => r instanceof ActivationEnd),
    throttleTime(50),
    map((r: ActivationEnd) => r.snapshot),
    tap(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
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

  // toggleTheme(): void {
  //   this.darkTheme = !this.darkTheme;
  //   document.body.setAttribute('class', this.darkTheme ? '' : 'light');
  // }
}

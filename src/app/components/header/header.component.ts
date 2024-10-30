import { ChangeDetectionStrategy, Component, OnInit, Signal, computed, effect, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRouteSnapshot, ActivationEnd, Router, RouterLink } from '@angular/router';
import { filter, map, tap, throttleTime } from 'rxjs';
import { BgImgUrlPipe } from '@app/pipes/bg-img-url.pipe';
import { GavEgoHeader } from '@lib/ego-header';
import { GavIcon, Icon } from '@lib/icon';
import { GavSidenavApi } from '@lib/sidenav';
import { Memory, memory } from '@app/state';

@Component({
  imports: [
    GavEgoHeader,
    GavIcon,
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
        <gav-icon class="gav-header__nav-button right"
          [icon]="Icon.ThreeLines"
          (click)="navApi.open.set(!navApi.open())"/>
      </div>

      <div class="gav-ego-header__right">
        <gav-icon
          class="gav-header__nav-button left"
          [routerLink]="parentUrl().parentLink"
          [icon]="parentUrl().parentLink === 'cl' ? Icon.Changelog : Icon.BackArrow" />
      </div>
    </gav-ego-header>
  `,
  styleUrl: 'header.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent implements OnInit {
  darkTheme = true;
  Icon = Icon;

  parentUrl = signal({ currentRoute: '', parentLink: 'cl' });
  bg = computed(() => this.routerData()?.data['bg'] || 'default_bg.jpg');
  portrait = computed(() => this.routerData()?.data['portrait'] || 'loading/rolling.gif');

  protected navApi = inject(GavSidenavApi);

  private router = inject(Router);
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
      });
    }),
  ));

  constructor() {
    effect(() => {
      const sidenavOpen = this.navApi.open();
      memory.patch(Memory.Config, { sidenavOpen });
    }, { allowSignalWrites: true });
  }

  ngOnInit(): void {
    this.navApi.open.set(memory.get(Memory.Config).sidenavOpen);
  }
}

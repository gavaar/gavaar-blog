import { ChangeDetectionStrategy, Component, Signal, computed, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRouteSnapshot, ActivationEnd, Router, RouterLink } from '@angular/router';
import { filter, map, tap, throttleTime } from 'rxjs';
import { BgImgUrlPipe } from '@app/pipes/bg-img-url.pipe';
import { Memory, memory } from '@app/state';
import { GavEgoHeader, GavIcon, Icon } from '@lib/components';

@Component({
  imports: [
    GavEgoHeader,
    GavIcon,
    RouterLink,
    BgImgUrlPipe,
  ],
  selector: 'gav-header',
  template: `
    <gav-ego-header
      [profileImgUrl]="portrait() | bgImgUrl"
      [backgroundImgUrl]="bg() | bgImgUrl">
      <div class="gav-ego-header__left">
        <gav-icon class="gav-header__nav-button right"
          [icon]="Icon.ThreeLines"
          (click)="toggleNav()"/>
      </div>

      <div class="gav-ego-header__right">
        @if (parentUrl().parentLink !== '~') {
          <gav-icon
            class="gav-header__nav-button left"
            [routerLink]="parentUrl().parentLink"
            [icon]="Icon.BackArrow" />
        }
      </div>
    </gav-ego-header>
  `,
  styleUrl: 'gav-header.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GavHeader {
  protected Icon = Icon;

  protected parentUrl = signal({ currentRoute: '', parentLink: '~' });
  protected navOpen = computed(() => memory.get(Memory.Config).sidenavOpen);
  protected bg = computed(() => this.routerData()?.data['bg'] || 'default_bg.jpg');
  protected portrait = computed(() => this.routerData()?.data['portrait'] || 'loading/rolling.gif');

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
        parentLink: currentRoute === '' ? '~' : routes.at(-2)!,
      });
    }),
  ));

  protected toggleNav(): void {
    memory.patch(Memory.Config, { sidenavOpen: !this.navOpen() });
  }
}

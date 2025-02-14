import { ChangeDetectionStrategy, Component, computed, effect } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { GavHeader } from './components/gav-header';
import { GavSidenav } from "../lib/sidenav/sidenav.component";
import { GavNavCategory, GavNavItem, GavNavUncategorized } from '@lib/sidenav';
import { Icon } from '@lib/icon';
import { BLOG_DATA, EXTERNAL_DATA, FOOTER_DATA, HIDDEN_DATA, HOME_DATA, TOOLS_DATA } from './routes/routes.config';
import { Memory, memory } from './state';

const SIDENAV_CONFIG = [
  new GavNavUncategorized({
    items: [new GavNavItem(HOME_DATA)],
  }),
  new GavNavCategory({
    title: 'Tools',
    icon: Icon.Write,
    items: TOOLS_DATA.map(data => new GavNavItem(data)),
  }),
  new GavNavCategory({
    title: 'Posts',
    icon: Icon.Write,
    items: BLOG_DATA.map(data => new GavNavItem(data)),
  }),
  new GavNavCategory({
    title: 'External',
    icon: Icon.External,
    items: EXTERNAL_DATA.map(data => new GavNavItem(data)),
  }),
  new GavNavCategory({
    title: 'Hidden',
    icon: Icon.Ninja,
    items: HIDDEN_DATA.map(data => new GavNavItem(data)),
  }),
  new GavNavUncategorized({
    items: FOOTER_DATA.map(data => new GavNavItem(data)),
  }),
];

@Component({
  selector: 'gav-root',
  imports: [RouterOutlet, GavHeader, GavSidenav],
  template: `
    <gav-header />
    
    <main>
      <gav-sidenav
        [config]="sidenavConfig"
        [open]="navOpen()"
        (itemTouched)="closeNav()"/>

      <div>
        <router-outlet />
      </div>
    </main>
  `,
  styleUrl: './app.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class App {
  protected sidenavConfig = SIDENAV_CONFIG;
  protected navOpen = computed(() => memory.get(Memory.Config).sidenavOpen);
  protected closeNav = () => memory.patch(Memory.Config, { sidenavOpen: false });

  private _ = effect(() => {
    const memoryConfig = memory.watch(Memory.Config)();
    document.body.setAttribute('class', memoryConfig.theme);
  });
}

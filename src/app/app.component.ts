import { ChangeDetectionStrategy, Component, computed, effect } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './components/header';
import { GavSidenavComponent } from "../lib/sidenav/sidenav.component";
import { GavNavCategory, GavNavItem, GavNavUncategorized } from '@lib/sidenav';
import { GavIcon } from '@lib/icon';
import { BLOG_DATA, EXTERNAL_DATA, FOOTER_DATA, HIDDEN_DATA, HOME_DATA } from './routes/config';
import { Memory, memory } from './state';

const SIDENAV_CONFIG = [
  new GavNavUncategorized({
    items: [new GavNavItem(HOME_DATA)],
  }),
  new GavNavCategory({
    title: 'Posts',
    icon: GavIcon.Write,
    items: BLOG_DATA.map(data => new GavNavItem(data)),
  }),
  new GavNavCategory({
    title: 'External',
    icon: GavIcon.External,
    items: EXTERNAL_DATA.map(data => new GavNavItem(data)),
  }),
  new GavNavCategory({
    title: 'Hidden',
    icon: GavIcon.Ninja,
    hide: computed(() => !memory.watch(Memory.HiddenRoutes)().show),
    items: HIDDEN_DATA.map(data => new GavNavItem(data)),
  }),
  new GavNavUncategorized({
    items: FOOTER_DATA.map(data => new GavNavItem(data)),
  }),
];

@Component({
  selector: 'gav-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, GavSidenavComponent],
  template: `
    <gav-header />
    
    <main>
      <gav-sidenav [config]="sidenavConfig"/>

      <div>
        <router-outlet />
      </div>
    </main>
  `,
  styleUrl: './app.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {
  protected sidenavConfig = SIDENAV_CONFIG;

  constructor() {
    effect(() => {
      const memoryConfig = memory.watch(Memory.Config)();
      document.body.setAttribute('class', memoryConfig.theme);
    });
  }
}

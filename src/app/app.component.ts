import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './components/header';
import { GavSidenavComponent } from "../lib/sidenav/sidenav.component";
import { GavNavCategory, GavNavItem, GavNavUncategorized } from '@lib/sidenav';
import { GavIcon } from '@lib/icon';
import { BLOG_DATA, EXTERNAL_DATA, FOOTER_DATA, HOME_DATA } from './app.routes';

const SIDENAV_CONFIG = [
  new GavNavUncategorized({
    items: [new GavNavItem(HOME_DATA)],
  }),
  new GavNavCategory({
    title: 'Posts',
    icon: GavIcon.Write,
    items: [
      new GavNavItem(BLOG_DATA.DEV),
      new GavNavItem(BLOG_DATA.SEL),
    ],
  }),
  new GavNavCategory({
    title: 'External',
    icon: GavIcon.External,
    items: [new GavNavItem(EXTERNAL_DATA.POE)],
  }),
  new GavNavUncategorized({
    items: [
      new GavNavItem(FOOTER_DATA.CHANGELOG),
      new GavNavItem({
        icon: GavIcon.Moon,
        title: 'Dark',
        click() {
          const wasDarkTheme = this.icon === GavIcon.Moon;
          this.icon = wasDarkTheme ? GavIcon.Sun : GavIcon.Moon;
          this.title = wasDarkTheme ? 'Psychopath' : 'Dark';
          document.body.setAttribute('class', wasDarkTheme ? 'light' : '');
        },
      }),
      new GavNavItem(FOOTER_DATA.ABOUT),
    ],
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
}

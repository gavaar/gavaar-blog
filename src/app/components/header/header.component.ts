import { ChangeDetectionStrategy, Component } from '@angular/core';
import { IconComponent } from '../../../lib/icon';
import { RouterLink } from '@angular/router';

@Component({
  imports: [IconComponent, RouterLink],
  selector: 'gav-header',
  standalone: true,
  template: `
    <header class="header">
      <nav routerLink="changelog">changelog (nav WIP)</nav>
      <span>Francisco Santorelli</span>
      <span class="header__theme-toggle">
        <gav-icon class="header__icon" [icon]="darkTheme ? 'moon' : 'sun'" (click)="toggleTheme()" />
        <small class="header__theme-text">{{ darkTheme ? 'Dark' : 'Psychopath' }} mode</small>
      </span>
    </header>
  `,
  styleUrl: 'header.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent {
  darkTheme = true;

  toggleTheme(): void {
    this.darkTheme = !this.darkTheme;
    document.body.setAttribute('class', this.darkTheme ? '' : 'light');
  }
}

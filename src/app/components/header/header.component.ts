import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { GavEgoHeader } from '../../../lib/ego-header/ego-header.component';
import { GavIconComponent } from '../../../lib/icon';

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
      backgroundImgUrl="assets/images/bg_url.png">
      <nav style="cursor: pointer" class="gav-ego-header__left header__theme-toggle" routerLink="changelog">(clickMe)</nav>
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

  toggleTheme(): void {
    this.darkTheme = !this.darkTheme;
    document.body.setAttribute('class', this.darkTheme ? '' : 'light');
  }
}

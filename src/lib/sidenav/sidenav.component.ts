import { ChangeDetectionStrategy, Component, inject, input, ViewEncapsulation } from '@angular/core';
import { GavSidenavApi } from './sidenav.api';
import { NgClass } from '@angular/common';
import { GavNavCategory } from './models';
import { GavIconComponent } from "../icon/icon.component";
import { animate, style, transition, trigger } from '@angular/animations';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  standalone: true,
  selector: 'gav-sidenav',
  imports: [
    NgClass,
    GavIconComponent,
    RouterLink,
    RouterLinkActive,
  ],
  templateUrl: './sidenav.component.html',
  styleUrl: './sidenav.component.scss',
  animations: [
    trigger('enterLeave', [
      transition(':enter', [style({opacity: 0, height: 0}), animate('100ms', style({opacity: 1, height: '3rem'}))]),
      transition(':leave', [animate('100ms', style({opacity: 0, height: 0}))]),
    ]),
  ],
  host: { '[class.open]': 'api.open()' },
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GavSidenavComponent {
  config = input.required<GavNavCategory[]>();
  api = inject(GavSidenavApi);
}

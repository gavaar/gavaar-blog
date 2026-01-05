import { ChangeDetectionStrategy, Component, input, output, ViewEncapsulation } from '@angular/core';
import { GavNavCategory } from './models';
import { animate, style, transition, trigger } from '@angular/animations';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { GavIcon } from '../icon';

@Component({
  selector: 'gav-sidenav',
  imports: [
    RouterLink,
    RouterLinkActive,
    GavIcon,
  ],
  templateUrl: './sidenav.component.html',
  styleUrl: './sidenav.component.scss',
  animations: [
    trigger('enterLeave', [
      transition(':enter', [style({ opacity: 0, height: 0 }), animate('100ms', style({ opacity: 1, height: '3rem' }))]),
      transition(':leave', [animate('100ms', style({ opacity: 0, height: 0 }))]),
    ]),
  ],
  host: { '[class.open]': 'open()' },
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GavSidenav {
  config = input.required<GavNavCategory[]>();
  open = input<boolean>(true);
  itemTouched = output<void>();
}

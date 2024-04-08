import { ChangeDetectionStrategy, Component } from '@angular/core';
import { LEARN_WEB_DEV } from './development.config';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'development',
  standalone: true,
  imports: [RouterLink],
  template: `
    <h1>Development scribbles</h1>
    <small>Below list are links lacking proper styling... this will be obvious later when this page is completed [W.I.P.]</small>
    <ul>
      <li>
        <a [routerLink]="listConfig.url">{{ listConfig.title }}</a> - <small>{{ listConfig.description }}</small>
      </li>
    </ul>
  `,
  styles: [`
    a {
      cursor: pointer;
      border-bottom: 1px solid transparent;

      &:hover {
        border-color: var(--text);
        transition: 0.25s;
      }
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DevelopmentComponent {
  listConfig = LEARN_WEB_DEV;
}

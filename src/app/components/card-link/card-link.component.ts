import { ChangeDetectionStrategy, Component, input } from '@angular/core';

export interface GavCardLink {
  text: string;
  backgroundImgUrl: string;
}

@Component({
  standalone: true,
  selector: 'gav-card',
  template: `
    @if (config(); as config) {
      <div class="gav-card__backdrop"></div>
      <span class="gav-card__text">
        {{ config.text }}
      </span>
    }
  `,
  styleUrl: './card-link.component.scss',
  host: {
    '[style.--gav-card__bg-url]': `'url(assets/images/' + config().backgroundImgUrl + ')'`,
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GavCardLinkComponent {
  config = input.required<GavCardLink>();
}

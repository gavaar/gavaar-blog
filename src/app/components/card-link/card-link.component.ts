import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { BgImgUrlPipe } from '@app/pipes/bg-img-url.pipe';

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
    '[style.--gav-card__bg-url]': 'cardBgUrl()',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GavCardLinkComponent {
  config = input.required<GavCardLink>();
  
  protected cardBgUrl = computed(() => this.bgImgUrlPipe.transform(this.config().backgroundImgUrl, true));

  private bgImgUrlPipe = new BgImgUrlPipe();
}

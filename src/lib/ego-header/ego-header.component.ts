import { ChangeDetectionStrategy, Component, ViewEncapsulation, input, signal } from '@angular/core';
import { fromEvent, map } from 'rxjs';

const INITIAL_BG_HEIGHT = 27;
const INITIAL_BOT_TRASLATE = 3;
const INITIAL_BORDER_RADIUS = 50;

@Component({
  standalone: true,
  selector: 'gav-ego-header',
  templateUrl: './ego-header.component.html',
  styleUrl: './ego-header.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    '[style.height]': 'initialHeight',
    '[style.--gav-ego-header-bg-url]': `'url(' + backgroundImgUrl() + ')'`,
    '[style.--gav-ego-header-dynamic-height]': `height() + 'vh'`,
    '[style.--gav-ego-header-img-bot-traslate]': `botTraslate() + 'vh'`,
    '[style.--gav-ego-header-img-border-radius]': `borderRadius() + '%'`,
  },
})
export class GavEgoHeaderComponent {
  backgroundImgUrl = input.required<string>();
  profileImgUrl = input.required<string>();

  readonly initialHeight = `${INITIAL_BG_HEIGHT + INITIAL_BOT_TRASLATE}vh`;
  height = signal(INITIAL_BG_HEIGHT);
  botTraslate = signal(INITIAL_BOT_TRASLATE);
  borderRadius = signal(INITIAL_BORDER_RADIUS);

  constructor() {
    const oneDhv = window.innerHeight / 100;
    const maxHeaderSize = oneDhv * 22; // will shrink at most 22dhv (from 27 to 5)
    const fiveRemInDvh = 80 / oneDhv;

    fromEvent(window, 'scroll')
      .pipe(map((e: any) => e.srcElement.scrollingElement.scrollTop))
      .subscribe((scrollTop: number) => {
        const scrolledPercent = scrollTop / maxHeaderSize;
        const shrinkPercent = scrolledPercent > 1 ? 1 : scrolledPercent;
        const scrolleddhv = scrolledPercent > 1 ? 22 : scrollTop / oneDhv;

        // from 50% at 0 scroll, to 0% at 100% (22dvh) scroll
        const borderRadius = INITIAL_BORDER_RADIUS * (1 - shrinkPercent);
        this.borderRadius.set(borderRadius);
        
        // from 3dvh at 0 scroll, to 0dvh at 100% (22dvh) scroll
        const botTraslate = INITIAL_BOT_TRASLATE * (1 - shrinkPercent);
        this.botTraslate.set(botTraslate);
        
        // from 27dvh at 0 scroll, to 5dvh at 100% (22dvh) scroll
        const height = INITIAL_BG_HEIGHT - scrolleddhv;
        this.height.set(height > fiveRemInDvh ? height : fiveRemInDvh);
      });
  }

  protected openImage(): void {
    window.open(this.profileImgUrl(), '_blank');
  }
}

import { ChangeDetectionStrategy, Component, ViewEncapsulation, inject, input } from '@angular/core';
import { Router } from '@angular/router';
import { GavHoldClick } from '../hold-click';
import { fromEvent, map } from 'rxjs';

const DHV_UNIT=  (window.visualViewport?.height || 100) / 100;
const MAX_HEADER_SIZE = 23; // 20 header shrinkable + 3 margin-bottom size. Check css for these values.

@Component({
  imports: [GavHoldClick],
  selector: 'gav-ego-header',
  templateUrl: './ego-header.component.html',
  styleUrl: './ego-header.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: { '[style.--gav-ego-header__bg-url]': `'url(' + backgroundImgUrl() + ')'` },
})
export class GavEgoHeader {
  backgroundImgUrl = input.required<string>();
  profileImgUrl = input.required<string>();

  private router = inject(Router);

  constructor() {
    document.body.style.setProperty('--gav-ego-header__animation-range', '0');
    fromEvent(window, 'scroll')
      .pipe(map((e: any) => e.srcElement.scrollingElement.scrollTop))
      .subscribe((scrollTop: number) => {
        const scrolledTopDhv = scrollTop / DHV_UNIT;
        const ratioOfHeaderScrolled = scrolledTopDhv / MAX_HEADER_SIZE;
        const scrollAnimationProgress = Math.min(ratioOfHeaderScrolled, 1);

        // all header animations will come from this value
        document.body.style.setProperty('--gav-ego-header__animation-range', `${scrollAnimationProgress}`);
      });
  }

  protected onPortraitClick = (): void => {
    this.router.navigateByUrl('/');
  }

  protected onPortraitHold = (): void => {
    window.open(this.profileImgUrl(), '_blank');
  }
}

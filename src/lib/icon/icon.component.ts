import { ChangeDetectionStrategy, Component, computed, input, ViewEncapsulation } from '@angular/core';
import { Icon } from './gav-icons.enum';

@Component({
  selector: 'gav-icon',
  template: `
    <div class="gav-icon__icon" [style.mask-image]="iconSvg()"></div>
    @if (text(); as text) { <small class="gav-icon__text">{{ text }}</small> }
  `,
  styleUrl: 'icon.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class GavIcon {
  icon = input.required<string | Icon>();
  text = input<string>('');

  protected iconSvg = computed(() => `url(assets/icons/${this.icon()}.svg)`);
}

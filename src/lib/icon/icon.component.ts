import { ChangeDetectionStrategy, Component, Input, OnChanges, SimpleChanges, ViewEncapsulation } from '@angular/core';

@Component({
  standalone: true,
  selector: 'gav-icon',
  template: '<div class="gav-icon" [style.mask-image]="iconSvg"></div>',
  styleUrl: 'icon.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class IconComponent implements OnChanges {
  @Input({ required: true }) icon!: string;

  iconSvg = '';

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['icon']) {
      this.iconSvg = `url(assets/icons/${this.icon}.svg)`;
    }
  }
}

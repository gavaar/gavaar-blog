import { ChangeDetectionStrategy, Component, forwardRef, input, ViewEncapsulation } from '@angular/core';
import { GavRichText } from '../rich-text';

@Component({
  selector: 'gav-rich-text__header',
  template: `
    @switch (size()) {
      @case (1) { <h1><gav-rich-text [content]="content()" /></h1>}
      @case (2) { <h2><gav-rich-text [content]="content()" /></h2>}
      @case (3) { <h3><gav-rich-text [content]="content()" /></h3>}
      @case (4) { <h4><gav-rich-text [content]="content()" /></h4>}
      @case (5) { <h5><gav-rich-text [content]="content()" /></h5>}
      @default { <h6><gav-rich-text [content]="content()" /></h6>}
    }
  `,
  styles: [`
    gav-rich-text__header {
      display: contents;

      h1, h2, h3, h4, h5, h6 {
        margin: 0;
      }
    }
  `],
  imports: [forwardRef(() => GavRichText)],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class GavRichTextHeader {
  content = input.required<string>();
  size = input.required<number>();

}

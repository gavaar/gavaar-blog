import { ChangeDetectionStrategy, Component, forwardRef, input, ViewEncapsulation } from '@angular/core';
import { GavRichText } from '../rich-text';

@Component({
  selector: 'gav-rich-text__link',
  template: `
    <a [href]="url()" target="_blank">
      <gav-rich-text [content]="content()" />
    </a>
  `,
  styles: [`
    gav-rich-text__link {
      display: contents;
    }

    a {
      color: var(--primary);
    }
    a:visited {
      color: var(--secondary);
    }
  `],
  imports: [forwardRef(() => GavRichText)],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class GavRichTextLink {
  content = input.required<string>();
  url = input.required<string>();
}

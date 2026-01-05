import PrismJs from 'prismjs';
import 'prismjs/components/prism-typescript';
import 'prismjs/components/prism-bash';
import 'prismjs/components/prism-markup';
import { ChangeDetectionStrategy, Component, computed, input, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'gav-rich-text__pre',
  template: `<pre [innerHtml]="parsedCodeBlock()"></pre>`,
  styles: [`
    gav-rich-text__pre {
      display: contents;
    }

    .token.operator {
      background: unset;
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class GavRichTextPre {
  content = input.required<string>();
  language = input<string>('markup');

  protected parsedCodeBlock = computed<string>(() => {
    const content = this.content();
    const language = this.language();

    return PrismJs.highlight(content, PrismJs.languages[language], language);
  });
}

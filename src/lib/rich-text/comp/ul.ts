import { ChangeDetectionStrategy, Component, computed, forwardRef, input, ViewEncapsulation } from '@angular/core';
import { GavRichText } from '../rich-text';

const UL_LI_REGEX = /-[ ]((?:.|\n)+?)(?=$|\n-)/g;

@Component({
  selector: 'gav-rich-text__ul',
  template: `
    <ul>
      @for (item of listItems(); track item) {
        <li>
          <gav-rich-text [content]="item" [root]="false" />
        </li>
      }
    </ul>
  `,
  styles: [`
    gav-rich-text__ul {
      display: contents;
    }

    ul {
      padding-left: var(--text-margin-left);

      pre {
        margin-left: 0;
        margin-right: 0;
      }
    }

  `],
  imports: [forwardRef(() => GavRichText)],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class GavRichTextUL {
  content = input.required<string>();

  protected listItems = computed(() => {
    const matches = this.content().matchAll(UL_LI_REGEX);
    return [...matches].map(match => match[1]);
  })
}

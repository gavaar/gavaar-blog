import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { markdownToHtml } from './markdown-to-html';

@Component({
  standalone: true,
  selector: 'gav-rich-text',
  template: `<div class="gav-rich-text" [innerHTML]="parsedText()"></div>`,
  styles: [`
    .gav-rich-text ::ng-deep {
      a {
        color: var(--secondary);
      }

      img {
        max-width: 100%;
      }

      blockquote {
        opacity: 0.8;
        border-left: 0.15rem solid var(--accent);
        padding-left: 0.25rem;
        font-size: 0.85rem;
        line-height: 0.85rem;
        margin-inline-start: 0;
      }
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GavRichTextComponent {
  rawText = input('');
  parsedText = computed(() => markdownToHtml(this.rawText()));
}

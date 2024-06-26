import { ChangeDetectionStrategy, Component, ViewEncapsulation, computed, input } from '@angular/core';
import { markdownToHtml } from './lib';

@Component({
  standalone: true,
  selector: 'gav-rich-text',
  template: `<div class="gav-rich-text" [innerHTML]="parsedText()"></div>`,
  styleUrl: './rich-text.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class GavRichTextComponent {
  rawText = input('');
  parsedText = computed(() => markdownToHtml(this.rawText()));
}

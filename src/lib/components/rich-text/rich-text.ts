import { ChangeDetectionStrategy, Component, ViewEncapsulation, computed, inject, input } from '@angular/core';
import { CompType, ParsedComponent } from './rich-text.types';
import { GavRichTextUL, GavRichTextPre, GavRichTextHeader, GavRichTextLink, GavRichTextImg } from './comp';
import { Parser } from './parser';

@Component({
  selector: 'gav-rich-text',
  templateUrl: 'rich-text.html',
  styleUrl: 'rich-text.scss',
  imports: [
    GavRichTextHeader,
    GavRichTextImg,
    GavRichTextLink,
    GavRichTextPre,
    GavRichTextUL,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class GavRichText {
  content = input.required<string>();
  root = input(true);

  protected parsedText = computed<ParsedComponent[]>(() => {
    const parser = this.parser.initText(this.content());

    // block elements
    parser.codeBlock();
    parser.blockquote();
    parser.header();
    parser.ul();
    parser.horizontalRow();
    parser.image();
    if (this.root()) {
      parser.paragraph();
    }

    // inline elements
    parser.link();
    parser.bold();
    parser.italic();
    parser.code();
    parser.small();


    return parser.result();
  });
  protected CompType = CompType;

  private parser = inject(Parser);
}

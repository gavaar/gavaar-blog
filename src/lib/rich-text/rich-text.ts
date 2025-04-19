import { ChangeDetectionStrategy, Component, ViewEncapsulation, computed, inject, input } from '@angular/core';
import { CompType, ParsedComponent } from './rich-text.types';
import { GavRichTextUL, GavRichTextPre, GavRichTextHeader, GavRichTextLink, GavRichTextImg } from './comp';
import { Parser } from './parser';

// new stuff
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

  protected parsedText = computed<ParsedComponent[]>(() =>
    // comment methods to remove the parsing of them
    this.parser.initText(this.content())
      .codeBlock()
      .blockquote()
      .ul()
      .header()
      .horizontalRow()
      .image()
      .link() // need: after `image`
      .bold()
      .italic() // need: after `bold`
      .code()
      .small()
      .result()
  );
  protected CompType = CompType;

  private parser = inject(Parser);
}

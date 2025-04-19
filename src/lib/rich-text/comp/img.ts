import { ChangeDetectionStrategy, Component, input, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'gav-rich-text__img',
  template: `
    <a class="img-container" [href]="url()" target="_blank">
      <img [alt]="content()" [src]="url()"/>
    </a>
  `,
  styles: [`
    gav-rich-text__img {
      display: contents;

      img {
        border-radius: 0.5rem;
        margin: 0.5rem 0;
        width: auto;
        height: auto;
        max-width: 100%;
        max-height: 30rem;
      }
    }

    .img-container:not(li .img-container, blockquote .img-container) {
      display: flex;
      justify-content: center;
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class GavRichTextImg {
  content = input.required<string>();
  url = input.required<string>();
}

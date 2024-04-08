import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Meta } from '@angular/platform-browser';
import { LEARN_WEB_DEV } from '../development.config';

@Component({
  standalone: true,
  selector: 'learn-web-dev',
  template: `<h1>Learn web dev [WIP]</h1>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LearnWebDevComponent {
  constructor(meta: Meta) {
    meta.updateTag({ name: 'title', content: LEARN_WEB_DEV.title });
    meta.updateTag({ name: 'description', content: LEARN_WEB_DEV.description });
  }
}

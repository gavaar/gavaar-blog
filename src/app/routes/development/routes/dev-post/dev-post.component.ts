import { ChangeDetectionStrategy, Component, Signal, computed } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { BlogPost } from '../../../../entity';
import { map, startWith, tap } from 'rxjs';
import { Meta } from '@angular/platform-browser';
import { GavRichTextComponent } from '../../../../../lib/rich-text/rich-text.component';

@Component({
  standalone: true,
  imports: [GavRichTextComponent],
  selector: 'dev-post',
  template: `<gav-rich-text [rawText]="blogContent()" />`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DevPostComponent {
  private routeParams: Signal<BlogPost | undefined>;

  blogContent = computed(() => this.routeParams()?.content || '');

  constructor(activatedRoute: ActivatedRoute, meta: Meta) {
    const blogPostData = activatedRoute.data.pipe(
      startWith({ blogPost: {} }),
      map(data => <BlogPost>data.blogPost),
      tap(({ title, description }) => {
        meta.updateTag({ name: 'title', content: title });
        meta.updateTag({ name: 'description', content: description });
      }),
    );
    this.routeParams = toSignal(blogPostData);
  }
}

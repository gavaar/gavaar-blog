import { ChangeDetectionStrategy, Component, Signal, computed } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { BlogPost } from '../../../../entity';
import { map, startWith, tap } from 'rxjs';
import { Meta } from '@angular/platform-browser';

@Component({
  standalone: true,
  selector: 'dev-post',
  template: `<div [innerHTML]="blogContent()"></div>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DevPostComponent {
  private routeParams: Signal<BlogPost | undefined>;

  blogContent = computed(() => `<p>${this.routeParams()?.content.replace(/\\n/g, '</p><p>')}</p>`);

  constructor(activatedRoute: ActivatedRoute, meta: Meta) {
    const blogPostData = activatedRoute.data.pipe(
      startWith({ blogPost: {} }),
      map(data => <BlogPost>data.blogPost),
      tap(console.log),
      tap(({ title, description }) => {
        meta.updateTag({ name: 'title', content: title });
        meta.updateTag({ name: 'description', content: description });
      }),
    );
    this.routeParams = toSignal(blogPostData);
  }
}

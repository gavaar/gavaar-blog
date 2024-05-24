import { ChangeDetectionStrategy, Component, Signal, computed, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BlogPost } from '../../../../entity';
import { map, take, tap } from 'rxjs';
import { Meta } from '@angular/platform-browser';
import { BlogPostComponent } from '../../../../components/blog-post/blog-post.component';
import { readFbDocument, updateFbDocument } from '../../../../firebase';
import { increment } from 'firebase/firestore/lite';
import { environment } from '../../../../../environments/environment';

@Component({
  standalone: true,
  imports: [BlogPostComponent],
  selector: 'dev-post',
  templateUrl: './dev-post.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DevPostComponent {
  private blogData = signal<BlogPost | null>(null);
  
  views = signal(0);
  updatedContent = signal<string>('');
  blogContent = computed(() => this.blogData()?.content || '');
  
  constructor(
    activatedRoute: ActivatedRoute,
    meta: Meta,
  ) {
    activatedRoute.data.pipe(
      map(data => data['blogPost']),
      tap((blogPostData: BlogPost) => {
        meta.updateTag({ name: 'title', content: blogPostData.title });
        meta.updateTag({ name: 'description', content: blogPostData.description });
        this.blogData.set(<BlogPost>blogPostData);

      }),
      tap(blogPostData => {
        if (environment.production) {
          updateFbDocument(`views/posts`, { [`dev__${blogPostData.id}`]: increment(1) }).subscribe();
          readFbDocument<{ [key: string]: number }>(`views/posts`).subscribe(posts => this.views.set(posts[`dev__${blogPostData.id}`]));
        }
      }),
      take(1),
    ).subscribe();
  }

  updatePost(content: string): void {
    this.updatedContent.set(content === this.blogContent() ? '' : content);
  }

  savePost(): void {
    const post = this.blogData();

    if (this.updatedContent() && post) {
      post.content = this.updatedContent();
      updateFbDocument(`dev/${this.blogData()?.id}`, post).subscribe(() => {
        this.blogData.set({ ...post });
        this.updatedContent.set('');
        alert('saved');
      });
    }
  }
}

import { ChangeDetectionStrategy, Component, computed, effect, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Meta } from '@angular/platform-browser';
import { map } from 'rxjs';
import { readFbDocument, updateFbDocument } from '../../firebase';
import { BlogPost } from '../../entity';
import { PermissionsService } from '../../services/permissions.service';
import { GavRichTextComponent } from '../../../lib/rich-text/rich-text.component';
import { GavTextareaComponent } from '../../../lib/textarea/textarea.component';
import { DatePipe } from '@angular/common';
import { BlogPostService } from './blog-post.service';

@Component({
  selector: 'gav-blog-post',
  imports: [
    DatePipe,
    GavTextareaComponent,
    GavRichTextComponent,
  ],
  standalone: true,
  templateUrl: './blog-post.component.html',
  styleUrl: './blog-post.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BlogPostComponent {
  blogPost = signal<BlogPost | null>(null);
  updatedContent = signal('');
  views = signal(0);
  
  blogContent = computed(() => this.blogPost()?.content || '');
  
  admin = this.permissionsService.admin;

  constructor(
    meta: Meta,
    private activatedRoute: ActivatedRoute,
    private permissionsService: PermissionsService,
    private blogPostService: BlogPostService,
  ) {
    effect(() => {
      const blogPost = this.blogPost();
      if (blogPost) {
        meta.updateTag({ name: 'title', content: blogPost.title });
        meta.updateTag({ name: 'description', content: blogPost.description });
        readFbDocument<{ [key: string]: number }>(`views/posts`).subscribe(posts => this.views.set(posts[blogPost.id]));
      }
    });

    this.activatedRoute.data
      .pipe(map(data => data['blogPost']))
      .subscribe(blogPost => this.blogPost.set(blogPost));
  }

  onUpdateText(content: string): void {
    this.updatedContent.set(content === this.blogContent() ? '' : content);
  }

  savePost(): void {
    const post = this.blogPost();

    if (this.updatedContent() && post) {
      post.content = this.updatedContent();

      this.blogPostService.savePost(post).subscribe((updatedPost) => {
        this.blogPost.set(updatedPost);
        this.updatedContent.set('');
        alert('saved');
      });
    }
  }
}

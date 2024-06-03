import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Meta } from '@angular/platform-browser';
import { Timestamp } from 'firebase/firestore/lite';
import { BlogPost } from '../../../../entity';
import { PermissionsService } from '../../../../services/permissions.service';
import { GavRichTextComponent } from '../../../../../lib/rich-text/rich-text.component';
import { GavTextareaComponent } from '../../../../../lib/textarea/textarea.component';
import { DatePipe } from '@angular/common';
import { BlogPostService } from '../../../../services/post.service';
import { environment } from '../../../../../environments/environment';

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
  
  views = computed(() => this.blogPost()?.views || 0);
  blogContent = computed(() => this.blogPost()?.content || '');
  
  admin = this.permissionsService.admin;

  constructor(
    meta: Meta,
    private activatedRoute: ActivatedRoute,
    private permissionsService: PermissionsService,
    private blogPostService: BlogPostService,
  ) {
    const postId = this.activatedRoute.snapshot.paramMap.get('id');

    this.blogPostService.post(postId || '').subscribe(post => {      
      if (environment.production) {
        post.views += 1;
        this.blogPostService.savePost({ id: post.id, views: post.views }).subscribe();
      }

      this.blogPost.set(post);
      meta.updateTag({ name: 'description', content: post.description });
    });
  }

  onUpdateText(content: string): void {
    this.updatedContent.set(content === this.blogContent() ? '' : content);
  }

  savePost(): void {
    const post = this.blogPost();

    if (this.updatedContent() && post) {
      post.content = this.updatedContent();
      post.updated = Timestamp.now();

      this.blogPostService.savePost(post).subscribe((updatedPost) => {
        this.blogPost.set(updatedPost);
        this.updatedContent.set('');
        alert('saved');
      });
    }
  }
}

import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Meta } from '@angular/platform-browser';
import { Timestamp } from 'firebase/firestore/lite';
import { BlogPost } from '../../../../entity';
import { PermissionsService } from '../../../../services/permissions.service';
import { GavRichTextComponent } from '../../../../../lib/rich-text/rich-text.component';
import { GavTextareaComponent } from '../../../../../lib/textarea/textarea.component';
import { BlogPostService } from '../../../../services/post.service';
import { environment } from '../../../../../environments/environment';
import { GavInputComponent } from '../../../../../lib/input/input.component';

@Component({
  selector: 'gav-blog-post',
  imports: [
    DatePipe,
    ReactiveFormsModule,
    GavInputComponent,
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
  postForm = new FormGroup({
    id: new FormControl({ value: '', disabled: true }),
    assetURI: new FormControl(''),
    title: new FormControl('', Validators.required),
    description: new FormControl('', Validators.required),
    category: new FormControl('', Validators.required),
    content: new FormControl(''),
  });
  
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

      this.postForm.setValue({
        id: post.id,
        assetURI: post.assetURI,
        category: post.category,
        content: post.content,
        description: post.description,
        title: post.title,
      });
      meta.updateTag({ name: 'description', content: post.description });
    });
  }

  savePost(): void {
    const post = this.blogPost()!;

    if (this.postForm.valid) {
      const { content, assetURI, category, description, title } = this.postForm.value;

      post.content = content!;
      post.assetURI = assetURI!;
      post.category = category!;
      post.description = description!;
      post.title = title!;
      post.updated = Timestamp.now();

      this.blogPostService.savePost(post).subscribe((updatedPost) => {
        this.blogPost.set(updatedPost);
        this.postForm.markAsPristine();
        alert('saved');
      });
    }
  }
}

import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Meta } from '@angular/platform-browser';
import { Timestamp } from 'firebase/firestore/lite';
import { BlogPost } from '../../../../entity';
import { PermissionsService } from '../../../../services/permissions.service';
import { GavRichTextComponent } from '../../../../../lib/rich-text/rich-text.component';
import { GavTextareaComponent } from '../../../../../lib/textarea/textarea.component';
import { BlogPostService } from '../../../../services/post.service';
import { GavInputComponent } from '../../../../../lib/input/input.component';
import { ViewsService } from '../../../../services/views.service';

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
  views = signal(0);
  postForm = new FormGroup({
    id: new FormControl('', Validators.required),
    assetURI: new FormControl(''),
    title: new FormControl('', Validators.required),
    description: new FormControl('', Validators.required),
    category: new FormControl(this.blogPostService.category, Validators.required),
    content: new FormControl(''),
    date: new FormControl({ value: null, disabled: true }),
    updated: new FormControl({ value: null, disabled: true }),
  });
  
  blogContent = computed(() => this.blogPost()?.content || '');
  
  admin = this.permissionsService.admin;


  constructor(
    meta: Meta,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private permissionsService: PermissionsService,
    private blogPostService: BlogPostService,
    private viewService: ViewsService,
  ) {
    const postId = this.activatedRoute.snapshot.paramMap.get('id');

    if (postId) {
      this.postForm.controls.id.disable();

      this.blogPostService.post(postId).subscribe(post => {      
        this.viewService.increaseViews('views/posts', postId).subscribe(views => this.views.set(views));
  
        this.blogPost.set(post);
  
        this.postForm.setValue({
          id: post.id,
          assetURI: post.assetURI,
          category: post.category,
          content: post.content,
          description: post.description,
          title: post.title,
          date: null,
          updated: null,
        });
        meta.updateTag({ name: 'description', content: post.description });
      });
    }
  }

  savePost(): void {
    const post = this.blogPost() || {} as BlogPost;

    if (this.postForm.valid && confirm('Save?')) {
      const { id, content, assetURI, category, description, title } = this.postForm.value;
      const now = Timestamp.now();

      if (!post.id) {
        post.id = id!;
        post.date = now;
      }

      post.content = content!;
      post.assetURI = assetURI!;
      post.category = category!;
      post.description = description!;
      post.title = title!;
      post.updated = now;

      this.blogPostService.savePost(post).subscribe((updatedPost) => {
        const isNewPost = !this.blogPost()?.id;
        const categoryChanged = this.blogPost()?.category !== category;

        if (isNewPost || categoryChanged) {
          this.router.navigateByUrl(`${updatedPost.category}/${updatedPost.id}`);
          return;
        }

        this.blogPost.set(updatedPost);
        this.postForm.markAsPristine();
      });
    }
  }
}

import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Meta } from '@angular/platform-browser';
import { Timestamp } from 'firebase/firestore/lite';

import { GavInput } from '@lib/input';
import { GavRichText } from '@lib/rich-text';
import { GavTextarea } from '@lib/textarea';
import { GavIcon, Icon } from "@lib/icon";
import { BlogPost } from '@app/entities';
import { Permissions } from '@app/services/permissions';
import { PostClient } from '@app/services/post-client';
import { ViewsTracker } from '@app/services/views-tracker';

@Component({
  selector: 'blog-post',
  imports: [
    DatePipe,
    ReactiveFormsModule,
    GavInput,
    GavTextarea,
    GavRichText,
    GavIcon
  ],
  templateUrl: './blog-post.html',
  styleUrl: './blog-post.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GavBlogPost {
  blogPost = signal<BlogPost | null>(null);
  views = signal(0);
  blogContent = computed(() => this.blogPost()?.content || '');
  
  protected Icon = Icon;
  protected admin = this.permissionsService.admin;
  protected postForm = new FormGroup({
    id: new FormControl('', Validators.required),
    assetURI: new FormControl(''),
    title: new FormControl('', Validators.required),
    description: new FormControl('', Validators.required),
    category: new FormControl(this.PostClient.category, Validators.required),
    content: new FormControl(''),
    date: new FormControl<Timestamp | null>(null),
    updated: new FormControl<Timestamp | null>(null),
  });
  protected showCreated = signal(false);

  constructor(
    meta: Meta,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private permissionsService: Permissions,
    private PostClient: PostClient,
    private viewService: ViewsTracker,
  ) {
    const postId = this.activatedRoute.snapshot.paramMap.get('id');

    if (postId) {
      this.postForm.controls.id.disable();

      this.PostClient.post(postId).subscribe(post => {
        this.viewService.increaseViews('posts', postId).subscribe(views => this.views.set(views));
        this.blogPost.set(post);
  
        this.postForm.setValue({
          id: post.id,
          assetURI: post.assetURI,
          category: post.category,
          content: post.content,
          description: post.description,
          title: post.title,
          date: post.date,
          updated: post.updated,
        });
        meta.updateTag({ name: 'description', content: post.description });
      });
    }
  }

  protected savePost(): void {
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

      this.PostClient.savePost(post).subscribe((updatedPost) => {
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

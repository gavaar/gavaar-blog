import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Meta } from '@angular/platform-browser';
import { Timestamp } from 'firebase/firestore/lite';

import { GavRichText, GavInput, GavIcon, Icon } from "@lib/components";
import { BlogPost } from '@app/entities/blog_post';
import { Permissions } from '@app/clients/permissions';
import { PostClient } from '@app/clients/post';
import { ViewsTracker } from '@app/clients/views-tracker';

@Component({
  selector: 'blog-post',
  imports: [
    DatePipe,
    ReactiveFormsModule,
    GavInput,
    GavRichText,
    GavIcon
  ],
  templateUrl: './blog-post.html',
  styleUrl: './blog-post.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GavBlogPost {
  private router = inject(Router);
  private activatedRoute = inject(ActivatedRoute);
  private permissionsService = inject(Permissions);
  private postClient = inject(PostClient);
  private viewService = inject(ViewsTracker);

  protected blogPost = signal<BlogPost | null>(null);
  protected views = signal(0);
  protected Icon = Icon;
  protected admin = this.permissionsService.admin;
  protected postForm = new FormGroup({
    id: new FormControl('', Validators.required),
    assetURI: new FormControl(''),
    title: new FormControl('', Validators.required),
    description: new FormControl('', Validators.required),
    category: new FormControl(this.postClient.category, Validators.required),
    content: new FormControl(''),
    date: new FormControl<Timestamp | null>(null),
    updated: new FormControl<Timestamp | null>(null),
  });
  protected showCreated = signal(false);

  constructor(meta: Meta) {
    const postId = this.activatedRoute.snapshot.paramMap.get('id');

    if (postId) {
      this.postForm.controls.id.disable();

      this.postClient.post(postId).then(post => {
        this.viewService.increaseViews('posts', postId).then(views => this.views.set(views));
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

  protected async savePost(): Promise<void> {
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

      const updatedPost = await this.postClient.savePost(post);
      const isNewPost = !this.blogPost()?.id;
      const categoryChanged = this.blogPost()?.category !== category;

      if (isNewPost || categoryChanged) {
        this.router.navigateByUrl(`${updatedPost.category}/${updatedPost.id}`);
        return;
      }

      this.blogPost.set(updatedPost);
      this.postForm.markAsPristine();
    }
  }
}

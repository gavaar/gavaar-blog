import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { PostClient } from '../../../../services/post-client';
import { Permissions } from '../../../../services/permissions';
import { DatePipe } from '@angular/common';
import { BgImgUrlPipe } from '../../../../pipes/bg-img-url.pipe';

@Component({
  selector: 'post-list',
  imports: [
    DatePipe,
    RouterLink,
    BgImgUrlPipe,
  ],
  templateUrl: './post-list.html',
  styleUrl: './post-list.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GavPostList {
  protected title = '';
  protected description = '';
  protected posts = this.postService.postList;
  protected admin = this.permissionsService.admin;

  constructor(
    activatedRoute: ActivatedRoute,
    private postService: PostClient,
    private permissionsService: Permissions,
  ) {
    const { title, description } = activatedRoute.snapshot.data;
    this.title = title;
    this.description = description;
  }

  // Admin stuff
  deletePost(id: string): void {
    if (confirm('Sure?')) {
      this.postService.deletePost(id);
    }
  }
}

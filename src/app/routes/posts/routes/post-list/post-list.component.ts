import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { BlogPostService } from '../../../../services/post.service';
import { PermissionsService } from '../../../../services/permissions.service';
import { DatePipe } from '@angular/common';
import { BgImgUrlPipe } from '../../../../pipes/bg-img-url.pipe';

@Component({
  selector: 'post-list',
  imports: [
    DatePipe,
    RouterLink,
    BgImgUrlPipe,
  ],
  standalone: true,
  templateUrl: './post-list.component.html',
  styleUrl: './post-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GavPostList {
  protected title = '';
  protected description = '';
  protected posts = this.postService.postList;
  protected admin = this.permissionsService.admin;

  constructor(
    activatedRoute: ActivatedRoute,
    private postService: BlogPostService,
    private permissionsService: PermissionsService,
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

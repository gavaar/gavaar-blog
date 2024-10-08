import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { BlogPostService } from '../../../../services/post.service';
import { PermissionsService } from '../../../../services/permissions.service';
import { DatePipe } from '@angular/common';
import { BgImgUrlPipe } from '../../../../pipes/bg-img-url.pipe';

@Component({
  selector: 'gav-post-list',
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
export class PostListComponent {
  title = '';
  description = '';
  posts = this.postService.postList;
  admin = this.permissionsService.admin;

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

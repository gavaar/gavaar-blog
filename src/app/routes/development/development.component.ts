import { ChangeDetectionStrategy, Component, computed } from '@angular/core';
import { PermissionsService } from '../../services/permissions.service';
import { PostListComponent } from '../../components/post-list/post-list.component';
import { BlogPostService } from '../../components/blog-post/blog-post.service';

@Component({
  selector: 'development',
  standalone: true,
  imports: [PostListComponent],
  templateUrl: './development.component.html',
  styleUrl: './development.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DevelopmentComponent {
  posts = this.postService.postList;
  admin = this.permissionsService.admin;

  constructor(
    private postService: BlogPostService,
    private permissionsService: PermissionsService,
  ) {}

  // Admin stuff
  deletePost(id: string) {
    if (confirm('Sure?')) {
      this.postService.deletePost(id);
    }
  }
}

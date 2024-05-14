import { ChangeDetectionStrategy, Component, computed } from '@angular/core';
import { DevelopmentService } from './development.service';
import { PermissionsService } from '../../services/permissions.service';
import { PostListComponent } from '../../components/post-list/post-list.component';

@Component({
  selector: 'development',
  standalone: true,
  imports: [PostListComponent],
  templateUrl: './development.component.html',
  styleUrl: './development.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DevelopmentComponent {
  posts = this.devPostsService.postList;
  admin = this.permissionsService.admin;

  constructor(
    private devPostsService: DevelopmentService,
    private permissionsService: PermissionsService,
  ) {}

  // Admin stuff
  deletePost(id: string) {
    if (confirm('Sure?')) {
      this.devPostsService.deletePost(id);
    }
  }
}

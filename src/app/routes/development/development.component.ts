import { ChangeDetectionStrategy, Component, computed, effect } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DevelopmentService } from './development.service';
import { PermissionsService } from '../../services/permissions.service';
import { deleteFbDocument } from '../../firebase';

@Component({
  selector: 'development',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './development.component.html',
  styleUrl: './development.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DevelopmentComponent {
  posts = this.postService.postList;
  admin = computed(() => this.permissionsService.permissions()?.admin);

  constructor(private postService: DevelopmentService, private permissionsService: PermissionsService) {}

  // Admin stuff
  deletePost(id: string) {
    if (confirm('Sure?')) {
      this.postService.deletePost(id);
    }
  }
}

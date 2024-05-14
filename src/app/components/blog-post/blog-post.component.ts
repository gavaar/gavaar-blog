import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { GavRichTextComponent } from '../../../lib/rich-text/rich-text.component';
import { PermissionsService } from '../../services/permissions.service';
import { GavTextareaComponent } from '../../../lib/textarea/textarea.component';

@Component({
  selector: 'gav-blog-post',
  imports: [
    GavTextareaComponent,
    GavRichTextComponent,
  ],
  standalone: true,
  templateUrl: './blog-post.component.html',
  styleUrl: './blog-post.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BlogPostComponent {
  blogContent = input.required<string>();
  contentUpdate = output<string>();

  admin = this.permissionsService.admin;

  constructor(
    private permissionsService: PermissionsService,
  ) {}

  onUpdateText(updatedContent: string): void {
    this.contentUpdate.emit(updatedContent);
  }
}

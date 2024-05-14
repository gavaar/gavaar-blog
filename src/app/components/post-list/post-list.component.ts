import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { BlogPost } from '../../entity';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'gav-post-list',
  imports: [RouterLink],
  standalone: true,
  templateUrl: './post-list.component.html',
  styleUrl: './post-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PostListComponent {
  title = input.required<string>();
  description = input.required<string>();
  posts = input.required<BlogPost[]>();
  admin = input.required<boolean>();

  deletePost = output<string>();
}

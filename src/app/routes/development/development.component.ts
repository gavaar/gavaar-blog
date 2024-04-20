import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DevelopmentService } from './development.service';

@Component({
  selector: 'development',
  standalone: true,
  imports: [RouterLink],
  template: `
    <h1>Development scribbles</h1>
    <small>Below list are links lacking proper styling... this will be obvious later when this page is completed [W.I.P.]</small>
    @if (posts(); as posts) {
      <ul>
        @for (post of posts; track post.id) {
          <li>
            <img [src]="'assets/images/' + post.assetURI" [alt]="post.title + ' image'" />
            <div>
              <a [routerLink]="post.id">{{ post.title }}</a>
              <small>{{ post.description }}</small>
            </div>
          </li>
        }
      </ul>
    } @else {
      <p class="dev__loading">loading...</p>
    }
  `,
  styles: [`
    ul {
      display: flex;
      flex-direction: column;
      padding-inline: 0;
      list-style-type: none;
      row-gap: 1.5rem;
    }

    li {
      display: flex;
      column-gap: 0.5rem;

      img {
        height: 4rem;
        border-radius: 50%;
        border: 0.15rem solid var(--secondary);
      }

      div {
        display: flex;
        flex-direction: column;
        row-gap: 0.5rem;
      }
    }

    a {
      cursor: pointer;

      &:hover {
        border-color: var(--text);
        transition: 0.25s;
      }
    }

    .dev__loading {
      margin: 10dvh 40dvw;
      align-self: center;
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DevelopmentComponent {
  posts = this.postService.postList;

  constructor(private postService: DevelopmentService) {}
}

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
            <a [routerLink]="post.id">
              <img [src]="'assets/images/' + post.assetURI" [alt]="post.title + ' image'" />
              <div>
                <span>{{ post.title }}</span>
                <small>{{ post.description }}</small>
              </div>
            </a>
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

    a {
      cursor: pointer;
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

      &:hover {
        div span {
          text-decoration: underline; 
        }
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

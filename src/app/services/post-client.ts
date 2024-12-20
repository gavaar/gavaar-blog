import { Inject, Injectable, InjectionToken, computed, signal } from '@angular/core';
import { Observable, map, of, tap } from 'rxjs';
import { BlogPost } from '@app/entities';
import { deleteFbDocument, readFbCollection, readFbDocument, updateFbDocument } from '@app/firebase';

export const POST_CATEGORY = new InjectionToken<string>('post_category', { providedIn: 'root', factory: () => 'default' });

@Injectable()
export class PostClient {
  private posts = signal<{ [id: string]: BlogPost }>({});

  postList = computed(() => Object.values(this.posts()));

  constructor(
    @Inject(POST_CATEGORY) public category: string,
  ) {
    this.initService();
  }

  post(id: string): Observable<BlogPost> {
    const foundPost = this.posts()?.[id];

    if (foundPost) {
      return of(foundPost);
    }

    return readFbDocument<BlogPost>(`posts/${id}`).pipe(
      tap(post => this.posts.set({
        ...this.posts(),
        [post.id]: post,
      })),
    );
  }

  savePost(post: Partial<BlogPost> & { id: string }): Observable<BlogPost> {
    const { id, ...updatedPost } = post;

    return updateFbDocument(`posts/${post.id}`, updatedPost)
      .pipe(map(() => ({ ...updatedPost, id }) as BlogPost));
  }

  deletePost(id: string): void {
    deleteFbDocument(`posts/${id}`).subscribe(() => {
      const updatedPosts = { ...this.posts() };
      delete updatedPosts[id];
      this.posts.set(updatedPosts);
    });
  }

  private initService(): void {
    readFbCollection<BlogPost>('posts', { orderBy: 'date', limit: 12, asMap: true, where: ['category', '==', this.category] })
      .subscribe(list => this.posts.set(list));
  }
}

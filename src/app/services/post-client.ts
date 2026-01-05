import { Injectable, InjectionToken, inject } from '@angular/core';
import { Observable, map, of, tap } from 'rxjs';
import { BlogPost } from '@app/entities';
import { deleteFbDocument, readFbCollection, readFbDocument, updateFbDocument } from '@app/firebase';
import { GavListCache } from '@lib/helpers';

export const POST_CATEGORY = new InjectionToken<string>('post_category', { providedIn: 'root', factory: () => 'default' });

@Injectable()
export class PostClient {
  category = inject(POST_CATEGORY);
  cache = new GavListCache<BlogPost>(
    readFbCollection<BlogPost>(
      'posts',
      { orderBy: 'date', limit: 12, asMap: true, where: ['category', '==', this.category] },
    ),
  );

  post(id: string): Observable<BlogPost> {
    const foundPost = this.cache.get(id);

    if (foundPost) {
      return of(foundPost);
    }

    return readFbDocument<BlogPost>(`posts/${id}`).pipe(
      tap(post => this.cache.put(post)),
    );
  }

  savePost(post: Partial<BlogPost> & { id: string }): Observable<BlogPost> {
    const { id, ...updatedPost } = post;

    return updateFbDocument(`posts/${id}`, updatedPost).pipe(
        map(() => ({ ...updatedPost, id }) as BlogPost),
        tap(post => this.cache.put(post)),
      );
  }

  deletePost(id: string): Observable<void> {
    return deleteFbDocument(`posts/${id}`).pipe(
      tap(() => this.cache.delete(id)),
    );
  }
}

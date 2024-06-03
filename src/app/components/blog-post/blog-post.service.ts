import { Inject, Injectable, computed, signal } from '@angular/core';
import { Timestamp } from 'firebase/firestore/lite';
import { BlogPost } from '../../entity';
import { POST_CATEGORY } from '../../entity/blog_post';
import { deleteFbDocument, readFbCollection, readFbDocument, updateFbDocument } from '../../firebase';
import { Observable, map, of, tap } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class BlogPostService {
  private posts = signal<{ [id: string]: BlogPost }>({});

  postList = computed(() => Object.values(this.posts() || {}));

  constructor(
    @Inject(POST_CATEGORY) private category: string,
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

  savePost(post: BlogPost): Observable<BlogPost> {
    const { id, ...updatedPost } = post;
    updatedPost.updated = Timestamp.now();

    return updateFbDocument(`posts/${post.id}`, updatedPost)
      .pipe(map(() => ({ ...updatedPost, id })));
  }

  deletePost(id: string): void {
    deleteFbDocument(`post/${id}`).subscribe(() => {
      const updatedPosts = { ...this.posts() };
      delete updatedPosts[id];
      this.posts.set(updatedPosts);
    });
  }

  private initService() {
    readFbCollection<BlogPost>('posts', { orderBy: 'date', limit: 12, asMap: true })
      .subscribe(list => this.posts.set(list));
  }
}

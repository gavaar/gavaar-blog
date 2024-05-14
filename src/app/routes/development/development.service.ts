import { Injectable, computed, signal } from '@angular/core';
import { deleteFbDocument, readFbCollection, readFbDocument } from '../../firebase';
import { BlogPost } from '../../entity';
import { Observable, of } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class DevelopmentService {
  private posts = signal<{ [id: string]: BlogPost }>({});
  
  postList = computed(() => Object.values(this.posts() || {}));

  constructor() {
    readFbCollection<BlogPost>('dev', { orderBy: 'date', limit: 12, asMap: true }).subscribe(list => this.posts.set(list));
  }

  post(id: string): Observable<BlogPost> {
    const foundPost = this.posts()?.[id];

    if (foundPost) {
      return of(foundPost);
    }

    return readFbDocument(`dev/${id}`);
  }

  deletePost(id: string): void {
    deleteFbDocument(`dev/${id}`).subscribe(() => {
      const updatedPosts = { ...this.posts() };
      delete updatedPosts[id];
      this.posts.set(updatedPosts);
    });
  }
}

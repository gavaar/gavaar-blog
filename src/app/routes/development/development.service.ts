import { Injectable, computed } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { extractFbCollection, extractFbDocument } from '../../firebase';
import { BlogPost } from '../../entity';
import { Observable, of } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class DevelopmentService {
  private posts = toSignal(extractFbCollection<BlogPost>('dev', { orderBy: 'date', limit: 12, asMap: true }));
  
  postList = computed(() => Object.values(this.posts() || {}));

  post(id: string): Observable<BlogPost> {
    const foundPost = this.posts()?.[id];

    if (foundPost) {
      return of(foundPost);
    }

    return extractFbDocument(`dev/${id}`);
  }
}

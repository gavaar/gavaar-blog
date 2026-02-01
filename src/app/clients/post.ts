import { Injectable, InjectionToken, inject } from '@angular/core';
import { BlogPost } from '@app/entities/blog_post';
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

  async post(id: string): Promise<BlogPost> {
    const foundPost = this.cache.get(id);
    if (foundPost) return foundPost;

    const posts = await readFbDocument<BlogPost>(`posts/${id}`);
    this.cache.put(posts);
    return posts;
  }

  async savePost(post: Partial<BlogPost> & { id: string }): Promise<BlogPost> {
    const { id, ...updatedPost } = post;

    await updateFbDocument(`posts/${id}`, updatedPost);
    this.cache.put(post);
    return this.cache.get(id)!;
  }

  async deletePost(id: string): Promise<void> {
    await deleteFbDocument(`posts/${id}`);
    this.cache.delete(id);
  }
}

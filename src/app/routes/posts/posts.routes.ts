import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, Router, Routes } from '@angular/router';
import { PostClient, POST_CATEGORY } from '../../clients/post';
import { BlogPost } from '@app/entities/blog_post';

const loadPost = async (activatedRouteSnapshot: ActivatedRouteSnapshot): Promise<BlogPost | undefined> => {
  const postService = inject(PostClient);
  const router = inject(Router);
  const id = activatedRouteSnapshot.paramMap.get('id')!;
  const category = inject(POST_CATEGORY);

  try {
    const post = await postService.post(id);
    return post;
  } catch (_err) {
    router.navigateByUrl(category);
  }
  return;
}

const loadTitle = async (activatedRouteSnapshot: ActivatedRouteSnapshot): Promise<string> => {
  const bp = await loadPost(activatedRouteSnapshot);
  return `Gavaar | ${bp?.title || ''}`;
}

const loadPortrait = async (activatedRouteSnapshot: ActivatedRouteSnapshot): Promise<string> => {
  const bp = await loadPost(activatedRouteSnapshot);
  return bp?.assetURI || '';
}

export const POST_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./routes/post-list/post-list').then(c => c.GavPostList),
  },
  {
    path: 'new',
    loadComponent: () => import('./routes/blog-post/blog-post').then(c => c.GavBlogPost),
  },
  {
    path: ':id',
    loadComponent: () => import('./routes/blog-post/blog-post').then(c => c.GavBlogPost),
    title: loadTitle,
    resolve: { portrait: loadPortrait },
  },
];

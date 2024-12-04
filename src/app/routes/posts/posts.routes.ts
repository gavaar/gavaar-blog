import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, Router, Routes } from '@angular/router';
import { EMPTY, Observable, catchError, map } from 'rxjs';
import { PostClient, POST_CATEGORY } from '../../services/post-client';

const loadPost = (activatedRouteSnapshot: ActivatedRouteSnapshot) => {
  const postService = inject(PostClient);
  const router = inject(Router);
  const id = activatedRouteSnapshot.paramMap.get('id')!;
  const category = inject(POST_CATEGORY);

  const post = postService.post(id).pipe(
    catchError((_err) => {
      router.navigateByUrl(category);
      return EMPTY;
    }),
  );

  return post;
}

const loadTitle = (activatedRouteSnapshot: ActivatedRouteSnapshot): Observable<string> => {
  return loadPost(activatedRouteSnapshot).pipe(map(bp => `Gavaar | ${bp.title}`));
}

const loadPortrait = (activatedRouteSnapshot: ActivatedRouteSnapshot): Observable<string> => {
  return loadPost(activatedRouteSnapshot).pipe(map(bp => bp.assetURI));
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

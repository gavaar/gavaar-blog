import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, Router, Routes } from '@angular/router';
import { EMPTY, Observable, catchError, map } from 'rxjs';
import { BlogPostService, POST_CATEGORY } from '../../services/post.service';

const loadPost = (activatedRouteSnapshot: ActivatedRouteSnapshot) => {
  const postService = inject(BlogPostService);
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
    loadComponent: () => import('./routes/post-list/post-list.component').then(c => c.PostListComponent),
  },
  {
    path: 'new',
    loadComponent: () => import('./routes/blog-post/blog-post.component').then(c => c.BlogPostComponent),
  },
  {
    path: ':id',
    loadComponent: () => import('./routes/blog-post/blog-post.component').then(c => c.BlogPostComponent),
    title: loadTitle,
    resolve: { portrait: loadPortrait },
  },
];

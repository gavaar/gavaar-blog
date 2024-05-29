import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, Router, Routes } from '@angular/router';
import { DevelopmentService } from './development.service';
import { EMPTY, Observable, catchError, map } from 'rxjs';
import { BlogPost } from '../../entity';

const loadPost = (activatedRouteSnapshot: ActivatedRouteSnapshot): Observable<BlogPost> => {
  const postService = inject(DevelopmentService);
  const router = inject(Router);
  const id = activatedRouteSnapshot.paramMap.get('id')!;

  const post = postService.post(id).pipe(
    catchError((_err) => {
      alert('Error: this blog post does not exist');
      router.navigateByUrl('dev');

      return EMPTY;
    }),
  );

  return post;
}

const loadTitle = (activatedRouteSnapshot: ActivatedRouteSnapshot): Observable<string> => {
  return loadPost(activatedRouteSnapshot).pipe(map(bp => bp.title));
}

const loadPortrait = (activatedRouteSnapshot: ActivatedRouteSnapshot): Observable<string> => {
  return loadPost(activatedRouteSnapshot).pipe(map(bp => bp.assetURI));
}

export const DEVELOPMENT_ROUTES: Routes = [
  { path: '', loadComponent: () => import('./development.component').then(c => c.DevelopmentComponent) },
  {
    path: ':id',
    loadComponent: () => import('../../components/blog-post/blog-post.component').then(c => c.BlogPostComponent),
    title: loadTitle,
    resolve: { blogPost: loadPost, portraitImg: loadPortrait },
  },
];

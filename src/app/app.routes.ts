import { Routes } from '@angular/router';
import { BlogPostService, POST_CATEGORY } from './services/post.service';

export const APP_ROUTES: Routes = [
  {
    path: '',
    title: 'Gavaar\'s random notes',
    loadComponent: () => import('./routes/home/home.component').then(c => c.HomeComponent),
  },
  {
    path: 'admin',
    title: 'Gavaar\'s admin site',
    loadComponent: () => import('./routes/admin/admin.component').then(c => c.AdminComponent),
  },
  {
    path: 'cl',
    title: 'Gavaar\'s notes changelog',
    loadComponent: () => import('./routes/changelog/changelog.component').then(c => c.ChangelogComponent),
  },
  // BLOG RELATED ROUTES
  {
    path: 'dev',
    title: 'Gavaar | Development scribbles',
    loadChildren: () => import('./routes/posts/posts.routes').then(c => c.POST_ROUTES),
    providers: [
      {
        provide: POST_CATEGORY,
        useValue: 'dev',
      },
      BlogPostService,
    ],
    data: {
      title: 'Development scribbles',
      description: 'Below list are links lacking proper styling... this will be obvious later when this page is completed [W.I.P.]',
      bgImg: 'development.jpg'
    },
  },
  {
    path: 'car',
    title: 'Gavaar | Career notes',
    loadChildren: () => import('./routes/posts/posts.routes').then(c => c.POST_ROUTES),
    providers: [
      {
        provide: POST_CATEGORY,
        useValue: 'car',
      },
      BlogPostService,
    ],
    data: {
      title: 'Career notes',
      description: 'Empty career list for now [W.I.P.]',
      bgImg: 'career.jpg'
    },
  },
  { path: 'g', loadComponent: () => import('./routes/gaming/gaming.component').then(c => c.GamingComponent), data: { bgImg: 'gaming.jpg' } },
  { path: 'p', loadComponent: () => import('./routes/psychology/psychology.component').then(c => c.PsychologyComponent), data: { bgImg: 'psychology.jpg' } },
  { path: 's', loadComponent: () => import('./routes/selfcare/selfcare.component').then(c => c.SelfcareComponent), data: { bgImg: 'selfcare.jpg' } },
  // instead of 404ing we go to root. We should create a 404 route though.
  { path: '**', redirectTo: '', pathMatch: 'full' },
];

import { Routes } from '@angular/router';
import { BlogPostService, POST_CATEGORY } from './services/post.service';

// HIDDEN BLOG ROUTES
export const HIDDEN_BLOG_ROUTES: Routes = [
  {
    path: 'rand',
    title: 'Gavaar | Random notes',
    loadChildren: () => import('./routes/posts/posts.routes').then(c => c.POST_ROUTES),
    providers: [
      {
        provide: POST_CATEGORY,
        useValue: 'rand',
      },
      BlogPostService,
    ],
    data: {
      title: 'Random notes',
      description: 'These are notes that I would like to share, but not be indexed in the homepage',
      bgImg: 'rider.jpg',
      portraitImg: 'alpaca.jpg',
    },
  },
];

// BLOG RELATED ROUTES
export const BLOG_POST_ROUTES: Routes = [
  // {
  //   path: 'car',
  //   title: 'Gavaar | Career notes',
  //   loadChildren: () => import('./routes/posts/posts.routes').then(c => c.POST_ROUTES),
  //   providers: [
  //     {
  //       provide: POST_CATEGORY,
  //       useValue: 'car',
  //     },
  //     BlogPostService,
  //   ],
  //   data: {
  //     title: 'Career notes',
  //     description: 'Empty career list for now [W.I.P.]',
  //     bgImg: 'career.jpg'
  //   },
  // },
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
      title: 'Development',
      description: 'Below list are links lacking proper styling... this will be obvious later when this page is completed [W.I.P.]',
      bgImg: 'development.jpg',
      portraitImg: 'me_emosido_enganado.jpg',
    },
  },
  // {
  //   path: 'gam',
  //   title: 'Gavaar | Gaming notes',
  //   loadChildren: () => import('./routes/posts/posts.routes').then(c => c.POST_ROUTES),
  //   providers: [
  //     {
  //       provide: POST_CATEGORY,
  //       useValue: 'gam',
  //     },
  //     BlogPostService,
  //   ],
  //   data: {
  //     title: 'Gaming notes',
  //     description: 'Gaming notes (empty for now, W.I.P.)',
  //     bgImg: 'gaming.jpg'
  //   },
  // },
  // {
  //   path: 'psy',
  //   title: 'Gavaar | Psychology notes',
  //   loadChildren: () => import('./routes/posts/posts.routes').then(c => c.POST_ROUTES),
  //   providers: [
  //     {
  //       provide: POST_CATEGORY,
  //       useValue: 'psy',
  //     },
  //     BlogPostService,
  //   ],
  //   data: {
  //     title: 'Psychology notes',
  //     description: 'Psychology notes (empty for now, W.I.P.)',
  //     bgImg: 'psychology.jpg'
  //   },
  // },
  {
    path: 'sel',
    title: 'Gavaar | Selfcare notes',
    loadChildren: () => import('./routes/posts/posts.routes').then(c => c.POST_ROUTES),
    providers: [
      {
        provide: POST_CATEGORY,
        useValue: 'sel',
      },
      BlogPostService,
    ],
    data: {
      title: 'Selfcare notes',
      description: 'Selfcare notes (empty for now, W.I.P.)',
      bgImg: 'selfcare.jpg'
    },
  },
];

export const APP_ROUTES: Routes = [
  {
    path: '',
    title: 'Gavaar\'s random notes',
    loadComponent: () => import('./routes/home/home.component').then(c => c.HomeComponent),
    data: {
      portraitImg: 'me_emosido_enganado.jpg',
    }
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
  ...HIDDEN_BLOG_ROUTES,
  ...BLOG_POST_ROUTES,
  // instead of 404ing we go to root. We should create a 404 route though.
  { path: '**', redirectTo: '', pathMatch: 'full' },
];

import { Routes } from '@angular/router';
import { BlogPostService, POST_CATEGORY } from '@app/services/post.service';

const ROUTE_ASSESTS = {
  RAND: {
    BG_IMAGE: 'rider.jpg',
    PORTRAIT_IMAGE: 'alpaca.jpg',
  },
  DEV: {
    BG_IMAGE: 'development.jpg',
    PORTRAIT_IMAGE: 'me_emosido_enganado.jpg',
  },
  SEL: {
    BG_IMAGE: 'selfcare.jpg',
    PORTRAIT_IMAGE: null,
  },
  POE: {
    BG_IMAGE: 'https://lh3.googleusercontent.com/pw/AP1GczMyMdulQR7egY9xiRggwvCVPMX6OK17uHG0pckgNvPTkaD9ZzZOIbXFnuBNXDBXPSAYC1JX0ZJvV9SiTZEvINIlTU682bb4Hqn6wNeGvzOjM6NG-IyQZ-k_tefwQbURhI0p3SaP-JIOFFlLbGT3TINEYg=w1440-h900-s-no-gm?authuser=0',
    PORTRAIT_IMAGE: 'writing.jpg',
  },
} as const;

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
      bgImg: ROUTE_ASSESTS.RAND.BG_IMAGE,
      portraitImg: ROUTE_ASSESTS.RAND.PORTRAIT_IMAGE,
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
      bgImg: ROUTE_ASSESTS.DEV.BG_IMAGE,
      portraitImg: ROUTE_ASSESTS.DEV.PORTRAIT_IMAGE,
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
      bgImg: ROUTE_ASSESTS.SEL.BG_IMAGE,
      portraitImg: ROUTE_ASSESTS.SEL.PORTRAIT_IMAGE,
    },
  },
];

export const EXTERNAL_ROUTES: Routes = [
  {
    path: 'poe',
    title: 'Gavaar | Poetry extracts',
    loadChildren: () => import('./routes/posts/posts.routes').then(c => c.POST_ROUTES),
    providers: [
      {
        provide: POST_CATEGORY,
        useValue: 'poe',
      },
      BlogPostService,
    ],
    data: {
      title: 'Poetry',
      description: 'I\'m not a poetry guy, but some of these are extracts that I wanted to add here as to have easy access to them',
      bgImg: ROUTE_ASSESTS.POE.BG_IMAGE,
      portraitImg: ROUTE_ASSESTS.POE.PORTRAIT_IMAGE,
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
  ...EXTERNAL_ROUTES,
  ...BLOG_POST_ROUTES,
  // instead of 404ing we go to root. We should create a 404 route though.
  { path: '**', redirectTo: '', pathMatch: 'full' },
];

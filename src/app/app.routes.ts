import { Route, Routes } from '@angular/router';
import { BlogPostService, POST_CATEGORY } from '@app/services/post.service';
import { GavIcon } from '@lib/icon';

export const HOME_DATA = {
  title: 'Home',
  icon: GavIcon.Home,
  bg: 'default_bg.jpg',
  routerLink: '',
};

export const BLOG_DATA = {
  DEV: {
    title: 'Development',
    description: 'Below list are links lacking proper styling... this will be obvious later when this page is completed [W.I.P.]',
    bg: 'category/development/bg.jpg',
    portrait: 'category/development/portrait.jpg',
    routerLink: 'dev',
  },
  SEL: {
    title: 'Selfcare',
    description: 'Selfcare notes (empty for now, W.I.P.)',
    bg: 'category/selfcare/bg.jpg',
    portrait: 'category/selfcare/portrait.jpg',
    routerLink: 'sel',
  },
};

export const EXTERNAL_DATA = {
  POE: {
    title: 'Poetry',
    bg: 'category/poetry/bg.jpg',
    routerLink: 'poe',
    portrait: 'category/poetry/portrait.jpg',
  },
};

export const FOOTER_DATA = {
  ABOUT: {
    title: 'About',
    routerLink: 'about',
    bg: 'category/about/bg.jpg',
    portrait: 'category/about/portrait.jpg',
  },
  CHANGELOG: {
    title: 'Changelog',
    routerLink: 'cl',
    icon: GavIcon.Changelog,
    bg: 'category/changelog/bg.jpg',
  },
  ACCOUNT: {
    title: 'Account',
    routerLink:'acc',
    icon: GavIcon.Account,
    bg: 'category/account/bg.jpg',
  }
};

export const HIDDEN_DATA = {
  RAND: {
    title: 'Random',
    routerLink: 'rand',
    description: 'These are notes that I would like to share, but not be indexed in the homepage',
    bg: 'category/rand/bg.jpg',
    portrait: 'category/rand/portrait.jpg',
  }
};

const HOME_ROUTE: Route = {
  path: HOME_DATA.routerLink,
  title: 'Gavaar | All purpose site',
  loadComponent: () => import('./routes/home/home.component').then(c => c.HomeComponent),
  data: {
    ...HOME_DATA,
    portrait: 'default_portrait.jpg',
  },
};

// BLOG RELATED ROUTES
const BLOG_POST_ROUTES: Routes = [
  {
    path: BLOG_DATA.DEV.routerLink,
    title: `Gavaar | ${BLOG_DATA.DEV.title}`,
    loadChildren: () => import('./routes/posts/posts.routes').then(c => c.POST_ROUTES),
    providers: [
      {
        provide: POST_CATEGORY,
        useValue: 'dev',
      },
      BlogPostService,
    ],
    data: BLOG_DATA.DEV,
  },
  {
    path: BLOG_DATA.SEL.routerLink,
    title: `Gavaar | ${BLOG_DATA.SEL.title}`,
    loadChildren: () => import('./routes/posts/posts.routes').then(c => c.POST_ROUTES),
    providers: [
      {
        provide: POST_CATEGORY,
        useValue: 'sel',
      },
      BlogPostService,
    ],
    data: BLOG_DATA.SEL,
  },
  // {
  //   path: 'car',
  //   title: 'Gavaar | Gavaar | Career notes',
  //   loadChildren: () => import('./routes/posts/posts.routes').then(c => c.POST_ROUTES),
  //   providers: [
  //     {
  //       provide: POST_CATEGORY,
  //       useValue: 'car',
  //     },
  //     BlogPostService,
  //   ],
  //   data: {
  //     title: 'Gavaar | Career notes',
  //     description: 'Empty career list for now [W.I.P.]',
  //     bg: 'career.jpg'
  //   },
  // },
  // {
  //   path: 'gam',
  //   title: 'Gavaar | Gavaar | Gaming notes',
  //   loadChildren: () => import('./routes/posts/posts.routes').then(c => c.POST_ROUTES),
  //   providers: [
  //     {
  //       provide: POST_CATEGORY,
  //       useValue: 'gam',
  //     },
  //     BlogPostService,
  //   ],
  //   data: {
  //     title: 'Gavaar | Gaming notes',
  //     description: 'Gaming notes (empty for now, W.I.P.)',
  //     bg: 'gaming.jpg'
  //   },
  // },
  // {
  //   path: 'psy',
  //   title: 'Gavaar | Gavaar | Psychology notes',
  //   loadChildren: () => import('./routes/posts/posts.routes').then(c => c.POST_ROUTES),
  //   providers: [
  //     {
  //       provide: POST_CATEGORY,
  //       useValue: 'psy',
  //     },
  //     BlogPostService,
  //   ],
  //   data: {
  //     title: 'Gavaar | Psychology notes',
  //     description: 'Psychology notes (empty for now, W.I.P.)',
  //     bg: 'psychology.jpg'
  //   },
  // },
];

// HIDDEN BLOG ROUTES
const HIDDEN_BLOG_ROUTES: Routes = [
  {
    path: HIDDEN_DATA.RAND.routerLink,
    title: `Gavaar | ${HIDDEN_DATA.RAND.title}`,
    loadChildren: () => import('./routes/posts/posts.routes').then(c => c.POST_ROUTES),
    providers: [
      {
        provide: POST_CATEGORY,
        useValue: 'rand',
      },
      BlogPostService,
    ],
    data: HIDDEN_DATA.RAND,
  },
];

const EXTERNAL_ROUTES: Routes = [
  {
    path: EXTERNAL_DATA.POE.routerLink,
    title: `Gavaar | ${EXTERNAL_DATA.POE.title}`,
    loadChildren: () => import('./routes/posts/posts.routes').then(c => c.POST_ROUTES),
    providers: [
      {
        provide: POST_CATEGORY,
        useValue: 'poe',
      },
      BlogPostService,
    ],
    data: EXTERNAL_DATA.POE,
  },
];

const EXTRA_ROUTES: Routes = [
  {
    path: FOOTER_DATA.CHANGELOG.routerLink,
    title: `Gavaar | ${FOOTER_DATA.CHANGELOG.title}`,
    loadComponent: () => import('./routes/changelog/changelog.component').then(c => c.ChangelogComponent),
    data: FOOTER_DATA.CHANGELOG,
  },
  {
    path: FOOTER_DATA.ABOUT.routerLink,
    title: `Gavaar | ${FOOTER_DATA.ABOUT.title}`,
    loadComponent: () => import('./routes/about/about.component').then(c => c.AboutComponent),
    data: FOOTER_DATA.ABOUT,
  },
  {
    path: FOOTER_DATA.ACCOUNT.routerLink,
    title: `Gavaar | ${FOOTER_DATA.ACCOUNT.title}`,
    loadComponent: () => import('./routes/account/account.component').then(c => c.AccountComponent),
    data: FOOTER_DATA.ACCOUNT,
  },
];

export const APP_ROUTES: Routes = [
  HOME_ROUTE,
  ...EXTRA_ROUTES,
  ...BLOG_POST_ROUTES,
  ...HIDDEN_BLOG_ROUTES,
  ...EXTERNAL_ROUTES,
  // instead of 404ing we go to root. We should create a 404 route though.
  { path: '**', redirectTo: '', pathMatch: 'full' },
];

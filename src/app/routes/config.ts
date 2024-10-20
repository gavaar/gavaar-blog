import { Route } from '@angular/router';
import { Memory, memory } from '@app/state';
import { BlogPostService, POST_CATEGORY } from '@app/services/post.service';
import { GavIcon } from '@lib/icon';
import { GavNavItemInput } from '@lib/sidenav/models';

export type RouteConfig = Route & GavNavItemInput & { description?: string };

export const HOME_DATA: RouteConfig = {
  title: 'Home',
  icon: GavIcon.Home,
  bg: 'default_bg.jpg',
  portrait: 'default_portrait.jpg',
  path: '',
  loadComponent: () => import('./home/home.component').then(c => c.HomeComponent),
};

export const BLOG_DATA: RouteConfig[] = [
  {
    title: 'Development',
    description: 'Some thoughts about software development. I could be dead wrong so.. yolo.',
    bg: 'category/development/bg.jpg',
    portrait: 'category/development/portrait.jpg',
    path: 'dev',
    providers: [
      {
        provide: POST_CATEGORY,
        useValue: 'dev',
      },
      BlogPostService,
    ],
    loadChildren: () => import('./posts/posts.routes').then(c => c.POST_ROUTES),
  },
  {
    title: 'Selfcare',
    description: 'Selfcare notes (empty for now, W.I.P.)',
    bg: 'category/selfcare/bg.jpg',
    portrait: 'category/selfcare/portrait.jpg',
    path: 'sel',
    providers: [
      {
        provide: POST_CATEGORY,
        useValue: 'sel',
      },
      BlogPostService,
    ],
    loadChildren: () => import('./posts/posts.routes').then(c => c.POST_ROUTES),
  },
];

export const EXTERNAL_DATA: RouteConfig[] = [
  {
    title: 'Poetry',
    bg: 'category/poetry/bg.jpg',
    path: 'poe',
    portrait: 'category/poetry/portrait.jpg',
    loadChildren: () => import('./posts/posts.routes').then(c => c.POST_ROUTES),
    providers: [
      {
        provide: POST_CATEGORY,
        useValue: 'poe',
      },
      BlogPostService,
    ],
  },
  {
    title: 'Enkrateia',
    description: 'State of power over something, usually a state of self-control and self-mastery where one holds power over one\'s own passions and instincts. This is how I try to live life.',
    path: 'enk',
    portrait: 'category/enkrateia/portrait.jpg',
    bg: 'category/enkrateia/bg.jpg',
    loadChildren: () => import('./posts/posts.routes').then(c => c.POST_ROUTES),
    providers: [
      {
        provide: POST_CATEGORY,
        useValue: 'enk',
      },
      BlogPostService,
    ],
  }
];

export const FOOTER_DATA: RouteConfig[] = [
  {
    title: 'Account',
    path:'acc',
    icon: GavIcon.Account,
    bg: 'category/account/bg.jpg',
    loadComponent: () => import('./account/account.component').then(c => c.AccountComponent),
  },
  {
    title: memory.get(Memory.Config).theme ? 'Psychopath' : 'Dark',
    icon: memory.get(Memory.Config).theme ? GavIcon.Sun : GavIcon.Moon,
    children: [],
    click() {
      const currentTheme = memory.get(Memory.Config).theme;
      this.icon = currentTheme ? GavIcon.Moon : GavIcon.Sun;
      this.title = currentTheme ? 'Dark' : 'Psychopath';
      memory.patch(Memory.Config, { theme: currentTheme ? '' : 'light' });
    },
  },
  {
    title: 'Changelog',
    path: 'cl',
    icon: GavIcon.Changelog,
    bg: 'category/changelog/bg.jpg',
    loadComponent: () => import('./changelog/changelog.component').then(c => c.ChangelogComponent),
  },
  {
    title: 'About',
    path: 'about',
    bg: 'category/about/bg.jpg',
    portrait: 'category/about/portrait.jpg',
    loadComponent: () => import('./about/about.component').then(c => c.AboutComponent),
  },
];

export const HIDDEN_DATA: RouteConfig[] = [
  {
    title: 'Random',
    path: 'rand',
    description: 'These are notes that I would like to share, but not be indexed in the homepage',
    bg: 'category/rand/bg.jpg',
    portrait: 'category/rand/portrait.jpg',
    providers: [
      {
        provide: POST_CATEGORY,
        useValue: 'rand',
      },
      BlogPostService,
    ],
    loadChildren: () => {
      memory.patch(Memory.HiddenRoutes, { show: true });
      return import('./posts/posts.routes').then(c => c.POST_ROUTES);
    },
  }
];

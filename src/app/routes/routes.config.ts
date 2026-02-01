import { Route } from '@angular/router';
import { Memory, memory } from '@app/state';
import { PostClient, POST_CATEGORY } from '@app/clients/post';
import { Icon, GavNavItemInput } from '@lib/components';
import { computed } from '@angular/core';
import { isAuthenticated } from './auth.guard';

export type RouteConfig = Route & GavNavItemInput & { description?: string };

export const HOME_DATA: RouteConfig = {
  title: 'Home',
  icon: Icon.Home,
  bg: 'default_bg.jpg',
  portrait: 'default_portrait.jpg',
  path: '',
  loadComponent: () => import('./home/home').then(c => c.Home),
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
      PostClient,
    ],
    loadChildren: () => import('./posts/posts.routes').then(c => c.POST_ROUTES),
  },
  // {
  //   title: 'Selfcare',
  //   description: 'Selfcare notes (empty for now, W.I.P.)',
  //   bg: 'category/selfcare/bg.jpg',
  //   portrait: 'category/selfcare/portrait.jpg',
  //   path: 'sel',
  //   providers: [
  //     {
  //       provide: POST_CATEGORY,
  //       useValue: 'sel',
  //     },
  //     PostClient,
  //   ],
  //   loadChildren: () => import('./posts/posts.routes').then(c => c.POST_ROUTES),
  // },
];

export const EXTERNAL_DATA: RouteConfig[] = [
  {
    title: 'Enkrateia',
    description: 'State of power over something, usually a state of self-control and self-mastery where one holds power over one\'s own passions and instincts.',
    path: 'enk',
    portrait: 'category/enkrateia/portrait.jpg',
    bg: 'category/enkrateia/bg.jpg',
    loadChildren: () => import('./posts/posts.routes').then(c => c.POST_ROUTES),
    providers: [
      {
        provide: POST_CATEGORY,
        useValue: 'enk',
      },
      PostClient,
    ],
  },
  {
    title: 'Poetry',
    path: 'poe',
    portrait: 'category/poetry/portrait.jpg',
    bg: 'category/poetry/bg.jpg',
    loadChildren: () => import('./posts/posts.routes').then(c => c.POST_ROUTES),
    providers: [
      {
        provide: POST_CATEGORY,
        useValue: 'poe',
      },
      PostClient,
    ],
  },
];

export const FOOTER_DATA: RouteConfig[] = [
  {
    title: 'Account',
    path:'acc',
    icon: Icon.Account,
    bg: 'category/account/bg.jpg',
    loadComponent: () => import('./account/account').then(c => c.Account),
  },
  {
    title: memory.get(Memory.Config).theme ? 'Psychopath' : 'Dark',
    icon: memory.get(Memory.Config).theme ? Icon.Sun : Icon.Moon,
    children: [],
    click() {
      const currentTheme = memory.get(Memory.Config).theme;
      this.icon = currentTheme ? Icon.Moon : Icon.Sun;
      this.title = currentTheme ? 'Dark' : 'Psychopath';
      memory.patch(Memory.Config, { theme: currentTheme ? '' : 'light' });
    },
  },
  {
    title: 'Changelog',
    path: 'cl',
    icon: Icon.Rewind,
    bg: 'category/changelog/bg.jpg',
    loadComponent: () => import('./changelog/changelog').then(c => c.Changelog),
  },
  {
    title: 'About',
    path: 'about',
    bg: 'category/about/bg.jpg',
    portrait: 'category/about/portrait.jpg',
    loadComponent: () => import('./about/about').then(c => c.About),
  },
];

export const TOOLS_DATA: RouteConfig[] = [
  {
    title: 'Task tracker',
    path: 'non-zero',
    description: 'Tools created to help pursue any custom lifestyle',
    bg: 'tools/bg.jpg',
    portrait: 'tools/non-zero/portrait.jpg',
    loadComponent: () => import('./non-zero/non-zero').then(c => c.NonZero),
    canActivate: [isAuthenticated],
  },
];

export const HIDDEN_DATA: RouteConfig[] = [
  {
    title: 'Random',
    path: 'rand',
    description: 'These are notes that I would like to share, but not be indexed in the homepage',
    bg: 'category/rand/bg.jpg',
    portrait: 'category/rand/portrait.jpg',
    hide: computed(() => !memory.watch(Memory.HiddenRoutes)().rand),
    providers: [
      {
        provide: POST_CATEGORY,
        useValue: 'rand',
      },
      PostClient,
    ],
    loadChildren: () => {
      memory.patch(Memory.HiddenRoutes, { rand: true });
      return import('./posts/posts.routes').then(c => c.POST_ROUTES);
    },
  },
  {
    title: 'Cooking',
    path: 'cook',
    description: 'I suck at cooking. So I put the few things I learned to make decent in here. Hidden because they are probably bad still',
    bg: 'category/cook/bg.jpg',
    portrait: 'category/cook/portrait.jpg',
    hide: computed(() => !memory.watch(Memory.HiddenRoutes)().cook),
    providers: [
      {
        provide: POST_CATEGORY,
        useValue: 'cook',
      },
      PostClient,
    ],
    loadChildren: () => {
      memory.patch(Memory.HiddenRoutes, { cook: true });
      return import('./posts/posts.routes').then(c => c.POST_ROUTES);
    },
  }
];

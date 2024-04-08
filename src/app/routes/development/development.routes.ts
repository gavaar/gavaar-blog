import { Routes } from '@angular/router';
import { LEARN_WEB_DEV } from './development.config';

export const DEVELOPMENT_ROUTES: Routes = [
  { path: '', loadComponent: () => import('./development.component').then(c => c.DevelopmentComponent) },
  { path: LEARN_WEB_DEV.url, loadComponent: () => import('./learn-web-dev/learn-web-dev.component').then(c => c.LearnWebDevComponent), data: { portraitImg: 'development/learn_web_dev/portrait.png' } },
];

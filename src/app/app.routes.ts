import { Routes } from '@angular/router';
import { POST_CATEGORY } from './entity/blog_post';

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
  { path: 'c', loadComponent: () => import('./routes/career/career.component').then(c => c.CareerComponent), data: { bgImg: 'career.jpg' } },
  {
    path: 'cl',
    title: 'Gavaar\'s notes changelog',
    loadComponent: () => import('./routes/changelog/changelog.component').then(c => c.ChangelogComponent),
  },
  {
    path: 'dev',
    title: 'Gavaar\'s development notes',
    loadChildren: () => import('./routes/development/development.routes').then(c => c.DEVELOPMENT_ROUTES),
    providers: [
      {
        provide: POST_CATEGORY,
        useValue: 'dev',
      }
    ],
    data: { bgImg: 'development.jpg' },
  },
  { path: 'g', loadComponent: () => import('./routes/gaming/gaming.component').then(c => c.GamingComponent), data: { bgImg: 'gaming.jpg' } },
  { path: 'p', loadComponent: () => import('./routes/psychology/psychology.component').then(c => c.PsychologyComponent), data: { bgImg: 'psychology.jpg' } },
  { path: 's', loadComponent: () => import('./routes/selfcare/selfcare.component').then(c => c.SelfcareComponent), data: { bgImg: 'selfcare.jpg' } },
  // instead of 404ing we go to root. We should create a 404 route though.
  { path: '**', redirectTo: '', pathMatch: 'full' },
];

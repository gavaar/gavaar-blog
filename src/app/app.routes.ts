import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', loadComponent: () => import('./routes/home/home.component').then(c => c.HomeComponent), data: { bgImg: 'bg_url.png' } },
  { path: 'c', loadComponent: () => import('./routes/career/career.component').then(c => c.CareerComponent), data: { bgImg: 'career.jpg' } },
  { path: 'cl', loadComponent: () => import('./routes/changelog/changelog.component').then(c => c.ChangelogComponent), data: { bgImg: 'bg_url.png' } },
  { path: 'd', loadComponent: () => import('./routes/development/development.component').then(c => c.DevelopmentComponent), data: { bgImg: 'development.jpg' } },
  { path: 'g', loadComponent: () => import('./routes/gaming/gaming.component').then(c => c.GamingComponent), data: { bgImg: 'gaming.jpg' } },
  { path: 'p', loadComponent: () => import('./routes/psychology/psychology.component').then(c => c.PsychologyComponent), data: { bgImg: 'psychology.jpg' } },
  { path: 's', loadComponent: () => import('./routes/selfcare/selfcare.component').then(c => c.SelfcareComponent), data: { bgImg: 'selfcare.jpg' } },
  // instead of 404ing we go to root. We should create a 404 route though.
  { path: '**', redirectTo: '', pathMatch: 'full' },
];

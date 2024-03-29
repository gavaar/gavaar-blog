import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', loadComponent: () => import('./routes/home/home.component').then(c => c.HomeComponent) },
  { path: 'changelog', loadComponent: () => import('./routes/changelog/changelog.component').then(c => c.ChangelogComponent) },
  // instead of 404ing we go to root. We should create a 404 route though.
  { path: '**', redirectTo: '', pathMatch: 'full' },
];

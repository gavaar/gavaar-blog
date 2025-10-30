import { Routes } from '@angular/router';
import { BLOG_DATA, EXTERNAL_DATA, FOOTER_DATA, HIDDEN_DATA, HOME_DATA, RouteConfig, TOOLS_DATA } from './routes/routes.config';

const buildRoutes = (routeConfigs: RouteConfig[]): Routes => {
  return routeConfigs
    .filter(conf => conf.loadChildren || conf.loadComponent)
    .map(config => ({
        path: config.path,
        title: `Gavaar | ${config.title === 'Home' ? 'All purpose site' : config.title }`,
        loadComponent: config.loadComponent,
        loadChildren: config.loadChildren,
        canActivate: config.canActivate,
        providers: config.providers,
        data: config,    
      })
    );
};

const HOME_ROUTE: Routes = buildRoutes([HOME_DATA]);
const TOOLS_ROUTE: Routes = buildRoutes(TOOLS_DATA);
const BLOG_POST_ROUTES: Routes = buildRoutes(BLOG_DATA);
const HIDDEN_BLOG_ROUTES: Routes = buildRoutes(HIDDEN_DATA);
const EXTERNAL_ROUTES: Routes = buildRoutes(EXTERNAL_DATA);
const EXTRA_ROUTES: Routes = buildRoutes(FOOTER_DATA);

export const APP_ROUTES: Routes = [
  ...HOME_ROUTE,
  ...TOOLS_ROUTE,
  ...BLOG_POST_ROUTES,
  ...HIDDEN_BLOG_ROUTES,
  ...EXTERNAL_ROUTES,
  ...EXTRA_ROUTES,
  // instead of 404ing we go to root. We should create a 404 route though.
  { path: '**', redirectTo: '', pathMatch: 'full' },
];

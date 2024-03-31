import { Routes } from '@angular/router';
import { canActivate, redirectUnauthorizedTo, redirectLoggedInTo } from '@angular/fire/auth-guard';

export const APP_ROUTES: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'home',
  },
  {
    path: 'auth',
    loadComponent: () => import('./views/auth/auth.component').then(m => m.AuthViewComponent),
    ...canActivate(() => redirectLoggedInTo([''])),
  },
  {
    path: 'home',
    loadChildren: () => import('./views/home/home.routes').then(m => m.APP_HOME_ROUTES),
    ...canActivate(() => redirectUnauthorizedTo(['auth'])),
  }
];

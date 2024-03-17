import { Routes } from '@angular/router';
import { AppSessionsViewComponent } from './views/sessions/sessions.component';
import { AppHomeViewComponent } from '../home/home.component';
import { UserApiService, UserStore } from '@data/user';
import { homePermissionGuard } from './home-permission.guard';

export const APP_HOME_ROUTES: Routes = [
  {
    path: '',
    component: AppHomeViewComponent,
    providers: [
      UserApiService,
      UserStore,
    ],
    canActivate: [homePermissionGuard],
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'sessions',
      },
      {
        path: 'sessions',
        component: AppSessionsViewComponent,
      }
    ]
  },
];

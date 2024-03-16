import { Routes } from '@angular/router';
import { AppSessionsViewComponent } from './views/sessions/sessions.component';
import { AppHomeViewComponent } from '../home/home.component';

export const APP_HOME_ROUTES: Routes = [
  {
    path: '',
    component: AppHomeViewComponent,
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

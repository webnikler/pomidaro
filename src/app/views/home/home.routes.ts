import { Route, Routes } from '@angular/router';
import { HomeViewComponent } from '../home/home.component';
import { UserApiService, UserStore } from '@data/user';
import { authGuard } from './guards/auth.guard';
import { SessionApiService, SessionCollectionStore, SessionStore } from '@data/session';
import { sessionCollectionResolver } from './resolvers/session-collection.resolver';
import { SessionTableStore } from '@data/session/session-table.store';
import { SESSION_ROUTES } from './screens/session/session.routes';
import { USER_ROUTES } from './screens/user/user.routes';

const ROOT: Route = {
  path: '',
  pathMatch: 'full',
  redirectTo: `session/`,
};

export const APP_HOME_ROUTES: Routes = [
  {
    path: '',
    component: HomeViewComponent,
    providers: [
      UserApiService,
      UserStore,
      SessionCollectionStore,
      SessionStore,
      SessionApiService,
      SessionTableStore,
    ],
    canActivate: [
      authGuard,
    ],
    resolve: {
      sessions: sessionCollectionResolver,
    },
    children: [
      ROOT,
      ...SESSION_ROUTES,
      ...USER_ROUTES,
    ]
  },
];

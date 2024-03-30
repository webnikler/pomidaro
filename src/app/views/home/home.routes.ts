import { AppUserViewComponent } from './views/user/user.component';
import { Routes } from '@angular/router';
import { AppSessionViewComponent } from './views/session/session.component';
import { AppHomeViewComponent } from '../home/home.component';
import { UserApiService, UserStore } from '@data/user';
import { authGuard } from './guards/auth.guard';
import { SessionApiService, SessionCollectionStore, SessionStore } from '@data/session';
import { sessionCollectionResolver } from './resolvers/session-collection.resolver';
import { sessionResolver } from './resolvers/session.resolver';
import { AppSessionTableViewComponent } from './views/session/views/table/session-table.component';
import { SessionTableStore } from '@data/session/session-table.store';
import { sessionTableResolver } from './resolvers/session-table.resolver';

export const APP_HOME_ROUTES: Routes = [
  {
    path: '',
    component: AppHomeViewComponent,
    providers: [
      UserApiService,
      UserStore,
      SessionCollectionStore,
      SessionStore,
      SessionApiService,
      SessionTableStore,
    ],
    canActivate: [authGuard],
    resolve: {
      sessions: sessionCollectionResolver,
    },
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: `session/`,
      },
      {
        path: 'session/:id',
        component: AppSessionViewComponent,
        resolve: {
          session: sessionResolver,
        },
        children: [
          {
            path: '',
            pathMatch: 'full',
            redirectTo: 'table'
          },
          {
            path: 'table',
            component: AppSessionTableViewComponent,
            resolve: {
              table: sessionTableResolver,
            }
          }
        ]
      },
      {
        path: 'user',
        component: AppUserViewComponent,
      }
    ]
  },
];

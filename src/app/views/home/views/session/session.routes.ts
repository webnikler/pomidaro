import { Routes } from '@angular/router';
import { sessionTableResolver } from '../../resolvers/session-table.resolver';
import { sessionResolver } from '../../resolvers/session.resolver';
import { SessionViewComponent } from './session.component';
import { SessionTableViewComponent } from './views/table/session-table.component';
import { SessionCreateViewComponent } from './views/create/session-create.component';
import { createSessionResolver } from '../../resolvers/create-session.resolver';

export const SESSION_ROUTES: Routes = [
  {
    path: 'session/create',
    component: SessionViewComponent,
    resolve: {
      session: createSessionResolver,
    },
    children: [
      {
        path: '',
        component: SessionCreateViewComponent,
      },
    ],
  },
  {
    path: 'session/:id',
    component: SessionViewComponent,
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
        component: SessionTableViewComponent,
        resolve: {
          table: sessionTableResolver,
        }
      }
    ]
  },
];

import { Routes } from '@angular/router';
import { sessionTableResolver } from '../../resolvers/session-table.resolver';
import { sessionResolver } from '../../resolvers/session.resolver';
import { SessionViewComponent } from './session.component';
<<<<<<< HEAD:src/app/views/home/screens/session/session.routes.ts
import { SessionTableViewComponent } from './table/session-table.component';
import { SessionSettingsComponent } from './settings/settings.component';
=======
import { SessionTableViewComponent } from './views/table/session-table.component';
import { SessionSettingsComponent } from './views/settings/settings.component';
>>>>>>> bb1eeb81d164267f233a26cb812c555afedde278:src/app/views/home/views/session/session.routes.ts
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
        component: SessionSettingsComponent,
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

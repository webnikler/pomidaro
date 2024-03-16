import { Route, Routes } from '@angular/router';
import { AuthComponent } from './views/auth/auth.component';
import { AppRoutePath } from './routes/paths';

const root: Route = {
  path: AppRoutePath.root,
  redirectTo: AppRoutePath.auth,
  pathMatch: 'full',
}

const auth: Route = {
  path: AppRoutePath.auth,
  component: AuthComponent,
};

export const routes: Routes = [root, auth];

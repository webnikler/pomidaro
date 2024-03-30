import { Component, effect, inject } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { AuthStore } from '@data/auth';
import { MatSidenavModule } from '@angular/material/sidenav';
import { AppHomeHeaderComponent } from './components/header/header.component';
import { AppHomeSidenavComponent } from './components/sidenav/sidenav.component';
import { MatTabNavPanel } from '@angular/material/tabs';

@Component({
  selector: 'app-home-view',
  standalone: true,
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
  imports: [
    MatSidenavModule,
    RouterOutlet,
    AppHomeHeaderComponent,
    AppHomeSidenavComponent,
    MatTabNavPanel,
  ],
})
export class AppHomeViewComponent {
  private readonly auth = inject(AuthStore);
  private readonly router = inject(Router);

  constructor() {
    effect(() => {
      if (!this.auth.isAuth()) {
        this.router.navigate(['auth']);
      }
    });
  }
}

import { Component, effect, inject } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { AuthStore } from '@data/auth';
import { MatSidenavModule } from '@angular/material/sidenav';
import { HomeHeaderComponent } from './components/header/header.component';
import { HomeSidenavComponent } from './components/sidenav/sidenav.component';
import { MatTabNavPanel } from '@angular/material/tabs';

@Component({
  selector: 'app-home-view',
  standalone: true,
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
  imports: [
    MatSidenavModule,
    RouterOutlet,
    HomeHeaderComponent,
    HomeSidenavComponent,
    MatTabNavPanel,
  ],
})
export class HomeViewComponent {
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

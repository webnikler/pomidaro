import { Component, effect, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { AsyncPipe } from '@angular/common';
import { Router } from '@angular/router';
import { AuthStore } from '@data/auth';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-auth-view',
  standalone: true,
  templateUrl: './auth.component.html',
  styleUrl: './auth.component.scss',
  imports: [
    MatButtonModule,
    MatIconModule,
    MatSidenavModule,
    MatToolbarModule,
    MatCardModule,
    AsyncPipe,
  ],
})
export class AuthViewComponent {
  private readonly auth = inject(AuthStore);
  private readonly router = inject(Router);

  signIn() {
    this.auth.signIn();
  }

  constructor() {
    effect(() => {
      if (this.auth.isAuth()) {
        this.router.navigate(['']);
      }
    });
  }
}

import { Component, effect, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { AsyncPipe } from '@angular/common';
import { Router } from '@angular/router';
import { AuthStore } from '../../stores/auth.store';

@Component({
  selector: 'app-auth-view',
  standalone: true,
  templateUrl: './auth.component.html',
  styleUrl: './auth.component.scss',
  imports: [MatButtonModule, MatIconModule, AsyncPipe],
})
export class AppAuthViewComponent {
  private readonly auth = inject(AuthStore);
  private readonly router = inject(Router);

  signIn() {
    this.auth.signIn();
  }

  constructor() {
    effect(() => {
      if (this.auth.user()) {
        this.router.navigate(['']);
      }
    });
  }
}

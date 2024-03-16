import { Component, effect, inject } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { AuthStore } from '../../stores/auth.store';

@Component({
  selector: 'app-home-view',
  standalone: true,
  template: '<router-outlet />',
  imports: [RouterOutlet],
})
export class AppHomeViewComponent {
  private readonly auth = inject(AuthStore);
  private readonly router = inject(Router);

  constructor() {
    effect(() => {
      if (!this.auth.user()) {
        this.router.navigate(['auth']);
      }
    });
  }
}

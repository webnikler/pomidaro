import { NgIf } from '@angular/common';
import { Component, effect, inject } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { UsersApiService } from '@services';
import { AuthStore } from '@stores';
import { AppUserStore } from 'app/stores/user.store';

@Component({
  selector: 'app-home-view',
  standalone: true,
  template: '<router-outlet *ngIf="!isLoading" />',
  providers: [
    UsersApiService,
    AppUserStore,
  ],
  imports: [RouterOutlet, NgIf],
})
export class AppHomeViewComponent {
  private readonly auth = inject(AuthStore);
  private readonly user = inject(AppUserStore);
  private readonly router = inject(Router);

  get isLoading() {
    return this.user.loading();
  }

  constructor() {
    this.user.requestUser();

    effect(() => {
      if (!this.auth.isAuth()) {
        this.router.navigate(['auth']);
      }
    });
  }
}

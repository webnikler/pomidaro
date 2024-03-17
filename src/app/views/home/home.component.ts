import { NgIf } from '@angular/common';
import { Component, effect, inject } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { AuthStore } from '@data/auth';
import { UserApiService, UserStore } from '@data/user';

@Component({
  selector: 'app-home-view',
  standalone: true,
  template: '<router-outlet *ngIf="!isLoading" />',
  providers: [
    UserApiService,
    UserStore,
  ],
  imports: [RouterOutlet, NgIf],
})
export class AppHomeViewComponent {
  private readonly auth = inject(AuthStore);
  private readonly user = inject(UserStore);
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

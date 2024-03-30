import { AsyncPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UserStore } from '@data/user';
import { map } from 'rxjs';

@Component({
  selector: 'app-user-view',
  standalone: true,
  templateUrl: './user.component.html',
  styleUrl: './user.component.scss',
  imports: [
    AsyncPipe,
  ],
})
export class AppUserViewComponent {
  private readonly route = inject(ActivatedRoute);

  readonly mode$ = this.route.data.pipe(map(data => data['mode']));

  user = inject(UserStore);
}

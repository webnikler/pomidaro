import { JsonPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { AuthStore } from '@data/auth';
import { SessionApiService, SessionCollectionStore } from '@data/session';
import { UserStore } from '@data/user';

@Component({
  selector: 'app-sessions-view',
  standalone: true,
  templateUrl: './sessions.component.html',
  styleUrl: './sessions.component.scss',
  imports: [
    JsonPipe,
  ],
  providers: [
    SessionApiService,
    SessionCollectionStore,
  ],
})
export class AppSessionsViewComponent {
  public readonly user = inject(UserStore);
  public readonly auth = inject(AuthStore);
  public readonly sessions = inject(SessionCollectionStore);

  constructor() {
    this.sessions.requestUserSessions(this.user.data().id);
  }
}

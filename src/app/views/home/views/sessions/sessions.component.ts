import { JsonPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { SessionsApiService } from '@services';
import { AuthStore, SessionCollectionStore } from '@stores';
import { AppUserStore } from 'app/stores/user.store';

@Component({
  selector: 'app-sessions-view',
  standalone: true,
  templateUrl: './sessions.component.html',
  styleUrl: './sessions.component.scss',
  imports: [
    JsonPipe,
  ],
  providers: [
    SessionsApiService,
    SessionCollectionStore,
  ],
})
export class AppSessionsViewComponent {
  public readonly user = inject(AppUserStore);
  public readonly auth = inject(AuthStore);
  public readonly sessions = inject(SessionCollectionStore);

  constructor() {
    this.sessions.requestUserSessions(this.user.data().id);
  }
}

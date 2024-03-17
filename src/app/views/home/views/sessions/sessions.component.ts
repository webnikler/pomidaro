import { JsonPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { AuthStore, SessionCollectionStore } from '@stores';

@Component({
  selector: 'app-sessions-view',
  standalone: true,
  templateUrl: './sessions.component.html',
  styleUrl: './sessions.component.scss',
  imports: [
    JsonPipe,
  ],
  providers: [
    SessionCollectionStore,
  ],
})
export class AppSessionsViewComponent {
  public readonly auth = inject(AuthStore);
  public readonly sessionCollection = inject(SessionCollectionStore);

  constructor() {
    this.sessionCollection.requestUserSessions(this.auth.uid());
  }
}

import { MatTabNav } from '@angular/material/tabs';
import { NgIf } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { Router, RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatTabsModule } from '@angular/material/tabs';
import { SessionCollectionStore, SessionStore } from '@data/session';
import { Id } from '@data/common/types';

@Component({
  selector: 'app-home-header',
  standalone: true,
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
  imports: [
    NgIf,
    MatIcon,
    RouterLink,
    MatButtonModule,
    MatToolbarModule,
    FlexLayoutModule,
    MatTabNav,
    MatTabsModule,
  ],
})
export class AppHomeHeaderComponent {
  private readonly sessionCollection = inject(SessionCollectionStore);
  private readonly session = inject(SessionStore);
  private readonly router = inject(Router);

  get currentSessionId() {
    return this.session.data()?.id;
  }

  get sessions() {
    return this.sessionCollection.sortedSessions();
  }

  selectSession(id: Id) {
    this.router.navigate(['home/session', id]);
  }
}

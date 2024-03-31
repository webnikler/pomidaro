import { MatTabNav } from '@angular/material/tabs';
import { NgIf } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatTabsModule } from '@angular/material/tabs';
import { SessionCollectionStore } from '@data/session';

@Component({
  selector: 'app-home-header',
  standalone: true,
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
  imports: [
    NgIf,
    MatIcon,
    RouterLink,
    RouterLinkActive,
    MatButtonModule,
    MatToolbarModule,
    FlexLayoutModule,
    MatTabNav,
    MatTabsModule,
  ],
})
export class HomeHeaderComponent {
  private readonly sessionCollection = inject(SessionCollectionStore);

  get sessions() {
    return this.sessionCollection.sortedSessions();
  }
}

import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router, RouterOutlet } from '@angular/router';
import { SessionCollectionStore } from '@data/session';

@Component({
  selector: 'app-session-view',
  standalone: true,
  template: '<router-outlet></router-outlet>',
  imports: [
    RouterOutlet,
  ],
})
export class AppSessionViewComponent {
  private readonly sessionCollection = inject(SessionCollectionStore);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  private get isEmptyId() {
    return this.route.snapshot.params['id'] === '';
  }

  private get lastSessionId() {
    return this.sessionCollection.sortedSessions()[0]?.id;
  }

  ngOnInit() {
    if (this.isEmptyId) {
      this.router.navigate(['home/session', this.lastSessionId]);
    }
  }
}

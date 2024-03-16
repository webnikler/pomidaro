import { Component, inject } from '@angular/core';
import { AuthStore } from '../../../../stores/auth.store';

@Component({
  selector: 'app-sessions-view',
  standalone: true,
  templateUrl: './sessions.component.html',
  styleUrl: './sessions.component.scss',
})
export class AppSessionsViewComponent {
  public readonly authStore = inject(AuthStore);
}

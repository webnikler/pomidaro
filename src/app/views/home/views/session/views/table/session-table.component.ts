import { Component, inject } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { SessionTableStore } from '@data/session/session-table.store';

@Component({
  selector: 'app-session-table-view',
  standalone: true,
  templateUrl: './session-table.component.html',
  styleUrl: './session-table.component.scss',
  imports: [
    MatTableModule,
    MatIcon,
    MatProgressSpinnerModule,
  ],
})
export class AppSessionTableViewComponent {
  readonly table = inject(SessionTableStore);
}

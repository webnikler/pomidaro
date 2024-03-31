import { Component, inject } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { SessionTableStore } from '@data/session/session-table.store';
import { SessionTableTdComponent } from './session-table-td/session-table-td.component';
import { SessionTableThComponent } from './session-table-th/session-table-th.component';

@Component({
  selector: 'app-session-table-view',
  standalone: true,
  templateUrl: './session-table.component.html',
  styleUrl: './session-table.component.scss',
  imports: [
    MatTableModule,
    MatIcon,
    SessionTableTdComponent,
    SessionTableThComponent,
  ],
})
export class SessionTableViewComponent {
  readonly table = inject(SessionTableStore);
}

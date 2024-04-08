import { Component, inject } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { SessionTableStore } from '@data/session/session-table.store';
import { SessionTableTdComponent } from './cells/session-table-td/session-table-td.component';
import { SessionTableThComponent } from './cells/session-table-th/session-table-th.component';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { NgIf } from '@angular/common';
import { SessionStore } from '@data/session';
import { MatRippleModule } from '@angular/material/core';
import { MarkModalComponent } from './cell-dialog/cell-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { SessionCell } from '@data/session/session.models';

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
    MatProgressBarModule,
    NgIf,
    MatRippleModule,
    MarkModalComponent,
  ],
})
export class SessionTableViewComponent {
  readonly session = inject(SessionStore);
  readonly table = inject(SessionTableStore);

  private readonly dialog = inject(MatDialog);

  openCellDialog(cell: SessionCell) {
    const session = this.session.data();

    this.dialog.open(MarkModalComponent, {
      data: { cell, session },
      autoFocus: false,
    });
  }
}

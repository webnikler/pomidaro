import { parse } from 'date-fns';
import { Component, inject } from '@angular/core';
import { MatButton, MatIconButton } from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialogTitle,
  MatDialogContent,
  MatDialogActions,
  MatDialogClose,
} from '@angular/material/dialog';

import { MatIcon } from '@angular/material/icon';
import { MatFormField, MatInput, MatPrefix, MatSuffix } from '@angular/material/input';
import { SESSION_ROW_TRACKING_TYPE } from '@data/session';
import { SessionCellInputComponent } from '../../common/components/session-cell-input/session-cell-input.component';
import { ExtendedSession, SESSION_COL_TYPE, SessionCell } from '@data/session/session.models';
import { MatDivider } from '@angular/material/divider';
import { SessionTableTdComponent } from '../cells/session-table-td/session-table-td.component';
import { WeekdayComponent } from '@shared/components/weekday/weekday.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { DatePipe, NgIf } from '@angular/common';
import { MatChipsModule } from '@angular/material/chips'

@Component({
  selector: 'cell-dialog',
  standalone: true,
  templateUrl: './cell-dialog.component.html',
  styleUrl: './cell-dialog.component.scss',
  imports: [
    MatDialogActions,
    MatDialogClose,
    MatDialogTitle,
    MatDialogContent,
    MatButton,
    MatInput,
    MatFormField,
    MatSuffix,
    MatPrefix,
    MatIcon,
    MatIconButton,
    SessionCellInputComponent,
    MatDivider,
    SessionTableTdComponent,
    WeekdayComponent,
    FlexLayoutModule,
    NgIf,
    MatChipsModule,
    DatePipe,
  ]
})
export class MarkModalComponent {
  data: { session: ExtendedSession, cell: SessionCell } = inject(MAT_DIALOG_DATA);

  value: number | boolean | string = '';
  rowName = '';
  colType = SESSION_COL_TYPE.default;
  date = new Date();
  weekday = '';

  readonly TYPE = SESSION_ROW_TRACKING_TYPE;

  ngOnInit() {
    const { rows, cols } = this.data.session;
    const { cell } = this.data;
    const row = rows.find(({ id }) => id === cell.rowId);
    const col = cols.find(({ id }) => id === cell.colId);

    this.rowName = row?.name ?? '';
    this.date = parse(col?.displayedDate ?? '', 'dd.MM.yyyy', new Date());
    this.weekday = col?.weekdayShort ?? '';
    this.colType = col?.type ?? SESSION_COL_TYPE.default;
    this.value = cell.value;
  }
}

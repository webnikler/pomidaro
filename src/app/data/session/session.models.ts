import {
  OriginalSession,
  OriginalSessionCell,
  OriginalSessionCol,
  OriginalSessionExtensions,
  OriginalSessionRow,
} from './session.types';
import { Timestamp } from '@angular/fire/firestore';

const EMPTY_SESSION: OriginalSession = {
  id: '',
  ownerId: '',
  name: '',
  created: Timestamp.now(),
};

const EMPTY_SESSION_CELL: OriginalSessionCell = {
  id: '',
  colId: '',
  rowId: '',
  value: 0,
};

const EMPTY_SESSION_EXTENTIONS: OriginalSessionExtensions = {
  rows: [],
  cols: [],
  cells: [],
};

const EMPTY_SESSION_ROW: OriginalSessionRow = {
  trackingType: 'unknown',
  editable: false,
  minValue: 0,
  id: '',
  name: '',
  index: 0,
};

const EMPTY_SESSION_COL: OriginalSessionCol = {
  type: 'default',
  date: Timestamp.now(),
  id: '',
};

export enum SESSION_COL_TYPE {
  default,
  weekend,
  pomidaro,
}

export enum SESSION_ROW_TRACKING_TYPE {
  unknown,
  pomidaro,
  time,
  mark,
  count,
}

export class Session implements Omit<OriginalSession, 'created'> {
  id = EMPTY_SESSION.id;
  ownerId = EMPTY_SESSION.ownerId;
  name = EMPTY_SESSION.name;

  created = EMPTY_SESSION.created.toDate();

  constructor(session = EMPTY_SESSION) {
    Object.assign(this, session);
    this.created = session.created.toDate();
  }
};

export class ExtendedSession extends Session {
  cols: SessionCol[] = [];
  rows: SessionRow[] = [];

  constructor(originalSession = EMPTY_SESSION, { rows, cols, cells } = EMPTY_SESSION_EXTENTIONS) {
    super(originalSession);

    this.cols = cols.map(col => new SessionCol(col)).sort((a, b) => +a.date - +b.date);
    this.rows = rows.map(row => new SessionRow(row, cells, this.cols)).sort((a, b) => a.index - b.index);
  }
}

export class SessionCol implements Omit<OriginalSessionCol, 'date' | 'type'> {
  type = SESSION_COL_TYPE[EMPTY_SESSION_COL.type];
  date = EMPTY_SESSION_COL.date.toDate();
  id = EMPTY_SESSION_COL.id;

  displayedDate = '';
  weekday = '';
  weekdayShort = '';

  constructor(col = EMPTY_SESSION_COL) {
    Object.assign(this, col);

    this.date = col.date.toDate();
    this.type = SESSION_COL_TYPE[col.type];
    this.displayedDate = this.date.toLocaleDateString('ru-RU');
    this.weekday = this.date.toLocaleDateString('ru-RU', { weekday: 'long' });
    this.weekdayShort = this.date.toLocaleDateString('ru-RU', { weekday: 'short' });
  }
}

export class SessionRow implements Omit<OriginalSessionRow, 'trackingType'> {
  trackingType = SESSION_ROW_TRACKING_TYPE[EMPTY_SESSION_ROW.trackingType];
  editable = EMPTY_SESSION_ROW.editable;
  minValue = EMPTY_SESSION_ROW.minValue;
  id = EMPTY_SESSION_ROW.id;
  name = EMPTY_SESSION_ROW.name;
  index = EMPTY_SESSION_ROW.index;

  cells: SessionCell[] = [];

  constructor(row = EMPTY_SESSION_ROW, cells: OriginalSessionCell[] = [], sortedCols: SessionCol[] = []) {
    Object.assign(this, row);

    this.trackingType = SESSION_ROW_TRACKING_TYPE[row.trackingType];
    this.cells = this.buildCells(cells, sortedCols);
  }

  private buildCells(cells: OriginalSessionCell[], sortedCols: SessionCol[]) {
    return sortedCols.map(col => {
      const cell = cells.find(({ rowId, colId }) => rowId === this.id && colId === col.id);
      return new SessionCell(cell, this);
    });
  }
}

export class SessionCell implements OriginalSessionCell {
  id = EMPTY_SESSION_CELL.id;
  rowId = EMPTY_SESSION_CELL.rowId;
  colId = EMPTY_SESSION_CELL.colId;
  value = EMPTY_SESSION_CELL.value;

  progress = 0;
  minValue = 0;
  trackingType = SESSION_ROW_TRACKING_TYPE.unknown;

  constructor(cell = EMPTY_SESSION_CELL, row = new SessionRow()) {
    Object.assign(this, cell);

    this.progress = this.calculateProgress(row);
    this.minValue = row.minValue;
    this.trackingType = row.trackingType;
  }

  private calculateProgress(row: SessionRow): number {
    return row.minValue ? Math.round((this.value / row.minValue) * 100) : 0;
  }
}

export class SessionTable {
  columns: SessionCol[] = [];
  dataSource: Record<string, SessionCell>[] = [];
  displayedColumns: string[] = [];

  ROW_NAME_KEY = 'rowName';

  constructor({ cols, rows }: ExtendedSession) {
    this.columns = cols;
    this.displayedColumns = this.buildDisplayedColumns(cols);
    this.dataSource = this.buildDataSource(rows);
  }

  private buildDisplayedColumns(cols: SessionCol[]): string[] {
    return [this.ROW_NAME_KEY, ...cols.map((_, i) => i.toString())];
  }

  private buildDataSource(rows: SessionRow[]): Record<string, SessionCell>[] {
    return rows.map(row => row.cells.reduce((cells, cell, index) => {
      return { ...cells, [index.toString()]: cell, [this.ROW_NAME_KEY]: row.name };
    }, {}));
  }
}

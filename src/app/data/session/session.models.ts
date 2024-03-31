import { Id } from '@data/common/types';
import {
  OriginalSession,
  OriginalSessionCell,
  OriginalSessionCol,
  OriginalSessionExtensions,
  OriginalSessionRow,
  OriginalSessionColType,
  OriginalSessionRowTrackingType,
} from './session.types';

export const EMPTY_SESSION: ExtendedSession = {
  id: '',
  ownerId: '',
  name: '',
  created: new Date(),
  cols: [],
  rows: [],
};

const EMPTY_SESSION_CELL: OriginalSessionCell = {
  id: '',
  colId: '',
  rowId: '',
  value: 0,
};

export class Session implements Omit<OriginalSession, 'created'> {
  id = '';
  ownerId = '';
  name = '';
  created = new Date();

  constructor(session: OriginalSession) {
    Object.assign(this, session, { created: session.created.toDate() });
  }
};

export class ExtendedSession extends Session {
  cols: SessionCol[] = [];
  rows: SessionRow[] = [];

  constructor(originalSession: OriginalSession, { rows, cols, cells }: OriginalSessionExtensions) {
    super(originalSession);

    this.cols = cols.map(col => new SessionCol(col)).sort((a, b) => +a.date - +b.date);
    this.rows = rows.map(row => new SessionRow(row, cells, this.cols));
  }
}

export class SessionCol implements Omit<OriginalSessionCol, 'date'> {
  type: OriginalSessionColType = 'default';
  date = new Date();
  id: Id = '';
  displayedDate = '';
  weekday = '';
  weekdayShort = '';

  constructor(col: OriginalSessionCol) {
    Object.assign(this, col, { date: col.date.toDate() });
    Object.assign(this, {
      displayedDate: this.date.toLocaleDateString('ru-RU'),
      weekday: this.date.toLocaleDateString('ru-RU', { weekday: 'long' }),
      weekdayShort: this.date.toLocaleDateString('ru-RU', { weekday: 'short' }),
    });
  }
}

export class SessionRow implements OriginalSessionRow {
  trackingType: OriginalSessionRowTrackingType = 'unknown';
  editable: boolean = false;
  minValue = 0;
  id: Id = '';
  name = '';
  cells: SessionCell[] = [];

  constructor(row: OriginalSessionRow, cells: OriginalSessionCell[], sortedCols: SessionCol[]) {
    Object.assign(this, row);
    Object.assign(this, { cells: this.buildCells(cells, sortedCols) });
  }

  private buildCells(cells: OriginalSessionCell[], sortedCols: SessionCol[]) {
    return sortedCols.map(col => {
      const cell = cells.find(({ rowId, colId }) => rowId === this.id && colId === col.id);
      return new SessionCell(cell ?? EMPTY_SESSION_CELL, this);
    });
  }
}

export class SessionCell implements OriginalSessionCell {
  id: Id = '';
  rowId: Id = '';
  colId: Id = '';
  value = 0;
  progress = 0;

  constructor(cell: OriginalSessionCell, row: SessionRow) {
    Object.assign(this, cell);
    Object.assign(this, { process: this.calculateProgress(row) });
  }

  private calculateProgress(row: OriginalSessionRow): number {
    return row.minValue ? Math.round((this.value / row.minValue) * 100) : 0;
  }
}

export class SessionTable {
  columns: SessionCol[] = [];
  dataSource: Record<string, SessionCell>[] = [];
  displayedColumns: string[] = [];

  ROW_NAME_KEY = 'rowName';

  constructor({ cols, rows }: ExtendedSession) {
    Object.assign(this, {
      columns: cols,
      displayedColumns: this.buildDisplayedColumns(cols),
      dataSource: this.buildDataSource(rows),
    });
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

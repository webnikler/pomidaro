import { Id } from '@data/common/types';
import {
  OriginalSession,
  OriginalSessionCell,
  OriginalSessionCol,
  OriginalSessionColType,
  OriginalSessionExtensions,
  OriginalSessionRow,
  OriginalSessionRowTrackingType,
} from './session.types';
import { Timestamp } from '@angular/fire/firestore';

const EMPTY_DATE = Timestamp.now();

const EMPTY_SESSION: OriginalSession = {
  id: '',
  ownerId: '',
  name: '',
  createdDate: EMPTY_DATE,
  startDate: EMPTY_DATE,
  endDate: EMPTY_DATE,
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
  trackingType: 'pomidaro',
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

export class Session implements Omit<OriginalSession, 'createdDate' | 'startDate' | 'endDate'> {
  id = EMPTY_SESSION.id;
  ownerId = EMPTY_SESSION.ownerId;
  name = EMPTY_SESSION.name;

  createdDate = EMPTY_SESSION.createdDate.toDate();
  startDate = EMPTY_SESSION.startDate.toDate();
  endDate = EMPTY_SESSION.endDate.toDate();

  constructor(session = EMPTY_SESSION) {
    Object.assign(this, session);

    this.createdDate = session.createdDate.toDate();
    this.startDate = session.startDate.toDate();
    this.endDate = session.endDate.toDate();
  }

  getCreatePayload(): Omit<OriginalSession, 'id'> {
    return {
      name: this.name,
      ownerId: this.ownerId,
      startDate: Timestamp.fromDate(this.startDate),
      endDate: Timestamp.fromDate(this.endDate),
      createdDate: Timestamp.now(),
    };
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

  update(data: Partial<ExtendedSession>) {
    return Object.assign(this, data);
  }

  getCreateColsPayload(): Omit<OriginalSessionCol, 'id'>[] {
    return this.cols.map(c => c.getPayload());
  }

  getCreateRowsPayload(): Omit<OriginalSessionRow, 'id'>[] {
    return this.rows.map(r => r.getPayload());
  }

  getCreateCellsPayload(cols: OriginalSessionCol[], rows: OriginalSessionRow[]): Omit<OriginalSessionCell, 'id'>[] {
    return rows.map(row => cols.map(col => ({ colId: col.id, rowId: row.id, value: '' }))).flat();
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

  getPayload(): Omit<OriginalSessionCol, 'id'> {
    const date = Timestamp.fromDate(this.date);
    const type = SESSION_COL_TYPE[this.type] as OriginalSessionColType;

    return { date, type }
  }
}

export class SessionRow implements Omit<OriginalSessionRow, 'trackingType'> {
  trackingType = SESSION_ROW_TRACKING_TYPE[EMPTY_SESSION_ROW.trackingType];
  minValue = EMPTY_SESSION_ROW.minValue;
  id = EMPTY_SESSION_ROW.id;
  name = EMPTY_SESSION_ROW.name;
  index = EMPTY_SESSION_ROW.index;

  cells: SessionCell[] = [];

  constructor(row = EMPTY_SESSION_ROW, cells: OriginalSessionCell[] = [], sortedCols: SessionCol[] = []) {
    Object.assign(this, row);

    this.trackingType = SESSION_ROW_TRACKING_TYPE[row.trackingType];
    this.cells = this.buildCells(cells, sortedCols);
    this.minValue = this.normalizeMinValue(row.minValue as string);
  }

  getPayload(): Omit<OriginalSessionRow, 'id'> {
    const data = { index: this.index, name: this.name, minValue: this.minValue };
    const trackingType = SESSION_ROW_TRACKING_TYPE[this.trackingType] as OriginalSessionRowTrackingType;

    return { ...data, trackingType };
  }

  update(data: Partial<SessionRow>) {
    return Object.assign(this, data);
  }

  private normalizeMinValue(value: string): string | boolean | number {
    const isTrue = value === true.toString();
    const isFalse = value === false.toString();
    const isNumber = !isNaN(Number(value));

    if (isTrue) return true;
    if (isFalse) return false;
    if (isNumber) return Number(value);

    return value;
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
  minValue: number | string | boolean = 0;
  trackingType = SESSION_ROW_TRACKING_TYPE.unknown;

  constructor(cell = EMPTY_SESSION_CELL, row = new SessionRow()) {
    Object.assign(this, cell);

    this.minValue = row.minValue;
    this.trackingType = row.trackingType;
    this.value = this.normalizeValue();
    this.progress = this.calculateProgress(row);
  }

  getPayload(): Partial<OriginalSessionCell> {
    return { colId: this.colId, rowId: this.rowId, value: this.value };
  }

  private normalizeValue(): number | string | boolean {
    switch (this.trackingType) {
      case SESSION_ROW_TRACKING_TYPE.pomidaro:
      case SESSION_ROW_TRACKING_TYPE.count:
        return Number(this.value) || 0;
      case SESSION_ROW_TRACKING_TYPE.mark:
        return this.value === true.toString() ? true : false;
      case SESSION_ROW_TRACKING_TYPE.time:
        return this.value || '00:00';
      default:
        return this.value;
    }
  }

  private calculateProgress(row: SessionRow): number {
    return typeof row.minValue === 'number' && typeof this.value === 'number'
      ? Math.round((this.value / row.minValue) * 100)
      : 0;
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

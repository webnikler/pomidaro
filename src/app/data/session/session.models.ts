import { convertTimestampToDate } from '@data/common/helpers';
import { OriginalSession, OriginalSessionExtensions, SessionCell, SessionCol, SessionRow, SessionTableColumn, SessionTableDataSource } from './session.types';

export const EMPTY_SESSION: ExtendedSession = {
  id: '',
  ownerId: '',
  name: '',
  created: new Date(),
  cols: [],
  rows: [],
  cells: [],
};

const EMPTY_SESSION_CELL = {
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

  constructor(originalSession: OriginalSession) {
    Object.assign(this, originalSession);

    this.created = convertTimestampToDate(originalSession.created);
  }
};

export class ExtendedSession extends Session {
  cols: SessionCol[] = [];
  rows: SessionRow[] = [];
  cells: SessionCell[] = [];

  constructor(originalSession: OriginalSession, extensions: OriginalSessionExtensions) {
    super(originalSession);

    this.cols = extensions.cols.map(c => ({ ...c, date: convertTimestampToDate(c.date) }));
    this.rows = extensions.rows;
    this.cells = extensions.cells;
  }
}

export const SESSION_TABLE_ROW_NAME_KEY = 'rowName';

export class SessionTable {
  columns: SessionTableColumn[] = [];
  dataSource: SessionTableDataSource = [];
  displayedColumns: string[] = [];

  constructor(session: ExtendedSession) {
    this.columns = this.buildColumns(session.cols);
    this.displayedColumns = this.buildDisplayedColumns(session.cols);
    this.dataSource = this.buildDataSource(session);
  }

  private buildDisplayedColumns(sessionCols: SessionCol[]): string[] {
    return [
      SESSION_TABLE_ROW_NAME_KEY,
      ...sessionCols.map((cell, i) => i.toString()),
    ];
  }

  private buildColumns(sessionCols: SessionCol[]): SessionTableColumn[] {
    return sessionCols
      .sort((a, b) => +a.date - +b.date)
      .map(cell => ({
        ...cell,
        weekDayString: this.getWeekDayString(cell.date),
        dateString: this.getDateString(cell.date),
      }));
  }

  private buildDataSource({ rows, cols, cells }: ExtendedSession): SessionTableDataSource {
    return rows.map(row => {
      return cols.reduce((acc, col, index) => {
        const cell = this.findCell(cells, row, col);
        const progress = this.calculateCellProgress(cell, row);

        return {
          ...acc,
          [index.toString()]: { ...cell, progress },
          [SESSION_TABLE_ROW_NAME_KEY]: row.name,
        };
      }, {});
    });
  }

  private findCell(cells: SessionCell[], row: SessionRow, col: SessionCol): SessionCell {
    return cells.find(cell => {
      return cell.rowId === row.id && cell.colId === col.id;
    }) ?? EMPTY_SESSION_CELL;
  }

  private calculateCellProgress(cell: SessionCell, row: SessionRow): number {
    return row.minValue ? Math.round((cell.value / row.minValue) * 100) : 0;
  }

  private getWeekDayString(date: Date): string {
    return date.toLocaleDateString('ru-RU', { weekday: 'short' });
  }

  private getDateString(date: Date): string {
    return date.toLocaleDateString('ru-RU');
  }
}

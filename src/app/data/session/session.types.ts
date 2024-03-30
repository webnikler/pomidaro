import { Timestamp } from '@angular/fire/firestore';
import { Id } from '@data/common/types';

export type OriginalSession = {
  id: Id;
  ownerId: Id;
  name: string;
  created: Timestamp;
}

export type OriginalSessionExtensions = {
  cols: OriginalSessionCol[];
  rows: OriginalSessionRow[];
  cells: OriginalSessionCell[];
}

export type SessionColType = 'pomidaro' | 'weekend' | 'default';
export type SessionRowTrackingType = 'pomidaro' | 'time' | 'mark' | 'count';

export type OriginalSessionCol = {
  id: Id;
  date: Timestamp;
  type: SessionColType;
}

export type OriginalSessionRow = {
  id: Id;
  name: string;
  minValue: number;
  trackingType: SessionRowTrackingType;
  editable: boolean;
}

export type OriginalSessionCell = {
  id: Id;
  rowId: Id;
  colId: Id;
  value: number;
}

export type SessionCol = Omit<OriginalSessionCol, 'date'> & { date: Date };

export type SessionRow = OriginalSessionRow;

export type SessionCell = OriginalSessionCell;

export type SessionTableCell = SessionCell & {
  progress: number
};

export type SessionTableColumn = SessionCol & {
  weekDayString: string;
  dateString: string;
}

export type SessionTableDataSource = Record<string, SessionTableCell[]>[];

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

export type OriginalSessionColType = 'pomidaro' | 'weekend' | 'default';
export type OriginalSessionRowTrackingType = 'pomidaro' | 'time' | 'mark' | 'count' | 'unknown';

export type OriginalSessionCol = {
  id: Id;
  date: Timestamp;
  type: OriginalSessionColType;
}

export type OriginalSessionRow = {
  id: Id;
  name: string;
  minValue: number;
  trackingType: OriginalSessionRowTrackingType;
  editable: boolean;
}

export type OriginalSessionCell = {
  id: Id;
  rowId: Id;
  colId: Id;
  value: number;
}

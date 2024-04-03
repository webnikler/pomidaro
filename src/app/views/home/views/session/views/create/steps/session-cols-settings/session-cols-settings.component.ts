import { Component, Input, effect } from '@angular/core';
import { SessionSettingsStep } from '../session-settings-step';
import { SESSION_COL_TYPE, SessionCol } from '@data/session/session.models';
import { MatTableModule } from '@angular/material/table';
import { MatSelectModule } from '@angular/material/select';
import { getDaysRange } from 'app/shared/helpers/date.helper';
import { Timestamp } from '@angular/fire/firestore';
import { OriginalSessionColType } from '@data/session/session.types';

@Component({
  selector: 'session-cols-settings-step',
  standalone: true,
  templateUrl: './session-cols-settings.component.html',
  imports: [
    MatTableModule,
    MatSelectModule,
  ],
})
export class SessionColsSettingsStepComponent extends SessionSettingsStep {
  @Input() settings!: { cols: SessionCol[] };

  readonly COL_TYPE = SESSION_COL_TYPE;

  readonly displayedCols: Array<keyof SessionCol> = ['displayedDate', 'weekday', 'type'];

  private sessionDataCache = this.session.data();

  constructor() {
    super();

    effect(() => {
      if (this.checkIsSessionDateRangeChanged()) {
        this.rebuildCols();
        this.sessionDataCache = this.session.data();
      }
    });
  }

  private checkIsSessionDateRangeChanged() {
    const { startDate, endDate } = this.session.data();
    const isStartDateChanged = this.sessionDataCache.startDate !== startDate;
    const isEndDateChanged = this.sessionDataCache.endDate !== endDate;

    return isStartDateChanged || isEndDateChanged;
  }

  /**
   * @todo здесь ошибка ,cols не сопоставляются по дате
   */
  private rebuildCols() {
    const { startDate, endDate, cols } = this.session.data();
    const dates = getDaysRange(startDate, endDate);

    this.settings.cols = dates.map(date => {
      const col = cols.find(c => c.date === date);

      return col ?? new SessionCol({
        id: '',
        type: this.getDefaultType(date),
        date: Timestamp.fromDate(date),
      });
    });
  }

  private getDefaultType(date: Date): OriginalSessionColType {
    const get = (colType: SESSION_COL_TYPE) => SESSION_COL_TYPE[colType] as OriginalSessionColType;

    switch (date.getDay()) {
      case 0: case 6: return get(SESSION_COL_TYPE.weekend);
      case 4: return get(SESSION_COL_TYPE.pomidaro);
      default: return get(SESSION_COL_TYPE.default);
    }
  }

  /**
   * @todo сделать пайп
   * @param colType 
   * @returns 
   */
  getSymbol(colType: SESSION_COL_TYPE) {
    switch (colType) {
      case SESSION_COL_TYPE.pomidaro: return '🍎';
      case SESSION_COL_TYPE.weekend: return '🌴';
      default: return '';
    }
  }
}

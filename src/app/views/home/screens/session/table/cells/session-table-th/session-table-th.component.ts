import { DatePipe } from '@angular/common';
import { Component, Input } from '@angular/core';
import { SESSION_COL_TYPE, SessionCol } from '@data/session/session.models';
import { WeekdayComponent } from '@shared/components/weekday/weekday.component';

@Component({
  selector: 'app-session-table-th',
  standalone: true,
  template: `
    <section class="date">{{ col.date | date: 'd MMMM' }}</section>
    <weekday [colType]="col.type" [weekday]="col.weekdayShort">
  `,
  styleUrl: './session-table-th.component.scss',
  imports: [
    DatePipe,
    WeekdayComponent,
  ]
})
export class SessionTableThComponent {
  @Input() col = new SessionCol();

  get symbol() {
    switch (this.col.type) {
      case SESSION_COL_TYPE.pomidaro: return '🍎';
      case SESSION_COL_TYPE.weekend: return '🌴';
      default: return '';
    }
  }

  get weekDayClass() {
    switch (this.col.type) {
      case SESSION_COL_TYPE.pomidaro: return 'pomidaro';
      case SESSION_COL_TYPE.weekend: return 'weekend';
      default: return '';
    }
  }
}

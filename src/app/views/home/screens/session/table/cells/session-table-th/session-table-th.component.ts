import { Component, Input } from '@angular/core';
import { SESSION_COL_TYPE, SessionCol } from '@data/session/session.models';

@Component({
  selector: 'app-session-table-th',
  standalone: true,
  template: `
    <section class="date">{{ col.displayedDate }}</section>
    <section class="weekday" [class]="weekDayClass">
      <span>{{ col.weekdayShort }}</span>
      <span>{{ symbol }}</span>
    </section>
  `,
  styleUrl: './session-table-th.component.scss',
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

import { NgIf } from '@angular/common';
import { Component, Input } from '@angular/core';
import { SESSION_COL_TYPE } from '@data/session/session.models';

@Component({
  selector: 'weekday',
  standalone: true,
  template: `
    <span>{{ weekday }}</span>
    @if (symbol) {
    <span>{{ symbol }}</span>
    }
  `,
  styleUrl: './weekday.component.scss',
  host: {
    '[class.weekend]': 'isWeekend',
    '[class.bold]': 'bold',
  },
  imports: [
    NgIf,
  ],
})
export class WeekdayComponent {
  @Input() set colType(colType: SESSION_COL_TYPE) {
    this.symbol = this.getSymbol(colType);
    this.isWeekend = colType === SESSION_COL_TYPE.weekend;
  }
  @Input() weekday!: string;
  @Input() bold = false;

  symbol = '';
  isWeekend = false;

  private getSymbol(colType: SESSION_COL_TYPE) {
    switch (colType) {
      case SESSION_COL_TYPE.pomidaro: return '🍎';
      case SESSION_COL_TYPE.weekend: return '🌴';
      default: return '';
    }
  }
}

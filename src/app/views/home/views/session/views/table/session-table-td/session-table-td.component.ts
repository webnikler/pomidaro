import { NgSwitch, NgSwitchCase } from '@angular/common';
import { Component, Input } from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { SESSION_ROW_TRACKING_TYPE, SessionCell } from '@data/session/session.models';

@Component({
  selector: 'app-session-table-td',
  standalone: true,
  template: `
    <ng-container [ngSwitch]="cell.trackingType">
      <section *ngSwitchCase="TYPE.pomidaro" class="pomidaro">
        <mat-progress-spinner mode="determinate" [value]="cell.progress" [color]="progressColor" [diameter]="35" />
        <span>{{ cell.value }}</span>
      </section>
    </ng-container>
  `,
  styleUrl: './session-table-td.component.scss',
  imports: [
    MatProgressSpinnerModule,
    NgSwitch,
    NgSwitchCase,
  ],
})
export class SessionTableTdComponent {
  @Input() cell = new SessionCell();

  readonly TYPE = SESSION_ROW_TRACKING_TYPE;

  get progressColor() {
    return this.cell.progress >= 100 ? 'accent' : 'warn';
  }
}

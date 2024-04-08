import { NgIf, NgSwitch, NgSwitchCase } from '@angular/common';
import { Component, Input } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { SESSION_ROW_TRACKING_TYPE, SessionCell } from '@data/session/session.models';

@Component({
  selector: 'app-session-table-td',
  standalone: true,
  template: `
    @switch (cell.trackingType) {
      @case (TYPE.pomidaro) {
      <section class="pomidaro">
        @if (cell.progress >= 100) {
          <mat-icon color="primary" class="done-label" inline>done</mat-icon>     
        }
        <mat-progress-spinner class="background-spinner" mode="determinate" [value]="100" color="primary" [diameter]="35" />
        <mat-progress-spinner class="foreground-spinner" [class.completed]="cell.progress >= 100" mode="determinate" [value]="cell.progress" [diameter]="35" />
        <span [class.zero-value]="cell.value === 0">{{ cell.value }}</span>
      </section>
      }
      @default {
        <span>{{ cell.value }}</span>
      }
    }
  `,
  styleUrl: './session-table-td.component.scss',
  imports: [
    MatProgressSpinnerModule,
    MatIcon,
    NgSwitch,
    NgSwitchCase,
    NgIf,
  ],
})
export class SessionTableTdComponent {
  @Input() cell = new SessionCell();

  readonly TYPE = SESSION_ROW_TRACKING_TYPE;
}

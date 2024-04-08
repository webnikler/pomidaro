import { NgIf } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatFormField, MatInput, MatPrefix, MatSuffix } from '@angular/material/input';
import { SESSION_ROW_TRACKING_TYPE } from '@data/session';
import { addMinutes, differenceInDays, format, parse } from 'date-fns';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatCard, MatCardContent } from '@angular/material/card';

const TIME_FORMAT = 'HH:mm';
const TIME_INCREMENT = 30;

@Component({
  selector: 'session-cell-input',
  standalone: true,
  template: `
    @if (type === TYPE.mark) {
      <mat-card appearance="outlined">
        <mat-card-content>
          <mat-checkbox [(ngModel)]="value" (ngModelChange)="valueChange.emit($event)">
            {{ value ? 'Выполнено' : 'Не выполнено' }}
          </mat-checkbox>
        </mat-card-content>
      </mat-card>
    }
    @else {
      <mat-form-field subscriptSizing="dynamic">
        <button
          mat-icon-button
          matPrefix
          (click)="increment(-1)"
          [disabled]="value === 0 || value === '00:00'"
        >
          <mat-icon>remove</mat-icon>
        </button>
        <button mat-icon-button matSuffix (click)=increment(1)>
          <mat-icon>add</mat-icon>
        </button>
        <input
          matInput
          [ngModel]="value"
          (ngModelChange)="valueChange.emit($event)"
          [type]="type === TYPE.time ? 'time' : 'number'"
        >
      </mat-form-field>
    }   
  `,
  styles: [
    `:host input { text-align: center; font-weight: bold; }`,
  ],
  imports: [
    MatInput,
    MatFormField,
    MatSuffix,
    MatPrefix,
    MatIcon,
    MatIconButton,
    FormsModule,
    NgIf,
    MatCheckboxModule,
    MatCard,
    MatCardContent,
  ],
})
export class SessionCellInputComponent {
  @Input() value: string | number | boolean = '';
  @Input() type = SESSION_ROW_TRACKING_TYPE.unknown;

  @Output() valueChange = new EventEmitter();

  readonly TYPE = SESSION_ROW_TRACKING_TYPE;

  increment(incrementFactor: number) {
    const value = this.type === SESSION_ROW_TRACKING_TYPE.time
      ? this.incrementTime(this.value as string, incrementFactor * TIME_INCREMENT)
      : this.incrementCount(this.value as number, incrementFactor);

    this.value = value;
    this.valueChange.emit(value);
  }

  private incrementCount(count: number, increment: number) {
    const newCount = count + increment;
    return newCount < 0 ? count : newCount;
  }

  private incrementTime(time: string, increment: number) {
    const parsedTime = parse(time, TIME_FORMAT, new Date());
    const newTime = addMinutes(parsedTime, increment);

    return !differenceInDays(parsedTime, newTime) ? format(newTime, TIME_FORMAT) : time;
  }
}

import { addDays } from 'date-fns';
import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatStepperModule } from '@angular/material/stepper';
import { MatInputModule } from '@angular/material/input';
import { SessionStore } from '@data/session';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MAT_DATE_LOCALE, provideNativeDateAdapter } from '@angular/material/core';
import { getDaysRange, getDiffDaysString } from 'app/shared/helpers/date.helper';
import { SESSION_COL_TYPE, SessionCol } from '@data/session/session.models';
import { Timestamp } from '@angular/fire/firestore';
import { NgForOf } from '@angular/common';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { OriginalSessionColType } from '@data/session/session.types';

@Component({
  selector: 'app-session-create-view',
  standalone: true,
  templateUrl: './session-create.component.html',
  styleUrl: './session-create.component.scss',
  imports: [
    MatStepperModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    FlexLayoutModule,
    MatDatepickerModule,
    MatTableModule,
    NgForOf,
    MatSelectModule,
  ],
  providers: [
    provideNativeDateAdapter(),
    { provide: MAT_DATE_LOCALE, useValue: 'ru-RU' }
  ]
})
export class SessionCreateViewComponent implements OnInit {
  private readonly session = inject(SessionStore);
  private readonly formBuilder = inject(FormBuilder);

  readonly COL_TYPE = SESSION_COL_TYPE;

  cols: SessionCol[] = [];
  displayedCols = ['displayedDate', 'weekday', 'type'];

  get sessionDaysCountString() {
    return getDiffDaysString(this.startDate, this.endDate);
  }

  get startDate() {
    return this.mainSettingsFormGroup.controls.startDate.value;
  }

  get endDate() {
    return this.mainSettingsFormGroup.controls.endDate.value;
  }

  mainSettingsFormGroup = this.formBuilder.group({
    sessionName: ['', Validators.required],
    startDate: [addDays(new Date(), 1)],
    endDate: [addDays(new Date(), 7)],
  });

  ngOnInit() {
    this.buildCols();
  }

  buildCols() {
    const dates = getDaysRange(this.startDate, this.endDate);

    this.cols = dates.map(date => new SessionCol({
      id: '',
      type: this.getDefaultType(date),
      date: Timestamp.fromDate(date),
    }));
  }

  getDefaultType(date: Date): OriginalSessionColType {
    switch (date.getDay()) {
      case 0: case 6: return SESSION_COL_TYPE[SESSION_COL_TYPE.weekend] as OriginalSessionColType;
      case 4: return SESSION_COL_TYPE[SESSION_COL_TYPE.pomidaro] as OriginalSessionColType;
      default: return SESSION_COL_TYPE[SESSION_COL_TYPE.default] as OriginalSessionColType;
    }
  }

  getSymbol(colType: SESSION_COL_TYPE) {
    switch (colType) {
      case SESSION_COL_TYPE.pomidaro: return '🍎';
      case SESSION_COL_TYPE.weekend: return '🌴';
      default: return '';
    }
  }
}

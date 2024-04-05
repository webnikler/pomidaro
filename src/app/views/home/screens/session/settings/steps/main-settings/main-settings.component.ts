import { Component, EventEmitter, Input, OnInit, Output, inject } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSliderModule } from '@angular/material/slider';
import { addDays, addWeeks, differenceInDays, startOfWeek } from 'date-fns';
import { SettingsStep } from '../settings-step';
import { OriginalSessionColType } from '@data/session/session.types';
import { SESSION_COL_TYPE, SessionCollectionStore } from '@data/session';
import { SessionCol } from '@data/session/session.models';
import { getDaysRange } from '@shared/helpers/date.helper';
import { Timestamp } from '@angular/fire/firestore';
import { MatTableModule } from '@angular/material/table';
import { MatSelectModule } from '@angular/material/select';
import { WeekdayComponent } from '@shared/components/weekday/weekday.component';
import { AsyncPipe, NgForOf } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { map } from 'rxjs';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';

const DAY_TYPES = [
  { title: 'Обычный', value: SESSION_COL_TYPE.default },
  { title: 'Помидорный', value: SESSION_COL_TYPE.pomidaro },
  { title: 'Выходной', value: SESSION_COL_TYPE.weekend },
];

@Component({
  selector: 'main-settings-step',
  standalone: true,
  templateUrl: './main-settings.component.html',
  styleUrl: './main-settings.component.scss',
  imports: [
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    FlexLayoutModule,
    MatSliderModule,
    MatTableModule,
    MatSelectModule,
    WeekdayComponent,
    NgForOf,
    MatCardModule,
    MatButton,
    AsyncPipe,
    MatIcon,
  ],
})
export class MainSettingsStepComponent extends SettingsStep implements OnInit {
  readonly sessions = inject(SessionCollectionStore);

  readonly dayTypes = DAY_TYPES;
  readonly daysTableCols: Array<keyof SessionCol> = ['displayedDate', 'weekday'];

  daysTableDataSource: SessionCol[] = [];

  sessionIDForCopying = '';

  readonly mainSettingsForm = this.formBuilder.nonNullable.group({
    name: ['', Validators.required],
    startDate: [new Date(), Validators.required],
    endDate: [new Date(), Validators.required],
    duration: [0],
  })

  @Input() completed = false;
  @Output() completedChange = this.mainSettingsForm.statusChanges.pipe(
    map(status => status === 'VALID'),
  );
  @Output() next = new EventEmitter();

  private readonly DEFAULT_DURATION = 7;

  ngOnInit() {
    if (this.isSessionExists) {
      this.setFormFromSession();
      this.setDaysTableFromSession();
    } else {
      this.initForm();
      this.rebuildDaysTable();
    }
  }

  onDatepickerClosed() {
    this.recalculateDuration();
    this.rebuildDaysTable();
  }

  onDurationChange() {
    this.initEndDate();
    this.rebuildDaysTable();
  }

  private recalculateDuration() {
    const { startDate, endDate } = this.mainSettingsForm.value;
    const duration = this.getDuration(startDate!, endDate || startDate!);

    this.mainSettingsForm.patchValue({ duration });
  }

  private getDuration(startDate: Date, endDate: Date) {
    return differenceInDays(endDate, startDate) + 1;
  }

  private setFormFromSession() {
    const { name, startDate, endDate } = this.session.data();
    const duration = this.getDuration(startDate, endDate);

    this.mainSettingsForm.setValue({ name, startDate, endDate, duration });
  }

  private setDaysTableFromSession() {
    this.daysTableDataSource = this.session.data().cols;
  }

  private initForm() {
    this.initStartDate();
    this.initDuration();
    this.initEndDate();
  }

  private initStartDate() {
    const currentDate = new Date();
    const firstDayOfNextWeek = startOfWeek(addWeeks(currentDate, 1), { weekStartsOn: 1 });
    const startDate = currentDate.getDay() === 1 ? currentDate : firstDayOfNextWeek;

    this.mainSettingsForm.patchValue({ startDate });
  }

  private initEndDate() {
    const { startDate, duration } = this.mainSettingsForm.value;
    const endDate = addDays(startDate!, duration! - 1);

    this.mainSettingsForm.patchValue({ endDate });
  }

  private initDuration() {
    this.mainSettingsForm.patchValue({ duration: this.DEFAULT_DURATION });
  }

  private rebuildDaysTable() {
    const { startDate, endDate } = this.mainSettingsForm.value;
    const cols = this.daysTableDataSource;
    const dates = getDaysRange(startDate!, endDate!);

    this.daysTableDataSource = dates.map(date => {
      return cols.find(c => +c.date === +date) ?? new SessionCol({
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
}

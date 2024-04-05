import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIcon } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { SESSION_ROW_TRACKING_TYPE, SessionRow } from '@data/session/session.models';
import { MatDividerModule } from '@angular/material/divider';
import { SettingsStep } from '../settings-step';
import { FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { NgForOf, NgSwitch, NgSwitchCase } from '@angular/common';
import { MatRippleModule } from '@angular/material/core';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { map } from 'rxjs';

type TrackingTypeOption = { title: string, value: SESSION_ROW_TRACKING_TYPE };

const TRACKING_TYPES: TrackingTypeOption[] = [
  { title: 'Помидорки', value: SESSION_ROW_TRACKING_TYPE.pomidaro },
  { title: 'Время', value: SESSION_ROW_TRACKING_TYPE.time },
  { title: 'Кол-во', value: SESSION_ROW_TRACKING_TYPE.count },
  { title: 'Привычка', value: SESSION_ROW_TRACKING_TYPE.mark },
];

@Component({
  selector: 'activity-settings-step',
  standalone: true,
  templateUrl: './activity-settings.component.html',
  styleUrl: './activity-settings.component.scss',
  imports: [
    MatTableModule,
    MatSelectModule,
    MatButton,
    MatIconButton,
    MatIcon,
    FlexLayoutModule,
    MatCardModule,
    MatDividerModule,
    FormsModule,
    ReactiveFormsModule,
    MatInputModule,
    MatFormFieldModule,
    NgForOf,
    MatRippleModule,
    MatSlideToggleModule,
    NgSwitch,
    NgSwitchCase,
  ],
})
export class AcitvitySettingsStepComponent extends SettingsStep {
  readonly tableColumnNames = ['index', 'name', 'trackingType', 'minValue', 'actions'];

  readonly trackingTypes = TRACKING_TYPES;

  readonly TRACKING_TYPE = SESSION_ROW_TRACKING_TYPE;

  form = this.formBuilder.nonNullable.group({
    activities: this.formBuilder.nonNullable.array([
      this.createRowFormGroup(),
    ])
  });

  dataSource = [
    new SessionRow(),
  ];

  @Output() next = new EventEmitter();
  @Output() back = new EventEmitter();

  @Input() completed = false;
  @Output() completedChange = this.form.statusChanges.pipe(
    map(status => status === 'VALID'),
  );

  getTrackingTypeInputType(trackingType: SESSION_ROW_TRACKING_TYPE) {
    return trackingType === SESSION_ROW_TRACKING_TYPE.time ? 'time' : 'number';
  }

  compareTrackingType(typeA: TrackingTypeOption, typeB: TrackingTypeOption) {
    return typeA && typeB ? typeA.value === typeB.value : false;
  }

  onChangeTrackingType(trackingType: SESSION_ROW_TRACKING_TYPE, index: number) {
    const value = this.getDefaultMinValueByTrackingType(trackingType);
    this.dataSource[index].minValue = value;
  }

  addRow() {
    const row = new SessionRow();

    this.form.controls.activities.push(this.createRowFormGroup(row));
    this.dataSource = [...this.dataSource, row];
  }

  incrementMinValue(index: number) {
    const currentValue = this.dataSource[index].minValue;

    switch (typeof currentValue) {
      case 'number': {
        this.dataSource[index].minValue = currentValue + 1;
        break;
      }
      case 'string': {
        this.dataSource[index].minValue = this.incrementTime(currentValue);
        break;
      }
    }
  }

  removeRow(index: number) {
    this.form.controls.activities.removeAt(index);
    this.dataSource = this.dataSource.filter((_, i) => index !== i);
  }

  private incrementTime(time: string) {
    let [h, m] = time.split(':');

    if (h && m) {
      m = +m + 30 + '';
      h = +h + Math.floor(+m / 60) + '';
      m = +m % 60 + '';
      return [h.padStart(2, '0'), m.padStart(2, '0')].join(':');
    } else {
      return time;
    }
  }

  private getDefaultMinValueByTrackingType(trackingType: SESSION_ROW_TRACKING_TYPE) {
    switch (trackingType) {
      case SESSION_ROW_TRACKING_TYPE.count: case SESSION_ROW_TRACKING_TYPE.pomidaro: {
        return 0;
      }
      case SESSION_ROW_TRACKING_TYPE.time: {
        return '00:00';
      }
      case SESSION_ROW_TRACKING_TYPE.mark: {
        return false;
      }
      default: return 0;
    }
  }

  private createRowFormGroup(row = new SessionRow()) {
    return this.formBuilder.nonNullable.group({
      name: [row.name, Validators.required],
      trackingType: [row.trackingType],
      minValue: [row.minValue, Validators.required],
    });
  }
}

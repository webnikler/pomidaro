import { Component, Input, OnInit } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSliderModule } from '@angular/material/slider';
import { addDays, addWeeks, differenceInDays, startOfWeek } from 'date-fns';
import { SessionSettingsStep } from '../session-settings-step';

@Component({
  selector: 'session-main-settings-step',
  standalone: true,
  templateUrl: './session-main-settings.component.html',
  imports: [
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    FlexLayoutModule,
    MatSliderModule,
  ],
})
export class SessionMainSettingsStepComponent extends SessionSettingsStep implements OnInit {

  @Input() form!: FormGroup<{
    name: FormControl<string>,
    startDate: FormControl<Date>,
    endDate: FormControl<Date>,
    duration: FormControl<number>,
  }>;

  private readonly DEFAULT_DURATION = 7;

  ngOnInit() {
    if (this.isSessionExists) {
      this.setFormFromSession();
    } else {
      this.initForm();
    }
  }

  recalculateDuration() {
    const { startDate, endDate } = this.form.value;
    const duration = this.getDuration(startDate!, endDate || startDate!);

    this.form.patchValue({ duration });
  }

  recalculateEndDate() {
    this.initEndDate();
  }

  private getDuration(startDate: Date, endDate: Date) {
    return differenceInDays(endDate, startDate) + 1;
  }

  private setFormFromSession() {
    const { name, startDate, endDate } = this.session.data();
    const duration = this.getDuration(startDate, endDate);

    this.form.setValue({ name, startDate, endDate, duration });
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

    this.form.patchValue({ startDate });
  }

  private initEndDate() {
    const { startDate, duration } = this.form.value;
    const endDate = addDays(startDate!, duration! - 1);

    this.form.patchValue({ endDate });
  }

  private initDuration() {
    this.form.patchValue({ duration: this.DEFAULT_DURATION });
  }
}

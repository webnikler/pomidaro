import { Component, inject } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatStepperModule } from '@angular/material/stepper';
import { MatInputModule } from '@angular/material/input';
import { SessionStore } from '@data/session';
import { FlexLayoutModule } from '@angular/flex-layout';
import { SessionRow } from '@data/session/session.models';
import { NgForOf } from '@angular/common';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { MatButton } from '@angular/material/button';
import { SessionMainSettingsStepComponent } from './steps/session-main-settings/session-main-settings.component';
import { SessionColsSettingsStepComponent } from './steps/session-cols-settings/session-cols-settings.component';

enum StepIndex {
  sessionMainSettings,
  sessionColsSettings,
  sessionRowsSettings,
}

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
    MatTableModule,
    NgForOf,
    MatSelectModule,
    MatButton,
    SessionMainSettingsStepComponent,
    SessionColsSettingsStepComponent,
  ],
})
export class SessionCreateViewComponent {
  private readonly formBuilder = inject(FormBuilder);
  private readonly session = inject(SessionStore);

  displayedCols2 = ['index', 'name', 'trackingType', 'minValue'];
  rows: SessionRow[] = [];

  sessionMainSettingsForm = this.formBuilder.nonNullable.group({
    name: ['', Validators.required],
    startDate: [new Date(), Validators.required],
    endDate: [new Date(), Validators.required],
    duration: [0],
  });

  sessionColsSettings = {
    cols: this.session.data().cols,
  };

  private get sessionMainSettings() {
    return this.sessionMainSettingsForm.value;
  }

  private previusStepIndex = StepIndex.sessionMainSettings;

  onStepIndexChange(stepIndex: StepIndex) {
    switch (this.previusStepIndex) {
      case StepIndex.sessionMainSettings: {
        this.session.updateData(this.sessionMainSettings);
        break;
      }
      case StepIndex.sessionColsSettings: {
        this.session.updateData(this.sessionColsSettings);
        break;
      }
    }

    this.previusStepIndex = stepIndex;
  }

  addRow() {
    this.rows = [...this.rows, new SessionRow()];
    console.log(this.rows);
  }
}

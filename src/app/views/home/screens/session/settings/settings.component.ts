import { Component, inject } from '@angular/core';
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
import { MainSettingsStepComponent } from './steps/main-settings/main-settings.component';

@Component({
  selector: 'session-settings',
  standalone: true,
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.scss',
  imports: [
    MatStepperModule,
    MatFormFieldModule,
    MatInputModule,
    FlexLayoutModule,
    MatTableModule,
    NgForOf,
    MatSelectModule,
    MatButton,
    MainSettingsStepComponent,
  ],
})
export class SessionSettingsComponent {
  private readonly session = inject(SessionStore);

  mainSettinsStepCompleted = false;

  displayedCols2 = ['index', 'name', 'trackingType', 'minValue'];
  rows: SessionRow[] = [];

  addRow() {
    this.rows = [...this.rows, new SessionRow()];
    console.log(this.rows);
  }
}

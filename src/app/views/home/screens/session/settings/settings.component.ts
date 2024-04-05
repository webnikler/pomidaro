import { Component, inject } from '@angular/core';
import { MatStepperModule } from '@angular/material/stepper';
import { SessionStore } from '@data/session';
import { MainSettingsStepComponent } from './steps/main-settings/main-settings.component';
import { STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper';
import { AcitvitySettingsStepComponent } from './steps/activity-settings/activity-settings.component';

@Component({
  selector: 'session-settings',
  standalone: true,
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.scss',
  imports: [
    MatStepperModule,
    MainSettingsStepComponent,
    AcitvitySettingsStepComponent,
  ],
  providers: [
    {
      provide: STEPPER_GLOBAL_OPTIONS,
      useValue: { displayDefaultIndicatorType: false, showError: true },
    },
  ]
})
export class SessionSettingsComponent {
  private readonly session = inject(SessionStore);

  mainSettinsStepCompleted = false;
  activitySettingsStepCompleted = false;
}

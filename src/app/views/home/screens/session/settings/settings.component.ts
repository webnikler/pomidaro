import { Router } from '@angular/router';
import { Component, inject } from '@angular/core';
import { MatStepperModule } from '@angular/material/stepper';
import { SessionCollectionStore, SessionStore } from '@data/session';
import { MainSettingsStepComponent } from './steps/main-settings/main-settings.component';
import { STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper';
import { AcitvitySettingsStepComponent } from './steps/activity-settings/activity-settings.component';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { NgIf } from '@angular/common';

@Component({
  selector: 'session-settings',
  standalone: true,
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.scss',
  imports: [
    MatStepperModule,
    MainSettingsStepComponent,
    AcitvitySettingsStepComponent,
    MatProgressBarModule,
    NgIf,
  ],
  providers: [
    {
      provide: STEPPER_GLOBAL_OPTIONS,
      useValue: { displayDefaultIndicatorType: false, showError: true },
    },
  ]
})
export class SessionSettingsComponent {
  private readonly sessionCollection = inject(SessionCollectionStore);
  private readonly router = inject(Router);

  readonly session = inject(SessionStore);

  mainSettinsStepCompleted = false;
  activitySettingsStepCompleted = false;

  async onCreate() {
    const session = await this.session.create();

    this.sessionCollection.add(session);
    this.router.navigate(['home/session', session.id, 'table']);
  }
}

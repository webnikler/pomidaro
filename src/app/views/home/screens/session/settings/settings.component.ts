import { Router } from '@angular/router';
import { Component, inject } from '@angular/core';
import { MatStepperModule } from '@angular/material/stepper';
import { SessionCollectionStore, SessionStore } from '@data/session';
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
  private readonly sessionCollection = inject(SessionCollectionStore);
  private readonly session = inject(SessionStore);
  private readonly router = inject(Router)

  mainSettinsStepCompleted = false;
  activitySettingsStepCompleted = false;

  async onCreate() {
    const session = await this.session.create();

    this.sessionCollection.add(session);
    this.router.navigate(['home/session', session.id, 'table']);
  }
}

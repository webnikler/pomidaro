import { inject } from '@angular/core';
import { SessionStore } from '@data/session';

export abstract class SessionSettingsStep {
  protected readonly session = inject(SessionStore);

  protected get isSessionExists() {
    return Boolean(this.session.data().id);
  }
}
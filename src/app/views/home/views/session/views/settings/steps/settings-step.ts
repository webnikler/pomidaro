import { inject } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { SessionStore } from '@data/session';

export abstract class SettingsStep {
  protected readonly session = inject(SessionStore);
  protected readonly formBuilder = inject(FormBuilder);

  protected get isSessionExists() {
    return Boolean(this.session.data().id);
  }
}
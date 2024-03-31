import { inject } from '@angular/core'
import { SessionStore } from '@data/session'

export const createSessionResolver = async () => {
  inject(SessionStore).clear();
};

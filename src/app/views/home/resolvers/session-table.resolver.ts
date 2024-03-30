import { inject } from '@angular/core'
import { SessionStore } from '@data/session'
import { SessionTableStore } from '@data/session/session-table.store';

export const sessionTableResolver = async () => {
  const session = inject(SessionStore);
  const table = inject(SessionTableStore);

  table.build(session.data());
}
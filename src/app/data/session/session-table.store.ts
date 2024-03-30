import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';
import { EMPTY_SESSION, SessionTable, ExtendedSession } from './session.models';

const DEFAULT_STATE = new SessionTable(EMPTY_SESSION);

export const SessionTableStore = signalStore(
  withState<SessionTable>(DEFAULT_STATE),

  withMethods((store) => ({
    build(session: ExtendedSession) {
      patchState(store, new SessionTable(session));
    }
  })),
);

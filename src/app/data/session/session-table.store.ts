import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';
import { SessionTable, ExtendedSession } from './session.models';

const DEFAULT_STATE = new SessionTable(new ExtendedSession());

export const SessionTableStore = signalStore(
  withState<SessionTable>(DEFAULT_STATE),

  withMethods((store) => ({
    build(session: ExtendedSession) {
      patchState(store, new SessionTable(session));
    }
  })),
);

import { Id } from '../common/types';
import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';
import { State, createState, stateError, stateLoading, stateSuccess } from '../common/helpers';
import { inject } from '@angular/core';
import { SessionApiService } from './session-api.service';
import { ExtendedSession } from './session.models';

const DEFAULT_STATE: State<ExtendedSession> = createState(new ExtendedSession());

export const SessionStore = signalStore(
  withState<State<ExtendedSession>>(DEFAULT_STATE),
  withMethods((store, sessionApi = inject(SessionApiService)) => ({

    async requestSession(id: Id): Promise<void> {
      patchState(store, stateLoading());

      try {
        patchState(store, stateSuccess(await sessionApi.getSession(id)));
      } catch (error) {
        patchState(store, stateError(error, new ExtendedSession()));
      }
    },

    clear() {
      patchState(store, createState(new ExtendedSession()));
    },

    update(data: Partial<ExtendedSession>) {
      patchState(store, { data: new ExtendedSession().update({ ...store.data(), ...data }) });
    },

    async create() {
      patchState(store, stateLoading());

      try {
        return await sessionApi.createSession(store.data());
      } catch (error) {
        patchState(store, stateError(error));
        throw error;
      } finally {
        patchState(store, stateLoading(false));
      }
    }
  })),
);

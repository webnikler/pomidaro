import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';
import { inject } from '@angular/core';
import { State, createState, stateError, stateLoading, stateSuccess } from '../common/state';
import { ShortSession } from './sesion.types';
import { SessionApiService } from './session-api.service';

const DEFAILT_STATE: State<ShortSession[]> = createState([]);

export const SessionCollectionStore = signalStore(
  withState<State<ShortSession[]>>(DEFAILT_STATE),

  withMethods((store, sessionApi = inject(SessionApiService)) => ({
    async requestUserSessions(userId?: string) {
      patchState(store, stateLoading());

      try {
        patchState(store, stateSuccess(await sessionApi.getUserSessions(userId)));
      } catch (error) {
        patchState(store, stateError(error));
      }
    },
  })),
);

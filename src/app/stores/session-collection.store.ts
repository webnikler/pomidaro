import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';
import { inject } from '@angular/core';
import { State, createState, stateError, stateLoading, stateSuccess } from './common/state';
import { SessionsApiService, ShortAppSession } from '@services';

const DEFAILT_STATE: State<ShortAppSession[]> = createState([]);

export const SessionCollectionStore = signalStore(
  withState<State<ShortAppSession[]>>(DEFAILT_STATE),

  withMethods((store, sessionsApi = inject(SessionsApiService)) => ({
    async requestUserSessions(userId?: string) {
      patchState(store, stateLoading());

      try {
        patchState(store, stateSuccess(await sessionsApi.getUserSessions(userId)));
      } catch (error) {
        patchState(store, stateError(error));
      }
    },
  })),
);

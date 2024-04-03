import { Id } from './../common/types';
import { patchState, signalStore, withComputed, withMethods, withState } from '@ngrx/signals';
import { computed, inject } from '@angular/core';
import { State, createState, stateError, stateLoading, stateSuccess } from '../common/helpers';
import { Session } from './session.models';
import { SessionApiService } from './session-api.service';

const DEFAILT_STATE: State<Session[]> = createState([]);

export const SessionCollectionStore = signalStore(
  withState<State<Session[]>>(DEFAILT_STATE),

  withComputed(({ data }) => ({
    sortedSessions: computed(() => {
      return data().sort((s1, s2) => +s2.startDate - +s1.startDate);
    })
  })),

  withMethods((store, sessionApi = inject(SessionApiService)) => ({
    async requestSessions(userId: Id) {
      patchState(store, stateLoading());

      try {
        patchState(store, stateSuccess(await sessionApi.getSessions(userId)));
      } catch (error) {
        patchState(store, stateError(error));
      }
    },
  })),
);

import { Id } from './../common/types';
import { patchState, signalStore, withComputed, withMethods, withState } from '@ngrx/signals';
import { computed, inject } from '@angular/core';
import { State, createState, stateError, stateLoading, stateSuccess } from '../common/helpers';
import { Session } from './session.models';
import { SessionApiService } from './session-api.service';

const DEFAILT_STATE: State<Session[]> = createState([]);

const sortSessions = (s1: Session, s2: Session) => +s2.created - +s1.created;

export const SessionCollectionStore = signalStore(
  withState<State<Session[]>>(DEFAILT_STATE),

  withComputed(({ data }) => ({
    lastSession: computed(() => {
      return data().sort(sortSessions)[0];
    }),
    sortedSessions: computed(() => {
      return data().sort(sortSessions);
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

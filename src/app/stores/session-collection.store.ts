import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';
import { inject } from '@angular/core';
import { Firestore, collection, getDocs } from '@angular/fire/firestore';
import { Session } from './session.store';
import { State, createState, stateError, stateLoading, stateSuccess } from './common/state';

type ShortSession = Pick<Session, 'name' | 'owner_uid'>;

const DEFAILT_STATE: State<ShortSession[]> = createState([]);

export const SessionCollectionStore = signalStore(
  withState<State<ShortSession[]>>(DEFAILT_STATE),

  withMethods((store, fs = inject(Firestore)) => ({
    async requestUserSessions(uid?: string) {
      if (!uid) {
        patchState(store, stateError('uid is required'));
        return;
      }

      patchState(store, stateLoading());

      try {
        const sessionsCollection = collection(fs, 'sessions');
        const sessionsSnapshot = await getDocs(sessionsCollection);
        const data = sessionsSnapshot.docs.map(doc => doc.data()) as ShortSession[];

        patchState(store, stateSuccess(data));
      } catch (error) {
        patchState(store, stateError(error));
      }
    },
  })),
);

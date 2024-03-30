import { Id } from '../common/types';
import { patchState, signalStore, withComputed, withMethods, withState } from '@ngrx/signals';
import { State, createState, stateError, stateLoading, stateSuccess } from '../common/helpers';
import { SessionCell } from './session.types';
import { computed, inject } from '@angular/core';
import { SessionApiService } from './session-api.service';
import { EMPTY_SESSION, ExtendedSession } from './session.models';

const DEFAULT_STATE: State<ExtendedSession> = createState(EMPTY_SESSION);

export const SessionStore = signalStore(
  withState<State<ExtendedSession>>(DEFAULT_STATE),

  withComputed(({ data }) => ({
    sortedCols: computed(() => data().cols.sort((a, b) => +a.date - +b.date)),
  })),

  withMethods((store, sessionApi = inject(SessionApiService)) => ({
    async requestSession(id: Id): Promise<void> {
      patchState(store, stateLoading());

      try {
        patchState(store, stateSuccess(await sessionApi.getSession(id)));
      } catch (error) {
        patchState(store, stateError(error, EMPTY_SESSION));
      }
    },
    getRowCells(rowId: Id): SessionCell[] {
      return store.data().cells.filter((cell) => cell.rowId === rowId);
    },
    getColCells(colId: Id): SessionCell[] {
      return store.data().cells.filter((cell) => cell.colId === colId);
    }
  })),
);

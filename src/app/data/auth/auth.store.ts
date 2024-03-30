import { computed, inject } from '@angular/core';
import { patchState, signalStore, withComputed, withHooks, withMethods, withState } from '@ngrx/signals';
import { State, createState, stateError, stateLoading, stateSuccess } from '../common/helpers';
import { EMPTY_AUTH_USER } from './auth.const';
import { Subject, distinctUntilChanged, takeUntil } from 'rxjs';
import { AuthUser } from '@data/common/auth/auth.types';
import { AuthProvider } from '@data/common/auth/auth.provider';

const DEFAULT_STATE: State<AuthUser> = createState(EMPTY_AUTH_USER);

export const AuthStore = signalStore(
  { providedIn: 'root' },

  withState<State<AuthUser>>(DEFAULT_STATE),

  withComputed(({ data }) => ({
    uid: computed(() => data().uid),
    isAuth: computed(() => Boolean(data().uid)),
  })),

  withMethods((store, authProvider = inject(AuthProvider)) => ({
    async signIn() {
      try {
        await authProvider.signIn();
      } catch (error) {
        patchState(store, stateError(error));
      }
    },
    async signOut() {
      try {
        await authProvider.signOut();
      } catch (error) {
        patchState(store, stateError(error));
      }
    }
  })),

  withHooks(store => {
    const destroy$ = new Subject<void>();
    const authProvider = inject(AuthProvider);

    return {
      onInit() {
        patchState(store, stateLoading());

        authProvider.authChanges$
          .pipe(distinctUntilChanged(), takeUntil(destroy$))
          .subscribe({
            next: user => patchState(store, stateSuccess(user ?? EMPTY_AUTH_USER)),
            error: error => patchState(store, stateError(error)),
          });
      },
      onDestroy() {
        destroy$.next();
      },
    }
  })
);

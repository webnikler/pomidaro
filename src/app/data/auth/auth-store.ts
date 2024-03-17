import { computed, inject } from '@angular/core';
import { patchState, signalStore, withComputed, withHooks, withMethods, withState } from '@ngrx/signals';
import { State, createState, stateError, stateLoading, stateSuccess } from '../common/state';
import { EMPTY_AUTH_USER } from './auth.const';
import { AuthUser } from './auth.types';
import { AuthApiService } from './auth-api.service';
import { Subject, distinctUntilChanged, takeUntil } from 'rxjs';

const DEFAULT_STATE: State<AuthUser> = createState(EMPTY_AUTH_USER);

export const AuthStore = signalStore(
  { providedIn: 'root' },

  withState<State<AuthUser>>(DEFAULT_STATE),

  withComputed(({ data }) => ({
    uid: computed(() => data().uid),
    isAuth: computed(() => Boolean(data().uid)),
  })),

  withMethods((store, authApi = inject(AuthApiService)) => ({
    async signIn() {
      try {
        await authApi.signIn();
      } catch (error) {
        patchState(store, stateError(error));
      }
    },
    async signOut() {
      try {
        await authApi.signOut();
      } catch (error) {
        patchState(store, stateError(error));
      }
    }
  })),

  withHooks(store => {
    const destroy$ = new Subject<void>();
    const authApi = inject(AuthApiService);

    return {
      onInit() {
        patchState(store, stateLoading());

        authApi.authChanges$
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

import { inject } from '@angular/core';
import { Auth, GoogleAuthProvider, Unsubscribe, User, signInWithPopup } from '@angular/fire/auth';
import { patchState, signalStore, withHooks, withMethods, withState } from '@ngrx/signals';

type UserData = User | null | undefined;
type ErrorData = Error | null | undefined;

type AuthState = { error: ErrorData, user: UserData };

const authErrorState: (error: any) => AuthState = error => ({ user: null, error });
const authSuccessState: (user: UserData) => AuthState = user => ({ user, error: null });

export const AuthStore = signalStore(
  { providedIn: 'root' },

  withState<AuthState>({ user: null, error: null }),

  withMethods((store, auth = inject(Auth)) => ({
    async signIn() {
      try {
        await signInWithPopup(auth, new GoogleAuthProvider());
      } catch (error) {
        patchState(store, authErrorState(error));
      }

    },
    async signOut() {
      try {
        await auth.signOut();
      } catch (error) {
        patchState(store, authErrorState(error));
      }
    }
  })),

  withHooks(store => {
    let unsubscribes: Unsubscribe[] = [];

    return {
      onInit() {
        unsubscribes.push(inject(Auth).onAuthStateChanged(
          user => patchState(store, authSuccessState(user)),
          error => patchState(store, authErrorState(error)),
        ));
      },
      onDestroy() {
        unsubscribes.forEach(un => un?.());
        unsubscribes = [];
      },
    }
  })
);

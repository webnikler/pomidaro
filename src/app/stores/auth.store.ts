import { computed, inject } from '@angular/core';
import { Auth, GoogleAuthProvider, Unsubscribe, User, signInWithPopup } from '@angular/fire/auth';
import { patchState, signalStore, withComputed, withHooks, withMethods, withState } from '@ngrx/signals';
import { State, createState, stateError, stateLoading, stateSuccess } from './common/state';

const EMPTY_USER: User = {
  displayName: null,
  email: null,
  phoneNumber: null,
  photoURL: null,
  providerId: '',
  uid: '',
  emailVerified: false,
  isAnonymous: true,
  metadata: {
    creationTime: '',
    lastSignInTime: '',
  },
  providerData: [],
  refreshToken: '',
  tenantId: null,

  async delete() { },
  async getIdToken() {
    return '';
  },
  async getIdTokenResult() {
    return {
      authTime: '',
      expirationTime: '',
      issuedAtTime: '',
      signInProvider: null,
      signInSecondFactor: null,
      token: '',
      claims: {},
    };
  },
  async reload() { },
  toJSON() {
    return this;
  }
}

const DEFAULT_STATE: State<User> = createState(EMPTY_USER);

export const AuthStore = signalStore(
  { providedIn: 'root' },

  withState<State<User>>(DEFAULT_STATE),

  withComputed(({ data }) => ({
    uid: computed(() => data().uid),
    isAuth: computed(() => Boolean(data().uid)),
  })),

  withMethods((store, auth = inject(Auth)) => ({
    async signIn() {
      try {
        await signInWithPopup(auth, new GoogleAuthProvider());
      } catch (error) {
        patchState(store, stateError(error));
      }
    },
    async signOut() {
      try {
        await auth.signOut();
      } catch (error) {
        patchState(store, stateError(error));
      }
    }
  })),

  withHooks(store => {
    let unsubscribes: Unsubscribe[] = [];

    return {
      onInit() {
        patchState(store, stateLoading());

        unsubscribes.push(inject(Auth).onAuthStateChanged(
          user => patchState(store, stateSuccess(user ?? EMPTY_USER)),
          error => patchState(store, stateError(error)),
        ));
      },
      onDestroy() {
        unsubscribes.forEach(un => un?.());
        unsubscribes = [];
      },
    }
  })
);

import { patchState, signalStore, withComputed, withMethods, withState } from '@ngrx/signals';
import { State, createState, stateError, stateLoading, stateSuccess } from '../common/state';
import { computed, inject } from '@angular/core';
import { User } from './user.types';
import { UserApiService } from './user-api.service';

const EMPTY_APP_USER: User = {
  id: '',
  authId: '',
  name: '',
  avatarURL: '',
};

const DEFAULT_STATE: State<User> = createState(EMPTY_APP_USER);

export const UserStore = signalStore(
  withState<State<User>>(DEFAULT_STATE),

  withComputed(({ data }) => ({
    isUserExists: computed(() => Boolean(data().id)),
  })),

  withMethods((store, userApi = inject(UserApiService)) => ({
    async requestUser() {
      patchState(store, stateLoading());

      try {
        patchState(store, stateSuccess(await userApi.getUser() || EMPTY_APP_USER))
      } catch (error) {
        patchState(store, stateError(error));
      }
    }
  })),
);

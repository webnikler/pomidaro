import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';
import { State, createState, stateError, stateLoading, stateSuccess } from './common/state';
import { inject } from '@angular/core';
import { AppUser, UsersApiService } from '@services';


const EMPTY_APP_USER: AppUser = {
  id: '',
  authId: '',
  name: '',
  avatarURL: '',
};

const DEFAULT_STATE: State<AppUser> = createState(EMPTY_APP_USER);

export const AppUserStore = signalStore(
  withState<State<AppUser>>(DEFAULT_STATE),

  withMethods((store, userApi = inject(UsersApiService)) => ({
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

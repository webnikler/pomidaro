import { signalStore, withState } from '@ngrx/signals';
import { State, createState } from './common/state';

export type Session = {
  owner_uid: string;
  name: string;
};

const EMPTY_SESSION = {
  owner_uid: '',
  name: '',
};

const DEFAULT_STATE: State<Session> = createState(EMPTY_SESSION);

export const SessionStore = signalStore(
  withState<State<Session>>(DEFAULT_STATE),
);

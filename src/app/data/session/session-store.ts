import { signalStore, withState } from '@ngrx/signals';
import { State, createState } from '../common/state';
import { Session } from './sesion.types';

const EMPTY_SESSION = {
  id: '',
  ownerId: '',
  name: '',
};

const DEFAULT_STATE: State<Session> = createState(EMPTY_SESSION);

export const SessionStore = signalStore(
  withState<State<Session>>(DEFAULT_STATE),
);

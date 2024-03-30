import { Id } from '@data/common/types';

export type User = {
  id: Id;
  authId: Id;
  name: string;
  avatarURL: string;
};

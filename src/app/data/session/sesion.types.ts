export type Session = {
  id: string;
  ownerId: string;
  name: string;
};

export type ShortSession = Pick<Session, 'name' | 'ownerId' | 'id'>;

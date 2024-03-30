import { inject } from '@angular/core'
import { SessionCollectionStore } from '@data/session'
import { UserStore } from '@data/user';

export const sessionCollectionResolver = async () => {
  const sessionCollection = inject(SessionCollectionStore);
  const user = inject(UserStore);

  await sessionCollection.requestSessions(user.data().id);
}

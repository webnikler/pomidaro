import { inject } from '@angular/core'
import { ActivatedRouteSnapshot } from '@angular/router';
import { SessionStore } from '@data/session'

export const sessionResolver = async (route: ActivatedRouteSnapshot) => {
  const session = inject(SessionStore);
  const { id } = route.params;

  if (id) {
    await session.requestSession(id);
  }
}
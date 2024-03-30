import { inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserStore } from '@data/user';

export const authGuard = async (route: ActivatedRoute, router: Router) => {
  const user = inject(UserStore);

  await user.requestUser();

  if (user.isUserExists()) {
    return true;
  } else {
    router.navigate(['auth']);
    return false;
  }
};

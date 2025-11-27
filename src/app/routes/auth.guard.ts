import { inject } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { CanActivateFn, RedirectCommand, Router } from '@angular/router';
import { AuthClient } from '@app/services/auth-client';
import { catchError, of, retry, switchMap, throwError } from 'rxjs';

export const isAuthenticated: CanActivateFn = () => {
  const router = inject(Router);
  const auth = inject(AuthClient);

  return toObservable(auth.user).pipe(
    // on load user is not present at first, so we give 1 retry for this case. If there's still no user after a delay, we'd still get kicked out to login page
    switchMap(user => user ? of(true) : throwError(() => Error('no user'))),
    retry({ count: 1, delay: 1500, resetOnSuccess: true }),
    catchError(() => of(new RedirectCommand(router.parseUrl('acc')))),
  );
};

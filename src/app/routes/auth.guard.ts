import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthClient } from '@app/services/auth-client';

export const isAuthenticated: CanActivateFn = () => {
  const router = inject(Router);
  const auth = inject(AuthClient);

  if (!auth.user()) {
    router.navigateByUrl('acc');
    return false;
  }

  return true;
};

import { Injectable, effect, inject, signal } from '@angular/core';
import { AuthService } from './auth.service';
import { extractFbDocument } from '../firebase';

type Permissions = { admin: boolean };
const DEFAULT_PERMISSIONS: Permissions = { admin: false };

@Injectable({ providedIn: 'root' })
export class PermissionsService {
  private authUser = inject(AuthService).user;
  permissions = signal<Permissions>(DEFAULT_PERMISSIONS);

  constructor() {
    effect(() => {
      const userUid = this.authUser()?.uid;

      if (userUid) {
        extractFbDocument<Permissions>(`permissions/${userUid}`)
          .subscribe(perms => this.permissions.set(perms || DEFAULT_PERMISSIONS))
      }
    });
  }
}

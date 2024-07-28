import { Injectable, computed, effect, inject, signal } from '@angular/core';
import { AuthService } from './auth.service';
import { readFbDocument } from '@app/firebase';

type Permissions = { admin: boolean };
const DEFAULT_PERMISSIONS: Permissions = { admin: false };

@Injectable({ providedIn: 'root' })
export class PermissionsService {
  private authUser = inject(AuthService).user;
  permissions = signal<Permissions>(DEFAULT_PERMISSIONS);
  admin = computed(() => this.permissions().admin);

  constructor() {
    effect(() => {
      const userUid = this.authUser()?.uid;

      if (userUid) {
        readFbDocument<Permissions>(`permissions/${userUid}`)
          .subscribe(perms => this.permissions.set(perms || DEFAULT_PERMISSIONS))
      }
    });
  }
}

import { Injectable, computed, effect, inject, signal } from '@angular/core';
import { AuthClient } from './auth';
import { readFbDocument } from '@app/firebase';

type PermissionMap = { admin: boolean };
const DEFAULT_PERMISSIONS: PermissionMap = { admin: false };

@Injectable({ providedIn: 'root' })
export class Permissions {
  private authUser = inject(AuthClient).user;
  private permissions = signal<PermissionMap>(DEFAULT_PERMISSIONS);
  admin = computed(() => this.permissions().admin);

  constructor() {
    effect(async () => {
      const userUid = this.authUser()?.uid;

      if (userUid) {
        const perms = await readFbDocument<PermissionMap>(`permissions/${userUid}`)
        this.permissions.set(perms || DEFAULT_PERMISSIONS);
      }
    });
  }
}

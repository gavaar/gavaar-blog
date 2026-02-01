import { Injectable, inject } from '@angular/core';
import { readFbDocument, updateFbDocument } from '@app/firebase';
import { Permissions } from './permissions';
import { increment } from 'firebase/firestore/lite';
import { environment } from '@environments/environment';
import { Memory, memory } from '@app/state';

type Views = { [id: string]: number };

@Injectable({ providedIn: 'root' })
export class ViewsTracker {
  private admin = inject(Permissions).admin;

  async increaseViews(path: string, id: string): Promise<number> {
    const viewsPath = `views/${path}`;

    await this.updateOrIgnoreIncrement(viewsPath, id);
    const posts = await readFbDocument<Views>(viewsPath);
    return posts[id];
  }

  private async updateOrIgnoreIncrement(path: string, id: string): Promise<void> {
    const pathKey = `${path}/${id}`;
    const deviceViewed = memory.get(Memory.Views);

    // admins and devs won't update.
    const forbidUpdate = this.admin() || !environment.production; 

    if (!deviceViewed[pathKey] && !forbidUpdate) {
      memory.patch(Memory.Views, ({ [pathKey]: true }));
      return updateFbDocument(path, { [id]: increment(1) });
    }

    return;
  }
}

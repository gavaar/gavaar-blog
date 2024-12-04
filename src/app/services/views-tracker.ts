import { Injectable, inject } from '@angular/core';
import { readFbDocument, updateFbDocument } from '@app/firebase';
import { Permissions } from './permissions';
import { Observable, concatMap, map, of, take } from 'rxjs';
import { increment } from 'firebase/firestore/lite';
import { environment } from '@environments/environment';
import { Memory, memory } from '@app/state';

type Views = { [id: string]: number };

@Injectable({ providedIn: 'root' })
export class ViewsTracker {
  private admin = inject(Permissions).admin;

  increaseViews(path: string, id: string): Observable<number> {
    const viewsPath = `views/${path}`;

    return this.updateOrIgnoreIncrement(viewsPath, id)
      .pipe(
        concatMap(() => readFbDocument<Views>(viewsPath)),
        map(posts => posts[id]),
        take(1),
      );
  }

  private updateOrIgnoreIncrement(path: string, id: string): Observable<void> {
    const pathKey = `${path}/${id}`;
    const deviceViewed = memory.get(Memory.Views);

    // admins and devs won't update.
    const forbidUpdate = this.admin() || !environment.production; 

    if (!deviceViewed[pathKey] && !forbidUpdate) {
      memory.patch(Memory.Views, ({ [pathKey]: true }));
      return updateFbDocument(path, { [id]: increment(1) });
    }

    return of(undefined);
  }
}

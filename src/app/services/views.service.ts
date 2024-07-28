import { Injectable, inject } from '@angular/core';
import { readFbDocument, updateFbDocument } from '@app/firebase';
import { PermissionsService } from './permissions.service';
import { Observable, concatMap, map, of, take } from 'rxjs';
import { increment } from 'firebase/firestore/lite';
import { environment } from '@environments/environment';

type Views = { [id: string]: number };

@Injectable({ providedIn: 'root' })
export class ViewsService {
  private admin = inject(PermissionsService).admin;

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
    const deviceViewed = JSON.parse(localStorage.getItem('viewed') || '{}');
    const forbidUpdate = this.admin() || !environment.production; // admins and devs won't update.

    if (!deviceViewed[pathKey] && !forbidUpdate) {
      localStorage.setItem('viewed', JSON.stringify({ ...deviceViewed, [pathKey]: true }));
      return updateFbDocument(path, { [id]: increment(1) });
    }

    return of(undefined);
  }
}

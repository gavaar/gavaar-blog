import { Injectable, inject } from '@angular/core';
import { readFbDocument, updateFbDocument } from '../firebase';
import { PermissionsService } from './permissions.service';
import { Observable, concatMap, map, of } from 'rxjs';
import { increment } from 'firebase/firestore/lite';
import { environment } from '../../environments/environment';

type Views = { [id: string]: number };

@Injectable({ providedIn: 'root' })
export class ViewsService {
  private admin = inject(PermissionsService).admin;

  increaseViews(path: string, id: string): Observable<number> {
    const incrementQuery = (this.admin() || !environment.production) ? of() : updateFbDocument(path, { [id]: increment(1) });
    return incrementQuery.pipe(concatMap(() => readFbDocument<Views>(path)), map(posts => posts[id]));
  }
}

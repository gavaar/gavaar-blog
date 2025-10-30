import { inject, Injectable } from '@angular/core';
import { NonZeroHabit } from '@app/entities';
import { deleteFbDocument, readFbCollection, updateFbDocument } from '@app/firebase';
import { AuthClient } from './auth-client';
import { map, Observable, take, tap } from 'rxjs';
import { GavListCache } from '@lib/list-cache';

@Injectable({ providedIn: 'root' })
export class NonZeroTrackerClient {
  private auth = inject(AuthClient);

  cache = new GavListCache(
    readFbCollection(`non-zero-tracker/${this.auth.user()?.uid}/v1`, { asMap: true })
  );

  saveHabit(habit: NonZeroHabit): Observable<NonZeroHabit> {
    const userId = this.auth.user()?.uid;
    const { id, ...partialHabit } = habit;

    return updateFbDocument(`non-zero-tracker/${userId}/v1/${habit.id}`, partialHabit)
      .pipe(
        map(() => ({ ...partialHabit, id })),
        tap(habit => this.cache.put(habit)),
        take(1),
      );
  }

  updateTracker() {}
  deleteHabit(habitId: string): Observable<void> {
    const userId = this.auth.user()?.uid;
    return deleteFbDocument(`non-zero-tracker/${userId}/v1/${habitId}`)
      .pipe(take(1));
  }
}

import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, query, orderBy, limit, doc, writeBatch, increment } from 'firebase/firestore/lite';
import { firebaseConfig } from './firebase-config';
import { Observable, from, map, of } from 'rxjs';
import { environment } from '../environments/environment';

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

export const track = (data: { city: string; country: string; fingerprint: string; ip: string; route: string }): Observable<void> => {
  if (!environment.prod) return of(); // comment this and swap below comment with its line below to debug
  const { city, country, fingerprint, ip, route: _route } = data;
  // const route = `${environment.prod ? '' : 'dev::'}r_${_route.substring(1)}`;
  const route = `r_${_route.substring(1)}`;

  const batch = writeBatch(db);

  const routesRef = doc(db, `tracking/${route}/u/${fingerprint}`);
  const countRef = doc(db, `tracking/${route}`);
  
  batch.update(countRef, { count: increment(1) });
  batch.set(routesRef, { city, country, ip }, { merge: true });

  return from(batch.commit());
}

type DataOptions = { orderBy?: string; limit?: number };
export const extractFbData = <T>(collectionName: string, options: DataOptions = {}): Observable<T[]> => {
  const collectionRef = collection(db, collectionName);

  const collect = (() => {
    if (options?.orderBy && options?.limit) {
      return query(collectionRef, orderBy(options.orderBy, 'desc'), limit(options.limit));
    }
    if (options?.orderBy) {
      return query(collectionRef, orderBy(options.orderBy, 'desc'));
    }
    if (options?.limit) {
      return query(collectionRef, limit(options.limit));
    }
    return query(collectionRef);
  })();

  return from(getDocs(collect)).pipe(
    map(snapshot => snapshot.docs.map(d => (<T>{ version: d.id, ...d.data() }))),
  );
}

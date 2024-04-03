import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, query, orderBy, limit } from 'firebase/firestore/lite';
import { firebaseConfig } from './firebase-config';
import { Observable, from, map } from 'rxjs';

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

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

import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, query, orderBy, limit, getDoc, doc } from 'firebase/firestore/lite';
import { firebaseConfig } from './firebase-config';
import { Observable, from, map } from 'rxjs';

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

type DataOptions = { orderBy?: string; limit?: number, asMap?: boolean };

export function extractFbCollection<T>(collectionName: string, options: DataOptions & { asMap: true }): Observable<{ [id: string]: T }>
export function extractFbCollection<T>(collectionName: string, options: DataOptions & { asMap?: false }): Observable<T[]>
export function extractFbCollection<T>(collectionName: string, options: DataOptions) {
  const collectionRef = collection(db, collectionName);

  const collect = (() => {
    if (options.orderBy && options.limit) {
      return query(collectionRef, orderBy(options.orderBy, 'desc'), limit(options.limit));
    }
    if (options.orderBy) {
      return query(collectionRef, orderBy(options.orderBy, 'desc'));
    }
    if (options.limit) {
      return query(collectionRef, limit(options.limit));
    }
    return query(collectionRef);
  })();

  return from(getDocs(collect)).pipe(
    map(snapshot => {
      if (options.asMap) {
        return snapshot.docs.reduce((acc, d) => {
          acc[d.id] = { id: d.id, ...d.data() as T };
          return acc;
        }, {} as { [id: string]: T });
      }

      return snapshot.docs.map(d => (<T>{ version: d.id, ...d.data() }));
    }),
  );
}

export function extractFbDocument<T>(documentPath: string): Observable<T> {
  return from(getDoc(doc(db, documentPath))).pipe(
    map(snapshot => ({ ...snapshot.data(), id: snapshot.id }) as T),
  )
}

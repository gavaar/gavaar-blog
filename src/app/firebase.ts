import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, query, orderBy, limit, getDoc, doc, deleteDoc, updateDoc, where, QueryConstraint, WhereFilterOp } from 'firebase/firestore/lite';
import { firebaseConfig } from './firebase-config';
import { Observable, from, map } from 'rxjs';
import { getAuth } from 'firebase/auth';

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

type DataOptions = { orderBy?: string; limit?: number, asMap?: boolean, where?: [string, WhereFilterOp, string] };

export function readFbCollection<T>(collectionName: string, options: DataOptions & { asMap: true }): Observable<{ [id: string]: T }>
export function readFbCollection<T>(collectionName: string, options: DataOptions & { asMap?: false }): Observable<T[]>
export function readFbCollection<T>(collectionName: string, options: DataOptions) {
  const collectionRef = collection(db, collectionName);
  const constraints: QueryConstraint[] = [];

  if (options.orderBy) {
    constraints.push(orderBy(options.orderBy, 'desc'));
  }
  if (options.limit) {
    constraints.push(limit(options.limit));
  }
  if (options.where) {
    const [property, equality, value] = options.where;
    constraints.push(where(property, equality, value));
  }

  const docsQuery = getDocs(query(collectionRef, ...constraints));
  return from(docsQuery).pipe(
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

export function readFbDocument<T>(documentPath: string): Observable<T> {
  return from(getDoc(doc(db, documentPath))).pipe(
    map(snapshot => ({ ...snapshot.data(), id: snapshot.id }) as T),
  )
}

export function updateFbDocument<T>(documentPath: string, value: Partial<T>): Observable<void> {
  return from(updateDoc(doc(db, documentPath), value));
}

export function deleteFbDocument(documentPath: string): Observable<void> {
  return from(deleteDoc(doc(db, documentPath)));
}

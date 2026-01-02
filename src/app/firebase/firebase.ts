import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, query, orderBy, limit, getDoc, doc, deleteDoc, where, QueryConstraint, WhereFilterOp, setDoc, DocumentSnapshot, startAfter, Timestamp, OrderByDirection, writeBatch } from 'firebase/firestore/lite';
import { firebaseConfig } from './firebase-config';
import { Observable, from, map } from 'rxjs';
import { getAuth } from 'firebase/auth';

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

type DataOptions = {
  orderBy?: string | [string, OrderByDirection];
  limit?: number;
  asMap?: boolean;
  where?: [string, WhereFilterOp, string];
  startAfter?: Timestamp;
};

export function readFbCollection<T>(collectionName: string, options: DataOptions & { asMap: true }): Observable<{ [id: string]: T }>
export function readFbCollection<T>(collectionName: string, options: DataOptions & { asMap?: false }): Observable<T[]>
export function readFbCollection<T>(collectionName: string, options: DataOptions) {
  const collectionRef = collection(db, collectionName);
  const constraints: QueryConstraint[] = [];

  if (options.orderBy) {
    if (Array.isArray(options.orderBy)) {
      constraints.push(orderBy(options.orderBy[0], options.orderBy[1]));
    } else {
      constraints.push(orderBy(options.orderBy, 'desc'));
    }
  }
  if (options.limit) {
    constraints.push(limit(options.limit));
  }
  if (options.startAfter) {
    constraints.push(startAfter(options.startAfter));
  }
  if (options.where) {
    const [property, equality, value] = options.where;
    constraints.push(where(property, equality, value));
  }

  const docsQuery = getDocs(query(collectionRef, ...constraints));
  return from(docsQuery).pipe(
    map(snapshot => {
      if (options.asMap) {
        return snapshot.docs.reduce((acc, document) => {
          acc[document.id] = docToDataObject(document) as T;
          return acc;
        }, {} as { [id: string]: T });
      }

      return snapshot.docs.map(document => docToDataObject(document) as T);
    }),
  );
}

export function readFbDocument<T>(documentPath: string): Observable<T> {
  return from(getDoc(doc(db, documentPath))).pipe(
    map(snapshot => docToDataObject(snapshot) as T),
  )
}

export function updateFbDocument<T>(documentPath: string, value: Partial<T>): Observable<void> {
  return from(setDoc(doc(db, documentPath), value, { merge: true }));
}

export function deleteFbDocument(documentPath: string): Observable<void> {
  return from(deleteDoc(doc(db, documentPath)));
}

export class FbBatch {
  private batch = writeBatch(db);

  delete(path: string): void {
    this.batch.delete(doc(db, path));
  }

  commit(): Observable<void> {
    return from(this.batch.commit());
  }
}

// HELPERS
const docToDataObject = (snapshot: DocumentSnapshot) => {
  return { id: snapshot.id, ...snapshot.data() };
}

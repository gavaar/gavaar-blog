import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, query, orderBy, limit, getDoc, doc, deleteDoc, where, QueryConstraint, WhereFilterOp, setDoc, startAfter, Timestamp, OrderByDirection, writeBatch, getAggregate, AggregateSpec } from 'firebase/firestore/lite';
import { firebaseConfig } from './firebase-config';
import { getAuth } from 'firebase/auth';

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

type DataOptions = {
  orderBy?: string | string[] | [string, OrderByDirection];
  limit?: number;
  asMap?: boolean;
  where?: [string, WhereFilterOp, string | number] | (string | number)[];
  startAfter?: Timestamp;
  aggregate?: AggregateSpec;
};

export async function readFbCollection<T>(collectionName: string, options?: DataOptions & { asMap: true }): Promise<{ [id: string]: T }>
export async function readFbCollection<T>(collectionName: string, options?: DataOptions & { asMap?: false, aggregate?: null }): Promise<T[]>
export async function readFbCollection<T>(collectionName: string, options?: DataOptions & { aggregate: AggregateSpec }): Promise<{ [id: string]: number }>
export async function readFbCollection<T>(collectionName: string, options: DataOptions = {}): Promise<T[] | { [id: string]: T } | { [id: string]: number }> {
  const collectionRef = collection(db, collectionName);
  const constraints: QueryConstraint[] = [];

  if (options.orderBy) {
    if (Array.isArray(options.orderBy)) {
      constraints.push(orderBy(options.orderBy[0], options.orderBy[1] as OrderByDirection));
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
    constraints.push(where(property as string, equality as WhereFilterOp, value));
  }

  const snapshot = await getDocs(query(collectionRef, ...constraints));

  if (options.aggregate) {
    const aggregated = await getAggregate(query(collectionRef, ...constraints), options.aggregate);
    return aggregated.data() as { [id: string]: number };
  }

  if (options.asMap) {
    return snapshot.docs.reduce((acc, document) => {
      acc[document.id] = { id: document.id, ...document.data() } as T;
      return acc;
    }, {} as { [id: string]: T });
  }

  return snapshot.docs.map(document => ({ id: document.id, ...document.data() } as T));
}

export async function readFbDocument<T>(documentPath: string): Promise<T> {
  const document = await getDoc(doc(db, documentPath));
  return { id: document.id, ...document.data() } as T;
}

export async function updateFbDocument<T>(documentPath: string, value: Partial<T>): Promise<void> {
  return setDoc(doc(db, documentPath), value, { merge: true });
}

export async function deleteFbDocument(documentPath: string): Promise<void> {
  return deleteDoc(doc(db, documentPath));
}

export class FbBatch {
  private batch = writeBatch(db);

  update<T>(path: string, partial: { [x: string]: any }): void {
    this.batch.set(doc(db, path), partial, { merge: true });
  }

  delete(path: string): void {
    this.batch.delete(doc(db, path));
  }

  commit(): Promise<void> {
    return this.batch.commit();
  }
}

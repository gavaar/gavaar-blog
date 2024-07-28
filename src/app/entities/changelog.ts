import { Timestamp } from 'firebase/firestore/lite';

export interface Changelog {
  id: `${number}.${number}.${number}`;
  date: Timestamp;
  changes: string[];
  techChanges: string[];
}

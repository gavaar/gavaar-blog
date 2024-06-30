import { Timestamp } from 'firebase/firestore/lite';

export interface Changelog {
  version: `${number}.${number}.${number}`;
  date: Timestamp;
  changes: string[];
  techChanges: string[];
}

import { Timestamp } from "firebase/firestore/lite";

export interface Goal {
  title: string;
  started: Timestamp;
  finished: Timestamp;
  effort: number;
}

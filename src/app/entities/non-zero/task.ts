import { Timestamp } from "firebase/firestore/lite";

export interface Task {
  date: Timestamp;
  effort: number;
  message?: string;
}

import { Timestamp } from 'firebase/firestore/lite';

export type NonZeroDateString = `${number}-${number}-${number}`;

export interface HabitConfig {
  id: string;
  icon: string;
  title: string;
  description?: string;
  updated?: Timestamp;
}

export interface HabitDay {
  id: string;
  date: Timestamp;
  done: number;
  habitId: string;
  message?: string;
}

export interface HabitGoal {
  start: NonZeroDateString;
  streak: number;
  effort: number;
  title: string;
}

export interface Habit extends HabitConfig {
  editing?: boolean;
  goal?: HabitGoal;
  lastWeeks: {
    [date: NonZeroDateString]: {
      done: number;
      message?: string;
    }
  };
}

import { Timestamp } from 'firebase/firestore/lite';

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
  start: Timestamp;
  streak: number;
  value: string;
  weightedDone: number;
}

export interface Habit extends HabitConfig {
  goal?: HabitGoal;
  lastWeeks: {
    [date: `${number}-${number}-${number}`]: {
      done: number;
      message?: string;
    }
  };
}

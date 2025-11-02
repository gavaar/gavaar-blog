import { Timestamp } from 'firebase/firestore/lite';

export interface HabitConfig {
  id: string;
  icon: string;
  title: string;
  description?: string;
}

export interface HabitDay {
  id: string;
  date: Timestamp;
  done: number;
  habitId: string;
  message?: string;
}

export interface Habit extends HabitConfig {
  lastWeeks: {
    [date: `${number}-${number}-${number}`]: {
      done: number;
      message?: string;
    }
  };
}

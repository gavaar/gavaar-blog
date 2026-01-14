import { Timestamp } from 'firebase/firestore/lite';

export type NonZeroDateString = `${number}-${number}-${number}`;

export interface HabitGoal {
  start: NonZeroDateString;
  lastModified: NonZeroDateString;
  streak: number;
  effort: number;
  title: string;
}

export interface HabitConfig {
  id: string;
  icon: string;
  title: string;
  goal?: HabitGoal;
  description?: string;
  updated?: Timestamp;
}

export interface Task {
  id: string;
  date: Timestamp;
  done: number;
  habitId: string;
  message?: string;
}

export interface Habit extends HabitConfig {
  editing?: boolean;
  lastWeeks: {
    [date: NonZeroDateString]: {
      done: number;
      message?: string;
    }
  };
}

export class HabitUtils {
  static buildTaskId(habitId: string, date: Date): `${string}::${NonZeroDateString}` {
    const dateString = HabitUtils.dateToNonZeroDate(date);
    return `${habitId}::${dateString}`;
  }

  static dateToNonZeroDate(date: Date): NonZeroDateString {
    return `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
  }
}

import { NonZeroDateString } from "./utils";
import { Task } from "./task";

export interface Habit {
  id: string;
  icon: string;
  title: string;
  streak: number;
  latestTasks: { [taskId: NonZeroDateString]: Pick<Task, 'message' | 'effort'> };
  currentGoal?: { title: string; started: NonZeroDateString };
  description?: string;
  latestEntryTime?: NonZeroDateString;
  // temp - built in the front end
  effort?: number;
}

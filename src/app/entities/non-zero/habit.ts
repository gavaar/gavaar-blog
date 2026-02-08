import { NonZeroDateString } from "./utils";
import { Task } from "./task";

export interface Habit {
  id: string;
  icon: string;
  title: string;
  latestTasks: { [taskId: NonZeroDateString]: Pick<Task, 'message' | 'effort'> & { streak?: number } };
  currentGoal?: { title: string; started: NonZeroDateString };
  description?: string;
  // built in the front end
  effort?: number;
}

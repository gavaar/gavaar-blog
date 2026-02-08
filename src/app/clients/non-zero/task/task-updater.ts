import { Habit, HabitUtils, NonZeroDateString, Task } from "@app/entities/non-zero";
import { FbBatch } from "@app/firebase";

export class TaskUpdater {
  batch = new FbBatch();
  habit: Habit;
  task: Task;
  taskDate: NonZeroDateString;

  private baseUri: string;
  private taskUri: string;
  private today = HabitUtils.today();

  constructor(habit: Habit, task: Task, userId: string) {
    this.habit = { ...habit };
    this.task = { ...task };
    this.baseUri = `non-zero/${userId}/habit/${habit.id}`;
    this.taskDate = HabitUtils.dateToNonZero(new Date(task.date.seconds * 1000));
    this.taskUri = `${this.baseUri}/task/${this.taskDate}`;
  }

  updateTaskMemory(): this {
    const filteredTasks = this.filterOutdatedTasks();

    const outdatedTaskEffort = Math.max(filteredTasks[this.taskDate]?.effort || 0, 0);
    const updatedTaskEffort = Math.max(this.task.effort, 0);
    const effortDiff = (updatedTaskEffort - outdatedTaskEffort);
    this.habit.effort = (this.habit.effort || 0) + effortDiff;
   
    const { effort, message } = this.task;
    filteredTasks[this.taskDate] = { effort, message };
    this.batch.update(this.baseUri, { latestTasks: filteredTasks });
    this.habit.latestTasks = filteredTasks;
    

    return this;
  }

  updateStreak(): this {
    const taskDate = HabitUtils.dateToNonZero(new Date(this.task.date.seconds * 1000));
    if (taskDate !== this.today) return this;
    
    const yesterday = HabitUtils.dateToNonZero(HabitUtils.xDaysAgo(1));
    const yesterdayStreak = this.habit.latestTasks[yesterday].streak || 0;
    const todayEffort = this.habit.latestTasks[this.today]?.effort;
    
    if (todayEffort < 0) { return this; }

    let streak = 0;
    if (todayEffort > 0) {
      streak = yesterdayStreak + 1;
    }
    if (todayEffort === 0) {
      streak = yesterdayStreak;
    }
    this.batch.update(this.baseUri, { latestTasks: { [this.today]: { streak } } });
    this.habit.latestTasks[this.today].streak = streak;
    
    return this;
  }

  appendTask(): this {
    this.batch.update(this.taskUri, this.task);
    return this;
  }

  private filterOutdatedTasks(): Habit['latestTasks'] {
    if (!this.habit) throw Error('Habit ${habitId} does not exist');

    const tasks = { ...this.habit.latestTasks };
    (Object.keys(tasks) as NonZeroDateString[]).forEach((taskDate) => {
      const pivotDate = HabitUtils.dateToNonZero(HabitUtils.xDaysAgo(56));
      if (HabitUtils.dateIsOlderThan(taskDate, pivotDate)) {
        delete tasks[taskDate];
      }
    });

    return tasks;
  }
}

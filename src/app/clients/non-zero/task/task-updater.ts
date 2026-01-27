import { Habit, HabitUtils, NonZeroDateString, Task } from "@app/entities/non-zero";
import { FbBatch } from "@app/firebase";

export class TaskUpdater {
  batch = new FbBatch();
  habit: Habit;
  task: Task;
  taskDate: NonZeroDateString;

  private baseUri: string;
  private taskUri: string;
  private today = HabitUtils.dateToNonZero(new Date());

  constructor(habit: Habit, task: Task, userId: string) {
    this.habit = { ...habit };
    this.task = { ...task };
    this.baseUri = `non-zero/${userId}/habit/${habit.id}`;
    this.taskDate = HabitUtils.dateToNonZero(new Date(task.date.seconds * 1000));
    this.taskUri = `${this.baseUri}/task/${this.taskDate}`;
  }

  updateTaskMemory(): this {
    const filteredTasks = this.filterOutdatedTasks();

    const previousTaskEffort = Math.max(filteredTasks[this.taskDate]?.effort || 0, 0);
    const newTaskEffort = Math.max(this.task.effort, 0);
    const effortDiff = (newTaskEffort - previousTaskEffort);
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

    const latestEntryTime = this.habit.latestEntryTime;
    const yesterday = HabitUtils.dateToNonZero(HabitUtils.xDaysAgo(1));

    if (!latestEntryTime || latestEntryTime === yesterday) {
      this.batch.update(this.baseUri, { streak: this.habit.streak + 1, latestEntryTime: this.today });
      this.habit.streak += 1;
      this.habit.latestEntryTime = this.today;
    }

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

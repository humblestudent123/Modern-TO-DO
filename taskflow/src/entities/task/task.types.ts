// src/entities/task/task.types.ts
export interface SubTask {
  id: number;
  title: string;
  isDone: boolean;
}

export interface Task {
  id: number;
  title: string;
  subTasks: SubTask[];
}



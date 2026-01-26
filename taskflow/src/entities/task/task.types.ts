// src/entities/task/task.types.ts
export type SubTask = {
  id: string;
  title: string;
  isDone: boolean;
};

export type Task = {
  id: string;
  title: string;
  columnId: "todo" | "inProgress" | "done";
  priority: "low" | "normal" | "high";
  isPinned: boolean;
  isImportant: boolean;
  subTasks?: SubTask[];
};



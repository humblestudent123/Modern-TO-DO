// src/entities/task/task.types.ts
export type Task = {
  id: string;
  title: string;
  columnId: string; // 'todo' | 'inProgress' | 'done'
  priority: "low" | "normal" | "high";
  isPinned: boolean;
  isImportant: boolean;
};

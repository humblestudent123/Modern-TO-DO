export interface SubTask {
  id: string; // должно быть string, а не number
  title: string;
  isDone: boolean;
}

export interface Task {
  id: string;
  title: string;
  columnId: string;
  priority: "low" | "normal" | "high";
  isPinned: boolean;
  isImportant: boolean;
  subTasks?: SubTask[]; // опциональное поле
}

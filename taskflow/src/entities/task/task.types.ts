export interface SubTask {
  id: string;
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
  subTasks: SubTask[];
}



import { useMemo } from "react";
import TaskCard from "../../../entities/task/TaskCard";
import styles from "./Column.module.css";
import type { Task, SubTask } from "../../../entities/task/task.types";

type Props = {
  title: string;
  columnId: string;
  tasks: Task[];
  onDelete: (id: string) => void;
  onMoveTask: (taskId: string, toColumnId: string) => void;
  onChangePriority?: (id: string, priority: Task["priority"]) => void;
  onAddSubTask?: (taskId: string, title: string) => void; 
  onToggleSubTask?: (taskId: string, subTaskId: string) => void;
  onDeleteSubTask?: (taskId: string, subTaskId: string) => void;
  onReorderSubTasks?: (taskId: string, newSubTasks: SubTask[]) => void;
};

const PRIORITY_ORDER: Record<Task["priority"], number> = {
  high: 3,
  normal: 2,
  low: 1,
};

export default function Column({
  title,
  columnId,
  tasks,
  onDelete,
  onMoveTask,
  onChangePriority,
  onAddSubTask,
  onToggleSubTask,
  onDeleteSubTask,
  onReorderSubTasks,
}: Props) {
  // Фильтрация и сортировка задач по колонке
  const filteredTasks = useMemo(
    () =>
      tasks
        .filter(task => task.columnId === columnId)
        .slice()
        .sort((a, b) => PRIORITY_ORDER[b.priority] - PRIORITY_ORDER[a.priority]),
    [tasks, columnId]
  );

  // Drag & Drop
  const handleDragOver = (e: React.DragEvent) => e.preventDefault();
  const handleDrop = (e: React.DragEvent) => {
    const taskId = e.dataTransfer.getData("text/plain");
    if (taskId) onMoveTask(taskId, columnId);
  };

  // Универсальный DragStart для всех задач
  const handleDragStart = (e: React.DragEvent<HTMLDivElement>) => {
    const id = (e.currentTarget as HTMLDivElement).dataset.id;
    if (id) e.dataTransfer.setData("text/plain", id);
  };

  // Класс колонки по type
  const columnClass = {
    todo: styles.todoColumn,
    inProgress: styles.inProgressColumn,
    done: styles.doneColumn,
  }[columnId] || "";

  return (
    <div
      className={`${styles.column} ${columnClass}`}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      <h3 className={styles.title}>{title}</h3>
      <div className={styles.tasks}>
        {filteredTasks.map(task => (
          <TaskCard
            key={task.id}
            task={task}
            columnId={columnId}
            onDelete={onDelete}
            onChangePriority={onChangePriority}
            onAddSubTask={onAddSubTask}
            onToggleSubTask={onToggleSubTask}
            onDeleteSubTask={onDeleteSubTask}
            onReorderSubTasks={onReorderSubTasks}
            onDragStart={handleDragStart}
            draggable
            data-id={task.id} // 🔹 для handleDragStart
          />
        ))}
      </div>
    </div>
  );
}

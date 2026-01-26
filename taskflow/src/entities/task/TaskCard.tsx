import type { Task } from "../../entities/task/task.types";
import styles from "./TaskCard.module.css";

type Props = {
  task: Task;
  columnId: string; // ← важно, чтобы знать в какой колонке задача
  onTogglePinned?: (id: string) => void;
  onToggleImportant?: (id: string) => void;
  onDelete?: (id: string) => void;
  draggable?: boolean;
  onDragStart?: (e: React.DragEvent<HTMLDivElement>) => void;
};

export default function TaskCard({
  task,
  columnId,
  onTogglePinned,
  onToggleImportant,
  onDelete,
  draggable,
  onDragStart
}: Props) {
  const isDone = columnId === "done"; // ← вычисляем здесь

  return (
    <div
      className={`
        ${styles.card} 
        ${task.isPinned ? styles.pinned : ""} 
        ${task.isImportant ? styles.important : ""} 
        ${isDone ? styles.done : ""}
      `}
      draggable={draggable && !task.isPinned} // закреплённые нельзя перетаскивать
      onDragStart={task.isPinned ? undefined : onDragStart}
    >
      <p className={styles.title}>{task.title}</p>
      <div className={styles.buttons}>
        <button onClick={() => onTogglePinned?.(task.id)}>📌</button>
        <button onClick={() => onToggleImportant?.(task.id)}>⭐</button>
        <button onClick={() => onDelete?.(task.id)}>❌</button>
      </div>
    </div>
  );
}

import type { Task } from "../../entities/task/task.types";
import styles from "./TaskCard.module.css";

type Props = {
  task: Task;
  onTogglePinned?: (id: string) => void;
  onToggleImportant?: (id: string) => void;
};

export default function TaskCard({ task, onTogglePinned, onToggleImportant }: Props) {
  if (!task) return null;

  return (
    <div className={`${styles.card} ${task.isImportant ? styles.important : ""}`}>
      <p className={styles.title}>{task.title}</p>
      <div className={styles.buttons}>
        <button onClick={() => onTogglePinned?.(task.id)}>📌</button>
        <button onClick={() => onToggleImportant?.(task.id)}>⭐</button>
      </div>
    </div>
  );
}

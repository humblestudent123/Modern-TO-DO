import type { Task } from "./task.types";
import styles from "./TaskCard.module.css";

type Props = {
  task: Task;
  onTogglePinned?: (id: string) => void;
  onToggleImportant?: (id: string) => void;
};

export default function TaskCard({ task, onTogglePinned, onToggleImportant }: Props) {
  if (!task) return null;

  return (
    <div className={styles.card}>
      <div style={{ flex: 1 }}>
        <p className={styles.title}>{task.title}</p>
      </div>
      <button onClick={() => onTogglePinned?.(task.id)}>📌</button>
      <button onClick={() => onToggleImportant?.(task.id)}>⭐</button>
    </div>
  );
}
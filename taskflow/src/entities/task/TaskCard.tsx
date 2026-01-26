import type { Task } from "../../entities/task/task.types";
import styles from "./TaskCard.module.css";

type Props = {
  task: Task;
};

export default function TaskCard({ task }: Props) {
  if (!task) return null; // защита от undefined

  return (
    <div className={styles.card}>
      {task.isPinned && <span>📌</span>}
      {task.isImportant && <span>⭐</span>}
      <p className={styles.title}>{task.title}</p>
    </div>
  );
}
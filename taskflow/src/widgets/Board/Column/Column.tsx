import TaskCard from "../../../entities/task/TaskCard";
import styles from "./Column.module.css";
import type { Task } from "../../../entities/task/task.types";

type Props = {
  title: string;
  columnId: string;
  tasks: Task[];
  onTogglePinned: (id: string) => void;
  onToggleImportant: (id: string) => void;
};

export default function Column({ title, columnId, tasks, onTogglePinned, onToggleImportant }: Props) {
  const filteredTasks = tasks
    .filter(task => task.columnId === columnId)
    .sort((a, b) => (b.isPinned ? 1 : 0) - (a.isPinned ? 1 : 0)); // pinned сверху

  return (
    <div className={styles.column}>
      <h3 className={styles.title}>{title}</h3>
      <div className={styles.tasks}>
        {filteredTasks.map(task => (
          <TaskCard
            key={task.id}
            task={task}
            onTogglePinned={onTogglePinned}
            onToggleImportant={onToggleImportant}
          />
        ))}
      </div>
    </div>
  );
}

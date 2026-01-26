import TaskCard from "../../../entities/task/TaskCard";
import styles from "./Column.module.css";
import type { Task } from "../../../entities/task/task.types";

type Props = {
  title: string;
  columnId: string;
  tasks: Task[];
  onTogglePinned: (id: string) => void;
  onToggleImportant: (id: string) => void;
  onMoveTask: (taskId: string, toColumnId: string) => void; // новая функция
};

export default function Column({ title, columnId, tasks, onTogglePinned, onToggleImportant, onMoveTask }: Props) {
  const filteredTasks = tasks
    .filter(task => task.columnId === columnId)
    .sort((a, b) => (b.isPinned ? 1 : 0) - (a.isPinned ? 1 : 0));

  // Drag & Drop
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault(); // нужно для drop
  };

  const handleDrop = (e: React.DragEvent) => {
    const taskId = e.dataTransfer.getData("text/plain");
    if (taskId) onMoveTask(taskId, columnId);
  };

  return (
    <div className={styles.column} onDragOver={handleDragOver} onDrop={handleDrop}>
      <h3 className={styles.title}>{title}</h3>
      <div className={styles.tasks}>
        {filteredTasks.map(task => (
          <TaskCard
            key={task.id}
            task={task}
            onTogglePinned={onTogglePinned}
            onToggleImportant={onToggleImportant}
            draggable={true}
            onDragStart={(e: React.DragEvent) => e.dataTransfer.setData("text/plain", task.id)}
          />
        ))}
      </div>
    </div>
  );
}


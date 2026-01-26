import TaskCard from "../../../entities/task/TaskCard";
import styles from "./Column.module.css";
import type { Task } from "../../../entities/task/task.types";

type Props = {
  title: string;
  columnId: string;
  tasks: Task[];
  onTogglePinned: (id: string) => void;
  onToggleImportant: (id: string) => void;
  onDelete: (id: string) => void;
  onMoveTask: (taskId: string, toColumnId: string) => void;
  onChangePriority?: (id: string, priority: Task["priority"]) => void;
};

export default function Column({
  title,
  columnId,
  tasks,
  onTogglePinned,
  onToggleImportant,
  onDelete,
  onMoveTask,
  onChangePriority
}: Props) {

  // Фильтруем задачи по колонке и сортируем:
  // 1. Pinned → 2. Important → 3. Priority (high → normal → low)
  const filteredTasks = tasks
    .filter(task => task.columnId === columnId)
    .sort((a, b) => {
      // pinned всегда сверху
      if (a.isPinned && !b.isPinned) return -1;
      if (!a.isPinned && b.isPinned) return 1;

      // важные после pinned
      if (a.isImportant && !b.isImportant) return -1;
      if (!a.isImportant && b.isImportant) return 1;

      // сортировка по приоритету внутри группы
      const priorityOrder = { high: 3, normal: 2, low: 1 };
      return priorityOrder[b.priority] - priorityOrder[a.priority];
    });

  const handleDragOver = (e: React.DragEvent) => e.preventDefault();
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
            columnId={columnId} // <- вот здесь
            onTogglePinned={onTogglePinned}
            onToggleImportant={onToggleImportant}
            onDelete={onDelete}
            draggable
            onDragStart={(e) => e.dataTransfer.setData("text/plain", task.id)}
          />
        ))}
      </div>
    </div>
  );
}

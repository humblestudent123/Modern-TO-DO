import { useState } from "react";
import type { Task, SubTask } from "./task.types";
import styles from "./TaskCard.module.css";

type Props = {
  task: Task & { subTasks?: SubTask[] };
  onTogglePinned?: (id: string) => void;
  onToggleImportant?: (id: string) => void;
  onDelete?: (id: string) => void;
  onAddSubTask?: (taskId: string, title: string) => void;
  onToggleSubTask?: (taskId: string, subTaskId: string) => void;
  draggable?: boolean;
  onDragStart?: (e: React.DragEvent<HTMLDivElement>) => void;
};

export default function TaskCard({
  task,
  onTogglePinned,
  onToggleImportant,
  onDelete,
  onAddSubTask,
  onToggleSubTask,
  draggable,
  onDragStart,
}: Props) {
  const [expanded, setExpanded] = useState(false);
  const [newSubTaskTitle, setNewSubTaskTitle] = useState("");

  const handleAddSubTask = () => {
    if (!newSubTaskTitle.trim()) return;
    onAddSubTask?.(task.id, newSubTaskTitle.trim());
    setNewSubTaskTitle("");
    setExpanded(true); // авто-открываем список после добавления
  };

  return (
    <div
      className={`${styles.card} ${task.isPinned ? styles.pinned : ""} ${
        task.isImportant ? styles.important : ""
      } ${task.columnId === "done" ? styles.done : ""}`}
      draggable={draggable && !task.isPinned}
      onDragStart={task.isPinned ? undefined : onDragStart}
    >
      {/* Заголовок и кнопки */}
      <div className={styles.cardHeader}>
        <p className={styles.title}>{task.title}</p>
        <div className={styles.buttons}>
          <button onClick={() => onTogglePinned?.(task.id)}>📌</button>
          <button onClick={() => onToggleImportant?.(task.id)}>⭐</button>
          <button onClick={() => onDelete?.(task.id)}>❌</button>
          <button onClick={() => setExpanded(prev => !prev)}>
            {expanded ? "▲" : "▼"}
          </button>
        </div>
      </div>

      {/* Подзадачи */}
      {expanded && (
        <div className={styles.subTasks}>
          {(task.subTasks || []).map(sub => (
            <label key={sub.id} className={styles.subTaskItem}>
              <input
                type="checkbox"
                checked={sub.isDone}
                onChange={() => onToggleSubTask?.(task.id, sub.id)}
              />
              <span className={sub.isDone ? styles.subTaskDone : ""}>
                {sub.title}
              </span>
            </label>
          ))}

          {/* Добавление новой подзадачи */}
          <div className={styles.addSubTask}>
            <input
              type="text"
              placeholder="Add sub-task..."
              value={newSubTaskTitle}
              onChange={e => setNewSubTaskTitle(e.target.value)}
              onKeyDown={e => e.key === "Enter" && handleAddSubTask()}
            />
            <button onClick={handleAddSubTask}>Add</button>
          </div>
        </div>
      )}
    </div>
  );
}

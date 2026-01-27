import { useState } from "react";
import styles from "./TaskModal.module.css";

type SubTask = {
  id: string;
  title: string;
  isDone: boolean;
};

type Task = {
  id: string;
  title: string;
  subTasks?: SubTask[];
};

type Props = {
  task: Task;
  isOpen: boolean;
  onClose: () => void;
  onAddSubTask?: (taskId: string, title: string) => void;
  onToggleSubTask?: (taskId: string, subTaskId: string) => void;
  onDeleteSubTask?: (taskId: string, subTaskId: string) => void;
};

export default function TaskModal({
  task,
  isOpen,
  onClose,
  onAddSubTask,
  onToggleSubTask,
  onDeleteSubTask,
}: Props) {
  const [newSubTaskTitle, setNewSubTaskTitle] = useState("");

  if (!isOpen) return null;

  const handleAddSubTask = () => {
    if (!newSubTaskTitle.trim()) return;
    onAddSubTask?.(task.id, newSubTaskTitle.trim());
    setNewSubTaskTitle("");
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        {/* Заголовок */}
        <div className={styles.header}>
          <h2>{task.title}</h2>
          <button className={styles.close} onClick={onClose}>✖</button>
        </div>

        {/* Список подзадач */}
        <div className={styles.subTasks}>
          {(task.subTasks || []).map((sub) => (
            <div key={sub.id} className={styles.subTaskItem}>
              {/* Чекбокс */}
              <div
                className={`${styles.checkbox} ${sub.isDone ? styles.done : ""}`}
                onClick={() => onToggleSubTask?.(task.id, sub.id)}
              >
                {sub.isDone ? "✔" : ""}
              </div>

              {/* Заголовок */}
              <span className={`${styles.subTaskTitle} ${sub.isDone ? styles.done : ""}`}>
                {sub.title}
              </span>

              {/* Удаление */}
              <button
                className={styles.delete}
                onClick={() => onDeleteSubTask?.(task.id, sub.id)}
              >
                🗑
              </button>
            </div>
          ))}
        </div>

        {/* Добавление новой подзадачи */}
        <div className={styles.addSubTask}>
          <input
            type="text"
            placeholder="Add new sub-task..."
            value={newSubTaskTitle}
            onChange={(e) => setNewSubTaskTitle(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleAddSubTask()}
          />
          <button onClick={handleAddSubTask}>Add</button>
        </div>
      </div>
    </div>
  );
}

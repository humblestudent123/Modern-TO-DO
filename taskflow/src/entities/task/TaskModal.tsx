import { useState } from "react";
import type { Task, SubTask } from "./task.types";
import styles from "./TaskModal.module.css";

type Props = {
  task: Task;
  isOpen: boolean;
  onClose: () => void;
  onAddSubTask?: (taskId: string, title: string) => void;
  onToggleSubTask?: (taskId: string, subTaskId: string) => void;
  onDeleteSubTask?: (taskId: string, subTaskId: string) => void;
  onReorderSubTasks?: (taskId: string, newSubTasks: SubTask[]) => void;
};

export default function TaskModal({
  task,
  isOpen,
  onClose,
  onAddSubTask,
  onToggleSubTask,
  onDeleteSubTask,
  onReorderSubTasks,
}: Props) {
  const [newSubTaskTitle, setNewSubTaskTitle] = useState("");
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  if (!isOpen) return null;

  const handleAddSubTask = () => {
    const trimmed = newSubTaskTitle.trim();
    if (!trimmed) return;
    onAddSubTask?.(task.id, trimmed);
    setNewSubTaskTitle("");
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleAddSubTask();
    } else if (e.key === "Escape") {
      onClose();
    }
  };

  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === index) return;

    const subTasks = [...(task.subTasks || [])];
    const draggedItem = subTasks[draggedIndex];
    
    // Удаляем элемент из старой позиции
    subTasks.splice(draggedIndex, 1);
    // Вставляем на новую позицию
    subTasks.splice(index, 0, draggedItem);
    
    onReorderSubTasks?.(task.id, subTasks);
    setDraggedIndex(index);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
  };

  const completedCount = task.subTasks?.filter(sub => sub.isDone).length || 0;
  const totalCount = task.subTasks?.length || 0;

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <div className={styles.titleSection}>
            <h2 className={styles.title}>{task.title}</h2>
            {totalCount > 0 && (
              <span className={styles.progress}>
                {completedCount}/{totalCount} завершено
              </span>
            )}
          </div>
          <button 
            className={styles.close} 
            onClick={onClose}
            aria-label="Close modal"
          >
            ✕
          </button>
        </div>

        {totalCount > 0 && (
          <div className={styles.progressBar}>
            <div 
              className={styles.progressFill}
              style={{ width: `${(completedCount / totalCount) * 100}%` }}
            />
          </div>
        )}

        <div className={styles.subTasks}>
          {task.subTasks && task.subTasks.length > 0 ? (
            task.subTasks.map((sub: SubTask, index: number) => (
              <div
                key={sub.id}
                className={`${styles.subTaskItem} ${draggedIndex === index ? styles.dragging : ""}`}
                draggable
                onDragStart={() => handleDragStart(index)}
                onDragOver={(e) => handleDragOver(e, index)}
                onDragEnd={handleDragEnd}
              >
                <div className={styles.dragHandle}>⋮⋮</div>
                
                <button
                  className={`${styles.checkbox} ${sub.isDone ? styles.done : ""}`}
                  onClick={() => onToggleSubTask?.(task.id, sub.id)}
                  aria-label={sub.isDone ? "Mark as incomplete" : "Mark as complete"}
                >
                  {sub.isDone && <span className={styles.checkmark}>✓</span>}
                </button>

                <span className={`${styles.subTaskTitle} ${sub.isDone ? styles.doneText : ""}`}>
                  {sub.title}
                </span>

                <button
                  className={styles.deleteButton}
                  onClick={() => onDeleteSubTask?.(task.id, sub.id)}
                  aria-label="Delete subtask"
                >
                  🗑️
                </button>
              </div>
            ))
          ) : (
            <div className={styles.emptyState}>
              <p>Сейчас пока нету задач, давайте добавим!</p>
            </div>
          )}
        </div>

        <div className={styles.addSubTask}>
          <input
            type="text"
            className={styles.input}
            placeholder="Add a new subtask..."
            value={newSubTaskTitle}
            onChange={(e) => setNewSubTaskTitle(e.target.value)}
            onKeyDown={handleKeyPress}
            autoFocus
          />
          <button 
            className={styles.addButton} 
            onClick={handleAddSubTask}
            disabled={!newSubTaskTitle.trim()}
          >
            Добавить
          </button>
        </div>
      </div>
    </div>
  );
}
import { useState } from "react";
import type { Task, SubTask } from "./task.types";
import TaskModal from "./TaskModal";
import styles from "./TaskCard.module.css";

type Props = {
  task: Task;
  columnId: string;
  onDelete?: (id: string) => void;
  onChangePriority?: (id: string, priority: Task["priority"]) => void;
  onAddSubTask?: (taskId: string, title: string) => void;
  onToggleSubTask?: (taskId: string, subTaskId: string) => void;
  onDeleteSubTask?: (taskId: string, subTaskId: string) => void;
  onReorderSubTasks?: (taskId: string, newSubTasks: SubTask[]) => void;
  draggable?: boolean;
  onDragStart?: (e: React.DragEvent) => void;
};

export default function TaskCard({
  task,
  columnId,
  onDelete,
  onChangePriority,
  onAddSubTask,
  onToggleSubTask,
  onDeleteSubTask,
  onReorderSubTasks,
  draggable = true,
  onDragStart,
}: Props) {
  const [modalOpen, setModalOpen] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const priorityColors = {
    high: "#ef4444",
    normal: "#f59e0b",
    low: "#10b981",
  };

  const completedCount = task.subTasks?.filter(sub => sub.isDone).length || 0;
  const totalCount = task.subTasks?.length || 0;

  const handleDragStart = (e: React.DragEvent) => {
    setIsDragging(true);
    onDragStart?.(e);
  };

  const handleDragEnd = () => {
    setIsDragging(false);
  };

  const handleClick = () => {
    if (!isDragging) {
      setModalOpen(true);
    }
  };

  return (
    <>
      <div
        className={`${styles.card} ${isDragging ? styles.dragging : ""}`}
        style={{ borderLeftColor: priorityColors[task.priority], borderLeftWidth: '4px' }}
        draggable={draggable}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        onClick={handleClick}
      >
        <div className={styles.cardHeader}>
          <h4 className={styles.title}>{task.title}</h4>
          <button 
            className={styles.deleteButton}
            onClick={(e) => {
              e.stopPropagation();
              onDelete?.(task.id);
            }}
            aria-label="Delete task"
          >
            ✕
          </button>
        </div>

        {totalCount > 0 && (
          <div className={styles.subtaskInfo}>
            <div className={styles.subtaskCount}>
              <span className={styles.checkIcon}>✓</span>
              <span className={styles.countText}>
                {completedCount}/{totalCount}
              </span>
            </div>
            <div className={styles.progressBar}>
              <div
                className={styles.progressFill}
                style={{ 
                  width: `${totalCount > 0 ? (completedCount / totalCount) * 100 : 0}%`,
                  backgroundColor: priorityColors[task.priority]
                }}
              />
            </div>
          </div>
        )}

        <div className={styles.footer}>
          <select
            className={styles.prioritySelect}
            value={task.priority}
            onChange={(e) => {
              e.stopPropagation();
              onChangePriority?.(task.id, e.target.value as Task["priority"]);
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <option value="high">🔴 High</option>
            <option value="normal">🟡 Normal</option>
            <option value="low">🟢 Low</option>
          </select>

          <span 
            className={styles.priorityBadge}
            style={{ backgroundColor: priorityColors[task.priority] }}
          >
            {task.priority}
          </span>
        </div>
      </div>

      <TaskModal
        task={task}
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onAddSubTask={onAddSubTask}
        onToggleSubTask={onToggleSubTask}
        onDeleteSubTask={onDeleteSubTask}
        onReorderSubTasks={onReorderSubTasks}
      />
    </>
  );
}
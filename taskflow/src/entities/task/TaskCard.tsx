import { useState } from "react";
import type { Task, SubTask } from "./task.types";
import styles from "./TaskCard.module.css";
import TaskModal from "./TaskModal.jsx";

type Props = {
  task: Task & { subTasks?: SubTask[] };
  onTogglePinned?: (id: string) => void;
  onToggleImportant?: (id: string) => void;
  onDelete?: (id: string) => void;
  onAddSubTask?: (taskId: string, title: string) => void;
  onToggleSubTask?: (taskId: string, subTaskId: string) => void;
  onDeleteSubTask?: (taskId: string, subTaskId: string) => void;
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
  onDeleteSubTask,
  draggable,
  onDragStart,
}: Props) {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <>
      <div
        className={`${styles.card} ${task.isPinned ? styles.pinned : ""} ${
          task.isImportant ? styles.important : ""
        } ${task.columnId === "done" ? styles.done : ""}`}
        draggable={draggable && !task.isPinned}
        onDragStart={task.isPinned ? undefined : onDragStart}
        onClick={() => setModalOpen(true)}
      >
        <div className={styles.cardHeader}>
          <p className={styles.title}>{task.title}</p>
          <div className={styles.buttons}>
            <button onClick={(e) => { e.stopPropagation(); onTogglePinned?.(task.id); }}>📌</button>
            <button onClick={(e) => { e.stopPropagation(); onToggleImportant?.(task.id); }}>⭐</button>
            <button onClick={(e) => { e.stopPropagation(); onDelete?.(task.id); }}>❌</button>
          </div>
        </div>
      </div>

      {/* Модальное окно */}
      <TaskModal
        task={task}
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onAddSubTask={onAddSubTask}
        onToggleSubTask={onToggleSubTask}
        onDeleteSubTask={onDeleteSubTask}
      />
    </>
  );
}

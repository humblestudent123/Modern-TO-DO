import { useState } from "react";
import type { Task } from "./task.types";
import TaskModal from "./TaskModal";
import styles from "./TaskCard.module.css";

type Props = {
  task: Task;
  onTogglePinned?: (id: string) => void;
  onToggleImportant?: (id: string) => void;
  onDelete?: (id: string) => void;
  onAddSubTask?: (taskId: string, title: string) => void;
  onToggleSubTask?: (taskId: string, subTaskId: string) => void;
  onDeleteSubTask?: (taskId: string, subTaskId: string) => void;
};

export default function TaskCard({
  task,
  onTogglePinned,
  onToggleImportant,
  onDelete,
  onAddSubTask,
  onToggleSubTask,
  onDeleteSubTask,
}: Props) {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <>
      <div
        className={`${styles.card} ${task.isPinned ? styles.pinned : ""} ${task.isImportant ? styles.important : ""}`}
        onClick={() => setModalOpen(true)}
      >
        <div className={styles.cardHeader}>
          <p className={styles.title}>{task.title}</p>
          <div className={styles.buttons}>
            <button onClick={e => { e.stopPropagation(); onTogglePinned?.(task.id); }}>📌</button>
            <button onClick={e => { e.stopPropagation(); onToggleImportant?.(task.id); }}>⭐</button>
            <button onClick={e => { e.stopPropagation(); onDelete?.(task.id); }}>❌</button>
          </div>
        </div>
      </div>

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
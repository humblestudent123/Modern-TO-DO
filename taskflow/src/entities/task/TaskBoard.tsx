import { useState } from "react";
import { nanoid } from "nanoid";
import TaskCard from "./TaskCard";
import type { Task } from "./task.types";

export default function TaskBoard() {
  const [tasks, setTasks] = useState<Task[]>([
    { id: nanoid(), title: "First Task", columnId: "todo", priority: "normal", isPinned: false, isImportant: false, subTasks: [] },
    { id: nanoid(), title: "Second Task", columnId: "todo", priority: "normal", isPinned: false, isImportant: true, subTasks: [] },
    { id: nanoid(), title: "In Progress Task", columnId: "inProgress", priority: "high", isPinned: false, isImportant: false, subTasks: [] },
    { id: nanoid(), title: "Done Task", columnId: "done", priority: "low", isPinned: false, isImportant: false, subTasks: [] },
  ]);

  const [draggedTaskId, setDraggedTaskId] = useState<string | null>(null);

  // ========== Основные обработчики задач ==========
  const handleDeleteTask = (taskId: string) => {
    setTasks(prev => prev.filter(task => task.id !== taskId));
  };

  const handleTogglePinned = (taskId: string) => {
    setTasks(prev => prev.map(task => task.id === taskId ? { ...task, isPinned: !task.isPinned } : task));
  };

  const handleToggleImportant = (taskId: string) => {
    setTasks(prev => prev.map(task => task.id === taskId ? { ...task, isImportant: !task.isImportant } : task));
  };

  const handleChangePriority = (taskId: string, priority: Task["priority"]) => {
    setTasks(prev => prev.map(task => task.id === taskId ? { ...task, priority } : task));
  };

  const handleAddSubTask = (taskId: string, title: string) => {
    setTasks(prev =>
      prev.map(task =>
        task.id === taskId
          ? { ...task, subTasks: [...task.subTasks, { id: nanoid(), title, isDone: false }] }
          : task
      )
    );
  };

  const handleToggleSubTask = (taskId: string, subTaskId: string) => {
    setTasks(prev =>
      prev.map(task =>
        task.id === taskId
          ? { ...task, subTasks: task.subTasks.map(sub => sub.id === subTaskId ? { ...sub, isDone: !sub.isDone } : sub) }
          : task
      )
    );
  };

  const handleDeleteSubTask = (taskId: string, subTaskId: string) => {
    setTasks(prev =>
      prev.map(task =>
        task.id === taskId
          ? { ...task, subTasks: task.subTasks.filter(sub => sub.id !== subTaskId) }
          : task
      )
    );
  };

  const handleReorderSubTasks = (taskId: string, newSubTasks: Task["subTasks"]) => {
    setTasks(prev =>
      prev.map(task => task.id === taskId ? { ...task, subTasks: newSubTasks } : task)
    );
  };

  // ========== Drag & Drop ==========
  const handleDragStart = (taskId: string) => {
    setDraggedTaskId(taskId);
  };

  const handleDropOnColumn = (columnId: string) => {
    if (!draggedTaskId) return;
    setTasks(prev =>
      prev.map(task =>
        task.id === draggedTaskId ? { ...task, columnId } : task
      )
    );
    setDraggedTaskId(null);
  };

  const handleDropOnTask = (targetId: string) => {
    if (!draggedTaskId || draggedTaskId === targetId) return;

    setTasks(prev => {
      const draggedTask = prev.find(task => task.id === draggedTaskId);
      const targetTask = prev.find(task => task.id === targetId);
      if (!draggedTask || !targetTask) return prev;

      // Перемещаем задачу в массиве
      const filtered = prev.filter(task => task.id !== draggedTaskId);
      const targetIndex = filtered.findIndex(task => task.id === targetId);
      filtered.splice(targetIndex, 0, { ...draggedTask, columnId: targetTask.columnId });
      return filtered;
    });

    setDraggedTaskId(null);
  };

  const columns = [
    { id: "todo", title: "Todo" },
    { id: "inProgress", title: "In Progress" },
    { id: "done", title: "Done" },
  ];

  return (
    <div style={{ display: "flex", gap: 16, padding: 20 }}>
      {columns.map(col => (
        <div
          key={col.id}
          style={{
            flex: 1,
            minHeight: 300,
            background: "#f0f0f0",
            padding: 12,
            borderRadius: 8
          }}
          onDragOver={e => e.preventDefault()}
          onDrop={() => handleDropOnColumn(col.id)}
        >
          <h3>{col.title}</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {tasks
              .filter(task => task.columnId === col.id)
              .map(task => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onDelete={handleDeleteTask}
                  onChangePriority={handleChangePriority}
                  onAddSubTask={handleAddSubTask}
                  onToggleSubTask={handleToggleSubTask}
                  onDeleteSubTask={handleDeleteSubTask}
                  onReorderSubTasks={handleReorderSubTasks}
                  onTogglePinned={handleTogglePinned}
                  onToggleImportant={handleToggleImportant}
                  onDragStart={handleDragStart}
                  onDropOnTask={handleDropOnTask}
                />
              ))}
          </div>
        </div>
      ))}
    </div>
  );
}
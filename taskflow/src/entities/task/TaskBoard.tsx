import { useState } from "react";
import { nanoid } from "nanoid";
import TaskCard from "./TaskCard";
import type { Task, SubTask } from "./task.types";

export default function TaskBoard() {
  const [tasks, setTasks] = useState<Task[]>([
    { id: "1", title: "First Task", columnId: "todo", isPinned: false, isImportant: false, subTasks: [] },
    { id: "2", title: "Second Task", columnId: "todo", isPinned: false, isImportant: true, subTasks: [] },
  ]);

  // Добавление подзадачи
  const handleAddSubTask = (taskId: string, title: string) => {
    setTasks(prev =>
      prev.map(task =>
        task.id === taskId
          ? {
              ...task,
              subTasks: [...(task.subTasks || []), { id: nanoid(), title, isDone: false }]
            }
          : task
      )
    );
  };

  // Отметка подзадачи
  const handleToggleSubTask = (taskId: string, subTaskId: string) => {
    setTasks(prev =>
      prev.map(task =>
        task.id === taskId
          ? {
              ...task,
              subTasks: task.subTasks?.map(sub =>
                sub.id === subTaskId ? { ...sub, isDone: !sub.isDone } : sub
              )
            }
          : task
      )
    );
  };

  // Удаление подзадачи
  const handleDeleteSubTask = (taskId: string, subTaskId: string) => {
    setTasks(prev =>
      prev.map(task =>
        task.id === taskId
          ? {
              ...task,
              subTasks: task.subTasks?.filter(sub => sub.id !== subTaskId)
            }
          : task
      )
    );
  };

  // Удаление задачи
  const handleDeleteTask = (taskId: string) => {
    setTasks(prev => prev.filter(task => task.id !== taskId));
  };

  // Закрепление / важная
  const handleTogglePinned = (taskId: string) => {
    setTasks(prev =>
      prev.map(task =>
        task.id === taskId ? { ...task, isPinned: !task.isPinned } : task
      )
    );
  };

  const handleToggleImportant = (taskId: string) => {
    setTasks(prev =>
      prev.map(task =>
        task.id === taskId ? { ...task, isImportant: !task.isImportant } : task
      )
    );
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12, padding: 20 }}>
      {tasks.map(task => (
        <TaskCard
          key={task.id}
          task={task}
          onAddSubTask={handleAddSubTask}
          onToggleSubTask={handleToggleSubTask}
          onDeleteSubTask={handleDeleteSubTask}
          onDelete={handleDeleteTask}
          onTogglePinned={handleTogglePinned}
          onToggleImportant={handleToggleImportant}
        />
      ))}
    </div>
  );
}

import { useState } from "react";
import { nanoid } from "nanoid";
import TaskCard from "./TaskCard";
import type { Task } from "./task.types";

export default function TaskBoard() {
  const [tasks, setTasks] = useState<Task[]>([
    { id: nanoid(), title: "First Task", columnId: "todo", priority: "normal", isPinned: false, isImportant: false, subTasks: [] },
    { id: nanoid(), title: "Second Task", columnId: "todo", priority: "normal", isPinned: false, isImportant: true, subTasks: [] },
  ]);

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

  const handleDeleteSubTask = (taskId: string, subTaskId: string) => {
    setTasks(prev =>
      prev.map(task =>
        task.id === taskId
          ? { ...task, subTasks: task.subTasks?.filter(sub => sub.id !== subTaskId) }
          : task
      )
    );
  };

  const handleDeleteTask = (taskId: string) => {
    setTasks(prev => prev.filter(task => task.id !== taskId));
  };

  const handleTogglePinned = (taskId: string) => {
    setTasks(prev =>
      prev.map(task => (task.id === taskId ? { ...task, isPinned: !task.isPinned } : task))
    );
  };

  const handleToggleImportant = (taskId: string) => {
    setTasks(prev =>
      prev.map(task => (task.id === taskId ? { ...task, isImportant: !task.isImportant } : task))
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
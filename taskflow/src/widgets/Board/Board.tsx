import { useState, useEffect } from "react";
import Column from "./Column/Column";
import styles from "./Board.module.css";
import type { Task } from "../../entities/task/task.types";

export default function Board() {
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [tasks, setTasks] = useState<Task[]>([
    { id: "1", title: "Buy groceries", columnId: "todo", priority: "normal", isPinned: false, isImportant: true },
    { id: "2", title: "Clean room", columnId: "todo", priority: "low", isPinned: false, isImportant: false },
    { id: "3", title: "Finish project", columnId: "inProgress", priority: "high", isPinned: true, isImportant: true },
    { id: "4", title: "Read book", columnId: "inProgress", priority: "normal", isPinned: false, isImportant: false },
    { id: "5", title: "Workout", columnId: "done", priority: "normal", isPinned: false, isImportant: false },
    { id: "6", title: "Call friend", columnId: "done", priority: "low", isPinned: false, isImportant: false },
  ]);

  useEffect(() => {
    document.body.dataset.theme = theme;
  }, [theme]);

  const toggleTheme = () => setTheme(prev => (prev === "dark" ? "light" : "dark"));

  const addTask = (title: string, columnId: string) => {
    const newTask: Task = {
      id: Date.now().toString(),
      title,
      columnId,
      priority: "normal",
      isPinned: false,
      isImportant: false,
    };
    setTasks(prev => [...prev, newTask]);
  };

  const togglePinned = (id: string) => {
    setTasks(prev => prev.map(task => task.id === id ? { ...task, isPinned: !task.isPinned } : task));
  };

  const toggleImportant = (id: string) => {
    setTasks(prev => prev.map(task => task.id === id ? { ...task, isImportant: !task.isImportant } : task));
  };

  return (
    <div>
      <div style={{ display: "flex", gap: 12, marginBottom: 12 }}>
        <input id="newTaskInput" placeholder="New task" />
        <button onClick={() => {
          const input = document.getElementById("newTaskInput") as HTMLInputElement;
          if (input.value) {
            addTask(input.value, "todo");
            input.value = "";
          }
        }}>Add Task</button>

        <button onClick={toggleTheme}>Toggle Theme</button>
      </div>

      <section className={styles.board}>
        <Column title="Todo" columnId="todo" tasks={tasks} onTogglePinned={togglePinned} onToggleImportant={toggleImportant} />
        <Column title="In Progress" columnId="inProgress" tasks={tasks} onTogglePinned={togglePinned} onToggleImportant={toggleImportant} />
        <Column title="Done" columnId="done" tasks={tasks} onTogglePinned={togglePinned} onToggleImportant={toggleImportant} />
      </section>
    </div>
  );
}

import { useState, useEffect } from "react";
import Column from "./Column/Column";
import styles from "./Board.module.css";
import type { Task } from "../../entities/task/task.types";

export default function Board() {
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [tasks, setTasks] = useState<Task[]>([]);

  // Загрузка задач из localStorage при старте
  useEffect(() => {
    const savedTasks = localStorage.getItem("tasks");
    if (savedTasks) {
      setTasks(JSON.parse(savedTasks));
    } else {
      // Если нет в localStorage, создаем дефолтные задачи
      setTasks([
        { id: "1", title: "Buy groceries", columnId: "todo", priority: "normal", isPinned: false, isImportant: true },
        { id: "2", title: "Clean room", columnId: "todo", priority: "low", isPinned: false, isImportant: false },
        { id: "3", title: "Finish project", columnId: "inProgress", priority: "high", isPinned: true, isImportant: true },
        { id: "4", title: "Read book", columnId: "inProgress", priority: "normal", isPinned: false, isImportant: false },
        { id: "5", title: "Workout", columnId: "done", priority: "normal", isPinned: false, isImportant: false },
        { id: "6", title: "Call friend", columnId: "done", priority: "low", isPinned: false, isImportant: false },
      ]);
    }
  }, []);

  // Сохраняем задачи в localStorage при каждом изменении
  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    document.body.dataset.theme = theme;
  }, [theme]);

  const toggleTheme = () => setTheme(prev => (prev === "dark" ? "light" : "dark"));

  const addTask = (title: string, columnId: string, priority: Task["priority"], isPinned: boolean, isImportant: boolean) => {
    const newTask: Task = {
      id: Date.now().toString(),
      title,
      columnId,
      priority,
      isPinned,
      isImportant,
    };
    setTasks(prev => [...prev, newTask]);
  };

  const deleteTask = (id: string) => setTasks(prev => prev.filter(task => task.id !== id));

  const moveTask = (taskId: string, toColumnId: string) => {
    setTasks(prev => prev.map(task => task.id === taskId ? { ...task, columnId: toColumnId } : task));
  };

  const togglePinned = (id: string) => setTasks(prev => prev.map(task => task.id === id ? { ...task, isPinned: !task.isPinned } : task));
  const toggleImportant = (id: string) => setTasks(prev => prev.map(task => task.id === id ? { ...task, isImportant: !task.isImportant } : task));
  const changePriority = (id: string, priority: Task["priority"]) => setTasks(prev => prev.map(task => task.id === id ? { ...task, priority } : task));

  return (
    <div>
      <div style={{ display: "flex", gap: 12, marginBottom: 12, alignItems: "center" }}>
        <input id="newTaskInput" placeholder="New task" />
        <select id="prioritySelect">
          <option value="low">Low</option>
          <option value="normal">Normal</option>
          <option value="high">High</option>
        </select>
        <label>
          <input type="checkbox" id="pinnedCheckbox" /> Pinned
        </label>
        <label>
          <input type="checkbox" id="importantCheckbox" /> Important
        </label>
        <button onClick={() => {
          const input = document.getElementById("newTaskInput") as HTMLInputElement;
          const priority = (document.getElementById("prioritySelect") as HTMLSelectElement).value as Task["priority"];
          const isPinned = (document.getElementById("pinnedCheckbox") as HTMLInputElement).checked;
          const isImportant = (document.getElementById("importantCheckbox") as HTMLInputElement).checked;

          if (input.value) {
            addTask(input.value, "todo", priority, isPinned, isImportant);
            input.value = "";
          }
        }}>Add Task</button>

        <button onClick={toggleTheme}>Toggle Theme</button>
      </div>

      <section className={styles.board}>
        <Column
          title="Todo"
          columnId="todo"
          tasks={tasks}
          onTogglePinned={togglePinned}
          onToggleImportant={toggleImportant}
          onDelete={deleteTask}
          onMoveTask={moveTask}
          onChangePriority={changePriority}
        />
        <Column
          title="In Progress"
          columnId="inProgress"
          tasks={tasks}
          onTogglePinned={togglePinned}
          onToggleImportant={toggleImportant}
          onDelete={deleteTask}
          onMoveTask={moveTask}
          onChangePriority={changePriority}
        />
        <Column
          title="Done"
          columnId="done"
          tasks={tasks}
          onTogglePinned={togglePinned}
          onToggleImportant={toggleImportant}
          onDelete={deleteTask}
          onMoveTask={moveTask}
          onChangePriority={changePriority}
        />
      </section>
    </div>
  );
}


import { useState, useEffect } from "react";
import Column from "./Column/Column";
import styles from "./Board.module.css";
import type { Task, SubTask } from "../../entities/task/task.types";

const STORAGE_KEY = "tasks";

const DEFAULT_TASKS: Task[] = [
  { id: "1", title: "Buy groceries", columnId: "todo", priority: "средний", subTasks: [] },
  { id: "2", title: "Clean room", columnId: "todo", priority: "low", subTasks: [] },
  { id: "3", title: "Finish project", columnId: "inProgress", priority: "high", subTasks: [] },
  { id: "4", title: "Read book", columnId: "inProgress", priority: "normal", subTasks: [] },
  { id: "5", title: "Workout", columnId: "done", priority: "normal", subTasks: [] },
  { id: "6", title: "Call friend", columnId: "done", priority: "low", subTasks: [] },
];

const COLUMNS = [
  { id: "todo", title: "Задачи" },
  { id: "inProgress", title: "В процессе" },
  { id: "done", title: "Сделано" },
] as const;

export default function Board() {
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTaskTitle, setNewTaskTitle] = useState("");

  useEffect(() => {
    try {
      const savedTasks = localStorage.getItem(STORAGE_KEY);
      if (savedTasks) {
        const parsedTasks = JSON.parse(savedTasks);
        setTasks(parsedTasks);
      } else {
        setTasks(DEFAULT_TASKS);
      }
    } catch (error) {
      console.error("Failed to load tasks from localStorage:", error);
      setTasks(DEFAULT_TASKS);
    }
  }, []);

  useEffect(() => {
    if (tasks.length > 0) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
      } catch (error) {
        console.error("Failed to save tasks to localStorage:", error);
      }
    }
  }, [tasks]);

  useEffect(() => {
    document.body.dataset.theme = theme;
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === "dark" ? "light" : "dark"));
  };

  const handleAddTask = () => {
    const trimmedTitle = newTaskTitle.trim();
    if (!trimmedTitle) return;

    const newTask: Task = {
      id: Date.now().toString(),
      title: trimmedTitle,
      columnId: "todo",
      priority: "normal",
      subTasks: [],
    };

    setTasks(prev => [...prev, newTask]);
    setNewTaskTitle("");
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleAddTask();
    }
  };

  const addSubTask = (taskId: string, title: string) => {
    const trimmedTitle = title.trim();
    if (!trimmedTitle) return;

    setTasks(prev =>
      prev.map(task =>
        task.id === taskId
          ? {
              ...task,
              subTasks: [
                ...(task.subTasks || []),
                { 
                  id: Date.now().toString(), 
                  title: trimmedTitle, 
                  isDone: false 
                }
              ]
            }
          : task
      )
    );
  };

  const reorderSubTasks = (taskId: string, newSubTasks: SubTask[]) => {
    setTasks(prev =>
      prev.map(task =>
        task.id === taskId ? { ...task, subTasks: newSubTasks } : task
      )
    );
  };

  const toggleSubTask = (taskId: string, subTaskId: string) => {
    setTasks(prev =>
      prev.map(task =>
        task.id === taskId
          ? {
              ...task,
              subTasks: task.subTasks?.map(sub =>
                sub.id === subTaskId ? { ...sub, isDone: !sub.isDone } : sub
              ),
            }
          : task
      )
    );
  };

  const deleteSubTask = (taskId: string, subTaskId: string) => {
    setTasks(prev =>
      prev.map(task =>
        task.id === taskId
          ? { ...task, subTasks: task.subTasks?.filter(st => st.id !== subTaskId) || [] }
          : task
      )
    );
  };

  const deleteTask = (id: string) => {
    setTasks(prev => prev.filter(task => task.id !== id));
  };

  const moveTask = (taskId: string, toColumnId: string) => {
    setTasks(prev =>
      prev.map(task =>
        task.id === taskId ? { ...task, columnId: toColumnId } : task
      )
    );
  };

  const changePriority = (id: string, priority: Task["priority"]) => {
    setTasks(prev =>
      prev.map(task =>
        task.id === id ? { ...task, priority } : task
      )
    );
  };

  return (
    <div className={styles.container}>
      <button className={styles.themeToggle} onClick={toggleTheme}>
        {theme === "dark" ? "🌞" : "🌙"}
      </button>

      <div className={styles.toolbar}>
        <div className={styles.inputWrapper}>
          <input
            type="text"
            className={styles.input}
            placeholder="Добавить новую задачу..."
            value={newTaskTitle}
            onChange={(e) => setNewTaskTitle(e.target.value)}
            onKeyPress={handleKeyPress}
          />
          <button 
            className={styles.addButton} 
            onClick={handleAddTask}
            disabled={!newTaskTitle.trim()}
          >
            +
          </button>
        </div>
      </div>

      <section className={styles.board}>
        {COLUMNS.map(column => (
          <Column
            key={column.id}
            title={column.title}
            columnId={column.id}
            tasks={tasks}
            onDelete={deleteTask}
            onMoveTask={moveTask}
            onChangePriority={changePriority}
            onAddSubTask={addSubTask}
            onToggleSubTask={toggleSubTask}
            onDeleteSubTask={deleteSubTask}
            onReorderSubTasks={reorderSubTasks}
          />
        ))}
      </section>
    </div>
  );
}
import Column from "./Column/Column";
import styles from "./Board.module.css";
import type { Task } from "../../entities/task/task.types";

const tasks: Task[] = [
  { id: "1", title: "Buy groceries", columnId: "todo", priority: "normal", isPinned: false, isImportant: true },
  { id: "2", title: "Clean room", columnId: "todo", priority: "low", isPinned: false, isImportant: false },
  { id: "3", title: "Finish project", columnId: "inProgress", priority: "high", isPinned: true, isImportant: true },
  { id: "4", title: "Read book", columnId: "inProgress", priority: "normal", isPinned: false, isImportant: false },
  { id: "5", title: "Workout", columnId: "done", priority: "normal", isPinned: false, isImportant: false },
  { id: "6", title: "Call friend", columnId: "done", priority: "low", isPinned: false, isImportant: false },
];

export default function Board() {
  return (
    <section className={styles.board}>
      <Column title="Todo" columnId="todo" tasks={tasks} />
      <Column title="In Progress" columnId="inProgress" tasks={tasks} />
      <Column title="Done" columnId="done" tasks={tasks} />
    </section>
  );
}

import TaskCard from "../../../entities/task/TaskCard";
import styles from "./Column.module.css";
import type { Task } from "../../../entities/task/task.types";

type Props = {
  title: string;
  columnId: string;
  tasks: Task[]; // массив задач
};

export default function Column({ title, columnId, tasks }: Props) {
  const filteredTasks = tasks?.filter(task => task.columnId === columnId) || [];

  return (
    <div className={styles.column}>
      <h3 className={styles.title}>{title}</h3>
      <div className={styles.tasks}>
        {filteredTasks.map(task => (
          <TaskCard key={task.id} task={task} />
        ))}
      </div>
    </div>
  );
}

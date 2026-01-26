import TaskCard from "../../../entities/task/TaskCard";
import styles from "./Column.module.css";

type Props = {
  title: string;
};

export default function Column({ title }: Props) {
  return (
    <div className={styles.column}>
      <h3 className={styles.title}>{title}</h3>

      <div className={styles.tasks}>
        <TaskCard />
        <TaskCard />
      </div>
    </div>
  );
}

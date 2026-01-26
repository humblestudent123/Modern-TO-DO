import styles from "./TaskCard.module.css";

export default function TaskCard() {
  return (
    <div className={styles.card}>
      <p className={styles.title}>Task title</p>
    </div>
  );
}
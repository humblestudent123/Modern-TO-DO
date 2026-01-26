import Column from "./Column/Column";
import styles from "./Board.module.css";

export default function Board() {
  return (
    <section className={styles.board}>
      <Column title="Todo" />
      <Column title="In Progress" />
      <Column title="Done" />
    </section>
  );
}

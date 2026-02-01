  import TaskCard from "../../../entities/task/TaskCard";
  import styles from "./Column.module.css";
  import type { Task, SubTask } from "../../../entities/task/task.types";

  type Props = {
    title: string;
    columnId: string;
    tasks: Task[];
    onDelete: (id: string) => void;
    onMoveTask: (taskId: string, toColumnId: string) => void;
    onChangePriority?: (id: string, priority: Task["priority"]) => void;
    onAddSubTask?: (taskId: string, title: string) => void; 
    onToggleSubTask?: (taskId: string, subTaskId: string) => void;
    onDeleteSubTask?: (taskId: string, subTaskId: string) => void;
    onReorderSubTasks?: (taskId: string, newSubTasks: SubTask[]) => void;
  };

  export default function Column({
    title,
    columnId,
    tasks,
    onDelete,
    onMoveTask,
    onChangePriority,
    onAddSubTask,
    onToggleSubTask,
    onDeleteSubTask,
    onReorderSubTasks,
  }: Props) {

    // Фильтруем задачи по колонке и сортируем по приоритету
    const filteredTasks = tasks
      .filter(task => task.columnId === columnId)
      .sort((a, b) => {
        // Сортировка по приоритету: high → normal → low
        const priorityOrder = { high: 3, normal: 2, low: 1 };
        return priorityOrder[b.priority] - priorityOrder[a.priority];
      });

    const handleDragOver = (e: React.DragEvent) => e.preventDefault();
    
    const handleDrop = (e: React.DragEvent) => {
      const taskId = e.dataTransfer.getData("text/plain");
      if (taskId) onMoveTask(taskId, columnId);
    };

    return (
      <div
        className={`
          ${styles.column} 
          ${columnId === "todo" ? styles.todoColumn :
            columnId === "inProgress" ? styles.inProgressColumn :
            columnId === "done" ? styles.doneColumn : ""}
        `}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        <h3 className={styles.title}>{title}</h3>
        <div className={styles.tasks}>
          {filteredTasks.map(task => (
            <TaskCard
              key={task.id}
              task={task}
              columnId={columnId}  // 🔹 берем columnId из пропсов Column
              onDelete={onDelete}
              onChangePriority={onChangePriority}
              onAddSubTask={onAddSubTask}
              onToggleSubTask={onToggleSubTask}
              onDeleteSubTask={onDeleteSubTask}
              onReorderSubTasks={onReorderSubTasks}
              draggable
              onDragStart={(e) => e.dataTransfer.setData("text/plain", task.id)}
              />
          ))}
        </div>
      </div>
    );
  }
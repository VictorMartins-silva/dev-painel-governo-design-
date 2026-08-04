import styles from "./FeedbackState.module.css";

type EmptyStateProps = {
  title?: string;
  message?: string;
};

export function EmptyState({
  title = "Sem dados",
  message = "Nenhum dado disponível para os filtros selecionados.",
}: EmptyStateProps) {
  return (
    <div className={`${styles.state} ${styles.empty}`} role="status">
      <span className={styles.title}>{title}</span>
      <span className={styles.message}>{message}</span>
    </div>
  );
}

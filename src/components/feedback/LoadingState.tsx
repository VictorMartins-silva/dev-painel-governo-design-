import styles from "./FeedbackState.module.css";

type LoadingStateProps = {
  label?: string;
};

export function LoadingState({ label = "Carregando dados…" }: LoadingStateProps) {
  return (
    <div className={`${styles.state} ${styles.loading}`} role="status" aria-live="polite">
      <div className={styles.spinner} aria-hidden="true" />
      <span className={styles.message}>{label}</span>
    </div>
  );
}

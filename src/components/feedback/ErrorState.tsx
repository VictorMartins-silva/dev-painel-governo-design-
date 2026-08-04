import type { ReactNode } from "react";
import styles from "./FeedbackState.module.css";

type ErrorStateProps = {
  title?: string;
  message?: string;
  children?: ReactNode;
};

export function ErrorState({
  title = "Erro ao carregar",
  message = "Não foi possível carregar os dados. Tente novamente mais tarde.",
  children,
}: ErrorStateProps) {
  return (
    <div className={`${styles.state} ${styles.error}`} role="alert">
      <span className={styles.title}>{title}</span>
      <span className={styles.message}>{message}</span>
      {children}
    </div>
  );
}

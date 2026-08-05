import type { ReactNode } from "react";
import styles from "./FormField.module.css";

type FormFieldProps = {
  label: string;
  htmlFor: string;
  error?: string;
  warning?: string;
  children: ReactNode;
};

export function FormField({ label, htmlFor, error, warning, children }: FormFieldProps) {
  return (
    <div className={styles.field}>
      <label htmlFor={htmlFor} className={styles.label}>
        {label}
      </label>
      {children}
      {error && (
        <p className={styles.error} role="alert">
          {error}
        </p>
      )}
      {!error && warning && (
        <p className={styles.warning} role="status">
          {warning}
        </p>
      )}
    </div>
  );
}

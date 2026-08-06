import { useState, type FocusEvent, type ReactNode } from "react";
import styles from "./FormField.module.css";
import { useForceShowErrors } from "./ValidationDisplayContext";

type FormFieldProps = {
  label: string;
  htmlFor: string;
  hint?: string;
  error?: string;
  warning?: string;
  children: ReactNode;
};

export function FormField({ label, htmlFor, hint, error, warning, children }: FormFieldProps) {
  const [touched, setTouched] = useState(false);
  const forceShowErrors = useForceShowErrors();
  const showError = Boolean(error) && (touched || forceShowErrors);

  function handleBlur(event: FocusEvent<HTMLDivElement>) {
    // só marca como "tocado" quando o foco sai do campo, não entre elementos internos dele
    if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
      setTouched(true);
    }
  }

  return (
    <div className={styles.field} onBlur={handleBlur}>
      <label htmlFor={htmlFor} className={styles.label}>
        {label}
      </label>
      {hint && <p className={styles.hint}>{hint}</p>}
      {children}
      {showError && (
        <p className={styles.error} role="alert">
          {error}
        </p>
      )}
      {!showError && warning && (
        <p className={styles.warning} role="status">
          {warning}
        </p>
      )}
    </div>
  );
}

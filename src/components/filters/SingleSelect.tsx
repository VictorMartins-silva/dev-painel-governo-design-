import type { FilterOption } from "../../domain/types";
import styles from "./FilterField.module.css";

type SingleSelectProps = {
  id: string;
  label: string;
  options: FilterOption[];
  value: string | undefined;
  onChange: (value: string | undefined) => void;
};

export function SingleSelect({ id, label, options, value, onChange }: SingleSelectProps) {
  return (
    <div className={styles.field}>
      <label className={styles.label} htmlFor={id}>
        {label}
      </label>
      <select
        id={id}
        className={styles.select}
        value={value ?? ""}
        onChange={(event) => onChange(event.target.value || undefined)}
      >
        <option value="">Todos</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}

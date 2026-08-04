import type { FilterOption } from "../../domain/types";
import styles from "./FilterField.module.css";

type MultiSelectProps = {
  id: string;
  label: string;
  options: FilterOption[];
  values: string[];
  onChange: (values: string[]) => void;
};

export function MultiSelect({ id, label, options, values, onChange }: MultiSelectProps) {
  function toggle(value: string) {
    onChange(values.includes(value) ? values.filter((v) => v !== value) : [...values, value]);
  }

  return (
    <fieldset className={styles.field}>
      <legend className={styles.label}>{label}</legend>
      <div className={styles.checkboxGroup}>
        {options.map((option) => (
          <label key={option.value} className={styles.checkboxLabel}>
            <input
              type="checkbox"
              name={id}
              value={option.value}
              checked={values.includes(option.value)}
              onChange={() => toggle(option.value)}
            />
            {option.label}
          </label>
        ))}
      </div>
    </fieldset>
  );
}

import styles from "./ActiveFilters.module.css";

export type ActiveFilterChip = {
  key: string;
  label: string;
  onRemove: () => void;
};

type ActiveFiltersProps = {
  chips: ActiveFilterChip[];
};

export function ActiveFilters({ chips }: ActiveFiltersProps) {
  if (chips.length === 0) return null;

  return (
    <ul className={styles.list} aria-label="Filtros ativos">
      {chips.map((chip) => (
        <li key={chip.key} className={styles.chip}>
          {chip.label}
          <button
            type="button"
            className={styles.remove}
            onClick={chip.onRemove}
            aria-label={`Remover filtro ${chip.label}`}
          >
            ×
          </button>
        </li>
      ))}
    </ul>
  );
}

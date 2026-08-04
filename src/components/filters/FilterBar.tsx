import type { FilterConfig } from "../../config/schemas/filters.schema";
import type { FilterOption } from "../../domain/types";
import { SingleSelect } from "./SingleSelect";
import { MultiSelect } from "./MultiSelect";
import { PeriodSelect } from "./PeriodSelect";
import { ActiveFilters, type ActiveFilterChip } from "./ActiveFilters";
import styles from "./FilterBar.module.css";

type FilterBarProps = {
  filters: FilterConfig[];
  values: Record<string, string[]>;
  optionsByFilterId: Record<string, FilterOption[]>;
  onChange: (filterId: string, values: string[]) => void;
  onClear: () => void;
};

function optionLabel(options: FilterOption[], value: string): string {
  return options.find((option) => option.value === value)?.label ?? value;
}

export function FilterBar({
  filters,
  values,
  optionsByFilterId,
  onChange,
  onClear,
}: FilterBarProps) {
  const chips: ActiveFilterChip[] = filters.flatMap((filter) => {
    const activeValues = values[filter.id] ?? [];
    const options = optionsByFilterId[filter.id] ?? [];
    return activeValues.map((value) => ({
      key: `${filter.id}:${value}`,
      label: `${filter.label}: ${optionLabel(options, value)}`,
      onRemove: () =>
        onChange(
          filter.id,
          activeValues.filter((v) => v !== value),
        ),
    }));
  });

  return (
    <div className={styles.bar}>
      <div className={styles.fields}>
        {filters.map((filter) => {
          const options = optionsByFilterId[filter.id] ?? [];
          const activeValues = values[filter.id] ?? [];

          if (filter.type === "multi-select") {
            return (
              <MultiSelect
                key={filter.id}
                id={filter.id}
                label={filter.label}
                options={options}
                values={activeValues}
                onChange={(next) => onChange(filter.id, next)}
              />
            );
          }

          const Component = filter.type === "period" ? PeriodSelect : SingleSelect;
          return (
            <Component
              key={filter.id}
              id={filter.id}
              label={filter.label}
              options={options}
              value={activeValues[0]}
              onChange={(next) => onChange(filter.id, next ? [next] : [])}
            />
          );
        })}
        {chips.length > 0 && (
          <button type="button" className={styles.clearButton} onClick={onClear}>
            Limpar filtros
          </button>
        )}
      </div>
      {chips.length > 0 && (
        <div className={styles.footer}>
          <ActiveFilters chips={chips} />
        </div>
      )}
    </div>
  );
}

import type { Dispatch } from "react";
import type { FilterConfig, FilterType } from "../../config/schemas/filters.schema";
import type { EditorAction } from "./editorReducer";
import { FormField } from "./FormField";
import styles from "./FiltersForm.module.css";

const FILTER_TYPE_LABEL: Record<FilterType, string> = {
  "single-select": "Seleção única",
  "multi-select": "Seleção múltipla",
  period: "Período",
};

const FILTER_TYPES = Object.keys(FILTER_TYPE_LABEL) as FilterType[];

type FiltersFormProps = {
  filters: FilterConfig[];
  errors: Map<string, string>;
  dispatch: Dispatch<EditorAction>;
};

export function FiltersForm({ filters, errors, dispatch }: FiltersFormProps) {
  return (
    <details open className={styles.block}>
      <summary className={styles.summary}>Filtros</summary>

      {filters.length === 0 && <p className={styles.empty}>Nenhum filtro configurado.</p>}

      <ul className={styles.list}>
        {filters.map((filter, index) => (
          <li key={filter.id} className={styles.row}>
            <FormField label="Tipo" htmlFor={`filter-type-${filter.id}`}>
              <select
                id={`filter-type-${filter.id}`}
                className={styles.select}
                value={filter.type}
                onChange={(event) =>
                  dispatch({
                    kind: "update-filter",
                    index,
                    filter: {
                      ...filter,
                      type: event.target.value as FilterType,
                    } as FilterConfig,
                  })
                }
              >
                {FILTER_TYPES.map((type) => (
                  <option key={type} value={type}>
                    {FILTER_TYPE_LABEL[type]}
                  </option>
                ))}
              </select>
            </FormField>

            <FormField
              label="Rótulo"
              htmlFor={`filter-label-${filter.id}`}
              hint="Texto exibido ao lado do filtro para o usuário"
              error={errors.get(`filters.${index}.label`)}
            >
              <input
                id={`filter-label-${filter.id}`}
                className={styles.input}
                value={filter.label}
                onChange={(event) =>
                  dispatch({
                    kind: "update-filter",
                    index,
                    filter: { ...filter, label: event.target.value },
                  })
                }
              />
            </FormField>

            <FormField
              label="Campo de dados"
              htmlFor={`filter-data-field-${filter.id}`}
              hint="Nome do campo no conjunto de dados usado para filtrar"
              error={errors.get(`filters.${index}.dataField`)}
            >
              <input
                id={`filter-data-field-${filter.id}`}
                className={styles.input}
                value={filter.dataField}
                onChange={(event) =>
                  dispatch({
                    kind: "update-filter",
                    index,
                    filter: { ...filter, dataField: event.target.value },
                  })
                }
              />
            </FormField>

            <div className={styles.actions}>
              <button
                type="button"
                className={styles.iconButton}
                onClick={() => dispatch({ kind: "move-filter", index, direction: "up" })}
                disabled={index === 0}
                aria-label={`Mover filtro "${filter.label || filter.id}" para cima`}
              >
                ↑
              </button>
              <button
                type="button"
                className={styles.iconButton}
                onClick={() => dispatch({ kind: "move-filter", index, direction: "down" })}
                disabled={index === filters.length - 1}
                aria-label={`Mover filtro "${filter.label || filter.id}" para baixo`}
              >
                ↓
              </button>
              <button
                type="button"
                className={styles.removeButton}
                onClick={() => dispatch({ kind: "remove-filter", index })}
              >
                Remover
              </button>
            </div>
          </li>
        ))}
      </ul>

      <button
        type="button"
        className={styles.addButton}
        onClick={() => dispatch({ kind: "add-filter" })}
      >
        Adicionar filtro
      </button>
    </details>
  );
}

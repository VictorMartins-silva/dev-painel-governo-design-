import { useState, type Dispatch } from "react";
import type { ComponentConfig, ComponentType } from "../../config/schemas/components.schema";
import type { IndicatorCatalogEntry } from "../../config/schemas/indicator.schema";
import { COMPONENT_CATALOG } from "../../config/componentCatalog";
import { useIndicatorList } from "../../data/hooks/useIndicatorList";
import { useDataProvider } from "../../data/DataProviderContext";
import { FORMAT_TYPES, type FormatType } from "../../domain/types";
import type { EditorAction } from "./editorReducer";
import { FormField } from "./FormField";
import { IndicatorSelect } from "./IndicatorSelect";
import styles from "./ComponentForm.module.css";

const COMPONENT_TYPES = Object.keys(COMPONENT_CATALOG) as ComponentType[];

const FORMAT_LABEL: Record<FormatType, string> = {
  text: "Texto",
  integer: "Inteiro",
  decimal: "Decimal",
  percent: "Percentual",
  currency: "Moeda",
  date: "Data",
};

const COMPARISON_OPTIONS: {
  value: "" | "none" | "previous-period" | "previous-year";
  label: string;
}[] = [
  { value: "", label: "Automático (definido pelos dados)" },
  { value: "none", label: "Sem comparação" },
  { value: "previous-period", label: "Período anterior" },
  { value: "previous-year", label: "Ano anterior" },
];

const ORIENTATION_LABEL: Record<"horizontal" | "vertical", string> = {
  vertical: "Vertical",
  horizontal: "Horizontal",
};

const SORT_LABEL: Record<"asc" | "desc" | "none", string> = {
  none: "Sem ordenação",
  asc: "Crescente",
  desc: "Decrescente",
};

type ComponentFormProps = {
  component: ComponentConfig;
  errors: Map<string, string>;
  warnings?: Map<string, string>;
  errorPrefix: string;
  dispatch: Dispatch<EditorAction>;
  sectionIndex: number;
  componentIndex: number;
};

const NO_WARNINGS = new Map<string, string>();

export function ComponentForm({
  component,
  errors,
  warnings = NO_WARNINGS,
  errorPrefix,
  dispatch,
  sectionIndex,
  componentIndex,
}: ComponentFormProps) {
  const indicatorsState = useIndicatorList();
  const provider = useDataProvider();
  const [columnsLoad, setColumnsLoad] = useState<"idle" | "loading" | "error">("idle");

  const allIndicators = indicatorsState.status === "success" ? indicatorsState.data : [];
  const requiredShape = COMPONENT_CATALOG[component.type].requiredShape;
  const compatibleIndicators = allIndicators.filter((indicator) =>
    indicator.shapes.includes(requiredShape),
  );

  const selectedIndicator =
    component.type === "data-table"
      ? compatibleIndicators.find((indicator) => indicator.datasets?.includes(component.dataset))
      : compatibleIndicators.find((indicator) => indicator.id === component.metric);

  function update(next: ComponentConfig) {
    dispatch({ kind: "update-component", sectionIndex, componentIndex, component: next });
  }

  function handleIndicatorChange(indicator: IndicatorCatalogEntry | null) {
    if (!indicator) {
      update(
        component.type === "data-table"
          ? { ...component, dataset: "", columns: [] }
          : { ...component, metric: "" },
      );
      return;
    }

    switch (component.type) {
      case "indicator-card":
        update({
          ...component,
          metric: indicator.id,
          indicatorId: indicator.id,
          format: indicator.defaultFormat ?? component.format,
        });
        return;
      case "time-series":
        update({
          ...component,
          metric: indicator.id,
          dimension: indicator.dimensions?.[0],
          format: indicator.defaultFormat ?? component.format,
        });
        return;
      case "bar-chart":
        update({
          ...component,
          metric: indicator.id,
          dimension: indicator.dimensions?.[0] ?? "",
          format: indicator.defaultFormat ?? component.format,
        });
        return;
      case "data-table":
        update({ ...component, dataset: indicator.datasets?.[0] ?? "", columns: [] });
    }
  }

  async function handleLoadColumns() {
    if (component.type !== "data-table" || !component.dataset) return;
    setColumnsLoad("loading");
    try {
      const table = await provider.getTable({ dataset: component.dataset, filters: {} });
      update({ ...component, columns: table.data.columns });
      setColumnsLoad("idle");
    } catch {
      setColumnsLoad("error");
    }
  }

  return (
    <div className={styles.form}>
      <div className={styles.grid}>
        <FormField label="Tipo" htmlFor={`component-type-${component.id}`}>
          <select
            id={`component-type-${component.id}`}
            className={styles.select}
            value={component.type}
            onChange={(event) =>
              dispatch({
                kind: "update-component-type",
                sectionIndex,
                componentIndex,
                componentType: event.target.value as ComponentType,
              })
            }
          >
            {COMPONENT_TYPES.map((type) => (
              <option key={type} value={type}>
                {COMPONENT_CATALOG[type].label}
              </option>
            ))}
          </select>
        </FormField>

        <FormField
          label="Título"
          htmlFor={`component-title-${component.id}`}
          error={errors.get(`${errorPrefix}.title`)}
        >
          <input
            id={`component-title-${component.id}`}
            className={styles.input}
            value={component.title}
            onChange={(event) => update({ ...component, title: event.target.value })}
          />
        </FormField>
      </div>

      <IndicatorSelect
        id={`component-indicator-${component.id}`}
        indicators={compatibleIndicators}
        status={indicatorsState.status}
        value={selectedIndicator?.id ?? ""}
        onChange={handleIndicatorChange}
        error={errors.get(`${errorPrefix}.metric`) ?? errors.get(`${errorPrefix}.dataset`)}
        warning={warnings.get(`${errorPrefix}.metric`) ?? warnings.get(`${errorPrefix}.dataset`)}
      />

      {component.type === "indicator-card" && (
        <div className={styles.grid}>
          <FormField label="Formato" htmlFor={`component-format-${component.id}`}>
            <select
              id={`component-format-${component.id}`}
              className={styles.select}
              value={component.format}
              onChange={(event) =>
                update({ ...component, format: event.target.value as FormatType })
              }
            >
              {FORMAT_TYPES.map((format) => (
                <option key={format} value={format}>
                  {FORMAT_LABEL[format]}
                </option>
              ))}
            </select>
          </FormField>

          <FormField label="Comparação" htmlFor={`component-comparison-${component.id}`}>
            <select
              id={`component-comparison-${component.id}`}
              className={styles.select}
              value={component.comparison ?? ""}
              onChange={(event) => {
                const value = event.target.value as (typeof COMPARISON_OPTIONS)[number]["value"];
                update({ ...component, comparison: value === "" ? undefined : value });
              }}
            >
              {COMPARISON_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </FormField>
        </div>
      )}

      {component.type === "time-series" && (
        <div className={styles.grid}>
          <FormField label="Dimensão" htmlFor={`component-dimension-${component.id}`}>
            <select
              id={`component-dimension-${component.id}`}
              className={styles.select}
              value={component.dimension ?? ""}
              onChange={(event) =>
                update({ ...component, dimension: event.target.value || undefined })
              }
            >
              <option value="">Nenhuma</option>
              {(selectedIndicator?.dimensions ?? []).map((dimension) => (
                <option key={dimension} value={dimension}>
                  {dimension}
                </option>
              ))}
            </select>
          </FormField>

          <FormField label="Formato" htmlFor={`component-format-${component.id}`}>
            <select
              id={`component-format-${component.id}`}
              className={styles.select}
              value={component.format ?? ""}
              onChange={(event) =>
                update({
                  ...component,
                  format: (event.target.value || undefined) as FormatType | undefined,
                })
              }
            >
              <option value="">Automático</option>
              {FORMAT_TYPES.map((format) => (
                <option key={format} value={format}>
                  {FORMAT_LABEL[format]}
                </option>
              ))}
            </select>
          </FormField>
        </div>
      )}

      {component.type === "bar-chart" && (
        <div className={styles.grid}>
          <FormField
            label="Dimensão"
            htmlFor={`component-dimension-${component.id}`}
            error={errors.get(`${errorPrefix}.dimension`)}
            warning={warnings.get(`${errorPrefix}.dimension`)}
          >
            <select
              id={`component-dimension-${component.id}`}
              className={styles.select}
              value={component.dimension}
              onChange={(event) => update({ ...component, dimension: event.target.value })}
            >
              <option value="">Selecione uma dimensão</option>
              {(selectedIndicator?.dimensions ?? []).map((dimension) => (
                <option key={dimension} value={dimension}>
                  {dimension}
                </option>
              ))}
            </select>
          </FormField>

          <FormField label="Orientação" htmlFor={`component-orientation-${component.id}`}>
            <select
              id={`component-orientation-${component.id}`}
              className={styles.select}
              value={component.orientation}
              onChange={(event) =>
                update({
                  ...component,
                  orientation: event.target.value as "horizontal" | "vertical",
                })
              }
            >
              {(Object.keys(ORIENTATION_LABEL) as (keyof typeof ORIENTATION_LABEL)[]).map(
                (option) => (
                  <option key={option} value={option}>
                    {ORIENTATION_LABEL[option]}
                  </option>
                ),
              )}
            </select>
          </FormField>

          <FormField label="Ordenação" htmlFor={`component-sort-${component.id}`}>
            <select
              id={`component-sort-${component.id}`}
              className={styles.select}
              value={component.sort}
              onChange={(event) =>
                update({ ...component, sort: event.target.value as "asc" | "desc" | "none" })
              }
            >
              {(Object.keys(SORT_LABEL) as (keyof typeof SORT_LABEL)[]).map((option) => (
                <option key={option} value={option}>
                  {SORT_LABEL[option]}
                </option>
              ))}
            </select>
          </FormField>

          <FormField label="Formato" htmlFor={`component-format-${component.id}`}>
            <select
              id={`component-format-${component.id}`}
              className={styles.select}
              value={component.format ?? ""}
              onChange={(event) =>
                update({
                  ...component,
                  format: (event.target.value || undefined) as FormatType | undefined,
                })
              }
            >
              <option value="">Automático</option>
              {FORMAT_TYPES.map((format) => (
                <option key={format} value={format}>
                  {FORMAT_LABEL[format]}
                </option>
              ))}
            </select>
          </FormField>
        </div>
      )}

      {component.type === "data-table" && (
        <div className={styles.tableFields}>
          <div className={styles.grid}>
            <FormField label="Limite de linhas" htmlFor={`component-limit-${component.id}`}>
              <input
                id={`component-limit-${component.id}`}
                type="number"
                min={1}
                className={styles.input}
                value={component.limit ?? ""}
                onChange={(event) =>
                  update({
                    ...component,
                    limit: event.target.value === "" ? undefined : Number(event.target.value),
                  })
                }
              />
            </FormField>
          </div>

          <div className={styles.columnsHeader}>
            <span>Colunas</span>
            <button
              type="button"
              className={styles.secondaryButton}
              onClick={handleLoadColumns}
              disabled={!component.dataset || columnsLoad === "loading"}
            >
              {columnsLoad === "loading" ? "Carregando..." : "Carregar colunas do dataset"}
            </button>
          </div>

          {columnsLoad === "error" && (
            <p className={styles.blockError} role="alert">
              Não foi possível carregar as colunas do dataset selecionado.
            </p>
          )}
          {errors.get(`${errorPrefix}.columns`) && (
            <p className={styles.blockError} role="alert">
              {errors.get(`${errorPrefix}.columns`)}
            </p>
          )}
          {component.columns.length === 0 && (
            <p className={styles.hint}>Nenhuma coluna configurada.</p>
          )}

          <ul className={styles.columnsList}>
            {component.columns.map((column, columnIndex) => (
              <li key={columnIndex} className={styles.columnRow}>
                <FormField
                  label="Campo"
                  htmlFor={`component-column-field-${component.id}-${columnIndex}`}
                >
                  <input
                    id={`component-column-field-${component.id}-${columnIndex}`}
                    className={styles.input}
                    value={column.field}
                    onChange={(event) =>
                      update({
                        ...component,
                        columns: component.columns.map((c, i) =>
                          i === columnIndex ? { ...c, field: event.target.value } : c,
                        ),
                      })
                    }
                  />
                </FormField>

                <FormField
                  label="Rótulo"
                  htmlFor={`component-column-label-${component.id}-${columnIndex}`}
                >
                  <input
                    id={`component-column-label-${component.id}-${columnIndex}`}
                    className={styles.input}
                    value={column.label}
                    onChange={(event) =>
                      update({
                        ...component,
                        columns: component.columns.map((c, i) =>
                          i === columnIndex ? { ...c, label: event.target.value } : c,
                        ),
                      })
                    }
                  />
                </FormField>

                <FormField
                  label="Tipo da coluna"
                  htmlFor={`component-column-type-${component.id}-${columnIndex}`}
                >
                  <select
                    id={`component-column-type-${component.id}-${columnIndex}`}
                    className={styles.select}
                    value={column.type}
                    onChange={(event) =>
                      update({
                        ...component,
                        columns: component.columns.map((c, i) =>
                          i === columnIndex ? { ...c, type: event.target.value as FormatType } : c,
                        ),
                      })
                    }
                  >
                    {FORMAT_TYPES.map((format) => (
                      <option key={format} value={format}>
                        {FORMAT_LABEL[format]}
                      </option>
                    ))}
                  </select>
                </FormField>

                <button
                  type="button"
                  className={styles.removeButton}
                  onClick={() =>
                    update({
                      ...component,
                      columns: component.columns.filter((_, i) => i !== columnIndex),
                    })
                  }
                >
                  Remover coluna
                </button>
              </li>
            ))}
          </ul>

          <button
            type="button"
            className={styles.addButton}
            onClick={() =>
              update({
                ...component,
                columns: [...component.columns, { field: "", label: "", type: "text" }],
              })
            }
          >
            Adicionar coluna
          </button>
        </div>
      )}
    </div>
  );
}

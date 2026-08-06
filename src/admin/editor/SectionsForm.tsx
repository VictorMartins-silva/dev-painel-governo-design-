import type { Dispatch } from "react";
import { PANEL_LAYOUTS, type PanelLayout } from "../../domain/types";
import type { PanelSectionConfig } from "../../config/schemas/panel.schema";
import type { EditorAction } from "./editorReducer";
import { ComponentForm } from "./ComponentForm";
import { FormField } from "./FormField";
import { useForceShowErrors } from "./ValidationDisplayContext";
import styles from "./SectionsForm.module.css";

const LAYOUT_LABEL: Record<PanelLayout, string> = {
  "grid-2": "Grade 2 colunas",
  "grid-3": "Grade 3 colunas",
  "grid-4": "Grade 4 colunas",
  stack: "Empilhado",
};

type SectionsFormProps = {
  sections: PanelSectionConfig[];
  errors: Map<string, string>;
  warnings?: Map<string, string>;
  dispatch: Dispatch<EditorAction>;
};

export function SectionsForm({ sections, errors, warnings, dispatch }: SectionsFormProps) {
  const forceShowErrors = useForceShowErrors();
  return (
    <details open className={styles.block}>
      <summary className={styles.summary}>Seções</summary>
      {forceShowErrors && errors.get("sections") && (
        <p className={styles.blockError} role="alert">
          {errors.get("sections")}
        </p>
      )}

      {sections.length === 0 && <p className={styles.empty}>Nenhuma seção configurada.</p>}

      <ul className={styles.sectionList}>
        {sections.map((section, sectionIndex) => (
          <li key={section.id} className={styles.section}>
            <details className={styles.sectionDetails}>
              <summary className={styles.sectionSummary}>
                {section.title || `Seção ${sectionIndex + 1}`}
                <span className={styles.sectionSummaryMeta}>
                  {section.components.length}{" "}
                  {section.components.length === 1 ? "componente" : "componentes"}
                </span>
              </summary>

              <div className={styles.sectionHeader}>
                <FormField
                  label="Título da seção"
                  htmlFor={`section-title-${section.id}`}
                  hint="Nome exibido acima dos componentes desta seção"
                  error={errors.get(`sections.${sectionIndex}.title`)}
                >
                  <input
                    id={`section-title-${section.id}`}
                    className={styles.input}
                    value={section.title}
                    onChange={(event) =>
                      dispatch({
                        kind: "update-section-title",
                        index: sectionIndex,
                        value: event.target.value,
                      })
                    }
                  />
                </FormField>

                <FormField label="Layout" htmlFor={`section-layout-${section.id}`}>
                  <select
                    id={`section-layout-${section.id}`}
                    className={styles.select}
                    value={section.layout}
                    onChange={(event) =>
                      dispatch({
                        kind: "update-section-layout",
                        index: sectionIndex,
                        value: event.target.value as PanelLayout,
                      })
                    }
                  >
                    {PANEL_LAYOUTS.map((layout) => (
                      <option key={layout} value={layout}>
                        {LAYOUT_LABEL[layout]}
                      </option>
                    ))}
                  </select>
                </FormField>

                <div className={styles.actions}>
                  <button
                    type="button"
                    className={styles.iconButton}
                    onClick={() =>
                      dispatch({ kind: "move-section", index: sectionIndex, direction: "up" })
                    }
                    disabled={sectionIndex === 0}
                    aria-label={`Mover seção "${section.title || section.id}" para cima`}
                  >
                    ↑
                  </button>
                  <button
                    type="button"
                    className={styles.iconButton}
                    onClick={() =>
                      dispatch({ kind: "move-section", index: sectionIndex, direction: "down" })
                    }
                    disabled={sectionIndex === sections.length - 1}
                    aria-label={`Mover seção "${section.title || section.id}" para baixo`}
                  >
                    ↓
                  </button>
                  <button
                    type="button"
                    className={styles.removeButton}
                    onClick={() => dispatch({ kind: "remove-section", index: sectionIndex })}
                  >
                    Remover seção
                  </button>
                </div>
              </div>

              {errors.get(`sections.${sectionIndex}.components`) && forceShowErrors && (
                <p className={styles.blockError} role="alert">
                  {errors.get(`sections.${sectionIndex}.components`)}
                </p>
              )}

              <ul className={styles.componentList}>
                {section.components.map((component, componentIndex) => (
                  <li key={component.id} className={styles.componentRow}>
                    <div className={styles.componentRowHeader}>
                      <span className={styles.componentIndex}>Componente {componentIndex + 1}</span>
                      <div className={styles.actions}>
                        <button
                          type="button"
                          className={styles.iconButton}
                          onClick={() =>
                            dispatch({
                              kind: "move-component",
                              sectionIndex,
                              componentIndex,
                              direction: "up",
                            })
                          }
                          disabled={componentIndex === 0}
                          aria-label={`Mover componente "${component.title || component.id}" para cima`}
                        >
                          ↑
                        </button>
                        <button
                          type="button"
                          className={styles.iconButton}
                          onClick={() =>
                            dispatch({
                              kind: "move-component",
                              sectionIndex,
                              componentIndex,
                              direction: "down",
                            })
                          }
                          disabled={componentIndex === section.components.length - 1}
                          aria-label={`Mover componente "${component.title || component.id}" para baixo`}
                        >
                          ↓
                        </button>
                        <button
                          type="button"
                          className={styles.removeButton}
                          onClick={() =>
                            dispatch({ kind: "remove-component", sectionIndex, componentIndex })
                          }
                        >
                          Remover
                        </button>
                      </div>
                    </div>

                    <ComponentForm
                      component={component}
                      errors={errors}
                      warnings={warnings}
                      errorPrefix={`sections.${sectionIndex}.components.${componentIndex}`}
                      dispatch={dispatch}
                      sectionIndex={sectionIndex}
                      componentIndex={componentIndex}
                    />
                  </li>
                ))}
              </ul>

              <button
                type="button"
                className={styles.addButton}
                onClick={() =>
                  dispatch({
                    kind: "add-component",
                    sectionIndex,
                    componentType: "indicator-card",
                  })
                }
              >
                Adicionar componente
              </button>
            </details>
          </li>
        ))}
      </ul>

      <button
        type="button"
        className={styles.addButton}
        onClick={() => dispatch({ kind: "add-section" })}
      >
        Adicionar seção
      </button>
    </details>
  );
}

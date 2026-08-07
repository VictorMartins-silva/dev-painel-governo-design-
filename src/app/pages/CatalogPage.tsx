import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { PageHeader } from "../../components/layout/PageHeader";
import { PanelGrid } from "../../components/layout/PanelGrid";
import { PanelCard } from "../../components/panels/PanelCard";
import { AsyncBoundary } from "../../components/feedback/AsyncBoundary";
import { useListPanels } from "../../data/hooks/useListPanels";
import { allLenses, filterByLenses, lensValues, type Lens, type LensId } from "../../config/lenses";
import { lensStore } from "../../admin/store/LensStore";
import styles from "./CatalogPage.module.css";

export default function CatalogPage() {
  const panelsState = useListPanels();
  const [searchParams, setSearchParams] = useSearchParams();
  const [search, setSearch] = useState(() => searchParams.get("q") ?? "");
  const lenses = allLenses(lensStore.list());

  const activeValues: Partial<Record<LensId, string>> = {};
  for (const lens of lenses) {
    const value = searchParams.get(lens.param);
    if (value) activeValues[lens.id] = value;
  }

  function setLensValue(lens: Lens, value: string) {
    const next = new URLSearchParams(searchParams);
    if (value) next.set(lens.param, value);
    else next.delete(lens.param);
    setSearchParams(next, { replace: true });
  }

  const activeLenses = lenses.filter((lens) => activeValues[lens.id]);

  return (
    <div>
      <PageHeader
        title="Catálogo de painéis"
        description="Um único índice de painéis. Tema, secretaria e ODS são lentes — recortes independentes sobre o mesmo índice, combináveis e compartilháveis por link."
      />

      <AsyncBoundary
        state={panelsState}
        emptyTitle="Nenhum painel disponível"
        emptyMessage="Ainda não há painéis publicados."
      >
        {(panels) => {
          const normalizedSearch = search.trim().toLowerCase();

          const filtered = filterByLenses(panels, activeValues, lenses).filter((panel) => {
            if (
              normalizedSearch &&
              ![panel.title, panel.theme, ...panel.tags].some((field) =>
                field.toLowerCase().includes(normalizedSearch),
              )
            ) {
              return false;
            }
            return true;
          });

          return (
            <>
              <div className={styles.filters}>
                <div className={styles.field}>
                  <label className={styles.label} htmlFor="filtro-busca">
                    Busca
                  </label>
                  <input
                    id="filtro-busca"
                    type="search"
                    className={styles.search}
                    placeholder="Título, tema ou tag…"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </div>
                {lenses.map((lens) => {
                  const options = lensValues(lens, panels);
                  return (
                    <div className={styles.field} key={lens.id}>
                      <label className={styles.label} htmlFor={`filtro-${lens.id}`}>
                        {lens.label}
                      </label>
                      <select
                        id={`filtro-${lens.id}`}
                        className={styles.select}
                        value={activeValues[lens.id] ?? ""}
                        onChange={(e) => setLensValue(lens, e.target.value)}
                      >
                        <option value="">{lens.allLabel}</option>
                        {options.map((o) => (
                          <option key={o.value} value={o.value}>
                            {o.value} ({o.count})
                          </option>
                        ))}
                      </select>
                    </div>
                  );
                })}
              </div>

              {activeLenses.length > 0 && (
                <div className={styles.activeRow}>
                  <span className={styles.activeLabel}>Lentes ativas</span>
                  {activeLenses.map((lens) => (
                    <button
                      key={lens.id}
                      type="button"
                      className={styles.chip}
                      onClick={() => setLensValue(lens, "")}
                      aria-label={`Remover recorte ${lens.label}: ${activeValues[lens.id]}`}
                    >
                      {lens.label}: {activeValues[lens.id]} <span aria-hidden="true">×</span>
                    </button>
                  ))}
                </div>
              )}

              {filtered.length === 0 ? (
                <p>Nenhum painel encontrado para os filtros selecionados.</p>
              ) : (
                <PanelGrid layout="grid-3">
                  {filtered.map((panel) => (
                    <PanelCard key={panel.id} panel={panel} />
                  ))}
                </PanelGrid>
              )}
            </>
          );
        }}
      </AsyncBoundary>
    </div>
  );
}

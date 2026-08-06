import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { PageHeader } from "../../components/layout/PageHeader";
import { PanelGrid } from "../../components/layout/PanelGrid";
import { AsyncBoundary } from "../../components/feedback/AsyncBoundary";
import { IndicatorCatalogCard } from "../../components/indicators/IndicatorCatalogCard";
import { useIndicatorList } from "../../data/hooks/useIndicatorList";
import type { IndicatorCatalogEntry, IndicatorShape } from "../../config/schemas/indicator.schema";
import styles from "./IndicatorCatalogPage.module.css";

const SHAPE_LABEL: Record<IndicatorShape, string> = {
  metric: "Métrica",
  categorical: "Categórico",
  table: "Tabela",
};

function distinctValues(
  indicators: IndicatorCatalogEntry[],
  pick: (i: IndicatorCatalogEntry) => string,
) {
  const values = new Set(indicators.map(pick));
  return Array.from(values).sort((a, b) => a.localeCompare(b, "pt-BR"));
}

export default function IndicatorCatalogPage() {
  const indicatorsState = useIndicatorList();
  const [search, setSearch] = useState("");
  const [searchParams, setSearchParams] = useSearchParams();

  const activeSource = searchParams.get("fonte") ?? "";
  const activePeriodicity = searchParams.get("periodicidade") ?? "";
  const activeShape = (searchParams.get("forma") ?? "") as IndicatorShape | "";

  function setParam(key: string, value: string) {
    const next = new URLSearchParams(searchParams);
    if (value) next.set(key, value);
    else next.delete(key);
    setSearchParams(next, { replace: true });
  }

  return (
    <div>
      <PageHeader
        title="Catálogo de indicadores"
        description="Todo indicador disponível para compor painéis: definição, fonte, responsável e onde já está em uso. A curadoria completa, incluindo lacunas e referências quebradas, está em Configuração › Indicadores."
      />

      <AsyncBoundary
        state={indicatorsState}
        emptyTitle="Nenhum indicador disponível"
        emptyMessage="Ainda não há indicadores cadastrados no catálogo."
      >
        {(indicators) => {
          const normalizedSearch = search.trim().toLowerCase();

          const filtered = indicators.filter((indicator) => {
            if (activeSource && indicator.source !== activeSource) return false;
            if (activePeriodicity && indicator.periodicity !== activePeriodicity) return false;
            if (activeShape && !indicator.shapes.includes(activeShape)) return false;
            if (
              normalizedSearch &&
              ![indicator.name, indicator.definition, ...indicator.tags].some((field) =>
                field.toLowerCase().includes(normalizedSearch),
              )
            ) {
              return false;
            }
            return true;
          });

          const sources = distinctValues(indicators, (i) => i.source);
          const periodicities = distinctValues(indicators, (i) => i.periodicity);

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
                    placeholder="Nome, definição ou tag…"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </div>

                <div className={styles.field}>
                  <label className={styles.label} htmlFor="filtro-fonte">
                    Fonte
                  </label>
                  <select
                    id="filtro-fonte"
                    className={styles.select}
                    value={activeSource}
                    onChange={(e) => setParam("fonte", e.target.value)}
                  >
                    <option value="">Todas as fontes</option>
                    {sources.map((source) => (
                      <option key={source} value={source}>
                        {source}
                      </option>
                    ))}
                  </select>
                </div>

                <div className={styles.field}>
                  <label className={styles.label} htmlFor="filtro-periodicidade">
                    Periodicidade
                  </label>
                  <select
                    id="filtro-periodicidade"
                    className={styles.select}
                    value={activePeriodicity}
                    onChange={(e) => setParam("periodicidade", e.target.value)}
                  >
                    <option value="">Todas as periodicidades</option>
                    {periodicities.map((periodicity) => (
                      <option key={periodicity} value={periodicity}>
                        {periodicity}
                      </option>
                    ))}
                  </select>
                </div>

                <div className={styles.field}>
                  <label className={styles.label} htmlFor="filtro-forma">
                    Forma do dado
                  </label>
                  <select
                    id="filtro-forma"
                    className={styles.select}
                    value={activeShape}
                    onChange={(e) => setParam("forma", e.target.value)}
                  >
                    <option value="">Todas as formas</option>
                    {(Object.keys(SHAPE_LABEL) as IndicatorShape[]).map((shape) => (
                      <option key={shape} value={shape}>
                        {SHAPE_LABEL[shape]}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {filtered.length === 0 ? (
                <p>Nenhum indicador encontrado para os filtros selecionados.</p>
              ) : (
                <PanelGrid layout="grid-3">
                  {filtered.map((indicator) => (
                    <IndicatorCatalogCard key={indicator.id} indicator={indicator} />
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

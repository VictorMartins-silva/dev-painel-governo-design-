import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AsyncBoundary } from "../../components/feedback/AsyncBoundary";
import { PanelGrid } from "../../components/layout/PanelGrid";
import { PanelCard } from "../../components/panels/PanelCard";
import { useListPanels } from "../../data/hooks/useListPanels";
import { LENSES, lensHref, lensValues, topLensValue } from "../../config/lenses";
import styles from "./HomePage.module.css";

const LENS_PREVIEW_LIMIT = 4;

export default function HomePage() {
  const [search, setSearch] = useState("");
  const panelsState = useListPanels();
  const navigate = useNavigate();

  const normalizedSearch = search.trim().toLowerCase();

  return (
    <div>
      <div className={styles.hero}>
        <h1 className={styles.title}>Painel de Governo</h1>
        <p className={styles.description}>
          Plataforma padronizada de visualização de indicadores públicos do município, construída
          por configuração sobre uma biblioteca única de componentes analíticos.
        </p>
        <div className={styles.searchRow}>
          <input
            type="search"
            className={styles.search}
            placeholder="Buscar painéis por título ou tema…"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            aria-label="Buscar painéis"
          />
        </div>
      </div>

      <AsyncBoundary
        state={panelsState}
        emptyTitle="Nenhum painel disponível"
        emptyMessage="Ainda não há painéis publicados."
      >
        {(panels) => {
          const filtered = normalizedSearch
            ? panels.filter((panel) =>
                [panel.title, panel.theme, ...panel.tags].some((field) =>
                  field.toLowerCase().includes(normalizedSearch),
                ),
              )
            : panels;

          return (
            <>
              <section className={styles.lensSection} aria-label="Navegar por lente">
                <h2 className={styles.sectionTitle}>Navegue por lente</h2>
                <p className={styles.lensNote}>
                  Um único índice de painéis: cada recorte abaixo é uma lente diferente sobre os
                  mesmos painéis, não uma árvore de navegação separada.
                </p>
                <div className={styles.lensGrid}>
                  {LENSES.map((lens) => {
                    const values = lensValues(lens, panels);
                    const preview = values.slice(0, LENS_PREVIEW_LIMIT);
                    const rest = values.length - preview.length;
                    const defaultValue = topLensValue(lens, panels);

                    return (
                      <button
                        key={lens.id}
                        type="button"
                        className={styles.lensCard}
                        onClick={() =>
                          navigate(defaultValue ? lensHref(lens, defaultValue) : "/paineis")
                        }
                      >
                        <div className={styles.lensTop}>
                          <h3 className={styles.lensTitle}>{lens.label}</h3>
                          <span className={styles.lensValueCount}>{values.length}</span>
                        </div>
                        <p className={styles.lensDescription}>{lens.description}</p>
                        <div className={styles.lensPreview}>
                          {preview.map((v) => (
                            <span key={v.value} className={styles.lensChip}>
                              {v.value} · {v.count}
                            </span>
                          ))}
                          {rest > 0 && <span className={styles.lensChip}>+{rest}</span>}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </section>

              <h2 className={styles.sectionTitle}>Painéis disponíveis</h2>
              {filtered.length === 0 ? (
                <p>Nenhum painel encontrado para “{search}”.</p>
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

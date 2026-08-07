import { Link, useParams } from "react-router-dom";
import { Breadcrumb } from "../../components/layout/Breadcrumb";
import { PageHeader } from "../../components/layout/PageHeader";
import { AsyncBoundary } from "../../components/feedback/AsyncBoundary";
import { ErrorState } from "../../components/feedback/ErrorState";
import { useListPanels } from "../../data/hooks/useListPanels";
import { findLens, lensHref, lensValues } from "../../config/lenses";
import { lensStore } from "../../admin/store/LensStore";
import styles from "./LensCategoriesPage.module.css";

// Valor de fallback do lenses.ts para painéis sem mapeamento heurístico (ver ODS_BY_THEME).
const UNCLASSIFIED_VALUE = "—";
const UNCLASSIFIED_LABEL = "Não classificado";

export default function LensCategoriesPage() {
  const { lensId } = useParams<{ lensId: string }>();
  const lens = lensId ? findLens(lensId, lensStore.list()) : undefined;
  const panelsState = useListPanels();

  if (!lens) {
    return (
      <ErrorState
        title="Lente não encontrada"
        message={`Não existe uma lente com o identificador "${lensId ?? ""}".`}
      />
    );
  }

  return (
    <div>
      <Breadcrumb items={[{ label: "Início", href: "/" }, { label: lens.label }]} />
      <PageHeader title={lens.label} description={lens.description} />

      <AsyncBoundary
        state={panelsState}
        emptyTitle="Nenhum painel disponível"
        emptyMessage="Ainda não há painéis publicados."
      >
        {(panels) => {
          const values = lensValues(lens, panels);

          return (
            <div className={styles.grid}>
              {values.map(({ value, count }) => (
                <Link key={value} to={lensHref(lens, value)} className={styles.card}>
                  <h3 className={styles.title}>
                    {value === UNCLASSIFIED_VALUE ? UNCLASSIFIED_LABEL : value}
                  </h3>
                  <span className={styles.chip}>
                    {count} {count === 1 ? "painel" : "painéis"}
                  </span>
                </Link>
              ))}
            </div>
          );
        }}
      </AsyncBoundary>
    </div>
  );
}

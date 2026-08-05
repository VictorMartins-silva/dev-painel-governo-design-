import { Link, useParams } from "react-router-dom";
import { Breadcrumb } from "../../components/layout/Breadcrumb";
import { PageHeader } from "../../components/layout/PageHeader";
import { Section } from "../../components/layout/Section";
import { AsyncBoundary } from "../../components/feedback/AsyncBoundary";
import { ErrorState } from "../../components/feedback/ErrorState";
import { useIndicatorMetadata } from "../../data/hooks/useIndicatorMetadata";
import { useIndicatorUsage } from "../../data/hooks/useIndicatorUsage";
import type { IndicatorShape } from "../../config/schemas/indicator.schema";
import styles from "./IndicatorDetailPage.module.css";

const SHAPE_LABEL: Record<IndicatorShape, string> = {
  metric: "Métrica",
  categorical: "Categórico",
  table: "Tabela",
};

function IndicatorUsageSection({ indicatorId }: { indicatorId: string }) {
  const usageState = useIndicatorUsage(indicatorId);

  if (usageState.status === "loading") return null;
  if (usageState.status === "error") return null;

  const usage = usageState.status === "success" ? usageState.data : [];

  return (
    <Section title="Usado nos painéis">
      {usage.length === 0 ? (
        <p className={styles.value}>Nenhum painel publicado usa este indicador no momento.</p>
      ) : (
        <ul className={styles.usageList}>
          {usage.map((entry, index) => (
            <li key={index} className={styles.usageItem}>
              <Link to={`/paineis/${entry.panelId}`} className={styles.usageLink}>
                {entry.panelTitle}
              </Link>
              <span className={styles.usageDetail}>
                {entry.sectionTitle} · {entry.componentTitle}
              </span>
            </li>
          ))}
        </ul>
      )}
    </Section>
  );
}

export default function IndicatorDetailPage() {
  const { id } = useParams<{ id: string }>();
  const metadataState = useIndicatorMetadata(id ?? "");

  if (!id) {
    return (
      <ErrorState
        title="Indicador não especificado"
        message="Nenhum identificador de indicador foi informado na URL."
      />
    );
  }

  return (
    <AsyncBoundary
      state={metadataState}
      loadingLabel="Carregando indicador…"
      emptyTitle="Indicador não encontrado"
      emptyMessage={`Não existem metadados para o indicador "${id}".`}
    >
      {(metadata) => (
        <div>
          <Breadcrumb
            items={[
              { label: "Início", href: "/" },
              { label: "Indicadores", href: "/indicadores" },
              { label: metadata.name },
            ]}
          />
          <PageHeader title={metadata.name} description={metadata.definition} />
          <div className={styles.grid}>
            <div className={styles.item}>
              <span className={styles.label}>Unidade</span>
              <span className={styles.value}>{metadata.unit}</span>
            </div>
            <div className={styles.item}>
              <span className={styles.label}>Periodicidade</span>
              <span className={styles.value}>{metadata.periodicity}</span>
            </div>
            <div className={styles.item}>
              <span className={styles.label}>Granularidade</span>
              <span className={styles.value}>{metadata.granularity}</span>
            </div>
            <div className={styles.item}>
              <span className={styles.label}>Fonte</span>
              <span className={styles.value}>{metadata.source}</span>
            </div>
            <div className={styles.item}>
              <span className={styles.label}>Responsável</span>
              <span className={styles.value}>{metadata.owner}</span>
            </div>
            <div className={styles.item}>
              <span className={styles.label}>Atualizado em</span>
              <span className={styles.value}>{metadata.updatedAt}</span>
            </div>
            <div className={styles.item}>
              <span className={styles.label}>Formas de dado</span>
              <span className={styles.value}>
                {metadata.shapes.map((shape) => SHAPE_LABEL[shape]).join(", ")}
              </span>
            </div>
            {metadata.dimensions.length > 0 && (
              <div className={styles.item}>
                <span className={styles.label}>Dimensões</span>
                <span className={styles.value}>{metadata.dimensions.join(", ")}</span>
              </div>
            )}
            {metadata.formula && (
              <div className={`${styles.item} ${styles.full}`}>
                <span className={styles.label}>Fórmula</span>
                <span className={styles.value}>{metadata.formula}</span>
              </div>
            )}
            {metadata.limitations && (
              <div className={`${styles.item} ${styles.full}`}>
                <span className={styles.label}>Limitações</span>
                <span className={styles.value}>{metadata.limitations}</span>
              </div>
            )}
          </div>

          <IndicatorUsageSection indicatorId={id} />
        </div>
      )}
    </AsyncBoundary>
  );
}

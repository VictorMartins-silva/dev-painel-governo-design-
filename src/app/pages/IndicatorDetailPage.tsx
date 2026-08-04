import { useParams } from "react-router-dom";
import { Breadcrumb } from "../../components/layout/Breadcrumb";
import { PageHeader } from "../../components/layout/PageHeader";
import { AsyncBoundary } from "../../components/feedback/AsyncBoundary";
import { ErrorState } from "../../components/feedback/ErrorState";
import { useIndicatorMetadata } from "../../data/hooks/useIndicatorMetadata";
import styles from "./IndicatorDetailPage.module.css";

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
          <Breadcrumb items={[{ label: "Início", href: "/" }, { label: metadata.name }]} />
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
        </div>
      )}
    </AsyncBoundary>
  );
}

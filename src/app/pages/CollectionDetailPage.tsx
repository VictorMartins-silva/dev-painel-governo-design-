import { Link, useParams } from "react-router-dom";
import { Breadcrumb } from "../../components/layout/Breadcrumb";
import { PageHeader } from "../../components/layout/PageHeader";
import { ErrorState } from "../../components/feedback/ErrorState";
import { collectionStore } from "../../admin/store/CollectionStore";
import { panelStore } from "../../admin/store/PanelStore";
import { resolveCollectionSlides } from "../../renderer/resolveCollectionSlides";
import styles from "./CollectionDetailPage.module.css";

export default function CollectionDetailPage() {
  const { id } = useParams<{ id: string }>();
  const collection = id ? collectionStore.get(id) : undefined;

  if (!id || !collection) {
    return (
      <ErrorState
        title="Coleção não encontrada"
        message={`Não existe uma coleção com o identificador "${id ?? ""}".`}
      />
    );
  }

  const slides = resolveCollectionSlides(collection, (panelId) => panelStore.get(panelId));
  const missing = collection.panels.length - slides.length;

  return (
    <div>
      <Breadcrumb
        items={[
          { label: "Início", href: "/" },
          { label: "Apresentações", href: "/sala" },
          { label: collection.title },
        ]}
      />
      <PageHeader
        title={collection.title}
        description={collection.description}
        actions={
          <Link to={`/sala/${collection.id}/apresentar`} className={styles.presentButton}>
            Iniciar apresentação
          </Link>
        }
      />

      {missing > 0 && (
        <p className={styles.warning} role="alert">
          {missing} painel(is) desta coleção não foi(ram) encontrado(s) e não entra(m) na rotação.
        </p>
      )}

      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Sequência de painéis</h2>
        <ol className={styles.list}>
          {collection.panels.map((ref, index) => {
            const panel = panelStore.get(ref.panelId);
            return (
              <li key={ref.panelId} className={styles.listItem}>
                <span className={styles.listIndex}>{index + 1}</span>
                <span className={styles.listTitle}>
                  {panel?.title ?? `Painel removido (${ref.panelId})`}
                </span>
                <span className={styles.listTimer}>
                  {ref.timerSeconds ?? collection.timerSeconds}s
                </span>
              </li>
            );
          })}
        </ol>
      </div>
    </div>
  );
}

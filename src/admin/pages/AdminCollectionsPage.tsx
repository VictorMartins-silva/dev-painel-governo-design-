import { useState } from "react";
import { Link } from "react-router-dom";
import { PageHeader } from "../../components/layout/PageHeader";
import { collectionStore } from "../store/CollectionStore";
import styles from "../pages/AdminPanelsPage.module.css";

export default function AdminCollectionsPage() {
  const [, setVersion] = useState(0);

  function refresh() {
    setVersion((current) => current + 1);
  }

  const entries = [...collectionStore.list()].sort((a, b) => a.title.localeCompare(b.title));

  function handleDelete(id: string) {
    const confirmed = window.confirm(`Excluir a coleção "${id}"? Essa ação não pode ser desfeita.`);
    if (!confirmed) return;
    collectionStore.remove(id);
    refresh();
  }

  return (
    <div>
      <PageHeader
        title="Coleções"
        description="Coleções são o que roda em Apresentações: uma sequência de painéis com tempo de exibição."
        actions={
          <Link to="/admin/colecoes/novo" className={styles.primaryButton}>
            Nova coleção
          </Link>
        }
      />

      {entries.length === 0 ? (
        <p>Nenhuma coleção cadastrada.</p>
      ) : (
        <ul className={styles.list}>
          {entries.map((config) => (
            <li key={config.id} className={styles.row}>
              <div className={styles.info}>
                <div className={styles.titleRow}>
                  <span className={styles.title}>{config.title}</span>
                </div>
                <span className={styles.meta}>
                  {config.id} · {config.panels.length} painéis · {config.timerSeconds}s
                </span>
              </div>
              <div className={styles.actions}>
                <Link to={`/sala/${config.id}`} className={styles.linkButton}>
                  Ver em Apresentações
                </Link>
                <Link to={`/admin/colecoes/${config.id}`} className={styles.linkButton}>
                  Editar
                </Link>
                <button
                  type="button"
                  className={`${styles.linkButton} ${styles.danger}`}
                  onClick={() => handleDelete(config.id)}
                >
                  Excluir
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

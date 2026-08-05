import { useState } from "react";
import { Link } from "react-router-dom";
import { Breadcrumb } from "../../components/layout/Breadcrumb";
import { PageHeader } from "../../components/layout/PageHeader";
import { collectionStore, type CollectionOrigin } from "../store/CollectionStore";
import styles from "../pages/AdminPanelsPage.module.css";

const ORIGIN_LABEL: Record<CollectionOrigin, string> = {
  static: "Original",
  modified: "Modificado",
  custom: "Novo",
};

export default function AdminCollectionsPage() {
  const [, setVersion] = useState(0);

  function refresh() {
    setVersion((current) => current + 1);
  }

  const entries = [...collectionStore.list()].sort((a, b) =>
    a.config.title.localeCompare(b.config.title),
  );

  function handleRestore(id: string) {
    const confirmed = window.confirm(
      `Restaurar a versão original da coleção "${id}"? As edições locais serão perdidas.`,
    );
    if (!confirmed) return;
    collectionStore.restoreOriginal(id);
    refresh();
  }

  function handleDelete(id: string) {
    const confirmed = window.confirm(`Excluir a coleção "${id}"? Essa ação não pode ser desfeita.`);
    if (!confirmed) return;
    collectionStore.restoreOriginal(id);
    refresh();
  }

  return (
    <div>
      <Breadcrumb
        items={[
          { label: "Início", href: "/" },
          { label: "Admin", href: "/admin" },
          { label: "Coleções" },
        ]}
      />
      <PageHeader
        title="Coleções"
        description="Coleções são o que roda na Sala de situação: uma sequência de painéis com tempo de exibição."
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
          {entries.map(({ config, origin }) => (
            <li key={config.id} className={styles.row}>
              <div className={styles.info}>
                <div className={styles.titleRow}>
                  <span className={styles.title}>{config.title}</span>
                  <span className={`${styles.badge} ${styles[origin]}`}>
                    {ORIGIN_LABEL[origin]}
                  </span>
                </div>
                <span className={styles.meta}>
                  {config.id} · {config.panels.length} painéis · {config.timerSeconds}s
                </span>
              </div>
              <div className={styles.actions}>
                <Link to={`/sala/${config.id}`} className={styles.linkButton}>
                  Ver na Sala de situação
                </Link>
                <Link to={`/admin/colecoes/${config.id}`} className={styles.linkButton}>
                  Editar
                </Link>
                {origin === "modified" && (
                  <button
                    type="button"
                    className={styles.linkButton}
                    onClick={() => handleRestore(config.id)}
                  >
                    Restaurar original
                  </button>
                )}
                {origin !== "static" && (
                  <button
                    type="button"
                    className={`${styles.linkButton} ${styles.danger}`}
                    onClick={() => handleDelete(config.id)}
                  >
                    Excluir
                  </button>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

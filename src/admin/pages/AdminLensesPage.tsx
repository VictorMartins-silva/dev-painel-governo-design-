import { useState } from "react";
import { Link } from "react-router-dom";
import { PageHeader } from "../../components/layout/PageHeader";
import { LENSES } from "../../config/lenses";
import { lensStore } from "../store/LensStore";
import styles from "../pages/AdminPanelsPage.module.css";

export default function AdminLensesPage() {
  const [, setVersion] = useState(0);

  function refresh() {
    setVersion((current) => current + 1);
  }

  const customLenses = [...lensStore.list()].sort((a, b) => a.label.localeCompare(b.label));

  function handleDelete(id: string) {
    const confirmed = window.confirm(`Excluir a lente "${id}"? Essa ação não pode ser desfeita.`);
    if (!confirmed) return;
    lensStore.remove(id);
    refresh();
  }

  return (
    <div>
      <PageHeader
        title="Lentes"
        description="Uma lente é um recorte sobre o índice único de painéis. As três lentes padrão do sistema (Tema, Secretaria, ODS) vêm do código; lentes cadastradas aqui são um conjunto fixo de painéis com um nome."
        actions={
          <Link to="/admin/lentes/novo" className={styles.primaryButton}>
            Nova lente
          </Link>
        }
      />

      <ul className={styles.list}>
        {LENSES.map((lens) => (
          <li key={lens.id} className={styles.row}>
            <div className={styles.info}>
              <div className={styles.titleRow}>
                <span className={styles.title}>{lens.label}</span>
                <span className={`${styles.badge} ${styles.static}`}>Padrão do sistema</span>
              </div>
              <span className={styles.meta}>{lens.id}</span>
            </div>
          </li>
        ))}

        {customLenses.map((config) => (
          <li key={config.id} className={styles.row}>
            <div className={styles.info}>
              <div className={styles.titleRow}>
                <span className={styles.title}>{config.label}</span>
                <span className={`${styles.badge} ${styles.custom}`}>Cadastrada</span>
              </div>
              <span className={styles.meta}>
                {config.id} · {config.panelIds.length} painéis
              </span>
            </div>
            <div className={styles.actions}>
              <Link to={`/lentes/${config.id}`} className={styles.linkButton}>
                Ver navegação
              </Link>
              <Link to={`/admin/lentes/${config.id}`} className={styles.linkButton}>
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

      {customLenses.length === 0 && (
        <p>Nenhuma lente cadastrada ainda além das padrão do sistema.</p>
      )}
    </div>
  );
}

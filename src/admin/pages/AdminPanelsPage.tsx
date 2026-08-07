import { useRef, useState, type ChangeEvent } from "react";
import { Link } from "react-router-dom";
import { PageHeader } from "../../components/layout/PageHeader";
import type { PanelConfig } from "../../config/schemas/panel.schema";
import { panelStore, type PanelOrigin } from "../store/PanelStore";
import { downloadPanelConfig, readPanelConfigFile } from "../store/exportImport";
import styles from "./AdminPanelsPage.module.css";

const ORIGIN_LABEL: Record<PanelOrigin, string> = {
  static: "Original",
  modified: "Modificado",
  custom: "Novo",
};

const PROVIDER_LABEL: Record<PanelConfig["embed"]["provider"], string> = {
  "powerbi-public": "Publicar na Web",
  "powerbi-secure": "Secure Embed",
};

export default function AdminPanelsPage() {
  const [, setVersion] = useState(0);
  const [importError, setImportError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  function refresh() {
    setVersion((current) => current + 1);
  }

  const entries = [...panelStore.list()].sort((a, b) =>
    a.config.title.localeCompare(b.config.title),
  );

  function handleRestore(id: string) {
    const confirmed = window.confirm(
      `Restaurar a versão original do painel "${id}"? As edições locais serão perdidas.`,
    );
    if (!confirmed) return;
    panelStore.restoreOriginal(id);
    refresh();
  }

  function handleDelete(id: string) {
    const confirmed = window.confirm(`Excluir o painel "${id}"? Essa ação não pode ser desfeita.`);
    if (!confirmed) return;
    panelStore.restoreOriginal(id);
    refresh();
  }

  function handleDuplicate(config: PanelConfig) {
    const newId = window.prompt("Id do novo painel (único):", `${config.id}-copia`);
    if (!newId) return;

    const trimmed = newId.trim();
    if (!trimmed) return;

    if (panelStore.get(trimmed)) {
      window.alert(`Já existe um painel com o id "${trimmed}".`);
      return;
    }

    panelStore.save({ ...config, id: trimmed, title: `${config.title} (cópia)` });
    refresh();
  }

  function handleImportClick() {
    setImportError(null);
    fileInputRef.current?.click();
  }

  async function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;

    const result = await readPanelConfigFile(file);
    if (!result.ok) {
      setImportError(result.error);
      return;
    }

    if (panelStore.get(result.config.id)) {
      const overwrite = window.confirm(
        `Já existe um painel com o id "${result.config.id}". Sobrescrever?`,
      );
      if (!overwrite) return;
    }

    panelStore.save(result.config);
    setImportError(null);
    refresh();
  }

  return (
    <div>
      <PageHeader
        title="Painéis"
        description="Crie, edite e publique painéis. Painéis estáticos editados aqui passam a ser sombreados por uma cópia local."
        actions={
          <>
            <button type="button" className={styles.secondaryButton} onClick={handleImportClick}>
              Importar
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="application/json"
              aria-label="Selecionar arquivo de painel para importar"
              className={styles.hiddenInput}
              onChange={(event) => {
                void handleFileChange(event);
              }}
            />
            <Link to="/admin/paineis/novo" className={styles.primaryButton}>
              Novo painel
            </Link>
          </>
        }
      />

      {importError && (
        <p className={styles.importError} role="alert">
          {importError}
        </p>
      )}

      {entries.length === 0 ? (
        <p>Nenhum painel cadastrado.</p>
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
                  <span className={styles.externalBadge}>
                    {PROVIDER_LABEL[config.embed.provider]}
                  </span>
                </div>
                <span className={styles.meta}>
                  {config.id} · {config.theme}
                </span>
              </div>
              <div className={styles.actions}>
                <Link to={`/admin/paineis/${config.id}`} className={styles.linkButton}>
                  Editar
                </Link>
                <button
                  type="button"
                  className={styles.linkButton}
                  onClick={() => handleDuplicate(config)}
                >
                  Duplicar
                </button>
                <button
                  type="button"
                  className={styles.linkButton}
                  onClick={() => downloadPanelConfig(config)}
                >
                  Exportar
                </button>
                {origin === "modified" && (
                  <button
                    type="button"
                    className={styles.linkButton}
                    onClick={() => handleRestore(config.id)}
                  >
                    Restaurar original
                  </button>
                )}
                {origin === "custom" && (
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

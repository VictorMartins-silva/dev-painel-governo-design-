import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Breadcrumb } from "../../components/layout/Breadcrumb";
import { PageHeader } from "../../components/layout/PageHeader";
import { FormField } from "../editor/FormField";
import { lensStore } from "../store/LensStore";
import { panelStore } from "../store/PanelStore";
import { lensConfigSchema, type LensConfig } from "../../config/schemas/lens.schema";
import styles from "./LensEditorPage.module.css";

function createEmptyDraft(): LensConfig {
  return {
    schemaVersion: 1,
    id: "",
    label: "",
    description: "",
    allLabel: "",
    panelIds: [],
  };
}

export default function LensEditorPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isNew = id === undefined;
  const existing = isNew ? undefined : lensStore.get(id);

  const [draft, setDraft] = useState<LensConfig>(() => existing ?? createEmptyDraft());
  const [panelSearch, setPanelSearch] = useState("");
  const [error, setError] = useState<string | null>(null);

  if (!isNew && !existing) {
    return (
      <div>
        <Breadcrumb
          items={[{ label: "Lentes", href: "/admin/lentes" }, { label: "Lente não encontrada" }]}
        />
        <PageHeader
          title="Lente não encontrada"
          description={`Não existe uma lente cadastrada com o id "${id}".`}
        />
        <Link to="/admin/lentes" className={styles.backLink}>
          ← Voltar para a lista de lentes
        </Link>
      </div>
    );
  }

  const availablePanels = [...panelStore.list()]
    .sort((a, b) => a.title.localeCompare(b.title))
    .filter((config) =>
      panelSearch.trim()
        ? config.title.toLowerCase().includes(panelSearch.trim().toLowerCase())
        : true,
    );

  function togglePanel(panelId: string) {
    setDraft((current) => ({
      ...current,
      panelIds: current.panelIds.includes(panelId)
        ? current.panelIds.filter((id) => id !== panelId)
        : [...current.panelIds, panelId],
    }));
  }

  function handleSave() {
    const result = lensConfigSchema.safeParse(draft);
    if (!result.success) {
      setError(result.error.issues.map((issue) => issue.message).join("; "));
      return;
    }
    if (isNew && lensStore.get(result.data.id)) {
      setError(`Já existe uma lente com o id "${result.data.id}".`);
      return;
    }
    lensStore.save(result.data);
    navigate("/admin/lentes");
  }

  return (
    <div>
      <Breadcrumb
        items={[
          { label: "Lentes", href: "/admin/lentes" },
          { label: isNew ? "Nova lente" : draft.label || draft.id },
        ]}
      />
      <PageHeader
        title={isNew ? "Nova lente" : "Editar lente"}
        description="Uma lente cadastrada é um conjunto fixo de painéis com um nome — aparece na Home e no Catálogo como um recorte adicional, ao lado de Tema, Secretaria e ODS."
      />

      {error && (
        <p className={styles.error} role="alert">
          {error}
        </p>
      )}

      <div className={styles.layout}>
        <div className={styles.metaColumn}>
          <FormField label="Id (único)" htmlFor="lens-id">
            <input
              id="lens-id"
              className={styles.input}
              value={draft.id}
              disabled={!isNew}
              onChange={(e) => setDraft((current) => ({ ...current, id: e.target.value }))}
            />
          </FormField>

          <FormField label="Nome" htmlFor="lens-label">
            <input
              id="lens-label"
              className={styles.input}
              value={draft.label}
              onChange={(e) => setDraft((current) => ({ ...current, label: e.target.value }))}
            />
          </FormField>

          <FormField label="Descrição" htmlFor="lens-description">
            <textarea
              id="lens-description"
              className={styles.textarea}
              value={draft.description}
              onChange={(e) =>
                setDraft((current) => ({ ...current, description: e.target.value }))
              }
            />
          </FormField>

          <FormField
            label="Rótulo de 'ver todos' (opcional)"
            htmlFor="lens-all-label"
            hint={`Se vazio, usa "Todos — ${draft.label || "..."}".`}
          >
            <input
              id="lens-all-label"
              className={styles.input}
              value={draft.allLabel}
              onChange={(e) => setDraft((current) => ({ ...current, allLabel: e.target.value }))}
            />
          </FormField>
        </div>

        <div className={styles.panelsSection}>
          <div className={styles.panelsHeader}>
            <h2 className={styles.panelsTitle}>
              Painéis desta lente ({draft.panelIds.length} selecionados)
            </h2>
            <input
              type="search"
              className={styles.panelSearch}
              placeholder="Buscar painel…"
              value={panelSearch}
              onChange={(e) => setPanelSearch(e.target.value)}
              aria-label="Buscar painel para adicionar à lente"
            />
          </div>

          {availablePanels.length === 0 ? (
            <p className={styles.empty}>Nenhum painel encontrado.</p>
          ) : (
            <ul className={styles.panelsList}>
              {availablePanels.map((config) => (
                <li key={config.id} className={styles.panelRow}>
                  <label className={styles.panelCheckboxLabel}>
                    <input
                      type="checkbox"
                      checked={draft.panelIds.includes(config.id)}
                      onChange={() => togglePanel(config.id)}
                    />
                    <span className={styles.panelTitle}>{config.title}</span>
                    <span className={styles.panelTheme}>{config.theme}</span>
                  </label>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className={styles.actions}>
          <Link to="/admin/lentes" className={styles.secondaryButton}>
            Cancelar
          </Link>
          <button type="button" className={styles.primaryButton} onClick={handleSave}>
            Salvar
          </button>
        </div>
      </div>
    </div>
  );
}

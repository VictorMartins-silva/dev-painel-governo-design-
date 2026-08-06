import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Breadcrumb } from "../../components/layout/Breadcrumb";
import { PageHeader } from "../../components/layout/PageHeader";
import { FormField } from "../editor/FormField";
import { collectionStore } from "../store/CollectionStore";
import { panelStore } from "../store/PanelStore";
import {
  collectionConfigSchema,
  type CollectionConfig,
  type CollectionPanelRef,
} from "../../config/schemas/collection.schema";
import { buildCollectionWarnings } from "../editor/collectionWarnings";
import styles from "./CollectionEditorPage.module.css";

function createEmptyDraft(): CollectionConfig {
  return {
    schemaVersion: 1,
    id: "",
    title: "",
    description: "",
    timerSeconds: 45,
    refreshEveryCycles: 1,
    panels: [],
  };
}

export default function CollectionEditorPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isNew = id === undefined;
  const existing = isNew ? undefined : collectionStore.get(id);

  const [draft, setDraft] = useState<CollectionConfig>(() => existing ?? createEmptyDraft());
  const [error, setError] = useState<string | null>(null);

  if (!isNew && !existing) {
    return (
      <div>
        <Breadcrumb
          items={[
            { label: "Coleções", href: "/admin/colecoes" },
            { label: "Coleção não encontrada" },
          ]}
        />
        <PageHeader
          title="Coleção não encontrada"
          description={`Não existe uma coleção com o id "${id}".`}
        />
        <Link to="/admin/colecoes" className={styles.backLink}>
          ← Voltar para a lista de coleções
        </Link>
      </div>
    );
  }

  const availablePanels = [...panelStore.list()].sort((a, b) =>
    a.config.title.localeCompare(b.config.title),
  );
  const warnings = buildCollectionWarnings(draft, (panelId) => panelStore.get(panelId));

  function updatePanel(index: number, changes: Partial<CollectionPanelRef>) {
    setDraft((current) => ({
      ...current,
      panels: current.panels.map((ref, refIndex) =>
        refIndex === index ? { ...ref, ...changes } : ref,
      ),
    }));
  }

  function addPanel() {
    const first = availablePanels[0];
    if (!first) return;
    setDraft((current) => ({
      ...current,
      panels: [...current.panels, { panelId: first.config.id }],
    }));
  }

  function removePanel(index: number) {
    setDraft((current) => ({
      ...current,
      panels: current.panels.filter((_, refIndex) => refIndex !== index),
    }));
  }

  function movePanel(index: number, direction: -1 | 1) {
    const target = index + direction;
    if (target < 0 || target >= draft.panels.length) return;
    setDraft((current) => {
      const panels = [...current.panels];
      [panels[index], panels[target]] = [panels[target], panels[index]];
      return { ...current, panels };
    });
  }

  function handleSave() {
    const result = collectionConfigSchema.safeParse(draft);
    if (!result.success) {
      setError(result.error.issues.map((issue) => issue.message).join("; "));
      return;
    }
    if (isNew && collectionStore.get(result.data.id)) {
      setError(`Já existe uma coleção com o id "${result.data.id}".`);
      return;
    }
    collectionStore.save(result.data);
    navigate("/admin/colecoes");
  }

  return (
    <div>
      <Breadcrumb
        items={[
          { label: "Coleções", href: "/admin/colecoes" },
          { label: isNew ? "Nova coleção" : draft.title || draft.id },
        ]}
      />
      <PageHeader
        title={isNew ? "Nova coleção" : `Editar coleção`}
        description="Uma coleção é uma sequência de painéis com tempo de exibição, apresentada em Apresentações."
      />

      {error && (
        <p className={styles.error} role="alert">
          {error}
        </p>
      )}

      <div className={styles.form}>
        <FormField label="Id (único)" htmlFor="collection-id">
          <input
            id="collection-id"
            className={styles.input}
            value={draft.id}
            disabled={!isNew}
            onChange={(e) => setDraft((current) => ({ ...current, id: e.target.value }))}
          />
        </FormField>

        <FormField label="Título" htmlFor="collection-title">
          <input
            id="collection-title"
            className={styles.input}
            value={draft.title}
            onChange={(e) => setDraft((current) => ({ ...current, title: e.target.value }))}
          />
        </FormField>

        <FormField label="Descrição" htmlFor="collection-description">
          <textarea
            id="collection-description"
            className={styles.textarea}
            value={draft.description}
            onChange={(e) => setDraft((current) => ({ ...current, description: e.target.value }))}
          />
        </FormField>

        <div className={styles.row}>
          <FormField label="Tempo padrão por painel (s)" htmlFor="collection-timer">
            <input
              id="collection-timer"
              type="number"
              min={1}
              className={styles.input}
              value={draft.timerSeconds}
              onChange={(e) =>
                setDraft((current) => ({ ...current, timerSeconds: Number(e.target.value) || 1 }))
              }
            />
          </FormField>

          <FormField label="Recarregar a cada N voltas" htmlFor="collection-refresh">
            <input
              id="collection-refresh"
              type="number"
              min={1}
              className={styles.input}
              value={draft.refreshEveryCycles}
              onChange={(e) =>
                setDraft((current) => ({
                  ...current,
                  refreshEveryCycles: Number(e.target.value) || 1,
                }))
              }
            />
          </FormField>
        </div>

        <div className={styles.panelsSection}>
          <div className={styles.panelsHeader}>
            <h2 className={styles.panelsTitle}>Painéis da coleção</h2>
            <button
              type="button"
              className={styles.secondaryButton}
              onClick={addPanel}
              disabled={availablePanels.length === 0}
            >
              Adicionar painel
            </button>
          </div>

          {draft.panels.length === 0 ? (
            <p className={styles.empty}>Nenhum painel adicionado ainda.</p>
          ) : (
            <ul className={styles.panelsList}>
              {draft.panels.map((ref, index) => (
                <li key={index} className={styles.panelRow}>
                  <div className={styles.panelOrder}>
                    <button
                      type="button"
                      className={styles.orderButton}
                      onClick={() => movePanel(index, -1)}
                      disabled={index === 0}
                      aria-label="Mover para cima"
                    >
                      ↑
                    </button>
                    <button
                      type="button"
                      className={styles.orderButton}
                      onClick={() => movePanel(index, 1)}
                      disabled={index === draft.panels.length - 1}
                      aria-label="Mover para baixo"
                    >
                      ↓
                    </button>
                  </div>

                  <select
                    className={styles.select}
                    value={ref.panelId}
                    onChange={(e) => updatePanel(index, { panelId: e.target.value })}
                  >
                    {availablePanels.map(({ config }) => (
                      <option key={config.id} value={config.id}>
                        {config.title}
                      </option>
                    ))}
                  </select>

                  <input
                    type="number"
                    min={1}
                    className={styles.timerOverride}
                    placeholder={`${draft.timerSeconds}s`}
                    value={ref.timerSeconds ?? ""}
                    onChange={(e) =>
                      updatePanel(index, {
                        timerSeconds: e.target.value ? Number(e.target.value) : undefined,
                      })
                    }
                  />

                  <button
                    type="button"
                    className={`${styles.linkButton} ${styles.danger}`}
                    onClick={() => removePanel(index)}
                  >
                    Remover
                  </button>

                  {warnings.get(`panels.${index}.panelId`) && (
                    <p className={styles.warning} role="status">
                      {warnings.get(`panels.${index}.panelId`)}
                    </p>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className={styles.actions}>
          <Link to="/admin/colecoes" className={styles.secondaryButton}>
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

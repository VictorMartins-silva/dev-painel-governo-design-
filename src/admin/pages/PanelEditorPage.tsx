import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useBlocker, useNavigate, useParams } from "react-router-dom";
import { Breadcrumb } from "../../components/layout/Breadcrumb";
import { PageHeader } from "../../components/layout/PageHeader";
import { parsePanelConfig, type PanelConfig } from "../../config/schemas/panel.schema";
import { panelStore } from "../store/PanelStore";
import { settingsStore } from "../store/SettingsStore";
import { validateEmbedUrl } from "../../domain/embedUrl";
import { downloadPanelConfig } from "../store/exportImport";
import { createEmptyPanelDraft } from "../editor/panelDraft";
import { buildFieldErrors } from "../editor/validation";
import { ValidationDisplayProvider } from "../editor/ValidationDisplayContext";
import { PanelForm } from "../editor/PanelForm";
import styles from "./PanelEditorPage.module.css";

function sortKeys(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(sortKeys);
  if (value !== null && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value as Record<string, unknown>)
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([key, entry]) => [key, sortKeys(entry)]),
    );
  }
  return value;
}

function isSameDraft(a: PanelConfig, b: PanelConfig): boolean {
  return JSON.stringify(sortKeys(a)) === JSON.stringify(sortKeys(b));
}

export default function PanelEditorPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isNew = id === undefined;
  const existing = isNew ? undefined : panelStore.get(id);

  if (!isNew && !existing) {
    return (
      <div>
        <Breadcrumb
          items={[{ label: "Painéis", href: "/admin/paineis" }, { label: "Painel não encontrado" }]}
        />
        <PageHeader
          title="Painel não encontrado"
          description={`Não existe um painel com o id "${id}".`}
        />
        <Link to="/admin/paineis" className={styles.backLink}>
          ← Voltar para a lista de painéis
        </Link>
      </div>
    );
  }

  return <PanelEditor existing={existing} isNew={isNew} navigate={navigate} />;
}

type PanelEditorProps = {
  existing?: PanelConfig;
  isNew: boolean;
  navigate: ReturnType<typeof useNavigate>;
};

function PanelEditor({ existing, isNew, navigate }: PanelEditorProps) {
  const [draft, setDraft] = useState<PanelConfig>(existing ?? createEmptyPanelDraft());
  const draftRef = useRef(draft);
  draftRef.current = draft;
  const savedDraftRef = useRef(draft);
  const [submitAttempted, setSubmitAttempted] = useState(false);

  const settings = useMemo(() => settingsStore.get(), []);

  const result = useMemo(() => parsePanelConfig(draft), [draft]);
  const errors = useMemo(() => buildFieldErrors(result), [result]);

  const idConflict = isNew && draft.id.trim() !== "" && panelStore.get(draft.id) !== undefined;
  // A allowlist vale para todo provider — o EmbedPanelView recusa qualquer domínio fora dela.
  // Validar só um provider aqui deixaria salvar um painel que falha silenciosamente ao renderizar.
  const urlValidation = draft.embed.url
    ? validateEmbedUrl(draft.embed.url, settings.allowedEmbedDomains)
    : null;
  const canSave = result.success && !idConflict && (!urlValidation || urlValidation.ok);
  const isDirty = !isSameDraft(draft, savedDraftRef.current);

  const blocker = useBlocker(({ currentLocation, nextLocation }) => {
    if (currentLocation.pathname === nextLocation.pathname) return false;
    return !isSameDraft(draftRef.current, savedDraftRef.current);
  });

  useEffect(() => {
    if (blocker.state !== "blocked") return;
    const confirmed = window.confirm(
      "Sair sem salvar? As alterações feitas neste painel serão perdidas.",
    );
    if (confirmed) {
      blocker.proceed();
    } else {
      blocker.reset();
    }
  }, [blocker]);

  useEffect(() => {
    function handleBeforeUnload(event: BeforeUnloadEvent) {
      if (!isDirty) return;
      event.preventDefault();
      event.returnValue = "";
    }
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [isDirty]);

  function handleSave() {
    if (!canSave || !result.success) {
      setSubmitAttempted(true);
      return;
    }
    const saved = panelStore.save(result.data);
    savedDraftRef.current = saved;
    navigate("/admin/paineis");
  }

  return (
    <div>
      <Breadcrumb
        items={[
          { label: "Painéis", href: "/admin/paineis" },
          { label: draft.title || (isNew ? "Novo painel" : "Editar painel") },
        ]}
      />
      <PageHeader
        title={draft.title || "Novo painel"}
        description="Painel incorporado via Power BI: metadados de catálogo + mecanismo de embed. Sem seções nem componentes — quem monta a visualização é o próprio relatório publicado no Power BI."
        actions={
          <div className={styles.headerActions}>
            {existing && (
              <button
                type="button"
                className={styles.secondaryButton}
                onClick={() => downloadPanelConfig(existing)}
              >
                Exportar original
              </button>
            )}
            <button type="button" className={styles.primaryButton} onClick={handleSave}>
              Salvar
            </button>
          </div>
        }
      />

      {submitAttempted && !result.success && (
        <div className={styles.validationSummary} role="alert">
          <p>Corrija os campos destacados abaixo para salvar:</p>
          <ul>
            {result.error.issues.map((issue, index) => (
              <li key={index}>
                {issue.path.join(".") || "config"}: {issue.message}
              </li>
            ))}
          </ul>
        </div>
      )}

      {idConflict && (
        <p className={styles.validationSummary} role="alert">
          Já existe um painel com o id &quot;{draft.id}&quot;. Escolha outro id.
        </p>
      )}

      <ValidationDisplayProvider forceShow={submitAttempted}>
        <PanelForm
          draft={draft}
          errors={errors}
          allowedEmbedDomains={settings.allowedEmbedDomains}
          idEditable={isNew}
          onChange={setDraft}
        />
      </ValidationDisplayProvider>

      <Link to="/admin/paineis" className={styles.backLink}>
        ← Voltar para a lista de painéis
      </Link>
    </div>
  );
}

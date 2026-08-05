import { useCallback, useEffect, useMemo, useReducer, useRef, useState } from "react";
import { Link, useBlocker, useNavigate, useParams, useSearchParams } from "react-router-dom";
import { Breadcrumb } from "../../components/layout/Breadcrumb";
import { PageHeader } from "../../components/layout/PageHeader";
import {
  parsePanelConfig,
  type ExternalPanelConfig,
  type NativePanelConfig,
  type PanelKind,
} from "../../config/schemas/panel.schema";
import { panelStore } from "../store/PanelStore";
import { settingsStore } from "../store/SettingsStore";
import { validateEmbedUrl } from "../../domain/embedUrl";
import { downloadPanelConfig } from "../store/exportImport";
import { createEditorState, editorReducer } from "../editor/editorReducer";
import { createEmptyExternalPanelDraft } from "../editor/externalPanelDraft";
import { buildFieldErrors } from "../editor/validation";
import { buildCatalogWarnings } from "../editor/catalogWarnings";
import { useIndicatorList } from "../../data/hooks/useIndicatorList";
import { PanelMetadataForm } from "../editor/PanelMetadataForm";
import { FiltersForm } from "../editor/FiltersForm";
import { SectionsForm } from "../editor/SectionsForm";
import { ExternalPanelForm } from "../editor/ExternalPanelForm";
import { EditorPreview } from "../editor/EditorPreview";
import { usePreviewChannel, type PreviewChannelMessage } from "../editor/usePreviewChannel";
import styles from "./PanelEditorPage.module.css";

const DRAFT_SYNC_DEBOUNCE_MS = 300;

type PreviewMode = "inline" | "collapsed" | "detached";

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

function isSameDraft<T>(a: T, b: T): boolean {
  return JSON.stringify(sortKeys(a)) === JSON.stringify(sortKeys(b));
}

export default function PanelEditorPage() {
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const isNew = id === undefined;
  const existing = isNew ? undefined : panelStore.get(id);

  if (!isNew && !existing) {
    return (
      <div>
        <Breadcrumb
          items={[
            { label: "Início", href: "/" },
            { label: "Admin", href: "/admin" },
            { label: "Painel não encontrado" },
          ]}
        />
        <PageHeader
          title="Painel não encontrado"
          description={`Não existe um painel com o id "${id}".`}
        />
        <Link to="/admin" className={styles.backLink}>
          ← Voltar para a lista de painéis
        </Link>
      </div>
    );
  }

  const kind: PanelKind =
    existing?.kind ?? (searchParams.get("kind") === "external" ? "external" : "native");

  if (kind === "external") {
    return (
      <ExternalPanelEditor existing={existing as ExternalPanelConfig | undefined} isNew={isNew} />
    );
  }

  return <NativePanelEditor existing={existing as NativePanelConfig | undefined} isNew={isNew} />;
}

type NativePanelEditorProps = {
  existing?: NativePanelConfig;
  isNew: boolean;
};

function NativePanelEditor({ existing, isNew }: NativePanelEditorProps) {
  const navigate = useNavigate();

  const [state, dispatch] = useReducer(editorReducer, existing, createEditorState);
  const draftRef = useRef(state.draft);
  draftRef.current = state.draft;
  const savedDraftRef = useRef(state.draft);

  const [previewMode, setPreviewMode] = useState<PreviewMode>("inline");
  const postMessageRef = useRef<((message: PreviewChannelMessage) => void) | null>(null);

  const handleChannelMessage = useCallback((message: PreviewChannelMessage) => {
    if (message.type === "ready") {
      postMessageRef.current?.({ type: "draft", draft: draftRef.current });
    } else if (message.type === "preview-closed") {
      setPreviewMode("inline");
    }
  }, []);

  const { postMessage, isSupported: canDetach } = usePreviewChannel({
    onMessage: handleChannelMessage,
  });
  postMessageRef.current = postMessage;

  useEffect(() => {
    if (previewMode !== "detached") return;
    const timer = window.setTimeout(() => {
      postMessage({ type: "draft", draft: state.draft });
    }, DRAFT_SYNC_DEBOUNCE_MS);
    return () => window.clearTimeout(timer);
  }, [state.draft, previewMode, postMessage]);

  function handleDetach() {
    if (!canDetach) return;
    window.open("/admin/preview", "pg-preview");
    setPreviewMode("detached");
  }

  const result = useMemo(() => parsePanelConfig(state.draft), [state.draft]);
  const errors = useMemo(() => buildFieldErrors(result), [result]);

  const indicatorsState = useIndicatorList();
  const warnings = useMemo(
    () =>
      buildCatalogWarnings(
        state.draft,
        indicatorsState.status === "success" ? indicatorsState.data : [],
      ),
    [state.draft, indicatorsState],
  );

  const idConflict =
    isNew && state.draft.id.trim() !== "" && panelStore.get(state.draft.id) !== undefined;
  const canSave = result.success && !idConflict;
  const isDirty = !isSameDraft(state.draft, savedDraftRef.current);

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
    if (!result.success || idConflict) return;
    const saved = panelStore.save(result.data);
    savedDraftRef.current = saved as NativePanelConfig;
    navigate("/admin");
  }

  return (
    <div>
      <Breadcrumb
        items={[
          { label: "Início", href: "/" },
          { label: "Admin", href: "/admin" },
          { label: state.draft.title || (isNew ? "Novo painel" : "Editar painel") },
        ]}
      />
      <PageHeader
        title={state.draft.title || "Novo painel"}
        description="Edite metadados, filtros, seções e os componentes de cada painel, incluindo o indicador de dados."
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
            <button
              type="button"
              className={styles.primaryButton}
              onClick={handleSave}
              disabled={!canSave}
            >
              Salvar
            </button>
          </div>
        }
      />

      {!result.success && (
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
          Já existe um painel com o id &quot;{state.draft.id}&quot;. Escolha outro id.
        </p>
      )}

      {warnings.size > 0 && (
        <p className={styles.warningSummary} role="status">
          {warnings.size} aviso{warnings.size === 1 ? "" : "s"} de catálogo — não impede salvar nem
          publicar.
        </p>
      )}

      <div className={styles.formLayout} data-preview={previewMode}>
        <div className={styles.formColumn}>
          <PanelMetadataForm
            draft={state.draft}
            errors={errors}
            dispatch={dispatch}
            idEditable={isNew}
          />
          <FiltersForm filters={state.draft.filters} errors={errors} dispatch={dispatch} />
          <SectionsForm
            sections={state.draft.sections}
            errors={errors}
            warnings={warnings}
            dispatch={dispatch}
          />
        </div>
        {previewMode === "inline" ? (
          <EditorPreview
            draft={state.draft}
            onCollapse={() => setPreviewMode("collapsed")}
            onDetach={canDetach ? handleDetach : undefined}
          />
        ) : (
          <div className={styles.previewBar}>
            <span className={styles.previewBarLabel}>
              {previewMode === "detached" ? "Preview aberto em outra aba" : "Preview recolhido"}
            </span>
            <div className={styles.previewBarActions}>
              <button
                type="button"
                className={styles.secondaryButton}
                onClick={() => setPreviewMode("inline")}
              >
                Mostrar preview
              </button>
              {canDetach && previewMode === "collapsed" && (
                <button type="button" className={styles.secondaryButton} onClick={handleDetach}>
                  Abrir em nova aba
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      <Link to="/admin" className={styles.backLink}>
        ← Voltar para a lista de painéis
      </Link>
    </div>
  );
}

type ExternalPanelEditorProps = {
  existing?: ExternalPanelConfig;
  isNew: boolean;
};

function ExternalPanelEditor({ existing, isNew }: ExternalPanelEditorProps) {
  const navigate = useNavigate();

  const [draft, setDraft] = useState<ExternalPanelConfig>(
    existing ?? createEmptyExternalPanelDraft(),
  );
  const draftRef = useRef(draft);
  draftRef.current = draft;
  const savedDraftRef = useRef(draft);

  const settings = useMemo(() => settingsStore.get(), []);

  const result = useMemo(() => parsePanelConfig(draft), [draft]);
  const errors = useMemo(() => buildFieldErrors(result), [result]);

  const idConflict = isNew && draft.id.trim() !== "" && panelStore.get(draft.id) !== undefined;
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
    if (!canSave || !result.success) return;
    const saved = panelStore.save(result.data);
    savedDraftRef.current = saved as ExternalPanelConfig;
    navigate("/admin");
  }

  return (
    <div>
      <Breadcrumb
        items={[
          { label: "Início", href: "/" },
          { label: "Admin", href: "/admin" },
          { label: draft.title || (isNew ? "Novo painel externo" : "Editar painel externo") },
        ]}
      />
      <PageHeader
        title={draft.title || "Novo painel externo"}
        description="Painel externo incorporado via iframe (Power BI — opção Publicar na Web). Sem seções nem filtros: os filtros do relatório publicado não se aplicam aqui."
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
            <button
              type="button"
              className={styles.primaryButton}
              onClick={handleSave}
              disabled={!canSave}
            >
              Salvar
            </button>
          </div>
        }
      />

      {!result.success && (
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

      <ExternalPanelForm
        draft={draft}
        errors={errors}
        allowedEmbedDomains={settings.allowedEmbedDomains}
        idEditable={isNew}
        onChange={setDraft}
      />

      <Link to="/admin" className={styles.backLink}>
        ← Voltar para a lista de painéis
      </Link>
    </div>
  );
}

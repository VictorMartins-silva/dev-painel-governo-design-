import { useEffect, useMemo, useReducer, useRef } from "react";
import { Link, useBlocker, useNavigate, useParams } from "react-router-dom";
import { Breadcrumb } from "../../components/layout/Breadcrumb";
import { PageHeader } from "../../components/layout/PageHeader";
import { parsePanelConfig, type PanelConfig } from "../../config/schemas/panel.schema";
import { panelStore } from "../store/PanelStore";
import { downloadPanelConfig } from "../store/exportImport";
import { createEditorState, editorReducer } from "../editor/editorReducer";
import { buildFieldErrors } from "../editor/validation";
import { PanelMetadataForm } from "../editor/PanelMetadataForm";
import { FiltersForm } from "../editor/FiltersForm";
import { SectionsForm } from "../editor/SectionsForm";
import { EditorPreview } from "../editor/EditorPreview";
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

  const [state, dispatch] = useReducer(editorReducer, existing, createEditorState);
  const draftRef = useRef(state.draft);
  draftRef.current = state.draft;
  const savedDraftRef = useRef(state.draft);

  const result = useMemo(() => parsePanelConfig(state.draft), [state.draft]);
  const errors = useMemo(() => buildFieldErrors(result), [result]);

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

  function handleSave() {
    if (!result.success || idConflict) return;
    const saved = panelStore.save(result.data);
    savedDraftRef.current = saved;
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

      <div className={styles.formLayout}>
        <div className={styles.formColumn}>
          <PanelMetadataForm
            draft={state.draft}
            errors={errors}
            dispatch={dispatch}
            idEditable={isNew}
          />
          <FiltersForm filters={state.draft.filters} errors={errors} dispatch={dispatch} />
          <SectionsForm sections={state.draft.sections} errors={errors} dispatch={dispatch} />
        </div>
        <EditorPreview draft={state.draft} />
      </div>

      <Link to="/admin" className={styles.backLink}>
        ← Voltar para a lista de painéis
      </Link>
    </div>
  );
}

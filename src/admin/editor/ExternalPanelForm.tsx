import type { ExternalPanelConfig } from "../../config/schemas/panel.schema";
import { validateEmbedUrl } from "../../domain/embedUrl";
import { FormField } from "./FormField";
import styles from "./PanelMetadataForm.module.css";
import formStyles from "./ExternalPanelForm.module.css";

type ExternalPanelFormProps = {
  draft: ExternalPanelConfig;
  errors: Map<string, string>;
  allowedEmbedDomains: string[];
  idEditable: boolean;
  onChange: (draft: ExternalPanelConfig) => void;
};

/** Formulário simplificado do painel externo: metadados + URL de embed, sem seções/filtros. */
export function ExternalPanelForm({
  draft,
  errors,
  allowedEmbedDomains,
  idEditable,
  onChange,
}: ExternalPanelFormProps) {
  const urlValidation = draft.embed.url
    ? validateEmbedUrl(draft.embed.url, allowedEmbedDomains)
    : null;
  const urlError =
    errors.get("embed.url") ??
    (urlValidation && !urlValidation.ok ? urlValidation.reason : undefined);

  return (
    <div className={styles.block}>
      <div className={styles.grid}>
        <FormField label="Id (slug)" htmlFor="external-panel-id" error={errors.get("id")}>
          <input
            id="external-panel-id"
            className={styles.input}
            value={draft.id}
            disabled={!idEditable}
            onChange={(event) => onChange({ ...draft, id: event.target.value })}
          />
        </FormField>

        <FormField
          label="Título do painel"
          htmlFor="external-panel-title"
          error={errors.get("title")}
        >
          <input
            id="external-panel-title"
            className={styles.input}
            value={draft.title}
            onChange={(event) => onChange({ ...draft, title: event.target.value })}
          />
        </FormField>

        <FormField
          label="Descrição"
          htmlFor="external-panel-description"
          error={errors.get("description")}
        >
          <textarea
            id="external-panel-description"
            className={styles.textarea}
            value={draft.description}
            onChange={(event) => onChange({ ...draft, description: event.target.value })}
          />
        </FormField>

        <FormField label="Tema" htmlFor="external-panel-theme" error={errors.get("theme")}>
          <input
            id="external-panel-theme"
            className={styles.input}
            value={draft.theme}
            onChange={(event) => onChange({ ...draft, theme: event.target.value })}
          />
        </FormField>

        <FormField label="Tags (separadas por vírgula)" htmlFor="external-panel-tags">
          <input
            id="external-panel-tags"
            className={styles.input}
            value={draft.tags.join(", ")}
            onChange={(event) =>
              onChange({
                ...draft,
                tags: event.target.value
                  .split(",")
                  .map((tag) => tag.trim())
                  .filter(Boolean),
              })
            }
          />
        </FormField>

        <FormField
          label="Fonte"
          htmlFor="external-panel-source"
          error={errors.get("metadata.source")}
        >
          <input
            id="external-panel-source"
            className={styles.input}
            value={draft.metadata.source}
            onChange={(event) =>
              onChange({ ...draft, metadata: { ...draft.metadata, source: event.target.value } })
            }
          />
        </FormField>

        <FormField
          label="Responsável"
          htmlFor="external-panel-owner"
          error={errors.get("metadata.owner")}
        >
          <input
            id="external-panel-owner"
            className={styles.input}
            value={draft.metadata.owner}
            onChange={(event) =>
              onChange({ ...draft, metadata: { ...draft.metadata, owner: event.target.value } })
            }
          />
        </FormField>

        <FormField label="Nota metodológica" htmlFor="external-panel-methodology-note">
          <textarea
            id="external-panel-methodology-note"
            className={styles.textarea}
            value={draft.metadata.methodologyNote ?? ""}
            onChange={(event) =>
              onChange({
                ...draft,
                metadata: { ...draft.metadata, methodologyNote: event.target.value },
              })
            }
          />
        </FormField>

        <FormField
          label="URL de incorporação (Power BI — Publicar na web)"
          htmlFor="external-panel-url"
          error={urlError}
        >
          <input
            id="external-panel-url"
            type="url"
            className={styles.input}
            placeholder="https://app.powerbi.com/view?r=..."
            value={draft.embed.url}
            onChange={(event) =>
              onChange({ ...draft, embed: { ...draft.embed, url: event.target.value } })
            }
          />
        </FormField>
      </div>

      {draft.embed.url && !urlError && (
        <div className={formStyles.previewBlock}>
          <span className={formStyles.previewLabel}>Pré-visualização</span>
          <iframe
            className={formStyles.previewFrame}
            src={draft.embed.url}
            title={`Pré-visualização: ${draft.title || draft.id || "painel externo"}`}
            loading="lazy"
            sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
          />
        </div>
      )}
    </div>
  );
}

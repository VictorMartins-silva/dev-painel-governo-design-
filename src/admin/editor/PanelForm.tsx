import { useEffect, useRef, useState } from "react";
import type { EmbedProvider, PanelConfig } from "../../config/schemas/panel.schema";
import { validateEmbedUrl } from "../../domain/embedUrl";
import { EmbedPanelView } from "../../renderer/EmbedPanelView";
import { FormField } from "./FormField";
import styles from "./PanelForm.module.css";

type PanelFormProps = {
  draft: PanelConfig;
  errors: Map<string, string>;
  allowedEmbedDomains: string[];
  idEditable: boolean;
  onChange: (draft: PanelConfig) => void;
};

const PROVIDER_LABEL: Record<EmbedProvider, string> = {
  "powerbi-public": "Publicar na Web (público, sem login)",
  "powerbi-secure": "Secure Embed (exige login no Power BI, respeita RLS/OLS)",
};

const PROVIDER_URL_HINT: Record<EmbedProvider, string> = {
  "powerbi-public": "Gerada em Arquivo → Publicar na Web, no Power BI Desktop ou Service.",
  "powerbi-secure":
    "Gerada em Arquivo → Incorporar relatório → Site ou portal. Quem abrir precisa estar " +
    "autenticado no Power BI do tenant; no kiosk, isso depende do navegador da apresentação já " +
    "ter uma sessão Power BI logada.",
};

/** Formulário único de painel: metadados + provider e URL de embed. Sem seções nem filtros —
 *  todo painel é um relatório Power BI incorporado por iframe, público ou autenticado. */
export function PanelForm({
  draft,
  errors,
  allowedEmbedDomains,
  idEditable,
  onChange,
}: PanelFormProps) {
  const [tagsText, setTagsText] = useState(() => draft.tags.join(", "));
  const lastEmittedTags = useRef(draft.tags);

  useEffect(() => {
    if (draft.tags !== lastEmittedTags.current) {
      lastEmittedTags.current = draft.tags;
      setTagsText(draft.tags.join(", "));
    }
  }, [draft.tags]);

  const handleTagsChange = (value: string) => {
    setTagsText(value);
    const parsed = value
      .split(",")
      .map((tag) => tag.trim())
      .filter(Boolean);
    lastEmittedTags.current = parsed;
    onChange({ ...draft, tags: parsed });
  };

  const urlValidation = draft.embed.url
    ? validateEmbedUrl(draft.embed.url, allowedEmbedDomains)
    : null;
  const urlError =
    errors.get("embed.url") ??
    (urlValidation && !urlValidation.ok ? urlValidation.reason : undefined);
  const canPreview = Boolean(draft.embed.url) && !urlError;

  return (
    <div className={styles.block}>
      <div className={styles.grid}>
        <FormField
          label="Id (slug)"
          htmlFor="panel-id"
          hint="Identificador único usado na URL, ex.: saude-atencao-basica"
          error={errors.get("id")}
        >
          <input
            id="panel-id"
            className={styles.input}
            value={draft.id}
            disabled={!idEditable}
            onChange={(event) => onChange({ ...draft, id: event.target.value })}
          />
        </FormField>

        <FormField
          label="Título do painel"
          htmlFor="panel-title"
          hint="Nome exibido no catálogo e no cabeçalho do painel"
          error={errors.get("title")}
        >
          <input
            id="panel-title"
            className={styles.input}
            value={draft.title}
            onChange={(event) => onChange({ ...draft, title: event.target.value })}
          />
        </FormField>

        <FormField
          label="Descrição"
          htmlFor="panel-description"
          hint="Resumo curto do que este painel mostra"
          error={errors.get("description")}
        >
          <textarea
            id="panel-description"
            className={styles.textarea}
            value={draft.description}
            onChange={(event) => onChange({ ...draft, description: event.target.value })}
          />
        </FormField>

        <FormField
          label="Tema"
          htmlFor="panel-theme"
          hint="Categoria usada para agrupar e filtrar painéis no catálogo"
          error={errors.get("theme")}
        >
          <input
            id="panel-theme"
            className={styles.input}
            value={draft.theme}
            onChange={(event) => onChange({ ...draft, theme: event.target.value })}
          />
        </FormField>

        <FormField label="Tags (separadas por vírgula)" htmlFor="panel-tags">
          <input
            id="panel-tags"
            className={styles.input}
            value={tagsText}
            onChange={(event) => handleTagsChange(event.target.value)}
          />
        </FormField>

        <FormField
          label="Fonte"
          htmlFor="panel-source"
          hint="Origem oficial dos dados, ex.: nome do sistema ou secretaria"
          error={errors.get("metadata.source")}
        >
          <input
            id="panel-source"
            className={styles.input}
            value={draft.metadata.source}
            onChange={(event) =>
              onChange({ ...draft, metadata: { ...draft.metadata, source: event.target.value } })
            }
          />
        </FormField>

        <FormField
          label="Responsável"
          htmlFor="panel-owner"
          hint="Área ou pessoa responsável por manter estes dados"
          error={errors.get("metadata.owner")}
        >
          <input
            id="panel-owner"
            className={styles.input}
            value={draft.metadata.owner}
            onChange={(event) =>
              onChange({ ...draft, metadata: { ...draft.metadata, owner: event.target.value } })
            }
          />
        </FormField>

        <FormField label="Nota metodológica" htmlFor="panel-methodology-note">
          <textarea
            id="panel-methodology-note"
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
      </div>

      <fieldset className={styles.providerGroup}>
        <legend>Mecanismo de embed</legend>
        {(Object.keys(PROVIDER_LABEL) as EmbedProvider[]).map((provider) => (
          <label key={provider} className={styles.providerOption}>
            <input
              type="radio"
              name="embed-provider"
              value={provider}
              checked={draft.embed.provider === provider}
              onChange={() => onChange({ ...draft, embed: { ...draft.embed, provider } })}
            />
            {PROVIDER_LABEL[provider]}
          </label>
        ))}
      </fieldset>

      <div className={styles.providerFields}>
        <FormField
          label="URL de incorporação"
          htmlFor="panel-embed-url"
          hint={PROVIDER_URL_HINT[draft.embed.provider]}
          error={urlError}
        >
          <input
            id="panel-embed-url"
            type="url"
            className={styles.input}
            placeholder="https://app.powerbi.com/..."
            value={draft.embed.url}
            onChange={(event) =>
              onChange({ ...draft, embed: { ...draft.embed, url: event.target.value } })
            }
          />
        </FormField>
      </div>

      {canPreview && (
        <div className={styles.previewBlock}>
          <span className={styles.previewLabel}>Pré-visualização</span>
          <div className={styles.previewFrame}>
            <EmbedPanelView panel={draft} />
          </div>
        </div>
      )}
    </div>
  );
}

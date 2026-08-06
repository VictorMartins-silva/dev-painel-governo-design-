import { useEffect, useRef, useState, type Dispatch } from "react";
import type { NativePanelConfig } from "../../config/schemas/panel.schema";
import type { EditorAction } from "./editorReducer";
import { FormField } from "./FormField";
import styles from "./PanelMetadataForm.module.css";

type PanelMetadataFormProps = {
  draft: NativePanelConfig;
  errors: Map<string, string>;
  dispatch: Dispatch<EditorAction>;
  idEditable: boolean;
};

export function PanelMetadataForm({ draft, errors, dispatch, idEditable }: PanelMetadataFormProps) {
  const [tagsText, setTagsText] = useState(() => draft.tags.join(", "));
  const lastDispatchedTags = useRef(draft.tags);

  useEffect(() => {
    if (draft.tags !== lastDispatchedTags.current) {
      lastDispatchedTags.current = draft.tags;
      setTagsText(draft.tags.join(", "));
    }
  }, [draft.tags]);

  const handleTagsChange = (value: string) => {
    setTagsText(value);
    const parsed = value
      .split(",")
      .map((tag) => tag.trim())
      .filter(Boolean);
    lastDispatchedTags.current = parsed;
    dispatch({ kind: "set-tags", value: parsed });
  };

  return (
    <details open className={styles.block}>
      <summary className={styles.summary}>Metadados</summary>
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
            onChange={(event) =>
              dispatch({ kind: "set-field", field: "id", value: event.target.value })
            }
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
            onChange={(event) =>
              dispatch({ kind: "set-field", field: "title", value: event.target.value })
            }
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
            onChange={(event) =>
              dispatch({ kind: "set-field", field: "description", value: event.target.value })
            }
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
            onChange={(event) =>
              dispatch({ kind: "set-field", field: "theme", value: event.target.value })
            }
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
              dispatch({ kind: "set-metadata-field", field: "source", value: event.target.value })
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
              dispatch({ kind: "set-metadata-field", field: "owner", value: event.target.value })
            }
          />
        </FormField>

        <FormField label="Nota metodológica" htmlFor="panel-methodology-note">
          <textarea
            id="panel-methodology-note"
            className={styles.textarea}
            value={draft.metadata.methodologyNote ?? ""}
            onChange={(event) =>
              dispatch({
                kind: "set-metadata-field",
                field: "methodologyNote",
                value: event.target.value,
              })
            }
          />
        </FormField>
      </div>
    </details>
  );
}

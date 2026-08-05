import type { Dispatch } from "react";
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
  return (
    <details open className={styles.block}>
      <summary className={styles.summary}>Metadados</summary>
      <div className={styles.grid}>
        <FormField label="Id (slug)" htmlFor="panel-id" error={errors.get("id")}>
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

        <FormField label="Título do painel" htmlFor="panel-title" error={errors.get("title")}>
          <input
            id="panel-title"
            className={styles.input}
            value={draft.title}
            onChange={(event) =>
              dispatch({ kind: "set-field", field: "title", value: event.target.value })
            }
          />
        </FormField>

        <FormField label="Descrição" htmlFor="panel-description" error={errors.get("description")}>
          <textarea
            id="panel-description"
            className={styles.textarea}
            value={draft.description}
            onChange={(event) =>
              dispatch({ kind: "set-field", field: "description", value: event.target.value })
            }
          />
        </FormField>

        <FormField label="Tema" htmlFor="panel-theme" error={errors.get("theme")}>
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
            value={draft.tags.join(", ")}
            onChange={(event) =>
              dispatch({
                kind: "set-tags",
                value: event.target.value
                  .split(",")
                  .map((tag) => tag.trim())
                  .filter(Boolean),
              })
            }
          />
        </FormField>

        <FormField label="Fonte" htmlFor="panel-source" error={errors.get("metadata.source")}>
          <input
            id="panel-source"
            className={styles.input}
            value={draft.metadata.source}
            onChange={(event) =>
              dispatch({ kind: "set-metadata-field", field: "source", value: event.target.value })
            }
          />
        </FormField>

        <FormField label="Responsável" htmlFor="panel-owner" error={errors.get("metadata.owner")}>
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

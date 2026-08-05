import { useEffect, useState } from "react";
import type { PanelConfig } from "../../config/schemas/panel.schema";
import { ConfigRenderer } from "../../renderer/ConfigRenderer";
import styles from "./EditorPreview.module.css";

const DEBOUNCE_MS = 300;

type EditorPreviewProps = {
  draft: PanelConfig;
  onCollapse?: () => void;
  onDetach?: () => void;
};

export function EditorPreview({ draft, onCollapse, onDetach }: EditorPreviewProps) {
  const [debounced, setDebounced] = useState(draft);

  useEffect(() => {
    const timer = window.setTimeout(() => setDebounced(draft), DEBOUNCE_MS);
    return () => window.clearTimeout(timer);
  }, [draft]);

  return (
    <div className={styles.preview}>
      <div className={styles.header}>
        <h2 className={styles.heading}>Preview ao vivo</h2>
        {debounced !== draft && <span className={styles.pending}>Atualizando…</span>}
        <div className={styles.headerActions}>
          {onDetach && (
            <button type="button" className={styles.headerButton} onClick={onDetach}>
              Abrir em nova aba
            </button>
          )}
          {onCollapse && (
            <button type="button" className={styles.headerButton} onClick={onCollapse}>
              Recolher
            </button>
          )}
        </div>
      </div>
      <div className={styles.frame}>
        <ConfigRenderer panelId={debounced.id || "preview"} config={debounced} />
      </div>
    </div>
  );
}

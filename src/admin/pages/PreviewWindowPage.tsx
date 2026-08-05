import { useCallback, useEffect, useState } from "react";
import type { NativePanelConfig } from "../../config/schemas/panel.schema";
import { ConfigRenderer } from "../../renderer/ConfigRenderer";
import { usePreviewChannel, type PreviewChannelMessage } from "../editor/usePreviewChannel";
import styles from "./PreviewWindowPage.module.css";

export default function PreviewWindowPage() {
  const [draft, setDraft] = useState<NativePanelConfig | null>(null);

  const handleMessage = useCallback((message: PreviewChannelMessage) => {
    if (message.type === "draft") setDraft(message.draft);
  }, []);

  const { postMessage, isSupported } = usePreviewChannel({ onMessage: handleMessage });

  useEffect(() => {
    postMessage({ type: "ready" });
  }, [postMessage]);

  useEffect(() => {
    function notifyClosed() {
      postMessage({ type: "preview-closed" });
    }
    window.addEventListener("pagehide", notifyClosed);
    return () => window.removeEventListener("pagehide", notifyClosed);
  }, [postMessage]);

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <span className={styles.badge}>Preview</span>
        <h1 className={styles.title}>{draft?.title || "Aguardando editor…"}</h1>
      </header>
      <div className={styles.frame}>
        {draft ? (
          <ConfigRenderer panelId={draft.id || "preview"} config={draft} />
        ) : (
          <p className={styles.empty}>
            {isSupported
              ? "Aguardando dados do editor…"
              : "Este navegador não suporta sincronização em tempo real (BroadcastChannel)."}
          </p>
        )}
      </div>
    </div>
  );
}

import { ErrorState } from "../components/feedback/ErrorState";
import { settingsStore } from "../admin/store/SettingsStore";
import { validateEmbedUrl } from "../domain/embedUrl";
import type { ExternalPanelConfig } from "../config/schemas/panel.schema";
import styles from "./EmbedPanelView.module.css";

type EmbedPanelViewProps = {
  panel: ExternalPanelConfig;
};

/** Renderização em página cheia de um painel externo (Power BI "Publicar na web") via iframe. */
export function EmbedPanelView({ panel }: EmbedPanelViewProps) {
  const { allowedEmbedDomains } = settingsStore.get();
  const validation = validateEmbedUrl(panel.embed.url, allowedEmbedDomains);

  if (!validation.ok) {
    return <ErrorState title="Painel externo indisponível" message={validation.reason} />;
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.toolbar}>
        <a href={panel.embed.url} target="_blank" rel="noreferrer" className={styles.openLink}>
          Abrir em nova aba
        </a>
      </div>
      <iframe
        className={styles.frame}
        src={panel.embed.url}
        title={panel.title}
        loading="lazy"
        sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
      />
    </div>
  );
}

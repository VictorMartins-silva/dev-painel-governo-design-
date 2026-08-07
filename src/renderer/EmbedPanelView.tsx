import { ErrorState } from "../components/feedback/ErrorState";
import { settingsStore } from "../admin/store/SettingsStore";
import { validateEmbedUrl } from "../domain/embedUrl";
import type { EmbedProvider, PanelConfig } from "../config/schemas/panel.schema";
import styles from "./EmbedPanelView.module.css";

type EmbedPanelViewProps = {
  panel: PanelConfig;
};

const PROVIDER_NOTE: Record<EmbedProvider, string | null> = {
  "powerbi-public": null,
  "powerbi-secure":
    "Requer login no Power BI do tenant — quem não estiver autenticado vê a tela de login da Microsoft dentro do quadro abaixo.",
};

/**
 * Renderização em página cheia de um painel Power BI via iframe — tanto "Publicar na Web"
 * (público) quanto "Secure Embed" (autenticado, respeita RLS/OLS) são, para a aplicação, só uma
 * URL validada contra a allowlist de domínios; quem autentica ou não é o próprio Power BI.
 */
export function EmbedPanelView({ panel }: EmbedPanelViewProps) {
  const { allowedEmbedDomains } = settingsStore.get();
  const validation = validateEmbedUrl(panel.embed.url, allowedEmbedDomains);

  if (!validation.ok) {
    return <ErrorState title="Painel indisponível" message={validation.reason} />;
  }

  const note = PROVIDER_NOTE[panel.embed.provider];

  return (
    <div className={styles.wrapper}>
      {note && (
        <p className={styles.note} role="status">
          {note}
        </p>
      )}
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

import type { CollectionConfig } from "../../config/schemas/collection.schema";
import type { PanelConfig } from "../../config/schemas/panel.schema";

/**
 * Avisos não bloqueantes sobre a composição de uma coleção — mesmo padrão de
 * catalogWarnings.ts: chaves de caminho reaproveitáveis em FormField, sem travar salvar.
 */
export function buildCollectionWarnings(
  config: CollectionConfig,
  resolvePanel: (panelId: string) => PanelConfig | undefined,
): Map<string, string> {
  const warnings = new Map<string, string>();

  config.panels.forEach((ref, index) => {
    const prefix = `panels.${index}.panelId`;
    const panel = resolvePanel(ref.panelId);

    if (!panel) {
      warnings.set(prefix, `Painel "${ref.panelId}" não existe mais no catálogo.`);
      return;
    }

    if (panel.kind === "native" && panel.presentation !== "kiosk") {
      warnings.set(
        prefix,
        `"${panel.title}" não tem uma versão de telão — pode ficar difícil de ler no telão.`,
      );
    }
  });

  return warnings;
}

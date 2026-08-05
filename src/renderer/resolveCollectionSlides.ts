import type { CollectionConfig } from "../config/schemas/collection.schema";
import type { PanelConfig } from "../config/schemas/panel.schema";

export type ResolvedKioskSlide = { panel: PanelConfig; timerSeconds: number };

/** Resolve os painéis de uma coleção, descartando silenciosamente referências quebradas. */
export function resolveCollectionSlides(
  collection: CollectionConfig,
  resolvePanel: (panelId: string) => PanelConfig | undefined,
): ResolvedKioskSlide[] {
  const slides: ResolvedKioskSlide[] = [];

  for (const ref of collection.panels) {
    const panel = resolvePanel(ref.panelId);
    if (!panel) continue;
    slides.push({ panel, timerSeconds: ref.timerSeconds ?? collection.timerSeconds });
  }

  return slides;
}

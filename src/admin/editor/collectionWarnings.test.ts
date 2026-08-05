import { describe, expect, it } from "vitest";
import type { CollectionConfig } from "../../config/schemas/collection.schema";
import type { NativePanelConfig } from "../../config/schemas/panel.schema";
import { buildCollectionWarnings } from "./collectionWarnings";

function buildPanel(overrides: Partial<NativePanelConfig> = {}): NativePanelConfig {
  return {
    schemaVersion: 1,
    kind: "native",
    id: "painel-teste",
    title: "Painel de teste",
    description: "Descrição.",
    theme: "Teste",
    tags: [],
    presentation: "default",
    metadata: { source: "fonte", owner: "equipe" },
    filters: [],
    sections: [
      {
        id: "secao",
        title: "Seção",
        layout: "grid-2",
        components: [
          { id: "c", type: "indicator-card", title: "Indicador", metric: "x", format: "integer" },
        ],
      },
    ],
    ...overrides,
  };
}

function buildCollection(overrides: Partial<CollectionConfig> = {}): CollectionConfig {
  return {
    schemaVersion: 1,
    id: "colecao",
    title: "Coleção",
    description: "Descrição.",
    timerSeconds: 45,
    refreshEveryCycles: 1,
    panels: [{ panelId: "painel-teste" }],
    ...overrides,
  };
}

describe("buildCollectionWarnings", () => {
  it("aponta painel referenciado que não existe mais", () => {
    const warnings = buildCollectionWarnings(buildCollection(), () => undefined);
    expect(warnings.get("panels.0.panelId")).toMatch(/não existe mais/);
  });

  it("aponta painel nativo sem versão de telão", () => {
    const panel = buildPanel();
    const warnings = buildCollectionWarnings(buildCollection(), () => panel);
    expect(warnings.get("panels.0.panelId")).toMatch(/versão de telão/);
  });

  it("não gera aviso para painel com presentation kiosk", () => {
    const panel = buildPanel({ presentation: "kiosk" });
    const warnings = buildCollectionWarnings(buildCollection(), () => panel);
    expect(warnings.size).toBe(0);
  });
});

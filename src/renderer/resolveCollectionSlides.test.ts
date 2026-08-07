import { describe, expect, it } from "vitest";
import type { CollectionConfig } from "../config/schemas/collection.schema";
import type { PanelConfig } from "../config/schemas/panel.schema";
import { resolveCollectionSlides } from "./resolveCollectionSlides";

function buildPanel(id: string): PanelConfig {
  return {
    schemaVersion: 3,
    id,
    title: id,
    description: "Descrição.",
    theme: "Teste",
    tags: [],
    presentation: "default",
    metadata: { source: "fonte", owner: "equipe" },
    embed: { provider: "powerbi-public", url: "https://app.powerbi.com/view?r=abc" },
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
    panels: [{ panelId: "a" }, { panelId: "b", timerSeconds: 10 }],
    ...overrides,
  };
}

describe("resolveCollectionSlides", () => {
  it("usa o timerSeconds da coleção quando o painel não tem override", () => {
    const panels = { a: buildPanel("a"), b: buildPanel("b") };
    const slides = resolveCollectionSlides(buildCollection(), (id) => panels[id as "a" | "b"]);

    expect(slides).toHaveLength(2);
    expect(slides[0].timerSeconds).toBe(45);
    expect(slides[1].timerSeconds).toBe(10);
  });

  it("descarta silenciosamente painéis que não existem mais", () => {
    const slides = resolveCollectionSlides(buildCollection(), (id) =>
      id === "a" ? buildPanel("a") : undefined,
    );

    expect(slides).toHaveLength(1);
    expect(slides[0].panel.id).toBe("a");
  });
});

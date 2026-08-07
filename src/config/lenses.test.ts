import { describe, expect, it } from "vitest";
import type { PanelSummary } from "../data/provider";
import { allLenses, filterByLenses, lensFromConfig, lensValues } from "./lenses";
import type { LensConfig } from "./schemas/lens.schema";

function buildPanel(overrides: Partial<PanelSummary> = {}): PanelSummary {
  return {
    id: "painel-a",
    title: "Painel A",
    description: "",
    theme: "Tema A",
    tags: [],
    source: "",
    updatedAt: "—",
    embedProvider: "powerbi-public",
    ...overrides,
  };
}

function buildLensConfig(overrides: Partial<LensConfig> = {}): LensConfig {
  return {
    schemaVersion: 1,
    id: "prioridade-2026",
    label: "Prioridade 2026",
    description: "Painéis prioritários do plano de governo.",
    allLabel: "",
    panelIds: ["painel-a"],
    ...overrides,
  };
}

describe("lentes cadastradas (lensFromConfig / allLenses / filterByLenses)", () => {
  it("lensValues só conta os painéis membros da lente custom", () => {
    const panels = [buildPanel(), buildPanel({ id: "painel-b", title: "Painel B" })];
    const lens = lensFromConfig(buildLensConfig());

    expect(lensValues(lens, panels)).toEqual([{ value: "Prioridade 2026", count: 1 }]);
  });

  it("filterByLenses filtra pelo recorte de uma lente custom quando a lista completa é passada", () => {
    const panels = [buildPanel(), buildPanel({ id: "painel-b", title: "Painel B" })];
    const lenses = allLenses([buildLensConfig()]);

    const filtered = filterByLenses(panels, { "prioridade-2026": "Prioridade 2026" }, lenses);

    expect(filtered).toEqual([panels[0]]);
  });

  it("filterByLenses sem receber a lente custom ignora o filtro (regressão do catálogo não filtrado)", () => {
    const panels = [buildPanel(), buildPanel({ id: "painel-b", title: "Painel B" })];

    // Chamada sem o 3º argumento (só as lentes estáticas) não deve filtrar por uma lente
    // desconhecida — quem consome (CatalogPage) precisa sempre passar allLenses(lensStore.list()).
    const filtered = filterByLenses(panels, { "prioridade-2026": "Prioridade 2026" });

    expect(filtered).toHaveLength(2);
  });
});

import { describe, expect, it } from "vitest";
import { buildCatalogWarnings } from "./catalogWarnings";
import type { NativePanelConfig } from "../../config/schemas/panel.schema";
import type { IndicatorCatalogEntry } from "../../config/schemas/indicator.schema";

function buildIndicator(overrides: Partial<IndicatorCatalogEntry>): IndicatorCatalogEntry {
  return {
    id: "saldo_empregos",
    name: "Saldo de empregos",
    unit: "vínculos",
    source: "CAGED",
    definition: "Definição.",
    periodicity: "Mensal",
    granularity: "Município",
    owner: "Equipe",
    updatedAt: "2026-07-15",
    shapes: ["metric"],
    dimensions: [],
    datasets: [],
    tags: [],
    ...overrides,
  };
}

function buildPanel(
  components: NativePanelConfig["sections"][number]["components"],
): NativePanelConfig {
  return {
    schemaVersion: 1,
    kind: "native",
    id: "painel",
    title: "Painel",
    description: "Descrição",
    theme: "Tema",
    tags: [],
    metadata: { source: "Fonte", owner: "Equipe" },
    presentation: "default",
    filters: [],
    sections: [{ id: "secao", title: "Seção", layout: "grid-2", components }],
  };
}

describe("buildCatalogWarnings", () => {
  it("não gera avisos quando o metric aponta para um indicador compatível no catálogo", () => {
    const catalog = [buildIndicator({})];
    const panel = buildPanel([
      { id: "c", type: "indicator-card", title: "C", metric: "saldo_empregos", format: "integer" },
    ]);

    expect(buildCatalogWarnings(panel, catalog).size).toBe(0);
  });

  it("avisa quando o metric não existe no catálogo", () => {
    const panel = buildPanel([
      { id: "c", type: "indicator-card", title: "C", metric: "inexistente", format: "integer" },
    ]);

    const warnings = buildCatalogWarnings(panel, []);

    expect(warnings.get("sections.0.components.0.metric")).toMatch(/fora do catálogo/);
  });

  it("avisa quando o indicador não oferece a forma exigida pelo componente", () => {
    const catalog = [buildIndicator({ shapes: ["table"] })];
    const panel = buildPanel([
      { id: "c", type: "indicator-card", title: "C", metric: "saldo_empregos", format: "integer" },
    ]);

    const warnings = buildCatalogWarnings(panel, catalog);

    expect(warnings.get("sections.0.components.0.metric")).toMatch(/não oferece dado/);
  });

  it("avisa quando a dimensão do bar-chart não é oferecida pelo indicador", () => {
    const catalog = [buildIndicator({ shapes: ["categorical"], dimensions: ["sexo"] })];
    const panel = buildPanel([
      {
        id: "c",
        type: "bar-chart",
        title: "C",
        metric: "saldo_empregos",
        dimension: "setor",
        orientation: "vertical",
        sort: "none",
      },
    ]);

    const warnings = buildCatalogWarnings(panel, catalog);

    expect(warnings.get("sections.0.components.0.dimension")).toMatch(/não é oferecida/);
  });

  it("avisa quando o dataset de uma tabela não existe no catálogo", () => {
    const panel = buildPanel([
      {
        id: "c",
        type: "data-table",
        title: "C",
        dataset: "inexistente",
        columns: [{ field: "a", label: "A", type: "text" }],
      },
    ]);

    const warnings = buildCatalogWarnings(panel, []);

    expect(warnings.get("sections.0.components.0.dataset")).toMatch(/fora do catálogo/);
  });

  it("ignora componentes sem metric/dataset preenchido", () => {
    const panel = buildPanel([
      { id: "c", type: "indicator-card", title: "C", metric: "", format: "integer" },
    ]);

    expect(buildCatalogWarnings(panel, []).size).toBe(0);
  });
});

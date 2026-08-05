import { describe, expect, it } from "vitest";
import { buildIndicatorUsage } from "./indicatorUsage";
import type { PanelConfig } from "./schemas/panel.schema";
import type { IndicatorCatalogEntry } from "./schemas/indicator.schema";

function buildIndicator(overrides: Partial<IndicatorCatalogEntry>): IndicatorCatalogEntry {
  return {
    id: "indicador",
    name: "Indicador",
    unit: "unidade",
    source: "Fonte",
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

function buildPanel(overrides: Partial<PanelConfig>): PanelConfig {
  return {
    schemaVersion: 1,
    id: "painel",
    title: "Painel",
    description: "Descrição",
    theme: "Tema",
    tags: [],
    metadata: { source: "Fonte", owner: "Equipe" },
    filters: [],
    sections: [
      {
        id: "secao",
        title: "Seção",
        layout: "grid-2",
        components: [
          {
            id: "comp",
            type: "indicator-card",
            title: "Componente",
            metric: "saldo_empregos",
            format: "integer",
          },
        ],
      },
    ],
    ...overrides,
  };
}

describe("buildIndicatorUsage", () => {
  it("associa componentes de metric/dataset ao indicador do catálogo", () => {
    const catalog = [buildIndicator({ id: "saldo_empregos", name: "Saldo de empregos" })];
    const panel = buildPanel({});

    const usage = buildIndicatorUsage([panel], catalog);

    const entries = usage.usageByIndicatorId.get("saldo_empregos");
    expect(entries).toHaveLength(1);
    expect(entries?.[0]).toMatchObject({
      panelId: "painel",
      sectionTitle: "Seção",
      componentType: "indicator-card",
    });
    expect(usage.orphans).toHaveLength(0);
    expect(usage.dangling).toHaveLength(0);
  });

  it("casa componentes data-table pelo dataset, não pelo id do indicador", () => {
    const catalog = [
      buildIndicator({
        id: "populacao_por_territorio",
        shapes: ["table"],
        datasets: ["populacao_por_territorio_dataset"],
      }),
    ];
    const panel = buildPanel({
      sections: [
        {
          id: "secao",
          title: "Seção",
          layout: "grid-2",
          components: [
            {
              id: "tabela",
              type: "data-table",
              title: "Tabela",
              dataset: "populacao_por_territorio_dataset",
              columns: [{ field: "a", label: "A", type: "text" }],
            },
          ],
        },
      ],
    });

    const usage = buildIndicatorUsage([panel], catalog);

    expect(usage.usageByIndicatorId.get("populacao_por_territorio")).toHaveLength(1);
    expect(usage.dangling).toHaveLength(0);
  });

  it("marca indicadores do catálogo sem nenhum painel como órfãos", () => {
    const catalog = [
      buildIndicator({ id: "usado" }),
      buildIndicator({ id: "orfao", name: "Órfão" }),
    ];
    const panel = buildPanel({
      sections: [
        {
          id: "secao",
          title: "Seção",
          layout: "grid-2",
          components: [
            { id: "c", type: "indicator-card", title: "C", metric: "usado", format: "integer" },
          ],
        },
      ],
    });

    const usage = buildIndicatorUsage([panel], catalog);

    expect(usage.orphans.map((entry) => entry.id)).toEqual(["orfao"]);
  });

  it("marca referências de painel sem indicador correspondente como quebradas", () => {
    const catalog: IndicatorCatalogEntry[] = [];
    const panel = buildPanel({
      sections: [
        {
          id: "secao",
          title: "Seção",
          layout: "grid-2",
          components: [
            {
              id: "c",
              type: "indicator-card",
              title: "C",
              metric: "inexistente",
              format: "integer",
            },
          ],
        },
      ],
    });

    const usage = buildIndicatorUsage([panel], catalog);

    expect(usage.dangling).toHaveLength(1);
    expect(usage.dangling[0]).toMatchObject({ reference: "inexistente", panelId: "painel" });
  });
});

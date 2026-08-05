import { describe, expect, it } from "vitest";
import { parsePanelConfig } from "./panel.schema";

function buildValidPanel() {
  return {
    schemaVersion: 1,
    id: "trabalho-emprego",
    title: "Trabalho e Emprego",
    description: "Indicadores do mercado formal de trabalho no município.",
    theme: "Desenvolvimento Econômico",
    tags: ["emprego", "caged"],
    metadata: {
      source: "CAGED / Ministério do Trabalho",
      owner: "Equipe de Serviços",
    },
    filters: [{ id: "ano", type: "single-select", label: "Ano", dataField: "ano" }],
    sections: [
      {
        id: "resumo",
        title: "Resumo",
        layout: "grid-4",
        components: [
          {
            id: "saldo",
            type: "indicator-card",
            title: "Saldo de empregos",
            metric: "saldo_empregos",
            format: "integer",
          },
        ],
      },
    ],
  };
}

describe("panelConfigSchema", () => {
  it("aceita uma configuração de painel completa e válida", () => {
    const result = parsePanelConfig(buildValidPanel());
    expect(result.success).toBe(true);
  });

  it("rejeita schemaVersion não suportada", () => {
    const invalid = { ...buildValidPanel(), schemaVersion: 2 };
    const result = parsePanelConfig(invalid);
    expect(result.success).toBe(false);
  });

  it("rejeita componente com type desconhecido dentro de uma seção", () => {
    const invalid = buildValidPanel();
    invalid.sections[0].components[0] = {
      id: "mapa",
      type: "heatmap",
      title: "Mapa",
    } as never;
    const result = parsePanelConfig(invalid);
    expect(result.success).toBe(false);
  });

  it("rejeita filtro sem dataField", () => {
    const invalid = buildValidPanel();
    invalid.filters[0] = { id: "ano", type: "single-select", label: "Ano" } as never;
    const result = parsePanelConfig(invalid);
    expect(result.success).toBe(false);
  });

  it("rejeita layout de seção fora dos presets permitidos", () => {
    const invalid = buildValidPanel();
    invalid.sections[0].layout = "grid-livre";
    const result = parsePanelConfig(invalid);
    expect(result.success).toBe(false);
  });

  it("mensagens de erro incluem o caminho do campo inválido", () => {
    const invalid = { ...buildValidPanel(), schemaVersion: 2 };
    const result = parsePanelConfig(invalid);
    if (!result.success) {
      expect(result.error.issues[0].path).toContain("schemaVersion");
    }
  });
});

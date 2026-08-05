import { describe, expect, it } from "vitest";
import type { NativePanelConfig } from "../../config/schemas/panel.schema";
import { readPanelConfigFile, serializePanelConfig } from "./exportImport";

function buildPanel(overrides: Partial<NativePanelConfig> = {}): NativePanelConfig {
  return {
    schemaVersion: 1,
    kind: "native",
    id: "painel-teste",
    title: "Painel de teste",
    description: "Descrição do painel de teste.",
    theme: "Teste",
    tags: [],
    metadata: {
      source: "fonte de teste",
      owner: "Equipe de Testes",
    },
    presentation: "default",
    filters: [],
    sections: [
      {
        id: "secao",
        title: "Seção",
        layout: "grid-2",
        components: [
          {
            id: "card",
            type: "indicator-card",
            title: "Indicador",
            metric: "populacao_total",
            format: "integer",
          },
        ],
      },
    ],
    ...overrides,
  };
}

function jsonFile(content: string): File {
  return new File([content], "painel.json", { type: "application/json" });
}

describe("serializePanelConfig", () => {
  it("produz um JSON legível que reidrata para a mesma config", () => {
    const config = buildPanel();
    const serialized = serializePanelConfig(config);
    expect(JSON.parse(serialized)).toEqual(config);
  });
});

describe("readPanelConfigFile", () => {
  it("aceita um arquivo com uma configuração válida", async () => {
    const config = buildPanel();
    const result = await readPanelConfigFile(jsonFile(serializePanelConfig(config)));

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.config).toEqual(config);
    }
  });

  it("rejeita um arquivo que não é JSON", async () => {
    const result = await readPanelConfigFile(jsonFile("não é json"));

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error).toMatch(/JSON válido/);
    }
  });

  it("rejeita um JSON que não passa no schema do painel", async () => {
    const invalid = { ...buildPanel(), title: "" };
    const result = await readPanelConfigFile(jsonFile(JSON.stringify(invalid)));

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error).toMatch(/Configuração inválida/);
    }
  });
});

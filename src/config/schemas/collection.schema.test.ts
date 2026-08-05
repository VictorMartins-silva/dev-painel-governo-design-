import { describe, expect, it } from "vitest";
import { parseCollectionConfig } from "./collection.schema";

function buildInput(overrides: Record<string, unknown> = {}) {
  return {
    schemaVersion: 1,
    id: "colecao-teste",
    title: "Coleção de teste",
    description: "Descrição da coleção de teste.",
    timerSeconds: 30,
    refreshEveryCycles: 2,
    panels: [{ panelId: "demografia" }, { panelId: "trabalho-emprego", timerSeconds: 60 }],
    ...overrides,
  };
}

describe("collectionConfigSchema", () => {
  it("aceita uma configuração válida", () => {
    const result = parseCollectionConfig(buildInput());
    expect(result.success).toBe(true);
  });

  it("aplica os valores padrão de timerSeconds e refreshEveryCycles quando ausentes", () => {
    const input = buildInput();
    delete (input as Record<string, unknown>).timerSeconds;
    delete (input as Record<string, unknown>).refreshEveryCycles;

    const result = parseCollectionConfig(input);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.timerSeconds).toBe(45);
      expect(result.data.refreshEveryCycles).toBe(1);
    }
  });

  it("rejeita coleção sem nenhum painel", () => {
    const result = parseCollectionConfig(buildInput({ panels: [] }));
    expect(result.success).toBe(false);
  });

  it("rejeita timerSeconds não positivo", () => {
    const result = parseCollectionConfig(buildInput({ timerSeconds: 0 }));
    expect(result.success).toBe(false);
  });
});

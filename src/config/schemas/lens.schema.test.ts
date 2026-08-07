import { describe, expect, it } from "vitest";
import { parseLensConfig } from "./lens.schema";

function buildInput(overrides: Record<string, unknown> = {}) {
  return {
    schemaVersion: 1,
    id: "prioridade-2026",
    label: "Prioridade 2026",
    description: "Painéis que sustentam as metas do plano de governo 2026.",
    allLabel: "",
    panelIds: ["demografia", "trabalho-emprego"],
    ...overrides,
  };
}

describe("lensConfigSchema", () => {
  it("aceita uma configuração válida", () => {
    const result = parseLensConfig(buildInput());
    expect(result.success).toBe(true);
  });

  it("rejeita lente sem nenhum painel selecionado", () => {
    const result = parseLensConfig(buildInput({ panelIds: [] }));
    expect(result.success).toBe(false);
  });

  it("rejeita id reservado por uma lente estática", () => {
    const result = parseLensConfig(buildInput({ id: "tema" }));
    expect(result.success).toBe(false);
  });

  it("aplica string vazia como padrão de allLabel quando ausente", () => {
    const input = buildInput();
    delete (input as Record<string, unknown>).allLabel;

    const result = parseLensConfig(input);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.allLabel).toBe("");
    }
  });
});

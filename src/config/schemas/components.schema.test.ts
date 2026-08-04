import { describe, expect, it } from "vitest";
import { componentConfigSchema } from "./components.schema";

describe("componentConfigSchema", () => {
  it("aceita um indicator-card válido", () => {
    const result = componentConfigSchema.safeParse({
      id: "saldo",
      type: "indicator-card",
      title: "Saldo de empregos",
      metric: "saldo_empregos",
      format: "integer",
      comparison: "previous-period",
    });
    expect(result.success).toBe(true);
  });

  it("aceita um data-table válido com colunas", () => {
    const result = componentConfigSchema.safeParse({
      id: "tab-atividade",
      type: "data-table",
      title: "Vínculos por atividade",
      dataset: "vinculos_por_atividade",
      columns: [
        { field: "atividade", label: "Atividade", type: "text" },
        { field: "vinculos", label: "Vínculos", type: "integer" },
      ],
      limit: 15,
    });
    expect(result.success).toBe(true);
  });

  it("rejeita indicator-card sem format", () => {
    const result = componentConfigSchema.safeParse({
      id: "saldo",
      type: "indicator-card",
      title: "Saldo de empregos",
      metric: "saldo_empregos",
    });
    expect(result.success).toBe(false);
  });

  it("rejeita type desconhecido", () => {
    const result = componentConfigSchema.safeParse({
      id: "mapa",
      type: "heatmap",
      title: "Mapa de calor",
    });
    expect(result.success).toBe(false);
  });

  it("rejeita data-table sem colunas", () => {
    const result = componentConfigSchema.safeParse({
      id: "tab-vazia",
      type: "data-table",
      title: "Tabela vazia",
      dataset: "algum_dataset",
      columns: [],
    });
    expect(result.success).toBe(false);
  });
});

import { describe, expect, it } from "vitest";
import { formatValue } from "./format";

describe("formatValue", () => {
  it("formata inteiros com separador de milhar pt-BR", () => {
    expect(formatValue(2450, "integer")).toBe("2.450");
  });

  it("formata decimais com vírgula", () => {
    expect(formatValue(12.5, "decimal")).toBe("12,5");
  });

  it("formata percentuais a partir de uma fração", () => {
    expect(formatValue(0.032, "percent")).toBe("3,2%");
  });

  it("formata moeda em BRL", () => {
    expect(formatValue(1500, "currency")).toContain("R$");
  });

  it("formata datas no padrão pt-BR", () => {
    expect(formatValue("2025-12-01", "date")).toBe("01/12/2025");
  });

  it("retorna o texto original para o tipo text", () => {
    expect(formatValue("Comércio", "text")).toBe("Comércio");
  });

  it("retorna travessão para valores nulos", () => {
    expect(formatValue(null, "integer")).toBe("—");
  });

  it("retorna o valor original quando não é numérico e o tipo é numérico", () => {
    expect(formatValue("abc", "integer")).toBe("abc");
  });
});

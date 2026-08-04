import { describe, expect, it } from "vitest";
import { MockDataProvider } from "./MockDataProvider";

const provider = new MockDataProvider({ simulateLatency: false });

describe("MockDataProvider", () => {
  it("carrega metadados do indicador a partir dos fixtures", async () => {
    const metadata = await provider.getIndicatorMetadata("saldo_empregos");
    expect(metadata.name).toBe("Saldo de empregos");
    expect(metadata.unit).toBe("vínculos");
  });

  it("rejeita metadados de um indicador inexistente", async () => {
    await expect(provider.getIndicatorMetadata("indicador_inexistente")).rejects.toThrow();
  });

  it("carrega opções de filtro a partir dos fixtures", async () => {
    const options = await provider.getFilterOptions("trabalho-emprego", "ano");
    expect(options).toEqual([
      { value: "2024", label: "2024" },
      { value: "2025", label: "2025" },
    ]);
  });

  it("retorna lista vazia para opções de filtro inexistentes", async () => {
    const options = await provider.getFilterOptions("painel-inexistente", "campo-inexistente");
    expect(options).toEqual([]);
  });

  it("soma linhas de mesmo período ao aplicar getIndicator (populacao_total tem 8 linhas por período)", async () => {
    const total = await provider.getIndicator({ metric: "populacao_total", filters: {} });
    const masculino = await provider.getIndicator({
      metric: "populacao_total",
      filters: { sexo: ["masculino"] },
    });
    const feminino = await provider.getIndicator({
      metric: "populacao_total",
      filters: { sexo: ["feminino"] },
    });

    expect(total.data.value).not.toBeNull();
    expect((masculino.data.value ?? 0) + (feminino.data.value ?? 0)).toBe(total.data.value);
  });

  it("soma linhas de mesmo período ao aplicar getTimeSeries, sem duplicar pontos por período", async () => {
    const series = await provider.getTimeSeries({ metric: "populacao_total", filters: {} });
    const periods = series.data.map((point) => point.period);
    expect(new Set(periods).size).toBe(periods.length);
  });
});

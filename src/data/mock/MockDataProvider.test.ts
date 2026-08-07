import { describe, expect, it } from "vitest";
import { MockDataProvider } from "./MockDataProvider";

const provider = new MockDataProvider({ simulateLatency: false });

describe("MockDataProvider", () => {
  it("lista os painéis registrados com metadados do catálogo", async () => {
    const panels = await provider.listPanels();

    expect(panels.length).toBeGreaterThan(0);
    const demografia = panels.find((panel) => panel.id === "demografia");
    expect(demografia?.embedProvider).toBe("powerbi-public");
    expect(demografia?.updatedAt).toBe("2026-07-15");
  });

  it("carrega a config de um painel existente", async () => {
    const config = await provider.getPanelConfig("trabalho-emprego");
    expect(config.title).toBe("Trabalho e Emprego");
    expect(config.embed.provider).toBe("powerbi-public");
  });

  it("rejeita a config de um painel inexistente", async () => {
    await expect(provider.getPanelConfig("painel-inexistente")).rejects.toThrow();
  });

  it("carrega o frescor de um painel a partir dos fixtures", async () => {
    const freshness = await provider.getPanelFreshness("demografia");
    expect(freshness).toEqual({
      referencePeriod: "jan/2024 – dez/2025",
      updatedAt: "2026-07-15",
    });
  });

  it("retorna frescor vazio para um painel sem fixture", async () => {
    const freshness = await provider.getPanelFreshness("painel-inexistente");
    expect(freshness).toEqual({});
  });
});

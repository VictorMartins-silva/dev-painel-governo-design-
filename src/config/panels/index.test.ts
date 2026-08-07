import { describe, expect, it } from "vitest";
import { panelConfigSchema } from "../schemas/panel.schema";
import { panelRegistry, findPanelConfig } from "./index";
import { catalogoOsascoPanels } from "./catalogo-osasco.generated";

describe("panelRegistry", () => {
  it("reúne o catálogo importado da planilha e os dois painéis-exemplo do protótipo", () => {
    const ids = panelRegistry.map((panel) => panel.id);

    expect(panelRegistry).toHaveLength(catalogoOsascoPanels.length + 2);
    expect(ids).toContain("demografia");
    expect(ids).toContain("trabalho-emprego");
  });

  it("cada painel registrado é válido segundo o schema Zod", () => {
    for (const panel of panelRegistry) {
      const result = panelConfigSchema.safeParse(panel);
      expect(result.success, `painel inválido: ${panel.id}`).toBe(true);
    }
  });

  it("não há ids repetidos — o id é a chave de rota em /paineis/:id", () => {
    const ids = panelRegistry.map((panel) => panel.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("todo painel tem uma URL de embed https absoluta", () => {
    for (const panel of panelRegistry) {
      expect(() => new URL(panel.embed.url), `URL inválida em ${panel.id}`).not.toThrow();
      expect(new URL(panel.embed.url).protocol, `URL não-https em ${panel.id}`).toBe("https:");
    }
  });

  it("findPanelConfig localiza um painel existente pelo id", () => {
    expect(findPanelConfig("demografia")?.title).toBe("Demografia");
  });

  it("findPanelConfig retorna undefined para um id inexistente", () => {
    expect(findPanelConfig("inexistente")).toBeUndefined();
  });
});

describe("catálogo importado de docs/catalogo_paineis_osasco.xlsx", () => {
  it("importa os 78 painéis da aba dash-panel", () => {
    expect(catalogoOsascoPanels).toHaveLength(78);
  });

  it("classifica o mecanismo de embed pela forma da URL", () => {
    for (const panel of catalogoOsascoPanels) {
      const { hostname, pathname } = new URL(panel.embed.url);
      const esperado =
        hostname !== "app.powerbi.com"
          ? "iframe-externo"
          : pathname === "/view"
            ? "powerbi-public"
            : "powerbi-secure";

      expect(panel.embed.provider, `provider errado em ${panel.id}`).toBe(esperado);
    }
  });

  it("não deixa passar token de Publicar na Web truncado", () => {
    // A planilha de origem trouxe uma célula cortada; o importador reconstrói a URL. Se a
    // reconstrução for removida, este teste falha antes de o painel quebrar em produção.
    const publicos = catalogoOsascoPanels.filter(
      (panel) => panel.embed.provider === "powerbi-public",
    );
    expect(publicos.length).toBeGreaterThan(0);

    for (const panel of publicos) {
      const token = new URL(panel.embed.url).searchParams.get("r") ?? "";
      const decodificado = atob(token);
      expect(() => JSON.parse(decodificado), `token truncado em ${panel.id}`).not.toThrow();
    }
  });
});

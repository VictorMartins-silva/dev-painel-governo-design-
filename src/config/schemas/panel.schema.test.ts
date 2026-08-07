import { describe, expect, it } from "vitest";
import { parsePanelConfig } from "./panel.schema";

function buildValidPublicPanel() {
  return {
    schemaVersion: 3,
    id: "trabalho-emprego",
    title: "Trabalho e Emprego",
    description: "Indicadores do mercado formal de trabalho no município.",
    theme: "Desenvolvimento Econômico",
    tags: ["emprego", "caged"],
    metadata: {
      source: "CAGED / Ministério do Trabalho",
      owner: "Equipe de Serviços",
    },
    embed: {
      provider: "powerbi-public",
      url: "https://app.powerbi.com/view?r=abc123",
    },
  };
}

function buildValidSecurePanel() {
  return {
    schemaVersion: 3,
    id: "trabalho-emprego",
    title: "Trabalho e Emprego",
    description: "Indicadores do mercado formal de trabalho no município.",
    theme: "Desenvolvimento Econômico",
    tags: ["emprego", "caged"],
    metadata: {
      source: "CAGED / Ministério do Trabalho",
      owner: "Equipe de Serviços",
    },
    embed: {
      provider: "powerbi-secure",
      url: "https://app.powerbi.com/reportEmbed?reportId=abc&ctid=def",
    },
  };
}

function buildValidExternalPanel() {
  return {
    ...buildValidPublicPanel(),
    id: "acessos-ao-sistema-ged",
    embed: {
      provider: "iframe-externo",
      url: "https://bi-gestaoeducacional.osasco.sp.gov.br/ged-bi/#/publico/dashboard-acessos",
    },
  };
}

describe("panelConfigSchema", () => {
  it("aceita um painel com embed iframe-externo (portal de BI da prefeitura)", () => {
    const result = parsePanelConfig(buildValidExternalPanel());
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.embed.provider).toBe("iframe-externo");
    }
  });

  it("rejeita um provider de embed desconhecido", () => {
    const invalid = buildValidPublicPanel();
    invalid.embed = { provider: "tableau", url: "https://exemplo.com/painel" };
    expect(parsePanelConfig(invalid).success).toBe(false);
  });

  it("aceita um painel com embed powerbi-public", () => {
    const result = parsePanelConfig(buildValidPublicPanel());
    expect(result.success).toBe(true);
  });

  it("aceita um painel com embed powerbi-secure", () => {
    const result = parsePanelConfig(buildValidSecurePanel());
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.embed.provider).toBe("powerbi-secure");
      expect(result.data.embed.url).toContain("reportEmbed");
    }
  });

  it("rejeita schemaVersion não suportada", () => {
    const invalid = { ...buildValidPublicPanel(), schemaVersion: 1 };
    const result = parsePanelConfig(invalid);
    expect(result.success).toBe(false);
  });

  it("mensagens de erro incluem o caminho do campo inválido", () => {
    const invalid = { ...buildValidPublicPanel(), schemaVersion: 1 };
    const result = parsePanelConfig(invalid);
    if (!result.success) {
      expect(result.error.issues[0].path).toContain("schemaVersion");
    }
  });

  it("rejeita um painel sem embed.url no provider powerbi-public", () => {
    const invalid = buildValidPublicPanel();
    invalid.embed = { provider: "powerbi-public", url: "" };
    const result = parsePanelConfig(invalid);
    expect(result.success).toBe(false);
  });

  it("rejeita um painel sem embed.url no provider powerbi-secure", () => {
    const invalid = buildValidSecurePanel();
    invalid.embed = { provider: "powerbi-secure", url: "" };
    const result = parsePanelConfig(invalid);
    expect(result.success).toBe(false);
  });

  it("rejeita um painel com provider de embed desconhecido", () => {
    const invalid = {
      ...buildValidPublicPanel(),
      embed: { provider: "outro", url: "https://x.com" },
    };
    const result = parsePanelConfig(invalid);
    expect(result.success).toBe(false);
  });
});

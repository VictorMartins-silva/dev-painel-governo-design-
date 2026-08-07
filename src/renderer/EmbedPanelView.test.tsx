import { beforeEach, describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { EmbedPanelView } from "./EmbedPanelView";
import type { PanelConfig } from "../config/schemas/panel.schema";

function buildPublicPanel(overrides: Partial<PanelConfig> = {}): PanelConfig {
  return {
    schemaVersion: 3,
    id: "painel-publico",
    title: "Painel público",
    description: "Descrição",
    theme: "Tema",
    tags: [],
    metadata: { source: "Power BI", owner: "Equipe" },
    presentation: "default",
    embed: { provider: "powerbi-public", url: "https://app.powerbi.com/view?r=abc123" },
    ...overrides,
  };
}

function buildSecurePanel(overrides: Partial<PanelConfig> = {}): PanelConfig {
  return {
    schemaVersion: 3,
    id: "painel-seguro",
    title: "Painel seguro",
    description: "Descrição",
    theme: "Tema",
    tags: [],
    metadata: { source: "Power BI", owner: "Equipe" },
    presentation: "default",
    embed: {
      provider: "powerbi-secure",
      url: "https://app.powerbi.com/reportEmbed?reportId=abc&ctid=def",
    },
    ...overrides,
  };
}

describe("EmbedPanelView — powerbi-public", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("renderiza o iframe com sandbox, título acessível e link para abrir em nova aba", () => {
    const panel = buildPublicPanel();
    render(<EmbedPanelView panel={panel} />);

    const iframe = screen.getByTitle("Painel público");
    expect(iframe.tagName).toBe("IFRAME");
    expect(iframe).toHaveAttribute("src", panel.embed.url);
    expect(iframe).toHaveAttribute(
      "sandbox",
      "allow-scripts allow-same-origin allow-popups allow-forms",
    );
    expect(iframe).toHaveAttribute("loading", "lazy");

    const link = screen.getByRole("link", { name: "Abrir em nova aba" });
    expect(link).toHaveAttribute("href", panel.embed.url);
    expect(link).toHaveAttribute("target", "_blank");
  });

  it("não mostra nenhum aviso de login", () => {
    render(<EmbedPanelView panel={buildPublicPanel()} />);
    expect(screen.queryByRole("status")).not.toBeInTheDocument();
  });

  it("mostra um ErrorState quando o domínio da URL não está na allowlist", () => {
    window.localStorage.setItem(
      "admin.settings",
      JSON.stringify({ allowedEmbedDomains: ["outro-dominio.com"] }),
    );
    const panel = buildPublicPanel();
    render(<EmbedPanelView panel={panel} />);

    expect(screen.getByRole("alert")).toBeInTheDocument();
    expect(screen.queryByTitle("Painel público")).not.toBeInTheDocument();
  });

  it("mostra um ErrorState quando a URL não usa https", () => {
    const panel = buildPublicPanel({
      embed: { provider: "powerbi-public", url: "http://app.powerbi.com/view?r=abc123" },
    });
    render(<EmbedPanelView panel={panel} />);

    expect(screen.getByRole("alert")).toBeInTheDocument();
  });
});

describe("EmbedPanelView — powerbi-secure", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("renderiza o iframe e o aviso de que exige login no Power BI", () => {
    const panel = buildSecurePanel();
    render(<EmbedPanelView panel={panel} />);

    const iframe = screen.getByTitle("Painel seguro");
    expect(iframe).toHaveAttribute("src", panel.embed.url);
    expect(screen.getByRole("status")).toHaveTextContent(/Requer login no Power BI/);
  });
});

import { beforeEach, describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { EmbedPanelView } from "./EmbedPanelView";
import type { ExternalPanelConfig } from "../config/schemas/panel.schema";

function buildExternalPanel(overrides: Partial<ExternalPanelConfig> = {}): ExternalPanelConfig {
  return {
    schemaVersion: 1,
    kind: "external",
    id: "painel-externo",
    title: "Painel externo",
    description: "Descrição",
    theme: "Tema",
    tags: [],
    metadata: { source: "Power BI", owner: "Equipe" },
    presentation: "default",
    embed: { provider: "powerbi-public", url: "https://app.powerbi.com/view?r=abc123" },
    ...overrides,
  };
}

describe("EmbedPanelView", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("renderiza o iframe com sandbox, título acessível e link para abrir em nova aba", () => {
    const panel = buildExternalPanel();
    render(<EmbedPanelView panel={panel} />);

    const iframe = screen.getByTitle("Painel externo");
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

  it("mostra um ErrorState quando o domínio da URL não está na allowlist", () => {
    window.localStorage.setItem(
      "admin.settings",
      JSON.stringify({ allowedEmbedDomains: ["outro-dominio.com"] }),
    );
    const panel = buildExternalPanel();
    render(<EmbedPanelView panel={panel} />);

    expect(screen.getByRole("alert")).toBeInTheDocument();
    expect(screen.queryByTitle("Painel externo")).not.toBeInTheDocument();
  });

  it("mostra um ErrorState quando a URL não usa https", () => {
    const panel = buildExternalPanel({
      embed: { provider: "powerbi-public", url: "http://app.powerbi.com/view?r=abc123" },
    });
    render(<EmbedPanelView panel={panel} />);

    expect(screen.getByRole("alert")).toBeInTheDocument();
  });
});

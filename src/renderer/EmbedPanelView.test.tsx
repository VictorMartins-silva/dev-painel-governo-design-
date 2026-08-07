import { beforeEach, describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { EmbedPanelView } from "./EmbedPanelView";
import type { PanelConfig } from "../config/schemas/panel.schema";
import {
  DEFAULT_ALLOWED_EMBED_DOMAINS,
  LocalStorageSettingsStore,
} from "../admin/store/SettingsStore";

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
    // Pelo store, e não escrevendo o localStorage à mão: um JSON cru sem `defaultsVersion` é
    // tratado como legado e dispara a migração, que devolveria app.powerbi.com à allowlist.
    const store = new LocalStorageSettingsStore();
    for (const domain of DEFAULT_ALLOWED_EMBED_DOMAINS) store.removeAllowedEmbedDomain(domain);
    store.addAllowedEmbedDomain("outro-dominio.com");

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

describe("EmbedPanelView — iframe-externo", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("renderiza um portal da prefeitura liberado por padrão, com aviso de origem externa", () => {
    const panel = buildPublicPanel({
      id: "acessos-ao-sistema-ged",
      title: "Acessos ao Sistema GED",
      embed: {
        provider: "iframe-externo",
        url: "https://bi-gestaoeducacional.osasco.sp.gov.br/ged-bi/#/publico/dashboard-acessos",
      },
    });

    render(<EmbedPanelView panel={panel} />);

    expect(screen.getByTitle("Acessos ao Sistema GED")).toHaveAttribute("src", panel.embed.url);
    expect(screen.getByRole("status")).toHaveTextContent(/portal da própria prefeitura/);
  });

  it("recusa um domínio externo fora da allowlist", () => {
    const panel = buildPublicPanel({
      embed: { provider: "iframe-externo", url: "https://dominio-nao-autorizado.com/painel" },
    });

    render(<EmbedPanelView panel={panel} />);

    expect(screen.queryByTitle("Painel público")).not.toBeInTheDocument();
    expect(screen.getByRole("alert")).toBeInTheDocument();
  });
});

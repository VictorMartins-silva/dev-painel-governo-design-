import { beforeEach, describe, expect, it } from "vitest";
import { panelRegistry } from "../../config/panels";
import type { PanelConfig } from "../../config/schemas/panel.schema";
import { LocalStoragePanelStore } from "./PanelStore";

function buildPanel(overrides: Partial<PanelConfig> = {}): PanelConfig {
  return {
    schemaVersion: 3,
    id: "painel-teste",
    title: "Painel de teste",
    description: "Descrição do painel de teste.",
    theme: "Teste",
    tags: [],
    metadata: {
      source: "fonte de teste",
      owner: "Equipe de Testes",
    },
    presentation: "default",
    embed: { provider: "powerbi-public", url: "https://app.powerbi.com/view?r=abc" },
    ...overrides,
  };
}

describe("LocalStoragePanelStore", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("lista os painéis estáticos do registry quando o overlay está vazio", () => {
    const store = new LocalStoragePanelStore();
    const list = store.list();

    expect(list).toHaveLength(panelRegistry.length);
    expect(list.every((entry) => entry.origin === "static")).toBe(true);
  });

  it("o painel salvo no overlay tem precedência sobre o estático de mesmo id", () => {
    const store = new LocalStoragePanelStore();
    const staticId = panelRegistry[0].id;
    const overriding = buildPanel({ id: staticId, title: "Título sobrescrito" });

    store.save(overriding);

    const fromGet = store.get(staticId);
    expect(fromGet?.title).toBe("Título sobrescrito");

    const entry = store.list().find((item) => item.config.id === staticId);
    expect(entry?.origin).toBe("modified");
  });

  it("um painel novo (sem contraparte estática) aparece com origin 'custom'", () => {
    const store = new LocalStoragePanelStore();
    const novo = buildPanel({ id: "painel-novo" });

    store.save(novo);

    const entry = store.list().find((item) => item.config.id === "painel-novo");
    expect(entry?.origin).toBe("custom");
    expect(store.get("painel-novo")).toEqual(novo);
  });

  it("restoreOriginal remove a sombra e volta a expor o painel estático", () => {
    const store = new LocalStoragePanelStore();
    const staticId = panelRegistry[0].id;
    const originalTitle = panelRegistry[0].title;

    store.save(buildPanel({ id: staticId, title: "Modificado" }));
    expect(store.get(staticId)?.title).toBe("Modificado");

    store.restoreOriginal(staticId);

    expect(store.get(staticId)?.title).toBe(originalTitle);
    const entry = store.list().find((item) => item.config.id === staticId);
    expect(entry?.origin).toBe("static");
  });

  it("restoreOriginal em um painel custom o remove por completo", () => {
    const store = new LocalStoragePanelStore();
    store.save(buildPanel({ id: "painel-novo" }));

    store.restoreOriginal("painel-novo");

    expect(store.get("painel-novo")).toBeUndefined();
    expect(store.list().some((item) => item.config.id === "painel-novo")).toBe(false);
  });

  it("rejeita a escrita de uma configuração inválida e não persiste nada", () => {
    const store = new LocalStoragePanelStore();
    const invalid = { ...buildPanel(), title: "" } as PanelConfig;

    expect(() => store.save(invalid)).toThrow();
    expect(store.get(invalid.id)).toBeUndefined();
  });
});

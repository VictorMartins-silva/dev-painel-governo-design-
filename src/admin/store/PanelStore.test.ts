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
  });

  it("o painel salvo no overlay tem precedência sobre o estático de mesmo id", () => {
    const store = new LocalStoragePanelStore();
    const staticId = panelRegistry[0].id;
    const overriding = buildPanel({ id: staticId, title: "Título sobrescrito" });

    store.save(overriding);

    const fromGet = store.get(staticId);
    expect(fromGet?.title).toBe("Título sobrescrito");

    const entry = store.list().find((item) => item.id === staticId);
    expect(entry?.title).toBe("Título sobrescrito");
  });

  it("um painel novo (sem contraparte estática) aparece na listagem", () => {
    const store = new LocalStoragePanelStore();
    const novo = buildPanel({ id: "painel-novo" });

    store.save(novo);

    const entry = store.list().find((item) => item.id === "painel-novo");
    expect(entry).toBeDefined();
    expect(store.get("painel-novo")).toEqual(novo);
  });

  it("remove um painel que veio do overlay, sem contraparte estática", () => {
    const store = new LocalStoragePanelStore();
    store.save(buildPanel({ id: "painel-novo" }));

    store.remove("painel-novo");

    expect(store.get("painel-novo")).toBeUndefined();
    expect(store.list().some((item) => item.id === "painel-novo")).toBe(false);
  });

  it("remove um painel estático do registry, mesmo sem edição prévia", () => {
    const store = new LocalStoragePanelStore();
    const staticId = panelRegistry[0].id;

    store.remove(staticId);

    expect(store.get(staticId)).toBeUndefined();
    expect(store.list().some((item) => item.id === staticId)).toBe(false);
  });

  it("salvar um painel novamente depois de removido volta a exibi-lo", () => {
    const store = new LocalStoragePanelStore();
    const staticId = panelRegistry[0].id;

    store.remove(staticId);
    expect(store.get(staticId)).toBeUndefined();

    store.save(buildPanel({ id: staticId, title: "Recriado" }));

    expect(store.get(staticId)?.title).toBe("Recriado");
    expect(store.list().some((item) => item.id === staticId)).toBe(true);
  });

  it("rejeita a escrita de uma configuração inválida e não persiste nada", () => {
    const store = new LocalStoragePanelStore();
    const invalid = { ...buildPanel(), title: "" } as PanelConfig;

    expect(() => store.save(invalid)).toThrow();
    expect(store.get(invalid.id)).toBeUndefined();
  });
});

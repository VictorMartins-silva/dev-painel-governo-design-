import { beforeEach, describe, expect, it } from "vitest";
import { collectionRegistry } from "../../config/collections";
import type { CollectionConfig } from "../../config/schemas/collection.schema";
import { LocalStorageCollectionStore } from "./CollectionStore";

function buildCollection(overrides: Partial<CollectionConfig> = {}): CollectionConfig {
  return {
    schemaVersion: 1,
    id: "colecao-teste",
    title: "Coleção de teste",
    description: "Descrição da coleção de teste.",
    timerSeconds: 45,
    refreshEveryCycles: 1,
    panels: [{ panelId: "demografia" }],
    ...overrides,
  };
}

describe("LocalStorageCollectionStore", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("lista as coleções estáticas do registry quando o overlay está vazio", () => {
    const store = new LocalStorageCollectionStore();
    const list = store.list();

    expect(list).toHaveLength(collectionRegistry.length);
  });

  it("a coleção salva no overlay tem precedência sobre a estática de mesmo id", () => {
    const store = new LocalStorageCollectionStore();
    const staticId = collectionRegistry[0].id;
    const overriding = buildCollection({ id: staticId, title: "Título sobrescrito" });

    store.save(overriding);

    expect(store.get(staticId)?.title).toBe("Título sobrescrito");
    const entry = store.list().find((item) => item.id === staticId);
    expect(entry?.title).toBe("Título sobrescrito");
  });

  it("uma coleção nova aparece na listagem", () => {
    const store = new LocalStorageCollectionStore();
    store.save(buildCollection({ id: "colecao-nova" }));

    const entry = store.list().find((item) => item.id === "colecao-nova");
    expect(entry).toBeDefined();
  });

  it("remove uma coleção que veio do overlay, sem contraparte estática", () => {
    const store = new LocalStorageCollectionStore();
    store.save(buildCollection({ id: "colecao-nova" }));

    store.remove("colecao-nova");

    expect(store.get("colecao-nova")).toBeUndefined();
  });

  it("remove uma coleção estática do registry, mesmo sem edição prévia", () => {
    const store = new LocalStorageCollectionStore();
    const staticId = collectionRegistry[0].id;

    store.remove(staticId);

    expect(store.get(staticId)).toBeUndefined();
    expect(store.list().some((item) => item.id === staticId)).toBe(false);
  });

  it("rejeita a escrita de uma configuração inválida e não persiste nada", () => {
    const store = new LocalStorageCollectionStore();
    const invalid = { ...buildCollection(), panels: [] } as CollectionConfig;

    expect(() => store.save(invalid)).toThrow();
    expect(store.get(invalid.id)).toBeUndefined();
  });
});

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
    expect(list.every((entry) => entry.origin === "static")).toBe(true);
  });

  it("a coleção salva no overlay tem precedência sobre a estática de mesmo id", () => {
    const store = new LocalStorageCollectionStore();
    const staticId = collectionRegistry[0].id;
    const overriding = buildCollection({ id: staticId, title: "Título sobrescrito" });

    store.save(overriding);

    expect(store.get(staticId)?.title).toBe("Título sobrescrito");
    const entry = store.list().find((item) => item.config.id === staticId);
    expect(entry?.origin).toBe("modified");
  });

  it("uma coleção nova aparece com origin 'custom'", () => {
    const store = new LocalStorageCollectionStore();
    store.save(buildCollection({ id: "colecao-nova" }));

    const entry = store.list().find((item) => item.config.id === "colecao-nova");
    expect(entry?.origin).toBe("custom");
  });

  it("restoreOriginal remove a sombra e volta a expor a coleção estática", () => {
    const store = new LocalStorageCollectionStore();
    const staticId = collectionRegistry[0].id;
    const originalTitle = collectionRegistry[0].title;

    store.save(buildCollection({ id: staticId, title: "Modificado" }));
    store.restoreOriginal(staticId);

    expect(store.get(staticId)?.title).toBe(originalTitle);
  });

  it("restoreOriginal em uma coleção custom a remove por completo", () => {
    const store = new LocalStorageCollectionStore();
    store.save(buildCollection({ id: "colecao-nova" }));

    store.restoreOriginal("colecao-nova");

    expect(store.get("colecao-nova")).toBeUndefined();
  });

  it("rejeita a escrita de uma configuração inválida e não persiste nada", () => {
    const store = new LocalStorageCollectionStore();
    const invalid = { ...buildCollection(), panels: [] } as CollectionConfig;

    expect(() => store.save(invalid)).toThrow();
    expect(store.get(invalid.id)).toBeUndefined();
  });
});

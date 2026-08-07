import { beforeEach, describe, expect, it } from "vitest";
import type { LensConfig } from "../../config/schemas/lens.schema";
import { LocalStorageLensStore } from "./LensStore";

function buildLens(overrides: Partial<LensConfig> = {}): LensConfig {
  return {
    schemaVersion: 1,
    id: "prioridade-2026",
    label: "Prioridade 2026",
    description: "Painéis que sustentam as metas do plano de governo 2026.",
    allLabel: "",
    panelIds: ["demografia"],
    ...overrides,
  };
}

describe("LocalStorageLensStore", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("não lista nada quando não há lentes salvas", () => {
    const store = new LocalStorageLensStore();
    expect(store.list()).toHaveLength(0);
  });

  it("salva e recupera uma lente pelo id", () => {
    const store = new LocalStorageLensStore();
    store.save(buildLens());

    expect(store.get("prioridade-2026")?.label).toBe("Prioridade 2026");
    expect(store.list()).toHaveLength(1);
  });

  it("sobrescreve uma lente existente ao salvar novamente com o mesmo id", () => {
    const store = new LocalStorageLensStore();
    store.save(buildLens());
    store.save(buildLens({ label: "Prioridade 2026 (revisado)" }));

    expect(store.list()).toHaveLength(1);
    expect(store.get("prioridade-2026")?.label).toBe("Prioridade 2026 (revisado)");
  });

  it("remove uma lente salva", () => {
    const store = new LocalStorageLensStore();
    store.save(buildLens());

    store.remove("prioridade-2026");

    expect(store.get("prioridade-2026")).toBeUndefined();
    expect(store.list()).toHaveLength(0);
  });

  it("rejeita a escrita de uma configuração inválida e não persiste nada", () => {
    const store = new LocalStorageLensStore();
    const invalid = { ...buildLens(), panelIds: [] } as LensConfig;

    expect(() => store.save(invalid)).toThrow();
    expect(store.get(invalid.id)).toBeUndefined();
  });
});

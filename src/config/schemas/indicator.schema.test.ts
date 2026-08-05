import { describe, expect, it } from "vitest";
import { parseIndicatorCatalog } from "./indicator.schema";

const fixtureModules = import.meta.glob("../../data/mock/datasets/indicators/*.json", {
  eager: true,
  import: "default",
}) as Record<string, unknown>;

function buildValidIndicator() {
  return {
    id: "saldo_empregos",
    name: "Saldo de empregos",
    unit: "vínculos",
    source: "CAGED (dados fictícios)",
    definition: "Diferença entre admissões e desligamentos.",
    periodicity: "Mensal",
    granularity: "Município",
    owner: "Equipe de Serviços",
    updatedAt: "2026-07-15",
    shapes: ["metric"],
  };
}

describe("parseIndicatorCatalog", () => {
  it("aceita um indicador válido, preenchendo defaults de arrays", () => {
    const { entries, invalid } = parseIndicatorCatalog([buildValidIndicator()]);
    expect(invalid).toHaveLength(0);
    expect(entries).toHaveLength(1);
    expect(entries[0].dimensions).toEqual([]);
    expect(entries[0].datasets).toEqual([]);
    expect(entries[0].tags).toEqual([]);
  });

  it("rejeita indicador sem campo de governança obrigatório, sem quebrar os demais", () => {
    const { entries, invalid } = parseIndicatorCatalog([
      buildValidIndicator(),
      { ...buildValidIndicator(), id: "sem_definicao", definition: undefined },
    ]);
    expect(entries).toHaveLength(1);
    expect(invalid).toHaveLength(1);
    expect(invalid[0].issues.length).toBeGreaterThan(0);
  });

  it("rejeita shapes vazio", () => {
    const { entries, invalid } = parseIndicatorCatalog([{ ...buildValidIndicator(), shapes: [] }]);
    expect(entries).toHaveLength(0);
    expect(invalid).toHaveLength(1);
  });

  it("todas as fixtures reais do catálogo parseiam sem erro", () => {
    const raw = Object.values(fixtureModules);
    const { entries, invalid } = parseIndicatorCatalog(raw);

    expect(invalid).toEqual([]);
    expect(entries).toHaveLength(raw.length);

    const ids = entries.map((entry) => entry.id);
    expect(new Set(ids).size).toBe(ids.length);
  });
});

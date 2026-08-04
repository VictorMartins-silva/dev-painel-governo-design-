import { describe, expect, it } from "vitest";
import { filterConfigSchema } from "./filters.schema";

describe("filterConfigSchema", () => {
  it("aceita um filtro single-select válido", () => {
    const result = filterConfigSchema.safeParse({
      id: "ano",
      type: "single-select",
      label: "Ano",
      dataField: "ano",
    });
    expect(result.success).toBe(true);
  });

  it("aceita um filtro multi-select válido", () => {
    const result = filterConfigSchema.safeParse({
      id: "sexo",
      type: "multi-select",
      label: "Sexo",
      dataField: "sexo",
    });
    expect(result.success).toBe(true);
  });

  it("aceita um filtro de período válido", () => {
    const result = filterConfigSchema.safeParse({
      id: "competencia",
      type: "period",
      label: "Competência",
      dataField: "competencia",
    });
    expect(result.success).toBe(true);
  });

  it("rejeita filtro sem dataField", () => {
    const result = filterConfigSchema.safeParse({
      id: "sexo",
      type: "multi-select",
      label: "Sexo",
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].path).toContain("dataField");
    }
  });

  it("rejeita tipo de filtro desconhecido", () => {
    const result = filterConfigSchema.safeParse({
      id: "sexo",
      type: "checkbox-livre",
      label: "Sexo",
      dataField: "sexo",
    });
    expect(result.success).toBe(false);
  });
});

import { describe, expect, it } from "vitest";
import { COMPONENT_CATALOG } from "./componentCatalog";
import { componentRegistry } from "../renderer/ComponentRegistry";
import { componentConfigSchema } from "./schemas/components.schema";

describe("COMPONENT_CATALOG", () => {
  it("descreve exatamente os mesmos tipos registrados no ComponentRegistry", () => {
    expect(Object.keys(COMPONENT_CATALOG).sort()).toEqual(Object.keys(componentRegistry).sort());
  });

  it("todo exemplo de configuração é válido segundo componentConfigSchema", () => {
    for (const entry of Object.values(COMPONENT_CATALOG)) {
      const result = componentConfigSchema.safeParse(entry.example);
      expect(result.success, `example for ${entry.type} should be valid`).toBe(true);
    }
  });

  it("o exemplo de cada entrada tem o mesmo type declarado na entrada", () => {
    for (const entry of Object.values(COMPONENT_CATALOG)) {
      expect(entry.example.type).toBe(entry.type);
    }
  });
});

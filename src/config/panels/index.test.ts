import { describe, expect, it } from "vitest";
import { panelConfigSchema } from "../schemas/panel.schema";
import { panelRegistry, findPanelConfig } from "./index";

describe("panelRegistry", () => {
  it("contém os dois painéis do protótipo", () => {
    expect(panelRegistry.map((panel) => panel.id).sort()).toEqual([
      "demografia",
      "trabalho-emprego",
    ]);
  });

  it("cada painel registrado é válido segundo o schema Zod", () => {
    for (const panel of panelRegistry) {
      const result = panelConfigSchema.safeParse(panel);
      expect(result.success).toBe(true);
    }
  });

  it("findPanelConfig localiza um painel existente pelo id", () => {
    expect(findPanelConfig("demografia")?.title).toBe("Demografia");
  });

  it("findPanelConfig retorna undefined para um id inexistente", () => {
    expect(findPanelConfig("inexistente")).toBeUndefined();
  });
});

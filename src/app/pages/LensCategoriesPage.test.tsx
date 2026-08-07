import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { DataProviderRoot } from "../../data/DataProviderContext";
import { MockDataProvider } from "../../data/mock/MockDataProvider";
import type { DataProvider, PanelSummary } from "../../data/provider";
import LensCategoriesPage from "./LensCategoriesPage";

const provider = new MockDataProvider({ simulateLatency: false });

function renderLens(lensId: string, dataProvider: DataProvider = provider) {
  return render(
    <MemoryRouter initialEntries={[`/lentes/${lensId}`]}>
      <DataProviderRoot provider={dataProvider}>
        <Routes>
          <Route path="/lentes/:lensId" element={<LensCategoriesPage />} />
        </Routes>
      </DataProviderRoot>
    </MemoryRouter>,
  );
}

function fakeProviderWithPanels(panels: PanelSummary[]): DataProvider {
  return {
    listPanels: () => Promise.resolve(panels),
    getPanelConfig: () => Promise.reject(new Error("não implementado")),
    getPanelFreshness: () => Promise.reject(new Error("não implementado")),
  };
}

describe("LensCategoriesPage", () => {
  it("lista as categorias da lente com a contagem de painéis", async () => {
    renderLens("secretaria");

    const link = await screen.findByRole("link", { name: /Secretaria de Planejamento/ });
    expect(link).toHaveTextContent("1 painel");
    expect(link).toHaveAttribute("href", "/paineis?secretaria=Secretaria%20de%20Planejamento");
  });

  it("exibe lente inexistente como erro", async () => {
    renderLens("inexistente");

    expect(await screen.findByRole("alert")).toHaveTextContent("Lente não encontrada");
  });

  it("exibe valor sem mapeamento heurístico como 'Não classificado'", async () => {
    const panel: PanelSummary = {
      id: "sem-mapeamento",
      title: "Painel sem tema mapeado",
      description: "",
      theme: "Tema Não Mapeado",
      tags: [],
      source: "",
      updatedAt: "2026-01-01",
      embedProvider: "powerbi-public",
    };

    renderLens("ods", fakeProviderWithPanels([panel]));

    expect(await screen.findByRole("link", { name: /Não classificado/ })).toHaveAttribute(
      "href",
      `/paineis?ods=${encodeURIComponent("—")}`,
    );
  });
});

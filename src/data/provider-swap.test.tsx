import { describe, expect, it } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import type { DataProvider } from "./provider";
import { DataProviderRoot, useDataProvider } from "./DataProviderContext";
import { useListPanels } from "./hooks/useListPanels";

// Prova do critério "separação de responsabilidades": um provider mínimo, que não usa
// MockDataProvider nem os fixtures JSON, é suficiente para a camada de dados funcionar —
// basta implementar a interface DataProvider e trocar 1 linha no bootstrap (aqui, no teste).
const stubProvider: DataProvider = {
  listPanels: async () => [
    {
      id: "stub",
      title: "Painel stub",
      description: "Painel de teste",
      theme: "Teste",
      tags: [],
      source: "stub",
      updatedAt: "2026-01-01",
      embedProvider: "powerbi-public",
    },
  ],
  getPanelConfig: async () => {
    throw new Error("não implementado no stub");
  },
  getPanelFreshness: async () => ({}),
};

function Probe() {
  const state = useListPanels();
  if (state.status !== "success") return null;
  return <span>{state.data.map((panel) => panel.title).join(", ")}</span>;
}

describe("troca de DataProvider", () => {
  it("um stub que implementa a interface DataProvider substitui o MockDataProvider sem alterar hooks ou componentes", async () => {
    render(
      <MemoryRouter>
        <DataProviderRoot provider={stubProvider}>
          <Probe />
        </DataProviderRoot>
      </MemoryRouter>,
    );

    await waitFor(() => expect(screen.getByText("Painel stub")).toBeInTheDocument());
  });

  it("useDataProvider expõe exatamente a instância injetada", () => {
    function ProviderIdentity() {
      const provider = useDataProvider();
      return <span>{provider === stubProvider ? "mesma-instancia" : "outra"}</span>;
    }

    render(
      <DataProviderRoot provider={stubProvider}>
        <ProviderIdentity />
      </DataProviderRoot>,
    );

    expect(screen.getByText("mesma-instancia")).toBeInTheDocument();
  });
});

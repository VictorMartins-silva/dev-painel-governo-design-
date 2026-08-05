import { describe, expect, it } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import type { DataProvider } from "./provider";
import { DataProviderRoot, useDataProvider } from "./DataProviderContext";
import { useIndicator } from "./hooks/useIndicator";

// Prova do critério "separação de responsabilidades": um provider mínimo, que não usa
// MockDataProvider nem os fixtures JSON, é suficiente para a camada de dados funcionar —
// basta implementar a interface DataProvider e trocar 1 linha no bootstrap (aqui, no teste).
const stubProvider: DataProvider = {
  listPanels: async () => [],
  getPanelConfig: async () => {
    throw new Error("não implementado no stub");
  },
  getIndicator: async () => ({
    data: { value: 42, unit: "unidades" },
    metadata: { source: "stub" },
  }),
  getTimeSeries: async () => ({ data: [], metadata: {} }),
  getCategoricalSeries: async () => ({ data: [], metadata: {} }),
  getTable: async () => ({ data: { columns: [], rows: [] }, metadata: {} }),
  getFilterOptions: async () => [],
  getIndicatorMetadata: async () => {
    throw new Error("não implementado no stub");
  },
  listIndicators: async () => [],
};

function Probe() {
  const state = useIndicator({ metric: "qualquer", filters: {} });
  if (state.status !== "success") return null;
  return (
    <span>
      {state.data.value} {state.data.unit}
    </span>
  );
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

    await waitFor(() => expect(screen.getByText("42 unidades")).toBeInTheDocument());
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

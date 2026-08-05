import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { DataProviderRoot } from "../../data/DataProviderContext";
import { MockDataProvider } from "../../data/mock/MockDataProvider";
import type { PanelStore, PanelListEntry } from "../store/PanelStore";
import type { PanelConfig } from "../../config/schemas/panel.schema";
import AdminIndicatorsPage from "./AdminIndicatorsPage";

function stubPanelStore(panels: PanelConfig[]): PanelStore {
  const entries: PanelListEntry[] = panels.map((config) => ({ config, origin: "static" }));
  return {
    list: () => entries,
    get: (id) => panels.find((panel) => panel.id === id),
    save: (config) => config,
    restoreOriginal: () => undefined,
  };
}

function brokenPanel(): PanelConfig {
  return {
    schemaVersion: 1,
    kind: "native",
    id: "painel-quebrado",
    title: "Painel quebrado",
    description: "Descrição",
    theme: "Tema",
    tags: [],
    metadata: { source: "Fonte", owner: "Equipe" },
    filters: [],
    sections: [
      {
        id: "secao",
        title: "Seção",
        layout: "grid-2",
        components: [
          {
            id: "c",
            type: "indicator-card",
            title: "Componente quebrado",
            metric: "indicador_inexistente",
            format: "integer",
          },
        ],
      },
    ],
  };
}

function renderPage(provider: MockDataProvider) {
  return render(
    <MemoryRouter>
      <DataProviderRoot provider={provider}>
        <AdminIndicatorsPage />
      </DataProviderRoot>
    </MemoryRouter>,
  );
}

describe("AdminIndicatorsPage", () => {
  it("lista o catálogo completo sem órfãos nem referências quebradas para os painéis estáticos", async () => {
    const provider = new MockDataProvider({ simulateLatency: false });
    renderPage(provider);

    expect(await screen.findByText(/Catálogo completo \(10\)/)).toBeInTheDocument();
    expect(screen.queryByText(/Indicadores órfãos/)).not.toBeInTheDocument();
    expect(screen.queryByText(/Referências quebradas/)).not.toBeInTheDocument();
    expect(screen.getAllByRole("link", { name: "Saldo de empregos" }).length).toBeGreaterThan(0);
  });

  it("mostra referências quebradas e indicadores órfãos quando o painel referencia indicador inexistente", async () => {
    const provider = new MockDataProvider({
      simulateLatency: false,
      panelStore: stubPanelStore([brokenPanel()]),
    });
    renderPage(provider);

    expect(await screen.findByText(/Referências quebradas \(1\)/)).toBeInTheDocument();
    expect(screen.getByText(/"indicador_inexistente" não existe no catálogo/)).toBeInTheDocument();
    expect(screen.getByText(/Indicadores órfãos \(10\)/)).toBeInTheDocument();
  });
});

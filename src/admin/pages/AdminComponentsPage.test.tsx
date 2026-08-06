import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { DataProviderRoot } from "../../data/DataProviderContext";
import { MockDataProvider } from "../../data/mock/MockDataProvider";
import AdminComponentsPage from "./AdminComponentsPage";

const provider = new MockDataProvider({ simulateLatency: false });

function renderPage() {
  return render(
    <MemoryRouter>
      <DataProviderRoot provider={provider}>
        <AdminComponentsPage />
      </DataProviderRoot>
    </MemoryRouter>,
  );
}

describe("AdminComponentsPage", () => {
  it("descreve os quatro tipos de componente com resumo e campos de configuração", () => {
    renderPage();

    expect(
      screen.getByText("Um valor único em destaque, com comparação opcional ao período anterior."),
    ).toBeInTheDocument();
    expect(
      screen.getByText("Evolução de um indicador ao longo do tempo, em linha."),
    ).toBeInTheDocument();
    expect(
      screen.getByText("Comparação de um indicador entre categorias de uma dimensão."),
    ).toBeInTheDocument();
    expect(
      screen.getByText("Linhas e colunas de um dataset tabular, com colunas configuráveis."),
    ).toBeInTheDocument();
  });

  it("mostra a contagem de indicadores compatíveis assim que o catálogo carrega", async () => {
    renderPage();

    expect(await screen.findAllByText(/indicador(es)? compatíve(l|is)/)).not.toHaveLength(0);
  });

  it("renderiza os estados de feedback genéricos e o FilterBar interativo", async () => {
    renderPage();

    expect(screen.getByText("FilterBar — interativo")).toBeInTheDocument();
    expect(screen.getByText("Estados de feedback (genéricos)")).toBeInTheDocument();
    await screen.findAllByText(/indicador(es)? compatíve(l|is)/);
  });
});

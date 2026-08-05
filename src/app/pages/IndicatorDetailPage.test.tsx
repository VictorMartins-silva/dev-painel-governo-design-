import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { DataProviderRoot } from "../../data/DataProviderContext";
import { MockDataProvider } from "../../data/mock/MockDataProvider";
import IndicatorDetailPage from "./IndicatorDetailPage";

const provider = new MockDataProvider({ simulateLatency: false });

function renderAt(path: string) {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <DataProviderRoot provider={provider}>
        <Routes>
          <Route path="/indicadores/:id" element={<IndicatorDetailPage />} />
        </Routes>
      </DataProviderRoot>
    </MemoryRouter>,
  );
}

describe("IndicatorDetailPage", () => {
  it("renderiza os metadados do indicador", async () => {
    renderAt("/indicadores/saldo_empregos");

    expect(await screen.findByRole("heading", { name: "Saldo de empregos" })).toBeInTheDocument();
    expect(screen.getByText("vínculos")).toBeInTheDocument();
    expect(screen.getByText(/Saldo = Admissões/)).toBeInTheDocument();
  });

  it("exibe erro para um indicador inexistente, sem quebrar a página", async () => {
    renderAt("/indicadores/indicador-inexistente");

    expect(await screen.findByText(/não encontrados/)).toBeInTheDocument();
  });

  it("renderiza indicadores que antes não tinham metadados de governança", async () => {
    renderAt("/indicadores/distribuicao_sexo");

    expect(
      await screen.findByRole("heading", { name: "Distribuição por sexo" }),
    ).toBeInTheDocument();
  });

  it("lista os painéis que usam o indicador", async () => {
    renderAt("/indicadores/saldo_empregos");

    await screen.findByRole("heading", { name: "Saldo de empregos" });
    expect(await screen.findByText("Usado nos painéis")).toBeInTheDocument();
    expect(screen.getAllByRole("link", { name: "Trabalho e Emprego" }).length).toBeGreaterThan(0);
  });
});

import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { DataProviderRoot } from "../../data/DataProviderContext";
import { MockDataProvider } from "../../data/mock/MockDataProvider";
import IndicatorCatalogPage from "./IndicatorCatalogPage";

const provider = new MockDataProvider({ simulateLatency: false });

function renderCatalog(initialEntries: string[] = ["/indicadores"]) {
  return render(
    <MemoryRouter initialEntries={initialEntries}>
      <DataProviderRoot provider={provider}>
        <IndicatorCatalogPage />
      </DataProviderRoot>
    </MemoryRouter>,
  );
}

describe("IndicatorCatalogPage", () => {
  it("lista os indicadores do catálogo, incluindo os que não têm painel", async () => {
    renderCatalog();

    expect(await screen.findByRole("link", { name: /Saldo de empregos/ })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Distribuição por sexo/ })).toBeInTheDocument();
  });

  it("busca textual filtra pelo nome", async () => {
    const user = userEvent.setup();
    renderCatalog();
    await screen.findByRole("link", { name: /Saldo de empregos/ });

    await user.type(screen.getByLabelText("Busca"), "saldo");

    expect(screen.getByRole("link", { name: /Saldo de empregos/ })).toBeInTheDocument();
    expect(screen.queryByRole("link", { name: /Admissões/ })).not.toBeInTheDocument();
  });

  it("aplica o filtro de forma do dado vindo da querystring", async () => {
    renderCatalog(["/indicadores?forma=table"]);

    expect(await screen.findByRole("link", { name: /Vínculos por atividade/ })).toBeInTheDocument();
    expect(screen.queryByRole("link", { name: /Saldo de empregos/ })).not.toBeInTheDocument();
  });
});

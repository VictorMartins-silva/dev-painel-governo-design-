import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { DataProviderRoot } from "../../data/DataProviderContext";
import { MockDataProvider } from "../../data/mock/MockDataProvider";
import CatalogPage from "./CatalogPage";

const provider = new MockDataProvider({ simulateLatency: false });

function renderCatalog() {
  return render(
    <MemoryRouter>
      <DataProviderRoot provider={provider}>
        <CatalogPage />
      </DataProviderRoot>
    </MemoryRouter>,
  );
}

function panelCardLink(name: RegExp) {
  return screen.queryByRole("link", { name });
}

describe("CatalogPage", () => {
  it("lista os dois painéis por padrão", async () => {
    renderCatalog();
    expect(await screen.findByRole("link", { name: /Trabalho e Emprego/ })).toBeInTheDocument();
    expect(panelCardLink(/^Demografia/)).toBeInTheDocument();
  });

  it("filtra por tema", async () => {
    const user = userEvent.setup();
    renderCatalog();
    await screen.findByRole("link", { name: /Trabalho e Emprego/ });

    await user.selectOptions(screen.getByLabelText("Tema"), "Demografia");

    expect(panelCardLink(/^Demografia/)).toBeInTheDocument();
    expect(panelCardLink(/Trabalho e Emprego/)).not.toBeInTheDocument();
  });

  it("busca textual filtra por tag", async () => {
    const user = userEvent.setup();
    renderCatalog();
    await screen.findByRole("link", { name: /Trabalho e Emprego/ });

    await user.type(screen.getByLabelText("Busca"), "caged");

    expect(panelCardLink(/Trabalho e Emprego/)).toBeInTheDocument();
    expect(panelCardLink(/^Demografia/)).not.toBeInTheDocument();
  });
});

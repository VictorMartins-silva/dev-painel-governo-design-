import { beforeEach, describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { DataProviderRoot } from "../../data/DataProviderContext";
import { MockDataProvider } from "../../data/mock/MockDataProvider";
import { lensStore } from "../../admin/store/LensStore";
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
  beforeEach(() => {
    window.localStorage.clear();
  });

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

  it("filtra pelo recorte de uma lente cadastrada no admin", async () => {
    const user = userEvent.setup();
    lensStore.save({
      schemaVersion: 1,
      id: "prioridade-2026",
      label: "Prioridade 2026",
      description: "Painéis prioritários do plano de governo.",
      allLabel: "",
      panelIds: ["demografia"],
    });
    renderCatalog();
    await screen.findByRole("link", { name: /Trabalho e Emprego/ });

    await user.selectOptions(screen.getByLabelText("Prioridade 2026"), "Prioridade 2026");

    expect(panelCardLink(/^Demografia/)).toBeInTheDocument();
    expect(panelCardLink(/Trabalho e Emprego/)).not.toBeInTheDocument();
  });
});

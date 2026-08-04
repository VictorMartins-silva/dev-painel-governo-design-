import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { DataProviderRoot } from "../../data/DataProviderContext";
import { MockDataProvider } from "../../data/mock/MockDataProvider";
import HomePage from "./HomePage";

const provider = new MockDataProvider({ simulateLatency: false });

function renderHome() {
  return render(
    <MemoryRouter>
      <DataProviderRoot provider={provider}>
        <HomePage />
      </DataProviderRoot>
    </MemoryRouter>,
  );
}

function panelCardLink(name: RegExp) {
  return screen.queryByRole("link", { name });
}

describe("HomePage", () => {
  it("lista os painéis disponíveis", async () => {
    renderHome();
    expect(await screen.findByRole("link", { name: /Trabalho e Emprego/ })).toBeInTheDocument();
    expect(panelCardLink(/^Demografia/)).toBeInTheDocument();
  });

  it("busca filtra os painéis por título", async () => {
    const user = userEvent.setup();
    renderHome();
    await screen.findByRole("link", { name: /Trabalho e Emprego/ });

    await user.type(screen.getByLabelText("Buscar painéis"), "demografia");

    expect(panelCardLink(/^Demografia/)).toBeInTheDocument();
    expect(panelCardLink(/Trabalho e Emprego/)).not.toBeInTheDocument();
  });

  it("exibe mensagem quando nenhum painel corresponde à busca", async () => {
    const user = userEvent.setup();
    renderHome();
    await screen.findByRole("link", { name: /Trabalho e Emprego/ });

    await user.type(screen.getByLabelText("Buscar painéis"), "inexistente-xyz");

    expect(screen.getByText(/Nenhum painel encontrado/)).toBeInTheDocument();
  });
});

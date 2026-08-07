import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { LENSES } from "../../config/lenses";
import { lensStore } from "../store/LensStore";
import AdminLensesPage from "./AdminLensesPage";

function renderPage() {
  return render(
    <MemoryRouter>
      <AdminLensesPage />
    </MemoryRouter>,
  );
}

function rowFor(title: string): HTMLElement {
  const element = screen.getByText(title).closest("li");
  if (!element) throw new Error(`Linha não encontrada para "${title}"`);
  return element;
}

describe("AdminLensesPage", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("lista as lentes padrão do sistema como somente leitura", () => {
    renderPage();

    for (const lens of LENSES) {
      expect(screen.getByText(lens.label)).toBeInTheDocument();
    }
    expect(screen.getAllByText("Padrão do sistema")).toHaveLength(LENSES.length);
  });

  it("mostra mensagem de vazio quando não há lentes cadastradas", () => {
    renderPage();

    expect(
      screen.getByText("Nenhuma lente cadastrada ainda além das padrão do sistema."),
    ).toBeInTheDocument();
  });

  it("lista uma lente cadastrada com badge 'Cadastrada' e contagem de painéis", () => {
    lensStore.save({
      schemaVersion: 1,
      id: "prioridade-2026",
      label: "Prioridade 2026",
      description: "Painéis prioritários do plano de governo.",
      allLabel: "",
      panelIds: ["demografia", "trabalho-emprego"],
    });
    renderPage();

    const row = rowFor("Prioridade 2026");
    expect(within(row).getByText("Cadastrada")).toBeInTheDocument();
    expect(within(row).getByText(/2 painéis/)).toBeInTheDocument();
  });

  it("exclui uma lente cadastrada após confirmação", async () => {
    const user = userEvent.setup();
    lensStore.save({
      schemaVersion: 1,
      id: "prioridade-2026",
      label: "Prioridade 2026",
      description: "Painéis prioritários do plano de governo.",
      allLabel: "",
      panelIds: ["demografia"],
    });
    vi.spyOn(window, "confirm").mockReturnValue(true);
    renderPage();

    const row = rowFor("Prioridade 2026");
    await user.click(within(row).getByRole("button", { name: "Excluir" }));

    expect(screen.queryByText("Prioridade 2026")).not.toBeInTheDocument();
    expect(lensStore.get("prioridade-2026")).toBeUndefined();
  });
});

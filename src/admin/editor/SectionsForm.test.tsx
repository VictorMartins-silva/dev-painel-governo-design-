import { describe, expect, it, vi } from "vitest";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { ReactNode } from "react";
import { DataProviderRoot } from "../../data/DataProviderContext";
import { MockDataProvider } from "../../data/mock/MockDataProvider";
import { createDefaultComponent, createDefaultSection } from "./editorReducer";
import { SectionsForm } from "./SectionsForm";
import { ValidationDisplayProvider } from "./ValidationDisplayContext";

const provider = new MockDataProvider({ simulateLatency: false });

function renderWithProvider(children: ReactNode) {
  return render(<DataProviderRoot provider={provider}>{children}</DataProviderRoot>);
}

describe("SectionsForm", () => {
  it("mostra mensagem quando não há seções e permite adicionar", async () => {
    const user = userEvent.setup();
    const dispatch = vi.fn();
    renderWithProvider(<SectionsForm sections={[]} errors={new Map()} dispatch={dispatch} />);

    expect(screen.getByText("Nenhuma seção configurada.")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Adicionar seção" }));
    expect(dispatch).toHaveBeenCalledWith({ kind: "add-section" });
  });

  it("edita título e layout de uma seção, e permite remover/mover", async () => {
    const user = userEvent.setup();
    const dispatch = vi.fn();
    const sections = [createDefaultSection(), createDefaultSection()];
    renderWithProvider(<SectionsForm sections={sections} errors={new Map()} dispatch={dispatch} />);

    await user.type(screen.getAllByLabelText("Título da seção")[0], "S");
    expect(dispatch).toHaveBeenCalledWith({ kind: "update-section-title", index: 0, value: "S" });

    await user.selectOptions(screen.getAllByLabelText("Layout")[0], "grid-4");
    expect(dispatch).toHaveBeenCalledWith({
      kind: "update-section-layout",
      index: 0,
      value: "grid-4",
    });

    const removeButtons = screen.getAllByRole("button", { name: "Remover seção" });
    await user.click(removeButtons[0]);
    expect(dispatch).toHaveBeenCalledWith({ kind: "remove-section", index: 0 });
  });

  it("adiciona componente e remove/reordena componentes de uma seção", async () => {
    const user = userEvent.setup();
    const dispatch = vi.fn();
    const section = {
      ...createDefaultSection(),
      components: [createDefaultComponent("indicator-card"), createDefaultComponent("time-series")],
    };
    renderWithProvider(
      <SectionsForm sections={[section]} errors={new Map()} dispatch={dispatch} />,
    );

    expect(await screen.findAllByLabelText("Tipo")).toHaveLength(2);

    await user.click(screen.getByRole("button", { name: "Adicionar componente" }));
    expect(dispatch).toHaveBeenCalledWith({
      kind: "add-component",
      sectionIndex: 0,
      componentType: "indicator-card",
    });

    const componentRows = screen.getAllByText(/^Componente \d$/).map((label) => {
      const row = label.closest("li");
      if (!row) throw new Error("Linha de componente não encontrada");
      return row;
    });
    expect(componentRows).toHaveLength(2);

    await user.click(within(componentRows[1]).getByRole("button", { name: /para cima/ }));
    expect(dispatch).toHaveBeenCalledWith({
      kind: "move-component",
      sectionIndex: 0,
      componentIndex: 1,
      direction: "up",
    });

    await user.click(within(componentRows[0]).getByRole("button", { name: "Remover" }));
    expect(dispatch).toHaveBeenCalledWith({
      kind: "remove-component",
      sectionIndex: 0,
      componentIndex: 0,
    });
  });

  it("mostra erros de validação para a lista de seções e de componentes", () => {
    const section = createDefaultSection();
    const errors = new Map([
      ["sections", "Adicione ao menos uma seção"],
      ["sections.0.components", "Adicione ao menos um componente"],
    ]);
    renderWithProvider(
      <ValidationDisplayProvider forceShow>
        <SectionsForm sections={[section]} errors={errors} dispatch={vi.fn()} />
      </ValidationDisplayProvider>,
    );

    expect(screen.getByText("Adicione ao menos uma seção")).toBeInTheDocument();
    expect(screen.getByText("Adicione ao menos um componente")).toBeInTheDocument();
  });
});

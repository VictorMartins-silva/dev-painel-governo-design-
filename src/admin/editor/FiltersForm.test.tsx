import { describe, expect, it, vi } from "vitest";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createDefaultFilter } from "./editorReducer";
import { FiltersForm } from "./FiltersForm";

describe("FiltersForm", () => {
  it("mostra mensagem quando não há filtros e permite adicionar", async () => {
    const user = userEvent.setup();
    const dispatch = vi.fn();
    render(<FiltersForm filters={[]} errors={new Map()} dispatch={dispatch} />);

    expect(screen.getByText("Nenhum filtro configurado.")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Adicionar filtro" }));
    expect(dispatch).toHaveBeenCalledWith({ kind: "add-filter" });
  });

  it("edita rótulo, campo de dados e tipo de um filtro", async () => {
    const user = userEvent.setup();
    const dispatch = vi.fn();
    const filter = createDefaultFilter("single-select");
    render(<FiltersForm filters={[filter]} errors={new Map()} dispatch={dispatch} />);

    await user.type(screen.getByLabelText("Rótulo"), "X");
    expect(dispatch).toHaveBeenCalledWith({
      kind: "update-filter",
      index: 0,
      filter: { ...filter, label: "X" },
    });

    await user.type(screen.getByLabelText("Campo de dados"), "Y");
    expect(dispatch).toHaveBeenCalledWith({
      kind: "update-filter",
      index: 0,
      filter: { ...filter, dataField: "Y" },
    });

    await user.selectOptions(screen.getByLabelText("Tipo"), "period");
    expect(dispatch).toHaveBeenCalledWith({
      kind: "update-filter",
      index: 0,
      filter: { ...filter, type: "period" },
    });
  });

  it("remove e reordena filtros, desabilitando nos limites da lista", async () => {
    const user = userEvent.setup();
    const dispatch = vi.fn();
    const filters = [createDefaultFilter("single-select"), createDefaultFilter("multi-select")];
    render(<FiltersForm filters={filters} errors={new Map()} dispatch={dispatch} />);

    const rows = screen.getAllByRole("listitem");
    expect(within(rows[0]).getByRole("button", { name: /para cima/ })).toBeDisabled();
    expect(within(rows[1]).getByRole("button", { name: /para baixo/ })).toBeDisabled();

    await user.click(within(rows[1]).getByRole("button", { name: /para cima/ }));
    expect(dispatch).toHaveBeenCalledWith({ kind: "move-filter", index: 1, direction: "up" });

    await user.click(within(rows[0]).getByRole("button", { name: "Remover" }));
    expect(dispatch).toHaveBeenCalledWith({ kind: "remove-filter", index: 0 });
  });
});

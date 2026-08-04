import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { FilterBar } from "./FilterBar";
import type { FilterConfig } from "../../config/schemas/filters.schema";

const filters: FilterConfig[] = [
  { id: "ano", type: "single-select", label: "Ano", dataField: "ano" },
  { id: "sexo", type: "multi-select", label: "Sexo", dataField: "sexo" },
];

const optionsByFilterId = {
  ano: [
    { value: "2024", label: "2024" },
    { value: "2025", label: "2025" },
  ],
  sexo: [
    { value: "masculino", label: "Masculino" },
    { value: "feminino", label: "Feminino" },
  ],
};

describe("FilterBar", () => {
  it("chama onChange com o valor selecionado em single-select", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();

    render(
      <FilterBar
        filters={filters}
        values={{}}
        optionsByFilterId={optionsByFilterId}
        onChange={onChange}
        onClear={vi.fn()}
      />,
    );

    await user.selectOptions(screen.getByLabelText("Ano"), "2024");
    expect(onChange).toHaveBeenCalledWith("ano", ["2024"]);
  });

  it("exibe filtros ativos como chips e permite remover", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();

    render(
      <FilterBar
        filters={filters}
        values={{ ano: ["2024"] }}
        optionsByFilterId={optionsByFilterId}
        onChange={onChange}
        onClear={vi.fn()}
      />,
    );

    expect(screen.getByText("Ano: 2024")).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: /remover filtro/i }));
    expect(onChange).toHaveBeenCalledWith("ano", []);
  });

  it("chama onClear ao clicar em Limpar filtros", async () => {
    const user = userEvent.setup();
    const onClear = vi.fn();

    render(
      <FilterBar
        filters={filters}
        values={{ ano: ["2024"] }}
        optionsByFilterId={optionsByFilterId}
        onChange={vi.fn()}
        onClear={onClear}
      />,
    );

    await user.click(screen.getByRole("button", { name: "Limpar filtros" }));
    expect(onClear).toHaveBeenCalled();
  });
});

import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { DataTable } from "./DataTable";

const data = {
  columns: [
    { field: "atividade", label: "Atividade", type: "text" as const },
    { field: "vinculos", label: "Vínculos", type: "integer" as const },
  ],
  rows: [
    { atividade: "Comércio", vinculos: 320 },
    { atividade: "Indústria", vinculos: 150 },
  ],
};

describe("DataTable", () => {
  it("renderiza colunas e linhas formatadas", () => {
    render(<DataTable title="Vínculos por atividade" data={data} />);

    expect(screen.getByText("Vínculos por atividade")).toBeInTheDocument();
    expect(screen.getByText("Comércio")).toBeInTheDocument();
    expect(screen.getByText("320")).toBeInTheDocument();
  });

  it("ordena ao clicar no cabeçalho da coluna", async () => {
    const user = userEvent.setup();
    render(<DataTable data={data} />);

    const rowsBefore = screen.getAllByRole("row").slice(1);
    expect(rowsBefore[0]).toHaveTextContent("Comércio");

    await user.click(screen.getByRole("button", { name: "Ordenar por Vínculos" }));

    const rowsAfterAsc = screen.getAllByRole("row").slice(1);
    expect(rowsAfterAsc[0]).toHaveTextContent("Indústria");
  });

  it("renderiza tabela vazia sem erros", () => {
    render(<DataTable data={{ columns: data.columns, rows: [] }} />);
    expect(screen.getAllByRole("columnheader")).toHaveLength(2);
    expect(screen.queryAllByRole("row")).toHaveLength(1);
  });
});

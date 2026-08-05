import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { IndicatorCatalogEntry } from "../../config/schemas/indicator.schema";
import { IndicatorSelect } from "./IndicatorSelect";

function makeIndicator(overrides: Partial<IndicatorCatalogEntry>): IndicatorCatalogEntry {
  return {
    id: "indicador",
    name: "Indicador",
    unit: "unidade",
    source: "Fonte",
    definition: "Definição do indicador.",
    periodicity: "Mensal",
    granularity: "Município",
    owner: "Equipe de Serviços",
    updatedAt: "2026-07-15",
    shapes: ["metric"],
    dimensions: [],
    datasets: [],
    tags: [],
    ...overrides,
  };
}

const indicators: IndicatorCatalogEntry[] = [
  makeIndicator({
    id: "populacao_total",
    name: "População total",
    unit: "habitantes",
    source: "IBGE",
  }),
  makeIndicator({
    id: "saldo_empregos",
    name: "Saldo de empregos",
    unit: "vínculos",
    source: "CAGED",
  }),
];

describe("IndicatorSelect", () => {
  it("lista os indicadores recebidos e despacha a seleção", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(
      <IndicatorSelect
        id="indicator"
        indicators={indicators}
        status="success"
        value=""
        onChange={onChange}
      />,
    );

    await user.selectOptions(screen.getByLabelText("Indicador"), "saldo_empregos");
    expect(onChange).toHaveBeenCalledWith(indicators[1]);
  });

  it("filtra as opções pelo termo de busca", async () => {
    const user = userEvent.setup();
    render(
      <IndicatorSelect
        id="indicator"
        indicators={indicators}
        status="success"
        value=""
        onChange={vi.fn()}
      />,
    );

    await user.type(screen.getByLabelText("Buscar indicador"), "saldo");

    expect(screen.queryByRole("option", { name: "População total" })).not.toBeInTheDocument();
    expect(screen.getByRole("option", { name: "Saldo de empregos" })).toBeInTheDocument();
  });

  it("desabilita o select e mostra o estado de carregamento", () => {
    render(
      <IndicatorSelect
        id="indicator"
        indicators={[]}
        status="loading"
        value=""
        onChange={vi.fn()}
      />,
    );

    expect(screen.getByLabelText("Indicador")).toBeDisabled();
    expect(screen.getByText("Carregando indicadores...")).toBeInTheDocument();
  });

  it("mostra mensagem de erro quando o catálogo falha ao carregar", () => {
    render(
      <IndicatorSelect id="indicator" indicators={[]} status="error" value="" onChange={vi.fn()} />,
    );

    expect(
      screen.getByText("Não foi possível carregar o catálogo de indicadores."),
    ).toBeInTheDocument();
  });

  it("mostra dica quando não há indicadores compatíveis", () => {
    render(
      <IndicatorSelect
        id="indicator"
        indicators={[]}
        status="success"
        value=""
        onChange={vi.fn()}
      />,
    );

    expect(
      screen.getByText("Nenhum indicador compatível com este tipo de componente."),
    ).toBeInTheDocument();
  });

  it("mostra erro de validação do campo", () => {
    render(
      <IndicatorSelect
        id="indicator"
        indicators={indicators}
        status="success"
        value=""
        onChange={vi.fn()}
        error="Indicador é obrigatório"
      />,
    );

    expect(screen.getByText("Indicador é obrigatório")).toBeInTheDocument();
  });
});

import { describe, expect, it } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { DataProviderRoot } from "../data/DataProviderContext";
import { MockDataProvider } from "../data/mock/MockDataProvider";
import { ConfigRenderer } from "./ConfigRenderer";
import { ComponentSlot } from "./ComponentRegistry";
import type { ComponentConfig } from "../config/schemas/components.schema";

const provider = new MockDataProvider({ simulateLatency: false });

function renderWithProviders(config: unknown) {
  return render(
    <MemoryRouter>
      <DataProviderRoot provider={provider}>
        <ConfigRenderer panelId="trabalho-emprego" config={config} />
      </DataProviderRoot>
    </MemoryRouter>,
  );
}

function buildSyntheticPanel() {
  return {
    schemaVersion: 1,
    id: "trabalho-emprego",
    title: "Trabalho e Emprego",
    description: "Painel sintético de teste.",
    theme: "Desenvolvimento Econômico",
    tags: ["emprego"],
    metadata: {
      source: "CAGED (fictício)",
      referencePeriod: "2024–2025",
      updatedAt: "2026-07-15",
      owner: "Equipe de Serviços",
    },
    filters: [{ id: "ano", type: "single-select", label: "Ano", dataField: "ano" }],
    sections: [
      {
        id: "resumo",
        title: "Resumo",
        layout: "grid-4",
        components: [
          {
            id: "saldo",
            type: "indicator-card",
            title: "Saldo de empregos",
            metric: "saldo_empregos",
            format: "integer",
          },
          {
            id: "saldo-tempo",
            type: "time-series",
            title: "Evolução do saldo",
            metric: "saldo_empregos",
          },
          {
            id: "por-setor",
            type: "bar-chart",
            title: "Vínculos por setor",
            metric: "vinculos_por_setor",
            dimension: "setor",
          },
          {
            id: "tab-atividade",
            type: "data-table",
            title: "Vínculos por atividade",
            dataset: "vinculos_por_atividade",
            columns: [{ field: "atividade", label: "Atividade", type: "text" }],
          },
        ],
      },
    ],
  };
}

describe("ConfigRenderer", () => {
  it("renderiza os quatro tipos de componente de uma config sintética sem crashar", async () => {
    renderWithProviders(buildSyntheticPanel());

    await waitFor(() => expect(screen.getByText("2.120")).toBeInTheDocument());
    expect(screen.getByText("Evolução do saldo")).toBeInTheDocument();
    expect(screen.getAllByText("Sem dados").length).toBeGreaterThan(0);
    expect(screen.queryByText(/não está disponível no registry/)).not.toBeInTheDocument();
  });

  it("exibe erro estruturado com os issues do Zod para config inválida", () => {
    const invalid = { ...buildSyntheticPanel(), schemaVersion: 99 };
    renderWithProviders(invalid);

    expect(screen.getByText("Configuração de painel inválida")).toBeInTheDocument();
    expect(screen.getByText(/schemaVersion/)).toBeInTheDocument();
  });

  it("ComponentSlot mostra ErrorState localizado para um type ausente no registry, sem quebrar a página", () => {
    const futureComponent = {
      id: "mapa",
      type: "heatmap",
      title: "Mapa de calor",
    } as unknown as ComponentConfig;

    render(<ComponentSlot config={futureComponent} />);

    expect(screen.getByText("Componente não registrado")).toBeInTheDocument();
    expect(screen.getByText(/heatmap/)).toBeInTheDocument();
  });

  it("altera os dados exibidos quando o filtro é alterado (hooks reconsultam)", async () => {
    const user = userEvent.setup();
    const config = {
      ...buildSyntheticPanel(),
      sections: [
        {
          id: "resumo",
          title: "Resumo",
          layout: "grid-4",
          components: [
            {
              id: "saldo",
              type: "indicator-card",
              title: "Saldo de empregos",
              metric: "saldo_empregos",
              format: "integer",
            },
          ],
        },
      ],
    };

    renderWithProviders(config);

    await waitFor(() => expect(screen.getByText("2025-12")).toBeInTheDocument());

    await user.selectOptions(screen.getByLabelText("Ano"), "2024");

    await waitFor(() => expect(screen.getByText("2024-12")).toBeInTheDocument());
    expect(screen.queryByText("2025-12")).not.toBeInTheDocument();
  });
});

import { describe, expect, it } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { DataProviderRoot } from "../data/DataProviderContext";
import { MockDataProvider } from "../data/mock/MockDataProvider";
import { demografia } from "../config/panels/demografia.panel";
import { ConfigRenderer } from "./ConfigRenderer";

const provider = new MockDataProvider({ simulateLatency: false });

describe("Painel Demografia (prova de arquitetura)", () => {
  it("renderiza o painel 2 inteiramente a partir da config, reusando os componentes do painel 1", async () => {
    render(
      <MemoryRouter>
        <DataProviderRoot provider={provider}>
          <ConfigRenderer panelId="demografia" config={demografia} />
        </DataProviderRoot>
      </MemoryRouter>,
    );

    await waitFor(() => expect(screen.getByText("191.809")).toBeInTheDocument());
    expect(screen.getByText("Distribuição por sexo")).toBeInTheDocument();
    expect(screen.getByText("Distribuição por faixa etária")).toBeInTheDocument();
    expect(screen.getByText("Evolução populacional")).toBeInTheDocument();
    await waitFor(() => expect(screen.getByText("42.198")).toBeInTheDocument());
  });
});

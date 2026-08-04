import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { IndicatorCard } from "./IndicatorCard";

describe("IndicatorCard", () => {
  it("formata o valor e exibe a comparação", () => {
    render(
      <MemoryRouter>
        <IndicatorCard
          title="Saldo de empregos"
          format="integer"
          data={{
            value: 2450,
            referencePeriod: "2025-12",
            comparison: { value: 120, direction: "up", referenceLabel: "2025-11" },
          }}
        />
      </MemoryRouter>,
    );

    expect(screen.getByText("Saldo de empregos")).toBeInTheDocument();
    expect(screen.getByText("2.450")).toBeInTheDocument();
    expect(screen.getByText(/120 vs\. 2025-11/)).toBeInTheDocument();
  });

  it("exibe travessão quando o valor é nulo", () => {
    render(
      <MemoryRouter>
        <IndicatorCard title="Saldo de empregos" format="integer" data={{ value: null }} />
      </MemoryRouter>,
    );

    expect(screen.getByText("—")).toBeInTheDocument();
  });

  it("renderiza link para detalhes quando indicatorId é informado", () => {
    render(
      <MemoryRouter>
        <IndicatorCard
          title="Saldo de empregos"
          format="integer"
          data={{ value: 10 }}
          indicatorId="saldo-empregos"
        />
      </MemoryRouter>,
    );

    expect(screen.getByRole("link", { name: "Ver detalhes" })).toHaveAttribute(
      "href",
      "/indicadores/saldo-empregos",
    );
  });
});

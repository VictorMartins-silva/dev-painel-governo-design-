import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { TimeSeriesChart } from "./TimeSeriesChart";

describe("TimeSeriesChart", () => {
  it("renderiza o título e um gráfico acessível", () => {
    render(
      <TimeSeriesChart
        title="Evolução do saldo"
        data={[
          { period: "2025-01", value: 100 },
          { period: "2025-02", value: 150 },
        ]}
      />,
    );

    expect(screen.getByText("Evolução do saldo")).toBeInTheDocument();
    expect(screen.getByRole("img", { name: /Gráfico de série temporal/ })).toBeInTheDocument();
  });

  it("renderiza sem série quando os dados estão vazios", () => {
    render(<TimeSeriesChart title="Evolução do saldo" data={[]} />);
    expect(screen.getByRole("img")).toBeInTheDocument();
  });
});

import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { BarChart } from "./BarChart";

describe("BarChart", () => {
  it("renderiza o título e um gráfico acessível", () => {
    render(
      <BarChart
        title="Vínculos por setor"
        data={[
          { category: "Comércio", value: 320 },
          { category: "Indústria", value: 150 },
        ]}
      />,
    );

    expect(screen.getByText("Vínculos por setor")).toBeInTheDocument();
    expect(screen.getByRole("img", { name: /Gráfico de barras/ })).toBeInTheDocument();
  });
});

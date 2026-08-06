import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { DataProviderRoot } from "../../data/DataProviderContext";
import { MockDataProvider } from "../../data/mock/MockDataProvider";
import HomePage from "./HomePage";

const provider = new MockDataProvider({ simulateLatency: false });

function renderHome() {
  return render(
    <MemoryRouter>
      <DataProviderRoot provider={provider}>
        <HomePage />
      </DataProviderRoot>
    </MemoryRouter>,
  );
}

function panelCardLink(name: RegExp) {
  return screen.queryByRole("link", { name });
}

describe("HomePage", () => {
  it("lista os painéis disponíveis", async () => {
    renderHome();
    expect(await screen.findByRole("link", { name: /Trabalho e Emprego/ })).toBeInTheDocument();
    expect(panelCardLink(/^Demografia/)).toBeInTheDocument();
  });
});

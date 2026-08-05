import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import AdminLayout from "./AdminLayout";

describe("AdminLayout", () => {
  it("exibe o aviso de ambiente de configuração e renderiza a rota filha", () => {
    render(
      <MemoryRouter initialEntries={["/admin"]}>
        <Routes>
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<div>Conteúdo do admin</div>} />
          </Route>
        </Routes>
      </MemoryRouter>,
    );

    expect(screen.getByText("Ambiente de configuração")).toBeInTheDocument();
    expect(screen.getByText("Conteúdo do admin")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Sair do modo de configuração" })).toHaveAttribute(
      "href",
      "/",
    );
  });
});

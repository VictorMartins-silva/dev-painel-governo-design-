import { beforeEach, describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createMemoryRouter, RouterProvider } from "react-router-dom";
import { lensStore } from "../store/LensStore";
import LensEditorPage from "./LensEditorPage";

function renderAt(path: string) {
  const router = createMemoryRouter(
    [
      { path: "/admin/lentes", element: <div>Lista de lentes</div> },
      { path: "/admin/lentes/novo", element: <LensEditorPage /> },
      { path: "/admin/lentes/:id", element: <LensEditorPage /> },
    ],
    { initialEntries: [path] },
  );

  render(<RouterProvider router={router} />);
  return router;
}

describe("LensEditorPage", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("mostra formulário vazio para uma nova lente", () => {
    renderAt("/admin/lentes/novo");

    expect(screen.getByRole("heading", { name: "Nova lente" })).toBeInTheDocument();
    expect(screen.getByLabelText("Id (único)")).toBeEnabled();
    expect(screen.getByText("Trabalho e Emprego")).toBeInTheDocument();
  });

  it("bloqueia salvar sem nenhum painel selecionado e mostra o erro", async () => {
    const user = userEvent.setup();
    renderAt("/admin/lentes/novo");

    await user.type(screen.getByLabelText("Id (único)"), "prioridade-2026");
    await user.type(screen.getByLabelText("Nome"), "Prioridade 2026");
    await user.type(
      screen.getByLabelText("Descrição"),
      "Painéis prioritários do plano de governo.",
    );
    await user.click(screen.getByRole("button", { name: "Salvar" }));

    expect(await screen.findByRole("alert")).toHaveTextContent(/Selecione pelo menos um painel/);
    expect(lensStore.get("prioridade-2026")).toBeUndefined();
  });

  it("cadastra uma nova lente com os painéis selecionados", async () => {
    const user = userEvent.setup();
    renderAt("/admin/lentes/novo");

    await user.type(screen.getByLabelText("Id (único)"), "prioridade-2026");
    await user.type(screen.getByLabelText("Nome"), "Prioridade 2026");
    await user.type(
      screen.getByLabelText("Descrição"),
      "Painéis prioritários do plano de governo.",
    );
    await user.click(
      screen.getByText("Trabalho e Emprego").closest("label")!.querySelector("input")!,
    );

    await user.click(screen.getByRole("button", { name: "Salvar" }));

    expect(await screen.findByText("Lista de lentes")).toBeInTheDocument();
    const saved = lensStore.get("prioridade-2026");
    expect(saved?.label).toBe("Prioridade 2026");
    expect(saved?.panelIds).toContain("trabalho-emprego");
  });

  it("rejeita id reservado por uma lente estática", async () => {
    const user = userEvent.setup();
    renderAt("/admin/lentes/novo");

    await user.type(screen.getByLabelText("Id (único)"), "tema");
    await user.type(screen.getByLabelText("Nome"), "Duplicado");
    await user.type(screen.getByLabelText("Descrição"), "Descrição qualquer.");
    await user.click(
      screen.getByText("Trabalho e Emprego").closest("label")!.querySelector("input")!,
    );
    await user.click(screen.getByRole("button", { name: "Salvar" }));

    expect(await screen.findByRole("alert")).toHaveTextContent(
      /já é usado por uma lente padrão/,
    );
  });

  it("filtra a lista de painéis pela busca", async () => {
    const user = userEvent.setup();
    renderAt("/admin/lentes/novo");

    await user.type(
      screen.getByLabelText("Buscar painel para adicionar à lente"),
      "Trabalho e Emprego",
    );

    expect(screen.getByText("Trabalho e Emprego")).toBeInTheDocument();
    expect(screen.queryByText("Demografia")).not.toBeInTheDocument();
  });

  it("carrega uma lente existente com os painéis marcados", () => {
    lensStore.save({
      schemaVersion: 1,
      id: "prioridade-2026",
      label: "Prioridade 2026",
      description: "Painéis prioritários do plano de governo.",
      allLabel: "",
      panelIds: ["demografia"],
    });
    renderAt("/admin/lentes/prioridade-2026");

    expect(screen.getByRole("heading", { name: "Editar lente" })).toBeInTheDocument();
    expect(screen.getByLabelText("Id (único)")).toBeDisabled();
    expect(screen.getByLabelText("Id (único)")).toHaveValue("prioridade-2026");
  });

  it("mostra mensagem de não encontrado para um id inexistente", () => {
    renderAt("/admin/lentes/nao-existe");

    expect(screen.getByRole("heading", { name: "Lente não encontrada" })).toBeInTheDocument();
  });
});

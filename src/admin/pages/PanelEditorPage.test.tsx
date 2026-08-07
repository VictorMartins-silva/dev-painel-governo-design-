import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createMemoryRouter, RouterProvider } from "react-router-dom";
import { DataProviderRoot } from "../../data/DataProviderContext";
import { MockDataProvider } from "../../data/mock/MockDataProvider";
import { panelStore } from "../store/PanelStore";
import PanelEditorPage from "./PanelEditorPage";

const provider = new MockDataProvider({ simulateLatency: false });

function renderAt(path: string) {
  const router = createMemoryRouter(
    [
      { path: "/admin", element: <div>Lista de painéis</div> },
      { path: "/admin/paineis", element: <div>Lista de painéis</div> },
      { path: "/admin/paineis/novo", element: <PanelEditorPage /> },
      { path: "/admin/paineis/:id", element: <PanelEditorPage /> },
    ],
    { initialEntries: [path] },
  );

  render(
    <DataProviderRoot provider={provider}>
      <RouterProvider router={router} />
    </DataProviderRoot>,
  );

  return router;
}

describe("PanelEditorPage", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  it("mostra formulário vazio para um novo painel, sem alertas até tentar salvar", async () => {
    renderAt("/admin/paineis/novo");

    expect(screen.getByRole("heading", { name: "Novo painel" })).toBeInTheDocument();
    expect(screen.getByLabelText("Id (slug)")).toBeEnabled();
    expect(screen.getByRole("button", { name: "Salvar" })).toBeEnabled();
    expect(screen.queryAllByRole("alert")).toHaveLength(0);

    const user = userEvent.setup();
    await user.click(screen.getByRole("button", { name: "Salvar" }));

    expect(screen.getAllByRole("alert").length).toBeGreaterThan(0);
  });

  it("carrega um painel existente com os campos preenchidos", async () => {
    renderAt("/admin/paineis/demografia");

    expect(screen.getByRole("heading", { name: "Demografia" })).toBeInTheDocument();
    expect(screen.getByLabelText("Id (slug)")).toHaveValue("demografia");
    expect(screen.getByLabelText("Id (slug)")).toBeDisabled();
    expect(screen.getByRole("button", { name: "Salvar" })).toBeEnabled();
    expect(
      screen.getByRole("radio", { name: "Publicar na Web (público, sem login)" }),
    ).toBeChecked();
  });

  it("troca a dica da URL de embed ao trocar para Secure Embed", async () => {
    const user = userEvent.setup();
    renderAt("/admin/paineis/novo");

    await user.click(
      screen.getByRole("radio", {
        name: "Secure Embed (exige login no Power BI, respeita RLS/OLS)",
      }),
    );

    expect(screen.getByLabelText("URL de incorporação")).toBeInTheDocument();
    expect(screen.getByText(/Incorporar relatório → Site ou portal/)).toBeInTheDocument();
  });

  it("edita metadados de um painel existente e salva as alterações", async () => {
    const user = userEvent.setup();
    renderAt("/admin/paineis/demografia");

    const titleInput = screen.getByLabelText("Título do painel");
    await user.clear(titleInput);
    await user.type(titleInput, "Demografia (revisado)");

    await user.click(screen.getByRole("button", { name: "Salvar" }));

    expect(await screen.findByText("Lista de painéis")).toBeInTheDocument();
    expect(panelStore.get("demografia")?.title).toBe("Demografia (revisado)");
  });

  it("bloqueia salvar e mostra erro quando o id de um novo painel já existe", async () => {
    const user = userEvent.setup();
    renderAt("/admin/paineis/novo");

    await user.type(screen.getByLabelText("Id (slug)"), "demografia");

    expect(screen.getByText(/Já existe um painel com o id/)).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Salvar" }));

    expect(screen.queryByText("Lista de painéis")).not.toBeInTheDocument();
  });

  it("mostra mensagem de não encontrado para um id inexistente", () => {
    renderAt("/admin/paineis/nao-existe");

    expect(screen.getByRole("heading", { name: "Painel não encontrado" })).toBeInTheDocument();
  });

  it("exporta o painel original a partir do editor", async () => {
    const user = userEvent.setup();
    const createObjectURL = vi.fn(() => "blob:mock-url");
    const revokeObjectURL = vi.fn();
    vi.stubGlobal("URL", { ...URL, createObjectURL, revokeObjectURL });
    const clickSpy = vi.spyOn(HTMLAnchorElement.prototype, "click").mockReturnValue(undefined);

    renderAt("/admin/paineis/demografia");
    await user.click(screen.getByRole("button", { name: "Exportar original" }));

    expect(createObjectURL).toHaveBeenCalled();
    expect(clickSpy).toHaveBeenCalled();

    vi.restoreAllMocks();
  });

  it("pede confirmação ao sair sem salvar e respeita a escolha do usuário", async () => {
    const user = userEvent.setup();
    renderAt("/admin/paineis/demografia");

    const titleInput = screen.getByLabelText("Título do painel");
    await user.clear(titleInput);
    await user.type(titleInput, "Demografia (rascunho)");

    const confirmSpy = vi.spyOn(window, "confirm").mockReturnValueOnce(false);
    await user.click(screen.getByRole("link", { name: /Voltar para a lista de painéis/ }));

    expect(confirmSpy).toHaveBeenCalledWith(
      "Sair sem salvar? As alterações feitas neste painel serão perdidas.",
    );
    expect(screen.getByLabelText("Título do painel")).toHaveValue("Demografia (rascunho)");

    confirmSpy.mockReturnValueOnce(true);
    await user.click(screen.getByRole("link", { name: /Voltar para a lista de painéis/ }));

    expect(await screen.findByText("Lista de painéis")).toBeInTheDocument();
  });

  it("não pede confirmação ao sair sem alterações", async () => {
    const user = userEvent.setup();
    const confirmSpy = vi.spyOn(window, "confirm");
    renderAt("/admin/paineis/demografia");

    await user.click(screen.getByRole("link", { name: /Voltar para a lista de painéis/ }));

    expect(confirmSpy).not.toHaveBeenCalled();
    expect(await screen.findByText("Lista de painéis")).toBeInTheDocument();
  });

  it("mostra a pré-visualização quando a URL de embed é válida", async () => {
    renderAt("/admin/paineis/demografia");

    await waitFor(() => expect(screen.getByText("Pré-visualização")).toBeInTheDocument());
  });
});

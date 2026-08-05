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

  it("mostra formulário vazio para um novo painel, com salvar desabilitado", () => {
    renderAt("/admin/paineis/novo");

    expect(screen.getByRole("heading", { name: "Novo painel" })).toBeInTheDocument();
    expect(screen.getByLabelText("Id (slug)")).toBeEnabled();
    expect(screen.getByRole("button", { name: "Salvar" })).toBeDisabled();
    expect(screen.getAllByRole("alert").length).toBeGreaterThan(0);
  });

  it("mostra o preview ao vivo do painel carregado", async () => {
    renderAt("/admin/paineis/demografia");

    await waitFor(() => expect(screen.getByText("Preview ao vivo")).toBeInTheDocument());
    await waitFor(() =>
      expect(screen.queryByText("Configuração de painel inválida")).not.toBeInTheDocument(),
    );
  });

  it("carrega um painel existente com os campos preenchidos", async () => {
    renderAt("/admin/paineis/demografia");

    expect(screen.getByRole("heading", { name: "Demografia" })).toBeInTheDocument();
    expect(screen.getByLabelText("Id (slug)")).toHaveValue("demografia");
    expect(screen.getByLabelText("Id (slug)")).toBeDisabled();
    expect(screen.getByRole("button", { name: "Salvar" })).toBeEnabled();

    await waitFor(() => {
      for (const select of screen.getAllByLabelText("Indicador")) {
        expect(select).not.toBeDisabled();
      }
    });
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
    expect(screen.getByRole("button", { name: "Salvar" })).toBeDisabled();
  });

  it("remover todas as seções de um painel válido bloqueia salvar novamente", async () => {
    const user = userEvent.setup();
    renderAt("/admin/paineis/demografia");

    expect(screen.getByRole("button", { name: "Salvar" })).toBeEnabled();

    let removeSectionButtons = screen.queryAllByRole("button", { name: "Remover seção" });
    while (removeSectionButtons.length > 0) {
      await user.click(removeSectionButtons[0]);
      removeSectionButtons = screen.queryAllByRole("button", { name: "Remover seção" });
    }

    expect(screen.getByRole("button", { name: "Salvar" })).toBeDisabled();
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

  it("recolhe o preview e permite mostrá-lo novamente", async () => {
    const user = userEvent.setup();
    renderAt("/admin/paineis/demografia");

    await waitFor(() => expect(screen.getByText("Preview ao vivo")).toBeInTheDocument());
    await user.click(screen.getByRole("button", { name: "Recolher" }));

    expect(screen.queryByText("Preview ao vivo")).not.toBeInTheDocument();
    expect(screen.getByText("Preview recolhido")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Mostrar preview" }));

    await waitFor(() => expect(screen.getByText("Preview ao vivo")).toBeInTheDocument());
  });

  it("abre o preview em outra aba e volta ao modo inline quando ela é fechada", async () => {
    const user = userEvent.setup();
    const openSpy = vi.spyOn(window, "open").mockReturnValue(null);
    renderAt("/admin/paineis/demografia");

    await waitFor(() => expect(screen.getByText("Preview ao vivo")).toBeInTheDocument());
    await user.click(screen.getByRole("button", { name: "Abrir em nova aba" }));

    expect(openSpy).toHaveBeenCalledWith("/admin/preview", "pg-preview");
    expect(screen.getByText("Preview aberto em outra aba")).toBeInTheDocument();

    const channel = new BroadcastChannel("pg-editor-preview");
    channel.postMessage({ type: "preview-closed" });
    channel.close();

    await waitFor(() => expect(screen.getByText("Preview ao vivo")).toBeInTheDocument());
  });
});

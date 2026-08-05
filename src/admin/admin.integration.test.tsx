import { beforeEach, describe, expect, it, vi } from "vitest";
import { act, render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createMemoryRouter, RouterProvider } from "react-router-dom";
import { DataProviderRoot } from "../data/DataProviderContext";
import { MockDataProvider } from "../data/mock/MockDataProvider";
import AdminPanelsPage from "./pages/AdminPanelsPage";
import PanelEditorPage from "./pages/PanelEditorPage";
import PanelPage from "../app/pages/PanelPage";

const provider = new MockDataProvider({ simulateLatency: false });

function renderAdmin(initialPath: string) {
  const router = createMemoryRouter(
    [
      { path: "/admin", element: <AdminPanelsPage /> },
      { path: "/admin/paineis/novo", element: <PanelEditorPage /> },
      { path: "/admin/paineis/:id", element: <PanelEditorPage /> },
      { path: "/paineis/:id", element: <PanelPage /> },
    ],
    { initialEntries: [initialPath] },
  );

  render(
    <DataProviderRoot provider={provider}>
      <RouterProvider router={router} />
    </DataProviderRoot>,
  );

  return router;
}

async function waitForIndicatorsLoaded() {
  await waitFor(() => {
    for (const select of screen.getAllByLabelText("Indicador")) {
      expect(select).not.toBeDisabled();
    }
  });
}

describe("Fluxo integrado do admin", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("cria um painel do zero, salva e o painel passa a renderizar em /paineis/:id", async () => {
    const user = userEvent.setup();
    const router = renderAdmin("/admin/paineis/novo");

    await user.type(screen.getByLabelText("Id (slug)"), "painel-teste");
    await user.type(screen.getByLabelText("Título do painel"), "Painel de teste");
    await user.type(screen.getByLabelText("Descrição"), "Descrição do painel de teste.");
    await user.type(screen.getByLabelText("Tema"), "Teste");
    await user.type(screen.getByLabelText("Fonte"), "Fonte de teste");
    await user.type(screen.getByLabelText("Período de referência"), "2026");
    await user.type(screen.getByLabelText("Atualizado em"), "2026-08-05");
    await user.type(screen.getByLabelText("Responsável"), "Equipe de Testes");

    await user.click(screen.getByRole("button", { name: "Adicionar seção" }));
    await user.type(screen.getByLabelText("Título da seção"), "Resumo");

    await user.click(screen.getByRole("button", { name: "Adicionar componente" }));
    await user.type(screen.getByLabelText("Título"), "População");
    await waitForIndicatorsLoaded();
    await user.selectOptions(screen.getByLabelText("Indicador"), "populacao_total");

    expect(screen.getByRole("button", { name: "Salvar" })).toBeEnabled();
    await user.click(screen.getByRole("button", { name: "Salvar" }));

    await screen.findByRole("heading", { name: "Painéis" });

    await act(async () => {
      await router.navigate("/paineis/painel-teste");
    });

    expect(await screen.findByRole("heading", { name: "Painel de teste" })).toBeInTheDocument();
    await waitFor(() => expect(screen.getByText("População")).toBeInTheDocument());
  });

  it("edita um painel estático (sombreando-o) e depois restaura a versão original", async () => {
    const user = userEvent.setup();
    renderAdmin("/admin");

    expect(screen.getByText("Demografia")).toBeInTheDocument();
    const originalBadges = screen.getAllByText("Original");
    expect(originalBadges.length).toBeGreaterThan(0);

    const demografiaRow = screen.getByText("Demografia").closest("li");
    if (!demografiaRow) throw new Error("Linha não encontrada");
    await user.click(within(demografiaRow).getByRole("link", { name: "Editar" }));

    const titleInput = await screen.findByLabelText("Título do painel");
    await user.clear(titleInput);
    await user.type(titleInput, "Demografia (editado)");
    await user.click(screen.getByRole("button", { name: "Salvar" }));

    await screen.findByText("Demografia (editado)");
    expect(screen.getByText("Modificado")).toBeInTheDocument();

    vi.spyOn(window, "confirm").mockReturnValue(true);
    const modifiedRow = screen.getByText("Demografia (editado)").closest("li");
    if (!modifiedRow) throw new Error("Linha não encontrada");
    await user.click(within(modifiedRow).getByRole("button", { name: "Restaurar original" }));

    await waitFor(() => expect(screen.getByText("Demografia")).toBeInTheDocument());
    expect(screen.queryByText("Demografia (editado)")).not.toBeInTheDocument();
    vi.restoreAllMocks();
  });
});

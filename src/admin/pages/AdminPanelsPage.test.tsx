import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import type { PanelConfig } from "../../config/schemas/panel.schema";
import { panelStore } from "../store/PanelStore";
import { serializePanelConfig } from "../store/exportImport";
import AdminPanelsPage from "./AdminPanelsPage";

function buildPanel(overrides: Partial<PanelConfig> = {}): PanelConfig {
  return {
    schemaVersion: 1,
    id: "painel-teste",
    title: "Painel de teste",
    description: "Descrição do painel de teste.",
    theme: "Teste",
    tags: [],
    metadata: {
      source: "fonte de teste",
      referencePeriod: "2026",
      updatedAt: "2026-08-04",
      owner: "Equipe de Testes",
    },
    filters: [],
    sections: [
      {
        id: "secao",
        title: "Seção",
        layout: "grid-2",
        components: [
          {
            id: "card",
            type: "indicator-card",
            title: "Indicador",
            metric: "populacao_total",
            format: "integer",
          },
        ],
      },
    ],
    ...overrides,
  };
}

function renderPage() {
  return render(
    <MemoryRouter>
      <AdminPanelsPage />
    </MemoryRouter>,
  );
}

function rowFor(title: string): HTMLElement {
  const element = screen.getByText(title).closest("li");
  if (!element) throw new Error(`Linha não encontrada para "${title}"`);
  return element;
}

describe("AdminPanelsPage", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("lista os painéis estáticos com badge 'Original'", () => {
    renderPage();

    expect(screen.getByText("Trabalho e Emprego")).toBeInTheDocument();
    expect(screen.getByText("Demografia")).toBeInTheDocument();
    expect(screen.getAllByText("Original")).toHaveLength(2);
  });

  it("duplica um painel para um novo id, criando uma entrada 'Novo'", async () => {
    const user = userEvent.setup();
    vi.spyOn(window, "prompt").mockReturnValue("trabalho-emprego-copia");
    renderPage();

    const row = rowFor("Trabalho e Emprego");
    await user.click(within(row).getByRole("button", { name: "Duplicar" }));

    expect(screen.getByText("Trabalho e Emprego (cópia)")).toBeInTheDocument();
    const newRow = rowFor("Trabalho e Emprego (cópia)");
    expect(within(newRow).getByText("Novo")).toBeInTheDocument();
    expect(panelStore.get("trabalho-emprego-copia")).toBeDefined();
  });

  it("bloqueia duplicação quando o id já existe", async () => {
    const user = userEvent.setup();
    vi.spyOn(window, "prompt").mockReturnValue("demografia");
    const alertSpy = vi.spyOn(window, "alert").mockReturnValue(undefined);
    renderPage();

    const row = rowFor("Trabalho e Emprego");
    await user.click(within(row).getByRole("button", { name: "Duplicar" }));

    expect(alertSpy).toHaveBeenCalledWith(expect.stringContaining("demografia"));
    expect(screen.queryByText("Trabalho e Emprego (cópia)")).not.toBeInTheDocument();
  });

  it("restaura um painel modificado e volta a exibi-lo como 'Original'", async () => {
    const user = userEvent.setup();
    panelStore.save(buildPanel({ id: "demografia", title: "Demografia (editado)" }));
    vi.spyOn(window, "confirm").mockReturnValue(true);
    renderPage();

    expect(screen.getByText("Demografia (editado)")).toBeInTheDocument();
    const row = rowFor("Demografia (editado)");
    expect(within(row).getByText("Modificado")).toBeInTheDocument();

    await user.click(within(row).getByRole("button", { name: "Restaurar original" }));

    expect(screen.getByText("Demografia")).toBeInTheDocument();
    expect(screen.queryByText("Demografia (editado)")).not.toBeInTheDocument();
  });

  it("exclui um painel custom, mas não oferece exclusão para painéis estáticos", async () => {
    const user = userEvent.setup();
    panelStore.save(buildPanel({ id: "painel-novo", title: "Painel novo" }));
    vi.spyOn(window, "confirm").mockReturnValue(true);
    renderPage();

    const staticRow = rowFor("Trabalho e Emprego");
    expect(within(staticRow).queryByRole("button", { name: "Excluir" })).not.toBeInTheDocument();

    const customRow = rowFor("Painel novo");
    await user.click(within(customRow).getByRole("button", { name: "Excluir" }));

    expect(screen.queryByText("Painel novo")).not.toBeInTheDocument();
  });

  it("exporta um painel disparando o download do JSON", async () => {
    const user = userEvent.setup();
    const createObjectURL = vi.fn(() => "blob:mock-url");
    const revokeObjectURL = vi.fn();
    vi.stubGlobal("URL", { ...URL, createObjectURL, revokeObjectURL });
    const clickSpy = vi.spyOn(HTMLAnchorElement.prototype, "click").mockReturnValue(undefined);
    renderPage();

    const row = rowFor("Demografia");
    await user.click(within(row).getByRole("button", { name: "Exportar" }));

    expect(createObjectURL).toHaveBeenCalled();
    expect(clickSpy).toHaveBeenCalled();
    expect(revokeObjectURL).toHaveBeenCalledWith("blob:mock-url");
  });

  it("importa um arquivo válido e cria um painel com origin 'Novo'", async () => {
    const user = userEvent.setup();
    const config = buildPanel({ id: "importado", title: "Painel importado" });
    const file = new File([serializePanelConfig(config)], "importado.panel.json", {
      type: "application/json",
    });
    renderPage();

    const input = screen.getByLabelText("Selecionar arquivo de painel para importar");
    await user.upload(input, file);

    expect(await screen.findByText("Painel importado")).toBeInTheDocument();
    const row = rowFor("Painel importado");
    expect(within(row).getByText("Novo")).toBeInTheDocument();
  });

  it("mostra erro e não importa um arquivo com JSON inválido", async () => {
    const user = userEvent.setup();
    const file = new File(["não é json"], "invalido.json", { type: "application/json" });
    renderPage();

    const input = screen.getByLabelText("Selecionar arquivo de painel para importar");
    await user.upload(input, file);

    expect(await screen.findByRole("alert")).toHaveTextContent(/JSON válido/);
  });

  it("pede confirmação antes de sobrescrever um painel existente na importação", async () => {
    const user = userEvent.setup();
    vi.spyOn(window, "confirm").mockReturnValue(false);
    const config = buildPanel({ id: "demografia", title: "Demografia sobrescrita" });
    const file = new File([serializePanelConfig(config)], "demografia.panel.json", {
      type: "application/json",
    });
    renderPage();

    const input = screen.getByLabelText("Selecionar arquivo de painel para importar");
    await user.upload(input, file);

    expect(screen.queryByText("Demografia sobrescrita")).not.toBeInTheDocument();
    expect(screen.getByText("Demografia")).toBeInTheDocument();
  });
});

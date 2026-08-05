import { useState, type ReactNode } from "react";
import { describe, expect, it, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { DataProviderRoot } from "../../data/DataProviderContext";
import { MockDataProvider } from "../../data/mock/MockDataProvider";
import type { ComponentConfig } from "../../config/schemas/components.schema";
import type { EditorAction } from "./editorReducer";
import { createDefaultComponent } from "./editorReducer";
import { ComponentForm } from "./ComponentForm";

const provider = new MockDataProvider({ simulateLatency: false });

function renderWithProvider(children: ReactNode) {
  return render(<DataProviderRoot provider={provider}>{children}</DataProviderRoot>);
}

async function waitForIndicatorsLoaded() {
  await waitFor(() => expect(screen.getByLabelText("Indicador")).not.toBeDisabled());
}

function Harness({ initial }: { initial: ComponentConfig }) {
  const [component, setComponent] = useState(initial);
  function dispatch(action: EditorAction) {
    if (action.kind === "update-component") setComponent(action.component);
  }
  return (
    <ComponentForm
      component={component}
      errors={new Map()}
      errorPrefix="sections.0.components.0"
      dispatch={dispatch}
      sectionIndex={0}
      componentIndex={0}
    />
  );
}

describe("ComponentForm", () => {
  it("despacha update-component-type ao trocar o tipo", async () => {
    const user = userEvent.setup();
    const dispatch = vi.fn();
    const component = createDefaultComponent("indicator-card");
    renderWithProvider(
      <ComponentForm
        component={component}
        errors={new Map()}
        errorPrefix="sections.0.components.0"
        dispatch={dispatch}
        sectionIndex={0}
        componentIndex={0}
      />,
    );

    await user.selectOptions(screen.getByLabelText("Tipo"), "bar-chart");
    expect(dispatch).toHaveBeenCalledWith({
      kind: "update-component-type",
      sectionIndex: 0,
      componentIndex: 0,
      componentType: "bar-chart",
    });
  });

  it("despacha update-component ao editar o título", async () => {
    const user = userEvent.setup();
    const dispatch = vi.fn();
    const component = createDefaultComponent("indicator-card");
    renderWithProvider(
      <ComponentForm
        component={component}
        errors={new Map()}
        errorPrefix="sections.0.components.0"
        dispatch={dispatch}
        sectionIndex={0}
        componentIndex={0}
      />,
    );

    await user.type(screen.getByLabelText("Título"), "X");
    expect(dispatch).toHaveBeenCalledWith({
      kind: "update-component",
      sectionIndex: 0,
      componentIndex: 0,
      component: { ...component, title: "X" },
    });
  });

  it("preenche métrica, indicatorId e formato ao selecionar um indicador para indicator-card", async () => {
    const user = userEvent.setup();
    const dispatch = vi.fn();
    const component = createDefaultComponent("indicator-card");
    renderWithProvider(
      <ComponentForm
        component={component}
        errors={new Map()}
        errorPrefix="sections.0.components.0"
        dispatch={dispatch}
        sectionIndex={0}
        componentIndex={0}
      />,
    );

    await waitForIndicatorsLoaded();
    await user.selectOptions(screen.getByLabelText("Indicador"), "crescimento_populacional");

    expect(dispatch).toHaveBeenCalledWith({
      kind: "update-component",
      sectionIndex: 0,
      componentIndex: 0,
      component: {
        ...component,
        metric: "crescimento_populacional",
        indicatorId: "crescimento_populacional",
        format: "percent",
      },
    });
  });

  it("preenche a dimensão a partir do indicador selecionado para bar-chart", async () => {
    const user = userEvent.setup();
    const dispatch = vi.fn();
    const component = createDefaultComponent("bar-chart");
    renderWithProvider(
      <ComponentForm
        component={component}
        errors={new Map()}
        errorPrefix="sections.0.components.0"
        dispatch={dispatch}
        sectionIndex={0}
        componentIndex={0}
      />,
    );

    await waitForIndicatorsLoaded();
    await user.selectOptions(screen.getByLabelText("Indicador"), "estoque_vinculos");

    expect(dispatch).toHaveBeenCalledWith({
      kind: "update-component",
      sectionIndex: 0,
      componentIndex: 0,
      component: {
        ...component,
        metric: "estoque_vinculos",
        dimension: "setor",
        format: "integer",
      },
    });
  });

  it("carrega colunas do dataset selecionado para data-table", async () => {
    const user = userEvent.setup();
    renderWithProvider(<Harness initial={createDefaultComponent("data-table")} />);

    await waitForIndicatorsLoaded();
    await user.selectOptions(screen.getByLabelText("Indicador"), "populacao_por_territorio");

    await user.click(screen.getByRole("button", { name: "Carregar colunas do dataset" }));

    await waitFor(() => expect(screen.getAllByLabelText("Campo")).toHaveLength(3));
    expect(screen.getAllByLabelText("Campo")[0]).toHaveValue("territorioLabel");
    expect(screen.getAllByLabelText("Rótulo")[0]).toHaveValue("Território");
  });

  it("permite adicionar e remover colunas manualmente em data-table", async () => {
    const user = userEvent.setup();
    const dispatch = vi.fn();
    const component = createDefaultComponent("data-table");
    renderWithProvider(
      <ComponentForm
        component={component}
        errors={new Map()}
        errorPrefix="sections.0.components.0"
        dispatch={dispatch}
        sectionIndex={0}
        componentIndex={0}
      />,
    );

    await user.click(screen.getByRole("button", { name: "Adicionar coluna" }));
    expect(dispatch).toHaveBeenCalledWith({
      kind: "update-component",
      sectionIndex: 0,
      componentIndex: 0,
      component: { ...component, columns: [{ field: "", label: "", type: "text" }] },
    });
  });

  it("mostra erros de validação nos campos do componente", async () => {
    const component = createDefaultComponent("bar-chart");
    const errors = new Map([
      ["sections.0.components.0.title", "Título é obrigatório"],
      ["sections.0.components.0.dimension", "Dimensão é obrigatória"],
    ]);
    renderWithProvider(
      <ComponentForm
        component={component}
        errors={errors}
        errorPrefix="sections.0.components.0"
        dispatch={vi.fn()}
        sectionIndex={0}
        componentIndex={0}
      />,
    );

    expect(screen.getByText("Título é obrigatório")).toBeInTheDocument();
    expect(screen.getByText("Dimensão é obrigatória")).toBeInTheDocument();
    await waitForIndicatorsLoaded();
  });
});

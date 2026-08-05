import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createEmptyPanelDraft } from "./editorReducer";
import { PanelMetadataForm } from "./PanelMetadataForm";

describe("PanelMetadataForm", () => {
  it("exibe os valores do draft e desabilita o id quando não editável", () => {
    const draft = { ...createEmptyPanelDraft(), id: "painel-x", title: "Painel X" };
    render(
      <PanelMetadataForm draft={draft} errors={new Map()} dispatch={vi.fn()} idEditable={false} />,
    );

    expect(screen.getByLabelText("Id (slug)")).toHaveValue("painel-x");
    expect(screen.getByLabelText("Id (slug)")).toBeDisabled();
    expect(screen.getByLabelText("Título do painel")).toHaveValue("Painel X");
  });

  it("despacha set-field ao editar o título", async () => {
    const user = userEvent.setup();
    const dispatch = vi.fn();
    render(
      <PanelMetadataForm
        draft={createEmptyPanelDraft()}
        errors={new Map()}
        dispatch={dispatch}
        idEditable
      />,
    );

    await user.type(screen.getByLabelText("Título do painel"), "X");

    expect(dispatch).toHaveBeenCalledWith({ kind: "set-field", field: "title", value: "X" });
  });

  it("despacha set-tags ao editar o campo de tags", async () => {
    const user = userEvent.setup();
    const dispatch = vi.fn();
    render(
      <PanelMetadataForm
        draft={createEmptyPanelDraft()}
        errors={new Map()}
        dispatch={dispatch}
        idEditable
      />,
    );

    await user.type(screen.getByLabelText("Tags (separadas por vírgula)"), "a,");

    expect(dispatch).toHaveBeenCalledWith({ kind: "set-tags", value: ["a"] });
  });

  it("despacha set-metadata-field ao editar a fonte", async () => {
    const user = userEvent.setup();
    const dispatch = vi.fn();
    render(
      <PanelMetadataForm
        draft={createEmptyPanelDraft()}
        errors={new Map()}
        dispatch={dispatch}
        idEditable
      />,
    );

    await user.type(screen.getByLabelText("Fonte"), "X");

    expect(dispatch).toHaveBeenCalledWith({
      kind: "set-metadata-field",
      field: "source",
      value: "X",
    });
  });

  it("mostra mensagens de erro por campo", () => {
    const errors = new Map([["title", "Título é obrigatório"]]);
    render(
      <PanelMetadataForm
        draft={createEmptyPanelDraft()}
        errors={errors}
        dispatch={vi.fn()}
        idEditable
      />,
    );

    expect(screen.getByText("Título é obrigatório")).toBeInTheDocument();
  });
});

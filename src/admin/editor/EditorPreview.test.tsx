import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { act, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { DataProviderRoot } from "../../data/DataProviderContext";
import { MockDataProvider } from "../../data/mock/MockDataProvider";
import { createEmptyPanelDraft } from "./editorReducer";
import { EditorPreview } from "./EditorPreview";

const provider = new MockDataProvider({ simulateLatency: false });

function renderPreview(draft: ReturnType<typeof createEmptyPanelDraft>) {
  return render(
    <MemoryRouter>
      <DataProviderRoot provider={provider}>
        <EditorPreview draft={draft} />
      </DataProviderRoot>
    </MemoryRouter>,
  );
}

describe("EditorPreview", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("mostra um aviso amigável em vez do erro estruturado quando o painel está vazio", () => {
    renderPreview(createEmptyPanelDraft());
    act(() => vi.advanceTimersByTime(300));

    expect(
      screen.getByText("Preencha os campos obrigatórios para visualizar o preview."),
    ).toBeInTheDocument();
    expect(screen.queryByText("Configuração de painel inválida")).not.toBeInTheDocument();
  });

  it("só aplica alterações do draft ao preview após o debounce", () => {
    const draft = { ...createEmptyPanelDraft(), id: "x", title: "Painel" };
    const { rerender } = renderPreview(draft);

    const updated = { ...draft, title: "Painel atualizado" };
    rerender(
      <MemoryRouter>
        <DataProviderRoot provider={provider}>
          <EditorPreview draft={updated} />
        </DataProviderRoot>
      </MemoryRouter>,
    );

    expect(screen.getByText("Atualizando…")).toBeInTheDocument();

    act(() => vi.advanceTimersByTime(300));

    expect(screen.queryByText("Atualizando…")).not.toBeInTheDocument();
  });
});

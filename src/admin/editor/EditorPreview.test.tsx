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

  it("renderiza a config inválida do painel vazio como erro estruturado", () => {
    renderPreview(createEmptyPanelDraft());
    act(() => vi.advanceTimersByTime(300));

    expect(screen.getByText("Configuração de painel inválida")).toBeInTheDocument();
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

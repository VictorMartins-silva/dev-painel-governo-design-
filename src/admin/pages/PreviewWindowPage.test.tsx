import { describe, expect, it } from "vitest";
import { act, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { DataProviderRoot } from "../../data/DataProviderContext";
import { MockDataProvider } from "../../data/mock/MockDataProvider";
import { panelStore } from "../store/PanelStore";
import type { PreviewChannelMessage } from "../editor/usePreviewChannel";
import PreviewWindowPage from "./PreviewWindowPage";

const provider = new MockDataProvider({ simulateLatency: false });

function renderPage() {
  return render(
    <MemoryRouter>
      <DataProviderRoot provider={provider}>
        <PreviewWindowPage />
      </DataProviderRoot>
    </MemoryRouter>,
  );
}

describe("PreviewWindowPage", () => {
  it("mostra estado de espera até receber um draft do editor", () => {
    renderPage();

    expect(screen.getByText("Aguardando dados do editor…")).toBeInTheDocument();
  });

  it("renderiza o painel recebido pelo canal de sincronização", async () => {
    renderPage();

    const draft = panelStore.get("demografia");
    if (!draft) throw new Error("fixture demografia não encontrada");
    if (draft.kind !== "native") throw new Error("fixture demografia deveria ser nativa");
    const channel = new BroadcastChannel("pg-editor-preview");
    act(() => {
      channel.postMessage({ type: "draft", draft } satisfies PreviewChannelMessage);
    });
    channel.close();

    await waitFor(() => expect(screen.queryByText("Aguardando editor…")).not.toBeInTheDocument());
    expect(screen.getByRole("heading", { name: draft.title })).toBeInTheDocument();
  });
});

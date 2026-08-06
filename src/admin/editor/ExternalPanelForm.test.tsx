import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createEmptyExternalPanelDraft } from "./externalPanelDraft";
import { ExternalPanelForm } from "./ExternalPanelForm";
import { ValidationDisplayProvider } from "./ValidationDisplayContext";

const ALLOWED_DOMAINS = ["app.powerbi.com"];

describe("ExternalPanelForm", () => {
  it("exibe os valores do draft e desabilita o id quando não editável", () => {
    const draft = { ...createEmptyExternalPanelDraft(), id: "painel-x", title: "Painel X" };
    render(
      <ExternalPanelForm
        draft={draft}
        errors={new Map()}
        allowedEmbedDomains={ALLOWED_DOMAINS}
        idEditable={false}
        onChange={vi.fn()}
      />,
    );

    expect(screen.getByLabelText("Id (slug)")).toHaveValue("painel-x");
    expect(screen.getByLabelText("Id (slug)")).toBeDisabled();
    expect(screen.getByLabelText("Título do painel")).toHaveValue("Painel X");
  });

  it("chama onChange com o título atualizado", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(
      <ExternalPanelForm
        draft={createEmptyExternalPanelDraft()}
        errors={new Map()}
        allowedEmbedDomains={ALLOWED_DOMAINS}
        idEditable
        onChange={onChange}
      />,
    );

    await user.type(screen.getByLabelText("Título do painel"), "X");

    expect(onChange).toHaveBeenCalledWith(expect.objectContaining({ title: "X" }));
  });

  it("mostra erro quando a URL aponta para um domínio fora da allowlist", () => {
    const draft = {
      ...createEmptyExternalPanelDraft(),
      embed: { provider: "powerbi-public" as const, url: "https://malicioso.example.com/x" },
    };
    render(
      <ValidationDisplayProvider forceShow>
        <ExternalPanelForm
          draft={draft}
          errors={new Map()}
          allowedEmbedDomains={ALLOWED_DOMAINS}
          idEditable
          onChange={vi.fn()}
        />
      </ValidationDisplayProvider>,
    );

    expect(screen.getByText(/domínio/)).toBeInTheDocument();
  });

  it("mostra a pré-visualização em iframe quando a URL é válida e permitida", () => {
    const draft = {
      ...createEmptyExternalPanelDraft(),
      title: "Painel X",
      embed: { provider: "powerbi-public" as const, url: "https://app.powerbi.com/view?r=abc" },
    };
    render(
      <ExternalPanelForm
        draft={draft}
        errors={new Map()}
        allowedEmbedDomains={ALLOWED_DOMAINS}
        idEditable
        onChange={vi.fn()}
      />,
    );

    const preview = screen.getByTitle("Pré-visualização: Painel X");
    expect(preview.tagName).toBe("IFRAME");
    expect(preview).toHaveAttribute("src", draft.embed.url);
  });

  it("não mostra a pré-visualização quando não há URL preenchida", () => {
    render(
      <ExternalPanelForm
        draft={createEmptyExternalPanelDraft()}
        errors={new Map()}
        allowedEmbedDomains={ALLOWED_DOMAINS}
        idEditable
        onChange={vi.fn()}
      />,
    );

    expect(screen.queryByText("Pré-visualização")).not.toBeInTheDocument();
  });
});

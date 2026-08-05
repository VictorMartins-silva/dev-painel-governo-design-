import { describe, expect, it } from "vitest";
import {
  createDefaultComponent,
  createDefaultFilter,
  createDefaultSection,
  createEditorState,
  createEmptyPanelDraft,
  editorReducer,
  type EditorState,
} from "./editorReducer";
import type { PanelConfig } from "../../config/schemas/panel.schema";

function baseState(): EditorState {
  return createEditorState();
}

describe("createEditorState", () => {
  it("cria um draft vazio quando nenhuma config é fornecida", () => {
    const state = createEditorState();
    expect(state.draft.id).toBe("");
    expect(state.draft.sections).toHaveLength(0);
    expect(state.originalId).toBeNull();
  });

  it("usa a config existente como draft inicial", () => {
    const config = createEmptyPanelDraft();
    config.id = "existente";
    const state = createEditorState(config);
    expect(state.draft).toBe(config);
    expect(state.originalId).toBe("existente");
  });
});

describe("editorReducer — campos do painel", () => {
  it("atualiza campos simples do painel", () => {
    const state = editorReducer(baseState(), {
      kind: "set-field",
      field: "title",
      value: "Novo título",
    });
    expect(state.draft.title).toBe("Novo título");
  });

  it("atualiza tags", () => {
    const state = editorReducer(baseState(), { kind: "set-tags", value: ["a", "b"] });
    expect(state.draft.tags).toEqual(["a", "b"]);
  });

  it("atualiza campos de metadata sem afetar outros campos", () => {
    const state = editorReducer(baseState(), {
      kind: "set-metadata-field",
      field: "owner",
      value: "Equipe X",
    });
    expect(state.draft.metadata.owner).toBe("Equipe X");
    expect(state.draft.metadata.source).toBe("");
  });
});

describe("editorReducer — filtros", () => {
  it("adiciona, atualiza e remove filtros", () => {
    let state = editorReducer(baseState(), { kind: "add-filter" });
    expect(state.draft.filters).toHaveLength(1);

    const filter = createDefaultFilter("period");
    state = editorReducer(state, { kind: "update-filter", index: 0, filter });
    expect(state.draft.filters[0]).toEqual(filter);

    state = editorReducer(state, { kind: "remove-filter", index: 0 });
    expect(state.draft.filters).toHaveLength(0);
  });

  it("reordena filtros e ignora movimento fora dos limites", () => {
    let state = baseState();
    state = editorReducer(state, { kind: "add-filter" });
    state = editorReducer(state, { kind: "add-filter" });
    const [first, second] = state.draft.filters;

    state = editorReducer(state, { kind: "move-filter", index: 1, direction: "up" });
    expect(state.draft.filters[0].id).toBe(second.id);
    expect(state.draft.filters[1].id).toBe(first.id);

    const unchanged = editorReducer(state, { kind: "move-filter", index: 0, direction: "up" });
    expect(unchanged.draft.filters).toEqual(state.draft.filters);
  });
});

describe("editorReducer — seções e componentes", () => {
  it("adiciona e remove seções", () => {
    let state = editorReducer(baseState(), { kind: "add-section" });
    expect(state.draft.sections).toHaveLength(1);

    state = editorReducer(state, { kind: "update-section-title", index: 0, value: "Seção 1" });
    expect(state.draft.sections[0].title).toBe("Seção 1");

    state = editorReducer(state, { kind: "update-section-layout", index: 0, value: "grid-3" });
    expect(state.draft.sections[0].layout).toBe("grid-3");

    state = editorReducer(state, { kind: "remove-section", index: 0 });
    expect(state.draft.sections).toHaveLength(0);
  });

  it("reordena seções", () => {
    let state = baseState();
    state = editorReducer(state, { kind: "add-section" });
    state = editorReducer(state, { kind: "add-section" });
    const [first, second] = state.draft.sections;

    state = editorReducer(state, { kind: "move-section", index: 0, direction: "down" });
    expect(state.draft.sections[0].id).toBe(second.id);
    expect(state.draft.sections[1].id).toBe(first.id);
  });

  it("adiciona, atualiza título, muda tipo preservando id/título e remove componentes", () => {
    let state = editorReducer(baseState(), { kind: "add-section" });
    state = editorReducer(state, {
      kind: "add-component",
      sectionIndex: 0,
      componentType: "indicator-card",
    });
    const created = state.draft.sections[0].components[0];
    expect(created.type).toBe("indicator-card");

    state = editorReducer(state, {
      kind: "update-component",
      sectionIndex: 0,
      componentIndex: 0,
      component: { ...created, title: "Meu componente" },
    });
    expect(state.draft.sections[0].components[0].title).toBe("Meu componente");

    state = editorReducer(state, {
      kind: "update-component-type",
      sectionIndex: 0,
      componentIndex: 0,
      componentType: "bar-chart",
    });
    const changed = state.draft.sections[0].components[0];
    expect(changed.type).toBe("bar-chart");
    expect(changed.id).toBe(created.id);
    expect(changed.title).toBe("Meu componente");

    state = editorReducer(state, { kind: "remove-component", sectionIndex: 0, componentIndex: 0 });
    expect(state.draft.sections[0].components).toHaveLength(0);
  });

  it("reordena componentes dentro de uma seção", () => {
    let state = editorReducer(baseState(), { kind: "add-section" });
    state = editorReducer(state, {
      kind: "add-component",
      sectionIndex: 0,
      componentType: "indicator-card",
    });
    state = editorReducer(state, {
      kind: "add-component",
      sectionIndex: 0,
      componentType: "time-series",
    });
    const [first, second] = state.draft.sections[0].components;

    state = editorReducer(state, {
      kind: "move-component",
      sectionIndex: 0,
      componentIndex: 0,
      direction: "down",
    });
    expect(state.draft.sections[0].components[0].id).toBe(second.id);
    expect(state.draft.sections[0].components[1].id).toBe(first.id);
  });
});

describe("factories", () => {
  it("createDefaultSection produz uma seção vazia válida estruturalmente", () => {
    const section = createDefaultSection();
    expect(section.components).toEqual([]);
    expect(section.layout).toBe("grid-2");
  });

  it("createDefaultComponent produz campos obrigatórios por tipo", () => {
    const card = createDefaultComponent("indicator-card");
    const table = createDefaultComponent("data-table");
    expect(card).toMatchObject({ type: "indicator-card", format: "integer" });
    expect(table).toMatchObject({ type: "data-table", columns: [] });
  });

  it("createEmptyPanelDraft satisfaz o formato de PanelConfig", () => {
    const draft: PanelConfig = createEmptyPanelDraft();
    expect(draft.schemaVersion).toBe(1);
    expect(draft.filters).toEqual([]);
  });
});

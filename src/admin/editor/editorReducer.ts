import {
  SUPPORTED_SCHEMA_VERSION,
  type PanelConfig,
  type PanelSectionConfig,
} from "../../config/schemas/panel.schema";
import type { FilterConfig, FilterType } from "../../config/schemas/filters.schema";
import type { ComponentConfig, ComponentType } from "../../config/schemas/components.schema";
import type { PanelLayout } from "../../domain/types";

function generateId(prefix: string): string {
  return `${prefix}-${Math.random().toString(36).slice(2, 9)}`;
}

export function createDefaultFilter(type: FilterType = "single-select"): FilterConfig {
  const id = generateId("filtro");
  const label = "";
  const dataField = "";

  switch (type) {
    case "single-select":
      return { id, type, label, dataField };
    case "multi-select":
      return { id, type, label, dataField };
    case "period":
      return { id, type, label, dataField };
  }
}

export function createDefaultComponent(type: ComponentType): ComponentConfig {
  const id = generateId("componente");
  const title = "";

  switch (type) {
    case "indicator-card":
      return { id, type, title, metric: "", format: "integer" };
    case "time-series":
      return { id, type, title, metric: "" };
    case "bar-chart":
      return { id, type, title, metric: "", dimension: "", orientation: "vertical", sort: "none" };
    case "data-table":
      return { id, type, title, dataset: "", columns: [] };
  }
}

export function createDefaultSection(): PanelSectionConfig {
  return { id: generateId("secao"), title: "", layout: "grid-2", components: [] };
}

export function createEmptyPanelDraft(): PanelConfig {
  return {
    schemaVersion: SUPPORTED_SCHEMA_VERSION,
    id: "",
    title: "",
    description: "",
    theme: "",
    tags: [],
    metadata: { source: "", owner: "" },
    filters: [],
    sections: [],
  };
}

export type EditorState = {
  draft: PanelConfig;
  originalId: string | null;
};

export function createEditorState(config?: PanelConfig): EditorState {
  return { draft: config ?? createEmptyPanelDraft(), originalId: config?.id ?? null };
}

type ReorderDirection = "up" | "down";

function reorder<T>(list: T[], index: number, direction: ReorderDirection): T[] {
  const targetIndex = direction === "up" ? index - 1 : index + 1;
  if (targetIndex < 0 || targetIndex >= list.length) return list;
  const next = [...list];
  [next[index], next[targetIndex]] = [next[targetIndex], next[index]];
  return next;
}

function updateAt<T>(list: T[], index: number, update: (item: T) => T): T[] {
  return list.map((item, i) => (i === index ? update(item) : item));
}

export type EditorAction =
  | { kind: "set-field"; field: "id" | "title" | "description" | "theme"; value: string }
  | { kind: "set-tags"; value: string[] }
  | { kind: "set-metadata-field"; field: keyof PanelConfig["metadata"]; value: string }
  | { kind: "add-filter" }
  | { kind: "update-filter"; index: number; filter: FilterConfig }
  | { kind: "remove-filter"; index: number }
  | { kind: "move-filter"; index: number; direction: ReorderDirection }
  | { kind: "add-section" }
  | { kind: "update-section-title"; index: number; value: string }
  | { kind: "update-section-layout"; index: number; value: PanelLayout }
  | { kind: "remove-section"; index: number }
  | { kind: "move-section"; index: number; direction: ReorderDirection }
  | { kind: "add-component"; sectionIndex: number; componentType: ComponentType }
  | {
      kind: "update-component-type";
      sectionIndex: number;
      componentIndex: number;
      componentType: ComponentType;
    }
  | {
      kind: "update-component";
      sectionIndex: number;
      componentIndex: number;
      component: ComponentConfig;
    }
  | { kind: "remove-component"; sectionIndex: number; componentIndex: number }
  | {
      kind: "move-component";
      sectionIndex: number;
      componentIndex: number;
      direction: ReorderDirection;
    };

export function editorReducer(state: EditorState, action: EditorAction): EditorState {
  const { draft } = state;

  switch (action.kind) {
    case "set-field":
      return { ...state, draft: { ...draft, [action.field]: action.value } };

    case "set-tags":
      return { ...state, draft: { ...draft, tags: action.value } };

    case "set-metadata-field":
      return {
        ...state,
        draft: { ...draft, metadata: { ...draft.metadata, [action.field]: action.value } },
      };

    case "add-filter":
      return { ...state, draft: { ...draft, filters: [...draft.filters, createDefaultFilter()] } };

    case "update-filter":
      return {
        ...state,
        draft: { ...draft, filters: updateAt(draft.filters, action.index, () => action.filter) },
      };

    case "remove-filter":
      return {
        ...state,
        draft: { ...draft, filters: draft.filters.filter((_, i) => i !== action.index) },
      };

    case "move-filter":
      return {
        ...state,
        draft: { ...draft, filters: reorder(draft.filters, action.index, action.direction) },
      };

    case "add-section":
      return {
        ...state,
        draft: { ...draft, sections: [...draft.sections, createDefaultSection()] },
      };

    case "update-section-title":
      return {
        ...state,
        draft: {
          ...draft,
          sections: updateAt(draft.sections, action.index, (section) => ({
            ...section,
            title: action.value,
          })),
        },
      };

    case "update-section-layout":
      return {
        ...state,
        draft: {
          ...draft,
          sections: updateAt(draft.sections, action.index, (section) => ({
            ...section,
            layout: action.value,
          })),
        },
      };

    case "remove-section":
      return {
        ...state,
        draft: { ...draft, sections: draft.sections.filter((_, i) => i !== action.index) },
      };

    case "move-section":
      return {
        ...state,
        draft: { ...draft, sections: reorder(draft.sections, action.index, action.direction) },
      };

    case "add-component":
      return {
        ...state,
        draft: {
          ...draft,
          sections: updateAt(draft.sections, action.sectionIndex, (section) => ({
            ...section,
            components: [...section.components, createDefaultComponent(action.componentType)],
          })),
        },
      };

    case "update-component-type":
      return {
        ...state,
        draft: {
          ...draft,
          sections: updateAt(draft.sections, action.sectionIndex, (section) => ({
            ...section,
            components: updateAt(section.components, action.componentIndex, (component) => ({
              ...createDefaultComponent(action.componentType),
              id: component.id,
              title: component.title,
            })),
          })),
        },
      };

    case "update-component":
      return {
        ...state,
        draft: {
          ...draft,
          sections: updateAt(draft.sections, action.sectionIndex, (section) => ({
            ...section,
            components: updateAt(section.components, action.componentIndex, () => action.component),
          })),
        },
      };

    case "remove-component":
      return {
        ...state,
        draft: {
          ...draft,
          sections: updateAt(draft.sections, action.sectionIndex, (section) => ({
            ...section,
            components: section.components.filter((_, i) => i !== action.componentIndex),
          })),
        },
      };

    case "move-component":
      return {
        ...state,
        draft: {
          ...draft,
          sections: updateAt(draft.sections, action.sectionIndex, (section) => ({
            ...section,
            components: reorder(section.components, action.componentIndex, action.direction),
          })),
        },
      };
  }
}

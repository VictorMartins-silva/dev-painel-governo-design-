export type RequestStatus = "loading" | "success" | "empty" | "error";

/** Espelha a tabela de monitoramento de atualizações do Fabric para um painel. */
export type PanelFreshness = {
  referencePeriod?: string;
  updatedAt?: string;
};

export type RequestState<T> =
  | { status: "loading"; data: undefined }
  | { status: "success"; data: T }
  | { status: "empty"; data: undefined }
  | { status: "error"; data: undefined; error: string };

/** Presets de grade reutilizados pelo `PanelGrid` (catálogo, home) — genéricos, não específicos
 *  de um formato de painel. */
export const PANEL_LAYOUTS = ["grid-2", "grid-3", "grid-4", "stack"] as const;
export type PanelLayout = (typeof PANEL_LAYOUTS)[number];

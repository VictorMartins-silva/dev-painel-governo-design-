import type { PanelFreshness } from "../domain/types";
import type { PanelConfig, EmbedProvider } from "../config/schemas/panel.schema";

export type PanelSummary = {
  id: string;
  title: string;
  description: string;
  theme: string;
  tags: string[];
  source: string;
  updatedAt: string;
  embedProvider: EmbedProvider;
};

export type DataProvider = {
  listPanels(): Promise<PanelSummary[]>;
  getPanelConfig(panelId: string): Promise<PanelConfig>;
  getPanelFreshness(panelId: string): Promise<PanelFreshness>;
};

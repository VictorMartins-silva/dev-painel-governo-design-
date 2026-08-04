import type { PanelConfig } from "../schemas/panel.schema";
import { trabalhoEmprego } from "./trabalho-emprego.panel";
import { demografia } from "./demografia.panel";

export const panelRegistry: PanelConfig[] = [trabalhoEmprego, demografia];

export function findPanelConfig(panelId: string): PanelConfig | undefined {
  return panelRegistry.find((panel) => panel.id === panelId);
}

import { SUPPORTED_SCHEMA_VERSION, type PanelConfig } from "../../config/schemas/panel.schema";

export function createEmptyPanelDraft(): PanelConfig {
  return {
    schemaVersion: SUPPORTED_SCHEMA_VERSION,
    id: "",
    title: "",
    description: "",
    theme: "",
    tags: [],
    metadata: { source: "", owner: "" },
    presentation: "default",
    embed: { provider: "powerbi-public", url: "" },
  };
}

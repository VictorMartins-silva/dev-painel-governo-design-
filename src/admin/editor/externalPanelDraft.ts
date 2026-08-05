import {
  SUPPORTED_SCHEMA_VERSION,
  type ExternalPanelConfig,
} from "../../config/schemas/panel.schema";

export function createEmptyExternalPanelDraft(): ExternalPanelConfig {
  return {
    schemaVersion: SUPPORTED_SCHEMA_VERSION,
    kind: "external",
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

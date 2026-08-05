import { z } from "zod";
import { PANEL_LAYOUTS } from "../../domain/types";
import { filterConfigSchema } from "./filters.schema";
import { componentConfigSchema } from "./components.schema";

export const SUPPORTED_SCHEMA_VERSION = 1;

const panelMetadataSchema = z.object({
  source: z.string().min(1),
  owner: z.string().min(1),
  methodologyNote: z.string().optional(),
});

export const panelSectionSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  layout: z.enum(PANEL_LAYOUTS),
  components: z.array(componentConfigSchema).min(1),
});

const panelBaseSchema = {
  schemaVersion: z.literal(SUPPORTED_SCHEMA_VERSION),
  id: z.string().min(1),
  title: z.string().min(1),
  description: z.string().min(1),
  theme: z.string().min(1),
  tags: z.array(z.string()).default([]),
  metadata: panelMetadataSchema,
};

export const nativePanelConfigSchema = z.object({
  ...panelBaseSchema,
  kind: z.literal("native"),
  filters: z.array(filterConfigSchema).default([]),
  sections: z.array(panelSectionSchema).min(1),
});

/** Provedores de embed suportados; hoje só "Publicar na web" do Power BI. */
export const EMBED_PROVIDERS = ["powerbi-public"] as const;
export type EmbedProvider = (typeof EMBED_PROVIDERS)[number];

export const embedConfigSchema = z.object({
  provider: z.enum(EMBED_PROVIDERS),
  url: z.string().min(1),
});

export const externalPanelConfigSchema = z.object({
  ...panelBaseSchema,
  kind: z.literal("external"),
  embed: embedConfigSchema,
});

const panelConfigUnionSchema = z.discriminatedUnion("kind", [
  nativePanelConfigSchema,
  externalPanelConfigSchema,
]);

/** Configurações antigas sem `kind` são tratadas como `native` (retrocompatibilidade com o overlay do localStorage). */
export const panelConfigSchema = z.preprocess((input) => {
  if (input && typeof input === "object" && !("kind" in (input as Record<string, unknown>))) {
    return { ...(input as Record<string, unknown>), kind: "native" };
  }
  return input;
}, panelConfigUnionSchema);

export type PanelSectionConfig = z.infer<typeof panelSectionSchema>;
export type EmbedConfig = z.infer<typeof embedConfigSchema>;
export type NativePanelConfig = z.infer<typeof nativePanelConfigSchema>;
export type ExternalPanelConfig = z.infer<typeof externalPanelConfigSchema>;
export type PanelConfig = z.infer<typeof panelConfigUnionSchema>;
export type PanelKind = PanelConfig["kind"];

export function parsePanelConfig(input: unknown) {
  return panelConfigSchema.safeParse(input);
}

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

export const panelConfigSchema = z.object({
  schemaVersion: z.literal(SUPPORTED_SCHEMA_VERSION),
  id: z.string().min(1),
  title: z.string().min(1),
  description: z.string().min(1),
  theme: z.string().min(1),
  tags: z.array(z.string()).default([]),
  metadata: panelMetadataSchema,
  filters: z.array(filterConfigSchema).default([]),
  sections: z.array(panelSectionSchema).min(1),
});

export type PanelSectionConfig = z.infer<typeof panelSectionSchema>;
export type PanelConfig = z.infer<typeof panelConfigSchema>;

export function parsePanelConfig(input: unknown) {
  return panelConfigSchema.safeParse(input);
}

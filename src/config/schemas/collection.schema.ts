import { z } from "zod";

export const SUPPORTED_COLLECTION_SCHEMA_VERSION = 1;

export const collectionPanelRefSchema = z.object({
  panelId: z.string().min(1),
  /** Sobrescreve o `timerSeconds` da coleção só para este painel. */
  timerSeconds: z.number().int().positive().optional(),
});

export const collectionConfigSchema = z.object({
  schemaVersion: z.literal(SUPPORTED_COLLECTION_SCHEMA_VERSION),
  id: z.string().min(1),
  title: z.string().min(1),
  description: z.string().min(1),
  /** Tempo padrão de exibição de cada painel, em segundos. */
  timerSeconds: z.number().int().positive().default(45),
  /** A cada N voltas completas na coleção, os painéis são remontados (dados/iframes atualizados). */
  refreshEveryCycles: z.number().int().positive().default(1),
  panels: z.array(collectionPanelRefSchema).min(1),
});

export type CollectionPanelRef = z.infer<typeof collectionPanelRefSchema>;
export type CollectionConfig = z.infer<typeof collectionConfigSchema>;

export function parseCollectionConfig(input: unknown) {
  return collectionConfigSchema.safeParse(input);
}

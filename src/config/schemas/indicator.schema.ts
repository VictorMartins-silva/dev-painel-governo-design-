import { z } from "zod";
import { FORMAT_TYPES } from "../../domain/types";

export const INDICATOR_SHAPES = ["metric", "categorical", "table"] as const;
export type IndicatorShape = (typeof INDICATOR_SHAPES)[number];

export const indicatorCatalogEntrySchema = z.object({
  // identidade
  id: z.string().min(1, "Campo obrigatório"),
  name: z.string().min(1, "Campo obrigatório"),
  unit: z.string().min(1, "Campo obrigatório"),
  source: z.string().min(1, "Campo obrigatório"),

  // governança
  definition: z.string().min(1, "Campo obrigatório"),
  periodicity: z.string().min(1, "Campo obrigatório"),
  granularity: z.string().min(1, "Campo obrigatório"),
  owner: z.string().min(1, "Campo obrigatório"),
  updatedAt: z.string().min(1, "Campo obrigatório"),
  formula: z.string().optional(),
  limitations: z.string().optional(),

  // técnico — determina os tipos de componente compatíveis
  shapes: z.array(z.enum(INDICATOR_SHAPES)).min(1, "Selecione pelo menos um formato"),
  dimensions: z.array(z.string()).default([]),
  datasets: z.array(z.string()).default([]),
  defaultFormat: z.enum(FORMAT_TYPES).optional(),

  // taxonomia para o índice público
  theme: z.string().optional(),
  tags: z.array(z.string()).default([]),
});

export type IndicatorCatalogEntry = z.infer<typeof indicatorCatalogEntrySchema>;

export type InvalidIndicatorEntry = {
  raw: unknown;
  issues: string[];
};

export type IndicatorCatalog = {
  entries: IndicatorCatalogEntry[];
  invalid: InvalidIndicatorEntry[];
};

export function parseIndicatorCatalog(input: unknown[]): IndicatorCatalog {
  const entries: IndicatorCatalogEntry[] = [];
  const invalid: InvalidIndicatorEntry[] = [];

  for (const raw of input) {
    const result = indicatorCatalogEntrySchema.safeParse(raw);
    if (result.success) {
      entries.push(result.data);
    } else {
      invalid.push({ raw, issues: result.error.issues.map((issue) => issue.message) });
    }
  }

  return { entries, invalid };
}

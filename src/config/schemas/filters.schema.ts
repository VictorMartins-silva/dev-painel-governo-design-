import { z } from "zod";

const baseFilterFields = {
  id: z.string().min(1),
  label: z.string().min(1),
  dataField: z.string().min(1),
};

export const singleSelectFilterSchema = z.object({
  ...baseFilterFields,
  type: z.literal("single-select"),
});

export const multiSelectFilterSchema = z.object({
  ...baseFilterFields,
  type: z.literal("multi-select"),
});

export const periodFilterSchema = z.object({
  ...baseFilterFields,
  type: z.literal("period"),
});

export const filterConfigSchema = z.discriminatedUnion("type", [
  singleSelectFilterSchema,
  multiSelectFilterSchema,
  periodFilterSchema,
]);

export type FilterConfig = z.infer<typeof filterConfigSchema>;
export type FilterType = FilterConfig["type"];

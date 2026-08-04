import { z } from "zod";
import { FORMAT_TYPES } from "../../domain/types";

const formatSchema = z.enum(FORMAT_TYPES);

const baseComponentFields = {
  id: z.string().min(1),
  title: z.string().min(1),
};

export const indicatorCardConfigSchema = z.object({
  ...baseComponentFields,
  type: z.literal("indicator-card"),
  metric: z.string().min(1),
  format: formatSchema,
  comparison: z.enum(["previous-period", "previous-year", "none"]).optional(),
  indicatorId: z.string().min(1).optional(),
});

export const timeSeriesConfigSchema = z.object({
  ...baseComponentFields,
  type: z.literal("time-series"),
  metric: z.string().min(1),
  dimension: z.string().min(1).optional(),
  format: formatSchema.optional(),
});

export const barChartConfigSchema = z.object({
  ...baseComponentFields,
  type: z.literal("bar-chart"),
  metric: z.string().min(1),
  dimension: z.string().min(1),
  orientation: z.enum(["horizontal", "vertical"]).default("vertical"),
  sort: z.enum(["asc", "desc", "none"]).default("none"),
  format: formatSchema.optional(),
});

export const dataTableColumnSchema = z.object({
  field: z.string().min(1),
  label: z.string().min(1),
  type: formatSchema,
});

export const dataTableConfigSchema = z.object({
  ...baseComponentFields,
  type: z.literal("data-table"),
  dataset: z.string().min(1),
  columns: z.array(dataTableColumnSchema).min(1),
  limit: z.number().int().positive().optional(),
});

export const componentConfigSchema = z.discriminatedUnion("type", [
  indicatorCardConfigSchema,
  timeSeriesConfigSchema,
  barChartConfigSchema,
  dataTableConfigSchema,
]);

export type IndicatorCardConfig = z.infer<typeof indicatorCardConfigSchema>;
export type TimeSeriesConfig = z.infer<typeof timeSeriesConfigSchema>;
export type BarChartConfig = z.infer<typeof barChartConfigSchema>;
export type DataTableConfig = z.infer<typeof dataTableConfigSchema>;
export type ComponentConfig = z.infer<typeof componentConfigSchema>;
export type ComponentType = ComponentConfig["type"];

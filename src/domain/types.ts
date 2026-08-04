export type RequestStatus = "loading" | "success" | "empty" | "error";

export type DataEnvelope<T> = {
  data: T;
  metadata: {
    source?: string;
    updatedAt?: string;
    referencePeriod?: string;
  };
};

export type ComparisonDirection = "up" | "down" | "stable";

export type IndicatorData = {
  value: number | null;
  formattedValue?: string;
  unit?: string;
  comparison?: {
    value: number;
    direction: ComparisonDirection;
    referenceLabel: string;
  };
  referencePeriod?: string;
  source?: string;
  updatedAt?: string;
};

export type TimeSeriesPoint = {
  period: string;
  value: number | null;
  series?: string;
};

export type CategoricalPoint = {
  category: string;
  value: number | null;
  series?: string;
};

export const FORMAT_TYPES = ["text", "integer", "decimal", "percent", "currency", "date"] as const;
export type FormatType = (typeof FORMAT_TYPES)[number];

export type TableColumn = {
  field: string;
  label: string;
  type: FormatType;
};

export type TableData = {
  columns: TableColumn[];
  rows: Record<string, string | number | null>[];
};

export type IndicatorMetadata = {
  id: string;
  name: string;
  definition: string;
  formula?: string;
  unit: string;
  periodicity: string;
  granularity: string;
  source: string;
  owner: string;
  limitations?: string;
  updatedAt: string;
};

export type MetricQuery = {
  metric: string;
  dimension?: string;
  filters: Record<string, string[]>;
};

export type FilterOption = {
  value: string;
  label: string;
};

export type RequestState<T> =
  | { status: "loading"; data: undefined }
  | { status: "success"; data: T }
  | { status: "empty"; data: undefined }
  | { status: "error"; data: undefined; error: string };

export const PANEL_LAYOUTS = ["grid-2", "grid-3", "grid-4", "stack"] as const;
export type PanelLayout = (typeof PANEL_LAYOUTS)[number];

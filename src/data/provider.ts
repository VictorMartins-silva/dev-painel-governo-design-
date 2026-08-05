import type {
  CategoricalPoint,
  DataEnvelope,
  FilterOption,
  IndicatorData,
  MetricQuery,
  PanelFreshness,
  TableData,
  TimeSeriesPoint,
} from "../domain/types";
import type { PanelConfig } from "../config/schemas/panel.schema";
import type {
  IndicatorCatalogEntry,
  InvalidIndicatorEntry,
} from "../config/schemas/indicator.schema";
import type { DanglingReference, IndicatorUsageEntry } from "../config/indicatorUsage";

export type PanelSummary = {
  id: string;
  title: string;
  description: string;
  theme: string;
  tags: string[];
  source: string;
  updatedAt: string;
  isExternal: boolean;
};

export type TableQuery = {
  dataset: string;
  filters: Record<string, string[]>;
  limit?: number;
};

export type { IndicatorShape } from "../config/schemas/indicator.schema";

/** Estado de saúde do catálogo de indicadores: quem está órfão, referências quebradas e fixtures inválidas. */
export type CatalogHealth = {
  entries: IndicatorCatalogEntry[];
  usageCountByIndicatorId: Record<string, number>;
  orphans: IndicatorCatalogEntry[];
  dangling: DanglingReference[];
  invalid: InvalidIndicatorEntry[];
};

export type DataProvider = {
  listPanels(): Promise<PanelSummary[]>;
  getPanelConfig(panelId: string): Promise<PanelConfig>;
  getPanelFreshness(panelId: string): Promise<PanelFreshness>;
  getIndicator(query: MetricQuery): Promise<DataEnvelope<IndicatorData>>;
  getTimeSeries(query: MetricQuery): Promise<DataEnvelope<TimeSeriesPoint[]>>;
  getCategoricalSeries(query: MetricQuery): Promise<DataEnvelope<CategoricalPoint[]>>;
  getTable(query: TableQuery): Promise<DataEnvelope<TableData>>;
  getFilterOptions(panelId: string, filterId: string): Promise<FilterOption[]>;
  getIndicatorMetadata(indicatorId: string): Promise<IndicatorCatalogEntry>;
  listIndicators(): Promise<IndicatorCatalogEntry[]>;
  getIndicatorUsage(indicatorId: string): Promise<IndicatorUsageEntry[]>;
  getCatalogHealth(): Promise<CatalogHealth>;
};

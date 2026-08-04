import type {
  CategoricalPoint,
  DataEnvelope,
  FilterOption,
  IndicatorData,
  IndicatorMetadata,
  MetricQuery,
  TableData,
  TimeSeriesPoint,
} from "../domain/types";
import type { PanelConfig } from "../config/schemas/panel.schema";

export type PanelSummary = {
  id: string;
  title: string;
  description: string;
  theme: string;
  tags: string[];
  source: string;
  updatedAt: string;
};

export type TableQuery = {
  dataset: string;
  filters: Record<string, string[]>;
  limit?: number;
};

export type DataProvider = {
  listPanels(): Promise<PanelSummary[]>;
  getPanelConfig(panelId: string): Promise<PanelConfig>;
  getIndicator(query: MetricQuery): Promise<DataEnvelope<IndicatorData>>;
  getTimeSeries(query: MetricQuery): Promise<DataEnvelope<TimeSeriesPoint[]>>;
  getCategoricalSeries(query: MetricQuery): Promise<DataEnvelope<CategoricalPoint[]>>;
  getTable(query: TableQuery): Promise<DataEnvelope<TableData>>;
  getFilterOptions(panelId: string, filterId: string): Promise<FilterOption[]>;
  getIndicatorMetadata(metricId: string): Promise<IndicatorMetadata>;
};

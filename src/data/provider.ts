import type {
  CategoricalPoint,
  DataEnvelope,
  FilterOption,
  FormatType,
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

export type IndicatorShape = "metric" | "categorical" | "table";

export type IndicatorSummary = {
  id: string;
  name: string;
  unit: string;
  source: string;
  /** Formas de dado que o indicador oferece — determina os tipos de componente compatíveis */
  shapes: IndicatorShape[];
  /** Dimensões disponíveis para quebra (ex.: "sexo", "setor") — alimenta bar-chart/time-series */
  dimensions?: string[];
  /** Datasets tabulares associados (para data-table) */
  datasets?: string[];
  defaultFormat?: FormatType;
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
  listIndicators(): Promise<IndicatorSummary[]>;
};

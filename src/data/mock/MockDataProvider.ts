import type {
  CategoricalPoint,
  DataEnvelope,
  FilterOption,
  IndicatorData,
  IndicatorMetadata,
  MetricQuery,
  TableColumn,
  TableData,
  TimeSeriesPoint,
} from "../../domain/types";
import type { DataProvider, IndicatorSummary, PanelSummary, TableQuery } from "../provider";
import { panelStore as defaultPanelStore, type PanelStore } from "../../admin/store/PanelStore";
import { randomDelay } from "./delay";
import { matchesFilters } from "./matchesFilters";

type MetricFixture = {
  metadata: { source?: string; updatedAt?: string; referencePeriod?: string };
  rows: ({ period: string; value: number | null } & Record<string, unknown>)[];
};

type CategoricalFixture = {
  metadata: { source?: string; updatedAt?: string; referencePeriod?: string };
  rows: ({ category: string; value: number | null } & Record<string, unknown>)[];
};

type TableFixture = {
  metadata: { source?: string; updatedAt?: string; referencePeriod?: string };
  columns: TableColumn[];
  rows: Record<string, string | number | null>[];
};

const metricFixtures = import.meta.glob("./datasets/metrics/*.json", {
  eager: true,
  import: "default",
}) as Record<string, MetricFixture>;

const categoricalFixtures = import.meta.glob("./datasets/categorical/*.json", {
  eager: true,
  import: "default",
}) as Record<string, CategoricalFixture>;

const tableFixtures = import.meta.glob("./datasets/tables/*.json", {
  eager: true,
  import: "default",
}) as Record<string, TableFixture>;

const indicatorMetadataFixtures = import.meta.glob("./datasets/indicator-metadata/*.json", {
  eager: true,
  import: "default",
}) as Record<string, IndicatorMetadata>;

const indicatorsFixture = import.meta.glob("./datasets/indicators.json", {
  eager: true,
  import: "default",
}) as Record<string, IndicatorSummary[]>;

const indicatorSummaries: IndicatorSummary[] = Object.values(indicatorsFixture)[0] ?? [];

const filterOptionFixtures = import.meta.glob("./datasets/filter-options/*/*.json", {
  eager: true,
  import: "default",
}) as Record<string, FilterOption[]>;

function keyByFilename(fixtures: Record<string, unknown>): Map<string, unknown> {
  const map = new Map<string, unknown>();
  for (const [path, value] of Object.entries(fixtures)) {
    const fileName = path.split("/").pop() ?? path;
    const id = fileName.replace(/\.json$/, "");
    map.set(id, value);
  }
  return map;
}

const metricsById = keyByFilename(metricFixtures) as Map<string, MetricFixture>;
const categoricalById = keyByFilename(categoricalFixtures) as Map<string, CategoricalFixture>;
const tablesById = keyByFilename(tableFixtures) as Map<string, TableFixture>;
const indicatorMetadataById = keyByFilename(indicatorMetadataFixtures) as Map<
  string,
  IndicatorMetadata
>;

function filterOptionsKey(panelId: string, filterId: string): string {
  return `${panelId}/${filterId}`;
}

const filterOptionsByPanelAndFilter = new Map<string, FilterOption[]>();
for (const [path, value] of Object.entries(filterOptionFixtures)) {
  const parts = path.split("/");
  const filterId = (parts.pop() ?? "").replace(/\.json$/, "");
  const panelId = parts.pop() ?? "";
  filterOptionsByPanelAndFilter.set(filterOptionsKey(panelId, filterId), value);
}

function sumByPeriod(
  rows: ({ period: string; value: number | null } & Record<string, unknown>)[],
): { period: string; value: number | null }[] {
  const totals = new Map<string, { value: number; hasValue: boolean }>();

  for (const row of rows) {
    const current = totals.get(row.period) ?? { value: 0, hasValue: false };
    if (row.value !== null) {
      current.value += row.value;
      current.hasValue = true;
    }
    totals.set(row.period, current);
  }

  return Array.from(totals.entries()).map(([period, total]) => ({
    period,
    value: total.hasValue ? total.value : null,
  }));
}

const ERROR_SENTINEL = "__mock_error__";

export type MockDataProviderOptions = {
  simulateLatency?: boolean;
  latencyRange?: [number, number];
  panelStore?: PanelStore;
};

export class MockDataProvider implements DataProvider {
  private readonly simulateLatency: boolean;
  private readonly latencyRange: [number, number];
  private readonly panelStore: PanelStore;

  constructor(options: MockDataProviderOptions = {}) {
    this.simulateLatency = options.simulateLatency ?? true;
    this.latencyRange = options.latencyRange ?? [300, 600];
    this.panelStore = options.panelStore ?? defaultPanelStore;
  }

  private async wait(): Promise<void> {
    if (!this.simulateLatency) return;
    await randomDelay(this.latencyRange[0], this.latencyRange[1]);
  }

  private envelope<T>(data: T, metadata: DataEnvelope<T>["metadata"] = {}): DataEnvelope<T> {
    return { data, metadata };
  }

  async listPanels(): Promise<PanelSummary[]> {
    await this.wait();
    return this.panelStore.list().map(({ config: panel }) => ({
      id: panel.id,
      title: panel.title,
      description: panel.description,
      theme: panel.theme,
      tags: panel.tags,
      source: panel.metadata.source,
      updatedAt: panel.metadata.updatedAt,
    }));
  }

  async getPanelConfig(panelId: string) {
    await this.wait();
    const panel = this.panelStore.get(panelId);
    if (!panel) {
      throw new Error(`Painel "${panelId}" não encontrado.`);
    }
    return panel;
  }

  async getIndicator(query: MetricQuery): Promise<DataEnvelope<IndicatorData>> {
    await this.wait();
    if (query.metric === ERROR_SENTINEL) {
      throw new Error("Erro simulado ao carregar indicador.");
    }

    const fixture = metricsById.get(query.metric);
    const filteredRows = (fixture?.rows ?? []).filter((row) => matchesFilters(row, query.filters));
    const sorted = sumByPeriod(filteredRows).sort((a, b) => a.period.localeCompare(b.period));
    const current = sorted[sorted.length - 1];
    const previous = sorted[sorted.length - 2];

    if (!current) {
      return this.envelope<IndicatorData>({ value: null }, fixture?.metadata);
    }

    const indicator: IndicatorData = {
      value: current.value,
      referencePeriod: current.period,
      source: fixture?.metadata.source,
      updatedAt: fixture?.metadata.updatedAt,
    };

    if (previous && previous.value !== null && current.value !== null) {
      const delta = current.value - previous.value;
      indicator.comparison = {
        value: delta,
        direction: delta > 0 ? "up" : delta < 0 ? "down" : "stable",
        referenceLabel: previous.period,
      };
    }

    return this.envelope(indicator, fixture?.metadata);
  }

  async getTimeSeries(query: MetricQuery): Promise<DataEnvelope<TimeSeriesPoint[]>> {
    await this.wait();
    if (query.metric === ERROR_SENTINEL) {
      throw new Error("Erro simulado ao carregar série temporal.");
    }

    const fixture = metricsById.get(query.metric);
    const filteredRows = (fixture?.rows ?? []).filter((row) => matchesFilters(row, query.filters));
    const points: TimeSeriesPoint[] = sumByPeriod(filteredRows).sort((a, b) =>
      a.period.localeCompare(b.period),
    );

    return this.envelope(points, fixture?.metadata);
  }

  async getCategoricalSeries(query: MetricQuery): Promise<DataEnvelope<CategoricalPoint[]>> {
    await this.wait();
    if (query.metric === ERROR_SENTINEL) {
      throw new Error("Erro simulado ao carregar série categórica.");
    }

    const fixture = categoricalById.get(query.metric);
    const rows = (fixture?.rows ?? []).filter((row) => matchesFilters(row, query.filters));
    const points: CategoricalPoint[] = rows.map((row) => ({
      category: row.category,
      value: row.value,
    }));

    return this.envelope(points, fixture?.metadata);
  }

  async getTable(query: TableQuery): Promise<DataEnvelope<TableData>> {
    await this.wait();
    if (query.dataset === ERROR_SENTINEL) {
      throw new Error("Erro simulado ao carregar tabela.");
    }

    const fixture = tablesById.get(query.dataset);
    const rows = (fixture?.rows ?? []).filter((row) => matchesFilters(row, query.filters));
    const limited = query.limit ? rows.slice(0, query.limit) : rows;

    return this.envelope<TableData>(
      { columns: fixture?.columns ?? [], rows: limited },
      fixture?.metadata,
    );
  }

  async getFilterOptions(panelId: string, filterId: string): Promise<FilterOption[]> {
    await this.wait();
    return filterOptionsByPanelAndFilter.get(filterOptionsKey(panelId, filterId)) ?? [];
  }

  async getIndicatorMetadata(metricId: string): Promise<IndicatorMetadata> {
    await this.wait();
    const metadata = indicatorMetadataById.get(metricId);
    if (!metadata) {
      throw new Error(`Metadados do indicador "${metricId}" não encontrados.`);
    }
    return metadata;
  }

  async listIndicators(): Promise<IndicatorSummary[]> {
    await this.wait();
    return indicatorSummaries;
  }
}

import { AsyncBoundary } from "../components/feedback/AsyncBoundary";
import { IndicatorCard } from "../components/indicators/IndicatorCard";
import { TimeSeriesChart } from "../components/charts/TimeSeriesChart";
import { BarChart } from "../components/charts/BarChart";
import { DataTable } from "../components/table/DataTable";
import { useIndicator } from "../data/hooks/useIndicator";
import { useTimeSeries } from "../data/hooks/useTimeSeries";
import { useCategoricalSeries } from "../data/hooks/useCategoricalSeries";
import { useTable } from "../data/hooks/useTable";
import type {
  BarChartConfig,
  DataTableConfig,
  IndicatorCardConfig,
  TimeSeriesConfig,
} from "../config/schemas/components.schema";
import { useFilterContext } from "./FilterContext";

export function IndicatorCardContainer({ config }: { config: IndicatorCardConfig }) {
  const { queryFilters } = useFilterContext();
  const state = useIndicator({ metric: config.metric, filters: queryFilters });

  return (
    <AsyncBoundary
      state={state}
      emptyTitle="Sem dados"
      emptyMessage="Sem dados para os filtros selecionados."
    >
      {(data) => (
        <IndicatorCard
          title={config.title}
          format={config.format}
          indicatorId={config.indicatorId}
          data={config.comparison === "none" ? { ...data, comparison: undefined } : data}
        />
      )}
    </AsyncBoundary>
  );
}

export function TimeSeriesContainer({ config }: { config: TimeSeriesConfig }) {
  const { queryFilters } = useFilterContext();
  const state = useTimeSeries({
    metric: config.metric,
    dimension: config.dimension,
    filters: queryFilters,
  });

  return (
    <AsyncBoundary state={state}>
      {(data) => <TimeSeriesChart title={config.title} data={data} format={config.format} />}
    </AsyncBoundary>
  );
}

export function BarChartContainer({ config }: { config: BarChartConfig }) {
  const { queryFilters } = useFilterContext();
  const state = useCategoricalSeries({
    metric: config.metric,
    dimension: config.dimension,
    filters: queryFilters,
  });

  return (
    <AsyncBoundary state={state}>
      {(data) => (
        <BarChart
          title={config.title}
          data={data}
          orientation={config.orientation}
          sort={config.sort}
          format={config.format}
        />
      )}
    </AsyncBoundary>
  );
}

export function DataTableContainer({ config }: { config: DataTableConfig }) {
  const { queryFilters } = useFilterContext();
  const state = useTable({ dataset: config.dataset, filters: queryFilters, limit: config.limit });

  return (
    <AsyncBoundary state={state}>
      {(data) => <DataTable title={config.title} data={data} />}
    </AsyncBoundary>
  );
}

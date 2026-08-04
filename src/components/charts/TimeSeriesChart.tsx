import { useMemo } from "react";
import type { EChartsOption } from "echarts";
import type { FormatType, TimeSeriesPoint } from "../../domain/types";
import { formatValue } from "../../utils/format";
import { ChartFrame } from "./ChartFrame";
import { EChartsBase } from "./EChartsBase";

type TimeSeriesChartProps = {
  title: string;
  data: TimeSeriesPoint[];
  format?: FormatType;
  unit?: string;
  source?: string;
};

function groupBySeries(data: TimeSeriesPoint[]): Map<string, TimeSeriesPoint[]> {
  const groups = new Map<string, TimeSeriesPoint[]>();
  for (const point of data) {
    const seriesName = point.series ?? "valor";
    const group = groups.get(seriesName) ?? [];
    group.push(point);
    groups.set(seriesName, group);
  }
  return groups;
}

export function TimeSeriesChart({
  title,
  data,
  format = "integer",
  unit,
  source,
}: TimeSeriesChartProps) {
  const option = useMemo<EChartsOption>(() => {
    const periods = Array.from(new Set(data.map((point) => point.period))).sort();
    const groups = groupBySeries(data);
    const showLegend = groups.size > 1;

    return {
      grid: { left: 8, right: 16, top: showLegend ? 32 : 16, bottom: 8, containLabel: true },
      legend: showLegend ? { top: 0 } : undefined,
      tooltip: {
        trigger: "axis",
        valueFormatter: (value) => formatValue(value as number | null, format),
      },
      xAxis: { type: "category", data: periods },
      yAxis: {
        type: "value",
        axisLabel: { formatter: (value: number) => formatValue(value, format) },
      },
      series: Array.from(groups.entries()).map(([name, points]) => {
        const byPeriod = new Map(points.map((point) => [point.period, point.value]));
        return {
          name,
          type: "line",
          data: periods.map((period) => byPeriod.get(period) ?? null),
          connectNulls: false,
          showSymbol: data.length <= 24,
        };
      }),
    };
  }, [data, format]);

  return (
    <ChartFrame title={title} unit={unit} source={source}>
      <EChartsBase option={option} ariaLabel={`Gráfico de série temporal: ${title}`} />
    </ChartFrame>
  );
}

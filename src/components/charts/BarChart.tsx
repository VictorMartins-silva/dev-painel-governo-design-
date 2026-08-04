import { useMemo } from "react";
import type { EChartsOption } from "echarts";
import type { CategoricalPoint, FormatType } from "../../domain/types";
import { formatValue } from "../../utils/format";
import { ChartFrame } from "./ChartFrame";
import { EChartsBase } from "./EChartsBase";

type BarChartProps = {
  title: string;
  data: CategoricalPoint[];
  orientation?: "horizontal" | "vertical";
  sort?: "asc" | "desc" | "none";
  format?: FormatType;
  unit?: string;
  source?: string;
};

function sortCategories(
  categories: string[],
  totals: Map<string, number>,
  sort: "asc" | "desc" | "none",
) {
  if (sort === "none") return categories;
  const direction = sort === "asc" ? 1 : -1;
  return [...categories].sort((a, b) => direction * ((totals.get(a) ?? 0) - (totals.get(b) ?? 0)));
}

export function BarChart({
  title,
  data,
  orientation = "vertical",
  sort = "none",
  format = "integer",
  unit,
  source,
}: BarChartProps) {
  const option = useMemo<EChartsOption>(() => {
    const groups = new Map<string, Map<string, number | null>>();
    const totals = new Map<string, number>();
    const categoryOrder: string[] = [];

    for (const point of data) {
      const seriesName = point.series ?? "valor";
      if (!groups.has(seriesName)) groups.set(seriesName, new Map());
      groups.get(seriesName)?.set(point.category, point.value);

      if (!categoryOrder.includes(point.category)) categoryOrder.push(point.category);
      totals.set(point.category, (totals.get(point.category) ?? 0) + (point.value ?? 0));
    }

    const categories = sortCategories(categoryOrder, totals, sort);
    const showLegend = groups.size > 1;
    const categoryAxis = {
      type: "category" as const,
      data: categories,
      axisLabel: { formatter: (value: string) => formatValue(value, "text") },
    };
    const valueAxis = {
      type: "value" as const,
      axisLabel: { formatter: (value: number) => formatValue(value, format) },
    };

    return {
      grid: { left: 8, right: 16, top: showLegend ? 32 : 16, bottom: 8, containLabel: true },
      legend: showLegend ? { top: 0 } : undefined,
      tooltip: {
        trigger: "axis",
        axisPointer: { type: "shadow" },
        valueFormatter: (value) => formatValue(value as number | null, format),
      },
      xAxis: orientation === "horizontal" ? valueAxis : categoryAxis,
      yAxis: orientation === "horizontal" ? categoryAxis : valueAxis,
      series: Array.from(groups.entries()).map(([name, byCategory]) => ({
        name,
        type: "bar",
        data: categories.map((category) => byCategory.get(category) ?? null),
      })),
    };
  }, [data, orientation, sort, format]);

  return (
    <ChartFrame title={title} unit={unit} source={source}>
      <EChartsBase option={option} ariaLabel={`Gráfico de barras: ${title}`} />
    </ChartFrame>
  );
}

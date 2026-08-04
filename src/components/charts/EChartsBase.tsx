import { useEffect, useRef, useState } from "react";
import * as echarts from "echarts/core";
import { LineChart, BarChart as EChartsBarChart } from "echarts/charts";
import {
  GridComponent,
  TooltipComponent,
  LegendComponent,
  DataZoomComponent,
} from "echarts/components";
import { CanvasRenderer } from "echarts/renderers";
import { LegacyGridContainLabel } from "echarts/features";
import type { EChartsOption } from "echarts";
import { ECHARTS_THEME_NAME } from "../../styles/echarts-theme";
import styles from "./EChartsBase.module.css";

echarts.use([
  LineChart,
  EChartsBarChart,
  GridComponent,
  TooltipComponent,
  LegendComponent,
  DataZoomComponent,
  CanvasRenderer,
  LegacyGridContainLabel,
]);

function getColorScheme(): "light" | "dark" {
  if (typeof window === "undefined") return "light";
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

type EChartsBaseProps = {
  option: EChartsOption;
  height?: number;
  ariaLabel: string;
};

export function EChartsBase({ option, height = 320, ariaLabel }: EChartsBaseProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const chartRef = useRef<echarts.ECharts | null>(null);
  const [scheme, setScheme] = useState(getColorScheme);

  useEffect(() => {
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = () => setScheme(getColorScheme());
    media.addEventListener("change", handleChange);
    return () => media.removeEventListener("change", handleChange);
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const chart = echarts.init(container, ECHARTS_THEME_NAME[scheme]);
    chartRef.current = chart;

    const resizeObserver = new ResizeObserver(() => chart.resize());
    resizeObserver.observe(container);

    return () => {
      resizeObserver.disconnect();
      chart.dispose();
      chartRef.current = null;
    };
  }, [scheme]);

  useEffect(() => {
    chartRef.current?.setOption(option, true);
  }, [option]);

  return (
    <div
      ref={containerRef}
      className={styles.chart}
      style={{ height }}
      role="img"
      aria-label={ariaLabel}
    />
  );
}

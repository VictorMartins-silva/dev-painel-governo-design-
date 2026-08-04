import * as echarts from "echarts/core";
import { tokens, type ColorScheme } from "./tokens";

export const ECHARTS_THEME_NAME: Record<ColorScheme, string> = {
  light: "painel-governo-light",
  dark: "painel-governo-dark",
};

function buildTheme(scheme: ColorScheme) {
  const palette = tokens.colors[scheme];

  return {
    color: [...tokens.colors.chartCategorical],
    backgroundColor: "transparent",
    textStyle: {
      fontFamily: tokens.typography.fontFamily,
    },
    title: {
      textStyle: { color: palette.textPrimary, fontWeight: tokens.typography.weight.semibold },
    },
    legend: {
      textStyle: { color: palette.textSecondary },
    },
    tooltip: {
      backgroundColor: palette.surfaceRaised,
      borderColor: palette.border,
      textStyle: { color: palette.textPrimary },
    },
    categoryAxis: {
      axisLine: { lineStyle: { color: palette.border } },
      axisTick: { lineStyle: { color: palette.border } },
      axisLabel: { color: palette.textSecondary },
      splitLine: { lineStyle: { color: palette.border } },
    },
    valueAxis: {
      axisLine: { lineStyle: { color: palette.border } },
      axisTick: { lineStyle: { color: palette.border } },
      axisLabel: { color: palette.textSecondary },
      splitLine: { lineStyle: { color: palette.border, type: "dashed" } },
    },
  };
}

let registered = false;

export function registerEchartsThemes(): void {
  if (registered) return;
  echarts.registerTheme(ECHARTS_THEME_NAME.light, buildTheme("light"));
  echarts.registerTheme(ECHARTS_THEME_NAME.dark, buildTheme("dark"));
  registered = true;
}

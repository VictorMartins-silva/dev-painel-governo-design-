import type { ComponentType as ReactComponentType } from "react";
import type { ComponentConfig, ComponentType } from "../config/schemas/components.schema";
import { ErrorState } from "../components/feedback/ErrorState";
import {
  BarChartContainer,
  DataTableContainer,
  IndicatorCardContainer,
  TimeSeriesContainer,
} from "./containers";

type RegistryEntry = ReactComponentType<{ config: ComponentConfig }>;

export const componentRegistry: Record<ComponentType, RegistryEntry> = {
  "indicator-card": IndicatorCardContainer as RegistryEntry,
  "time-series": TimeSeriesContainer as RegistryEntry,
  "bar-chart": BarChartContainer as RegistryEntry,
  "data-table": DataTableContainer as RegistryEntry,
};

type ComponentSlotProps = {
  config: ComponentConfig;
};

export function ComponentSlot({ config }: ComponentSlotProps) {
  const Component = componentRegistry[config.type as ComponentType];

  if (!Component) {
    return (
      <ErrorState
        title="Componente não registrado"
        message={`O tipo de componente "${config.type}" não está disponível no registry.`}
      />
    );
  }

  return <Component config={config} />;
}

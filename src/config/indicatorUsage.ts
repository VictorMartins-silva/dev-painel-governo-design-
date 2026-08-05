import type { PanelConfig } from "./schemas/panel.schema";
import type { IndicatorCatalogEntry } from "./schemas/indicator.schema";
import type { ComponentConfig, ComponentType } from "./schemas/components.schema";

export type IndicatorUsageEntry = {
  panelId: string;
  panelTitle: string;
  sectionTitle: string;
  componentType: ComponentType;
  componentTitle: string;
};

export type DanglingReference = IndicatorUsageEntry & {
  /** Valor de `metric`/`dataset` referenciado que não corresponde a nenhum indicador do catálogo. */
  reference: string;
};

export type IndicatorUsageIndex = {
  usageByIndicatorId: Map<string, IndicatorUsageEntry[]>;
  /** Indicadores do catálogo que nenhum painel consome. */
  orphans: IndicatorCatalogEntry[];
  /** Componentes de painel apontando para um `metric`/`dataset` fora do catálogo. */
  dangling: DanglingReference[];
};

function componentReference(component: ComponentConfig): string | undefined {
  return component.type === "data-table" ? component.dataset || undefined : component.metric;
}

function matchesEntry(
  entry: IndicatorCatalogEntry,
  reference: string,
  componentType: ComponentType,
): boolean {
  return componentType === "data-table"
    ? entry.datasets.includes(reference)
    : entry.id === reference;
}

/** Índice reverso painel → indicador, incluindo indicadores órfãos e referências quebradas. */
export function buildIndicatorUsage(
  panels: PanelConfig[],
  catalog: IndicatorCatalogEntry[],
): IndicatorUsageIndex {
  const usageByIndicatorId = new Map<string, IndicatorUsageEntry[]>();
  const dangling: DanglingReference[] = [];

  for (const panel of panels) {
    for (const section of panel.sections) {
      for (const component of section.components) {
        const reference = componentReference(component);
        if (!reference) continue;

        const entry = catalog.find((candidate) =>
          matchesEntry(candidate, reference, component.type),
        );
        const usageEntry: IndicatorUsageEntry = {
          panelId: panel.id,
          panelTitle: panel.title,
          sectionTitle: section.title,
          componentType: component.type,
          componentTitle: component.title,
        };

        if (entry) {
          const list = usageByIndicatorId.get(entry.id) ?? [];
          list.push(usageEntry);
          usageByIndicatorId.set(entry.id, list);
        } else {
          dangling.push({ ...usageEntry, reference });
        }
      }
    }
  }

  const orphans = catalog.filter((entry) => !usageByIndicatorId.has(entry.id));

  return { usageByIndicatorId, orphans, dangling };
}

export function getIndicatorUsage(
  index: IndicatorUsageIndex,
  indicatorId: string,
): IndicatorUsageEntry[] {
  return index.usageByIndicatorId.get(indicatorId) ?? [];
}

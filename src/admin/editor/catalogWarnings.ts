import type { NativePanelConfig } from "../../config/schemas/panel.schema";
import type { ComponentConfig } from "../../config/schemas/components.schema";
import type { IndicatorCatalogEntry } from "../../config/schemas/indicator.schema";
import { COMPONENT_CATALOG } from "../../config/componentCatalog";

function findIndicator(
  catalog: IndicatorCatalogEntry[],
  component: ComponentConfig,
): IndicatorCatalogEntry | undefined {
  if (component.type === "data-table") {
    return catalog.find((entry) => entry.datasets.includes(component.dataset));
  }
  return catalog.find((entry) => entry.id === component.metric);
}

/**
 * Avisos não bloqueantes de consistência entre os componentes do painel e o catálogo de
 * indicadores — mesmas chaves de caminho que buildFieldErrors, para reaproveitar o mesmo mapa
 * em FormField sem travar salvar/publicar.
 */
export function buildCatalogWarnings(
  config: NativePanelConfig,
  catalog: IndicatorCatalogEntry[],
): Map<string, string> {
  const warnings = new Map<string, string>();

  config.sections.forEach((section, sectionIndex) => {
    section.components.forEach((component, componentIndex) => {
      const prefix = `sections.${sectionIndex}.components.${componentIndex}`;
      const referenceField = component.type === "data-table" ? "dataset" : "metric";
      const reference = component.type === "data-table" ? component.dataset : component.metric;
      if (!reference) return;

      const entry = findIndicator(catalog, component);
      if (!entry) {
        warnings.set(`${prefix}.${referenceField}`, `Indicador "${reference}" fora do catálogo.`);
        return;
      }

      const requiredShape = COMPONENT_CATALOG[component.type].requiredShape;
      if (!entry.shapes.includes(requiredShape)) {
        warnings.set(
          `${prefix}.${referenceField}`,
          `"${entry.name}" não oferece dado no formato exigido por este componente (${requiredShape}).`,
        );
      }

      if (
        "dimension" in component &&
        component.dimension &&
        !entry.dimensions.includes(component.dimension)
      ) {
        warnings.set(
          `${prefix}.dimension`,
          `Dimensão "${component.dimension}" não é oferecida por "${entry.name}".`,
        );
      }
    });
  });

  return warnings;
}

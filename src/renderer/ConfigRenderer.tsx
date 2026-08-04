import { Section } from "../components/layout/Section";
import { PanelGrid } from "../components/layout/PanelGrid";
import { ErrorState } from "../components/feedback/ErrorState";
import { parsePanelConfig } from "../config/schemas/panel.schema";
import { FilterProvider } from "./FilterContext";
import { PanelFilterBar } from "./PanelFilterBar";
import { ComponentSlot } from "./ComponentRegistry";
import styles from "./ConfigRenderer.module.css";

type ConfigRendererProps = {
  panelId: string;
  config: unknown;
};

export function ConfigRenderer({ panelId, config }: ConfigRendererProps) {
  const result = parsePanelConfig(config);

  if (!result.success) {
    return (
      <ErrorState
        title="Configuração de painel inválida"
        message="A configuração deste painel não passou na validação de schema."
      >
        <ul className={styles.issues}>
          {result.error.issues.map((issue, index) => (
            <li key={index}>
              <code>{issue.path.join(".") || "(raiz)"}</code>: {issue.message}
            </li>
          ))}
        </ul>
      </ErrorState>
    );
  }

  const panel = result.data;

  return (
    <FilterProvider panelId={panelId} filters={panel.filters}>
      <PanelFilterBar />
      {panel.sections.map((section) => (
        <Section key={section.id} title={section.title}>
          <PanelGrid layout={section.layout}>
            {section.components.map((component) => (
              <ComponentSlot key={component.id} config={component} />
            ))}
          </PanelGrid>
        </Section>
      ))}
    </FilterProvider>
  );
}

import { useState, type ReactNode } from "react";
import { Link } from "react-router-dom";
import { PageHeader } from "../../components/layout/PageHeader";
import { Section } from "../../components/layout/Section";
import { PanelGrid, PANEL_GRID_LAYOUTS } from "../../components/layout/PanelGrid";
import { MetadataBlock } from "../../components/layout/MetadataBlock";
import { LoadingState } from "../../components/feedback/LoadingState";
import { EmptyState } from "../../components/feedback/EmptyState";
import { ErrorState } from "../../components/feedback/ErrorState";
import { AsyncBoundary } from "../../components/feedback/AsyncBoundary";
import { IndicatorCard } from "../../components/indicators/IndicatorCard";
import { TimeSeriesChart } from "../../components/charts/TimeSeriesChart";
import { BarChart } from "../../components/charts/BarChart";
import { DataTable } from "../../components/table/DataTable";
import { FilterBar } from "../../components/filters/FilterBar";
import { COMPONENT_CATALOG } from "../../config/componentCatalog";
import { useIndicatorList } from "../../data/hooks/useIndicatorList";
import type {
  CategoricalPoint,
  IndicatorData,
  RequestState,
  TableData,
  TimeSeriesPoint,
} from "../../domain/types";
import type { ComponentType } from "../../config/schemas/components.schema";
import type { FilterConfig } from "../../config/schemas/filters.schema";
import styles from "./AdminComponentsPage.module.css";

const demoIndicator: IndicatorData = {
  value: 2450,
  unit: "vínculos",
  referencePeriod: "2025-12",
  source: "CAGED (dados fictícios)",
  comparison: { value: 120, direction: "up", referenceLabel: "2025-11" },
};

const demoTimeSeries: TimeSeriesPoint[] = [
  { period: "2025-09", value: 2100 },
  { period: "2025-10", value: 2280 },
  { period: "2025-11", value: 2330 },
  { period: "2025-12", value: 2450 },
];

const demoCategorical: CategoricalPoint[] = [
  { category: "Comércio", value: 890 },
  { category: "Indústria", value: 610 },
  { category: "Serviços", value: 720 },
  { category: "Construção", value: 230 },
];

const demoTable: TableData = {
  columns: [
    { field: "atividade", label: "Atividade", type: "text" },
    { field: "vinculos", label: "Vínculos", type: "integer" },
    { field: "variacao", label: "Variação", type: "percent" },
  ],
  rows: [
    { atividade: "Comércio varejista", vinculos: 890, variacao: 0.032 },
    { atividade: "Indústria de transformação", vinculos: 610, variacao: -0.011 },
    { atividade: "Serviços administrativos", vinculos: 720, variacao: 0.045 },
  ],
};

const demoFilters: FilterConfig[] = [
  { id: "ano", type: "single-select", label: "Ano", dataField: "ano" },
  { id: "sexo", type: "multi-select", label: "Sexo", dataField: "sexo" },
  { id: "competencia", type: "period", label: "Competência", dataField: "competencia" },
];

const demoFilterOptions = {
  ano: [
    { value: "2024", label: "2024" },
    { value: "2025", label: "2025" },
  ],
  sexo: [
    { value: "masculino", label: "Masculino" },
    { value: "feminino", label: "Feminino" },
  ],
  competencia: [
    { value: "2025-11", label: "Nov/2025" },
    { value: "2025-12", label: "Dez/2025" },
  ],
};

function loadingState<T>(): RequestState<T> {
  return { status: "loading", data: undefined };
}

function successState<T>(data: T): RequestState<T> {
  return { status: "success", data };
}

function emptyState<T>(): RequestState<T> {
  return { status: "empty", data: undefined };
}

function errorState<T>(): RequestState<T> {
  return { status: "error", data: undefined, error: "Falha simulada ao carregar dados." };
}

type StatesRowProps<T> = {
  states: RequestState<T>[];
  render: (data: T) => ReactNode;
};

function StatesRow<T>({ states, render }: StatesRowProps<T>) {
  return (
    <PanelGrid layout="grid-4">
      {states.map((state, index) => (
        <AsyncBoundary key={index} state={state}>
          {render}
        </AsyncBoundary>
      ))}
    </PanelGrid>
  );
}

type ComponentDescriptionProps = {
  type: ComponentType;
  compatibleCount: number | undefined;
};

function ComponentDescription({ type, compatibleCount }: ComponentDescriptionProps) {
  const entry = COMPONENT_CATALOG[type];

  return (
    <div className={styles.description}>
      <p className={styles.summary}>{entry.summary}</p>
      <p className={styles.whenToUse}>
        <strong>Quando usar:</strong> {entry.whenToUse}
      </p>

      <div className={styles.metaRow}>
        <span className={styles.metaItem}>
          Exige indicador do tipo <code>{entry.requiredShape}</code>
        </span>
        {compatibleCount !== undefined && (
          <Link to={`/indicadores?forma=${entry.requiredShape}`} className={styles.metaLink}>
            {compatibleCount} indicador{compatibleCount === 1 ? "" : "es"} compatíve
            {compatibleCount === 1 ? "l" : "is"}
          </Link>
        )}
      </div>

      <div className={styles.fieldTableWrapper}>
        <table className={styles.fieldTable}>
          <thead>
            <tr>
              <th>Campo</th>
              <th>Obrigatório</th>
              <th>Descrição</th>
            </tr>
          </thead>
          <tbody>
            {entry.fields.map((field) => (
              <tr key={field.name}>
                <td>
                  <code>{field.name}</code>
                </td>
                <td>{field.required ? "Sim" : "Não"}</td>
                <td>{field.description}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <details className={styles.exampleDetails}>
        <summary>Exemplo de configuração</summary>
        <pre className={styles.example}>{JSON.stringify(entry.example, null, 2)}</pre>
      </details>
    </div>
  );
}

export default function AdminComponentsPage() {
  const [filterValues, setFilterValues] = useState<Record<string, string[]>>({ ano: ["2025"] });
  const indicatorsState = useIndicatorList();

  const compatibleCountByShape =
    indicatorsState.status === "success"
      ? indicatorsState.data.reduce<Record<string, number>>((counts, indicator) => {
          for (const shape of indicator.shapes) {
            counts[shape] = (counts[shape] ?? 0) + 1;
          }
          return counts;
        }, {})
      : undefined;

  return (
    <div className={styles.page}>
      <PageHeader
        title="Cardápio de componentes"
        description="O que esta ferramenta sabe montar: os quatro tipos de componente analítico disponíveis para compor um painel, como configurar cada um e em quais estados de dados eles aparecem."
      />

      <Section title="PanelGrid — presets de layout">
        <div className={styles.stack}>
          {PANEL_GRID_LAYOUTS.map((layout) => (
            <div key={layout}>
              <p>
                <code>{layout}</code>
              </p>
              <PanelGrid layout={layout}>
                {Array.from({ length: layout === "stack" ? 2 : 4 }, (_, i) => (
                  <div key={i} className={styles.card}>
                    Item {i + 1}
                  </div>
                ))}
              </PanelGrid>
            </div>
          ))}
        </div>
      </Section>

      <Section title="MetadataBlock">
        <MetadataBlock
          source="CAGED / Ministério do Trabalho"
          referencePeriod="jan/2020 – dez/2025"
          updatedAt="15/07/2026"
          owner="Equipe de Serviços"
          methodologyNote="Saldo = admissões menos desligamentos, apurado por competência de referência."
        />
      </Section>

      <Section title="Estados de feedback (genéricos)">
        <div className={styles.stack}>
          <LoadingState />
          <EmptyState />
          <ErrorState />
        </div>
      </Section>

      <Section
        title={`${COMPONENT_CATALOG["indicator-card"].label} — loading / success / empty / error`}
      >
        <ComponentDescription
          type="indicator-card"
          compatibleCount={compatibleCountByShape?.metric}
        />
        <StatesRow
          states={[
            loadingState<IndicatorData>(),
            successState(demoIndicator),
            emptyState<IndicatorData>(),
            errorState<IndicatorData>(),
          ]}
          render={(data) => (
            <IndicatorCard
              title="Saldo de empregos"
              data={data}
              format="integer"
              indicatorId="saldo-empregos"
            />
          )}
        />
      </Section>

      <Section
        title={`${COMPONENT_CATALOG["time-series"].label} — loading / success / empty / error`}
      >
        <ComponentDescription type="time-series" compatibleCount={compatibleCountByShape?.metric} />
        <StatesRow
          states={[
            loadingState<TimeSeriesPoint[]>(),
            successState(demoTimeSeries),
            emptyState<TimeSeriesPoint[]>(),
            errorState<TimeSeriesPoint[]>(),
          ]}
          render={(data) => (
            <TimeSeriesChart
              title="Evolução do saldo"
              data={data}
              format="integer"
              unit="vínculos"
            />
          )}
        />
      </Section>

      <Section
        title={`${COMPONENT_CATALOG["bar-chart"].label} — loading / success / empty / error`}
      >
        <ComponentDescription
          type="bar-chart"
          compatibleCount={compatibleCountByShape?.categorical}
        />
        <StatesRow
          states={[
            loadingState<CategoricalPoint[]>(),
            successState(demoCategorical),
            emptyState<CategoricalPoint[]>(),
            errorState<CategoricalPoint[]>(),
          ]}
          render={(data) => (
            <BarChart title="Vínculos por setor" data={data} sort="desc" format="integer" />
          )}
        />
      </Section>

      <Section
        title={`${COMPONENT_CATALOG["data-table"].label} — loading / success / empty / error`}
      >
        <ComponentDescription type="data-table" compatibleCount={compatibleCountByShape?.table} />
        <StatesRow
          states={[
            loadingState<TableData>(),
            successState(demoTable),
            emptyState<TableData>(),
            errorState<TableData>(),
          ]}
          render={(data) => <DataTable title="Vínculos por atividade" data={data} />}
        />
      </Section>

      <Section title="FilterBar — interativo">
        <FilterBar
          filters={demoFilters}
          values={filterValues}
          optionsByFilterId={demoFilterOptions}
          onChange={(filterId, values) =>
            setFilterValues((current) => ({ ...current, [filterId]: values }))
          }
          onClear={() => setFilterValues({})}
        />
      </Section>
    </div>
  );
}

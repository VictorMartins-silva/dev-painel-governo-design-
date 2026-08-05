import type { PanelConfig } from "../schemas/panel.schema";

export const demografia: PanelConfig = {
  schemaVersion: 1,
  id: "demografia",
  title: "Demografia",
  description: "Indicadores populacionais do município.",
  theme: "Demografia",
  tags: ["população", "ibge", "demografia"],
  metadata: {
    source: "IBGE (dados fictícios)",
    owner: "Equipe de Serviços",
    methodologyNote:
      "Estimativas populacionais fictícias para fins de protótipo, distribuídas por sexo, faixa etária e território.",
  },
  filters: [
    { id: "ano", type: "single-select", label: "Ano", dataField: "ano" },
    { id: "sexo", type: "multi-select", label: "Sexo", dataField: "sexo" },
    { id: "faixa_etaria", type: "multi-select", label: "Faixa etária", dataField: "faixaEtaria" },
    { id: "territorio", type: "multi-select", label: "Território", dataField: "territorio" },
  ],
  sections: [
    {
      id: "resumo",
      title: "Resumo",
      layout: "grid-2",
      components: [
        {
          id: "populacao-total",
          type: "indicator-card",
          title: "População total",
          metric: "populacao_total",
          format: "integer",
          comparison: "previous-period",
          indicatorId: "populacao_total",
        },
        {
          id: "crescimento",
          type: "indicator-card",
          title: "Crescimento populacional",
          metric: "crescimento_populacional",
          format: "percent",
          comparison: "previous-period",
          indicatorId: "crescimento_populacional",
        },
      ],
    },
    {
      id: "distribuicao",
      title: "Distribuição",
      layout: "grid-2",
      components: [
        {
          id: "por-sexo",
          type: "bar-chart",
          title: "Distribuição por sexo",
          metric: "distribuicao_sexo",
          dimension: "sexo",
          orientation: "vertical",
          sort: "none",
          format: "integer",
        },
        {
          id: "por-faixa",
          type: "bar-chart",
          title: "Distribuição por faixa etária",
          metric: "distribuicao_faixa_etaria",
          dimension: "faixaEtaria",
          orientation: "vertical",
          sort: "none",
          format: "integer",
        },
      ],
    },
    {
      id: "evolucao",
      title: "Evolução",
      layout: "stack",
      components: [
        {
          id: "populacao-tempo",
          type: "time-series",
          title: "Evolução populacional",
          metric: "populacao_total",
          format: "integer",
        },
        {
          id: "tab-territorio",
          type: "data-table",
          title: "População por território",
          dataset: "populacao_por_territorio",
          columns: [
            { field: "territorioLabel", label: "Território", type: "text" },
            { field: "populacao", label: "População", type: "integer" },
            { field: "variacao", label: "Variação", type: "percent" },
          ],
          limit: 15,
        },
      ],
    },
  ],
};

import type { ComponentConfig, ComponentType } from "./schemas/components.schema";
import type { IndicatorShape } from "./schemas/indicator.schema";

export type ComponentCatalogField = {
  name: string;
  required: boolean;
  description: string;
};

export type ComponentCatalogEntry = {
  type: ComponentType;
  label: string;
  summary: string;
  whenToUse: string;
  /** Forma de dado que o indicador precisa oferecer para ser compatível com este componente. */
  requiredShape: IndicatorShape;
  fields: ComponentCatalogField[];
  example: ComponentConfig;
};

export const COMPONENT_CATALOG: Record<ComponentType, ComponentCatalogEntry> = {
  "indicator-card": {
    type: "indicator-card",
    label: "Cartão de indicador",
    summary: "Um valor único em destaque, com comparação opcional ao período anterior.",
    whenToUse: "Para o número que resume o indicador — o primeiro dado que o cidadão deve ver.",
    requiredShape: "metric",
    fields: [
      { name: "metric", required: true, description: "Id do indicador no catálogo." },
      { name: "format", required: true, description: "Formato de exibição do valor." },
      {
        name: "comparison",
        required: false,
        description: "Referência de comparação: período anterior, ano anterior ou nenhuma.",
      },
      {
        name: "indicatorId",
        required: false,
        description: "Se definido, o cartão vira link para a página de metadados do indicador.",
      },
    ],
    example: {
      id: "exemplo-indicator-card",
      title: "Saldo de empregos",
      type: "indicator-card",
      metric: "saldo_empregos",
      format: "integer",
      comparison: "previous-period",
      indicatorId: "saldo_empregos",
    },
  },
  "time-series": {
    type: "time-series",
    label: "Série temporal",
    summary: "Evolução de um indicador ao longo do tempo, em linha.",
    whenToUse: "Para mostrar tendência — se o indicador está subindo, caindo ou estável.",
    requiredShape: "metric",
    fields: [
      { name: "metric", required: true, description: "Id do indicador no catálogo." },
      {
        name: "dimension",
        required: false,
        description: "Dimensão para quebrar a série (ex.: sexo, setor).",
      },
      {
        name: "format",
        required: false,
        description: "Formato de exibição do valor; automático quando omitido.",
      },
    ],
    example: {
      id: "exemplo-time-series",
      title: "Evolução do saldo",
      type: "time-series",
      metric: "saldo_empregos",
      format: "integer",
    },
  },
  "bar-chart": {
    type: "bar-chart",
    label: "Gráfico de barras",
    summary: "Comparação de um indicador entre categorias de uma dimensão.",
    whenToUse: "Para comparar partes de um todo — setores, faixas etárias, territórios.",
    requiredShape: "categorical",
    fields: [
      { name: "metric", required: true, description: "Id do indicador no catálogo." },
      { name: "dimension", required: true, description: "Dimensão exibida no eixo categórico." },
      { name: "orientation", required: true, description: "Barras verticais ou horizontais." },
      {
        name: "sort",
        required: true,
        description: "Ordenação das categorias: crescente, decrescente ou nenhuma.",
      },
      {
        name: "format",
        required: false,
        description: "Formato de exibição do valor; automático quando omitido.",
      },
    ],
    example: {
      id: "exemplo-bar-chart",
      title: "Vínculos por setor",
      type: "bar-chart",
      metric: "estoque_vinculos",
      dimension: "setor",
      orientation: "vertical",
      sort: "desc",
      format: "integer",
    },
  },
  "data-table": {
    type: "data-table",
    label: "Tabela",
    summary: "Linhas e colunas de um dataset tabular, com colunas configuráveis.",
    whenToUse: "Para o detalhe que não cabe num gráfico — múltiplas colunas por registro.",
    requiredShape: "table",
    fields: [
      { name: "dataset", required: true, description: "Id do dataset tabular no catálogo." },
      {
        name: "columns",
        required: true,
        description: "Colunas exibidas, na ordem — campo, rótulo e tipo de formatação.",
      },
      { name: "limit", required: false, description: "Número máximo de linhas exibidas." },
    ],
    example: {
      id: "exemplo-data-table",
      title: "Vínculos por atividade",
      type: "data-table",
      dataset: "vinculos_por_atividade",
      columns: [
        { field: "atividade", label: "Atividade", type: "text" },
        { field: "vinculos", label: "Vínculos", type: "integer" },
      ],
      limit: 10,
    },
  },
};

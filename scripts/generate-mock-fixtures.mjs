import { mkdir, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import prettier from "prettier";

const projectRoot = fileURLToPath(new URL("..", import.meta.url));
const datasetsDir = `${projectRoot}src/data/mock/datasets`;
const metricsDir = `${datasetsDir}/metrics`;
const categoricalDir = `${datasetsDir}/categorical`;
const tablesDir = `${datasetsDir}/tables`;

await mkdir(metricsDir, { recursive: true });
await mkdir(categoricalDir, { recursive: true });
await mkdir(tablesDir, { recursive: true });

const START_YEAR = 2024;
const MONTHS = 24;

function periodsOf(count) {
  return Array.from({ length: count }, (_, i) => {
    const year = START_YEAR + Math.floor(i / 12);
    const month = (i % 12) + 1;
    return { i, year, month, period: `${year}-${String(month).padStart(2, "0")}` };
  });
}

function baseRow({ period, year, month }, value) {
  return {
    period,
    ano: String(year),
    mes: String(month).padStart(2, "0"),
    sexo: "todos",
    faixaEtaria: "todas",
    value,
  };
}

function saldoValue(i, month) {
  const trend = 40 * i;
  const seasonal = Math.round(180 * Math.sin((month / 12) * Math.PI * 2));
  return 1200 + trend + seasonal;
}

function admissoesValue(i, month) {
  const trend = 25 * i;
  const seasonal = Math.round(220 * Math.sin((month / 12) * Math.PI * 2 + 0.4));
  return 3200 + trend + seasonal;
}

function buildMetricSeries(valueFn) {
  return periodsOf(MONTHS).map((p) => baseRow(p, valueFn(p.i, p.month)));
}

const saldoRows = buildMetricSeries(saldoValue);
const admissoesRows = buildMetricSeries(admissoesValue);
const desligamentosRows = periodsOf(MONTHS).map((p, i) =>
  baseRow(p, admissoesRows[i].value - saldoRows[i].value),
);

const estoqueRows = [];
let estoqueAcumulado = 52000;
for (const [i, p] of periodsOf(MONTHS).entries()) {
  estoqueAcumulado += saldoRows[i].value;
  estoqueRows.push(baseRow(p, estoqueAcumulado));
}

const metricasMetadata = {
  source: "CAGED / Ministério do Trabalho (dados fictícios)",
  referencePeriod: "jan/2024 – dez/2025",
  updatedAt: "2026-07-15",
};

const metricFiles = {
  saldo_empregos: saldoRows,
  admissoes: admissoesRows,
  desligamentos: desligamentosRows,
  estoque_vinculos: estoqueRows,
};

for (const [name, rows] of Object.entries(metricFiles)) {
  await writeFile(
    `${metricsDir}/${name}.json`,
    `${JSON.stringify({ metadata: metricasMetadata, rows }, null, 2)}\n`,
    "utf8",
  );
}

const setores = [
  { setor: "comercio", label: "Comércio", share: 0.32 },
  { setor: "servicos", label: "Serviços", share: 0.26 },
  { setor: "industria", label: "Indústria", share: 0.22 },
  { setor: "construcao", label: "Construção", share: 0.12 },
  { setor: "agropecuaria", label: "Agropecuária", share: 0.08 },
];

const estoqueAtual = estoqueRows[estoqueRows.length - 1].value;

const estoquePorSetor = {
  metadata: metricasMetadata,
  rows: setores.map((s) => ({
    category: s.label,
    setor: s.setor,
    value: Math.round(estoqueAtual * s.share),
  })),
};

await writeFile(
  `${categoricalDir}/estoque_vinculos.json`,
  `${JSON.stringify(estoquePorSetor, null, 2)}\n`,
  "utf8",
);

const atividades = [
  { atividade: "Comércio varejista", setor: "comercio", vinculos: 8900, variacao: 0.032 },
  { atividade: "Comércio atacadista", setor: "comercio", vinculos: 3100, variacao: 0.011 },
  { atividade: "Serviços administrativos", setor: "servicos", vinculos: 5200, variacao: 0.045 },
  { atividade: "Serviços de alimentação", setor: "servicos", vinculos: 3600, variacao: -0.008 },
  { atividade: "Indústria de transformação", setor: "industria", vinculos: 6100, variacao: -0.011 },
  { atividade: "Indústria têxtil", setor: "industria", vinculos: 1800, variacao: 0.006 },
  { atividade: "Construção de edifícios", setor: "construcao", vinculos: 2400, variacao: 0.021 },
  { atividade: "Produção agrícola", setor: "agropecuaria", vinculos: 1500, variacao: -0.004 },
];

const vinculosPorAtividade = {
  metadata: metricasMetadata,
  columns: [
    { field: "atividade", label: "Atividade", type: "text" },
    { field: "vinculos", label: "Vínculos", type: "integer" },
    { field: "variacao", label: "Variação", type: "percent" },
  ],
  rows: atividades,
};

await writeFile(
  `${tablesDir}/vinculos_por_atividade.json`,
  `${JSON.stringify(vinculosPorAtividade, null, 2)}\n`,
  "utf8",
);

// --- Demografia ---

const demografiaMetadata = {
  source: "IBGE (dados fictícios)",
  referencePeriod: "jan/2024 – dez/2025",
  updatedAt: "2026-07-15",
};

const sexos = [
  { sexo: "masculino", share: 0.493 },
  { sexo: "feminino", share: 0.507 },
];

const faixasEtarias = [
  { faixaEtaria: "18-24", share: 0.14 },
  { faixaEtaria: "25-39", share: 0.29 },
  { faixaEtaria: "40-59", share: 0.33 },
  { faixaEtaria: "60+", share: 0.24 },
];

function populacaoTotalNoPeriodo(i) {
  return Math.round(185000 * (1 + 0.0016 * i));
}

const populacaoTotalRows = [];
for (const p of periodsOf(MONTHS)) {
  const totalPeriodo = populacaoTotalNoPeriodo(p.i);
  for (const s of sexos) {
    for (const f of faixasEtarias) {
      populacaoTotalRows.push({
        period: p.period,
        ano: String(p.year),
        mes: String(p.month).padStart(2, "0"),
        sexo: s.sexo,
        faixaEtaria: f.faixaEtaria,
        value: Math.round(totalPeriodo * s.share * f.share),
      });
    }
  }
}

await writeFile(
  `${metricsDir}/populacao_total.json`,
  `${JSON.stringify({ metadata: demografiaMetadata, rows: populacaoTotalRows }, null, 2)}\n`,
  "utf8",
);

const crescimentoPopulacionalRows = periodsOf(MONTHS).map((p) => ({
  period: p.period,
  ano: String(p.year),
  mes: String(p.month).padStart(2, "0"),
  value: Number((0.016 - 0.0003 * p.i).toFixed(4)),
}));

await writeFile(
  `${metricsDir}/crescimento_populacional.json`,
  `${JSON.stringify({ metadata: demografiaMetadata, rows: crescimentoPopulacionalRows }, null, 2)}\n`,
  "utf8",
);

const populacaoAtual = populacaoTotalNoPeriodo(MONTHS - 1);

const distribuicaoSexo = {
  metadata: demografiaMetadata,
  rows: sexos.map((s) => ({
    category: s.sexo === "masculino" ? "Masculino" : "Feminino",
    sexo: s.sexo,
    value: Math.round(populacaoAtual * s.share),
  })),
};

await writeFile(
  `${categoricalDir}/distribuicao_sexo.json`,
  `${JSON.stringify(distribuicaoSexo, null, 2)}\n`,
  "utf8",
);

const faixaLabels = {
  "18-24": "18 a 24 anos",
  "25-39": "25 a 39 anos",
  "40-59": "40 a 59 anos",
  "60+": "60 anos ou mais",
};

const distribuicaoFaixaEtaria = {
  metadata: demografiaMetadata,
  rows: faixasEtarias.map((f) => ({
    category: faixaLabels[f.faixaEtaria],
    faixaEtaria: f.faixaEtaria,
    value: Math.round(populacaoAtual * f.share),
  })),
};

await writeFile(
  `${categoricalDir}/distribuicao_faixa_etaria.json`,
  `${JSON.stringify(distribuicaoFaixaEtaria, null, 2)}\n`,
  "utf8",
);

const territorios = [
  { territorio: "centro", label: "Centro", share: 0.22, variacao: 0.009 },
  { territorio: "norte", label: "Norte", share: 0.18, variacao: 0.014 },
  { territorio: "sul", label: "Sul", share: 0.2, variacao: 0.006 },
  { territorio: "leste", label: "Leste", share: 0.17, variacao: 0.011 },
  { territorio: "oeste", label: "Oeste", share: 0.14, variacao: 0.017 },
  { territorio: "zona-rural", label: "Zona Rural", share: 0.09, variacao: -0.003 },
];

const populacaoPorTerritorio = {
  metadata: demografiaMetadata,
  columns: [
    { field: "territorioLabel", label: "Território", type: "text" },
    { field: "populacao", label: "População", type: "integer" },
    { field: "variacao", label: "Variação", type: "percent" },
  ],
  rows: territorios.map((t) => ({
    territorio: t.territorio,
    territorioLabel: t.label,
    populacao: Math.round(populacaoAtual * t.share),
    variacao: t.variacao,
  })),
};

await writeFile(
  `${tablesDir}/populacao_por_territorio.json`,
  `${JSON.stringify(populacaoPorTerritorio, null, 2)}\n`,
  "utf8",
);

// --- Catálogo de indicadores (listIndicators) ---

function dimensionsOf(rows, excludeKeys) {
  if (rows.length === 0) return [];
  const candidateKeys = Object.keys(rows[0]).filter((key) => !excludeKeys.includes(key));
  return candidateKeys.filter((key) => new Set(rows.map((row) => row[key])).size > 1);
}

function indicatorEntry({ id, name, unit, source, shapes, dimensions, datasets, defaultFormat }) {
  const entry = { id, name, unit, source, shapes };
  if (dimensions && dimensions.length > 0) entry.dimensions = dimensions;
  if (datasets && datasets.length > 0) entry.datasets = datasets;
  if (defaultFormat) entry.defaultFormat = defaultFormat;
  return entry;
}

const metricExclude = ["period", "value", "ano", "mes"];
const categoricalExclude = ["category", "value"];

const indicators = [
  indicatorEntry({
    id: "populacao_total",
    name: "População total",
    unit: "habitantes",
    source: demografiaMetadata.source,
    shapes: ["metric"],
    dimensions: dimensionsOf(populacaoTotalRows, metricExclude),
    defaultFormat: "integer",
  }),
  indicatorEntry({
    id: "crescimento_populacional",
    name: "Crescimento populacional",
    unit: "%",
    source: demografiaMetadata.source,
    shapes: ["metric"],
    dimensions: dimensionsOf(crescimentoPopulacionalRows, metricExclude),
    defaultFormat: "percent",
  }),
  indicatorEntry({
    id: "saldo_empregos",
    name: "Saldo de empregos",
    unit: "vínculos",
    source: metricasMetadata.source,
    shapes: ["metric"],
    dimensions: dimensionsOf(saldoRows, metricExclude),
    defaultFormat: "integer",
  }),
  indicatorEntry({
    id: "admissoes",
    name: "Admissões",
    unit: "vínculos",
    source: metricasMetadata.source,
    shapes: ["metric"],
    dimensions: dimensionsOf(admissoesRows, metricExclude),
    defaultFormat: "integer",
  }),
  indicatorEntry({
    id: "desligamentos",
    name: "Desligamentos",
    unit: "vínculos",
    source: metricasMetadata.source,
    shapes: ["metric"],
    dimensions: dimensionsOf(desligamentosRows, metricExclude),
    defaultFormat: "integer",
  }),
  indicatorEntry({
    id: "estoque_vinculos",
    name: "Estoque de vínculos",
    unit: "vínculos",
    source: metricasMetadata.source,
    shapes: ["metric", "categorical"],
    dimensions: [
      ...dimensionsOf(estoqueRows, metricExclude),
      ...dimensionsOf(estoquePorSetor.rows, categoricalExclude),
    ],
    defaultFormat: "integer",
  }),
  indicatorEntry({
    id: "distribuicao_sexo",
    name: "Distribuição por sexo",
    unit: "habitantes",
    source: demografiaMetadata.source,
    shapes: ["categorical"],
    dimensions: dimensionsOf(distribuicaoSexo.rows, categoricalExclude),
    defaultFormat: "integer",
  }),
  indicatorEntry({
    id: "distribuicao_faixa_etaria",
    name: "Distribuição por faixa etária",
    unit: "habitantes",
    source: demografiaMetadata.source,
    shapes: ["categorical"],
    dimensions: dimensionsOf(distribuicaoFaixaEtaria.rows, categoricalExclude),
    defaultFormat: "integer",
  }),
  indicatorEntry({
    id: "populacao_por_territorio",
    name: "População por território",
    unit: "habitantes",
    source: demografiaMetadata.source,
    shapes: ["table"],
    datasets: ["populacao_por_territorio"],
    defaultFormat: "integer",
  }),
  indicatorEntry({
    id: "vinculos_por_atividade",
    name: "Vínculos por atividade econômica",
    unit: "vínculos",
    source: metricasMetadata.source,
    shapes: ["table"],
    datasets: ["vinculos_por_atividade"],
    defaultFormat: "integer",
  }),
];

const prettierConfig = await prettier.resolveConfig(`${projectRoot}indicators.json`);
const formattedIndicators = await prettier.format(JSON.stringify(indicators), {
  ...prettierConfig,
  parser: "json",
});

await writeFile(`${datasetsDir}/indicators.json`, formattedIndicators, "utf8");

console.log(
  "Mock fixtures gerados: metrics/{saldo_empregos,admissoes,desligamentos,estoque_vinculos,populacao_total,crescimento_populacional}.json, categorical/{estoque_vinculos,distribuicao_sexo,distribuicao_faixa_etaria}.json, tables/{vinculos_por_atividade,populacao_por_territorio}.json, indicators.json",
);

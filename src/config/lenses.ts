import type { PanelSummary } from "../data/provider";
import type { LensConfig } from "./schemas/lens.schema";

/**
 * Conceito central: não existe uma "árvore" de navegação por secretaria, outra por tema, outra
 * por ODS. Existe um único índice de painéis (o catálogo) e cada uma dessas taxonomias é uma
 * LENTE — um recorte — sobre esse mesmo índice. Ver mockup-painel-governo.html (RECORTES).
 *
 * Além das lentes embutidas abaixo (LENSES), o admin permite cadastrar lentes "planas": um
 * conjunto fixo de painéis associado a um nome (ver LensConfig, admin/store/LensStore.ts).
 * `lensFromConfig`/`allLenses` adaptam essas lentes cadastradas ao mesmo contrato `Lens`.
 */
export type LensId = string;

export type Lens = {
  id: LensId;
  label: string;
  allLabel: string;
  description: string;
  /** Chave usada na querystring do Catálogo (`/paineis?<param>=<valor>`). */
  param: string;
  valueOf: (panel: PanelSummary) => string;
};

// Secretaria e ODS não fazem parte do contrato de dados do painel (PanelConfig). Mapeamento
// heurístico por tema, centralizado aqui para ser reaproveitado por toda tela que navega pelas
// lentes (Home, Catálogo) — ver limitação conhecida no README.
const SECRETARIA_BY_THEME: Record<string, string> = {
  "Desenvolvimento Econômico": "Secretaria de Desenvolvimento Econômico",
  Demografia: "Secretaria de Planejamento",
};

const ODS_BY_THEME: Record<string, string> = {
  "Desenvolvimento Econômico": "ODS 8 – Trabalho decente e crescimento econômico",
  Demografia: "ODS 11 – Cidades e comunidades sustentáveis",
};

export const LENSES: Lens[] = [
  {
    id: "tema",
    label: "Tema",
    allLabel: "Todos os temas",
    description: "Assunto do painel, independente de quem o publica.",
    param: "tema",
    valueOf: (panel) => panel.theme,
  },
  {
    id: "secretaria",
    label: "Secretaria",
    allLabel: "Todas as secretarias",
    description: "Quem responde pelo painel na estrutura da prefeitura.",
    param: "secretaria",
    valueOf: (panel) => SECRETARIA_BY_THEME[panel.theme] ?? panel.theme,
  },
  {
    id: "ods",
    label: "ODS",
    allLabel: "Todos os ODS",
    description: "Alinhamento do painel à Agenda 2030.",
    param: "ods",
    valueOf: (panel) => ODS_BY_THEME[panel.theme] ?? "—",
  },
];

/** Adapta uma lente cadastrada no admin (conjunto fixo de painéis) ao contrato `Lens`. */
export function lensFromConfig(config: LensConfig): Lens {
  const memberIds = new Set(config.panelIds);
  return {
    id: config.id,
    label: config.label,
    allLabel: config.allLabel || `Todos — ${config.label}`,
    description: config.description,
    param: `lente-${config.id}`,
    // string vazia para não-membros: lensValues() ignora e não gera uma categoria "de fora".
    valueOf: (panel) => (memberIds.has(panel.id) ? config.label : ""),
  };
}

/** Lentes embutidas + lentes cadastradas no admin, prontas para uso pelas telas públicas. */
export function allLenses(customLenses: LensConfig[] = []): Lens[] {
  return [...LENSES, ...customLenses.map(lensFromConfig)];
}

export function findLens(id: string, customLenses: LensConfig[] = []): Lens | undefined {
  return allLenses(customLenses).find((lens) => lens.id === id);
}

export type LensValueCount = { value: string; count: number };

/** Valores distintos que a lente assume no índice atual de painéis, com contagem. */
export function lensValues(lens: Lens, panels: PanelSummary[]): LensValueCount[] {
  const counts = new Map<string, number>();
  for (const panel of panels) {
    const value = lens.valueOf(panel);
    if (!value) continue; // painel fora do recorte (lente "plana" cadastrada no admin)
    counts.set(value, (counts.get(value) ?? 0) + 1);
  }
  return Array.from(counts.entries())
    .map(([value, count]) => ({ value, count }))
    .sort((a, b) => a.value.localeCompare(b.value, "pt-BR"));
}

export function lensHref(lens: Lens, value: string): string {
  return `/paineis?${lens.param}=${encodeURIComponent(value)}`;
}

/**
 * Filtra o índice unificado de painéis pelos recortes de lente ativos (um valor por lente).
 * `lenses` deve incluir as cadastradas no admin (allLenses()) — do contrário um filtro ativo
 * numa lente custom é ignorado e o catálogo volta a mostrar tudo.
 */
export function filterByLenses(
  panels: PanelSummary[],
  activeValues: Partial<Record<LensId, string>>,
  lenses: Lens[] = LENSES,
): PanelSummary[] {
  return panels.filter((panel) =>
    lenses.every((lens) => {
      const active = activeValues[lens.id];
      return !active || lens.valueOf(panel) === active;
    }),
  );
}

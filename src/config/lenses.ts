import type { PanelSummary } from "../data/provider";

/**
 * Conceito central: não existe uma "árvore" de navegação por secretaria, outra por tema, outra
 * por ODS. Existe um único índice de painéis (o catálogo) e cada uma dessas taxonomias é uma
 * LENTE — um recorte — sobre esse mesmo índice. Ver mockup-painel-governo.html (RECORTES).
 */
export type LensId = "tema" | "secretaria" | "ods";

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

export function findLens(id: string): Lens | undefined {
  return LENSES.find((lens) => lens.id === id);
}

export type LensValueCount = { value: string; count: number };

/** Valores distintos que a lente assume no índice atual de painéis, com contagem. */
export function lensValues(lens: Lens, panels: PanelSummary[]): LensValueCount[] {
  const counts = new Map<string, number>();
  for (const panel of panels) {
    const value = lens.valueOf(panel);
    counts.set(value, (counts.get(value) ?? 0) + 1);
  }
  return Array.from(counts.entries())
    .map(([value, count]) => ({ value, count }))
    .sort((a, b) => a.value.localeCompare(b.value, "pt-BR"));
}

/** Valor mais frequente da lente — usado como recorte inicial ao entrar pela Home. */
export function topLensValue(lens: Lens, panels: PanelSummary[]): string | undefined {
  return [...lensValues(lens, panels)].sort((a, b) => b.count - a.count)[0]?.value;
}

export function lensHref(lens: Lens, value: string): string {
  return `/paineis?${lens.param}=${encodeURIComponent(value)}`;
}

/** Filtra o índice unificado de painéis pelos recortes de lente ativos (um valor por lente). */
export function filterByLenses(
  panels: PanelSummary[],
  activeValues: Partial<Record<LensId, string>>,
): PanelSummary[] {
  return panels.filter((panel) =>
    LENSES.every((lens) => {
      const active = activeValues[lens.id];
      return !active || lens.valueOf(panel) === active;
    }),
  );
}

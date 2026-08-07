import { z } from "zod";

export const SUPPORTED_SCHEMA_VERSION = 3;

const panelMetadataSchema = z.object({
  source: z.string().min(1, "Campo obrigatório"),
  owner: z.string().min(1, "Campo obrigatório"),
  methodologyNote: z.string().optional(),
});

/** Painéis "kiosk" são desenhados para telão (fontes maiores, só o essencial) e não
 *  aparecem no catálogo público — só em Apresentações e no admin. */
export const PANEL_PRESENTATIONS = ["default", "kiosk"] as const;
export type PanelPresentation = (typeof PANEL_PRESENTATIONS)[number];

const panelBaseSchema = {
  schemaVersion: z.literal(SUPPORTED_SCHEMA_VERSION),
  id: z.string().min(1, "Campo obrigatório"),
  title: z.string().min(1, "Campo obrigatório"),
  description: z.string().min(1, "Campo obrigatório"),
  theme: z.string().min(1, "Campo obrigatório"),
  tags: z.array(z.string()).default([]),
  metadata: panelMetadataSchema,
  presentation: z.enum(PANEL_PRESENTATIONS).default("default"),
  /** Id do painel de origem, quando este é a versão de telão de outro painel. */
  variantOf: z.string().optional(),
};

/**
 * Provedores de embed suportados — todos são, do ponto de vista da aplicação, só uma URL de
 * iframe validada contra a allowlist de domínios; o que muda é quem pode ver e quem responde
 * pela renderização:
 * - "powerbi-public": Arquivo → Publicar na Web. Iframe público, sem login, sem RLS/OLS.
 * - "powerbi-secure": Arquivo → Incorporar relatório → Site ou portal ("Secure Embed"/"embed for
 *   your organization"). Exige que quem está vendo esteja autenticado no Power BI do tenant —
 *   nesse caso a visualização respeita RLS/OLS e permissões reais, sem precisar de service
 *   principal nem de backend emitindo token. No kiosk (telão sem interação humana), isso só
 *   funciona se o navegador que roda a apresentação já tiver uma sessão Power BI persistida.
 * - "iframe-externo": painel que não é Power BI — um portal de BI próprio da prefeitura
 *   (GED, Painel 156, BI corporativo, Protocolo, Parcerias) exposto por uma rota pública. A
 *   aplicação não tem controle nenhum sobre autenticação, RLS ou frescor: só incorpora a página
 *   e depende do domínio estar na allowlist. Parte relevante do catálogo municipal está aqui,
 *   então o produto é uma camada sobre o Power BI *e* sobre esses portais legados.
 */
export const EMBED_PROVIDERS = ["powerbi-public", "powerbi-secure", "iframe-externo"] as const;
export type EmbedProvider = (typeof EMBED_PROVIDERS)[number];

export const embedConfigSchema = z.object({
  provider: z.enum(EMBED_PROVIDERS),
  url: z.string().min(1, "Campo obrigatório"),
});

export const panelConfigSchema = z.object({
  ...panelBaseSchema,
  embed: embedConfigSchema,
});

export type EmbedConfig = z.infer<typeof embedConfigSchema>;
export type PanelConfig = z.infer<typeof panelConfigSchema>;

export function parsePanelConfig(input: unknown) {
  return panelConfigSchema.safeParse(input);
}

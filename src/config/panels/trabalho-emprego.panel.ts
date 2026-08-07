import type { PanelConfig } from "../schemas/panel.schema";

export const trabalhoEmprego: PanelConfig = {
  schemaVersion: 3,
  id: "trabalho-emprego",
  title: "Trabalho e Emprego",
  description: "Indicadores do mercado formal de trabalho no município.",
  theme: "Desenvolvimento Econômico",
  tags: ["emprego", "caged", "trabalho"],
  metadata: {
    source: "CAGED / Ministério do Trabalho (dados fictícios)",
    owner: "Equipe de Serviços",
    methodologyNote:
      "Exemplo de demonstração: a URL de embed abaixo é um placeholder. Substitua por um " +
      "relatório real publicado no Power BI (Arquivo → Publicar na Web) ou por um relatório " +
      "do Power BI Embedded configurado em /admin/paineis.",
  },
  presentation: "default",
  embed: {
    provider: "powerbi-public",
    url: "https://app.powerbi.com/view?r=SUBSTITUA_PELA_URL_PUBLICADA",
  },
};

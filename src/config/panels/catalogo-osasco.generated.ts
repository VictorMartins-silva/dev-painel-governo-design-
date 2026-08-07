// ARQUIVO GERADO — não editar à mão.
// Fonte: docs/catalogo_paineis_osasco.xlsx (aba "dash-panel").
// Regerar com: npm run catalogo:import
//
// Para ajustar um painel individualmente sem perder a alteração na próxima importação, edite-o
// em /admin/paineis: o PanelStore grava a versão editada no localStorage e ela sobrepõe a
// estática por id.

import type { PanelConfig } from "../schemas/panel.schema";

export const catalogoOsascoPanels: PanelConfig[] = [
  {
    schemaVersion: 3,
    id: "casa-do-empreendedor-praca-de-atendimento",
    title: "Casa do Empreendedor - Praça de Atendimento",
    description: "Painel publicado pela Prefeitura de Osasco no tema 156.",
    theme: "156",
    tags: ["156"],
    metadata: {
      source: "Painel 156 — Prefeitura de Osasco",
      owner: "Prefeitura de Osasco — 156",
      methodologyNote:
        "Importado automaticamente da aba dash-panel de docs/catalogo_paineis_osasco.xlsx. Título, tema e URL de embed vêm da planilha; descrição, responsável e tags são provisórios e precisam de revisão editorial.",
    },
    presentation: "default",
    embed: {
      provider: "iframe-externo",
      url: "https://bi156painel.osasco.sp.gov.br/156/portal/osa/156/praca/pracaCasaEmpreendedor.jsf",
    },
  },
  {
    schemaVersion: 3,
    id: "casa-do-empreendedor-praca-de-atendimento-produtividade-por-atendente",
    title: "Casa do Empreendedor - Praça de Atendimento - Produtividade por Atendente",
    description: "Painel publicado pela Prefeitura de Osasco no tema 156.",
    theme: "156",
    tags: ["156"],
    metadata: {
      source: "Painel 156 — Prefeitura de Osasco",
      owner: "Prefeitura de Osasco — 156",
      methodologyNote:
        "Importado automaticamente da aba dash-panel de docs/catalogo_paineis_osasco.xlsx. Título, tema e URL de embed vêm da planilha; descrição, responsável e tags são provisórios e precisam de revisão editorial.",
    },
    presentation: "default",
    embed: {
      provider: "iframe-externo",
      url: "https://bi156painel.osasco.sp.gov.br/156/portal/osa/156/praca/pracaCasaEmpreendedorAtendentes.jsf",
    },
  },
  {
    schemaVersion: 3,
    id: "portal-do-trabalhador-centro-praca-de-atendimento",
    title: "Portal do Trabalhador - Centro - Praça de Atendimento",
    description: "Painel publicado pela Prefeitura de Osasco no tema 156.",
    theme: "156",
    tags: ["156"],
    metadata: {
      source: "Painel 156 — Prefeitura de Osasco",
      owner: "Prefeitura de Osasco — 156",
      methodologyNote:
        "Importado automaticamente da aba dash-panel de docs/catalogo_paineis_osasco.xlsx. Título, tema e URL de embed vêm da planilha; descrição, responsável e tags são provisórios e precisam de revisão editorial.",
    },
    presentation: "default",
    embed: {
      provider: "iframe-externo",
      url: "https://bi156painel.osasco.sp.gov.br/156/portal/osa/156/praca/pracaPortalTrabalhador.jsf",
    },
  },
  {
    schemaVersion: 3,
    id: "portal-do-trabalhador-santo-antonio-praca-de-atendimento",
    title: "Portal do Trabalhador - Santo Antônio - Praça de Atendimento",
    description: "Painel publicado pela Prefeitura de Osasco no tema 156.",
    theme: "156",
    tags: ["156"],
    metadata: {
      source: "Painel 156 — Prefeitura de Osasco",
      owner: "Prefeitura de Osasco — 156",
      methodologyNote:
        "Importado automaticamente da aba dash-panel de docs/catalogo_paineis_osasco.xlsx. Título, tema e URL de embed vêm da planilha; descrição, responsável e tags são provisórios e precisam de revisão editorial.",
    },
    presentation: "default",
    embed: {
      provider: "iframe-externo",
      url: "https://bi156painel.osasco.sp.gov.br/156/portal/osa/156/praca/pracaPortalTrabalhador.jsf?codPraca=806",
    },
  },
  {
    schemaVersion: 3,
    id: "portal-do-trabalhador-zona-norte-praca-de-atendimento",
    title: "Portal do Trabalhador - Zona Norte - Praça de Atendimento",
    description: "Painel publicado pela Prefeitura de Osasco no tema 156.",
    theme: "156",
    tags: ["156"],
    metadata: {
      source: "Painel 156 — Prefeitura de Osasco",
      owner: "Prefeitura de Osasco — 156",
      methodologyNote:
        "Importado automaticamente da aba dash-panel de docs/catalogo_paineis_osasco.xlsx. Título, tema e URL de embed vêm da planilha; descrição, responsável e tags são provisórios e precisam de revisão editorial.",
    },
    presentation: "default",
    embed: {
      provider: "iframe-externo",
      url: "https://bi156painel.osasco.sp.gov.br/156/portal/osa/156/praca/pracaPortalTrabalhador.jsf?codPraca=942",
    },
  },
  {
    schemaVersion: 3,
    id: "protocolos-156-pendencias-por-regiao",
    title: "Protocolos 156 - Pendências por Região",
    description: "Painel publicado pela Prefeitura de Osasco no tema 156.",
    theme: "156",
    tags: ["156"],
    metadata: {
      source: "Painel 156 — Prefeitura de Osasco",
      owner: "Prefeitura de Osasco — 156",
      methodologyNote:
        "Importado automaticamente da aba dash-panel de docs/catalogo_paineis_osasco.xlsx. Título, tema e URL de embed vêm da planilha; descrição, responsável e tags são provisórios e precisam de revisão editorial.",
    },
    presentation: "default",
    embed: {
      provider: "iframe-externo",
      url: "https://bi156painel.osasco.sp.gov.br/156/portal/osa/156/servicos/regiao/servicoPorRegiao.jsf",
    },
  },
  {
    schemaVersion: 3,
    id: "protocolos-156-sso-pendencias-regiao-norte",
    title: "Protocolos 156 - SSO - Pendências Região Norte",
    description: "Painel publicado pela Prefeitura de Osasco no tema 156.",
    theme: "156",
    tags: ["156"],
    metadata: {
      source: "Painel 156 — Prefeitura de Osasco",
      owner: "Prefeitura de Osasco — 156",
      methodologyNote:
        "Importado automaticamente da aba dash-panel de docs/catalogo_paineis_osasco.xlsx. Título, tema e URL de embed vêm da planilha; descrição, responsável e tags são provisórios e precisam de revisão editorial.",
    },
    presentation: "default",
    embed: {
      provider: "iframe-externo",
      url: "https://bi156painel.osasco.sp.gov.br/156/portal/osa/156/servicos/regiao/servicoPorRegiaoNorte.jsf",
    },
  },
  {
    schemaVersion: 3,
    id: "protocolos-156-sso-pendencias-regiao-sul-centro",
    title: "Protocolos 156 - SSO - Pendências Região Sul/Centro",
    description: "Painel publicado pela Prefeitura de Osasco no tema 156.",
    theme: "156",
    tags: ["156"],
    metadata: {
      source: "Painel 156 — Prefeitura de Osasco",
      owner: "Prefeitura de Osasco — 156",
      methodologyNote:
        "Importado automaticamente da aba dash-panel de docs/catalogo_paineis_osasco.xlsx. Título, tema e URL de embed vêm da planilha; descrição, responsável e tags são provisórios e precisam de revisão editorial.",
    },
    presentation: "default",
    embed: {
      provider: "iframe-externo",
      url: "https://bi156painel.osasco.sp.gov.br/156/portal/osa/156/servicos/regiao/servicoPorRegiaoSul.jsf",
    },
  },
  {
    schemaVersion: 3,
    id: "protocolos-156-top-10-mes-anterior",
    title: "Protocolos 156 - Top 10 (Mês anterior)",
    description: "Painel publicado pela Prefeitura de Osasco no tema 156.",
    theme: "156",
    tags: ["156"],
    metadata: {
      source: "Painel 156 — Prefeitura de Osasco",
      owner: "Prefeitura de Osasco — 156",
      methodologyNote:
        "Importado automaticamente da aba dash-panel de docs/catalogo_paineis_osasco.xlsx. Título, tema e URL de embed vêm da planilha; descrição, responsável e tags são provisórios e precisam de revisão editorial.",
    },
    presentation: "default",
    embed: {
      provider: "iframe-externo",
      url: "https://bi156painel.osasco.sp.gov.br/156/portal/osa/156/categoria/protocolosPorCategoria.jsf",
    },
  },
  {
    schemaVersion: 3,
    id: "protocolos-156-visao-executiva-do-prefeito",
    title: "Protocolos 156 - Visão Executiva do Prefeito",
    description: "Painel publicado pela Prefeitura de Osasco no tema 156.",
    theme: "156",
    tags: ["156", "power bi"],
    metadata: {
      source: "Power BI — Prefeitura de Osasco",
      owner: "Prefeitura de Osasco — 156",
      methodologyNote:
        "Importado automaticamente da aba dash-panel de docs/catalogo_paineis_osasco.xlsx. Título, tema e URL de embed vêm da planilha; descrição, responsável e tags são provisórios e precisam de revisão editorial.",
    },
    presentation: "default",
    embed: {
      provider: "powerbi-public",
      url: "https://app.powerbi.com/view?r=eyJrIjoiYzA0ZTMxNWYtZDRmYi00NTQ1LWI5N2QtZTY5MDhkMjZlZThhIiwidCI6IjU3NWNkYTA5LTg5OWYtNDJmMy04NGM1LWRmOGQ2YzZmMzM5YSJ9",
    },
  },
  {
    schemaVersion: 3,
    id: "operacao-baixas-temperaturas-1-visao-geral",
    title: "Operação Baixas Temperaturas - 1. Visão Geral",
    description: "Painel publicado pela Prefeitura de Osasco no tema Assistência Social.",
    theme: "Assistência Social",
    tags: ["assistencia social", "power bi"],
    metadata: {
      source: "Power BI — Prefeitura de Osasco",
      owner: "Prefeitura de Osasco — Assistência Social",
      methodologyNote:
        "Importado automaticamente da aba dash-panel de docs/catalogo_paineis_osasco.xlsx. Título, tema e URL de embed vêm da planilha; descrição, responsável e tags são provisórios e precisam de revisão editorial.",
    },
    presentation: "default",
    embed: {
      provider: "powerbi-public",
      url: "https://app.powerbi.com/view?r=eyJrIjoiZDJmMTI2YzItMDU4MS00Zjc5LTg3NmQtYWE4OWZiYjczYzM0IiwidCI6IjkwZGQ1YjY0LWU3MTAtNGQzZi1iYmVjLTU5NDI3Y2NiNDVhOSJ9",
    },
  },
  {
    schemaVersion: 3,
    id: "operacao-baixas-temperaturas-2-abordagens",
    title: "Operação Baixas Temperaturas - 2. Abordagens",
    description: "Painel publicado pela Prefeitura de Osasco no tema Assistência Social.",
    theme: "Assistência Social",
    tags: ["assistencia social", "power bi"],
    metadata: {
      source: "Power BI — Prefeitura de Osasco",
      owner: "Prefeitura de Osasco — Assistência Social",
      methodologyNote:
        "Importado automaticamente da aba dash-panel de docs/catalogo_paineis_osasco.xlsx. Título, tema e URL de embed vêm da planilha; descrição, responsável e tags são provisórios e precisam de revisão editorial.",
    },
    presentation: "default",
    embed: {
      provider: "powerbi-public",
      url: "https://app.powerbi.com/view?r=eyJrIjoiNDdkYzQ3YjEtNGRhNi00OTA0LTkzMWEtNGQyM2YyODc4ZTg2IiwidCI6IjkwZGQ1YjY0LWU3MTAtNGQzZi1iYmVjLTU5NDI3Y2NiNDVhOSJ9",
    },
  },
  {
    schemaVersion: 3,
    id: "operacao-baixas-temperaturas-3-atendimentos",
    title: "Operação Baixas Temperaturas - 3. Atendimentos",
    description: "Painel publicado pela Prefeitura de Osasco no tema Assistência Social.",
    theme: "Assistência Social",
    tags: ["assistencia social", "power bi"],
    metadata: {
      source: "Power BI — Prefeitura de Osasco",
      owner: "Prefeitura de Osasco — Assistência Social",
      methodologyNote:
        "Importado automaticamente da aba dash-panel de docs/catalogo_paineis_osasco.xlsx. Título, tema e URL de embed vêm da planilha; descrição, responsável e tags são provisórios e precisam de revisão editorial.",
    },
    presentation: "default",
    embed: {
      provider: "powerbi-public",
      url: "https://app.powerbi.com/view?r=eyJrIjoiNTFjOGYwMjUtNjQ3Ni00NmRhLTlhY2ItYmM4YzJiYzZjODM5IiwidCI6IjkwZGQ1YjY0LWU3MTAtNGQzZi1iYmVjLTU5NDI3Y2NiNDVhOSJ9",
    },
  },
  {
    schemaVersion: 3,
    id: "operacao-baixas-temperaturas-4-entregas",
    title: "Operação Baixas Temperaturas - 4. Entregas",
    description: "Painel publicado pela Prefeitura de Osasco no tema Assistência Social.",
    theme: "Assistência Social",
    tags: ["assistencia social", "power bi"],
    metadata: {
      source: "Power BI — Prefeitura de Osasco",
      owner: "Prefeitura de Osasco — Assistência Social",
      methodologyNote:
        "Importado automaticamente da aba dash-panel de docs/catalogo_paineis_osasco.xlsx. Título, tema e URL de embed vêm da planilha; descrição, responsável e tags são provisórios e precisam de revisão editorial.",
    },
    presentation: "default",
    embed: {
      provider: "powerbi-public",
      url: "https://app.powerbi.com/view?r=eyJrIjoiNzg1NTZjYjMtZTM2ZC00ODgyLTljMmQtMTgxMjA2NmQ2ZTU3IiwidCI6IjkwZGQ1YjY0LWU3MTAtNGQzZi1iYmVjLTU5NDI3Y2NiNDVhOSJ9",
    },
  },
  {
    schemaVersion: 3,
    id: "operacao-baixas-temperaturas-5-acolhimentos",
    title: "Operação Baixas Temperaturas - 5. Acolhimentos",
    description: "Painel publicado pela Prefeitura de Osasco no tema Assistência Social.",
    theme: "Assistência Social",
    tags: ["assistencia social", "power bi"],
    metadata: {
      source: "Power BI — Prefeitura de Osasco",
      owner: "Prefeitura de Osasco — Assistência Social",
      methodologyNote:
        "Importado automaticamente da aba dash-panel de docs/catalogo_paineis_osasco.xlsx. Título, tema e URL de embed vêm da planilha; descrição, responsável e tags são provisórios e precisam de revisão editorial.",
    },
    presentation: "default",
    embed: {
      provider: "powerbi-public",
      url: "https://app.powerbi.com/view?r=eyJrIjoiZjkzOTVmNGItYWZhNy00Y2NjLTg0ZmUtZWZkZDhiZmE1YTg5IiwidCI6IjkwZGQ1YjY0LWU3MTAtNGQzZi1iYmVjLTU5NDI3Y2NiNDVhOSJ9",
    },
  },
  {
    schemaVersion: 3,
    id: "operacao-baixas-temperaturas-6-acolhimentos-e-capacidade",
    title: "Operação Baixas Temperaturas - 6. Acolhimentos e Capacidade",
    description: "Painel publicado pela Prefeitura de Osasco no tema Assistência Social.",
    theme: "Assistência Social",
    tags: ["assistencia social", "power bi"],
    metadata: {
      source: "Power BI — Prefeitura de Osasco",
      owner: "Prefeitura de Osasco — Assistência Social",
      methodologyNote:
        "Importado automaticamente da aba dash-panel de docs/catalogo_paineis_osasco.xlsx. Título, tema e URL de embed vêm da planilha; descrição, responsável e tags são provisórios e precisam de revisão editorial.",
    },
    presentation: "default",
    embed: {
      provider: "powerbi-public",
      url: "https://app.powerbi.com/view?r=eyJrIjoiMDgzYjY2MDQtYzYwMy00ZWMwLTg1NTgtNmE5NjM0ZTczMzI0IiwidCI6IjkwZGQ1YjY0LWU3MTAtNGQzZi1iYmVjLTU5NDI3Y2NiNDVhOSJ9",
    },
  },
  {
    schemaVersion: 3,
    id: "sistema-de-gestao-de-parcerias-do-terceiro-setor",
    title: "Sistema de gestão de parcerias do terceiro setor",
    description: "Painel publicado pela Prefeitura de Osasco no tema CGM.",
    theme: "CGM",
    tags: ["cgm", "parcerias"],
    metadata: {
      source: "Portal de Parcerias — Prefeitura de Osasco",
      owner: "Prefeitura de Osasco — CGM",
      methodologyNote:
        "Importado automaticamente da aba dash-panel de docs/catalogo_paineis_osasco.xlsx. Título, tema e URL de embed vêm da planilha; descrição, responsável e tags são provisórios e precisam de revisão editorial.",
    },
    presentation: "default",
    embed: {
      provider: "iframe-externo",
      url: "https://parcerias.osasco.sp.gov.br/portal/parcerias-vigentes",
    },
  },
  {
    schemaVersion: 3,
    id: "abertura-de-empresas-2026",
    title: "Abertura de Empresas 2026",
    description: "Painel publicado pela Prefeitura de Osasco no tema Desenvolvimento Econômico.",
    theme: "Desenvolvimento Econômico",
    tags: ["desenvolvimento economico", "power bi"],
    metadata: {
      source: "Power BI — Prefeitura de Osasco",
      owner: "Prefeitura de Osasco — Desenvolvimento Econômico",
      methodologyNote:
        "Importado automaticamente da aba dash-panel de docs/catalogo_paineis_osasco.xlsx. Título, tema e URL de embed vêm da planilha; descrição, responsável e tags são provisórios e precisam de revisão editorial.",
    },
    presentation: "default",
    embed: {
      provider: "powerbi-public",
      url: "https://app.powerbi.com/view?r=eyJrIjoiYjM4YWMyMjItZTI0ZS00M2QwLTgwNDQtYzE1YjUxYjZlZGU0IiwidCI6ImE0NzUzNGU0LThlMDYtNDdhMi1hMDNmLTEwMDRjM2RiOWFmMyJ9",
    },
  },
  {
    schemaVersion: 3,
    id: "acessos-ao-sistema-ged",
    title: "Acessos ao Sistema GED",
    description: "Painel publicado pela Prefeitura de Osasco no tema Educação.",
    theme: "Educação",
    tags: ["educacao", "ged"],
    metadata: {
      source: "BI Gestão Educacional (GED) — Prefeitura de Osasco",
      owner: "Prefeitura de Osasco — Educação",
      methodologyNote:
        "Importado automaticamente da aba dash-panel de docs/catalogo_paineis_osasco.xlsx. Título, tema e URL de embed vêm da planilha; descrição, responsável e tags são provisórios e precisam de revisão editorial.",
    },
    presentation: "default",
    embed: {
      provider: "iframe-externo",
      url: "https://bi-gestaoeducacional.osasco.sp.gov.br/ged-bi/#/publico/dashboard-acessos",
    },
  },
  {
    schemaVersion: 3,
    id: "avaliacoes-piap-osasco",
    title: "Avaliações PIAP Osasco",
    description: "Painel publicado pela Prefeitura de Osasco no tema Educação.",
    theme: "Educação",
    tags: ["educacao", "ged"],
    metadata: {
      source: "BI Gestão Educacional (GED) — Prefeitura de Osasco",
      owner: "Prefeitura de Osasco — Educação",
      methodologyNote:
        "Importado automaticamente da aba dash-panel de docs/catalogo_paineis_osasco.xlsx. Título, tema e URL de embed vêm da planilha; descrição, responsável e tags são provisórios e precisam de revisão editorial.",
    },
    presentation: "default",
    embed: {
      provider: "iframe-externo",
      url: "https://bi-gestaoeducacional.osasco.sp.gov.br/ged-bi/#/publico/avaliacao-piap",
    },
  },
  {
    schemaVersion: 3,
    id: "desempenho-escolar",
    title: "Desempenho Escolar",
    description: "Painel publicado pela Prefeitura de Osasco no tema Educação.",
    theme: "Educação",
    tags: ["educacao", "ged"],
    metadata: {
      source: "BI Gestão Educacional (GED) — Prefeitura de Osasco",
      owner: "Prefeitura de Osasco — Educação",
      methodologyNote:
        "Importado automaticamente da aba dash-panel de docs/catalogo_paineis_osasco.xlsx. Título, tema e URL de embed vêm da planilha; descrição, responsável e tags são provisórios e precisam de revisão editorial.",
    },
    presentation: "default",
    embed: {
      provider: "iframe-externo",
      url: "https://bi-gestaoeducacional.osasco.sp.gov.br/ged-bi/#/publico/desempenho-escolar",
    },
  },
  {
    schemaVersion: 3,
    id: "historico-ideb",
    title: "Histórico IDEB",
    description: "Painel publicado pela Prefeitura de Osasco no tema Educação.",
    theme: "Educação",
    tags: ["educacao", "ged"],
    metadata: {
      source: "BI Gestão Educacional (GED) — Prefeitura de Osasco",
      owner: "Prefeitura de Osasco — Educação",
      methodologyNote:
        "Importado automaticamente da aba dash-panel de docs/catalogo_paineis_osasco.xlsx. Título, tema e URL de embed vêm da planilha; descrição, responsável e tags são provisórios e precisam de revisão editorial.",
    },
    presentation: "default",
    embed: {
      provider: "iframe-externo",
      url: "https://bi-gestaoeducacional.osasco.sp.gov.br/ged-bi/#/publico/historico-ideb",
    },
  },
  {
    schemaVersion: 3,
    id: "indicadores-atuais",
    title: "Indicadores Atuais",
    description: "Painel publicado pela Prefeitura de Osasco no tema Educação.",
    theme: "Educação",
    tags: ["educacao", "ged"],
    metadata: {
      source: "BI Gestão Educacional (GED) — Prefeitura de Osasco",
      owner: "Prefeitura de Osasco — Educação",
      methodologyNote:
        "Importado automaticamente da aba dash-panel de docs/catalogo_paineis_osasco.xlsx. Título, tema e URL de embed vêm da planilha; descrição, responsável e tags são provisórios e precisam de revisão editorial.",
    },
    presentation: "default",
    embed: {
      provider: "iframe-externo",
      url: "https://bi-gestaoeducacional.osasco.sp.gov.br/ged-bi/#/publico/indicadores-atuais",
    },
  },
  {
    schemaVersion: 3,
    id: "indicadores-gerais-educacao",
    title: "Indicadores Gerais (Educação)",
    description: "Painel publicado pela Prefeitura de Osasco no tema Educação.",
    theme: "Educação",
    tags: ["educacao", "ged"],
    metadata: {
      source: "BI Gestão Educacional (GED) — Prefeitura de Osasco",
      owner: "Prefeitura de Osasco — Educação",
      methodologyNote:
        "Importado automaticamente da aba dash-panel de docs/catalogo_paineis_osasco.xlsx. Título, tema e URL de embed vêm da planilha; descrição, responsável e tags são provisórios e precisam de revisão editorial.",
    },
    presentation: "default",
    embed: {
      provider: "iframe-externo",
      url: "https://bi-gestaoeducacional.osasco.sp.gov.br/ged-bi/#/publico/dashboard-painel-educacao",
    },
  },
  {
    schemaVersion: 3,
    id: "indicadores-gerais-por-unidade-educacao",
    title: "Indicadores Gerais por Unidade (Educação)",
    description: "Painel publicado pela Prefeitura de Osasco no tema Educação.",
    theme: "Educação",
    tags: ["educacao", "ged"],
    metadata: {
      source: "BI Gestão Educacional (GED) — Prefeitura de Osasco",
      owner: "Prefeitura de Osasco — Educação",
      methodologyNote:
        "Importado automaticamente da aba dash-panel de docs/catalogo_paineis_osasco.xlsx. Título, tema e URL de embed vêm da planilha; descrição, responsável e tags são provisórios e precisam de revisão editorial.",
    },
    presentation: "default",
    embed: {
      provider: "iframe-externo",
      url: "https://bi-gestaoeducacional.osasco.sp.gov.br/ged-bi/#/publico/quadro-geral-unidade",
    },
  },
  {
    schemaVersion: 3,
    id: "informacoes-das-escolas",
    title: "Informações das Escolas",
    description: "Painel publicado pela Prefeitura de Osasco no tema Educação.",
    theme: "Educação",
    tags: ["educacao", "ged"],
    metadata: {
      source: "BI Gestão Educacional (GED) — Prefeitura de Osasco",
      owner: "Prefeitura de Osasco — Educação",
      methodologyNote:
        "Importado automaticamente da aba dash-panel de docs/catalogo_paineis_osasco.xlsx. Título, tema e URL de embed vêm da planilha; descrição, responsável e tags são provisórios e precisam de revisão editorial.",
    },
    presentation: "default",
    embed: {
      provider: "iframe-externo",
      url: "https://bi-gestaoeducacional.osasco.sp.gov.br/ged-bi/#/publico/informacoes-escola",
    },
  },
  {
    schemaVersion: 3,
    id: "mapa-de-indicadores-da-fila-de-espera-educacao",
    title: "Mapa de Indicadores da Fila de Espera (Educação)",
    description: "Painel publicado pela Prefeitura de Osasco no tema Educação.",
    theme: "Educação",
    tags: ["educacao", "ged"],
    metadata: {
      source: "BI Gestão Educacional (GED) — Prefeitura de Osasco",
      owner: "Prefeitura de Osasco — Educação",
      methodologyNote:
        "Importado automaticamente da aba dash-panel de docs/catalogo_paineis_osasco.xlsx. Título, tema e URL de embed vêm da planilha; descrição, responsável e tags são provisórios e precisam de revisão editorial.",
    },
    presentation: "default",
    embed: {
      provider: "iframe-externo",
      url: "https://bi-gestaoeducacional.osasco.sp.gov.br/ged-bi/#/publico/dashboard-mapa-indicador-fila-espera",
    },
  },
  {
    schemaVersion: 3,
    id: "mapa-de-indicadores-de-oferta-de-vagas-educacao",
    title: "Mapa de Indicadores de Oferta de Vagas (Educação)",
    description: "Painel publicado pela Prefeitura de Osasco no tema Educação.",
    theme: "Educação",
    tags: ["educacao", "ged"],
    metadata: {
      source: "BI Gestão Educacional (GED) — Prefeitura de Osasco",
      owner: "Prefeitura de Osasco — Educação",
      methodologyNote:
        "Importado automaticamente da aba dash-panel de docs/catalogo_paineis_osasco.xlsx. Título, tema e URL de embed vêm da planilha; descrição, responsável e tags são provisórios e precisam de revisão editorial.",
    },
    presentation: "default",
    embed: {
      provider: "iframe-externo",
      url: "https://bi-gestaoeducacional.osasco.sp.gov.br/ged-bi/#/publico/dashboard-mapa-oferta-de-vagas-unidade",
    },
  },
  {
    schemaVersion: 3,
    id: "mapa-de-servicos-de-emergencia-educacao",
    title: "Mapa de Serviços de Emergência (Educação)",
    description: "Painel publicado pela Prefeitura de Osasco no tema Educação.",
    theme: "Educação",
    tags: ["educacao", "ged"],
    metadata: {
      source: "BI Gestão Educacional (GED) — Prefeitura de Osasco",
      owner: "Prefeitura de Osasco — Educação",
      methodologyNote:
        "Importado automaticamente da aba dash-panel de docs/catalogo_paineis_osasco.xlsx. Título, tema e URL de embed vêm da planilha; descrição, responsável e tags são provisórios e precisam de revisão editorial.",
    },
    presentation: "default",
    embed: {
      provider: "iframe-externo",
      url: "https://bi-gestaoeducacional.osasco.sp.gov.br/ged-bi/#/publico/dashboard-mapa-servicos",
    },
  },
  {
    schemaVersion: 3,
    id: "previsoes-ideb-2025",
    title: "Previsões IDEB 2025",
    description: "Painel publicado pela Prefeitura de Osasco no tema Educação.",
    theme: "Educação",
    tags: ["educacao", "ged"],
    metadata: {
      source: "BI Gestão Educacional (GED) — Prefeitura de Osasco",
      owner: "Prefeitura de Osasco — Educação",
      methodologyNote:
        "Importado automaticamente da aba dash-panel de docs/catalogo_paineis_osasco.xlsx. Título, tema e URL de embed vêm da planilha; descrição, responsável e tags são provisórios e precisam de revisão editorial.",
    },
    presentation: "default",
    embed: {
      provider: "iframe-externo",
      url: "https://bi-gestaoeducacional.osasco.sp.gov.br/ged-bi/#/publico/ideb-previsao",
    },
  },
  {
    schemaVersion: 3,
    id: "sondagens-de-desempenho-educacao",
    title: "Sondagens de Desempenho (Educação)",
    description: "Painel publicado pela Prefeitura de Osasco no tema Educação.",
    theme: "Educação",
    tags: ["educacao", "ged"],
    metadata: {
      source: "BI Gestão Educacional (GED) — Prefeitura de Osasco",
      owner: "Prefeitura de Osasco — Educação",
      methodologyNote:
        "Importado automaticamente da aba dash-panel de docs/catalogo_paineis_osasco.xlsx. Título, tema e URL de embed vêm da planilha; descrição, responsável e tags são provisórios e precisam de revisão editorial.",
    },
    presentation: "default",
    embed: {
      provider: "iframe-externo",
      url: "https://bi-gestaoeducacional.osasco.sp.gov.br/ged-bi/#/publico/dashboard-sondagens",
    },
  },
  {
    schemaVersion: 3,
    id: "turmas-sem-atribuicao",
    title: "Turmas sem Atribuição",
    description: "Painel publicado pela Prefeitura de Osasco no tema Educação.",
    theme: "Educação",
    tags: ["educacao", "ged"],
    metadata: {
      source: "BI Gestão Educacional (GED) — Prefeitura de Osasco",
      owner: "Prefeitura de Osasco — Educação",
      methodologyNote:
        "Importado automaticamente da aba dash-panel de docs/catalogo_paineis_osasco.xlsx. Título, tema e URL de embed vêm da planilha; descrição, responsável e tags são provisórios e precisam de revisão editorial.",
    },
    presentation: "default",
    embed: {
      provider: "iframe-externo",
      url: "https://bi-gestaoeducacional.osasco.sp.gov.br/ged-bi/#/publico/dashboard-atribuicao",
    },
  },
  {
    schemaVersion: 3,
    id: "arrecadacao-nota-fiscal-eletronica-por-grupo",
    title: "Arrecadação Nota Fiscal Eletrônica por Grupo",
    description: "Painel publicado pela Prefeitura de Osasco no tema Finanças.",
    theme: "Finanças",
    tags: ["financas", "power bi"],
    metadata: {
      source: "Power BI — Prefeitura de Osasco",
      owner: "Prefeitura de Osasco — Finanças",
      methodologyNote:
        "Importado automaticamente da aba dash-panel de docs/catalogo_paineis_osasco.xlsx. Título, tema e URL de embed vêm da planilha; descrição, responsável e tags são provisórios e precisam de revisão editorial.",
    },
    presentation: "default",
    embed: {
      provider: "powerbi-public",
      url: "https://app.powerbi.com/view?r=eyJrIjoiNzllY2Q1MDktNWUxOC00MTEwLTlmNWYtZDMwODM2ODQ0MzI4IiwidCI6ImE0NzUzNGU0LThlMDYtNDdhMi1hMDNmLTEwMDRjM2RiOWFmMyJ9",
    },
  },
  {
    schemaVersion: 3,
    id: "carteira-da-divida-ativa",
    title: "Carteira da Dívida Ativa",
    description: "Painel publicado pela Prefeitura de Osasco no tema Finanças.",
    theme: "Finanças",
    tags: ["financas", "bi osasco"],
    metadata: {
      source: "BI corporativo — Prefeitura de Osasco",
      owner: "Prefeitura de Osasco — Finanças",
      methodologyNote:
        "Importado automaticamente da aba dash-panel de docs/catalogo_paineis_osasco.xlsx. Título, tema e URL de embed vêm da planilha; descrição, responsável e tags são provisórios e precisam de revisão editorial.",
    },
    presentation: "default",
    embed: {
      provider: "iframe-externo",
      url: "https://bi.osasco.sp.gov.br/acessoSemlogin.xhtml?urlBI=/portal/osa/tributario/debitosDividaAtiva.jsf&biusu=visitante&bipass=visitante",
    },
  },
  {
    schemaVersion: 3,
    id: "comparativo-arrecadacao-com-o-valor-esperado",
    title: "Comparativo Arrecadação com o Valor Esperado",
    description: "Painel publicado pela Prefeitura de Osasco no tema Finanças.",
    theme: "Finanças",
    tags: ["financas", "power bi"],
    metadata: {
      source: "Power BI — Prefeitura de Osasco",
      owner: "Prefeitura de Osasco — Finanças",
      methodologyNote:
        "Importado automaticamente da aba dash-panel de docs/catalogo_paineis_osasco.xlsx. Título, tema e URL de embed vêm da planilha; descrição, responsável e tags são provisórios e precisam de revisão editorial.",
    },
    presentation: "default",
    embed: {
      provider: "powerbi-public",
      url: "https://app.powerbi.com/view?r=eyJrIjoiYWUyZDYzY2UtZDg2ZS00M2EwLWEzZGUtMTY1NzhhZGIxZWI0IiwidCI6ImE0NzUzNGU0LThlMDYtNDdhMi1hMDNmLTEwMDRjM2RiOWFmMyJ9",
    },
  },
  {
    schemaVersion: 3,
    id: "comparativo-da-receita",
    title: "Comparativo da Receita",
    description: "Painel publicado pela Prefeitura de Osasco no tema Finanças.",
    theme: "Finanças",
    tags: ["financas", "power bi"],
    metadata: {
      source: "Power BI — Prefeitura de Osasco",
      owner: "Prefeitura de Osasco — Finanças",
      methodologyNote:
        "Importado automaticamente da aba dash-panel de docs/catalogo_paineis_osasco.xlsx. Título, tema e URL de embed vêm da planilha; descrição, responsável e tags são provisórios e precisam de revisão editorial.",
    },
    presentation: "default",
    embed: {
      provider: "powerbi-public",
      url: "https://app.powerbi.com/view?r=eyJrIjoiNTcwZTFmYWUtZWMxNy00OWQ5LTgwODgtYjM1ZTRiYjYzNTM0IiwidCI6Ijg3N2YzMmQ2LTkxNTMtNDZjZC05NjRjLWZkMjA5YTU2M2E5NSJ9",
    },
  },
  {
    schemaVersion: 3,
    id: "emendas-parlamentares",
    title: "Emendas Parlamentares",
    description: "Painel publicado pela Prefeitura de Osasco no tema Finanças.",
    theme: "Finanças",
    tags: ["financas", "power bi"],
    metadata: {
      source: "Power BI — Prefeitura de Osasco",
      owner: "Prefeitura de Osasco — Finanças",
      methodologyNote:
        "Importado automaticamente da aba dash-panel de docs/catalogo_paineis_osasco.xlsx. Título, tema e URL de embed vêm da planilha; descrição, responsável e tags são provisórios e precisam de revisão editorial.",
    },
    presentation: "default",
    embed: {
      provider: "powerbi-public",
      url: "https://app.powerbi.com/view?r=eyJrIjoiOTIzNmIwNTgtMDdlMC00YjA3LWFmZDItNTEwY2U5MjZiZDQ5IiwidCI6IjkwZGQ1YjY0LWU3MTAtNGQzZi1iYmVjLTU5NDI3Y2NiNDVhOSJ9",
    },
  },
  {
    schemaVersion: 3,
    id: "valores-arrecadados-por-categoria-de-tributo",
    title: "Valores Arrecadados por Categoria de Tributo",
    description: "Painel publicado pela Prefeitura de Osasco no tema Finanças.",
    theme: "Finanças",
    tags: ["financas", "bi osasco"],
    metadata: {
      source: "BI corporativo — Prefeitura de Osasco",
      owner: "Prefeitura de Osasco — Finanças",
      methodologyNote:
        "Importado automaticamente da aba dash-panel de docs/catalogo_paineis_osasco.xlsx. Título, tema e URL de embed vêm da planilha; descrição, responsável e tags são provisórios e precisam de revisão editorial.",
    },
    presentation: "default",
    embed: {
      provider: "iframe-externo",
      url: "https://bi.osasco.sp.gov.br/acessoSemlogin.xhtml?urlBI=/portal/osa/tributario/arrecadacaoPorCatTrib.jsf&biusu=visitante&bipass=visitante&acumulado=true",
    },
  },
  {
    schemaVersion: 3,
    id: "vencimentos-de-contratos",
    title: "Vencimentos de Contratos",
    description: "Painel publicado pela Prefeitura de Osasco no tema Finanças.",
    theme: "Finanças",
    tags: ["financas", "power bi"],
    metadata: {
      source: "Power BI — Prefeitura de Osasco",
      owner: "Prefeitura de Osasco — Finanças",
      methodologyNote:
        "Importado automaticamente da aba dash-panel de docs/catalogo_paineis_osasco.xlsx. Título, tema e URL de embed vêm da planilha; descrição, responsável e tags são provisórios e precisam de revisão editorial.",
    },
    presentation: "default",
    embed: {
      provider: "powerbi-public",
      url: "https://app.powerbi.com/view?r=eyJrIjoiMDA4ZTUyMDYtYzdiZS00NzhhLTg1NWMtOWE1MzFlMjAzYmEwIiwidCI6Ijg3N2YzMmQ2LTkxNTMtNDZjZC05NjRjLWZkMjA5YTU2M2E5NSJ9",
    },
  },
  {
    schemaVersion: 3,
    id: "fundo-social-de-solidariedade-doacoes-por-mes",
    title: "Fundo Social de Solidariedade - Doações por Mês",
    description: "Painel publicado pela Prefeitura de Osasco no tema Fundo Social.",
    theme: "Fundo Social",
    tags: ["fundo social", "156"],
    metadata: {
      source: "Painel 156 — Prefeitura de Osasco",
      owner: "Prefeitura de Osasco — Fundo Social",
      methodologyNote:
        "Importado automaticamente da aba dash-panel de docs/catalogo_paineis_osasco.xlsx. Título, tema e URL de embed vêm da planilha; descrição, responsável e tags são provisórios e precisam de revisão editorial.",
    },
    presentation: "default",
    embed: {
      provider: "iframe-externo",
      url: "https://bi156painel.osasco.sp.gov.br/156/portal/osa/156/fundoSocial/fundoSocial.jsf",
    },
  },
  {
    schemaVersion: 3,
    id: "bolsa-aluguel-indicadores-gerais",
    title: "Bolsa Aluguel - Indicadores Gerais",
    description: "Painel publicado pela Prefeitura de Osasco no tema Habitação.",
    theme: "Habitação",
    tags: ["habitacao", "protocolo"],
    metadata: {
      source: "BI de Protocolo — Prefeitura de Osasco",
      owner: "Prefeitura de Osasco — Habitação",
      methodologyNote:
        "Importado automaticamente da aba dash-panel de docs/catalogo_paineis_osasco.xlsx. Título, tema e URL de embed vêm da planilha; descrição, responsável e tags são provisórios e precisam de revisão editorial.",
    },
    presentation: "default",
    embed: {
      provider: "iframe-externo",
      url: "https://protocolo.osasco.sp.gov.br/protocolo-bi/#/dashboards/indicadores-gerais-bolsa-aluguel/publico",
    },
  },
  {
    schemaVersion: 3,
    id: "processos-administrativos-movimentacoes-diarias-por-secretarias",
    title: "Processos Administrativos - Movimentações Diárias por Secretarias",
    description: "Painel publicado pela Prefeitura de Osasco no tema Processos Administrativos.",
    theme: "Processos Administrativos",
    tags: ["processos administrativos", "bi osasco"],
    metadata: {
      source: "BI corporativo — Prefeitura de Osasco",
      owner: "Prefeitura de Osasco — Processos Administrativos",
      methodologyNote:
        "Importado automaticamente da aba dash-panel de docs/catalogo_paineis_osasco.xlsx. Título, tema e URL de embed vêm da planilha; descrição, responsável e tags são provisórios e precisam de revisão editorial.",
    },
    presentation: "default",
    embed: {
      provider: "iframe-externo",
      url: "https://bi.osasco.sp.gov.br/acessoSemlogin.xhtml?urlBI=/portal/osa/tributario/protocolosProcAdm.jsf&biusu=visitante&bipass=visitante",
    },
  },
  {
    schemaVersion: 3,
    id: "horas-extras-analitico",
    title: "Horas Extras (Analítico)",
    description: "Painel publicado pela Prefeitura de Osasco no tema RH.",
    theme: "RH",
    tags: ["rh", "power bi"],
    metadata: {
      source: "Power BI — Prefeitura de Osasco",
      owner: "Prefeitura de Osasco — RH",
      methodologyNote:
        "Importado automaticamente da aba dash-panel de docs/catalogo_paineis_osasco.xlsx. Título, tema e URL de embed vêm da planilha; descrição, responsável e tags são provisórios e precisam de revisão editorial.",
    },
    presentation: "default",
    embed: {
      provider: "powerbi-public",
      url: "https://app.powerbi.com/view?r=eyJrIjoiOTYwMGZhMTYtYjJlNC00MWJhLWJiOGMtMmU4NGJhNWMyNTM5IiwidCI6Ijg3N2YzMmQ2LTkxNTMtNDZjZC05NjRjLWZkMjA5YTU2M2E5NSJ9",
    },
  },
  {
    schemaVersion: 3,
    id: "horas-extras-monitoramento",
    title: "Horas Extras (Monitoramento)",
    description: "Painel publicado pela Prefeitura de Osasco no tema RH.",
    theme: "RH",
    tags: ["rh", "power bi"],
    metadata: {
      source: "Power BI — Prefeitura de Osasco",
      owner: "Prefeitura de Osasco — RH",
      methodologyNote:
        "Importado automaticamente da aba dash-panel de docs/catalogo_paineis_osasco.xlsx. Título, tema e URL de embed vêm da planilha; descrição, responsável e tags são provisórios e precisam de revisão editorial.",
    },
    presentation: "default",
    embed: {
      provider: "powerbi-public",
      url: "https://app.powerbi.com/view?r=eyJrIjoiMTlmNWE3M2YtYWZmMS00MzYzLTljYTMtMTMyMDcxNmFmNjc1IiwidCI6Ijg3N2YzMmQ2LTkxNTMtNDZjZC05NjRjLWZkMjA5YTU2M2E5NSJ9",
    },
  },
  {
    schemaVersion: 3,
    id: "salarios-analitico",
    title: "Salários (Analítico)",
    description: "Painel publicado pela Prefeitura de Osasco no tema RH.",
    theme: "RH",
    tags: ["rh", "power bi"],
    metadata: {
      source: "Power BI — Prefeitura de Osasco",
      owner: "Prefeitura de Osasco — RH",
      methodologyNote:
        "Importado automaticamente da aba dash-panel de docs/catalogo_paineis_osasco.xlsx. Título, tema e URL de embed vêm da planilha; descrição, responsável e tags são provisórios e precisam de revisão editorial.",
    },
    presentation: "default",
    embed: {
      provider: "powerbi-public",
      url: "https://app.powerbi.com/view?r=eyJrIjoiZTg3MmI2MmItMjk3MC00OWUzLTk5MDItOGU5ZmJiMDNiY2U1IiwidCI6Ijg3N2YzMmQ2LTkxNTMtNDZjZC05NjRjLWZkMjA5YTU2M2E5NSJ9",
    },
  },
  {
    schemaVersion: 3,
    id: "salarios-monitoramento",
    title: "Salários (Monitoramento)",
    description: "Painel publicado pela Prefeitura de Osasco no tema RH.",
    theme: "RH",
    tags: ["rh", "power bi"],
    metadata: {
      source: "Power BI — Prefeitura de Osasco",
      owner: "Prefeitura de Osasco — RH",
      methodologyNote:
        "Importado automaticamente da aba dash-panel de docs/catalogo_paineis_osasco.xlsx. Título, tema e URL de embed vêm da planilha; descrição, responsável e tags são provisórios e precisam de revisão editorial.",
    },
    presentation: "default",
    embed: {
      provider: "powerbi-public",
      url: "https://app.powerbi.com/view?r=eyJrIjoiYWI2OGE2YjgtMzZlYS00NzM0LWJlYjgtZjE3MGFlMTk3ZTczIiwidCI6Ijg3N2YzMmQ2LTkxNTMtNDZjZC05NjRjLWZkMjA5YTU2M2E5NSJ9",
    },
  },
  {
    schemaVersion: 3,
    id: "atencao-especializada",
    title: "Atenção Especializada",
    description: "Painel publicado pela Prefeitura de Osasco no tema Saúde.",
    theme: "Saúde",
    tags: ["saude", "power bi"],
    metadata: {
      source: "Power BI — Prefeitura de Osasco",
      owner: "Prefeitura de Osasco — Saúde",
      methodologyNote:
        "Importado automaticamente da aba dash-panel de docs/catalogo_paineis_osasco.xlsx. Título, tema e URL de embed vêm da planilha; descrição, responsável e tags são provisórios e precisam de revisão editorial.",
    },
    presentation: "default",
    embed: {
      provider: "powerbi-secure",
      url: "https://app.powerbi.com/reportEmbed?reportId=890192db-0168-4bfb-9287-3a51213f3e00&autoAuth=true&ctid=04e74123-4ede-4a84-89ef-b7c6dfe29df8&pagename=87d6813fc6d65a1672ff",
    },
  },
  {
    schemaVersion: 3,
    id: "atendimentos-agendados-x-demanda-espontanea",
    title: "Atendimentos Agendados x Demanda Espontânea",
    description: "Painel publicado pela Prefeitura de Osasco no tema Saúde.",
    theme: "Saúde",
    tags: ["saude", "power bi"],
    metadata: {
      source: "Power BI — Prefeitura de Osasco",
      owner: "Prefeitura de Osasco — Saúde",
      methodologyNote:
        "Importado automaticamente da aba dash-panel de docs/catalogo_paineis_osasco.xlsx. Título, tema e URL de embed vêm da planilha; descrição, responsável e tags são provisórios e precisam de revisão editorial.",
    },
    presentation: "default",
    embed: {
      provider: "powerbi-public",
      url: "https://app.powerbi.com/view?r=eyJrIjoiOWViNjg5ZjAtYjY3NS00M2JjLTk4MjctMWUyZWM1ZGIyMmM4IiwidCI6IjA0ZTc0MTIzLTRlZGUtNGE4NC04OWVmLWI3YzZkZmUyOWRmOCJ9",
    },
  },
  {
    schemaVersion: 3,
    id: "atendimentos-por-mes-atencao-basica",
    title: "Atendimentos por Mês - Atenção Básica",
    description: "Painel publicado pela Prefeitura de Osasco no tema Saúde.",
    theme: "Saúde",
    tags: ["saude", "power bi"],
    metadata: {
      source: "Power BI — Prefeitura de Osasco",
      owner: "Prefeitura de Osasco — Saúde",
      methodologyNote:
        "Importado automaticamente da aba dash-panel de docs/catalogo_paineis_osasco.xlsx. Título, tema e URL de embed vêm da planilha; descrição, responsável e tags são provisórios e precisam de revisão editorial.",
    },
    presentation: "default",
    embed: {
      provider: "powerbi-secure",
      url: "https://app.powerbi.com/reportEmbed?reportId=890192db-0168-4bfb-9287-3a51213f3e00&autoAuth=true&ctid=04e74123-4ede-4a84-89ef-b7c6dfe29df8&pageName=4150acbf74f07a87b376",
    },
  },
  {
    schemaVersion: 3,
    id: "atendimentos-por-mes-urgencia-e-emergencia",
    title: "Atendimentos por Mês - Urgência e Emergência",
    description: "Painel publicado pela Prefeitura de Osasco no tema Saúde.",
    theme: "Saúde",
    tags: ["saude", "power bi"],
    metadata: {
      source: "Power BI — Prefeitura de Osasco",
      owner: "Prefeitura de Osasco — Saúde",
      methodologyNote:
        "Importado automaticamente da aba dash-panel de docs/catalogo_paineis_osasco.xlsx. Título, tema e URL de embed vêm da planilha; descrição, responsável e tags são provisórios e precisam de revisão editorial.",
    },
    presentation: "default",
    embed: {
      provider: "powerbi-secure",
      url: "https://app.powerbi.com/reportEmbed?reportId=1bd4d248-fae9-4fc6-b245-748b1a2cf4b2&autoAuth=true&ctid=04e74123-4ede-4a84-89ef-b7c6dfe29df8&pageName=cab5f1193d325d040931",
    },
  },
  {
    schemaVersion: 3,
    id: "hospital-da-crianca-e-da-mulher-dr-celso-antonio-giglio-tempos-de-espera-tempo-real",
    title:
      "Hospital da Criança e da Mulher Dr. Celso Antônio Giglio - Tempos de Espera (Tempo Real)",
    description: "Painel publicado pela Prefeitura de Osasco no tema Saúde.",
    theme: "Saúde",
    tags: ["saude", "power bi"],
    metadata: {
      source: "Power BI — Prefeitura de Osasco",
      owner: "Prefeitura de Osasco — Saúde",
      methodologyNote:
        "Importado automaticamente da aba dash-panel de docs/catalogo_paineis_osasco.xlsx. Título, tema e URL de embed vêm da planilha; descrição, responsável e tags são provisórios e precisam de revisão editorial.",
    },
    presentation: "default",
    embed: {
      provider: "powerbi-secure",
      url: "https://app.powerbi.com/reportEmbed?reportId=beb2b6ea-f288-4bfe-a62d-8372a9b8d43d&autoAuth=true&ctid=04e74123-4ede-4a84-89ef-b7c6dfe29df8&pageName=c1f71836ec0bb5054e92",
    },
  },
  {
    schemaVersion: 3,
    id: "monitoramento-de-agendas",
    title: "Monitoramento de Agendas",
    description: "Painel publicado pela Prefeitura de Osasco no tema Saúde.",
    theme: "Saúde",
    tags: ["saude", "power bi"],
    metadata: {
      source: "Power BI — Prefeitura de Osasco",
      owner: "Prefeitura de Osasco — Saúde",
      methodologyNote:
        "Importado automaticamente da aba dash-panel de docs/catalogo_paineis_osasco.xlsx. Título, tema e URL de embed vêm da planilha; descrição, responsável e tags são provisórios e precisam de revisão editorial.",
    },
    presentation: "default",
    embed: {
      provider: "powerbi-public",
      url: "https://app.powerbi.com/view?r=eyJrIjoiZTI0ZjVmNjMtNzExMy00MzViLWFmZjItOWI1ZGI2MDdkMzNkIiwidCI6IjA0ZTc0MTIzLTRlZGUtNGE4NC04OWVmLWI3YzZkZmUyOWRmOCJ9",
    },
  },
  {
    schemaVersion: 3,
    id: "monitoramento-de-avaliacao-de-atendimentos-das-unidades-de-saude-whatsapp",
    title: "Monitoramento de Avaliação de Atendimentos das Unidades de Saúde (Whatsapp)",
    description: "Painel publicado pela Prefeitura de Osasco no tema Saúde.",
    theme: "Saúde",
    tags: ["saude", "power bi"],
    metadata: {
      source: "Power BI — Prefeitura de Osasco",
      owner: "Prefeitura de Osasco — Saúde",
      methodologyNote:
        "Importado automaticamente da aba dash-panel de docs/catalogo_paineis_osasco.xlsx. Título, tema e URL de embed vêm da planilha; descrição, responsável e tags são provisórios e precisam de revisão editorial.",
    },
    presentation: "default",
    embed: {
      provider: "powerbi-secure",
      url: "https://app.powerbi.com/reportEmbed?reportId=f85fa1b8-3864-4fbf-af2e-65bede1dd87c&autoAuth=true&ctid=04e74123-4ede-4a84-89ef-b7c6dfe29df8",
    },
  },
  {
    schemaVersion: 3,
    id: "monitoramento-de-dispensacao",
    title: "Monitoramento de Dispensação",
    description: "Painel publicado pela Prefeitura de Osasco no tema Saúde.",
    theme: "Saúde",
    tags: ["saude", "power bi"],
    metadata: {
      source: "Power BI — Prefeitura de Osasco",
      owner: "Prefeitura de Osasco — Saúde",
      methodologyNote:
        "Importado automaticamente da aba dash-panel de docs/catalogo_paineis_osasco.xlsx. Título, tema e URL de embed vêm da planilha; descrição, responsável e tags são provisórios e precisam de revisão editorial.",
    },
    presentation: "default",
    embed: {
      provider: "powerbi-public",
      url: "https://app.powerbi.com/view?r=eyJrIjoiN2FhMmFjMzUtNGFjMy00MDdmLWFjNTktYTYxZTU0M2Y0MDhkIiwidCI6IjA0ZTc0MTIzLTRlZGUtNGE4NC04OWVmLWI3YzZkZmUyOWRmOCJ9",
    },
  },
  {
    schemaVersion: 3,
    id: "pa-munhoz-junior-tempos-de-espera-tempo-real",
    title: "PA Munhoz Júnior - Tempos de Espera (Tempo Real)",
    description: "Painel publicado pela Prefeitura de Osasco no tema Saúde.",
    theme: "Saúde",
    tags: ["saude", "power bi"],
    metadata: {
      source: "Power BI — Prefeitura de Osasco",
      owner: "Prefeitura de Osasco — Saúde",
      methodologyNote:
        "Importado automaticamente da aba dash-panel de docs/catalogo_paineis_osasco.xlsx. Título, tema e URL de embed vêm da planilha; descrição, responsável e tags são provisórios e precisam de revisão editorial.",
    },
    presentation: "default",
    embed: {
      provider: "powerbi-secure",
      url: "https://app.powerbi.com/reportEmbed?reportId=beb2b6ea-f288-4bfe-a62d-8372a9b8d43d&autoAuth=true&ctid=04e74123-4ede-4a84-89ef-b7c6dfe29df8&pageName=1c16b827b760007a7076",
    },
  },
  {
    schemaVersion: 3,
    id: "pa-novo-osasco-tempos-de-espera-tempo-real",
    title: "PA Novo Osasco - Tempos de Espera (Tempo Real)",
    description: "Painel publicado pela Prefeitura de Osasco no tema Saúde.",
    theme: "Saúde",
    tags: ["saude", "power bi"],
    metadata: {
      source: "Power BI — Prefeitura de Osasco",
      owner: "Prefeitura de Osasco — Saúde",
      methodologyNote:
        "Importado automaticamente da aba dash-panel de docs/catalogo_paineis_osasco.xlsx. Título, tema e URL de embed vêm da planilha; descrição, responsável e tags são provisórios e precisam de revisão editorial.",
    },
    presentation: "default",
    embed: {
      provider: "powerbi-secure",
      url: "https://app.powerbi.com/reportEmbed?reportId=beb2b6ea-f288-4bfe-a62d-8372a9b8d43d&autoAuth=true&ctid=04e74123-4ede-4a84-89ef-b7c6dfe29df8&pageName=caca15b46c72141e6795",
    },
  },
  {
    schemaVersion: 3,
    id: "painel-gestao-fila-de-espera-especialidades-e-exames",
    title: "Painel Gestão Fila de Espera (Especialidades e Exames)",
    description: "Painel publicado pela Prefeitura de Osasco no tema Saúde.",
    theme: "Saúde",
    tags: ["saude", "power bi"],
    metadata: {
      source: "Power BI — Prefeitura de Osasco",
      owner: "Prefeitura de Osasco — Saúde",
      methodologyNote:
        "Importado automaticamente da aba dash-panel de docs/catalogo_paineis_osasco.xlsx. Título, tema e URL de embed vêm da planilha; descrição, responsável e tags são provisórios e precisam de revisão editorial.",
    },
    presentation: "default",
    embed: {
      provider: "powerbi-public",
      url: "https://app.powerbi.com/view?r=eyJrIjoiOThjMjUzNTYtYjZiOC00YjBlLTgyMTUtMjZmM2Q5ODQ1NzgzIiwidCI6IjA0ZTc0MTIzLTRlZGUtNGE4NC04OWVmLWI3YzZkZmUyOWRmOCJ9",
    },
  },
  {
    schemaVersion: 3,
    id: "ps-amador-aguiar-tempos-de-espera-tempo-real",
    title: "PS Amador Aguiar - Tempos de Espera (Tempo Real)",
    description: "Painel publicado pela Prefeitura de Osasco no tema Saúde.",
    theme: "Saúde",
    tags: ["saude", "power bi"],
    metadata: {
      source: "Power BI — Prefeitura de Osasco",
      owner: "Prefeitura de Osasco — Saúde",
      methodologyNote:
        "Importado automaticamente da aba dash-panel de docs/catalogo_paineis_osasco.xlsx. Título, tema e URL de embed vêm da planilha; descrição, responsável e tags são provisórios e precisam de revisão editorial.",
    },
    presentation: "default",
    embed: {
      provider: "powerbi-secure",
      url: "https://app.powerbi.com/reportEmbed?reportId=beb2b6ea-f288-4bfe-a62d-8372a9b8d43d&autoAuth=true&ctid=04e74123-4ede-4a84-89ef-b7c6dfe29df8&pageName=c8e6f7b49b770bb3c1c7",
    },
  },
  {
    schemaVersion: 3,
    id: "ps-antonio-flavio-franca-rochdale-tempos-de-espera-tempo-real",
    title: "PS Antônio Flávio França (Rochdale) - Tempos de Espera (Tempo Real)",
    description: "Painel publicado pela Prefeitura de Osasco no tema Saúde.",
    theme: "Saúde",
    tags: ["saude", "power bi"],
    metadata: {
      source: "Power BI — Prefeitura de Osasco",
      owner: "Prefeitura de Osasco — Saúde",
      methodologyNote:
        "Importado automaticamente da aba dash-panel de docs/catalogo_paineis_osasco.xlsx. Título, tema e URL de embed vêm da planilha; descrição, responsável e tags são provisórios e precisam de revisão editorial.",
    },
    presentation: "default",
    embed: {
      provider: "powerbi-secure",
      url: "https://app.powerbi.com/reportEmbed?reportId=beb2b6ea-f288-4bfe-a62d-8372a9b8d43d&autoAuth=true&ctid=04e74123-4ede-4a84-89ef-b7c6dfe29df8&pageName=ReportSection491001430d744d538e3d",
    },
  },
  {
    schemaVersion: 3,
    id: "ps-antonio-giglio-pediatria-tempos-de-espera-tempo-real",
    title: "PS Antônio Giglio - Pediatria - Tempos de Espera (Tempo Real)",
    description: "Painel publicado pela Prefeitura de Osasco no tema Saúde.",
    theme: "Saúde",
    tags: ["saude", "power bi"],
    metadata: {
      source: "Power BI — Prefeitura de Osasco",
      owner: "Prefeitura de Osasco — Saúde",
      methodologyNote:
        "Importado automaticamente da aba dash-panel de docs/catalogo_paineis_osasco.xlsx. Título, tema e URL de embed vêm da planilha; descrição, responsável e tags são provisórios e precisam de revisão editorial.",
    },
    presentation: "default",
    embed: {
      provider: "powerbi-secure",
      url: "https://app.powerbi.com/reportEmbed?reportId=beb2b6ea-f288-4bfe-a62d-8372a9b8d43d&autoAuth=true&ctid=04e74123-4ede-4a84-89ef-b7c6dfe29df8&pageName=00784741d015ad4947b0",
    },
  },
  {
    schemaVersion: 3,
    id: "ps-antonio-giglio-tempos-de-espera-tempo-real",
    title: "PS Antônio Giglio - Tempos de Espera (Tempo Real)",
    description: "Painel publicado pela Prefeitura de Osasco no tema Saúde.",
    theme: "Saúde",
    tags: ["saude", "power bi"],
    metadata: {
      source: "Power BI — Prefeitura de Osasco",
      owner: "Prefeitura de Osasco — Saúde",
      methodologyNote:
        "Importado automaticamente da aba dash-panel de docs/catalogo_paineis_osasco.xlsx. Título, tema e URL de embed vêm da planilha; descrição, responsável e tags são provisórios e precisam de revisão editorial.",
    },
    presentation: "default",
    embed: {
      provider: "powerbi-secure",
      url: "https://app.powerbi.com/reportEmbed?reportId=beb2b6ea-f288-4bfe-a62d-8372a9b8d43d&autoAuth=true&ctid=04e74123-4ede-4a84-89ef-b7c6dfe29df8&pageName=ed1a29f6e291216e5075",
    },
  },
  {
    schemaVersion: 3,
    id: "ps-dr-conrado-cesarino-nuvolini-santo-antonio-tempos-de-espera-tempo-real",
    title: "PS Dr. Conrado Cesarino Nuvolini (Santo Antônio) - Tempos de Espera (Tempo Real)",
    description: "Painel publicado pela Prefeitura de Osasco no tema Saúde.",
    theme: "Saúde",
    tags: ["saude", "power bi"],
    metadata: {
      source: "Power BI — Prefeitura de Osasco",
      owner: "Prefeitura de Osasco — Saúde",
      methodologyNote:
        "Importado automaticamente da aba dash-panel de docs/catalogo_paineis_osasco.xlsx. Título, tema e URL de embed vêm da planilha; descrição, responsável e tags são provisórios e precisam de revisão editorial.",
    },
    presentation: "default",
    embed: {
      provider: "powerbi-secure",
      url: "https://app.powerbi.com/reportEmbed?reportId=beb2b6ea-f288-4bfe-a62d-8372a9b8d43d&autoAuth=true&ctid=04e74123-4ede-4a84-89ef-b7c6dfe29df8&pageName=651f8295c49658636e70",
    },
  },
  {
    schemaVersion: 3,
    id: "ps-dr-osmar-mesquita-helena-maria-tempos-de-espera-tempo-real",
    title: "PS Dr. Osmar Mesquita (Helena Maria) - Tempos de Espera (Tempo Real)",
    description: "Painel publicado pela Prefeitura de Osasco no tema Saúde.",
    theme: "Saúde",
    tags: ["saude", "power bi"],
    metadata: {
      source: "Power BI — Prefeitura de Osasco",
      owner: "Prefeitura de Osasco — Saúde",
      methodologyNote:
        "Importado automaticamente da aba dash-panel de docs/catalogo_paineis_osasco.xlsx. Título, tema e URL de embed vêm da planilha; descrição, responsável e tags são provisórios e precisam de revisão editorial.",
    },
    presentation: "default",
    embed: {
      provider: "powerbi-secure",
      url: "https://app.powerbi.com/reportEmbed?reportId=beb2b6ea-f288-4bfe-a62d-8372a9b8d43d&autoAuth=true&ctid=04e74123-4ede-4a84-89ef-b7c6dfe29df8&pageName=8c107d60e6dca5794bd3",
    },
  },
  {
    schemaVersion: 3,
    id: "ps-fenelon-guedes-pereira-ayrosa-tempos-de-espera-tempo-real",
    title: "PS Fenelon Guedes Pereira (Ayrosa) - Tempos de Espera (Tempo Real)",
    description: "Painel publicado pela Prefeitura de Osasco no tema Saúde.",
    theme: "Saúde",
    tags: ["saude", "power bi"],
    metadata: {
      source: "Power BI — Prefeitura de Osasco",
      owner: "Prefeitura de Osasco — Saúde",
      methodologyNote:
        "Importado automaticamente da aba dash-panel de docs/catalogo_paineis_osasco.xlsx. Título, tema e URL de embed vêm da planilha; descrição, responsável e tags são provisórios e precisam de revisão editorial.",
    },
    presentation: "default",
    embed: {
      provider: "powerbi-secure",
      url: "https://app.powerbi.com/reportEmbed?reportId=beb2b6ea-f288-4bfe-a62d-8372a9b8d43d&autoAuth=true&ctid=04e74123-4ede-4a84-89ef-b7c6dfe29df8&pageName=ReportSectionc21307c122c846617209",
    },
  },
  {
    schemaVersion: 3,
    id: "ps-jose-ibrahim-jd-d-abril-tempos-de-espera-tempo-real",
    title: "PS José Ibrahim (Jd. D'Abril) - Tempos de Espera (Tempo Real)",
    description: "Painel publicado pela Prefeitura de Osasco no tema Saúde.",
    theme: "Saúde",
    tags: ["saude", "power bi"],
    metadata: {
      source: "Power BI — Prefeitura de Osasco",
      owner: "Prefeitura de Osasco — Saúde",
      methodologyNote:
        "Importado automaticamente da aba dash-panel de docs/catalogo_paineis_osasco.xlsx. Título, tema e URL de embed vêm da planilha; descrição, responsável e tags são provisórios e precisam de revisão editorial.",
    },
    presentation: "default",
    embed: {
      provider: "powerbi-secure",
      url: "https://app.powerbi.com/reportEmbed?reportId=beb2b6ea-f288-4bfe-a62d-8372a9b8d43d&autoAuth=true&ctid=04e74123-4ede-4a84-89ef-b7c6dfe29df8&pageName=ReportSectionf7decdb028520471cbb4",
    },
  },
  {
    schemaVersion: 3,
    id: "tempo-medio-de-espera-urgencia-e-emergencia",
    title: "Tempo Médio de Espera - Urgência e Emergência",
    description: "Painel publicado pela Prefeitura de Osasco no tema Saúde.",
    theme: "Saúde",
    tags: ["saude", "power bi"],
    metadata: {
      source: "Power BI — Prefeitura de Osasco",
      owner: "Prefeitura de Osasco — Saúde",
      methodologyNote:
        "Importado automaticamente da aba dash-panel de docs/catalogo_paineis_osasco.xlsx. Título, tema e URL de embed vêm da planilha; descrição, responsável e tags são provisórios e precisam de revisão editorial.",
    },
    presentation: "default",
    embed: {
      provider: "powerbi-secure",
      url: "https://app.powerbi.com/reportEmbed?reportId=1bd4d248-fae9-4fc6-b245-748b1a2cf4b2&autoAuth=true&ctid=04e74123-4ede-4a84-89ef-b7c6dfe29df8&pageName=ce14a83fea3a20c10c0",
    },
  },
  {
    schemaVersion: 3,
    id: "tempo-medio-de-espera-por-unidade-urgencia-e-emergencia",
    title: "Tempo Médio de Espera por Unidade - Urgência e Emergência",
    description: "Painel publicado pela Prefeitura de Osasco no tema Saúde.",
    theme: "Saúde",
    tags: ["saude", "power bi"],
    metadata: {
      source: "Power BI — Prefeitura de Osasco",
      owner: "Prefeitura de Osasco — Saúde",
      methodologyNote:
        "Importado automaticamente da aba dash-panel de docs/catalogo_paineis_osasco.xlsx. Título, tema e URL de embed vêm da planilha; descrição, responsável e tags são provisórios e precisam de revisão editorial.",
    },
    presentation: "default",
    embed: {
      provider: "powerbi-secure",
      url: "https://app.powerbi.com/reportEmbed?reportId=1bd4d248-fae9-4fc6-b245-748b1a2cf4b2&autoAuth=true&ctid=04e74123-4ede-4a84-89ef-b7c6dfe29df8&pageName=4150acbf74f07a87b376",
    },
  },
  {
    schemaVersion: 3,
    id: "tempos-de-espera-tempo-real-geral",
    title: "Tempos de Espera (Tempo Real) - Geral",
    description: "Painel publicado pela Prefeitura de Osasco no tema Saúde.",
    theme: "Saúde",
    tags: ["saude", "power bi"],
    metadata: {
      source: "Power BI — Prefeitura de Osasco",
      owner: "Prefeitura de Osasco — Saúde",
      methodologyNote:
        "Importado automaticamente da aba dash-panel de docs/catalogo_paineis_osasco.xlsx. Título, tema e URL de embed vêm da planilha; descrição, responsável e tags são provisórios e precisam de revisão editorial.",
    },
    presentation: "default",
    embed: {
      provider: "powerbi-secure",
      url: "https://app.powerbi.com/reportEmbed?reportId=beb2b6ea-f288-4bfe-a62d-8372a9b8d43d&groupId=9bc03278-fa6d-41b9-a6f8-3bed73f6113b&autoAuth=true&ctid=04e74123-4ede-4a84-89ef-b7c6dfe29df8&pageName=eabfca434161476d4439",
    },
  },
  {
    schemaVersion: 3,
    id: "upa-jose-campos-barreto-vila-menck-tempos-de-espera-tempo-real",
    title: "UPA José Campos Barreto (Vila Menck) - Tempos de Espera (Tempo Real)",
    description: "Painel publicado pela Prefeitura de Osasco no tema Saúde.",
    theme: "Saúde",
    tags: ["saude", "power bi"],
    metadata: {
      source: "Power BI — Prefeitura de Osasco",
      owner: "Prefeitura de Osasco — Saúde",
      methodologyNote:
        "Importado automaticamente da aba dash-panel de docs/catalogo_paineis_osasco.xlsx. Título, tema e URL de embed vêm da planilha; descrição, responsável e tags são provisórios e precisam de revisão editorial.",
    },
    presentation: "default",
    embed: {
      provider: "powerbi-secure",
      url: "https://app.powerbi.com/reportEmbed?reportId=beb2b6ea-f288-4bfe-a62d-8372a9b8d43d&autoAuth=true&ctid=04e74123-4ede-4a84-89ef-b7c6dfe29df8&pageName=030dcf7c94953e278721",
    },
  },
  {
    schemaVersion: 3,
    id: "upa-jose-santos-sasso-jd-conceicao-tempos-de-espera-tempo-real",
    title: "UPA José Santos Sasso (Jd. Conceição) - Tempos de Espera (Tempo Real)",
    description: "Painel publicado pela Prefeitura de Osasco no tema Saúde.",
    theme: "Saúde",
    tags: ["saude", "power bi"],
    metadata: {
      source: "Power BI — Prefeitura de Osasco",
      owner: "Prefeitura de Osasco — Saúde",
      methodologyNote:
        "Importado automaticamente da aba dash-panel de docs/catalogo_paineis_osasco.xlsx. Título, tema e URL de embed vêm da planilha; descrição, responsável e tags são provisórios e precisam de revisão editorial.",
    },
    presentation: "default",
    embed: {
      provider: "powerbi-secure",
      url: "https://app.powerbi.com/reportEmbed?reportId=beb2b6ea-f288-4bfe-a62d-8372a9b8d43d&autoAuth=true&ctid=04e74123-4ede-4a84-89ef-b7c6dfe29df8&pageName=d8373a6a0a203473a860",
    },
  },
  {
    schemaVersion: 3,
    id: "upa-vicente-missiano-centro-tempos-de-espera-tempo-real",
    title: "UPA Vicente Missiano (Centro) - Tempos de Espera (Tempo Real)",
    description: "Painel publicado pela Prefeitura de Osasco no tema Saúde.",
    theme: "Saúde",
    tags: ["saude", "power bi"],
    metadata: {
      source: "Power BI — Prefeitura de Osasco",
      owner: "Prefeitura de Osasco — Saúde",
      methodologyNote:
        "Importado automaticamente da aba dash-panel de docs/catalogo_paineis_osasco.xlsx. Título, tema e URL de embed vêm da planilha; descrição, responsável e tags são provisórios e precisam de revisão editorial.",
    },
    presentation: "default",
    embed: {
      provider: "powerbi-secure",
      url: "https://app.powerbi.com/reportEmbed?reportId=beb2b6ea-f288-4bfe-a62d-8372a9b8d43d&autoAuth=true&ctid=04e74123-4ede-4a84-89ef-b7c6dfe29df8&pageName=eda041e004624a490ec6",
    },
  },
  {
    schemaVersion: 3,
    id: "acidentes-nao-fatais-por-ano-e-por-municipio",
    title: "Acidentes Não Fatais - Por Ano e por Município",
    description: "Painel publicado pela Prefeitura de Osasco no tema Segurança no Trânsito.",
    theme: "Segurança no Trânsito",
    tags: ["seguranca no transito", "power bi"],
    metadata: {
      source: "Power BI — Prefeitura de Osasco",
      owner: "Prefeitura de Osasco — Segurança no Trânsito",
      methodologyNote:
        "Importado automaticamente da aba dash-panel de docs/catalogo_paineis_osasco.xlsx. Título, tema e URL de embed vêm da planilha; descrição, responsável e tags são provisórios e precisam de revisão editorial.",
    },
    presentation: "default",
    embed: {
      provider: "powerbi-public",
      url: "https://app.powerbi.com/view?r=eyJrIjoiNGY0NTFjNzAtZWUzZi00ZWZmLTg4ZDYtNDQwMDJjZTI2MDlmIiwidCI6IjkwZGQ1YjY0LWU3MTAtNGQzZi1iYmVjLTU5NDI3Y2NiNDVhOSJ9",
    },
  },
  {
    schemaVersion: 3,
    id: "acidentes-nao-fatais-por-mes-e-por-tipo",
    title: "Acidentes Não Fatais - Por Mês e por Tipo",
    description: "Painel publicado pela Prefeitura de Osasco no tema Segurança no Trânsito.",
    theme: "Segurança no Trânsito",
    tags: ["seguranca no transito", "power bi"],
    metadata: {
      source: "Power BI — Prefeitura de Osasco",
      owner: "Prefeitura de Osasco — Segurança no Trânsito",
      methodologyNote:
        "Importado automaticamente da aba dash-panel de docs/catalogo_paineis_osasco.xlsx. Título, tema e URL de embed vêm da planilha; descrição, responsável e tags são provisórios e precisam de revisão editorial.",
    },
    presentation: "default",
    embed: {
      provider: "powerbi-public",
      url: "https://app.powerbi.com/view?r=eyJrIjoiNmZlMGY2MDYtMGJjOS00NmUyLTg0ZTktODBhY2E3MGE1ZmQyIiwidCI6IjkwZGQ1YjY0LWU3MTAtNGQzZi1iYmVjLTU5NDI3Y2NiNDVhOSJ9",
    },
  },
  {
    schemaVersion: 3,
    id: "mapa-acidentes-fatais-em-osasco-por-ano",
    title: "Mapa Acidentes Fatais em Osasco por Ano",
    description: "Painel publicado pela Prefeitura de Osasco no tema Segurança no Trânsito.",
    theme: "Segurança no Trânsito",
    tags: ["seguranca no transito", "power bi"],
    metadata: {
      source: "Power BI — Prefeitura de Osasco",
      owner: "Prefeitura de Osasco — Segurança no Trânsito",
      methodologyNote:
        "Importado automaticamente da aba dash-panel de docs/catalogo_paineis_osasco.xlsx. Título, tema e URL de embed vêm da planilha; descrição, responsável e tags são provisórios e precisam de revisão editorial.",
    },
    presentation: "default",
    embed: {
      provider: "powerbi-public",
      url: "https://app.powerbi.com/view?r=eyJrIjoiYjBmMzcyMDAtNjMyMy00Yzg5LWE1ZTgtM2JjZDU3NjhjNWYyIiwidCI6IjkwZGQ1YjY0LWU3MTAtNGQzZi1iYmVjLTU5NDI3Y2NiNDVhOSJ9",
    },
  },
  {
    schemaVersion: 3,
    id: "obitos-transito",
    title: "Óbitos - Trânsito",
    description: "Painel publicado pela Prefeitura de Osasco no tema Segurança no Trânsito.",
    theme: "Segurança no Trânsito",
    tags: ["seguranca no transito", "power bi"],
    metadata: {
      source: "Power BI — Prefeitura de Osasco",
      owner: "Prefeitura de Osasco — Segurança no Trânsito",
      methodologyNote:
        "Importado automaticamente da aba dash-panel de docs/catalogo_paineis_osasco.xlsx. Título, tema e URL de embed vêm da planilha; descrição, responsável e tags são provisórios e precisam de revisão editorial.",
    },
    presentation: "default",
    embed: {
      provider: "powerbi-public",
      url: "https://app.powerbi.com/view?r=eyJrIjoiMjhlMGIwZWItOGMzMC00ZmE4LTlkMjEtMWM1MjdjNGE2ZmYzIiwidCI6IjkwZGQ1YjY0LWU3MTAtNGQzZi1iYmVjLTU5NDI3Y2NiNDVhOSJ9",
    },
  },
  {
    schemaVersion: 3,
    id: "perfil-das-vitimas-transito",
    title: "Perfil das Vítimas (Trânsito)",
    description: "Painel publicado pela Prefeitura de Osasco no tema Segurança no Trânsito.",
    theme: "Segurança no Trânsito",
    tags: ["seguranca no transito", "power bi"],
    metadata: {
      source: "Power BI — Prefeitura de Osasco",
      owner: "Prefeitura de Osasco — Segurança no Trânsito",
      methodologyNote:
        "Importado automaticamente da aba dash-panel de docs/catalogo_paineis_osasco.xlsx. Título, tema e URL de embed vêm da planilha; descrição, responsável e tags são provisórios e precisam de revisão editorial.",
    },
    presentation: "default",
    embed: {
      provider: "powerbi-public",
      url: "https://app.powerbi.com/view?r=eyJrIjoiOGQzNzE5ZTAtZWI4Ny00N2NkLWE2MTUtZDZkNzVhYzIxODZkIiwidCI6IjkwZGQ1YjY0LWU3MTAtNGQzZi1iYmVjLTU5NDI3Y2NiNDVhOSJ9",
    },
  },
  {
    schemaVersion: 3,
    id: "taxa-de-mortalidade-por-ano-e-por-municipio-transito",
    title: "Taxa de Mortalidade por Ano e por Município (Trânsito)",
    description: "Painel publicado pela Prefeitura de Osasco no tema Segurança no Trânsito.",
    theme: "Segurança no Trânsito",
    tags: ["seguranca no transito", "power bi"],
    metadata: {
      source: "Power BI — Prefeitura de Osasco",
      owner: "Prefeitura de Osasco — Segurança no Trânsito",
      methodologyNote:
        "Importado automaticamente da aba dash-panel de docs/catalogo_paineis_osasco.xlsx. Título, tema e URL de embed vêm da planilha; descrição, responsável e tags são provisórios e precisam de revisão editorial.",
    },
    presentation: "default",
    embed: {
      provider: "powerbi-public",
      url: "https://app.powerbi.com/view?r=eyJrIjoiZTFjMzc4ZDQtZjM0Ny00YjMyLWE1ZDUtYjZhNzU1ODg4Y2UxIiwidCI6IjkwZGQ1YjY0LWU3MTAtNGQzZi1iYmVjLTU5NDI3Y2NiNDVhOSJ9",
    },
  },
  {
    schemaVersion: 3,
    id: "ocorrencias-por-mes-2023-2026",
    title: "Ocorrências por Mês (2023 - 2026)",
    description: "Painel publicado pela Prefeitura de Osasco no tema Segurança Pública.",
    theme: "Segurança Pública",
    tags: ["seguranca publica", "power bi"],
    metadata: {
      source: "Power BI — Prefeitura de Osasco",
      owner: "Prefeitura de Osasco — Segurança Pública",
      methodologyNote:
        "Importado automaticamente da aba dash-panel de docs/catalogo_paineis_osasco.xlsx. Título, tema e URL de embed vêm da planilha; descrição, responsável e tags são provisórios e precisam de revisão editorial. URL de embed reconstruída: a planilha de origem traz o token de Publicar na Web truncado. Conferir no Power BI antes de divulgar este painel.",
    },
    presentation: "default",
    embed: {
      provider: "powerbi-public",
      url: "https://app.powerbi.com/view?r=eyJrIjoiMmFmODM3ZDUtZTAzZS00ZDU5LTk0MjQtMmUyN2M2YTAzMzA3IiwidCI6IjkwZGQ1YjY0LWU3MTAtNGQzZi1iYmVjLTU5NDI3Y2NiNDVhOSJ9",
    },
  },
];

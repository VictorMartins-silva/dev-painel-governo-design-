# Painel de Governo — MVP

Plataforma de descoberta e consumo de indicadores públicos municipais. O produto **não é** um
motor próprio de dashboards — é uma camada sobre o Power BI: catálogo unificado de painéis, lentes
de navegação (Tema, Secretaria, ODS), Power BI como mecanismo de visualização (embed público ou
Secure Embed autenticado) e modo kiosk/carrossel para telões e salas de situação.

## Escopo do MVP

Esta versão corresponde à Fase 1 de um roadmap de 4 fases; construir um motor de renderização
próprio, um catálogo de indicadores com relações automáticas indicador↔painel, ou IA sobre os
dados são fases posteriores, deliberadamente fora deste ciclo.

O que o MVP entrega:

- um único índice de painéis, navegado por lentes combináveis de Tema, Secretaria e ODS;
- busca global sobre esse índice;
- criação e edição de painéis dentro da própria ferramenta — metadados de catálogo + o mecanismo
  de embed, sem editor visual de componentes;
- todo painel é um relatório Power BI incorporado por iframe, por um de dois mecanismos:
  **Publicar na Web** (público, sem login) ou **Secure Embed** (Arquivo → Incorporar relatório →
  Site ou portal — exige que quem vê esteja autenticado no Power BI do tenant, respeitando RLS/OLS
  e permissões reais, sem backend nem service principal);
- modo kiosk/carrossel (`/sala`) para telões e salas de situação, com coleções de painéis e
  temporização configurável.

Documentação relacionada:

| Documento                                                                                  | Para quê                                                                                                                                    |
| ------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------- |
| [`docs/review/plano-ambiente-configuracao.md`](docs/review/plano-ambiente-configuracao.md) | Arquitetura do `/admin` original e migração para Fabric/API (parcialmente superada por este README — ver seção "Ambiente de configuração"). |
| [`docs/plano-navegacao.md`](docs/plano-navegacao.md)                                       | Arquitetura de navegação (chrome consumo × configuração) — implementada.                                                                    |

## Stack

- **Vite + React 18 + TypeScript (`strict: true`)**
- **React Router** (SPA, sem SSR)
- **Zod** para validação de configuração em runtime
- **CSS Modules** + design tokens em custom properties
- **Vitest + React Testing Library**
- **ESLint (strict + stylistic) + Prettier**

## Como rodar

Pré-requisito: Node.js na faixa declarada em `engines` (`^22.22.2 || ^24.15.0 || >=26`). O piso vem
do `jsdom` (30.x), a dependência mais restritiva. O projeto é desenvolvido e testado em Node 24 —
há um `.nvmrc` na raiz, então gerenciadores de versão (`fnm`, `nvm`) selecionam o runtime correto
automaticamente ao entrar na pasta.

As faixas em `package.json` usam `^`, então quem garante a reprodutibilidade é o
`package-lock.json`.

```bash
npm install
npm run dev          # servidor de desenvolvimento (gera tokens.css antes)
npm run build        # build de produção (gera tokens.css antes)
npm run preview      # serve o build de dist/
npm run test         # roda a suíte de testes uma vez (gera tokens.css antes)
npm run test:watch   # testes em modo watch
npm run lint         # ESLint
npm run format       # Prettier (escreve)
npm run format:check # Prettier (só verifica)
npm run tokens:build # regenera src/styles/tokens.css a partir de tokens.ts
```

`dev`, `build` e `test` regeneram `src/styles/tokens.css`. Esse arquivo não está no
`.prettierignore` e o gerador não emite saída formatada, então `npm run format:check` acusa
`tokens.css` depois de qualquer um desses comandos — é ruído conhecido, não regressão.

Rotas disponíveis: `/`, `/paineis`, `/paineis/:id`, `/sala`, `/sala/:id`, `/sala/:id/apresentar`
(kiosk, sem chrome), `/admin` (redireciona para `/admin/paineis`), `/admin/paineis`,
`/admin/paineis/novo`, `/admin/paineis/:id`, `/admin/colecoes`, `/admin/colecoes/novo`,
`/admin/colecoes/:id`, `/admin/configuracoes`. As rotas são registradas incondicionalmente em
`src/app/router.tsx`.

## Arquitetura

```
Páginas (Home, Catálogo, PanelPage, Coleções, Kiosk)
    ↓
EmbedPanelView (iframe: Publicar na Web · Secure Embed)
    ↓                                                              ↓
Design system (tokens, CSS Modules)                    Camada de dados (DataProvider + hooks)
                                                                    ↓
                                                        MockDataProvider (JSON local)
```

Não existe mais um motor de renderização próprio: um painel é metadados de catálogo (`PanelConfig`)
mais um bloco `embed` (`{ provider, url }`) que aponta para um relatório Power BI. Quem desenha a
visualização é o próprio relatório publicado no Power BI — a aplicação só descobre, organiza e
incorpora.

- **`EmbedPanelView`** (`src/renderer/EmbedPanelView.tsx`): renderiza qualquer painel como um
  iframe da URL configurada, validada contra a allowlist de domínios em `/admin/configuracoes`
  (`src/domain/embedUrl.ts`). Os dois providers de embed usam exatamente o mesmo mecanismo — a
  diferença está inteiramente do lado do Power BI, não do app:
  - `powerbi-public`: URL de "Publicar na Web" — pública, sem login, sem RLS/OLS.
  - `powerbi-secure`: URL de "Incorporar relatório → Site ou portal" ("Secure Embed"/"embed for
    your organization") — exige que quem abre esteja autenticado no Power BI do tenant (login via
    cookie de sessão, dentro do próprio iframe); a partir daí, RLS/OLS e permissões do relatório
    são aplicadas normalmente. Não depende de service principal, embed token nem backend — só do
    navegador de quem está vendo já ter (ou conseguir fazer) login no Power BI. No kiosk, isso
    significa que o navegador da apresentação precisa manter uma sessão Power BI logada.
- **`DataProvider`** (`src/data/provider.ts`): interface única de acesso a dados —
  `listPanels`/`getPanelConfig`/`getPanelFreshness`, nada além disso; o catálogo não precisa saber
  como o relatório é renderizado. A implementação atual é `MockDataProvider` (painéis em
  `src/config/panels/`, sobrepostos pelo `PanelStore`; frescor em
  `src/data/mock/datasets/freshness/<panelId>.json`). Trocar por outra implementação (ex.: uma
  `FabricDataProvider` futura) é uma troca de 1 linha em `src/main.tsx`; veja
  `src/data/provider-swap.test.tsx`, que prova isso com um stub mínimo.
- **`getPanelFreshness(panelId)`**: período de referência e data de atualização de um painel vêm
  sempre da origem de dados, nunca de um campo editável em `PanelConfig` — em produção, viriam da
  tabela de monitoramento de atualizações do Fabric. `PanelPage` consome via o hook
  `usePanelFreshness`.

## Como criar um novo painel

1. No Power BI, publique o relatório pelo mecanismo desejado:
   - **Publicar na Web**: Arquivo → Publicar na Web. Gera uma URL pública.
   - **Secure Embed**: no relatório, no Serviço Power BI → Arquivo → Incorporar relatório → Site ou
     portal. Gera uma URL/iframe que só abre para quem estiver logado no Power BI do tenant.
2. Em `/admin/paineis/novo`, preencha os metadados de catálogo (id, título, descrição, tema, tags,
   fonte, responsável), escolha o provider e cole a URL gerada no passo anterior.
3. Salve. O painel aparece imediatamente no catálogo público (`/paineis`) e pode ser adicionado a
   uma coleção em `/admin/colecoes` para aparecer no kiosk (`/sala`).

Alternativamente, crie um `PanelConfig` estático em `src/config/panels/<id>.panel.ts` e registre em
`src/config/panels/index.ts` — é o mesmo caminho usado pelos dois painéis de exemplo do repositório
(`demografia`, `trabalho-emprego`), cujas URLs de embed são placeholders a substituir por
relatórios reais.

## Navegação

Os dois ambientes têm chrome estruturalmente diferente, para que se reconheçam à distância:

- **Consumo** (`/`, `/paineis`, `/sala`): topbar horizontal com 2 destinos, busca global
  (`src/components/nav/GlobalSearch.tsx`, navega para `/paineis?q=`) e o botão
  **⚙ Configurar** à direita — é troca de modo, não item de conteúdo.
- **Configuração** (`/admin/*`): sidebar vertical agrupada por natureza (Conteúdo: Painéis,
  Coleções; Sistema: Configurações — `src/components/nav/navItems.ts`), com contadores, e o botão
  **Ver como público ↗** na faixa de aviso do topo.

Os itens de navegação usam `NavLink` (`src/components/nav/NavItem.tsx`), que já resolve estado
ativo e `aria-current="page"` por prefixo de rota. `src/components/nav/modeSwitchPaths.ts` mapeia a
rota atual para a equivalente no outro ambiente (ex.: `/admin/paineis/:id` ↔ `/paineis/:id`).

## Ambiente de configuração (`/admin`)

Editor administrativo para criar e editar painéis sem escrever código. Acesso livre em `/admin`
(redireciona para `/admin/paineis`), sem autenticação nesta versão (aviso fixo no topo do layout do
admin lembra disso).

- **`PanelStore`** (`src/admin/store/PanelStore.ts`): camada de persistência com overlay —
  painéis salvos em `localStorage` sobrepõem os estáticos do `panelRegistry` por id. Um painel
  estático editado passa a ser "sombreado" por uma cópia local (badge _Modificado_ na listagem,
  com ação _Restaurar original_); um painel novo existe só no `localStorage` até ser exportado.
  Toda escrita passa por `panelConfigSchema.parse()` — configuração inválida nunca é persistida.
  `MockDataProvider.listPanels()`/`getPanelConfig()` consultam o `PanelStore`, então as páginas
  públicas (`/paineis`, `/paineis/:id`) refletem imediatamente as edições feitas no admin.
- **`AdminPanelsPage`** (`src/admin/pages/AdminPanelsPage.tsx`): lista painéis estáticos e custom
  com badge de origem (_Original_/_Modificado_/_Novo_) e de provider de embed; ações de criar,
  duplicar, excluir (só custom), restaurar original, exportar (download de `<id>.panel.json`) e
  importar (upload + validação Zod + confirmação em caso de conflito de id).
- **`PanelEditorPage`** (`src/admin/pages/PanelEditorPage.tsx` + `PanelForm`): formulário único —
  metadados de catálogo, um seletor de provider (Publicar na Web / Secure Embed) e uma única URL de
  embed (o rótulo/dica do campo muda conforme o provider), com pré-visualização que reaproveita o
  próprio `EmbedPanelView`. Sem seções, sem componentes, sem seleção de indicador — quem monta a
  visualização é o relatório Power BI.
- **Confirmações destrutivas**: excluir e restaurar pedem confirmação (`window.confirm`) na
  listagem. Sair do editor com alterações não salvas — pelo link "Voltar", por qualquer navegação
  do React Router ou fechando/recarregando a aba — também pede confirmação (`useBlocker` do
  React Router + `beforeunload`); sem alterações pendentes, a saída é imediata.
- **Coleções** (`src/admin/store/CollectionStore.ts`, `/admin/colecoes`): sequências curadas de
  painéis (por id) com temporização própria, consumidas pelo kiosk em `/sala/:id/apresentar`.

## Testes

84 testes cobrindo: schemas Zod (casos válidos e inválidos, os dois providers de embed),
`MockDataProvider` (catálogo, frescor), `EmbedPanelView` (iframe, validação de domínio/https, aviso
de login no provider `powerbi-secure`), as páginas de navegação (Home, Catálogo), o kiosk
(`resolveCollectionSlides`) e o ambiente de configuração (`PanelStore`, editor, e os fluxos
integrados criar → salvar → renderizar / editar estático → sombrear → restaurar).

```bash
npm run test
```

`@vitest/coverage-v8` está instalado, mas não há script `test:coverage` nem bloco `coverage` em
`vite.config.ts` — nenhuma métrica de cobertura é produzida hoje.

## Limitações conhecidas do MVP

- **Secure Embed depende de sessão de navegador** — ver checklist completo em "Pendências para
  produção — Secure Embed", abaixo.
- Não existe (ainda) o fluxo "app owns data" (Power BI Embedded com service principal + embed
  token), que permitiria telas verdadeiramente anônimas com RLS aplicado — ficou fora do MVP porque
  exige acesso ao Azure Portal para registrar o app e gerar o segredo, que este ciclo não tem.
- Secretaria e ODS no Catálogo são mapeados heuristicamente a partir do `theme` de cada painel
  (não são campos do contrato `PanelConfig`) — a lente de Território ainda não existe.
- Sem autenticação no `/admin`, sem rascunho/publicado/versionamento — o editor administrativo é um
  formulário estruturado, não um construtor visual.
- Sem CI, deploy, telemetria ou tratamento global de falhas. `createBrowserRouter` exige rewrite
  para `index.html` no servidor que hospedar o `dist/`.
- `npm audit` pode reportar vulnerabilidades concentradas em ferramentas de desenvolvimento — vale
  checar com `npm audit --omit=dev` antes de tratar como bloqueante.

## Pendências para produção — Secure Embed

O provider `powerbi-secure` (`src/renderer/EmbedPanelView.tsx`) foi adotado no lugar do fluxo "app
owns data" porque funciona sem backend e sem acesso ao Azure Portal — mas isso desloca um conjunto
de responsabilidades que, hoje, **não são resolvidas pela aplicação**. Antes de qualquer uso em
produção (especialmente no kiosk, sem interação humana), alguém precisa fechar:

- **Licenciamento Power BI dos viewers**: Secure Embed exige que quem visualiza tenha uma licença
  Power BI Pro/PPU, **ou** que o workspace do relatório esteja em capacidade Premium/Fabric (que
  libera visualização para usuários sem Pro). Decisão de custo/procurement que precisa ser tomada
  antes do rollout — a aplicação não verifica nem alerta sobre isso, só reflete o que o Power BI
  retornar.
- **Sessão persistente no navegador do kiosk**: o telão precisa manter login no Power BI ativo
  continuamente. Isso implica uma conta de serviço/funcional dedicada, com política de
  senha/MFA compatível com sessão de longa duração (accesso condicional, se aplicável), e um plano
  para o que acontece quando a sessão expira — hoje, se expirar, o iframe simplesmente mostra a
  tela de login da Microsoft no telão, sem nenhum alerta operacional.
- **Cookies de terceiros no navegador do kiosk**: Secure Embed depende do cookie de sessão do Power
  BI ser acessível dentro de um iframe cross-origin. Navegadores modernos restringem isso cada vez
  mais (Safari ITP, particionamento de cookies no Chrome/CHIPS) — precisa validar no navegador e na
  versão real que vai rodar no dispositivo do telão antes de confiar no mecanismo.
- **RLS/OLS configurado no Power BI**: a aplicação não define nem valida regras de segurança de
  linha/objeto — isso é inteiramente responsabilidade de quem administra os relatórios no Power BI
  Service/Fabric. Precisa haver um dono claro desse mapeamento (quem vê o quê) antes de publicar
  relatórios sensíveis.
- **Autenticação do `/admin`**: hoje qualquer pessoa com a URL consegue trocar a URL de embed de um
  painel público. Combinado com a allowlist de domínios (`/admin/configuracoes`, hoje só
  `app.powerbi.com` por padrão), isso é um vetor de risco que precisa de autenticação real antes de
  produção.
- **Validação do fluxo de login dentro do `sandbox` do iframe**: o atributo `sandbox` atual
  (`allow-scripts allow-same-origin allow-popups allow-forms`) nunca foi testado contra o fluxo
  completo de login/MFA da Microsoft (redirecionos, popup de autenticação) em um tenant real —
  precisa de um teste ponta a ponta com uma conta de produção antes do go-live.

## Pós-MVP (não implementado)

- Power BI Embedded "app owns data" (service principal + embed token via backend), para telas
  verdadeiramente anônimas com RLS — hoje o `powerbi-secure` cobre a necessidade sem backend, ao
  custo de exigir sessão de navegador logada.
- `FabricDataProvider` consultando o catálogo de painéis a partir do Fabric/Lakehouse em vez do
  `MockDataProvider` — a interface `DataProvider` já é assíncrona e mínima o bastante para isso ser
  uma troca de 1 linha.
- Fase 2 do roadmap: catálogo de indicadores com relações automáticas indicador↔painel,
  documentação automática, APIs mais maduras.
- Fase 3: painéis nativos, configurador visual, motor de renderização próprio.
- Fase 4: IA — explicação automática de indicadores, perguntas em linguagem natural, alertas.

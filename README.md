# Painel de Governo — Protótipo

Protótipo de uma plataforma padronizada de visualização de indicadores públicos municipais,
construída sobre o princípio de **painéis por configuração**: uma única página renderizadora
interpreta arquivos de configuração validados por schema e monta os painéis a partir de um
registry fechado de componentes analíticos. O objetivo é provar que um segundo painel pode ser
adicionado **apenas por configuração + dados**, sem escrever JSX ou CSS novos.

## Stack

- **Vite + React 18 + TypeScript (`strict: true`)**
- **React Router** (SPA, sem SSR)
- **Apache ECharts** (`echarts/core` modular — só `EChartsBase` importa a lib)
- **Zod** para validação de configuração em runtime
- **CSS Modules** + design tokens em custom properties
- **Vitest + React Testing Library**
- **ESLint (strict + stylistic) + Prettier**

Ver `_discover/painel-governo-react/plano-execucao.md` (no acervo operacional) para o racional
completo das decisões técnicas.

## Como rodar

Pré-requisito: Node.js. O projeto foi desenvolvido e testado em Node 18.16 — algumas
dependências (`vitest`, `jsdom`) foram fixadas em versões compatíveis com Node 18 porque as
versões mais recentes exigem Node ≥ 20. Se o ambiente tiver Node 20+, as versões podem ser
atualizadas em `package.json` sem alterar o código.

```bash
npm install
npm run dev        # servidor de desenvolvimento
npm run build       # build de produção (gera tokens.css antes)
npm run test        # roda a suíte de testes uma vez
npm run test:watch  # testes em modo watch
npm run lint         # ESLint
npm run format       # Prettier (escreve)
npm run format:check # Prettier (só verifica)
npm run tokens:build  # regenera src/styles/tokens.css a partir de tokens.ts
```

Rotas disponíveis: `/`, `/paineis`, `/paineis/:id`, `/indicadores/:id`, `/dev/galeria`,
`/admin`, `/admin/paineis/novo`, `/admin/paineis/:id`.

## Arquitetura em 4 camadas

```
Páginas (Home, Catálogo, PanelPage, IndicatorDetailPage)
    ↓
Renderizador de configuração (ConfigRenderer + ComponentRegistry + FilterContext)
    ↓
Biblioteca de componentes (analíticos + estruturais + feedback)   Camada de dados (DataProvider + hooks)
    ↓                                                                  ↓
Design system (tokens, tema ECharts, CSS Modules)                 MockDataProvider (JSON local)
```

- **`ComponentRegistry`** (`src/renderer/ComponentRegistry.tsx`): mapa fechado `type → componente`.
  Um `type` de componente sem entrada no registry renderiza um `ErrorState` localizado — a página
  não quebra.
- **`ConfigRenderer`** (`src/renderer/ConfigRenderer.tsx`): recebe a config do painel como
  `unknown`, valida com `panelConfigSchema` (Zod) e só então renderiza. Config inválida produz um
  erro estruturado com os `issues` do Zod (caminho + mensagem), nunca um crash.
- **`DataProvider`** (`src/data/provider.ts`): interface única de acesso a dados. A implementação
  atual é `MockDataProvider` (JSON local em `src/data/mock/datasets/`, descoberto automaticamente
  via `import.meta.glob` — nenhum arquivo precisa ser editado para registrar um novo dataset).
  Trocar por outra implementação (ex.: uma `HttpDataProvider` futura) é uma troca de 1 linha em
  `src/main.tsx` (`new MockDataProvider()` → `new HttpDataProvider()`); veja também
  `src/data/provider-swap.test.tsx`, que prova isso com um stub mínimo.
- **`FilterContext`**: estado dos filtros globais de um painel. Os componentes analíticos nunca
  leem filtros diretamente — os hooks de dados combinam a query da config com os filtros ativos do
  contexto.

## Como criar um novo painel

Prova de arquitetura: o Painel 2 (Demografia) foi criado tocando **apenas**
`src/config/panels/demografia.panel.ts`, os fixtures em `src/data/mock/datasets/` e uma linha de
registro em `src/config/panels/index.ts` — nenhum componente, página ou CSS novos.

1. Crie os arquivos de mock em `src/data/mock/datasets/` (metrics/categorical/tables conforme o
   conteúdo do painel, mais `indicator-metadata/` e `filter-options/<panelId>/` se necessário). Os
   arquivos são descobertos automaticamente pelo `MockDataProvider` — não é preciso importar nada
   manualmente.
2. Crie `src/config/panels/<id>.panel.ts` exportando um objeto `PanelConfig` (filtros, seções,
   componentes — só os 4 tipos do registry: `indicator-card`, `time-series`, `bar-chart`,
   `data-table`).
3. Registre o painel em `src/config/panels/index.ts` (adicione ao array `panelRegistry`).
4. Acesse `/paineis/<id>` — pronto.

## Como adicionar um novo tipo de componente

1. Crie o componente presentacional em `src/components/<categoria>/` (recebe dados já resolvidos
   via props, nunca busca dados sozinho).
2. Adicione o schema Zod do novo tipo em `src/config/schemas/components.schema.ts` e inclua-o no
   `componentConfigSchema` (`z.discriminatedUnion`).
3. Crie um container em `src/renderer/containers.tsx` que usa o hook de dados apropriado
   (`useIndicator`/`useTimeSeries`/`useCategoricalSeries`/`useTable`, ou um novo hook em
   `src/data/hooks/`) e envolve o componente presentacional em `<AsyncBoundary>`.
4. Registre o container em `componentRegistry` (`src/renderer/ComponentRegistry.tsx`).

Sem essas 4 alterações, um `type` presente na config mas ausente no registry renderiza um
`ErrorState` localizado em vez de quebrar a página — o comportamento é testado em
`src/renderer/ConfigRenderer.test.tsx`.

## Ambiente de configuração (`/admin`)

Editor administrativo para criar e editar painéis sem escrever código — formulário estruturado
que produz objetos `PanelConfig` válidos, mais um preview ao vivo reaproveitando o próprio
`ConfigRenderer`. Acesso livre em `/admin`, sem autenticação nesta versão (aviso fixo no topo do
layout do admin lembra disso).

- **`PanelStore`** (`src/admin/store/PanelStore.ts`): camada de persistência com overlay —
  painéis salvos em `localStorage` sobrepõem os estáticos do `panelRegistry` por id. Um painel
  estático editado passa a ser "sombreado" por uma cópia local (badge *Modificado* na listagem,
  com ação *Restaurar original*); um painel novo existe só no `localStorage` até ser exportado.
  Toda escrita passa por `panelConfigSchema.parse()` — configuração inválida nunca é persistida.
  `MockDataProvider.listPanels()`/`getPanelConfig()` consultam o `PanelStore`, então as páginas
  públicas (`/paineis`, `/paineis/:id`) refletem imediatamente as edições feitas no admin.
- **`AdminPanelsPage`** (`src/admin/pages/AdminPanelsPage.tsx`): lista painéis estáticos e custom
  com badge de origem (*Original*/*Modificado*/*Novo*); ações de criar, duplicar, excluir (só
  custom), restaurar original, exportar (download de `<id>.panel.json`) e importar (upload +
  validação Zod + confirmação em caso de conflito de id).
- **`PanelEditorPage`** (`src/admin/pages/PanelEditorPage.tsx`): editor em split view — formulário
  à esquerda (`PanelMetadataForm`, `FiltersForm`, `SectionsForm` → `ComponentForm` por componente)
  e `EditorPreview` à direita, que renderiza o draft atual através do `ConfigRenderer` com
  debounce de 300 ms. Config inválida aparece no preview como o mesmo `ErrorState` estruturado
  (issues do Zod) usado pelas páginas públicas — o preview também serve de feedback de validação.
  `ComponentForm` traz campos condicionais por tipo de componente e o `IndicatorSelect` (busca +
  filtro de compatibilidade tipo ↔ indicador via `listIndicators()`); colunas de `data-table` podem
  ser pré-preenchidas a partir do schema real do dataset selecionado.
- **Confirmações destrutivas**: excluir e restaurar pedem confirmação (`window.confirm`) na
  listagem. Sair do editor com alterações não salvas — pelo link "Voltar", por qualquer navegação
  do React Router ou fechando/recarregando a aba — também pede confirmação (`useBlocker` do
  React Router + `beforeunload`); sem alterações pendentes, a saída é imediata.
- **Catálogo de indicadores**: `listIndicators()` (`DataProvider`) devolve `IndicatorSummary[]`
  (`shapes`, `dimensions`, `datasets`, `defaultFormat`), usado pelo `IndicatorSelect` para filtrar
  o dropdown por compatibilidade com o tipo de componente escolhido.

O caminho de migração para Fabric/API está documentado em
`docs/plano-ambiente-configuracao.md` — `PanelStore` e `listIndicators()` são os dois pontos de
troca (localStorage → endpoints HTTP, mock → catálogo real).

## Testes

142 testes cobrindo: schemas Zod (casos válidos e inválidos), `MockDataProvider` (filtro em
memória, soma por período, erros simulados), hooks de dados (4 estados: loading/success/empty/
error), componentes analíticos e de filtro (RTL), o renderizador (config sintética, config
inválida, componente não registrado, refetch ao mudar filtro), os dois painéis reais (schema +
integração end-to-end), as páginas de navegação (Home, Catálogo, Detalhe do indicador) e o
ambiente de configuração (`PanelStore`, editor por etapa, preview ao vivo e os fluxos integrados
criar → salvar → renderizar / editar estático → sombrear → restaurar).

```bash
npm run test
```

## Estados de carregamento, vazio e erro

Todo hook de dados retorna `{ status: 'loading' | 'success' | 'empty' | 'error', ... }`;
`<AsyncBoundary>` traduz isso em `LoadingState` / `EmptyState` / `ErrorState` de forma consistente
em todos os componentes analíticos. Os 4 estados de cada componente podem ser inspecionados
manualmente em `/dev/galeria` (substituto do Storybook neste protótipo) ou via os filtros reais do
Painel "Trabalho e Emprego": selecionar Sexo = Masculino/Feminino produz um estado vazio real
(os indicadores de resumo não são segmentados por sexo/faixa etária nesse painel — ver nota
metodológica na própria página). O metric `__mock_error__` (indicador) e dataset `__mock_error__`
(tabela) forçam um erro simulado em qualquer painel.

## Limitações conhecidas do protótipo

- Dados 100% fictícios, gerados por `scripts/generate-mock-fixtures.mjs` (determinístico —
  rode `node scripts/generate-mock-fixtures.mjs` para regenerar).
- `MockDataProvider` soma linhas que compartilham o mesmo período após aplicar os filtros (ex.:
  somar `sexo=masculino` + `sexo=feminino` reconstrói o total) — é a única forma de agregação
  dinâmica no protótipo; fora isso, os mocks já vêm no grain de exibição.
- Secretaria e ODS no Catálogo são mapeados heuristicamente a partir do `theme` de cada painel
  (não são campos do contrato `PanelConfig`) — a spec permite dados simulados para esses filtros
  nesta etapa.
- Sem autenticação no `/admin`, sem rascunho/publicado/versionamento e sem motor de consultas —
  fora de escopo da v1 (ver `docs/plano-ambiente-configuracao.md`, seção 8). O editor
  administrativo é um formulário estruturado com preview ao vivo, não um construtor visual
  drag-and-drop.
- Bundle de produção ainda não usa code-splitting (aviso do Vite no build); aceitável para o
  volume atual do protótipo.

## Pós-protótipo (não implementado)

`HttpDataProvider` consultando uma API FastAPI, que por sua vez consulta o SQL Endpoint do
Fabric — o caminho de migração está preservado pela interface `DataProvider` já ser assíncrona e
pelo envelope de resposta (`DataEnvelope<T>`) já ser o formato que a futura API usaria.

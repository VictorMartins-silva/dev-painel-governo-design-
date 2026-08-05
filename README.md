# Painel de Governo — Protótipo

Protótipo de uma plataforma padronizada de visualização de indicadores públicos municipais,
construída sobre o princípio de **painéis por configuração**: uma única página renderizadora
interpreta arquivos de configuração validados por schema e monta os painéis a partir de um
registry fechado de componentes analíticos. O objetivo é provar que um segundo painel pode ser
adicionado **apenas por configuração + dados**, sem escrever JSX ou CSS novos.

## Escopo da validação

O objetivo desta versão é validar o **conceito operacional**, e não prontidão para produção:

- um único índice de painéis, navegado por lentes combináveis de Tema, Secretaria e ODS;
- navegação dos painéis para os detalhes de seus indicadores;
- criação e edição de painéis dentro da própria ferramenta;
- composição restrita a quatro componentes fixos e padronizados;
- posicionamento definido por seções ordenadas e layouts `grid-2`, `grid-3`, `grid-4` ou `stack`;
- preview e publicação usando o mesmo renderizador;
- painel salvo aparecendo imediatamente na área pública da aplicação no mesmo navegador.

Nesta fase, **publicar** significa validar e salvar no armazenamento local do protótipo, tornando o
painel acessível no catálogo e na rota pública da própria ferramenta. Não significa ainda publicação
multiusuário com backend, autenticação, aprovação, histórico ou operação produtiva.

O escopo completo, os critérios de sucesso e o estado de cada capacidade estão documentados em
[`docs/escopo-do-prototipo.md`](docs/escopo-do-prototipo.md). A próxima etapa é melhorar a experiência
da página de configuração até chegar às telas e aos comportamentos necessários para apresentar esse
conceito com clareza.

Documentação relacionada:

| Documento                                                                            | Para quê                                                                      |
| ------------------------------------------------------------------------------------ | ----------------------------------------------------------------------------- |
| [`docs/escopo-do-prototipo.md`](docs/escopo-do-prototipo.md)                         | O que a validação precisa provar e o que está deliberadamente fora dela.      |
| [`docs/plano-ambiente-configuracao.md`](docs/plano-ambiente-configuracao.md)         | Arquitetura do `/admin` e caminho de migração para Fabric/API.                |
| [`docs/relatorio-avaliacao-aplicacao.html`](docs/relatorio-avaliacao-aplicacao.html) | Avaliação técnica com números verificados, dívida técnica e roadmap.          |
| [`docs/discordancias-documentacao.md`](docs/discordancias-documentacao.md)           | Divergências apuradas entre a documentação e o código, e o que foi corrigido. |

## Stack

- **Vite + React 18 + TypeScript (`strict: true`)**
- **React Router** (SPA, sem SSR)
- **Apache ECharts** (`echarts/core` modular — só `EChartsBase` importa a lib)
- **Zod** para validação de configuração em runtime
- **CSS Modules** + design tokens em custom properties
- **Vitest + React Testing Library**
- **ESLint (strict + stylistic) + Prettier**

O racional completo das decisões técnicas está no plano de execução mantido no acervo operacional
do projeto, fora deste repositório.

## Como rodar

Pré-requisito: Node.js. O projeto foi desenvolvido e testado em Node 18.16 — `vitest` (2.x) e
`jsdom` (25.x) são mantidos nessas linhas major porque as versões mais recentes exigem Node ≥ 20.
As faixas em `package.json` usam `^`, então quem garante a reprodutibilidade é o
`package-lock.json`; se o ambiente tiver Node 20+, as majors podem ser atualizadas sem alterar o
código de aplicação.

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

Rotas disponíveis: `/`, `/paineis`, `/paineis/:id`, `/indicadores`, `/indicadores/:id`, `/admin`,
`/admin/indicadores`, `/admin/componentes`, `/admin/paineis/novo`, `/admin/paineis/:id`. O cardápio
de componentes fica dentro da área de configuração, não na navegação pública.
`/dev/galeria` redireciona para `/admin/componentes`. As rotas são registradas incondicionalmente
em `src/app/router.tsx`.

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
- **`getPanelFreshness(panelId)`** (`DataProvider`): período de referência e data de atualização
  de um painel **não** são campos configuráveis em `PanelConfig` — vêm sempre da origem de dados.
  `MockDataProvider` resolve isso com fixtures em `src/data/mock/datasets/freshness/<panelId>.json`
  (simulando a tabela de monitoramento de atualizações do Fabric); em produção, o
  `FabricDataProvider` consultará essa tabela real, que dispara automaticamente quando há dado
  novo. `PanelPage` consome via o hook `usePanelFreshness`.
- **`FilterContext`**: estado dos filtros globais de um painel. Os componentes analíticos nunca
  leem filtros diretamente — os hooks de dados combinam a query da config com os filtros ativos do
  contexto.

## Como criar um novo painel

Prova de arquitetura: o Painel 2 (Demografia) foi criado tocando **apenas**
`src/config/panels/demografia.panel.ts`, os fixtures em `src/data/mock/datasets/` e uma linha de
registro em `src/config/panels/index.ts` — nenhum componente, página ou CSS novos.

1. Crie os arquivos de mock em `src/data/mock/datasets/` (metrics/categorical/tables conforme o
   conteúdo do painel, mais um registro por indicador em `indicators/<id>.json` — ver
   `indicator.schema.ts` para os campos obrigatórios de governança — e
   `filter-options/<panelId>/` se necessário, e `freshness/<id>.json` com
   `referencePeriod`/`updatedAt`). Os arquivos são descobertos automaticamente pelo
   `MockDataProvider` — não é preciso importar nada manualmente.
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
  estático editado passa a ser "sombreado" por uma cópia local (badge _Modificado_ na listagem,
  com ação _Restaurar original_); um painel novo existe só no `localStorage` até ser exportado.
  Toda escrita passa por `panelConfigSchema.parse()` — configuração inválida nunca é persistida.
  `MockDataProvider.listPanels()`/`getPanelConfig()` consultam o `PanelStore`, então as páginas
  públicas (`/paineis`, `/paineis/:id`) refletem imediatamente as edições feitas no admin.
- **`AdminPanelsPage`** (`src/admin/pages/AdminPanelsPage.tsx`): lista painéis estáticos e custom
  com badge de origem (_Original_/_Modificado_/_Novo_); ações de criar, duplicar, excluir (só
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
- **Catálogo de indicadores**: `listIndicators()` (`DataProvider`) devolve `IndicatorCatalogEntry[]`
  — um registro por indicador que une o técnico (`shapes`, `dimensions`, `datasets`,
  `defaultFormat`) e a governança (`definition`, `periodicity`, `granularity`, `owner`,
  `updatedAt`). É usado pelo `IndicatorSelect` no editor, pelo índice público em `/indicadores` e
  pela curadoria em `/admin/indicadores` (indicadores órfãos, referências quebradas e fixtures
  inválidas), que também alimenta avisos não bloqueantes no editor quando um componente referencia
  um indicador fora do catálogo.

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

`@vitest/coverage-v8` está instalado, mas não há script `test:coverage` nem bloco `coverage` em
`vite.config.ts` — nenhuma métrica de cobertura é produzida hoje.

## Estados de carregamento, vazio e erro

Todo hook de dados retorna `{ status: 'loading' | 'success' | 'empty' | 'error', ... }`;
`<AsyncBoundary>` traduz isso em `LoadingState` / `EmptyState` / `ErrorState` de forma consistente
em todos os componentes analíticos. Os 4 estados de cada componente podem ser inspecionados
manualmente em `/admin/componentes` (cardápio de componentes, substituto do Storybook neste protótipo) ou via os filtros reais do
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
- Bundle de produção ainda não usa code-splitting (aviso do Vite no build): um único JS de
  ~994 kB minificado / ~319 kB gzip, carregando ECharts e o admin junto com a área pública.
  Aceitável para o volume atual do protótipo.
- `panelConfigSchema` valida estrutura e formato, não semântica: não checa unicidade de IDs de
  filtros/seções/componentes nem se as métricas e datasets referenciados existem. O editor evita
  isso pela seleção guiada, mas um JSON importado à mão pode ser aceito e render componentes
  permanentemente vazios ou em erro.
- Sem CI, deploy, telemetria ou tratamento global de falhas. `createBrowserRouter` exige rewrite
  para `index.html` no servidor que hospedar o `dist/`.
- `npm audit` reporta 8 ocorrências (2 críticas, 3 altas, 3 moderadas), concentradas em
  ferramentas de desenvolvimento; com `--omit=dev` restam 2 altas na cadeia `react-router`,
  relativas ao modo RSC que esta SPA não usa.

## Pós-protótipo (não implementado)

`HttpDataProvider` consultando uma API FastAPI, que por sua vez consulta o SQL Endpoint do
Fabric — o caminho de migração está preservado pela interface `DataProvider` já ser assíncrona e
pelo envelope de resposta (`DataEnvelope<T>`) já ser o formato que a futura API usaria.
`getPanelFreshness()` seguirá o mesmo caminho, consultando o schema de tabelas de monitoramento
de atualização do Fabric que disparam automaticamente quando há dado novo.

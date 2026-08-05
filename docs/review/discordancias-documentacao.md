# Discordâncias com os documentos originais

Registro da avaliação crítica de `README.md`, `docs/escopo-do-prototipo.md` e
`docs/relatorio-avaliacao-aplicacao.html` feita em **05/08/2026** contra o código da revisão
`145e987` (com alterações locais não commitadas em `README.md` e `docs/`).

Cada item traz o que o documento afirmava, o que a verificação encontrou e o que foi feito. As
verificações foram reexecutadas de fato: `npm run test`, `npm run build`, `npm run lint`,
`npm run format:check`, `npm audit`, `npm audit --omit=dev`, mais leitura direta do código.

---

## 1. Divergências factuais corrigidas

### 1.1 Contagem de linhas TS/TSX estava errada — relatório

- **Afirmava:** 6.868 linhas TS/TSX.
- **Verificado:** 7.742 linhas em `src/**/*.{ts,tsx}` (5.194 de produção, 2.548 de teste), em 114
  arquivos TS/TSX dentro dos 175 arquivos de `src`.
- **Ação:** número corrigido no cartão de estatísticas, com a fração de teste explicitada — o
  número agregado sozinho superestima o tamanho do código de aplicação em quase 50%.
- **Discordância de fundo:** "linhas de código" como métrica de destaque em um relatório executivo
  tem baixo valor informativo e alto risco de desatualização. Mantido apenas porque o formato do
  relatório já o previa, mas não deveria ganhar destaque em revisões futuras.

### 1.2 Arquivos fora do padrão Prettier: 12 → 2 — relatório

- **Afirmava:** 12 arquivos reprovados no `format:check`, refletido na nota 7,8 de Qualidade de
  código.
- **Verificado:** 2 arquivos — `src/app/pages/HomePage.module.css` e `src/styles/tokens.css`.
- **Ação:** número corrigido em três lugares (tabela de dimensões, achado de higiene, tabela de
  evidências) e nota de Qualidade de código ajustada de 7,8 para 8,0.
- **Discordância de fundo:** contar arquivos reprovados não era o achado certo. A causa real é
  estrutural e o relatório não a identificava: `src/styles/tokens.css` é **gerado** pelos hooks
  `predev`/`prebuild`/`pretest`, o gerador não emite saída formatada, e o arquivo não está no
  `.prettierignore`. Logo `format:check` volta a falhar depois de qualquer `dev`, `build` ou
  `test` — o check nunca poderá ficar verde sem mudar o gerador ou o ignore. Essa análise foi
  acrescentada ao relatório e ao README.

### 1.3 Duração da suíte apresentada como evidência — relatório

- **Afirmava:** "duração 62,29 s", na tabela de evidências.
- **Verificado:** 47,50 s na reexecução, mesma máquina, mesmo código.
- **Ação:** substituído por "~50 s na máquina de avaliação", com ressalva explícita.
- **Discordância de fundo:** tempo de parede não é evidência reproduzível e não deveria constar
  como resultado de check ao lado de números determinísticos como contagem de testes ou tamanho de
  bundle. A precisão de duas casas decimais sugeria um rigor que a medida não tem.

### 1.4 "Importações manuais podem gerar painéis vazios" — relatório

- **Afirmava:** que uma importação de JSON poderia produzir painéis vazios.
- **Verificado:** `panelConfigSchema` (`src/config/schemas/panel.schema.ts`) declara
  `sections: z.array(panelSectionSchema).min(1)` e, dentro da seção,
  `components: z.array(componentConfigSchema).min(1)`. Um painel estruturalmente vazio é rejeitado
  na validação. O caso descrito é impossível.
- **Ação:** achado reescrito para o risco que de fato existe — referências a métricas e datasets
  inexistentes (que produzem componentes permanentemente em estado vazio ou de erro) e IDs
  duplicados de filtro/seção/componente, que tornam a reordenação ambígua.
- **Discordância de fundo:** o achado original estava certo na conclusão (o schema não cobre
  semântica) e errado no exemplo. Um exemplo verificavelmente falso enfraquece um achado
  legítimo — este é o item mais importante da lista de dívida técnica e precisava de um caso
  concreto correto.

### 1.5 Referência a arquivo inexistente — README

- **Afirmava:** "Ver `_discover/painel-governo-react/plano-execucao.md` (no acervo operacional)".
- **Verificado:** o caminho não existe no repositório.
- **Ação:** substituído por uma menção ao plano de execução no acervo operacional, sem caminho
  falso.
- **Discordância de fundo:** parênteses explicando que o arquivo é externo não compensa apresentar
  um caminho relativo que o leitor vai tentar abrir. Ou o documento entra no repositório, ou não
  se cita um caminho.

### 1.6 "Dependências fixadas" — README

- **Afirmava:** que `vitest` e `jsdom` "foram fixadas em versões compatíveis com Node 18".
- **Verificado:** `package.json` declara `"vitest": "^2.1.9"` e `"jsdom": "^25.0.1"` — faixas com
  `^`, que não são pinos. Quem garante reprodutibilidade é o `package-lock.json`.
- **Ação:** reescrito para "mantidos nessas linhas major", com a menção explícita ao lockfile.

---

## 2. Achados acrescentados (ausentes nos três documentos)

### 2.1 `/dev/galeria` embarcada no build de produção

`src/app/router.tsx` registra todas as rotas incondicionalmente, sem checagem de
`import.meta.env.DEV`. A galeria de estados — descrita no próprio README como "substituto do
Storybook neste protótipo" — vai para o bundle público e é acessível por URL direta. Não expõe
dados sensíveis, mas soma peso ao bundle que o relatório já sinaliza como problema e é uma tela
interna acessível durante a apresentação. Acrescentado como achado P2 no relatório, na tabela de
controles de segurança e no README.

### 2.2 `@vitest/coverage-v8` é dependência morta e carrega um advisory crítico

O relatório afirmava, corretamente, que não há meta nem relatório de cobertura — mas parava aí. A
verificação mostra que `@vitest/coverage-v8` **está instalado** em `devDependencies`, sem nenhum
script que o invoque e sem bloco `coverage` em `vite.config.ts`. Além de carga morta, é uma das
duas ocorrências **críticas** do `npm audit`. Removê-lo, ou ligá-lo a um `test:coverage` e
atualizá-lo, elimina metade das críticas sem custo funcional. É a correção de melhor relação
custo-benefício em toda a lista de dívida técnica e não estava documentada.

### 2.3 Validação estrutural × semântica não estava explicitada no escopo

`docs/escopo-do-prototipo.md` §2.4 dizia apenas "validar a configuração antes de salvar". Como o
critério de sucesso nº 9 do próprio documento é "explicar claramente quais comportamentos são reais
e quais são simulados", a distinção precisa estar no escopo, não só no relatório técnico.
Acrescentado parágrafo delimitando o que a validação por schema cobre e o que não cobre.

### 2.4 §2.5 do escopo sugeria ausências que não existem

O item "reduzir fricção em adicionar, remover, duplicar e reordenar elementos" podia ser lido como
se nada disso existisse. Verificado em `FiltersForm.tsx` e `SectionsForm.tsx`: adicionar, remover e
reordenar por setas já funcionam para filtros, seções e componentes; duplicar existe só no nível de
painel (`AdminPanelsPage.tsx`). O texto passou a distinguir o que já existe do que falta — o
documento é usado para dimensionar o próximo ciclo e essa ambiguidade inflava o esforço aparente.

---

## 3. Discordâncias metodológicas com o relatório (estrutura, não fatos)

### 3.1 Duas escalas de nota conviviam sem aviso

O cartão de destaque traz **8,7/10** de "aderência ao conceito". A tabela de dimensões logo abaixo
tem média em torno de **6,8**, puxada por Desempenho (5,6), Segurança (4,7) e Operação (3,8). Um
leitor executivo compara os dois números e conclui que o relatório se contradiz ou que a nota alta
foi inflada.

Não se contradizem: medem coisas diferentes — a nota alta mede o critério de aceite desta fase, as
dimensões medem contra um produto em produção, cujos requisitos o escopo coloca **explicitamente
fora** do aceite. Mas isso estava implícito. Foi acrescentado um bloco de método no sumário
dizendo que 8,7 não é média da tabela, e o texto de abertura da tabela foi reescrito para deixar o
referencial claro.

**Discordância que permanece:** exibir notas numéricas de Segurança e Operação para itens
declarados fora de escopo é discutível de qualquer forma. Punir numericamente a ausência de CI em
um protótipo que decidiu não ter CI mistura duas conversas. Uma revisão futura ficaria mais clara
substituindo essas linhas por um estado qualitativo ("fora de escopo — pendente para produção").
Mantidas as notas por ora, para preservar a comparabilidade com esta versão do relatório.

### 3.2 Severidade visual contradizia o rótulo

Os dois primeiros achados da seção de riscos — admin aberto e persistência em `localStorage` — eram
`class="finding risk"`, com acento **vermelho**, enquanto o texto ao lado os rotulava "Futuro" e o
lead da seção dizia serem "limites deliberados do protótipo". O sinal visual mais forte da página
contradizia a mensagem escrita, e o vermelho é o que sobra da leitura rápida.

Foi criada uma variante `scoped`, com acento listrado em azul, e o rótulo mudou de "Futuro" para
"Limite de escopo". Riscos reais dentro do escopo atual continuam em vermelho e âmbar.

### 3.3 A revisão citada não correspondia ao estado avaliado

O cabeçalho e o rodapé creditavam a avaliação à revisão `145e987`. A árvore tem alterações não
commitadas em `README.md` e `docs/` — inclusive o próprio relatório. Um relatório que se diz
reproduzível a partir de um SHA precisa dizer quando não é. Cabeçalho e rodapé corrigidos.

---

## 4. Verificado e confirmado sem alteração

Estes números dos documentos originais foram reexecutados e conferem exatamente:

| Afirmação                                                         | Verificação                                                      |
| ----------------------------------------------------------------- | ---------------------------------------------------------------- |
| 175 arquivos em `src`                                             | ✅                                                               |
| 33 arquivos de teste, 142 testes, todos passando                  | ✅                                                               |
| Build: 849 módulos, CSS 38,12 kB, JS 993,97 kB / 318,63 gz        | ✅                                                               |
| Lint: 0 erros, 3 avisos de Fast Refresh                           | ✅ (`DataProviderContext`, `ComponentRegistry`, `FilterContext`) |
| `npm audit`: 8 ocorrências — 2 críticas, 3 altas, 3 moder.        | ✅                                                               |
| `npm audit --omit=dev`: 2 altas na cadeia `react-router`          | ✅ (advisory de RSC; esta SPA não usa RSC)                       |
| Sem `dangerouslySetInnerHTML`, `innerHTML` ou `eval`              | ✅                                                               |
| Gráficos com `role="img"`; tabela sem `aria-sort`                 | ✅ (`EChartsBase.tsx`; nenhuma ocorrência de `aria-sort`)        |
| Script inline de tema em `index.html`                             | ✅                                                               |
| Rotas listadas no README                                          | ✅ (`src/app/router.tsx`)                                        |
| Lentes refletidas na query string                                 | ✅ (`useSearchParams` em `CatalogPage.tsx`)                      |
| `useBlocker` + `beforeunload` no editor                           | ✅ (`PanelEditorPage.tsx`)                                       |
| Reordenar filtros, seções e componentes por setas                 | ✅ (`FiltersForm.tsx`, `SectionsForm.tsx`)                       |
| Descoberta de fixtures por `import.meta.glob`                     | ✅ (`MockDataProvider.ts`, 6 globs)                              |
| Sentinela `__mock_error__` para métrica e dataset                 | ✅ (`MockDataProvider.ts`, 4 usos)                               |
| `createBrowserRouter` exige rewrite para `index.html`             | ✅                                                               |
| `docs/plano-ambiente-configuracao.md` §8 = "Fora de escopo da v1" | ✅                                                               |

---

## 5. Discordância sobre a documentação como sistema

Três observações que não cabem em nenhum documento específico:

1. **Números fixos em prosa vão desatualizar.** "142 testes" aparece no README, no relatório e
   agora no escopo. O primeiro teste novo torna os três errados ao mesmo tempo, e nada no projeto
   detecta isso. Se o número importa, ele deveria vir de um comando; se não importa, deveria ficar
   só no relatório, que é datado por natureza.

2. **O relatório é um documento datado sem mecanismo de reavaliação.** Ele descreve um instante e
   está no repositório junto com código que muda. Um cabeçalho de data ajuda, mas não impede que
   ele seja lido em novembro de 2026 como se fosse atual. Vale considerar movê-lo para um diretório
   versionado por data, ou registrar no topo a data da última reverificação.

3. **O `format:check` reprovado é um custo silencioso.** Enquanto `tokens.css` reprovar por
   construção, ninguém vai olhar a saída do Prettier — e uma reprovação real vai passar
   despercebida no meio do ruído. É uma correção de dez minutos que devolve o sinal de um check.

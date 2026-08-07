# Escopo do protótipo — validação do conceito operacional

> **Superado.** Este documento descreve o conceito original de "painéis por configuração" com um
> motor de renderização nativo — decisão revertida em favor de um MVP construído sobre o Power BI
> (catálogo + lentes + Power BI Embedded + kiosk). O escopo atual está no [`README.md`](../../README.md),
> seção "Escopo do MVP". Mantido como registro histórico da validação de conceito que precedeu essa
> decisão.

## 1. Objetivo

Este protótipo existe para validar o **conceito operacional** de uma ferramenta única para navegar,
compor e publicar painéis de indicadores. Ele não é uma prova de infraestrutura, segurança ou
integração definitiva com fontes de dados.

A pergunta central da validação é:

> Uma equipe consegue navegar pelo acervo por diferentes lentes e criar, editar e publicar painéis
> dentro da própria ferramenta, combinando componentes fixos segundo regras claras de composição?

## 2. Conceitos que o protótipo deve demonstrar

### 2.1 Índice único e lentes de navegação

- Existe **um único índice de painéis**.
- Tema, Secretaria e ODS são lentes combináveis sobre esse mesmo índice, e não árvores ou catálogos
  independentes.
- A lente selecionada pode ser representada na URL, permitindo compartilhar o recorte.
- O usuário entra em um painel a partir do índice e navega para os detalhes dos indicadores no
  contexto desse painel.
- Nesta fase, o índice primário é de painéis. Indicadores são conteúdos referenciados pelos painéis,
  e não um segundo catálogo editorial independente.

### 2.2 Composição com componentes fixos

O autor não cria componentes arbitrários. Ele monta painéis a partir de uma biblioteca controlada:

1. cartão de indicador (`indicator-card`);
2. série temporal (`time-series`);
3. gráfico de barras (`bar-chart`);
4. tabela de dados (`data-table`).

Essa restrição faz parte do conceito: a padronização visual e comportamental vem antes da liberdade
total de desenho.

### 2.3 Regras de posicionamento

A composição espacial não é livre. Ela segue regras previsíveis:

- o painel contém uma lista ordenada de seções;
- cada seção contém uma lista ordenada de componentes;
- cada seção escolhe um layout permitido: `grid-2`, `grid-3`, `grid-4` ou `stack`;
- seções e componentes podem ser movidos para cima ou para baixo;
- o mesmo `ConfigRenderer` é usado no preview e na área pública.

Assim, a configuração define **conteúdo, ordem e preset de layout**, enquanto o design system e os
componentes fixos controlam a apresentação final.

### 2.4 Criar, editar e publicar dentro da ferramenta

Para a validação, “publicar” significa:

- criar ou editar um painel na área de configuração;
- validar a configuração antes de salvar;
- salvar a configuração no armazenamento local do protótipo;
- fazer o painel aparecer imediatamente no catálogo e na rota pública da mesma aplicação e do mesmo
  navegador;
- permitir editar uma configuração original, restaurá-la e importar/exportar JSON.

Isso valida o **fluxo e o comportamento de publicação**, não o mecanismo definitivo de publicação
multiusuário. Persistência compartilhada, aprovação editorial, histórico e permissões ficam para uma
fase posterior.

“Validar a configuração” significa, nesta fase, validação **estrutural** por schema: tipos, campos
obrigatórios, layouts permitidos e presença de ao menos uma seção com ao menos um componente. A
validação **semântica** — unicidade de IDs, existência real das métricas e datasets referenciados,
compatibilidade entre filtros e dimensões — ainda não é feita. O editor evita esses casos pela
seleção guiada; uma configuração importada como JSON, não.

### 2.5 Qualidade necessária para apresentação

A evolução imediata deve priorizar a página de configuração e o roteiro da demonstração:

- tornar mais claro o fluxo criar → compor → visualizar → salvar → abrir publicado;
- deixar explícitas as regras de seção, ordem e layout;
- melhorar seleção de indicadores e feedback de compatibilidade;
- dar ao preview fidelidade e destaque suficientes para orientar a edição;
- reduzir fricção em adicionar, remover, duplicar e reordenar elementos — hoje adicionar, remover
  e reordenar (setas para cima/baixo) existem para filtros, seções e componentes, e duplicar
  existe apenas no nível de painel, na listagem do admin;
- apresentar estados vazios, erros e confirmações de forma compreensível;
- preparar painéis e dados de exemplo que comuniquem bem o conceito.

## 3. Critérios de sucesso da validação

O conceito estará demonstrado quando, durante uma apresentação, for possível:

1. mostrar que Tema, Secretaria e ODS recortam o mesmo conjunto de painéis;
2. abrir um painel e chegar aos detalhes de seus indicadores;
3. criar um painel sem editar código;
4. escolher apenas componentes da biblioteca fixa;
5. organizar seções e componentes usando os layouts permitidos;
6. acompanhar o resultado no preview construído pelo renderizador real;
7. salvar e acessar imediatamente o painel na área pública;
8. reabrir o painel, editá-lo e demonstrar que a publicação foi atualizada;
9. explicar claramente quais comportamentos são reais e quais são simulados no protótipo.

## 4. Fora do escopo desta validação

Não são critérios de aceite do protótipo atual:

- autenticação, autorização e perfis de acesso;
- API, banco de dados, Fabric ou dados oficiais;
- publicação compartilhada entre usuários ou dispositivos;
- rascunho, aprovação, agendamento, versionamento e auditoria editorial;
- disponibilidade, escalabilidade, observabilidade e operação produtiva;
- construtor livre ou drag-and-drop;
- criação de novos tipos de componente pela interface;
- certificação formal de segurança, desempenho ou acessibilidade.

Esses itens continuam importantes para uma futura solução de produção, mas não devem distorcer a
avaliação do conceito que esta versão pretende apresentar.

## 5. Estado atual

| Capacidade                           | Estado      | Leitura                                                                                                                                                  |
| ------------------------------------ | ----------- | -------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Índice único de painéis              | Demonstrado | Home e Catálogo usam a mesma lista fornecida pelo `DataProvider`.                                                                                        |
| Lentes Tema, Secretaria e ODS        | Demonstrado | Recortes combináveis; seleção refletida na query string.                                                                                                 |
| Navegação painel → indicador         | Demonstrado | Cartões com `indicatorId` levam à página de metadados do indicador.                                                                                      |
| Biblioteca fixa                      | Demonstrado | Registry fechado com quatro tipos de componente.                                                                                                         |
| Posicionamento por regras            | Demonstrado | Seções ordenadas, componentes ordenados e quatro presets de layout.                                                                                      |
| Criação e edição na ferramenta       | Demonstrado | Formulário estruturado com validação contínua.                                                                                                           |
| Preview fiel à publicação            | Demonstrado | Preview e página pública reutilizam o `ConfigRenderer`.                                                                                                  |
| Publicação local imediata            | Demonstrado | O `PanelStore` atualiza catálogo e rota pública no mesmo navegador.                                                                                      |
| Catálogo de indicadores              | Demonstrado | Índice público em `/indicadores` e governança (uso, órfãos, referências quebradas) em `/admin/indicadores`, a partir de um registro único por indicador. |
| Cardápio de componentes              | Demonstrado | `/admin/componentes` documenta os quatro tipos com campos de configuração, exemplo e preview nos 4 estados de dado.                                      |
| Experiência pronta para apresentação | Em evolução | O fluxo funciona; clareza, ergonomia e acabamento do editor são o próximo foco.                                                                          |

Estado verificado em 05/08/2026 sobre a revisão `145e987`: 142 testes em 33 arquivos passando,
build de produção válido, lint sem erros. Os números completos e a dívida técnica estão em
[`relatorio-avaliacao-aplicacao.html`](relatorio-avaliacao-aplicacao.html); as divergências
apuradas entre documentação e código, em
[`discordancias-documentacao.md`](discordancias-documentacao.md).

## 6. Próxima etapa

O próximo ciclo deve tratar a área de configuração como o principal objeto de design do protótipo.
O objetivo não é ampliar a infraestrutura, mas chegar às telas e aos comportamentos necessários para
uma apresentação clara, fluida e convincente do conceito operacional.

> **ESTADO RESPONSIVO — 05/11/2026:** [`5ed489af`](https://github.com/tuliustsangaropulos/PortfolioTulius/commit/5ed489af5879589565cb0101e420065bfbf50552) ([Validate #42014122089](https://github.com/tuliustsangaropulos/PortfolioTulius/actions/runs/42014122089) **success**, Vercel `READY`) mantém uma experiência profissional ativa por vez no mobile, iniciando em Invest RS, com troca pelos seis logos; a faixa ganha fundo laranja **apenas quando realmente fixa** sob o header. A abertura mobile ajustou altura, dobra e botão inferior; o painel Perfil B retirou a lista repetida de experiências. Em **Olá**, o retrato customizado desktop usa `object-fit: contain` alinhado embaixo e a continuação mobile apresenta fundo escuro; em **Ferramentas**, espaçamentos móveis foram recalibrados. As 38 capturas do contrato antigo são histórico. **Contato:** alinhamento do último pixel opaco ainda sem aceite visual conclusivo. [Detalhes e limites](RECONCILIACAO_IMPLEMENTACAO_CHAT_2026-11-05.md).

> **P3 do SHA funcional `5ed489af`:** [Audit P3 #42014121880](https://github.com/tuliustsangaropulos/PortfolioTulius/actions/runs/42014121880) **failure global** em `Browser routes and responsive viewports` (7 falhas automatizadas; Perfil mobile a 320 px entre elas). Em subgates separados, `P6_PERFORMANCE_BUDGET PASS`: LCP mediano de 3 simulações mobile **3,372 s** sob a meta **≤3,5 s**; desktop **0,905 s**. P5 read-only **3/3**, P4 **38 capturas sem falha automática**. Esses resultados parciais não equivalem a P3 aprovado, p75 real ou aceite visual humano.

# Layout responsivo

## Contrato mobile atual — 01/11/2026

**Breakpoints:** mobile até 767 px, desktop a partir de 768 px. Nada de `zoom` global ou altura fixa que recorte conteúdo. Último código funcional auditado: [`aa71737e`](https://github.com/tuliustsangaropulos/PortfolioTulius/commit/aa71737e48834bb987c4a7cb6a3353ae1cf221fb); [P3 #41246204897](https://github.com/tuliustsangaropulos/PortfolioTulius/actions/runs/41246204897) possui **quatro falhas antigas de Contato**, embora a composição de 38 capturas (13 desktop/25 mobile) não apresente falha automatizada.

| Seção | Estrutura mobile verificada |
|---|---|
| 01 — Perfil | Painéis `perfil-a`/`perfil-b`: identidade, retrato, selo 360° e experiências/áreas em listas; seta para o segundo painel; largura 320–430 px testada |
| 02 — Olá! | `sobre-a` com **um** título e retrato ampliado; `sobre-b` com cinco diferenciais, sequência contínua |
| 03 — Resultados | `resultados-a`: seletor nativo acessível com seis opções e métricas em 2×2; em altura pequena cresce naturalmente |
| Formação | 3 registros acadêmicos e 2 idiomas, espaçamento compacto e subtítulo menor; painéis sem cortes |
| Ferramentas | 6 grupos CMS, ícones/textos alternados esquerda/direita, subtítulo redundante oculto, título principal intacto |
| Experiências | Seis logos sob o menu + identidade e abas sticky **limitadas por empresa**, com acordeão de projetos e imagem correspondente, trajetória integral; cabeçalho editorial não sticky até 620 px de altura; barra libera Ferramentas |
| Outras seções | Mesmos componentes/âmbitos do estado anterior; verificar especialmente a fotografia de Contato antes de declarar homologação P3 |

**Larguras cobertas pelos testes específicos:** 320×568, 360×740, 375×667, 390×844 e 430×932 px (Perfil também 414 px). Ver [testes](../scripts/p3-browser-smoke.mjs) e artefatos de [P3 #41246204897](https://github.com/tuliustsangaropulos/PortfolioTulius/actions/runs/41246204897).

A paridade visual desktop e a ausência de overflow foram verificadas por testes automatizados; não alegar equivalência pixel a pixel humana. A largura de 320 px pode produzir rolagem natural superior a 100svh. **Não reintroduzir painel interno com `overflow-y: auto` para comprimir conteúdo.**

---

> **Arquivo legado por assunto:** seções datadas abaixo registram decisões e medições de seus próprios SHAs; não as tratar como status operacional atual.

## Paridade mobile e critérios de aceite — revisão 31/10/2026

Breakpoints mobile nativos ≤767 px, sem `zoom`/`transform:scale()` no contêiner. O renderizador monta só a árvore mobile (25 painéis) ou desktop (13 seções). Em mobile, a seção 01 utiliza nome que quebra de linha conforme a largura, retrato à direita e selo/experiência separados. A seção Olá! deixa de forçar uma tela vazia; os dois painéis preservam todos os itens. Formação e Ferramentas deixam de repetir o `h2` no painel B, recebendo subtítulo semântico `h3` com conteúdo próprio, preservando 3+2 e 3+3 itens respectivamente.

A escala visual de `h2` mobile usa `--mobile-heading-size`; os cards de depoimentos aplicam três linhas recolhidas e expansão nativa por botão, mantendo o texto completo. Contato usa título no primeiro painel, retrato de proporção preservada alinhado à base e subtítulo `Canais de contato` no segundo. A foto e o Storage são originais.

**Evidência:** [P3 #41180490449](https://github.com/tuliustsangaropulos/PortfolioTulius/actions/runs/41180490449): largura documental idêntica à viewport nos 360/390/430 px; fontes dos títulos alinhadas, 1 `h2` por Formação/Ferramentas, cartões fechados 166/171/180 px, foto de Contato 573,9 px, nenhum erro de navegador; 38 capturas responsivas sem falhas. Lighthouse mobile continua com LCP 7,704 s e precisa de melhoria independente.

## Navegação sincronizada dos projetos em desktop e mobile — 31/10/2026

A galeria e a lista `Projetos e realizações` usam um único estado React para o slide ativo, por empresa. Selecionar um item altera a imagem e o título em destaque; avançar/retroceder nas setas ou indicadores atualiza a borda/cor laranja do item. No mobile, a lista e a galeria ocupam painéis distintos, mas permanecem sincronizados; não é criada nova árvore React nem rolagem de página forçada. O conteúdo clicável usa botões e indicadores acessíveis; `Trajetória` preserva a troca de abas. [CI funcional](https://github.com/tuliustsangaropulos/PortfolioTulius/actions/runs/41178735173).

## Experiências — botões de visualização e tags — 31/10/2026

No desktop, `.experience-projects` mantém limite de altura com rolagem interna quando a trajetória longa é selecionada; os controles `Projetos e realizações` / `Trajetória` ficam sticky no topo dessa área, com seleção exclusiva. No mobile, os controles e conteúdos acompanham a página sem rolagem interna obrigatória; as competências existentes fluem em linhas de badges sob o período, sem largura fixa. A mídia conceitual 1200×1350 é enquadrada pela moldura responsiva existente, sem textos desenhados no SVG; títulos, legendas e indicadores continuam acessíveis externamente. Não usar `zoom` ou `transform:scale()` global na aplicação.

## Complemento — CMS administrativo em mobile/tablet (30/10/2026)

**Escopo somente administrativo:** a interface `/admin` foi adaptada por CSS para ≤1100px com faixa de navegação superior sticky e rolável, mantendo a seleção e o aviso de conteúdo não salvo. Até 767px, formulários, métricas, experiências, acervo, revisões e blocos usam colunas fluidas; as grades de mídia se adaptam para duas colunas e, até 380px, uma. Controles de ordem ampliados para área mínima de toque 44px, modal de confirmação e toast acomodam a viewport e safe areas, e inputs de texto usam 16px no iOS. A prévia mobile preserva largura disponível. Zoom nativo continua sob controle do navegador, sem `zoom` global.

**Validação:** [CI Validate #41140863031](https://github.com/tuliustsangaropulos/PortfolioTulius/actions/runs/41140863031), [commit `f2f8e4f`](https://github.com/tuliustsangaropulos/PortfolioTulius/commit/f2f8e4fe7a54e371a96ceff546b711ca5b0bcd19). Teste estático da responsividade administrativa PASS; a inspeção manual anterior foi concluída segundo o proprietário, mas os novos breakpoints do admin ainda não foram inspecionados em sessão autenticada após este commit. P3 público [#41140863050](https://github.com/tuliustsangaropulos/PortfolioTulius/actions/runs/41140863050) passou em integridade 13/25/38 e falhou somente no LCP mobile ~7,66s.



## Referência desktop vigente — 29/10/2026 (substitui a referência histórica de 125%)

**Solicitação mais recente:** em 1512×691 px de área útil, a captura de navegador a **75%** é a composição desejada **com o navegador em 100%**. Os ajustes anteriores que usavam a captura a 125% como referência ficam **históricos/superados**. Nunca reproduzir a densidade por `zoom`, `transform:scale()` no contêiner raiz, alteração global do `html` ou cálculo de escala baseado em `vw` aplicado à página inteira.

A correção [`90975ca`](https://github.com/tuliustsangaropulos/PortfolioTulius/commit/90975ca6fea36095920eaccd0344aab4a2ad3cde) calibra apenas **tipografia secundária, espaçamentos de cards, ritmos verticais e altura do cabeçalho** dentro de `@media (min-width: 1101px)`. A foto, largura das duas colunas, título principal e selo circular mantêm a geometria original, com pequeno deslocamento local do selo para eliminar colisão com o texto. O `--header` reduzido é restrito à página pública em desktop largo; admin, mobile e dados Supabase não mudaram.

**Evidências automatizadas:** [CI #40806132618](https://github.com/tuliustsangaropulos/PortfolioTulius/actions/runs/40806132618) `success`; [P3 #40806132632](https://github.com/tuliustsangaropulos/PortfolioTulius/actions/runs/40806132632) `success`, Vercel Production `READY` no mesmo SHA funcional. No viewport de referência **1512×691, escala nativa 1**, o teste `P3_DESKTOP_DENSITY` registrou `headerHeight=54`, `nameTop=66`, `nameFontPx=85`, `cardsTop=199`, `cardsBottom=279`, `finalHighlightBottom=669.2`, `badgeYearsOverlapPx2=0`. Navegador `failures=0`, 13 seções, 25 painéis mobile, 38 capturas editoriais sem falhas e P5 público 3/3 sem mutações. Medianas Lighthouse: mobile Performance **83**, LCP **4,30 s** (meta ≤2,5 s ainda pendente); desktop Performance **97**, LCP **1,17 s**.

**Prevenção:** `src/lib/layout-zoom.test.ts` continua proibindo zoom global; o P3 agora mede as posições da primeira dobra em 1512×691, além de 12 outras resoluções, exige o último destaque visível e detecta interseção do selo com a descrição. Esses testes não substituem a confirmação visual do proprietário em seu navegador físico; **somente o aceite estético da nova composição fica aguardando inspeção**.


## Contrato público vigente — 26/10/2026

O banco preserva os registros editoriais originais, mas a seção `competencias` (antiga seção 04) está **oculta** (`is_visible=false`); são **13 seções públicas**. A seção `resultados` (seção 03) utiliza **um** painel mobile interativo; as outras 12 seções públicas utilizam dois. Portanto, o contrato de renderização esperado é **13 seções desktop + 25 painéis mobile = 38 capturas editoriais** no teste P4, e não mais 14/28/42. Esta contagem corresponde à estrutura publicada no Supabase, não à exclusão física da seção 04.

## Desktop e tablet (a partir de 768 px)

Cada seção conserva sua composição editorial com `min-height: 100svh` e overflow apropriado ao conteúdo; a seção 01 mantém o split grafite/branco e as áreas de especialidade/experiência. Resultados apresenta visão geral de quatro métricas com ícones e cinco opções temáticas interativas. Formação e Ferramentas utilizam o tema `ink`.

As seis empresas (Invest RS, Prefeitura de São Paulo, Vale, TV Globo/SporTV, Grupo InPress, CDI Comunicação) são apresentadas por `ExperienceStack`: painéis brancos sobrepostos com `position: sticky`, `top: 0` e `z-index` crescente. A barra de seleção das seis empresas é sticky abaixo do cabeçalho global; a coluna direita de cada experiência contém uma galeria de projetos, que apresenta título e estado de mídia pendente até a inclusão de fotos autorizadas no CMS.

## Mobile (até 767 px)

A abertura preserva dois painéis: o primeiro com perfil/fotografia/marcadores, o segundo com cinco especialidades e seis organizações. A seção 02 mostra foto com o primeiro item textual do painel B no painel A; os demais textos ficam no painel B. A seção 03 usa **um** painel mobile com seletor de temas, indicadores e dossiês.

Para as seis experiências profissionais, a barra de empresas continua fixa e horizontalmente rolável, mas os **cards deixam de ser sticky** (`position: relative`) para não cobrir a galeria da empresa anterior quando o conteúdo exceder a altura da viewport. A sobreposição pedida pelo proprietário é preservada no desktop/tablet; a leitura mobile é sequencial e completa. A correção mobile foi registrada após auditoria visual e requer aceite em aparelho real.

Em Ferramentas, os ícones dos grupos são reposicionados junto aos títulos/textos com redução de escala em telas estreitas. Em Contato, os valores e links extensos respeitam a largura disponível.

## Rolagem, cabeçalho e verificação

A rolagem por snap é `scroll-snap-type: y proximity`, **não** `mandatory`; textos podem exceder a viewport. Respeitar safe areas, offset do header para âncoras, foco visível e `prefers-reduced-motion`. O menu lista somente as seções visíveis; os links dos seis empregadores na abertura devem navegar para seus próprios slugs.

Matriz de verificação: 1920×1080, 1440×900, 1366×768, 768 px, 390×844, 360×800, 320 px e zoom nativo de 200%. Os scripts `scripts/p3-browser-smoke.mjs` e `scripts/p4-visual-audit.mjs` documentam o contrato técnico. Executar inspeção manual adicional para interações e recortes que os testes automatizados não detectam.

## Verificação manual — escala visual desktop a 100% (28/10/2026)

**Achado do proprietário:** na mesma janela de navegador, a visualização a 100% cortava o quarto destaque da abertura, parte das seis experiências e a seta inferior. A captura do navegador a 75% é a **referência de composição desejada para 100%**, sem alterar conteúdo, identidade visual ou dados.

**Implementação restrita ao público desktop (largura ≥1101 px):** `src/index.css` define `--desktop-visual-scale` progressivo até aproximadamente 0,75 na largura da captura (1523 px), aplicado em `.public-site`. As alturas com `svh/dvh` são compensadas para manter painéis de janela inteira; margens e títulos em `vw` preservam as proporções físicas observadas no zoom real de 75%; a seção `perfil` não oculta conteúdo excedente. O modo compacto por `max-height` permanece para tablet (768–1100 px), enquanto o layout mobile até 767 px e o CMS administrativo não recebem esta escala.

**Regressão de teste corrigida:** a checagem P3 da barra sticky das seis experiências passou a comparar sua posição com a **borda inferior real do cabeçalho** (em vez do intervalo fixo de 65–90 px, anterior à mudança de escala). A funcionalidade de navegação não foi alterada para acomodar o teste.

**Evidências:** commits [`806031b`](https://github.com/tuliustsangaropulos/PortfolioTulius/commit/806031bfa868b048a4c6bfc695341afb5a9d4080), [`d8519b6`](https://github.com/tuliustsangaropulos/PortfolioTulius/commit/d8519b63863d349af44102c5e21be0cec69c9add) e [`fa6668d`](https://github.com/tuliustsangaropulos/PortfolioTulius/commit/fa6668d4d5d8043a08c2df6834ec415a5715249c). [CI Validate #40771741818](https://github.com/tuliustsangaropulos/PortfolioTulius/actions/runs/40771741818) **success**; [P3 #40771741839](https://github.com/tuliustsangaropulos/PortfolioTulius/actions/runs/40771741839) **success**, deployment Vercel `READY` do mesmo SHA antes das medições. **8/8 viewports sem overflow, 13 seções, 25 painéis mobile, 38 capturas, zero falhas de navegador/painéis; navegação sticky PASS.** Lighthouse mediano: mobile Performance 80/LCP 4,05 s e desktop Performance 98/LCP 1,01 s; a meta **LCP mobile ≤2,5 s continua pendente**.

**Aceite humano ainda necessário:** confirmar no navegador real, em zoom nativo de 100%, a equivalência visual com a captura de referência a 75%; verificar também tamanhos intermediários, telas curtas, zoom 200% e aparelhos físicos. Testes automatizados não constituem aprovação estética.

## Homologação manual — rodada de experiências, depoimentos, contato e menu (28/10/2026)

Em telas desktop, cada experiência mostra somente itens com `isHidden !== true`, com preferência editorial por até seis itens sem necessidade de barra vertical. O conteúdo oculto permanece preservado e reexibível pelo CMS, inclusive no mobile. A rolagem continua disponível quando a janela real não comporta seis itens sem perda de leitura.

Depoimentos desktop: grade com seis posições geométricas (3 × 2), cinco cartões quadrados iniciais e expansão que ocupa duas linhas de uma coluna. Layouts intermediários ajustam colunas e mobile mantém dois painéis com os mesmos cinco depoimentos. Contato desktop: chamada, imagem e links em três colunas, rodapé completo na borda inferior. Mobile mantém dois painéis com foto isolada e links/rodapé em fluxo. Menu lateral reduzido a oito entradas sem eliminar as 13 seções públicas; a barra das seis experiências continua navegável.

### Evidências finais da rodada manual

**Validação automatizada da rodada manual (28/10/2026):** [CI Validate #40773898800](https://github.com/tuliustsangaropulos/PortfolioTulius/actions/runs/40773898800) `success`; [Audit P3 #40773898835](https://github.com/tuliustsangaropulos/PortfolioTulius/actions/runs/40773898835) `success`, no SHA funcional [`faa43e2`](https://github.com/tuliustsangaropulos/PortfolioTulius/commit/faa43e2709bdcbe917e6e81bee2abb220dde5456) com Vercel Production `READY` antes da auditoria. Navegador: 13 seções, 25 painéis mobile, 8 viewports sem overflow, navegação sticky `PASS`, 38 capturas (13 desktop/25 mobile), zero falhas e zero painéis inadequados. P5 anônimo: 13 seções e 8 links de menu válidos, sem exposição de dados privados, `mutations=0`. O teste P4 reconhece a composição **intencionalmente fotográfica** de `contato/a` mobile somente quando a imagem existe e decodifica; todos os demais painéis mantêm critérios originais de conteúdo. Lighthouse mediano: mobile 75/LCP 4,69 s; desktop 94/LCP 1,56 s. Gate de regressão passou, mas LCP mobile ≤2,5 s **não está aprovado**. Aceite humano permanece aberto.

## Ajuste de enquadramento por dispositivo — 28/10/2026

As imagens de blocos, retratos de abertura, coluna de Contato, foto central de Olá!, logos e slides aceitam coordenadas opcionais por uso no JSONB. O renderer compõe com `object-position`, `transform: scale()` e `transform-origin` somente quando há uma configuração salva; conteúdo sem crop permanece no enquadramento anterior. O diálogo administrativo utiliza preview responsivo e proporção do destino. A configuração compartilha os dados do bloco entre desktop e mobile; ainda não oferece recortes independentes por breakpoint, exceto a imagem desktop própria de Olá!. Não duplicar nem apagar fotografias originais.

## Ajustes técnicos de baixo risco após o aceite manual — 28/10/2026

- **Visão geral CMS:** substituída a frase fixa das 14 seções/2 distribuições por contagem dinâmica de seções visíveis e cadastradas, e contador das `editorial_issues` efetivamente abertas. Não houve alteração de registros.
- **Depoimentos:** grade desktop passa a ter duas linhas uniformes e cartões quadrados, com expansão ocupando duas linhas. No mobile mantém-se uma coluna fluida. Textos e cinco registros publicados preservados.
- **Janela X/Y/zoom:** o diálogo agora recebe foco inicial, retém Tab/Shift+Tab, permite Escape e devolve o foco ao controle anterior ao fechar; o arquivo original e configurações preexistentes continuam intocados.
- **Carregamento público:** a consulta de depoimentos, única coleção atualmente vinculada no Supabase público, é iniciada em paralelo à consulta da estrutura de seções. Isso remove uma etapa sequencial de rede no carregamento inicial; não constitui por si só comprovação de LCP ≤2,5 s.
- **Aceite humano:** declarado concluído pelo proprietário nesta conversa. P2, direitos de mídias, riscos de segurança anteriormente aceitos, exclusões de Storage/branches, 8 ocorrências editoriais e reconciliação de Fontes ChatGPT seguem como decisões separadas.

## Correção estrutural de densidade desktop — 28/10/2026 (substitui o ajuste de 75%)

**Novo achado do proprietário:** o navegador em 100% mostrava a página excessivamente pequena; a composição desejada corresponde à captura obtida com navegador em 125%. O mecanismo anterior de 75% de densidade permanece documentado **acima como histórico, não como regra vigente**.

**Causa e remoção:** o código usava `zoom: var(--desktop-visual-scale)` em `.public-site`, com uma escala variável entre 75% e 100% em função de `100vw`. O zoom do navegador altera o viewport CSS e, consequentemente, o próprio valor calculado dessa escala, amplificando o efeito. Foram removidos a redução global, a variável `--desktop-visual-scale` e **todas** as compensações dependentes de `svh/dvh/vw` ligadas a ela, incluindo depoimentos e Contato. Preservou-se o ajuste independente de conteúdo longo na seção 01: `overflow:visible` e `min-height:100dvh` no desktop largo.

**Novo contrato:** o aplicativo público não força `zoom` ou `transform:scale()` no contêiner. O navegador em 100% exibe o CSS responsivo nativo; o zoom em 125% e 200% é controlado exclusivamente pelo usuário, com passagem natural pelos breakpoints. As fontes, os tokens de identidade, o conteúdo editorial, o layout mobile e o CMS não foram modificados.

**Prevenção de regressão:** teste unitário `src/lib/layout-zoom.test.ts` impede a reintrodução de zoom global/variável de compensação. O smoke P3 verifica o `getComputedStyle(.public-site).zoom === 1` e a ausência de transform no site, com viewports de 1920, 1757, 1440, 1366, 1200, 1101, 1100, tablet, simulador de 200% e mobile. A igualdade visual com a referência de 125% deve ser confirmada na mesma área útil em pixels físicos; diferenças de renderização entre SO/navegadores são esperadas.

**Limites:** testes por mudança de viewport não simulam *verdadeiro* zoom nativo do navegador; a validação humana desses detalhes permanece baseada nos anexos da conversa. Este ajuste é estritamente do CSS público, sem gravação ou migração no Supabase. O P2 transacional e a meta LCP mobile são independentes.

### Evidências do ajuste nativo de escala — Auditoria 28/10/2026

**SHA funcional** [`8a45e9b`](https://github.com/tuliustsangaropulos/PortfolioTulius/commit/8a45e9bc0663ee15e9b0797785900308f6622712), [CI Validate #40794804474](https://github.com/tuliustsangaropulos/PortfolioTulius/actions/runs/40794804474) **success**, [P3 Lighthouse + browser #40794804504](https://github.com/tuliustsangaropulos/PortfolioTulius/actions/runs/40794804504) **success** e Vercel Production `READY` no mesmo SHA previamente à auditoria.

**Novos testes do contrato de escala:** 12/12 viewports (1920×1080, 1757×832, 1440×900, 1366×768, 1200×800, 1101×800, 1100×800, 768×1024, 720×450, 390×844, 360×800, 320×700) registraram `getComputedStyle(.public-site).zoom === "1"`, `transform === "none"` e `overflowPx=0`. A passagem de 1101 para 1100 px não altera artificialmente a escala (fonte da marca: 61,656 px e 61,6 px, respectivamente). **13 seções**, **25 painéis mobile**, **38 capturas editoriais**, **nenhum erro** de navegador ou painel; 6 experiências e galeria navegáveis. P5 público anônimo 3/3 e `mutations=0`.

**Performance (mediana de 3 execuções Lighthouse)**: mobile Performance **78**, LCP **4,36 s**, desktop Performance **97**, LCP **1,09 s**. O gate de regressão foi aprovado, porém **LCP mobile ≤2,5 s não foi atingido**. Alteração de zoom não constitui intervenção em performance mobile. O teste em 720 px é uma simulação por largura de viewport e **não** comprova zoom nativo de 200% em todos os navegadores.

O mecanismo global anterior deve permanecer **proibido** pelo teste `src/lib/layout-zoom.test.ts` e pela checagem de estilo calculado `P3_VIEWPORT`; correções futuras de tipografia/densidade devem ser locais e responsivas, sem novo percentual de zoom CSS.

### Continuidade após a última auditoria de zoom

O proprietário solicitou que a aparência atual a 100% reproduzisse a referência antes observada a 125%. **Corrigida a causa técnica** (sem zoom CSS global e sem compensações progressivas) e aprovada a auditoria P3 do SHA funcional `8a45e9b`: 12 resoluções, 0 overflow, 13 seções, 25 painéis e 38 capturas. A correspondência estética exata da nova referência em navegador físico ainda não foi confirmada por mensagem posterior. O aceite manual anterior para as demais áreas permanece válido. Mais contexto: [continuidade do chat](CONTINUIDADE_CHAT_MANUAL_ZOOM_E_FONTES_2026-10-28.md).

## Refinamento tipográfico pontual da primeira seção — 29/10/2026

**Pedido atendido:** melhorar a legibilidade dos textos menores, o ritmo dos quatro destaques laterais e a numeração dos cinco cards da abertura, **sem alterar a composição editorial aprovada**. A intervenção está estritamente localizada no CSS `@media (min-width: 1101px)`: mantém a divisão das colunas, retrato, selo 360°, título principal, paleta, conteúdo, foto e layout mobile.

- Legibilidade: descrições das experiências e dos destaques laterais agora têm ao menos **11,52 px** no viewport de referência; frase em itálico **12,64 px**; títulos dos destaques com incremento discreto.
- Competências: numeração laranja dos cinco cards em **9,76 px**, mantendo fundo, posição, links e contraste.
- Compensação de microespaçamentos na coluna esquerda (gap entre introdução e lista, gap dos destaques e padding dos itens) para não empurrar `IDIOMAS` para fora da primeira dobra.
- **Proibida a reintrodução de zoom/transform global.** O tamanho do título principal, o selo e a fotografia não mudaram.

**Evidência do SHA funcional:** [`c098a60`](https://github.com/tuliustsangaropulos/PortfolioTulius/commit/c098a60d306601ac7d2e8e24ba41be80891832fd), [CI #40807420317](https://github.com/tuliustsangaropulos/PortfolioTulius/actions/runs/40807420317) **success** e [P3 #40807420323](https://github.com/tuliustsangaropulos/PortfolioTulius/actions/runs/40807420323) **success**. No viewport **1512×691**, com escala CSS nativa 1: cabeçalho 54 px; título a 66 px; cards de 199 a 281 px; último destaque termina em 669,39 px; **sobreposição selo/anos = 0 px²**. P3: **13 seções, 25 painéis mobile, 38 capturas, 0 falhas e P5 anônimo 3/3 sem mutações**. Lighthouse mediano: mobile Performance 82, **LCP 4,45 s** (meta ≤2,5 s **ainda não atendida**); desktop Performance 98, LCP 1,15 s. Nenhuma mudança Supabase, Storage, CMS, migração, token ou custo.

A referência visual de densidade continua sendo a **última captura fornecida com o navegador a 75%, desejada a 100%**; as referências antigas ficam como histórico. A comparação estética final em navegador físico fica a critério do proprietário, sem reabrir aceites anteriores.

## Menu público sem grupos — compactação final (29/10/2026)

**Solicitação do proprietário:** manter as oito opções integralmente visíveis, evitando rolagem vertical nas alturas usuais; remover da navegação pública os subtítulos `PERFIL`, `EXPERIÊNCIA`, `REFERÊNCIAS` e a assinatura `Comunicação · Estratégia · Reputação`. Não modificar nomes, ordem, numeração nem âncoras dos oito links.

**Implementação:** `src/components/public/Navigation.tsx` não renderiza títulos de grupo nem a assinatura estática. `src/index.css` usa espaçamento compacto e linhas com `grid-auto-rows: clamp(44px, 9dvh, 72px)`; todos os alvos têm altura mínima de 44 px. A rolagem permanece apenas como fallback para zoom de acessibilidade, excesso futuro de itens ou viewport excepcionalmente baixo. Menu responsivo sem `zoom` CSS ou mudanças na identidade visual.

**Admin:** `NavigationStudio` remove o campo de grupos, mantém rótulo, âncora, status, visibilidade, reordenação e salvar. Novos registros e gravações posteriores usam `group_name='Menu'` por compatibilidade com a coluna existente. **Supabase:** os 14 registros da tabela `public.navigation_items` foram atualizados apenas no campo `group_name` de Perfil/Experiência/Referências para `Menu`, transação com guardas de 14 totais e 8 visíveis. Conferência após atualização: **14 registrados, 8 visíveis, 6 ocultos, grupo único Menu**. Sem DDL, alterações RLS, exclusões, mudança de textos/âncoras, custos ou migrações; a frase final era hardcoded, não existia em `site_settings`.

**Evidência:** commit funcional [`bfd3f7e`](https://github.com/tuliustsangaropulos/PortfolioTulius/commit/bfd3f7e25b03dc6fa0e647f44eb1f3bb92905f96) com formatação no [`0e06df6`](https://github.com/tuliustsangaropulos/PortfolioTulius/commit/0e06df6c031e01da3bf9453f8a6246d1f80409b1), [CI #40810591049](https://github.com/tuliustsangaropulos/PortfolioTulius/actions/runs/40810591049) **success** e [P3 #40810488285](https://github.com/tuliustsangaropulos/PortfolioTulius/actions/runs/40810488285) **success**. Teste `P3_MENU_FIT_MOBILE` em **390×844**: 8 links, grupos 0, footer ausente, `scrollHeight=clientHeight=844`, último link até y=662,09. Teste `P3_MENU_FIT_DESKTOP` em **1512×691**: 8 links, grupos 0, footer ausente, `scrollHeight=clientHeight=691`, último link até y=573,58. P3: **0 falhas**, 13 seções, 25 painéis mobile, 38 capturas, P5 anônimo 3/3, zero mutações. Mobile Lighthouse Performance 82, LCP **4,44 s**, meta ≤2,5 s ainda aberta; desktop LCP **1,18 s**.

**Prevenção:** os testes P3 agora verificam número de links, ausência de grupos/rodapé, ausência de rolagem interna e visibilidade do último link, além de foco e Escape. A frente de P2 transacional segue suspensa; não equiparar o teste de leitura pública à homologação de escrita CMS com JWT real.

## Verificação manual — Olá! e Invest RS, 29/10/2026

- **Seção 02 “Olá!” (somente desktop):** para que a silhueta da fotografia personalizada alcance a margem inferior do painel, `src/index.css` compensou a faixa transparente inferior da imagem com altura `calc(100% + clamp(2rem, 5.5dvh, 3rem))`, posicionada no topo e recortada pelo contêiner existente. Mantidos fonte original no Supabase, enquadramento do CMS, colunas, textos, cor laranja e composição mobile. Sem zoom/scale global.
- **Logos das experiências:** a borda e o preenchimento cinza foram retirados somente de `.experience-heading > .company-mark` (logo acima do título da empresa). Os seis ícones do seletor superior mantêm bordas, tamanho, links e navegação.
- **Invest RS:** de oito itens cadastrados, ficam **quatro visíveis** (Competências aplicadas; Guia de Boas-Vindas; Organização de eventos; Plataforma de eventos e relacionamento) e **quatro marcados `isHidden=true`** (Estratégia de CRM e mailing institucional; Cartões de visita digitais; Conteúdo e apresentações institucionais; Inovação, IA e automação). Os dois últimos já estavam ocultos. Nenhum texto, registro, bloco ou slide foi excluído ou alterado. A alteração foi transacionada no JSONB do bloco B `222cc514-c860-4ec4-bc01-40a9084dc2e9` com guardas de título e estado anterior, e conferida em leitura posterior. O painel **Blocos** continua com a opção “Exibir este item em Projetos e realizações” e indica “Ocultado”. O conteúdo de fallback foi alinhado com a publicação; outras cinco empresas mantidas.
- **Critério de regressão:** `scripts/p3-browser-smoke.mjs` ganhou `P3_ABOUT_INVEST_FIT` para 1512×691, zoom nativo: altura/recorte da foto desktop, borda inexistente do logo grande, borda preservada na navegação superior, exatamente quatro projetos Invest RS e ausência de scroll interno. Aferir junto à auditoria P3; teste automatizado não substitui inspeção visual real.

**Commit funcional:** [`d882d7a`](https://github.com/tuliustsangaropulos/PortfolioTulius/commit/d882d7a71ff45e0d6980cf85fbcaa6533f0f89db). [CI #40815457072](https://github.com/tuliustsangaropulos/PortfolioTulius/actions/runs/40815457072) `success`, Vercel Production `READY`; [P3 #40815457107](https://github.com/tuliustsangaropulos/PortfolioTulius/actions/runs/40815457107) em execução na criação deste registro. P2 transacional continua suspenso e LCP mobile ≤2,5s permanece pendente. Não houve custo adicional, mudança de RLS, Storage, arquivo de mídia ou estrutura do banco.

### Evidência final adicional: auditoria P3 #40815457107 — 29/10/2026

No SHA funcional `d882d7a` (mesmo código público da documentação `cce4869`), o navegador automatizado mediu `P3_ABOUT_INVEST_FIT`: `aboutBottom=1382`, `portraitBottom=1420` (38 px extras recortados ao fim), `count=4`, `listHeight=422`, `listScrollHeight=422` (nenhuma rolagem no painel Invest RS), `headingLogoBorder=0px`, `indexLogoBorder=1px`. `P3_BROWSER_AUDIT failures=0`, `P5_PUBLIC_RESULT passed=3/3 mutations=0` e `P4_EDITORIAL_SUMMARY captures=38 failures=0`. O site mostrou `publicSections=13`, `portraitComplete=true`.

**Importante: o job P3 final tem resultado global `failure` por falha de integração de status, não por falha funcional:** o gate `Confirm Vercel production deployment status for audit SHA` consultou 30 vezes o status de commit com contexto `Vercel` e recebeu `missing`, mesmo havendo deployment `READY` confirmado diretamente pelo conector Vercel. Como Lighthouse dependia desse gate, as seis amostras não foram produzidas e o gate P6 reportou `missing sample`. Não afirmar aprovação da auditoria completa nem inferir mudança de LCP com base nessa execução. A meta LCP mobile ≤2,5 s e o ajuste do gate GitHub↔Vercel seguem como **pendências independentes**, sem suspender o sucesso dos testes funcionais de layout.

[Execução P3](https://github.com/tuliustsangaropulos/PortfolioTulius/actions/runs/40815457107) · [CI funcional](https://github.com/tuliustsangaropulos/PortfolioTulius/actions/runs/40815457072) · [Deployment funcional READY](https://vercel.com/tuliustsangaropulos-creates-projects/portfolio-tulius/CW4JH4aXUtmCGW3Hx6Gi5Phvrs34).


## Otimização responsiva do retrato (31/10/2026)

Abertura pública usa `picture` com `/media/tulius-site-600.webp` e `/media/tulius-site-900.webp`, exclusivamente para a URL do PNG aprovado. Arquivos provenientes do mesmo SHA-256 e renderização preservada. A inspeção automatizada [P3 #41170190190](https://github.com/tuliustsangaropulos/PortfolioTulius/actions/runs/41170190190) aprovou 13/25/38 e o conteúdo LCP do retrato; LCP mobile 7,797s permanece reprovado.

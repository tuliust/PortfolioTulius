# Testes, CI e homologação
**Status:** roteiro de manutenção e aceite editorial · **Revisão:** 16/11/2026. Código funcional da revisão `aeffc5f` (Validate SUCCESS; P3 #43842659962 FAILURE), com commit documental anterior `ad5863c` (Validate/Export SUCCESS; Vercel READY). Aceite do proprietário não reclassifica resultado técnico; relatórios históricos continuam vinculados aos respectivos SHAs.

## Resultado final desta auditoria P3 — 16/11/2026

No SHA [`8ed19b0`](https://github.com/tuliust/PortfolioTulius/commit/8ed19b098349e882f7c7dbb9b926114b6451e17e), [P3 #43846278955](https://github.com/tuliust/PortfolioTulius/actions/runs/43846278955) confirmou **navegador/responsividade PASS (0 falhas)** após corrigir as duas assertivas obsoletas de quatro para **cinco projetos**, e **38 capturas PASS**, projeto ↔ galeria, troca Trajetória/Projetos, rotas admin anônimas, SEO, RLS e tolerância parcial de leitura pública. O marcador `P3_DEPLOYMENT_GATE` confirmou o SHA servido em produção. Entretanto, **P3 global = FAILURE exclusivamente no orçamento mobile**: LCP mediano **3.649,202 ms** (meta **≤3.500 ms**); desktop **895,144 ms** (PASS). [Validate #43846279093](https://github.com/tuliust/PortfolioTulius/actions/runs/43846279093) e [Export Docs #43846279061](https://github.com/tuliust/PortfolioTulius/actions/runs/43846279061) foram **SUCCESS**; Vercel production `dpl_9Ti9ghY6ZC6tJ2DbCmT6Wg9L8XUm` estava **READY**. O proprietário **encerrou a revisão editorial** e aceitou o risco residual, sem considerar o LCP corrigido nem reclassificar o workflow como SUCCESS. Não houve mudança de Hero, Olá, conteúdo público ou banco nesta correção de teste.

**Separação de evidências:** `P3_BROWSER_AUDIT {\"failures\":0}`; `P4_EDITORIAL_SUMMARY {\"captures\":38,\"failures\":0}`; `P5_PUBLIC_RLS {\"result\":\"PASS\"}`; `P6_PERFORMANCE_BUDGET mobile {\"result\":\"FAIL\",\"lcpMs\":3649.202}`. A única etapa do job P3 em FAILURE foi `Enforce conservative P6 Lighthouse regression budgets`; o browser não falhou no novo SHA. O risco aceito não altera a meta. Ensaio autenticado integral do CMS sintético não executado; não criar resultado retrospectivo. Os quadros anteriores relatam seus próprios SHAs.

## Fotografia anterior à revisão de Experiências — Resultados (16/11/2026)

A última P3 **funcional** disponível é [#43817188772](https://github.com/tuliust/PortfolioTulius/actions/runs/43817188772), SHA `9915964`, com **SUCCESS** em navegação, cinco temas compactos, SEO/RLS e LCP mobile mediano **3.458,135 ms** (limite 3.500 ms). Houve falhas em SHAs anteriores; consultar o [quadro por commit](#seção-03--implantação-auditorias-e-lições-de-16112026) antes de avaliar regressões.

O commit posterior [`06af944`](https://github.com/tuliust/PortfolioTulius/commit/06af9444955297a6ee93c9934b369598198afd69), **somente documental**, passou em Validate e Export Docs e recebeu status GitHub `Vercel: success`, **sem P3 própria**. P5 read-only e transacional sintético têm evidência em SHA anterior; não afirmar cobertura autenticada do salvamento dos 20 indicadores em `9915964`.

## Auditoria global do P3 e correção de contrato do teste — 16/11/2026

O [P3 #43842659962](https://github.com/tuliust/PortfolioTulius/actions/runs/43842659962) do código funcional `aeffc5f` terminou **FAILURE** nas etapas **Browser routes and responsive viewports** e **Enforce conservative P6 Lighthouse regression budgets**. O script `scripts/p3-browser-smoke.mjs` imprimiu `P3_BROWSER_AUDIT {"failures":2}`; as duas falhas identificáveis são `P3_ABOUT_INVEST_FIT_REGRESSION` e `P3_EXPERIENCE_SWITCH_REGRESSION`, ambas porque ainda exigiam **4** projetos em Invest RS quando a regra editorial vigente e verificada no banco é **5**. Os asserts foram atualizados para cinco, sem modificação do renderer, CSS, conteúdo público ou imagens. Isso **corrige o teste**, não converte o P3 anterior em sucesso.

Na mesma execução foram **PASS**: teste projeto→galeria→projeto, proteção de `/admin` e `/admin/preview`, navegação entre seis empresas, seletor dos cinco temas de Resultados, 38 capturas editoriais (`P4_EDITORIAL_SUMMARY failures=0`), testes RLS anônimos e verificações SEO/read-only. A etapa de **performance P6 permanece FAILURE**, pois o LCP mobile mediano foi **3.609,314 ms** (orçamento **≤3.500 ms**), com mediana desktop **921,675 ms** (PASS).

**Aceite do proprietário:** revisão editorial e validação funcional declaradas concluídas para este escopo, com o risco P3 conhecido **aceito, não corrigido**. Não reabrir Hero/Olá, reduzir orçamento LCP ou executar o backlog por inferência. Teste completo autenticado de edição→salvamento→releitura pelo CMS com seed sintética **não executado** nesta rodada; não converter o aceite em teste técnico. Conferir novos resultados por SHA de cada execução. [Estado atual](../01-projeto/ESTADO_ATUAL.md) · [Standby](../06-governanca/BACKLOG_STANDBY.md).

## Desenvolvimento local
`pnpm install --frozen-lockfile`; `pnpm format:check`; `pnpm typecheck`; `pnpm test`; `pnpm build`; `pnpm check`; `pnpm smoke:build`. O [`package.json`](../../package.json) é fonte dos comandos. Não usar formatador que reescreva código para uma tarefa só documental.

## Seis workflows operacionais e cinco arquivados

Os seis primeiros seguem em `.github/workflows/`. Os cinco seguintes foram **retirados da execução em 11/11/2026** e apontam para cópias históricas (não são acionáveis no GitHub Actions). [Registro de retirada](../historico/workflows-retirados-2026-11-11/README.md).
| Workflow | Papel |
|---|---|
| [`validate.yml`](../../.github/workflows/validate.yml) | Format, TS, testes, build e smoke |
| [`audit-p3-lighthouse.yml`](../../.github/workflows/audit-p3-lighthouse.yml) | Browser, capturas, SEO, RLS e Lighthouse |
| [`p5-admin-readonly.yml`](../../.github/workflows/p5-admin-readonly.yml) | Login CMS sem escrever dados reais |
| [`p5-local-transactional.yml`](../../.github/workflows/p5-local-transactional.yml) | Auth/RPC/Storage sintéticos isolados |
| [`hygiene-audit.yml`](../../.github/workflows/hygiene-audit.yml) | Verificações offline |
| [`export-docs-snapshot.yml`](../../.github/workflows/export-docs-snapshot.yml) | Exportar documentos |
| [`p1-p3-isolated-preview.yml`](../historico/workflows-retirados-2026-11-11/p1-p3-isolated-preview.yml) | Prévia/editorial isolada |
| [`p2-transactional-staging.yml`](../historico/workflows-retirados-2026-11-11/p2-transactional-staging.yml) | Staging cloud manual antigo, não executar por inferência |
| [`publish-experience-media-once.yml`](../historico/workflows-retirados-2026-11-11/publish-experience-media-once.yml) | Publicação pontual com escrita |
| [`cdi-slide-remove-text.yml`](../historico/workflows-retirados-2026-11-11/cdi-slide-remove-text.yml) | Correção pontual de mídias |
| [`generate-approved-hero.yml`](../historico/workflows-retirados-2026-11-11/generate-approved-hero.yml) | Geração de assets |

**Baseline `0627947`:** [Validate #43091103353](https://github.com/tuliustsangaropulos/PortfolioTulius/actions/runs/43091103353), [P5 Admin #43091105469](https://github.com/tuliustsangaropulos/PortfolioTulius/actions/runs/43091105469), [P5 Local #43091105553](https://github.com/tuliustsangaropulos/PortfolioTulius/actions/runs/43091105553), [Export #43091105486](https://github.com/tuliustsangaropulos/PortfolioTulius/actions/runs/43091105486) SUCCESS. [P3 #43091103365](https://github.com/tuliustsangaropulos/PortfolioTulius/actions/runs/43091103365) FAILURE apenas no LCP mobile (mediana **3.627,065 ms** contra 3.500), desktop 893,194 ms, demais checks PASS. Risco aceito sem relaxar o gate.

## Verificação mobile após a mudança editorial de 11/11/2026

O `scripts/p3-browser-smoke.mjs` valida, de 320 a 430 px, que o selo existe **somente no painel B do Perfil**, acima do título “Áreas de Atuação”, e que o botão para avançar está abaixo da fotografia. As verificações anteriores que procuravam o selo no painel A foram atualizadas. As regressões desktop seguem cobertas pelo mesmo fluxo. O LCP mobile conserva o limite de mediana `≤3.500 ms` (três coletas): não afrouxar o gate para transformar em aprovação um resultado acima do orçamento.


## Homologação do ciclo mobile de 11/11/2026

**Commit funcional e teste responsivo:** [`deb5c264`](https://github.com/tuliustsangaropulos/PortfolioTulius/commit/deb5c264d34865f0511c5c7d91c9d6b6a32db1af), sobre a implementação [`cc570bd`](https://github.com/tuliustsangaropulos/PortfolioTulius/commit/cc570bd066003950da0e7b27187e0d1dfb5ce6bc) e ajustes de testes [`2579a2d`](https://github.com/tuliustsangaropulos/PortfolioTulius/commit/2579a2da75bdc21ffa23f6763371736a02a40597).

- [Validate #43135629576](https://github.com/tuliustsangaropulos/PortfolioTulius/actions/runs/43135629576): **SUCCESS** (format, TypeScript, testes, build e smoke).
- [P3 Lighthouse #43135629523](https://github.com/tuliustsangaropulos/PortfolioTulius/actions/runs/43135629523): **SUCCESS**, com browser e âncoras mobile, seis viewports de abertura (**320×568 a 430×932**), **38 capturas** (13 desktop/25 mobile), regressão RLS/leitura pública e paridade SEO aprovadas.
- P6 no mesmo run: LCP mobile mediano de três coletas **3.481,022 ms** (limite **≤3.500 ms**, **PASS**), desktop **993,549 ms** (**PASS**); faixa mobile próxima do orçamento, manter monitoramento apenas sob nova demanda.
- [P5 Admin read-only #43135186239](https://github.com/tuliustsangaropulos/PortfolioTulius/actions/runs/43135186239): **SUCCESS** no SHA `2579a2d`, que contém a mesma implementação de UI/CMS; a alteração subsequente a esse SHA foi só de teste browser/documentação.
- Supabase produção `portfolio`: após a intervenção, foi relido o mesmo registro `perfil`/bloco A; `hero.mobileEditorial.middle.background=#FAFAFA` e `textColor=#FF5414`, sem mudança de schema, RLS ou dados compartilhados com desktop.
- Vercel: deployment Production **READY** para `deb5c264`. O teste automatizado não substitui homologação subjetiva de composição em um dispositivo físico real.

**Registro histórico do primeiro ensaio:** [P3 #43134949875](https://github.com/tuliustsangaropulos/PortfolioTulius/actions/runs/43134949875) falhou por um teste antigo que ainda buscava o selo no painel A e por LCP mobile **3.593,519 ms**. O contrato de teste foi corrigido para validar o selo no B e o fluxo foi repetido no SHA `deb5c264` com sucesso; não reclassificar o ensaio anterior como PASS.


## Após mudança futura
Testar desktop/mobile/teclado/zoom; CMS `editar → salvar → reler → DB → renderer` em ambiente local sintético; autorização de não admin; Storage/alt; SEO em novo build. Registrar SHA, ambiente, método e resultado real. Resultados de outro commit não contam.

[Estado](../01-projeto/ESTADO_ATUAL.md) · [backups](BACKUP_E_RECUPERACAO.md).

## Verificação da Etapa 05 (11/11/2026)

- `603fe3aa`: [Validate #43099272397](https://github.com/tuliustsangaropulos/PortfolioTulius/actions/runs/43099272397) **SUCCESS** e [Export Docs #43099272253](https://github.com/tuliustsangaropulos/PortfolioTulius/actions/runs/43099272253) **SUCCESS**.
- `c4bc83ce`: [P5 Local #43098792267](https://github.com/tuliustsangaropulos/PortfolioTulius/actions/runs/43098792267) **SUCCESS**; [P5 Admin Read-Only #43098792458](https://github.com/tuliustsangaropulos/PortfolioTulius/actions/runs/43098792458) **FAILURE**, timeout Puppeteer 18 s na suíte após verificações iniciais PASS; [P3 #43098792240](https://github.com/tuliustsangaropulos/PortfolioTulius/actions/runs/43098792240) **FAILURE**, mobile LCP mediano 3.546,641 ms > 3.500 ms.
- A falha read-only P5 **não foi diagnosticada nem aceita tecnicamente** como comportamento correto. O backlog documenta observação adicional sob nova demanda, sem execução automática.
- O último SHA de validação e exportação não acionou P3/P5; não proclamar CI integral verde para ele.

[Termo de encerramento](../06-governanca/ENCERRAMENTO_CONSOLIDACAO_2026-11-11.md).

## Ajustes mobile e favicon de 12/11/2026

**Implementação homologada:** `45c9f7868e5dd31ae0e231e48cbc3828d250d45a`, sobre os commits funcionais `8b29c78`, `144ae2f` e `1c341dd`. Escopo: retirada do aviso transitório de sincronização; favicon TT e ícone Apple, upload/seleção pelo admin SEO com persistência em `site_settings.seo_json.faviconUrl`; tipografia e fotografia na abertura mobile; separadores de Resultados; Formação; seleção e rolagem de projeto em Experiências; transição de Contato. Atualizações documentais em Responsividade, CMS, Modelo de Dados, Mídias e Vercel/SEO.

- [Validate #43151247434](https://github.com/tuliustsangaropulos/PortfolioTulius/actions/runs/43151247434): **SUCCESS** no SHA homologado — formatação, TypeScript, unitários, build, smoke offline e sintaxe das suítes browser.
- [P3 Lighthouse #43151247628](https://github.com/tuliustsangaropulos/PortfolioTulius/actions/runs/43151247628): **SUCCESS** no SHA homologado — browser/rotas/viewports (zero falhas), verificações de menu/âncora/seleção de projeto, **38 capturas editoriais** (13 desktop e 25 mobile, zero falhas), RLS público, falhas parciais de leitura, SEO e performance.
- LCP mediano de **três amostras** nesse P3: mobile **3.339,318 ms** (performance 90; limite 3.500 ms; **PASS**), desktop **969,969 ms** (performance 98; **PASS**). Resultado sintético sujeito a variabilidade, não um SLA real.
- [P5 Admin Read-Only #43150284881](https://github.com/tuliustsangaropulos/PortfolioTulius/actions/runs/43150284881): **SUCCESS** sobre `144ae2f`; as mudanças subsequentes foram apenas CSS da foto/escala do nome. **Não houve teste de escrita produtiva via interface administrativa**: a gestão do favicon utiliza upload na biblioteca e a RPC de SEO já existentes.
- Supabase produção: leitura após o `UPDATE` restrito confirmou `site_settings.seo_json.faviconUrl = /favicon.png`, `status=published` e `favicon_media_id=NULL`. Sem alteração de schema, RLS ou migrations.
- Vercel: deployment do commit `45c9f78` informado como **READY**, ID `dpl_J5xtCGkjcwF4TxbQuGXZFusoay1v`. Preservada a configuração de domínio.
- Histórico de correção nesta intervenção: o primeiro push falhou por formatação; um ensaio intermediário P3 falhou quando a foto de Contato ultrapassou o limite do painel e apresentou LCP mobile de **3.505,136 ms**. O CSS foi corrigido sem modificar a imagem original e a medição final passou. Não reclassificar as execuções anteriores como sucesso.

A avaliação da composição em aparelho iPhone físico continua distinta dos testes Chrome automatizados; validar especialmente aparência de favicon/ícone Apple, ajuste da linha inferior da fotografia e rolagem com barras nativas do navegador.

## Contrato de regressão da primeira dobra mobile (12/11/2026)

Em `scripts/p3-browser-smoke.mjs`, a checagem `P3_PROFILE_MOBILE` deve garantir, em seis viewports de 320 a 430 px, que a seta é legível e totalmente visível no viewport inicial, que a foto toca a borda inferior do painel A e que a primeira linha do nome tem de 55% a 85% da largura da segunda. A regra antiga `arrowBelowPortrait` foi removida: o botão agora **pode sobrepor a foto**. Verificar também `#formacao-b` (centralização entre régua e Inglês) e `#contato-a` (grafite contínuo de ponta a ponta), sem comprometer o desktop. O orçamento LCP mobile de 3.500 ms continua obrigatório e não foi alterado.

## Homologação do ajuste de primeira dobra em ade1552 (12/11/2026)

- **Implementação:** [`ade1552`](https://github.com/tuliustsangaropulos/PortfolioTulius/commit/ade1552280d2ea2a9362535da23d054329c60a24), somente mobile. Respiro do Perfil alterado em `content_blocks.content_json.items[0].hero.mobileEditorial`: `top.paddingY=18`, `bottom.paddingY=0`; retorno da atualização confirmou os dois valores, sem alterar outros campos, schema ou RLS.
- [Validate #43162980720](https://github.com/tuliustsangaropulos/PortfolioTulius/actions/runs/43162980720): **SUCCESS**, incluindo formatação, TypeScript, unitários, build e smoke.
- [Audit P3 Lighthouse #43162980664](https://github.com/tuliustsangaropulos/PortfolioTulius/actions/runs/43162980664): **SUCCESS**. Os seis viewports do Perfil entre **320×568** e **430×932** confirmaram `arrowVisibleOnLoad=true`, `portraitFlushWithPanel=true`, `firstNameProportional=true`; `P3_BROWSER_AUDIT.failures=0`. As **38 capturas editoriais** (13 desktop + 25 mobile) não registraram falhas.
- Mediana de três coletas de LCP: **mobile 3.381,864 ms**, performance 87 (**PASS** contra limite 3.500 ms); **desktop 937,195 ms**, performance 99 (**PASS**). CLS mobile **0,000217**. A execução é sintética; manter verificação visual no Safari real.
- Vercel production: implantação do SHA funcional `ade1552` verificada **READY** (deployment `dpl_HuaSKKeBfaSUapXxCs6P6jrDceHz`). A seção Contato utiliza cor grafite em largura inteira na transição; nenhuma imagem foi alterada no Storage.

**Limites de evidência:** a centralização estética de “Idiomas e Formação Complementar” e o alinhamento de pixels transparentes da foto de Contato ainda merecem conferência subjetiva no dispositivo físico; o teste P3 e os screenshots sintéticos não garantem percepção idêntica em todas as versões do Safari.

## Contratos de regressão dos ajustes mobile (12/11/2026)

No `scripts/p3-browser-smoke.mjs`, `P3_PROFILE_MOBILE` mantém as verificações anteriores de seta e fotografia e acrescenta: **`copyAboveArrow`** (coluna de textos sem sobreposição ao botão), **`portraitFlushLeft`** (imagem alinhada à borda esquerda, tolerância 2 px) e **`grayEndsAtOrangeRule`** (fundo do selo termina no topo do cabeçalho de Áreas, tolerância 2 px). A checagem abrange seis viewports de 320 a 430 px. Os testes unitários de Identidade e mobileEditorial incluem a nova cor `color.lightGray`, com fallback e resolução de variável CSS. Os valores de referência continuam: **sem falhas de navegação/overflow** e LCP mobile mediano ≤3.500 ms, sem afrouxamento da meta. A composição deve ser verificada também no Safari real do iPhone.

## Investigação de LCP nesta intervenção (12/11/2026)

O Lighthouse P3 do SHA funcional `b28b9d5`, [execução #43166775065](https://github.com/tuliustsangaropulos/PortfolioTulius/actions/runs/43166775065), passou na responsividade (zero falhas, 38 capturas), mas foi reprovado em duas execuções pelo limite de LCP mobile: **3.641,192 ms** e **3.641,005 ms**, ambas acima dos 3.500 ms permitidos. A fotografia do Perfil foi identificada como elemento LCP; já utiliza WebP, `loading=eager` e `fetchpriority=high`. Foi preparada uma intervenção limitada a `decoding=sync` somente nessa foto mobile; seu efeito deve ser verificado por nova auditoria P3 antes de classificá-la como melhoria aprovada. As execuções com falha continuam registradas sem reclassificação.

## Homologação final do cinza claro e da dobra mobile (12/11/2026)

**SHA funcional verificado:** [`e24e91f`](https://github.com/tuliustsangaropulos/PortfolioTulius/commit/e24e91f05eae47ae34f12803a8d90777e96895b2), sobre a implementação do token/admin/CSS no commit `2d04e5e` e as correções incrementais `64a271f` (formatação), `6298f9e` (teste de rótulo) e `b28b9d5` (geometria da primeira dobra). Os SHAs anteriores reprovados permanecem no histórico.

- [Validate #43168149601](https://github.com/tuliustsangaropulos/PortfolioTulius/actions/runs/43168149601): **SUCCESS** em formatação, TypeScript, unitários, build e smoke, no SHA `e24e91f`.
- [P3 Lighthouse #43168149664](https://github.com/tuliustsangaropulos/PortfolioTulius/actions/runs/43168149664): **SUCCESS**, incluindo navegador e âncoras, testes de acesso público e SEO e **38 capturas editoriais** (13 desktop, 25 mobile; zero falhas). Os seis viewports do Perfil (320×568, 360×740, 375×667, 390×844, 414×896, 430×932) apresentaram `copyAboveArrow=true`, `portraitFlushLeft=true` e `grayEndsAtOrangeRule=true`.
- P6 no mesmo run: mediana de **três amostras** de LCP mobile **3.466,042 ms**, nota de performance 90, CLS 0,000217, **PASS** diante do orçamento 3.500 ms; desktop **857,371 ms**, nota 99, **PASS**. Margem mobile de 33,958 ms é pequena, não representa garantia de performance real ou SLA.
- Supabase produção: revalidados `design_tokens.color.lightGray = #ECECEC`, `display_name='Cinza claro'`, `status='published'` e `content_blocks.content_json.items[0].hero.mobileEditorial.middle.background='color.lightGray'` no bloco A de Perfil, preservando a mesma fonte única de configuração. Não houve mudança de schema/migration/RLS.
- Vercel production: deploy do SHA `e24e91f` **READY**, ID `dpl_9vcK3cbhkELm1QwkfuKexgdLDGQL`; nenhuma mídia foi modificada.

**Limitação:** o primeiro workflow de leitura administrativa P5 do commit `2d04e5e` falhou por timeout do seletor de login, sem evidência de falha de escrita/persistência. Não foi realizado teste autenticado de alteração de cor via interface do admin; a leitura/gravação direta do token via Supabase e os testes estáticos do catálogo foram verificados. Recomenda-se conferência visual no Safari físico e teste autenticado de edição da nova cor numa próxima operação autorizada, sem inserir dados sintéticos em produção.

## Contrato P5 pós-refinamentos desktop (12/11/2026)

A suíte read-only `scripts/p5-admin-readonly.mjs` foi ajustada para exigir **oito** cores publicadas em Identidade — incluindo o token `color.lightGray` já existente — em vez da expectativa histórica de sete. Também verifica, sem salvar dados reais, que os controles numéricos da frase e dos quatro destaques desktop de Perfil/Esquerda e dos seis títulos de empresas de Perfil/Direita são exibidos e preenchidos no editor. Isso não altera o esquema, o CMS ou os tokens; limita-se a atualizar o contrato de homologação à estrutura atualmente publicada. Os resultados do workflow devem ser associados ao SHA da execução, não inferidos a partir do teste editado.

### Novas verificações P3 de composição desktop (12/11/2026)

O smoke de `scripts/p3-browser-smoke.mjs` avalia em 1512×691: ausência de interseção entre selo e legenda do indicador de anos, seta centralizada em relação ao viewport, espaços iguais entre título/indicadores/seletor de Resultados e títulos de Formação com fonte desktop ampliada. Na seção Sobre, usa o **limite visível** da fotografia no contêiner `overflow:hidden`, e não a borda geométrica do elemento deslocado além da máscara. A cobertura de mobile e a meta LCP ≤3,5 s permanecem as mesmas. Em `p5-admin-readonly.mjs` o total de etapas read-only passou a ser 21 após a inclusão das duas verificações de campos desktop; não confundir um contador desatualizado com regressão do CMS.

## Homologação final do refinamento desktop — 12/11/2026

**Implementação:** [`858a2f09`](https://github.com/tuliustsangaropulos/PortfolioTulius/commit/858a2f09ec2529a2ed04f68c5c88dfa976c14ea9), seguida da correção dos testes administrativos [`a6e7ff8c`](https://github.com/tuliustsangaropulos/PortfolioTulius/commit/a6e7ff8c9142bcbd9f349d8ba5fa40a043a977c7) e do ajuste final de sobreposição no Perfil e testes desktop [`ebda0aab`](https://github.com/tuliustsangaropulos/PortfolioTulius/commit/ebda0aabda776a8513cad963df184199ed0a6e53). Publicação verificada pelo gate de produção `P3_DEPLOYMENT_GATE` no domínio `tulius.work` para `ebda0aab`. Supabase `portfolio`: quatro blocos publicados atualizados e relidos sem schema/migration; Perfil A com frase 24 px e destaques título 17 px/texto 16 px/espaçamento 2 px, Perfil B com empresas 23 px; Formação com cursos 30 px e idiomas 29 px. Apenas objetos `desktop` foram adicionados ao JSONB, sem mudar campos `mobile`.

| Workflow / evidência para o SHA funcional `ebda0aab` | Resultado |
|---|---|
| [Validate #43197029438](https://github.com/tuliustsangaropulos/PortfolioTulius/actions/runs/43197029438) | **SUCCESS** — formatação, tipos, testes, build e smoke |
| [P5 Admin Read-Only #43197029455](https://github.com/tuliustsangaropulos/PortfolioTulius/actions/runs/43197029455) | **SUCCESS** — 21/21 verificações incluindo controles desktop, 0 escritas produtivas |
| [Export Docs #43197029494](https://github.com/tuliustsangaropulos/PortfolioTulius/actions/runs/43197029494) | **SUCCESS** |
| [Audit P3 Lighthouse #43197029431](https://github.com/tuliustsangaropulos/PortfolioTulius/actions/runs/43197029431) | **FAILURE global**, exclusivamente pelo gate de LCP mobile |

**Detalhe da auditoria P3:** browser responsivo `P3_BROWSER_AUDIT.failures=0`, 38 capturas editoriais sem falha (13 desktop, 25 mobile); teste de RLS/erros parciais/SEO aprovado. Em viewport desktop 1512×691: seta centrada em X=756 para largura 1512 px; espaços de Resultados = 24/24 px; título mínimo de Formação = 29 px; frase editorial = 24 px, texto dos destaques = 16 px; sobreposição entre indicador e selo = 0 px²; fotografia de Sobre contida por `overflow:hidden`, com borda visível da foto coincidindo com o fim da seção. **LCP desktop = 899,800 ms (PASS)**; **LCP mobile = 3.670,965 ms (FAIL)** na mediana de três coletas, acima do limite imutável de 3.500 ms. A medição mobile variou frente a uma execução intermediária do mesmo conjunto de ajustes mobile (3.481,410 ms), mas isso **não autoriza** reclassificar o último run como PASS. Nenhuma mudança de layout mobile ou do orçamento foi feita nesta intervenção.

**Limitação do aceite:** validação automatizada desktop e admin passou; permanecem a falha de performance mobile do run e a necessidade habitual de conferência visual subjetiva em dispositivo real. Não reabrir otimização mobile/standby automaticamente, nem modificar configuração Vercel ou Supabase por causa dessa variação.

### Fechamento documental e limites da evidência — 12/11/2026

O registro da intervenção desktop foi incluído na `main` por [`858a2f09`](https://github.com/tuliustsangaropulos/PortfolioTulius/commit/858a2f09ec2529a2ed04f68c5c88dfa976c14ea9), [`a6e7ff8c`](https://github.com/tuliustsangaropulos/PortfolioTulius/commit/a6e7ff8c9142bcbd9f349d8ba5fa40a043a977c7), [`ebda0aab`](https://github.com/tuliustsangaropulos/PortfolioTulius/commit/ebda0aabda776a8513cad963df184199ed0a6e53) e documentação de homologação [`0926e6af`](https://github.com/tuliustsangaropulos/PortfolioTulius/commit/0926e6afe6068db5b8addacfe805f413bf534a9b). Os workflows disparados **apenas pelo commit documental** `0926e6af` concluíram [Validate #43198028076](https://github.com/tuliustsangaropulos/PortfolioTulius/actions/runs/43198028076) e [Export Docs #43198028034](https://github.com/tuliustsangaropulos/PortfolioTulius/actions/runs/43198028034) em **SUCCESS**. P3 e P5 não foram repetidos nesse SHA, e a aprovação funcional deriva de `ebda0aab` (P5 **SUCCESS**; P3 navegador **PASS**, LCP desktop **PASS**, LCP mobile **FAIL**).

A validação P5 foi **somente leitura**: os 21 testes de autenticação, agrupamentos, novos `NumericField` desktop e proteção de edição passaram, com `cmsWrites=0`. Os valores iniciais do CMS foram persistidos via SQL restrito e relidos no Supabase, não pelo formulário. A captura P3 confirmou geometria (seta X=756 em 1512 px, gaps de Resultados 24/24 px, sobreposição selo/anos = 0, menor título de Formação 29 px, 38 capturas sem falhas). A mediana LCP mobile **3.670,965 ms** viola a meta **3.500 ms**; o resultado continua classificado como **FAILURE**, sem correção silenciosa ou aceite novo. Verificar aparência subjetiva em desktop real se houver nova demanda visual.

## Auditoria read-only dos conectores — 13/11/2026

**Referência de código anterior ao registro:** `main` em `9834fc3a05cf03e26336cea42f08498841b3b0f1`. Os testes abaixo foram **consultas via conectores**, não reexecução de `pnpm check`, Lighthouse, P3 ou P5 nem publicação manual.

| Verificação realizada | Evidência / resultado |
|---|---|
| GitHub: conta, repositório e permissões | `tuliust`, `tuliust/PortfolioTulius`, branch `main`, ID `1431748857`, permissão `admin` — **PASS** |
| GitHub: guias da `main` | `AGENTS.md`, `docs/README.md`, protocolo e guias temáticos legíveis — **PASS** |
| GitHub ↔ Vercel: status do SHA `9834fc3` | Contexto `Vercel` com status **success** — **PASS histórico** |
| Vercel: autenticação/projeto | `tuliust@gmail.com`, equipe `tuliust`, projeto original `prj_FVB5Cnk3428OSrWhEyskoqhWOCVW` — **PASS** |
| Vercel: último deployment observado antes do commit documental | Produção `READY`, `dpl_24KMLj6Q395ANdVFVaK8LoiuhQiP`, commit `9834fc3` — **PASS de estado** |
| Vercel: domínios | `tulius.work` e `www.tulius.work`, ambos `verified=true` — **PASS** |
| Vercel: variáveis | Dois nomes necessários disponíveis como `encrypted` em Development, Preview e Production; valores não lidos — **PASS de presença** |
| Vercel: repositório na interface/API | Captura de Git Settings aponta `tuliust/PortfolioTulius`; API ainda aponta proprietário anterior e `search_repo` retorna `installation_not_found` — **DIVERGÊNCIA / acompanhamento**, sem declarar integração quebrada |
| Supabase: API e SQL | Projeto `portfolio` `ACTIVE_HEALTHY`; `SELECT 1` retorna 1; PostgreSQL 17.11 — **PASS** |
| Supabase: metadados read-only | 22 tabelas públicas com RLS habilitada; 1 página, 1 registro de configuração, 28 blocos; health advisors `lints=[]` — **PASS de leitura**, não auditoria exaustiva |
| Supabase: titularidade da conta nova | Organização ainda `tuliustsangaropulos`; Owner da conta nova **NÃO VERIFICADO** |
| Publicação automática de push novo pós-transferência | **NÃO EXECUTADA / NÃO COMPROVADA**; não se criou commit artificial nem deploy manual para o teste |

**Resultados históricos reconsultados, vinculados ao SHA funcional `ebda0aab`:** [Validate #43197029438](https://github.com/tuliust/PortfolioTulius/actions/runs/43197029438) **SUCCESS**; [P5 Admin Read-Only #43197029455](https://github.com/tuliust/PortfolioTulius/actions/runs/43197029455) **SUCCESS**; [P3 Lighthouse #43197029431](https://github.com/tuliust/PortfolioTulius/actions/runs/43197029431) **FAILURE**, pelo LCP mobile mediano de **3.670,965 ms** versus teto **3.500 ms**. A consulta de jobs apenas confirmou esses estados; não reclassificar nem atribuir ao SHA documental `9834fc3` ou ao futuro commit deste registro.

**Escopo:** nenhuma edição de produção, dados, schema, credenciais, arquivos de código ou configuração Vercel/Supabase durante a auditoria. O registro documental por si só pode disparar CI/deployment via automação da `main`; conferir resultados do novo SHA separadamente. Pendências anteriores em standby não foram reabertas.

## Aceite do proprietário — revisão do Perfil desktop, 13/11/2026

O proprietário declarou **homologação visual concluída** para a redução da frase em itálico do Perfil de 20 px para **18 px** e para a redução da linha laranja sob a foto de 3 px para **2 px**, exclusivamente no desktop. Registrar como **aceite visual pelo proprietário**, não como teste visual independente do agente. O CMS de produção confirmou a alteração da frase; os ajustes em CSS e as atualizações canônicas foram versionados na mesma entrega. CI, Lighthouse, resultados históricos de P3 e confirmação da versão servida pela Vercel permanecem verificações técnicas distintas e devem ser avaliados para o SHA da entrega; não reclassificar falhas ou budgets históricos com base na aprovação visual.


## Escopo de verificação do refinamento visual — 16/11/2026

Intervenção sobre a referência de código `b99696608febd7f06296aa2638aef6db2bdc9f82`. Inspecionar as quatro áreas desktop (Perfil, Olá!, Resultados e seis Experiências), inclinações da seta e alvo navegável em desktop/mobile, `prefers-reduced-motion`, valores desktop no CMS/Supabase, manutenção da composição mobile, testes `pnpm check`, P3 Lighthouse, P5 read-only e deployment pelo SHA que receber o commit. Os resultados dos workflows **não são declarados aprovados antecipadamente**; devem ser vinculados ao SHA novo após sua execução, preservando FAILURE quando ocorrer.


### Diagnóstico do P5 read-only no primeiro SHA da intervenção — 16/11/2026

O commit funcional `9e534af393e4cb4bb0fa7e4347e09aba8d677fff` teve `Validate` **SUCCESS** ([#43804663293](https://github.com/tuliust/PortfolioTulius/actions/runs/43804663293)), `Export Docs` **SUCCESS** ([#43804663256](https://github.com/tuliust/PortfolioTulius/actions/runs/43804663256)) e produção Vercel **READY**. O P5 read-only [#43804663291](https://github.com/tuliust/PortfolioTulius/actions/runs/43804663291) deu **FAILURE**: a verificação do agrupamento dos quatro destaques comparava uma legenda histórica exata (“Experiência em grandes empresas”), mas o CMS atualmente publica “Experiência em grandes organizações”. O login, a leitura de identidade, o descarte administrativo, a navegação de seções e a apresentação do grupo de quatro registros foram todos verificados antes da falha. Não se observou erro nos ajustes tipográficos.

O teste P5 foi corrigido de modo restrito em `scripts/p5-admin-readonly.mjs`: verifica agora título do agrupamento, cardinalidade de quatro itens, legendas não vazias e distintas, sem exigir texto editorial congelado. A cobertura dos controles e dos quatro itens permanece. **A falha do run original continua histórica e não se converte em sucesso.** A homologação do commit corretivo depende da execução separada do novo run.


### P3 — critério de espaçamento em Resultados revisado em 16/11/2026

O run P3 [#43804663189](https://github.com/tuliust/PortfolioTulius/actions/runs/43804663189) do SHA funcional `9e534af` registrou `P3_DESKTOP_DENSITY_REGRESSION` por um contrato legado de igualdade quase exata dos gutters (`abs(left-right) ≤ 3px`) na referência **1512×691**. As medidas reais **60 px e 55 px**, ambos espaços maiores, correspondem à nova distribuição aprovada para Resultados. Os demais critérios desse objeto (posição do nome, composição, altura, números, título, botão central e ausência de sobreposição) estavam conformes. O teste agora exige explicitamente **ambos os gutters ≥38 px** e **diferença absoluta ≤12 px**, mantendo proteção contra congestionamento ou assimetria exagerada, sem desfazer o layout solicitado. A verificação ainda precisa rodar no SHA com esta alteração.

No mesmo run anterior, o gate **P6 mobile LCP continuou FAILURE** (mediana 3.629,539 ms contra teto ≤3.500 ms); desktop teve PASS com 867,676 ms. Essa diferença de desempenho permanece registrada, sem relaxamento do orçamento, mudança de imagem ou otimização fora do escopo.


### Homologação do refinamento desktop por SHA — 16/11/2026

A intervenção funcional `9e534af393e4cb4bb0fa7e4347e09aba8d677fff` atualizou React/CSS/CMS e os guias; os três blocos JSONB publicados foram relidos após UPDATE transacional em produção. O commit de correção de P5 `e939ab704fc877d4d1a9761e1c6c9c6f099f99f8` mudou **somente** o teste de agrupamento de destaques e este guia; o commit de correção P3 `4fcc3e34a874c8a3125e026e8c17f0fce115c3ec` mudou **somente** o gate da distribuição horizontal de Resultados e este guia. Não houve novas escritas produtivas após a intervenção inicial.

**Verificações do SHA final de código/testes `4fcc3e34`:**

| Evidência | Resultado |
|---|---|
| [Validate #43805230825](https://github.com/tuliust/PortfolioTulius/actions/runs/43805230825) | **SUCCESS** — format, TypeScript, testes, build, smoke |
| [Export Docs #43805230771](https://github.com/tuliust/PortfolioTulius/actions/runs/43805230771) | **SUCCESS** |
| [P3 Lighthouse #43805230787](https://github.com/tuliust/PortfolioTulius/actions/runs/43805230787) | **FAILURE global exclusivamente pelo budget de LCP mobile** |
| P3 navegador e responsividade | **PASS** — `P3_BROWSER_AUDIT failures=0`; botão centralizado; gaps de Resultados 60/55 px na referência 1512×691; sem sobreposição selo/legenda; 13 viewports |
| P4 auditoria editorial | **PASS** — 38 capturas, 13 desktop e 25 mobile, 0 falhas |
| P5 RLS público, fallback e SEO | **PASS** — RLS anônima, falhas de leitura simuladas e metadados SEO iguais aos publicados, 0 mutations |
| P6 desktop LCP | **PASS**, mediana de 3 coletas **912,229 ms**, orçamento mantido |
| P6 mobile LCP | **FAILURE**, mediana de 3 coletas **3.712,335 ms**, orçamento **≤3.500 ms** (performance 85; CLS 0,000217) |
| Vercel Production | **READY** para `4fcc3e34`, deployment `dpl_C11n3VesWjc6vT5cUAedj16vYRpR` |

**P5 Admin read-only:** [#43804868212](https://github.com/tuliust/PortfolioTulius/actions/runs/43804868212) foi **SUCCESS** no SHA `e939ab70` com 21/21 verificações e 0 escritas. O SHA `4fcc3e34` alterou apenas o gate P3 e a documentação; portanto a evidência de P5 da mesma aplicação permanece referenciada ao seu SHA próprio, não se afirma uma nova execução de P5 no SHA posterior. O [P5 anterior #43804663291](https://github.com/tuliust/PortfolioTulius/actions/runs/43804663291) foi **FAILURE** pelo texto editorial fixo obsoleto, já corrigido no script, e seu registro não foi reclassificado.

**Variação histórica de LCP na intervenção:** [P3 #43804663189](https://github.com/tuliust/PortfolioTulius/actions/runs/43804663189) falhou com mobile **3.629,539 ms** no SHA `9e534af`; [P3 #43804868190](https://github.com/tuliust/PortfolioTulius/actions/runs/43804868190) mediu mobile **3.384,254 ms** (budget PASS), mas ainda falhou no gate legado de espaçamento no SHA `e939ab`; [P3 #43805230787](https://github.com/tuliust/PortfolioTulius/actions/runs/43805230787) passou navegador/layout e falhou pelo LCP mobile **3.712,335 ms** no SHA `4fcc3e`. Este resultado permanece **FAILURE**; a flutuação não deve justificar afrouxamento do limite ou intervenção mobile não solicitada. O risco residual histórico de desempenho em standby mantém sua classificação.

**Limites do aceite:** a releitura SQL comprova valores armazenados em três blocos; o P5 read-only comprova carregamento do editor sem escrita, **não** representa teste de salvar pelo CMS em produção. O P3 comprova funcionamento automatizado em viewports/emulador, não homologação física subjetiva no monitor ou celular do proprietário. O push documental posterior a esta nota não muda o código do app nem altera esses resultados por SHA.


### Correção pontual da seta desktop na primeira dobra — 16/11/2026

Problema reproduzido na captura do proprietário (**desktop ~1518×692**): o botão `.profile-next-section` era posicionado relativamente ao **fim do Hero com altura variável**, aparecendo cortado na borda inferior da primeira tela, em vez de permanecer na primeira dobra. A correção reposiciona somente o botão desktop (eixo Y por `top: calc(100dvh - 3.4rem)` e eixo X em **63,5%** para desktop amplo). A altura dinâmica da seção permanece preservada para evitar clipping das experiências. Supabase `portfolio` foi consultado somente em leitura; não existe campo dedicado de posição do botão, e não houve mudança de dados, schema, RLS ou conteúdo.

A suíte `scripts/p3-browser-smoke.mjs` passa a medir a caixa real do botão em todos os viewports desktop (largura ≥768), incluindo a janela compacta **900×600 px** para detectar regressões da antiga regra `position: static`, exigindo que ela caiba **inteiramente na primeira dobra**. Na referência 1512×691, o gate de densidade exige centro em 63,5% (±5 px), borda superior entre `height-85` e a borda inferior ≤`height-4`, sem alterar os gates de nome, selo, Resultados ou mobile. O resultado de CI e deploy deve ser conferido por SHA após publicação; não interpretar execução pendente como PASS.


### Evidência da correção da seta — commit `85089ef` em 16/11/2026

No SHA funcional `85089efb448371f81b926d34e886386786f736ec`, a publicação Vercel de produção `dpl_2kfcrgXYmhfqQesBqcKD3NQjsg7D` foi confirmada como **READY**. [Validate #43807284578](https://github.com/tuliust/PortfolioTulius/actions/runs/43807284578) e [Export Docs #43807284568](https://github.com/tuliust/PortfolioTulius/actions/runs/43807284568) foram **SUCCESS**.

A auditoria [P3 #43807284639](https://github.com/tuliust/PortfolioTulius/actions/runs/43807284639) teve **P3_BROWSER_AUDIT failures=0**, mantendo os testes de âncora, responsividade e a régua de densidade. Na referência **1512×691**, o botão mostrou centro X **960 px** e limites verticais **Y=640–682 px**, totalmente dentro da primeira dobra; o teste novo de desktop compacto **900×600** mostrou botão em **Y=549–591 px**, viewport sem overflow e conteúdo renderizado. A auditoria editorial teve **38 capturas com 0 falhas**, RLS anônima e paridade SEO **PASS**, sem mutações.

O resultado **global do workflow P3 permaneceu FAILURE exclusivamente pelo gate P6 mobile LCP**, com mediana de três coletas **3.636,718 ms** (meta **≤3.500 ms**, performance 89 e CLS 0,065814). Desktop ficou **PASS** (mediana LCP **918,266 ms**, performance 99). Não reabrir o standby de performance, alterar o conteúdo mobile nem enfraquecer o orçamento nesta correção CSS exclusivamente desktop. O [P3 #43807074419](https://github.com/tuliust/PortfolioTulius/actions/runs/43807074419) do commit precursor `925d33d` havia terminado **SUCCESS**, mas sua evidência continua associada àquele SHA; os valores acima correspondem ao commit funcional final. Esta atualização posterior é apenas documental, sem mudança de frontend ou banco.


## Regressão de encaixe do selo na primeira dobra desktop — 16/11/2026

O proprietário enviou captura do Perfil desktop mostrando o selo laranja **cortado na borda inferior do retrato**. Implementação: reduzir `hero.desktop.yearsSize` no Supabase de 55 para 51 px e ajustar `src/index.css` para subir e reduzir levemente o selo no desktop. A suíte `scripts/p3-browser-smoke.mjs` foi reforçada na referência **1512×691 px**: registra `badgePortraitBottomGap` e `badgeYearsVerticalGap`, exigindo **≥8 px** de separação entre selo e limite inferior do retrato, e entre legenda de anos e selo. O teste antigo de sobreposição também permanece. Conferir resultado de CI da nova revisão por SHA (sem declarar sucesso antecipado) e preservar a meta mobile LCP ≤3,5 s sem intervenção mobile.


### Evidências por SHA — selo do Hero desktop em 16/11/2026

O commit funcional [`e94d89c`](https://github.com/tuliust/PortfolioTulius/commit/e94d89cd643bae5df43d586378d9e4c65de1062c) atualizou somente `src/index.css`, o gate geométrico P3 e os cinco guias canônicos pertinentes. O Supabase de produção confirmou `perfil`/A `items[0].hero.desktop.yearsSize=51` (antes 55), `introSize=15`, cinco itens e `mobileEditorial` preservado. A publicação Vercel de produção foi **READY**, deployment `dpl_G7eVGjgpJ4Dbrf876NhoCdQsXBrT`. [Validate #43810117578](https://github.com/tuliust/PortfolioTulius/actions/runs/43810117578) e [Export Docs #43810117478](https://github.com/tuliust/PortfolioTulius/actions/runs/43810117478) foram **SUCCESS**.

A auditoria [P3 #43810117498](https://github.com/tuliust/PortfolioTulius/actions/runs/43810117498) foi executada **duas vezes para o mesmo SHA**, sem alterações no código entre tentativas. Em ambas, a referência **desktop 1512×691** apresentou `badgePortraitBottomGap=12` px, `badgeYearsVerticalGap=18` px e `badgeYearsOverlapPx2=0`: o **novo gate geométrico de selo passou**, com folga superior e inferior maior que o mínimo de 8 px, nome/indicadores/área desktop preservados e botão com centro X=960 px. Em ambas, as **38 capturas editoriais** foram concluídas sem falhas, a paridade SEO e RLS pública passaram.

**O status GLOBAL de P3 foi FAILURE em ambas as tentativas** por duas verificações não relacionadas ao layout desktop alterado:

| Tentativa | Interação mobile | P6 LCP mobile | P6 LCP desktop |
|---|---|---|---|
| 1ª | FAIL — timeout de 10 s no estágio “about and results editorial mobile verification” | FAIL — mediana 3.512,692 ms (meta ≤3.500 ms) | PASS — 894,851 ms |
| 2ª | FAIL — mesmo timeout de 10 s | FAIL — mediana 3.526,064 ms (meta ≤3.500 ms) | PASS — 896,065 ms |

Não classificar o workflow completo como aprovado. A falha de interação mobile repetida merece diagnóstico em tarefa específica, mas **não autoriza** reabrir o backlog geral em standby, afrouxar o orçamento LCP ou modificar o mobile nesta intervenção solicitada apenas para a primeira coluna do Hero desktop. CI PASS, Vercel READY, dados gravados e gate geométrico PASS são evidências distintas. Esta nota documental posterior não altera a aplicação nem o Supabase.

## Seção 03 — implantação, auditorias e lições de 16/11/2026

**Linha de implementação.** [`57a77e9`](https://github.com/tuliust/PortfolioTulius/commit/57a77e9bfa9a7cb20439f0b0ec4bf64c499d3812) introduziu os 20 indicadores e o editor temático; [`cb953dad`](https://github.com/tuliust/PortfolioTulius/commit/cb953dadde533dcfc8447a22a3e5538c5d4df7df) corrigiu a formatação; [`9e0dc81`](https://github.com/tuliust/PortfolioTulius/commit/9e0dc81cff7b7cec92f007f106fcf8de6cc85820) atualizou os testes de fallback e teve [Validate #43813192927](https://github.com/tuliust/PortfolioTulius/actions/runs/43813192927) **SUCCESS** (265 unitários, TS, formatação, build e smoke). Os ensaios intermediários de Validate reprovados não foram reclassificados.

**Separação de evidências:** [P5 Admin Read-Only #43813045041](https://github.com/tuliust/PortfolioTulius/actions/runs/43813045041) e [P5 Local Transactional #43813045094](https://github.com/tuliust/PortfolioTulius/actions/runs/43813045094) tiveram **SUCCESS no SHA `cb953dad`**. Eles **não** demonstram edição autenticada integral dos 20 indicadores no último SHA. A carga editorial inicial foi efetuada em produção por SQL JSONB protegido e confirmada por leitura: 20 indicadores no A (quatro para cada tema, quatro para visão geral) e cinco categorias compactas no B; não houve migration, RLS ou Storage alterados.

| SHA | Auditoria P3 | Browser/SEO/RLS | LCP mobile mediano (3 ensaios) | Resultado global |
|---|---|---|---:|---|
| `cb953dad` | [#43813045057](https://github.com/tuliust/PortfolioTulius/actions/runs/43813045057) | Parcial: timeout de 10 s no mobile após verificações iniciais | 3.509,759 ms | **FAILURE** |
| `2b573ca` | [#43815314121](https://github.com/tuliust/PortfolioTulius/actions/runs/43815314121) | Cinco temas, quatro cards, 320/390/430/1440 px, sem overflow; **PASS** | 3.261,879 ms | **SUCCESS** |
| `652dea0` | [#43816204987](https://github.com/tuliust/PortfolioTulius/actions/runs/43816204987) | Browser/temas/SEO/RLS **PASS** | 3.746,315 ms | **FAILURE** no orçamento P6 |
| `9915964` | [#43817188772](https://github.com/tuliust/PortfolioTulius/actions/runs/43817188772) | Cinco temas e capturas estabilizadas pós-animação, SEO/RLS **PASS** | 3.458,135 ms | **SUCCESS** |

**Correção do roteiro P3.** A expectativa antiga de dois cards ao escolher Marketing/Imprensa foi atualizada para quatro em todas as cinco categorias; o teste voltou a verificar a visão geral com quatro cards. A região de rolagem compacta no desktop ganhou foco por teclado e contorno visível. Capturas feitas durante a transição CSS estavam artificialmente esmaecidas: o helper passou a aguardar a classe `cms-section-entered` e a opacidade final, **sem desativar a animação do site**. O SHA `9915964` confirmou a captura corrigida em P3. Não transformar a falha de `652dea0` em PASS por causa de resultados posteriores.

**Publicação e performance.** O gate P3 de `9915964` confirmou SHA efetivamente servido por `tulius.work` e LCP desktop mediano **887,824 ms**. O commit posterior **apenas documental** [`06af944`](https://github.com/tuliust/PortfolioTulius/commit/06af9444955297a6ee93c9934b369598198afd69) teve [Validate #43825442272](https://github.com/tuliust/PortfolioTulius/actions/runs/43825442272) e [Export Docs #43825442281](https://github.com/tuliust/PortfolioTulius/actions/runs/43825442281) **SUCCESS**, com status Vercel `success` no GitHub, mas **sem novo ensaio P3**; seu commit não herda o LCP anterior como medida própria. O orçamento mobile continua **≤3.500 ms**: três execuções de laboratório variaram ao redor da meta, o que permanece risco residual em standby. Captura automatizada não substitui aceite visual em aparelho físico.


## Plano de verificação da revisão editorial de 16/11/2026

Escopo: somente dois indicadores em Resultados e as seis experiências; Perfil/Olá e os outros indicadores são invariantes. Conferir no Supabase 20 métricas, cinco temas, visão geral na ordem 1/2/3/4, 30 projetos visíveis (cinco por empresa), descrições não vazias e marcadores de trajetória. Confrontar os dois estados `status` e `project_status` dos projetos normalizados. Validar por releitura dos registros antes/depois.

Teste funcional de React: seleção dos cinco projetos desktop e mobile, projetos sem slide, galeria e acessibilidade. Teste CMS autenticado: editar→salvar→reler no ambiente sintético local, sem CRUD de ensaio na produção. Gates `format:check`, `typecheck`, `test`, `build` e jobs GitHub Actions devem ser vinculados ao SHA efetivamente publicado; `READY` sozinho não é aceite de CI. Registrar resultados reais em atualização posterior, nunca presumir SUCCESS.

### Evidência do primeiro commit da revisão

`04373cef`: Validate #43840555522 **FAILURE** no gate de formatação (`ExperienceStack.tsx`, `experienceEditorial.ts`); as etapas posteriores de TypeScript/testes/build foram **não executadas** nesse job. A correção estritamente de formatação foi preparada no commit consecutivo; o resultado desse commit deve ser verificado pelo próprio workflow, sem herdar o estado anterior.

### Evidência do segundo commit

`5efbd8e`: Validate #43840799944 **FAILURE** após `format:check` e TypeScript **SUCCESS**; `fallback.test.ts` teve duas expectativas desatualizadas (terceiro indicador geral e itens históricos ocultos no fallback). Foi preparada correção que mantém os itens históricos como `isHidden=true`, conserva cinco itens visíveis e atualiza o teste do novo indicador. Validar novamente pelo próximo SHA.

### Evidência P3 preliminar e restauração de contrato acessível — 16/11/2026

Em `5efbd8e`, [P3 #43840800020](https://github.com/tuliust/PortfolioTulius/actions/runs/43840800020) terminou **FAILURE**: teste de interação procurava o rótulo acessível legado `Exibir imagem de Organização de eventos` (renomeado indevidamente no primeiro código); a análise também identificou timeout de 15 s na rota anônima `/admin` e mediana LCP mobile de **3.545,158 ms** (limite 3.500 ms), com desktop PASS. O renderer voltou a usar o rótulo legado nos projetos associados a slides e usa `Selecionar projeto` nos itens sem imagem, sem modificar o desenho do componente nem a autorização administrativa. Falhas de rota e performance são evidência desse SHA, não autorização para reabrir backlog; repetir P3 no próximo SHA e registrar seu resultado real.

### Diagnóstico P3 de `c40a157` — sincronização de projeto e galeria

[P3 #43841631881](https://github.com/tuliust/PortfolioTulius/actions/runs/43841631881) **FAILURE** com resultados detalhados: proteção das rotas anônimas `/admin` e `/admin/preview` **PASS**; cinco projetos na Invest RS, navegação mobile, menus, cinco categorias de Resultados e navegação entre empresas passaram. A regressão funcional remanescente foi o destaque visual do projeto que não acompanhava imediatamente a navegação das setas da galeria (`galleryToProject`). A seleção desktop passou a derivar do slide ativo, mantendo seleção manual nos itens sem mídia. O LCP mobile mediano foi **3.512,382 ms**, acima da meta de 3.500 ms; desktop **PASS**. Os valores de LCP são evidências por SHA e não justificam alteração não solicitada na abertura já aprovada.


## Fechamento técnico por SHA — revisão editorial de Experiências (16/11/2026)

**Fonte de verdade de dados:** em produção `zfnrhzplwpjpdljraypt`, operação inicial de **22 UPDATEs atômicos protegidos por versão**: 13 blocos JSONB (Resultados A e A/B das seis experiências), seis descrições de `career_experiences` e três `portfolio_projects`; duas correções textuais CAS posteriores em Trajetórias (Prefeitura evita duplicar público SUBPI, Vale preserva +31% de inscrições de trainees como resultado coletivo, sem atribuição pessoal exclusiva). Não houve DDL, RLS, Auth, Storage ou migration. Após releitura, foram confirmados **20 indicadores**, **cinco categorias**, **quatro destaques gerais**, **cinco projetos visíveis por empresa** e os três `project_status='realizado'` aprovados. Itens antigos não utilizados permanecem `isHidden=true`, com os demais metadados de bloco e slides preservados.

**SHA funcional `aeffc5f`:** [Validate #43842658739](https://github.com/tuliust/PortfolioTulius/actions/runs/43842658739) **SUCCESS**, com formatação, TypeScript, testes, build, smoke de build e validação da sintaxe de suíte. Vercel deployment para este SHA **READY**. A suíte [P3 #43842659962](https://github.com/tuliust/PortfolioTulius/actions/runs/43842659962) terminou **FAILURE**. Na auditoria, o contrato projeto→galeria→projeto e as trocas de aba foram **PASS**, assim como navegação em seções, cinco temas de Resultados, menus, proteção de `/admin` e `/admin/preview`, e verificações de estrutura mobile. Porém a etapa agregada de browser/responsividade foi marcada **FAILURE** no job, sem causa única confirmada por essa leitura do log; a etapa de orçamento P6 também foi **FAILURE**, pela mediana de LCP mobile **3.609,314 ms** contra meta **3.500 ms**, com desktop **PASS** (mediana 921,675 ms). O LCP usa a imagem da primeira seção como elemento principal; este ciclo não autoriza reabrir Perfil/Olá, alterar a meta nem declarar P3 aprovado. Risco de variabilidade já documentado em ciclos anteriores.

**Admin/CMS:** contratos de edição e persistência via RPC/CAS existentes foram preservados; testes unitários de administração e verificação SQL de leitura de registros publicados tiveram êxito. **Não foi executado** o teste autenticado integral `editar → salvar → reler` em produção, nem houve CRUD de ensaio no banco. Testes sintéticos locais com Supabase CLI/Docker e homologação visual manual em dispositivo físico também **não foram comprovados** neste ciclo. Vercel READY e Validate SUCCESS não substituem essas comprovações.

**Integração:** fallback acompanha as duas alterações de métricas e os cinco resumos das seis empresas, mas publicação efetiva continua a partir do Supabase; registros antigos do fallback foram mantidos ocultos. O front-end independente das imagens associa os cinco textos aos três/quatro slides aprovados. Não criar imagens, coleções ou estados de publicação a partir de legendas.

**Governança:** os cinco anexos privados do Projeto ChatGPT são snapshots não sincronizados. Substituir os pertinentes após o encerramento operacional por iniciativa do proprietário, sem publicar conteúdo confidencial no GitHub.

## Plano de homologação do renderer PDF — Etapa 2 (16/11/2026)

Implementação isolada: `PdfPortfolio.tsx`, `PdfPortfolio.css`, `PdfExperienceSection` e seleção pura `pdf-export-sections.ts`, com três testes de ordem, visibilidade e seleção. A integração e o serviço de PDF não foram executados nesta etapa. Verificar `pnpm check` no CI do commit pertinente, distinguindo sucesso e falha reais.

**Ainda pendente:** renderização em navegador das 13 seções, desktop/mobile, Original/Clean, sem truncamento, fontes e fotografias reais, hyperlinks Hero/Contato, páginas de altura variável e comparativos visuais. A prova de conceito isolada da Etapa 1 não comprova fidelidade deste renderer. A P3 histórica de `8ed19b0` permanece FAILURE por LCP mobile.

### Validação adicional de estrutura HTML — Etapa 2

O teste `src/components/public/PdfPortfolio.test.tsx` usa React SSR sintético para confirmar, em desktop e mobile, a ordem de três seções, visão geral e tema contínuos, projetos visíveis, Trajetória integral, depoimentos sem botão e ausência de menus/galerias. Esses testes **não** validam dimensões físicas de páginas, fotos nem paridade visual com produção; tais condições continuam para as etapas posteriores.

## Evidências concluídas — renderer PDF da Etapa 2 (16/11/2026)

**Código e testes por SHA:** `3435c54441f9e5a72e5fc97f021353a8de9f4476`. [Validate #43856231156](https://github.com/tuliust/PortfolioTulius/actions/runs/43856231156) **SUCCESS**: formatação, TypeScript, **60 arquivos de teste / 271 testes PASS** (incluindo seleção de seções e SSR estático desktop/mobile), build Vite, smoke offline e sintaxe dos scripts. [Export Docs #43856050675](https://github.com/tuliust/PortfolioTulius/actions/runs/43856050675) **SUCCESS** ocorreu no SHA intermediário `0c93fad`; não deve ser atribuído ao SHA final. Vercel production `dpl_7GL83QjJgnyXoBLUEKo95eMWboMS` **READY** para `3435c54`.

[P3 #43856231062](https://github.com/tuliust/PortfolioTulius/actions/runs/43856231062), **FAILURE global exclusivamente no orçamento de LCP mobile**: mediana **3.662,554 ms** frente à meta **≤3.500 ms**. Desktop **900,722 ms PASS**; browser/responsividade **0 falhas**, **38 capturas PASS**, verificação de SHA servido na produção PASS, leitura parcial/RLS e conteúdo de Hero preservados. A falha não significa regressão comprovada do renderer PDF, que permanece **sem rota e não foi executado no navegador**; também não significa performance corrigida. A P3 anterior de `2d9c04f` foi **FAILURE** por LCP mobile **3.515,154 ms**, com navegador PASS. Os commits intermediários `ca34ea7` e `0c93fad` tiveram Validate **FAILURE na etapa de formatação**, corrigida nos commits seguintes sem mudanças editoriais públicas.

**Limite da Etapa 2:** os testes SSR verificam a árvore HTML sintética, não imagens reais, cores finais, métricas geométricas, hiperlinks efetivos no PDF, paginação física ou acesso autenticado. Não houve mudança em Supabase, Auth, RLS, Storage, migrations ou configuração manual de deploy. A próxima fase precisa demonstrar visualmente o renderer real antes de liberar a geração de PDF no admin.

## Etapa 3 do PDF — teste de contrato de dispositivo (16/11/2026)

Foram adicionados testes unitários para os viewports Desktop 1440×900 e Mobile 390×844 e atualizados os testes de SSR do renderer para `data-pdf-section`, tamanho de referência e depoimentos sem botões. O PDF físico e a comparação visual com produção continuam pendentes. Verificar o `Validate` do SHA que introduziu os testes antes de declarar sucesso.

## Etapa 3 — workflow visual de PDF (16/11/2026)

Arquivos: `.github/workflows/pdf-export-visual.yml`, `scripts/pdf-export-visual-smoke.mjs`, `pdf-export-qa.html` e `src/pdf-export-qa.tsx`. Os testes usam Puppeteer/Chrome e fixture sem dados produtivos, avaliam as quatro modalidades e geram PNGs/JSON do resultado; o workflow também comprova que o HTML de QA não integra `dist`. O resultado efetivo deverá ser registrado por SHA após execução. O relatório de fixture não atesta paridade pixel-a-pixel com produção, métricas LCP ou sucesso da paginação PDF final.

**Primeira execução da QA visual** [#43862394922](https://github.com/tuliust/PortfolioTulius/actions/runs/43862394922), SHA `de65def`: **FAILURE por assertiva incorreta de seleção dos links mobile**, não por ausência de links; Desktop Original e Clean **PASS**, mobile com ordem, 24 indicadores, 6×5 projetos, Trajetórias, depoimentos, fundo Clean, overflow e clipping **PASS**. O seletor foi corrigido em revisão posterior; reexecutar e registrar novo resultado por SHA.

**Revisão manual dos PNGs da QA #43862705010:** apesar do workflow **SUCCESS** nas quatro matrizes de estrutura, a captura fallback do Hero mobile apresentava composição sobreposta e a fixture não carregava Big Shoulders/Inter do HTML público. Corrigidos HTML de QA, CSS isolado e novos critérios geométricos/fonte; o SUCCESS anterior permanece válido apenas para as assertivas então executadas. A nova execução deverá confirmar o efeito da correção visual antes de classificar a Etapa 3 como homologada.

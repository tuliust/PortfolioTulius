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

## Resultado verificado da Etapa 3 — PDF (16/11/2026)

**Código do renderer/QA no SHA [`9d2c2e9`](https://github.com/tuliust/PortfolioTulius/commit/9d2c2e9d60381924e491ed6eafebf309e9c495ca).** [Validate #43863504848](https://github.com/tuliust/PortfolioTulius/actions/runs/43863504848) **SUCCESS**; [Export Docs #43863504850](https://github.com/tuliust/PortfolioTulius/actions/runs/43863504850) **SUCCESS**; deployment Vercel de produção `dpl_DQrZTKEnLypJrpsvAhkFe6oyRK5f` **READY** no mesmo SHA, com `P3_DEPLOYMENT_GATE` confirmando o commit servido.

[PDF Renderer Visual QA #43863504846](https://github.com/tuliust/PortfolioTulius/actions/runs/43863504846) **SUCCESS**: quatro combinações Desktop/Mobile e Original/Clean, 13 seções na ordem pública, 4+20 indicadores, seis experiências com cinco projetos cada, seis Trajetórias **sintéticas**, três depoimentos integrais em `article`, links no Hero, sem menus/galerias, sem overflow horizontal ou clipping detectável, fundos brancos Clean, fontes Big Shoulders Display/Inter carregadas, e Perfil mobile com primeiro painel de **844 px** e **0 px de sobreposição**. A auditoria produziu 16 capturas e `report.json` no artefato `pdf-renderer-fixture` (ID `14224422698`); verificado também `PDF_QA_NOT_PUBLISHED PASS`. Houve inspeção visual amostral das capturas finais de Perfil desktop/mobile e Resultados/Invest RS. **Essas verificações usam fallback e dados de trajetória sintéticos, não provam paridade pixel-a-pixel com CMS/mídia produtivos.**

[P3 Lighthouse #43863504868](https://github.com/tuliust/PortfolioTulius/actions/runs/43863504868) **FAILURE global somente pelo LCP mobile**: mediana de **3.572,624 ms**, acima do limite vigente **≤3.500 ms**; desktop **902,457 ms PASS**. A auditoria de navegador reportou **0 falhas**, as **38 capturas PASS**, SEO/RLS e verificação do SHA publicado sem falha no job; o único passo com FAILURE foi `Enforce conservative P6 Lighthouse regression budgets`. Não reclassificar o risco aceito como corrigido. A primeira QA visual da Etapa 3 [#43862394922](https://github.com/tuliust/PortfolioTulius/actions/runs/43862394922) falhou por seletor de links do Hero mobile; [#43862705010](https://github.com/tuliust/PortfolioTulius/actions/runs/43862705010) passou nas assertivas anteriores, mas a inspeção das imagens motivou o reparo de fonte e sobreposição, verificado em #43863504846.

**Fora da Etapa 3:** ainda não há rota ou tela do admin para PDF, geração de arquivo físico com uma página por seção, conferência dos hyperlinks no documento final ou homologação de fidelidade com dados de produção. Não houve mudanças de Auth/RLS/Storage/migrations nem deploy manual.

## Etapa 4 — interface e rota de prévia PDF (16/11/2026)

`PdfExportPanel.tsx`, `PdfExportPanel.css`, `PdfPreviewPage.tsx`, `pdf-preview-config.ts`, `useAdminGuard.ts` e testes foram adicionados. `AdminApp.tsx` e `routes.tsx` integram o módulo, e P3 testa também o redirecionamento anônimo de `/admin/pdf-preview`. A QA visual da Etapa 3, [#43863504846](https://github.com/tuliust/PortfolioTulius/actions/runs/43863504846), terminou **SUCCESS** nas quatro variantes com dados fallback e Trajetórias sintéticas no SHA `9d2c2e9`. Não prova fidelidade ao CMS real.

O download físico não foi implementado. Registrar Validate, P3 e deployment por SHA; os testes autenticados do painel e a verificação visual do iframe com CMS real permanecem pendentes.

### Evidência de CI da Etapa 4 — 16/11/2026

**SHA funcional validado:** [bd0d394](https://github.com/tuliust/PortfolioTulius/commit/bd0d3946bb1d7938d1ecf7c641054e066a265a3e), que corrige apenas a formatação do commit funcional inicial `9ad10ad`. [Validate #43865563509](https://github.com/tuliust/PortfolioTulius/actions/runs/43865563509) **SUCCESS**: formatação, TypeScript, **62 arquivos e 276 testes PASS**, build e smoke. [P5 Admin Read-Only E2E #43865563550](https://github.com/tuliust/PortfolioTulius/actions/runs/43865563550) **SUCCESS**. Vercel production `dpl_DcD1yQahUGtr2RxQME27dTnBpQki` **READY** para `bd0d394`.

[P3 #43865351440](https://github.com/tuliust/PortfolioTulius/actions/runs/43865351440), SHA `9ad10ad`, **SUCCESS**: `/admin/pdf-preview` redirecionou acesso anônimo a `/admin/login` com `noindex`, auditoria browser **0 falhas**, **38 capturas PASS**, LCP mobile mediano **3.375,495 ms PASS** (meta ≤3.500 ms) e desktop **982,503 ms PASS**. Isso não demonstra autenticação real do módulo nem corrige retrospectivamente falhas anteriores de LCP.

[P5 Local Transactional #43865351550](https://github.com/tuliust/PortfolioTulius/actions/runs/43865351550), SHA `9ad10ad`, **FAILURE global** na etapa E2E sintética de CMS: `TimeoutError 15000ms` na checagem de reordenação de itens de Navegação em `scripts/p4-local-admin-browser.mjs:689`. Os testes anteriores de login local, save/RPC, leitura pública, mídia e guarda de alterações foram PASS no mesmo job. Não se demonstrou nexo causal com a interface PDF; a falha **não é considerada resolvida** nem reclassificada. O Validate de `9ad10ad` inicialmente falhou em formatação, corrigida por `bd0d394`.

**Ainda não executados:** ensaio autenticado real da prévia PDF no admin, paridade com conteúdo e mídias produtivos na nova rota e geração física do PDF com links e paginação. A etapa 4 entrega apenas o painel de configuração e prévia protegida.

## Etapa 5 — contrato de PDF físico (16/11/2026)

`src/lib/pdf-print-layout.ts` e testes adicionam `@page` individuais, limite de altura e seleção. O admin só habilita impressão após carregar imagens e fontes; exige Trajetórias e links de Hero/Contato. A QA física deverá verificar em Chromium nas **quatro combinações**: número de páginas idêntico à quantidade de seções incluídas, fontes/texto extraíveis por `pdftotext`, hiperlinks do Hero e Contato e altura variável. **Chamar `window.print()` não comprova que o usuário salvou o arquivo.** A homologação real autenticada com CMS produtivo permanece pendente até execução documentada.

Sem dependências novas, funções servidoras ou mudanças em Auth/RLS/Storage. Registrar CI e deployment por SHA; não presumir aprovação antes de concluir a QA.

### QA física nativa da Etapa 5 — contrato de verificação

O workflow `PDF Renderer Visual QA` passa a executar `scripts/pdf-export-pdf-smoke.mjs` após a QA de layout, com a fixture de conteúdo fallback e Trajetórias **sintéticas**. Produz quatro PDFs com 13 seções (Desktop/Mobile × Original/Clean) e dois PDFs reduzidos (quatro seções). `pdfinfo` verifica a quantidade de páginas físicas, `pdftotext` verifica texto pesquisável e `pdftohtml` inspeciona links nativos nas páginas Hero/Contato, incluindo redirecionamento de links para seções excluídas. O relatório e PDFs de teste são publicados como artefatos temporários do CI; não contêm dados privados de produção.

**Limite:** é uma verificação do Chromium no CI, equivalente em tecnologia ao diálogo nativo de impressão, mas não uma confirmação de salvamento pelo usuário. O resultado por SHA será acrescentado após execução.

**Primeira execução da QA física:** [#43910393533](https://github.com/tuliust/PortfolioTulius/actions/runs/43910393533) no SHA `84c0bd9` foi **FAILURE** antes da geração por ausência de utilitários Poppler (`command -v pdfinfo` no runner). As quatro modalidades da QA visual anterior foram **PASS**. O workflow agora instala `poppler-utils` somente no runner de CI, quando necessário; esta correção não altera o build nem a interface pública. A QA física precisa ser reexecutada para atestar páginas, texto e links.

**Primeira execução com Poppler:** [#43910783938](https://github.com/tuliust/PortfolioTulius/actions/runs/43910783938), SHA `830bf67`, **FAILURE na QA física**: os dois PDFs Desktop com 13 seções tiveram **13 páginas, texto pesquisável e links PASS**; os dois PDFs Mobile geraram **15 páginas para 13 seções**; as duas seleções reduzidas pararam por HTTP 304 válido tratado incorretamente como erro. A QA visual das quatro modalidades continuou PASS. O teste foi ajustado para aceitar 304 e registrar o conteúdo inicial de cada página excedente, de modo a diagnosticar a paginação sem atribuir causa não demonstrada.

**Diagnóstico de páginas extras** ([QA #43911418915](https://github.com/tuliust/PortfolioTulius/actions/runs/43911418915), SHA `ca3ad98`): Desktop Original/Clean com 13 páginas **PASS**; seleção reduzida Desktop com quatro páginas **PASS**; Mobile Original/Clean com 15 páginas para 13 **FAILURE**, e seleção Mobile com seis para quatro **FAILURE**. Os conteúdos extraídos apontam transbordamento do Hero e do Contato (e paginação variável em seções adjacentes). Como `100svh`/ `50svh` são recalculados segundo a altura da página impressa, adicionada fixação **apenas de impressão** do primeiro painel do Hero em 844 px e da altura mínima da fotografia de Contato em 422 px. Nova QA física necessária.

**Efeito da correção do viewport:** [QA #43912156808](https://github.com/tuliust/PortfolioTulius/actions/runs/43912156808), SHA `efa681c`, comprovou **PASS nos quatro PDFs completos (13/13 páginas físicas, textos extraíveis e links Hero/Contato)** e na seleção Desktop (4/4). O workflow global permaneceu **FAILURE por uma assertiva excessiva no último PDF Mobile de quatro seções**: o teste exigia link externalizado mesmo quando o Hero mobile só apontava a categorias de Resultados, seção que estava incluída. O teste agora exige URL pública somente quando de fato há link do Hero para seção excluída. Não se alterou conteúdo nem a geração efetiva.

**Resultado aprovado antes da assertiva adicional:** [PDF Renderer Visual QA #43912639152](https://github.com/tuliust/PortfolioTulius/actions/runs/43912639152), SHA `c0c6cac`, **SUCCESS**: quatro PDFs de 13 páginas e dois PDFs parciais de quatro páginas; textos extraíveis, links Hero/Contato, imagens e fontes e ausência da fixture no build produtivo. Conteúdo de fixture com Trajetórias sintéticas, não banco de produção. A QA passa a verificar também o título de cada seção na página física correta, com resultado a confirmar por SHA. A impressão autenticada com CMS real e o salvamento manual não foram executados nesta homologação.

## Proteção contra corte nas galerias — mudança de 17/11/2026

O `scripts/p3-browser-smoke.mjs` passa a verificar `getComputedStyle(img).objectFit === "contain"` na galeria de **Invest RS mobile, 390 × 844**, e de **Prefeitura-SP desktop, 1440 × 900**; as verificações anteriores de vínculo projeto/slide, controles e navegação permanecem. Inspeção de CSS e leitura Supabase (19 slides publicados, zoom 1×, sem deslocamentos) não substituem execução do P3 pelo SHA final, a revisão óptica real, nem o orçamento LCP mobile ≤3.500 ms. Resultados de CI históricos permanecem como registrados; não declarar sucesso antecipado.

## Ajustes pós-homologação do proprietário — PDF (17/11/2026)

Relato visual produtivo: experiências com comportamento sticky (indevido no PDF), fotografia de Contato recortada lateralmente, depoimentos compactos e prévia Mobile bloqueada pela mensagem genérica de imagem não carregada. As correções foram aplicadas **somente ao renderer de exportação**: experiências estáticas em fluxo, Contato Desktop com `contain`, retratos/textos dos três depoimentos ampliados e componente de prontidão que espera `decode()` antes de validar `naturalWidth`, mantém o preview visível e envia erro específico ao painel. A fixture visual monta agora o mesmo componente de prontidão da prévia real e exige `data-pdf-export-ready=true`; o smoke ganhou assertivas para seis experiências sem sticky/sobreposição, retrato sem recorte e tamanhos/espaçamentos mínimos de depoimentos. A QA física das quatro variantes e seleções parciais permanece obrigatória.

A evidência de CI deve ser conferida por SHA após este commit. Não há teste autenticado real de que eventuais URLs de mídia ausentes no Supabase tenham sido corrigidas; este ajuste não edita a mídia produtiva. A frente ainda aguarda aceite visual após a publicação automática.

**Ajuste do ensaio de paginação pós-homologação (17/11/2026):** QA no SHA `b9e6aa9` identificou **quatro modalidades visuais PASS**, PDFs Desktop 13/13 páginas e seleções de quatro páginas PASS, mas os PDFs Mobile completos apresentaram **14 páginas para 13 seções (FAILURE)**, com conteúdo de Ferramentas/Depoimentos atravessando a fronteira física. O cálculo da altura passou a considerar também o limite inferior dos descendentes visíveis e uma reserva mobile de 96 CSS px para acomodar a diferença de fluxo e fontes em impressão; essa reserva não altera o conteúdo nem o viewport da prévia. A eficácia deve ser comprovada em nova QA física por SHA, sem reclassificar o run anterior.

**Segunda QA da paginação** ([#44109040799](https://github.com/tuliust/PortfolioTulius/actions/runs/44109040799), SHA `1308ec4`): a reserva geral de 96 px e a medição dos descendentes **não foram suficientes**; os dois PDFs Mobile completos ainda tiveram 14 páginas para 13, com o último grupo de Ferramentas atravessando a primeira página de Depoimentos. PDFs Desktop e parciais PASS; quatro verificações visuais PASS. O bloco mobile `ferramentas` usa dois painéis editoriais e ícones em sequência; foi aplicada uma reserva adicional, isolada apenas à sua página impressa (320 px). O resultado requer nova execução de QA e não reclassifica a falha anterior.

### Evidências pós-homologação e falha negativa da mídia — 17/11/2026

**SHA funcional `76703ae`:** [Validate #44109802711](https://github.com/tuliust/PortfolioTulius/actions/runs/44109802711) **SUCCESS** e [PDF Renderer Visual QA #44109802728](https://github.com/tuliust/PortfolioTulius/actions/runs/44109802728) **SUCCESS**: quatro variantes visuais sem falhas, experiências em fluxo sem sobreposição, foto de Contato Desktop com `object-fit:contain`, retratos de Depoimentos ≥72 px, fontes das citações ≥16 px e espaço acima do texto ≥19 px. A QA física produziu **quatro PDFs completos com 13 páginas cada** e **dois PDFs parciais com quatro páginas**, todos **PASS**, texto pesquisável, links Hero/Contato e ausência da fixture no build produtivo. Vercel `dpl_2CnrqHqyCiMi1cdRRz3Kj92HPXQZ` estava **READY** para o mesmo SHA.

A fixture passou a incluir um **teste negativo específico da prévia Mobile**: uma foto de Depoimentos é propositalmente apontada para URL local inexistente e o browser verifica que a prévia mantém 13 seções e o conteúdo visível, não sinaliza prontidão para impressão e mostra diagnóstico da seção. Este ensaio não envolve imagens da produção. O resultado específico do novo teste precisa ser aferido no workflow do SHA que o contém. A falha relatada pelo proprietário pode envolver mídia efetivamente indisponível; nenhuma foto ou URL do Supabase foi alterada. A aceitação visual com dados reais ainda depende de nova conferência do proprietário.

### Evidência aprovada da correção PDF — SHA 03e8593, 17/11/2026

- **Validate** [#44110285035](https://github.com/tuliust/PortfolioTulius/actions/runs/44110285035) — **SUCCESS**.
- **PDF Renderer Visual QA** [#44110285056](https://github.com/tuliust/PortfolioTulius/actions/runs/44110285056) — **SUCCESS**: as quatro variantes de dispositivo/paleta sem falhas de layout; retrato completo em Contato Desktop, seis experiências consecutivas e sem `sticky`, depoimentos com retratos ≥72 px, citações de 16 px e margem acima de pelo menos 19 px.
- **QA negativa de imagem Mobile** — **PASS**: uma imagem da seção Depoimentos foi substituída por URL inexistente somente na fixture; a prévia permaneceu visível com 13 seções, a seção defeituosa foi identificada e `data-pdf-export-ready` permaneceu falso (nenhuma impressão de documento incompleto).
- **PDF físico nativo** — **PASS em seis arquivos**: Desktop Original/Clean e Mobile Original/Clean produziram exatamente **13 páginas cada**; seleções reduzidas Desktop Original e Mobile Clean produziram **4 páginas cada**. `pdftotext` confirmou texto extraível; `pdftohtml`, links Hero/Contato. A fixture não foi publicada no build.
- **Vercel Production** — deployment `dpl_3MvmPufUjJyhzRgLmHtWYAvB37gD` **READY** no SHA `03e8593`. Nenhum deploy manual.

**Limites do aceite:** todos os testes de PDF acima usaram fallback e Trajetórias sintéticas; o novo tratamento de erro preserva a prévia se um arquivo produtivo continuar efetivamente indisponível, mas **não repara a URL ou o objeto Storage**. Nenhuma mídia, Auth, RLS, migration ou dado foram alterados. Uma nova verificação do administrador com as mídias reais é necessária antes de declarar o aceite final da frente. O P3 global anterior de `0f35253` permanece **FAILURE** por LCP mobile **3.627,575 ms** (meta ≤3.500 ms), embora as rotas públicas tenham passado; risco separado, não reclassificado.

## Homologação complementar solicitada — impressão em nova aba (17/11/2026)

O proprietário observou **páginas aparentemente vazias no diálogo de impressão**, com a impressora física HP selecionada, além de uma página de Resultados Desktop em retrato, espaço laranja excessivo antes do retrato em Contato e ausência de uma separação explícita entre experiências. A exportação passa a abrir impressão em **aba de nível superior**, reproduzindo o contexto usado pela QA física, e `preparePdfPrintLayout` remove regras `@page` pré-existentes **antes de medir** para evitar crescimento cumulativo durante eventos repetidos `beforeprint`. A prova final deve verificar orientação por página, existência de texto em cada página, contagem 13/13 e 4/4, margens de Contato e divisórias. O navegador não permite ao aplicativo trocar o destino de uma impressora física pelo PDF; indicar ao usuário que selecione **Salvar como PDF**. Esta mudança não equivale a homologação manual no diálogo de impressão do computador do proprietário.

**Ajuste físico de orientação, 17/11/2026:** no ensaio #44118190110, Resultados Desktop teve 1444 px de altura com largura 1440 px. Foram compactadas lacunas e margens **somente** no modo Desktop do PDF para manter paisagem, preservando os indicadores. Contato passou a aceitar página compacta com mínimo de 650 px, próxima à composição de 740 px, eliminando a faixa vazia debaixo do retrato. Deve ser comprovado em nova QA física por página e pelo SHA da implementação.

**QA ampliada (17/11/2026):** `scripts/pdf-export-pdf-smoke.mjs` passa a ler com `pdfinfo -f/-l` **a dimensão de cada folha física** e exige paisagem para **todas** as páginas Desktop, retrato para **todas** as páginas Mobile. Além de título na página esperada, exige mínimo de 80 caracteres de texto extraível em cada página, de modo que uma folha branca não passe apenas por contagem total. Mantidas as verificações de contagem, links Hero/Contato e exportações parciais. Aprovação depende do resultado da execução desse contrato por SHA.

**Paridade de eventos de impressão:** a fixture Chromium agora registra e executa `beforeprint` pelo mesmo `PdfPrintReady` usado na página admin, mesmo após preparação explícita no script de teste. Essa mudança visa capturar regressões de medição/estilo repetidos que `page.pdf()` com `beforeprint` desativado não representava. O CI do SHA vinculado precisa confirmar que as páginas continuam com textos e orientações corretos.

**Correção da fixture de seleção parcial, 17/11/2026:** a QA #44119231539 com `beforeprint` ativo foi **FAILURE em 2/6** porque o script excluía seções manualmente do DOM, mas a prop de seleção do componente de prontidão continuava contendo 13 slugs. Isso **não reproduz a implementação real do admin**; neste a seleção é transmitida pela URL. A fixture passa a ler `sections` na URL e a montar tanto `PdfPortfolio` quanto `PdfPrintReady` com a mesma lista de slugs. A simulação parcial do script é preservada por compatibilidade, porém não deve apagar nós quando a fixture já filtrou os slugs. É necessária nova execução de seis PDFs com `beforeprint` ativo e checagem de orientação/texto físico.

**Critérios visuais automatizados adicionais, 17/11/2026:** a fixture captura também a seção Contato, registra a altura do layout e a diferença vertical entre a caixa da fotografia e a base do quadro, exigindo no Desktop altura não superior a 820 px e diferença ≤4 px. Para as cinco experiências seguintes, verifica filete de separação de pelo menos 2,5 px, com borda em escala de cinza na variante Clean. São verificações geométricas, não substituem a homologação óptica das transparências da mídia real.

**Detalhe de margem inferior de Contato, 17/11/2026:** o ensaio no SHA `8c82387` teve [PDF QA #44120031337](https://github.com/tuliust/PortfolioTulius/actions/runs/44120031337) **SUCCESS**: quatro versões completas de 13 páginas, duas parciais de quatro, orientações validadas individualmente, conteúdo textual em todas as páginas, cinco divisórias 3 px por paleta e foto Contato com `contain`. A revisão detectou que a regra `overflow:clip` ainda poderia ocultar os 52 px de translação da fotografia, apesar da geometria aprovada; foi trocada por `overflow:visible`. Também removidos 8 px de reserva física apenas em Contato Desktop; a nova QA verifica o overflow efetivo. A eficácia visual real requer inspeção do arquivo com mídia produtiva.

## Aceite técnico da revisão PDF — 17/11/2026

**Implementação:** SHA funcional [`dc112c7`](https://github.com/tuliust/PortfolioTulius/commit/dc112c7d7395c432998c7a27fc5b72a274a23aa6) na `main`. A publicação automática de produção Vercel `dpl_5NtvKhseB1mwohceFXLcHNUZnGbm` foi verificada **READY** para o mesmo SHA, sem deploy manual.

**CI por SHA:** [Validate #44120435368](https://github.com/tuliust/PortfolioTulius/actions/runs/44120435368) **SUCCESS**; [PDF Renderer Visual QA #44120435319](https://github.com/tuliust/PortfolioTulius/actions/runs/44120435319) **SUCCESS**; [Export Docs #44120435275](https://github.com/tuliust/PortfolioTulius/actions/runs/44120435275) **SUCCESS**.

**Resultados do ensaio sintético em Chromium:**
- Cinco verificações visuais **PASS**: Desktop/Mobile × Original/Clean e falha proposital de uma imagem Mobile. No Desktop, a foto de Contato tem `object-fit:contain`, `overflowY:visible`, composição de 740 px e translação inferior de 52 px; a página física correspondente mede **1440 × 792 CSS px**, sem reserva extra. As cinco experiências seguintes têm borda superior de **3 px**: laranja no Original, cinza no Clean.
- Seis arquivos PDF físicos **PASS**: quatro PDFs integrais com 13 páginas e duas seleções parciais com quatro páginas; nenhuma página vazia segundo `pdftotext`/título esperado (mínimo de 80 caracteres por folha), texto pesquisável, links Hero/Contato e orientação física verificada em cada página via `pdfinfo`.
- **Todas as páginas Desktop em paisagem** (inclusive Resultados de 1440 × 1375 px); **todas as páginas Mobile em retrato**, com páginas de alturas individuais, sem perda dos indicadores.
- O evento `beforeprint` real passou a ser exercitado nos ensaios, incluindo seleções parciais com os mesmos slugs enviados ao componente de prontidão, prevenindo conflito entre os 13 slugs gerais e os quatro selecionados.
- A impressão do botão administrativo passou do iframe escalado para uma **aba protegida de nível superior**, com abertura automática do diálogo após prontidão e botão alternativo visível fora do papel. A aplicação não escolhe o destino da impressora: no Chrome, o usuário deve marcar **Salvar como PDF**; impressoras físicas (por exemplo, HP) podem impor tamanhos de papel que não reproduzem estas páginas variáveis.

**Limites:** a QA utilizou fallback editorial e Trajetórias sintéticas, não um ensaio manual com a conta autenticada e o conjunto integral de mídias de produção do proprietário. A orientação e ausência de folhas vazias foram comprovadas no motor Chromium do CI, mas o diálogo/driver de impressora local do proprietário não foi controlado nem homologado. A frente permanece pendente de aceite visual final do proprietário com seu PDF salvo. Nenhum CMS, Auth, RLS, Storage, migration ou conteúdo público foi alterado.

## Nova evidência de homologação PDF — 17/11/2026

As capturas do proprietário mostram 13 páginas identificadas no Chrome, mas algumas sem conteúdo visível (somente fundo branco, laranja ou preto), e a prévia Mobile recusando geração pela imagem de **Sobre**. Consulta somente leitura confirmou o `content_blocks` publicado de Sobre referenciando `a46a4091-bce1-4345-a17f-7d7947a8e903-tulius_tablet.png`; `storage.objects` e `media_assets` comprovam a existência do objeto catalogado no bucket público. Isso **não comprova** sua resposta HTTP no dispositivo do proprietário. O bug demonstrado pelo código é a dependência de IntersectionObserver para definir `src` no elemento mobile e a validação antecipada de `naturalWidth` pelo PDF. A exportação passa a usar `src` imediato, sem mudar o site público.

A geração já instalava regras de páginas antes de chamar `window.print()`, mas seu listener `beforeprint` removia e recalculava as mesmas regras. O ajuste agora mantém a instância do estilo previamente instalado. A QA passa a emitir uma segunda vez `beforeprint` e exigir a mesma instância de CSS, além das verificações de páginas, orientações, links e texto. **A eficácia no diálogo gráfico do Chrome continua não confirmada até nova homologação do proprietário**; resultados de fixture sintética não são substitutos. Não alterar mídias, RLS, Auth ou Storage para fazer testes.

**QA de regressão específica para a foto publicada de Sobre (fixture isolada, 17/11/2026):** novo caso `deferredAbout=true` monta a mesma referência pública da fotografia de Sobre Mobile, mas intercepta a requisição e responde com uma imagem PNG sintética válida de 1 px, sem depender do Storage real. Verifica que o `src` existe imediatamente, que `loading=eager`, que a imagem foi carregada, que as 13 seções permanecem presentes e que o PDF não acusa falha. O teste anterior de imagem intencionalmente ausente permanece, para assegurar que erros reais não sejam encobertos. O resultado depende de execução do workflow para o novo SHA.

### Evidências da correção de Sobre Mobile e `beforeprint` — 17/11/2026

**SHA funcional:** [`0dff93c`](https://github.com/tuliust/PortfolioTulius/commit/0dff93c4fca20900940a5b04d23953cbce2c5c8d). **CI no mesmo SHA:** [Validate #44125335798](https://github.com/tuliust/PortfolioTulius/actions/runs/44125335798) **SUCCESS**; [PDF Renderer Visual QA #44125335756](https://github.com/tuliust/PortfolioTulius/actions/runs/44125335756) **SUCCESS**; [P5 Admin Read-Only #44125336505](https://github.com/tuliust/PortfolioTulius/actions/runs/44125336505) **SUCCESS**; [Export Docs #44125335782](https://github.com/tuliust/PortfolioTulius/actions/runs/44125335782) **SUCCESS**.

A QA visual contém **seis cenários PASS**: quatro variantes, falha sintética intencional de Depoimentos e novo caso `deferredAbout=true`. Neste último, a URL da imagem publicada de Sobre foi interceptada para responder com um PNG sintético válido; foram comprovados 13 setores montados, `src` definido, `loading=eager`, `naturalWidth>0`, nenhuma mensagem de erro e prontidão de exportação. A simulação de imagem realmente indisponível continuou **PASS**, bloqueando geração incompleta. A QA física gerou **seis PDFs PASS**: quatro integrais com **13 páginas cada** e dois parciais com **quatro páginas**. Os PDFs preservaram texto extraível, links e orientação individual de páginas, sem folhas vazias segundo os critérios automatizados. Um evento `beforeprint` adicional preservou a **mesma instância** do estilo de páginas preparado.

**Vercel produção**: `dpl_3t4VCFgBEy6KDiXxxSJZLqLqPgb7` **READY** para o SHA funcional. Não foi executado deploy manual. O [P3 Lighthouse #44125335814](https://github.com/tuliust/PortfolioTulius/actions/runs/44125335814) ainda estava **em execução** no momento desta checagem, sem atribuição de sucesso/falha. O bug de `DeferredAboutTablet` foi corrigido somente no PDF; a disponibilidade da mídia real no navegador do proprietário e o comportamento do diálogo gráfico do Chrome ainda aguardam **nova homologação**. Não ocorreu qualquer mutação em CMS, Storage, Auth ou RLS.


## Correção da paginação após PDFs reais reprovados — 17/11/2026

Os PDFs enviados pelo proprietário apresentam páginas vazias, sobreposição, conteúdo fora de seção e quebra de depoimentos. A QA com fixture sintética anterior não homologa esses PDFs reais.

Intervenção exclusiva de PDF: `pdf-print-layout.ts` deixa de aplicar páginas `@page` nomeadas com alturas variáveis e utiliza folhas físicas de tamanho fixo por dispositivo (Desktop 1440×900 px, Mobile 390×844 px). Cada seção inicia uma folha e conteúdos longos podem continuar em outras folhas. O manifesto representa quantidade de seções, não folhas físicas. A fixture agora simula Trajetórias longas e o smoke verifica orientação por folha, conteúdo por folha, ordem de títulos e links, inclusive seleções parciais.

**Aceite produtivo pendente:** testes CI e homologação Chrome gráfico com dados reais precisam de verificação por SHA. Não foram alterados CMS, banco, Auth, RLS, Storage, mídias nem estilos da página pública.
**Ajuste da seleção parcial na QA:** o teste de links do Perfil deve considerar todas as folhas de sua seção até o início da seção selecionada seguinte, e não presumir a presença de Sobre. O primeiro ensaio com páginas estáveis passou nas quatro variantes integrais e na seleção Desktop, mas falhou na seleção Mobile parcial por essa assertiva; o run anterior permanece `FAILURE` e nova execução deve comprovar o resultado.

## Diagnóstico do PDF Desktop emitido por driver Windows — 17/11/2026

O documento do proprietário tem 19 folhas A4 em retrato, produtor **Microsoft: Print To PDF**, conteúdo girado e todas as informações de texto convertidas em imagens; não existem hyperlinks PDF. As folhas 12, 14 e 16 estão completamente brancas, enquanto 8 e 10 apresentam fragmentos finais de Trajetória. O PDF é **reprovado**. Como o arquivo foi produzido por driver externo ao fluxo de PDF nativo ensaiado no Chromium, não atribuir suas falhas ao CSS sem reproduzi-las usando **Salvar como PDF** do Chrome.

Mitigação: mensagens direcionadas ao Desktop em `PdfExportPanel.tsx` e `PdfPreviewPage.tsx` exigem o destino correto e distinguem o driver virtual do Windows. Sem mudanças de layout, fontes, mídia, Auth, RLS, Storage ou CMS. A nova exportação gráfica pelo Chrome com conteúdo real continua obrigatória para aceite; CI, publicação e resultado final devem ser registrados por SHA.
## Revisão do PDF Desktop nativo do Chrome — 17/11/2026

O documento Desktop anexo (Skia/PDF do Chrome, 20 folhas) apresentou Sobre com foto baixa e espaço vazio; Resultados nas folhas 3–4; Formação, Ferramentas e Depoimentos com grandes faixas brancas; Invest RS seguido por folha vazia (7); Trajetórias com sobras em folhas isoladas e divisórias laranja entre as experiências; Contato com foto abaixo da coluna dos links. O arquivo tem texto extraível, hyperlinks e tamanho de folha constante de 1440×900 CSS px, diferindo do PDF histórico criado com Microsoft Print to PDF.

A mudança em `src/lib/pdf-print-layout.ts` introduz o ramo exclusivo Desktop de CSS `@page` nomeada e tamanho individual calculado da seção e de seus descendentes visíveis; não força `break-after` após cada seção. Mobile preserva sua implementação. `PdfPortfolio.css` compacta Sobre, reposiciona as fotos de Sobre e Contato e remove divisórias de experiências apenas no PDF Desktop. A QA foi reforçada: Desktop exige uma folha física por seção, último bullet das seis Trajetórias completas, todos os grupos de Resultados e menor altura em Formação/Ferramentas/Depoimentos. O ensaio visual exige a ausência dos divisores apenas no Desktop.

**Riscos e aceite:** CI e publicação exigem conferência pelo SHA final. Não converter a QA sintética em aceite do arquivo produtivo; validar visualmente as 13 seções no Chrome do proprietário. Nenhuma mídia, dado, Auth/RLS/Storage, migration ou componente do site público mudou.
**Primeira QA de folhas Desktop variáveis — SHA `e0cca36`, 17/11/2026:** [PDF QA #44189910963](https://github.com/tuliust/PortfolioTulius/actions/runs/44189910963) = **FAILURE física**, embora as quatro composições visuais, o erro intencional de mídia e a fotografia Sobre Mobile estivessem PASS. A inspeção dos PDFs sintéticos gerados apontou **15 folhas para 13 seções**: Resultados e as seis Trajetórias já cabiam integralmente nas suas folhas; Formação ocupou duas (último MBA separado) e Ferramentas ocupou duas (últimos itens). As folhas Mobile permaneceram como antes. Outra assertiva exigia paisagem em toda folha Desktop e recusou uma Trajetória de 1.520 CSS px de altura; isso contradiz a aprovação atual de alturas variáveis e não caracteriza perda de conteúdo.

**Ajuste complementar:** a medição de Formação e Ferramentas agora inclui espaço para os últimos itens de seus grids na composição impressa, mantendo folhas independentes, de altura não uniforme. O teste de orientação Desktop passa a exigir largura física equivalente a **1440 CSS px**, sem proibir folha mais alta que larga; no Mobile continua exigindo retrato. O CI posterior deve comprovar que o PDF Desktop tem exatamente 13 folhas e que cada folha contém o conteúdo completo. Não declarar aceite sem esse teste.

### Evidência final da revisão Desktop com altura por seção — SHA 595741e, 17/11/2026

- **Código funcional:** [`595741e`](https://github.com/tuliust/PortfolioTulius/commit/595741ecfdb1e2b937e2640b40b8a89d6e73d89c), publicado automaticamente na produção Vercel `dpl_GMQ96ir8yruyTAJGmTfcoAfCcGMP` com estado **READY** no mesmo SHA. Não ocorreu deploy manual.
- **Validate:** [#44190763383](https://github.com/tuliust/PortfolioTulius/actions/runs/44190763383) **SUCCESS**. **Export Docs:** [#44190763366](https://github.com/tuliust/PortfolioTulius/actions/runs/44190763366) **SUCCESS**.
- **PDF Renderer Visual QA:** [#44190763547](https://github.com/tuliust/PortfolioTulius/actions/runs/44190763547) **SUCCESS**. Quatro variantes visuais e dois testes de mídia **PASS**, inclusive ausência de divisórias entre experiências Desktop, sem regressão nas divisórias Mobile.
- **PDF físico sintético:** quatro arquivos completos **PASS**: Desktop Original e Clean com **13 folhas para 13 seções** cada, Mobile Original e Clean com **33 folhas** para 13 seções cada. Duas seleções de quatro seções **PASS**: Desktop **4 folhas**, Mobile **11 folhas**. Não houve folhas vazias na verificação de texto; cada folha Desktop contém a seção correspondente, inclusive o último item de todas as seis Trajetórias e todos os grupos de Resultados. Links e texto pesquisável comprovados.
- **Revisão óptica do artefato CI:** Formação e Ferramentas deixam de transbordar para folhas adicionais; Depoimentos conserva os três depoimentos; Sobre/Contato exibem composição mais curta e fotos deslocadas; folhas têm largura Desktop constante e alturas diferentes. Algumas folhas de Trajetórias longas são fisicamente mais altas que largas — comportamento **intencional** e aceito pelo novo requisito.

**Aceite produtivo:** a QA utiliza conteúdo e imagens sintéticos; **não** substitui a geração autenticada no computador do proprietário com CMS e mídias reais. O modo Mobile e o site público não foram alterados. Sem operações de escrita no Supabase, Storage, Auth/RLS ou migrations.

## Segunda rodada de acabamento Desktop — PDF Chrome/Skia 14 folhas (17/11/2026)

Arquivo físico do proprietário inspecionado: 14 páginas, produtor Chrome/Skia, texto nativo e hyperlinks. A folha 2 contém apenas **Idiomas** (continuação indevida de Perfil); as fotografias de Sobre (folha 3) e Contato (folha 14) não chegam à margem inferior; as experiências nas folhas 6–10 e Ferramentas apresentam sobra branca inferior. O documento é evidência de **FAILURE produtivo** antes da intervenção.

Intervenção isolada no exportador Desktop: `measureDesktopSection` assegura altura mínima de 900 px para Perfil; Sobre usa fotografia de 750 px sem translate negativo e sem reserva extra; cinco experiências são medidas pela base da última das três colunas +72 px, preservando todos os textos; Ferramentas mantém reserva de impressão de 210 px; Contato desloca a silhueta para baixo em +3rem. A QA física agora exige a palavra **IDIOMAS** na folha Perfil; a QA visual mede a fotografia de Sobre junto à base e a posição inferior do retrato de Contato. O modo Mobile não muda.

**Critério de aceite:** validar por SHA a QA visual e a QA física das seis variantes; depois regenerar o PDF produtivo Desktop para comprovar a inexistência de fragmentos, truncamentos e espaços excessivos. Nenhuma mutação em dados, RLS, Auth, Storage, migrations ou mídias. Não considerar a alteração aceita somente porque Vercel está READY.
**Primeiro ensaio da segunda rodada — SHA `cd06636` (17/11/2026):** [PDF Renderer QA #44203820460](https://github.com/tuliust/PortfolioTulius/actions/runs/44203820460) = **FAILURE** porque a redução de altura baseada nas três colunas criou cinco folhas vazias adicionais após as cinco primeiras experiências. Os quatro modos visuais e as duas provas de mídia passaram (`PDF_VISUAL_QA_SUMMARY failures=0`): foto Sobre `aboutBottomGap=0` e retrato Contato `contactBottomGap=-48` no DOM; Mobile manteve seu comportamento. O [Validate #44203820427](https://github.com/tuliust/PortfolioTulius/actions/runs/44203820427) falhou somente por formatação de uma linha em `pdf-print-layout.ts`, corrigida no SHA seguinte.

O PDF sintético físico foi inspecionado: a altura compactada ficou menor que a caixa de impressão da grid devido ao `padding-bottom` original de ~86 px, causando uma folha vazia após cada experiência, embora todo o texto estivesse na primeira. A correção retira **apenas para as cinco experiências Desktop em questão** o padding inferior herdado e aumenta a reserva medida de 72 px para 96 px. Não alterar CDI, fotos, fontes, mídias ou outras seções; exigir novo PASS físico de 13 páginas sem perda de conteúdo antes de homologar.

### Evidência física da segunda revisão Desktop — SHA `fd4f273` (17/11/2026)

- **Commit de código e documentação:** [`fd4f273`](https://github.com/tuliust/PortfolioTulius/commit/fd4f2739d3cb4cfec9e7d88aee0a460b81fcd1e3). **Validate [#44204504937](https://github.com/tuliust/PortfolioTulius/actions/runs/44204504937) SUCCESS**; **Export Docs [#44204504932](https://github.com/tuliust/PortfolioTulius/actions/runs/44204504932) SUCCESS**.
- **PDF Renderer Visual QA [#44204504733](https://github.com/tuliust/PortfolioTulius/actions/runs/44204504733) SUCCESS** — seis cenários visuais, incluindo bloqueio de mídia ausente e carregamento de Sobre Mobile, sem falhas. Fotos de Sobre e Contato alinhadas à base da composição PDF Desktop na fixture.
- **PDF físico sintético:** Desktop Original **13/13 folhas PASS**, Desktop Clean **13/13 PASS**, seleção parcial Desktop **4/4 PASS**. Mobile Original e Clean **33 folhas PASS**; seleção parcial Mobile **11 folhas PASS**. Todos com texto, ordem de títulos e links nativos. O Perfil Desktop inclui **IDIOMAS** na própria folha, as cinco experiências cabem integralmente em suas respectivas folhas e a sexta experiência permanece íntegra.
- **Geometria da fixture Desktop após correção:** o rodapé branco das cinco primeiras experiências passou a ter aproximadamente 99 CSS px medidos a partir do último texto (na fixture longa); a folha Ferramentas foi reduzida de 800 para 731 CSS px. A comparação com o PDF anterior do usuário não é um diff direto porque a fixture tem dados sintéticos.
- **Vercel:** deployment automático de produção `dpl_DQ4GySqeyUbmy5uoiVZf5Adx2rZS` em estado **READY**, associado exatamente ao SHA `fd4f273`. Não houve deploy manual.

**Limitação obrigatória:** resultados aprovam a fixture Chromium, **não** o PDF físico com os 13 setores e mídias reais. É necessária nova exportação Desktop Original no Chrome do proprietário para conferir foto de Sobre, foto de Contato e espaços residuais, sem encerrar a homologação produtiva por antecipação. Audit P3 Lighthouse é controle de performance independente e não participa do aceite desta diagramação; seu estado deve ser consultado por SHA.


## Ajuste adicional solicitado — acabamento inferior do PDF Desktop (17/11/2026)

O proprietário apontou uma faixa laranja ainda visível sob os retratos nas páginas **Sobre (2)** e **Contato (12)** e espaço inferior residual nas **seis experiências (páginas 5 a 10)**. O problema de medição é que a posição final de uma imagem transparente deslocada pode aumentar a altura do próprio papel: transladar o retrato sem separar essas medidas mantém a faixa inferior. O exportador Desktop passa a medir Sobre e Contato pela caixa do grid editorial (Contato mantém reserva fixa de 56 px, independente do novo deslocamento da imagem). O PNG de Sobre recebe compensação de 24 px e o de Contato de 72 px no CSS **exclusivo de PDF**, sem recortar ou substituir os arquivos.

As seis experiências, inclusive CDI, usam como base a maior das três colunas de texto, com reserva reduzida de 96 para **64 CSS px** e remoção do padding inferior herdado, para retirar apenas parte do vazio sem reduzir fonte ou conteúdo. A QA visual verifica os novos deslocamentos de caixas; a QA física precisa continuar confirmando 13 folhas Desktop, títulos, último conteúdo de Trajetória e hyperlinks. **Este registro documenta o código solicitado, não afirma homologação produtiva ou ausência de transparência residual nos PNGs reais.** Sem mudanças no renderer público, Mobile, CMS, Supabase, Storage, Auth, RLS, migrations ou deploy manual.

**QA física da primeira tentativa (`1f50d25`):** PDF Renderer Visual QA [#44211090712](https://github.com/tuliust/PortfolioTulius/actions/runs/44211090712) = **FAILURE**. As seis verificações visuais foram **PASS**, mas o Original Desktop gerou 15 folhas e o Clean Desktop 14 (esperado: 13); seleção parcial Desktop 5/4. No PDF sintético inspecionado, Resultados deslocou seu grid inteiro para uma segunda folha no Original, Depoimentos dividiu o fim de uma citação, e Contato produziu uma folha vazia posterior em ambos. Mobile permaneceu PASS (33 folhas integrais / 11 parciais). O Validate desse SHA foi **FAILURE por formatação somente**, corrigida em `93cb923`, cujo Validate [#44211196112](https://github.com/tuliust/PortfolioTulius/actions/runs/44211196112) foi **SUCCESS**. O ensaio não valida a compactação.

**Correção de paginação complementar:** o Desktop reserva mais espaço em Resultados (+96 px) e Depoimentos (+78 px) para evitar que grupos ou parágrafos indivisíveis ultrapassem a folha, sem mexer em seus textos. Contato passa a recortar **apenas o overflow além da borda física de sua própria seção**, evitando uma folha vazia criada pelo deslocamento de pixels transparentes. A reserva de 64 px nas seis experiências e a compensação das imagens de Sobre/Contato permanecem. Necessária nova QA física de seis modalidades e inspeção produtiva; não reclassificar o ensaio anterior.

### Homologação sintética do acabamento Desktop — SHA `1ffdf2c` (17/11/2026)

- **Funcional + documentação:** [`1ffdf2c`](https://github.com/tuliust/PortfolioTulius/commit/1ffdf2c3bc45b6154c7c4c0d373f1b653af1907f) após ajuste de formatação `93cb923`. [Validate #44212027187](https://github.com/tuliust/PortfolioTulius/actions/runs/44212027187) **SUCCESS**; [Export Docs #44212027028](https://github.com/tuliust/PortfolioTulius/actions/runs/44212027028) **SUCCESS**.
- **[PDF Renderer Visual QA #44212027200](https://github.com/tuliust/PortfolioTulius/actions/runs/44212027200) SUCCESS:** seis verificações visuais **PASS**, incluindo duas provas de mídia Mobile; as caixas dos retratos no Desktop têm deslocamentos medidos de **-24 px (Sobre)** e **-72 px (Contato)** relativos à base dos respectivos grids. Esses valores do DOM não medem sozinhos os pixels opacos dos PNGs reais.
- **PDF físico sintético — seis modalidades PASS:** Desktop Original **13/13 folhas**, Desktop Clean **13/13**, seleção Desktop **4/4**; Mobile Original/Clean **33 folhas cada**, seleção Mobile **11**. Textos pesquisáveis, ordem das seções, último texto das Trajetórias, links Hero/Contato e ausência de folhas vazias comprovados. O PDF Original final foi renderizado e conferido visualmente por amostragem nas páginas 2, 5, 10 e 13; a foto da fixture encostou na base colorida das folhas Sobre e Contato, e as seis experiências mantiveram suas três colunas legíveis.
- **Vercel:** produção [`dpl_94NcBzgTxVmSVDKMY13R8RmVRmNM`](https://vercel.com/tuliust/portfolio-tulius/94NcBzgTxVmSVDKMY13R8RmVRmNM) **READY** no SHA funcional `1ffdf2c`; sem deploy manual. Auditoria P3/Lighthouse do mesmo SHA estava **em execução** na leitura, não representa o aceite desta alteração de impressão.

**Limite do aceite:** o resultado é da fixture Chromium com dados e retratos sintéticos, não o PDF autenticado gerado com conteúdo/mídias reais no Chrome do proprietário. Nas capturas reais, o acabamento inferior deverá ser novamente observado e o PDF salvo em **Salvar como PDF**, margens nenhuma, gráficos de segundo plano ligados, sem cabeçalhos/rodapés. Não afirmar que as fotos reais estão pixel a pixel na borda sem essa conferência, nem converter falhas de CI anteriores em sucesso.

**Auditoria P3/Lighthouse do SHA funcional após conclusão:** [#44212027014](https://github.com/tuliust/PortfolioTulius/actions/runs/44212027014) = **FAILURE global exclusivamente por LCP mobile**: mediana **3.533,666 ms**, acima do limite **3.500 ms**; LCP desktop **966,058 ms PASS**. Navegador e responsividade públicos **PASS**, 38 capturas PASS, RLS e SEO PASS. Esse resultado não deve ser reclassificado nem confundido com a QA PDF, que terminou SUCCESS. O risco de oscilação do LCP já registrado em standby continua, sem intervenção fora do escopo de impressão.


## PDF produtivo recebido — espaçamento sob os retratos (18/11/2026)

Foi inspecionado o PDF Desktop Original de **13 folhas**, produzido por **Chrome/Skia m158** e fornecido pelo proprietário, com conteúdos e fotografias reais. Na imagem rasterizada da página **2 (Olá)**, a última fileira de pixels escuros do retrato termina aproximadamente **7 pt antes da borda física**; na página **13 (Contato)**, a diferença é **16 pt**. A última fileira branca, comum à rasterização da folha, não foi confundida com a faixa laranja sob as fotografias. O documento não deve ser commitado nem publicado.

O ajuste localizado altera apenas a translação das imagens no renderer PDF Desktop: Sobre **24→36 px** e Contato **72→96 px**. O tamanho de página e o algoritmo de medição já homologado permanecem iguais. O smoke visual passa a aferir a nova posição das caixas no DOM e que Contato continua com overflow recortado. Exigir **Validate, QA visual/física e a verificação do arquivo real regenerado** para concluir; até lá, o teste sintético não confirma a eliminação integral do espaçamento real. Mobile/site público, mídias, CMS, banco, Auth/RLS/Storage e migrations não foram modificados.

### Evidência da revisão de transparência dos retratos — SHA `bcbe360` (18/11/2026)

- **Commit funcional/documental:** [`bcbe360`](https://github.com/tuliust/PortfolioTulius/commit/bcbe360e41866d49e710545f1f9def9c7cf3b122). [Validate #44213707007](https://github.com/tuliust/PortfolioTulius/actions/runs/44213707007) **SUCCESS**; [Export Docs #44213707116](https://github.com/tuliust/PortfolioTulius/actions/runs/44213707116) **SUCCESS**; [PDF Renderer Visual QA #44213706986](https://github.com/tuliust/PortfolioTulius/actions/runs/44213706986) **SUCCESS**.
- **Geométrico/visual:** seis cenários da fixture **PASS**; deslocamento da caixa de fotografia na exportação Desktop é **-36 px** relativo ao grid de Sobre e **-96 px** no grid de Contato. A regra `overflow: clip` de Contato foi verificada. A janela de prévia Mobile, inclusive imagem de Sobre e erro intencional de mídia, permanece íntegra.
- **PDF físico sintético:** Desktop Original **13/13 folhas**, Clean **13/13** e seleção Desktop **4/4**; Mobile Original e Clean **33 folhas** e seleção Mobile **11**, todos **PASS**, com texto/links e títulos por página íntegros. Medição raster extra após a execução, na faixa central dos retratos da fixture: última linha escura a **2 pt** da borda da folha Sobre e **1 pt** em Contato, com último pixel branco de rasterização do Chrome. Não existe faixa laranja residual identificada nessas imagens sintéticas.
- **Publicação:** deployment Vercel automático de produção `dpl_AoMRgJHiTFcxMtb9YBCDsVqFijX8` **READY**, vinculado ao código do SHA `bcbe360`; não foi executado deploy manual. Auditoria P3 do SHA deve ser registrada separadamente quando concluída, sem atribuir antecipadamente sucesso.

**Não homologado produtivamente:** o PDF que motivou a correção é anterior ao SHA novo; a rasterização da fixture **não** demonstra ainda que os PNGs reais encostam exatamente no limite físico. O proprietário deve regenerar **Desktop Original**, com **Salvar como PDF** do Chrome, margens nenhuma, fundo ligado e cabeçalhos/rodapés desativados, para conferir páginas **2 (Olá)** e **13 (Contato)**. O arquivo enviado pelo proprietário não foi versionado nem compartilhado como artefato público.

**Auditoria independente P3 do mesmo SHA funcional `bcbe360`:** [#44213706967](https://github.com/tuliust/PortfolioTulius/actions/runs/44213706967) = **FAILURE global exclusivamente no LCP mobile**, mediana de **3.646,140 ms** (meta **≤3.500 ms**). LCP desktop **1.001,359 ms PASS**. Verificação de SHA em produção, navegador, responsividade e **38 capturas PASS**. Não há evidência de nexo causal com CSS isolado do exportador PDF, e o risco de variação LCP permanece em standby. A falha não modifica o resultado **SUCCESS** da QA de PDF; não há autorização para alterar o site público ou o orçamento de performance nesta intervenção.


## Revisão da exportação PDF Mobile — PDF Chrome real de 32 folhas (18/11/2026)

O arquivo móvel real do proprietário tem **32 folhas físicas de 390×844 CSS px**, com 13 seções lógicas. Evidências: a prévia inicial apresenta três linhas de cabeçalho e retrato em duas colunas; o impresso empilha imagem e título do Hero, modifica tipografia, distribui resultados em duas colunas, apresenta folhas de continuação quase vazias após Trajetórias nas páginas 12, 15, 18, 21, 26, Ferramentas 28 e Contato 32. Esses problemas não foram capturados na QA antiga porque o Puppeteer emulava um viewport 390 px para a impressão, mas o Chrome do proprietário abre uma aba maior. O PDF real deve permanecer local/privado.

Correção **exclusiva `device=mobile`**: restaurar as regras de breakpoint Mobile a partir do CSS carregado, independentemente da largura externa da aba; avaliar `vw` em unidades `cqw` do contêiner de 390 px; imprimir cada seção com folha `@page` Mobile nomeada e altura medida a partir do conteúdo efetivo, sem cortar textos. Título do sobrenome não pode deixar letra isolada. Teste físico ganha variante **Mobile em aba larga de 1440 px**; continua verificando fontes/links, ordem e integridade da última Trajetória em cada uma das seis experiências. Critério: **13 folhas para 13 seções**, sem páginas órfãs, mesmo em aba larga; modo Desktop integralmente intocado. Não alterar CMS, Auth/RLS/Storage, migrations, mídias ou site público. A documentação da intervenção precede resultados de CI; resultados devem ser apurados por SHA.


**Primeiro teste físico da paginação Mobile por seção — `e2eaffe` (18/11/2026):** Validate [#44217192255](https://github.com/tuliust/PortfolioTulius/actions/runs/44217192255) **SUCCESS**, QA visual **6/6 PASS**, mas QA PDF [#44217192276](https://github.com/tuliust/PortfolioTulius/actions/runs/44217192276) **FAILURE**: Mobile Original/Clean e Mobile em aba 1440 produziram **14 folhas para 13 seções**; a inspeção dos PDFs sintéticos identificou uma única folha extra após Sobre, contendo apenas a última linha do texto do segundo painel. Desktop Original/Clean permaneceram **13/13 PASS**, Mobile parcial **4/4 PASS**. A correção acrescenta reserva de impressão somente à folha Mobile Sobre (**144 px**, versus 48 px nos demais grupos), sem alterar conteúdos ou regras Desktop. Exigir nova QA física antes do aceite.


**Segunda QA sintética — SHA `be925bf` (18/11/2026):** [PDF Renderer QA #44217668249](https://github.com/tuliust/PortfolioTulius/actions/runs/44217668249) = **FAILURE física**, apesar de seis verificações visuais PASS; a seleção Mobile parcial e o PDF Mobile em aba larga tiveram **4/4** e **13/13 folhas**, respectivamente, mas o Mobile normal original e Clean mantiveram **14/13**. O aumento de papel na seção Sobre também aumentou a fotografia: sua altura vinha de `clamp(..., 55svh, ...)` e o Chrome recalculou `svh` pela **nova folha física**, consumindo o espaço acrescentado. O desktop permaneceu **13/13** nos dois esquemas.

**Correção complementar:** as regras móveis copiadas das media queries têm `vw` fixado ao contêiner de 390 px e agora também fixam **`svh`/`dvh`/`vh` à viewport de referência de 844 px**, evitando que o tamanho do papel altere o tamanho do retrato e cause realimentação da paginação. O papel de Sobre conserva reserva moderada de 72 px. A fixture QA ganha o modo `editorial360=true` do Perfil (com o título Conexões/Autênticas/Inovação), nas versões iframe 390 px e aba 1440 px, em adição às variantes já existentes. Critério segue um papel por seção, inclusive o Hero editorial, sem alterar um byte do cálculo Desktop.


**Inspeção de páginas físicas Mobile da QA sintética `8a93d36` (18/11/2026):** [PDF Renderer #44218352466](https://github.com/tuliust/PortfolioTulius/actions/runs/44218352466) **SUCCESS**, nove PDFs físicos **PASS** (Desktop Original/Clean e parcial; Mobile Original/Clean, aba larga e variantes editorial360 em ambas larguras, mais parcial), 13/13 folhas para todas as seleções integrais, 4/4 nas parciais. Seis capturas de base e cenários de mídia PASS. O PDF sintético de Perfil editorial confirmou visualmente o sobrenome inteiro e o título em três linhas; a segunda folha de Sobre contém integralmente o último parágrafo. A fixture não reproduz mídias reais nem representa homologação do PDF enviado.

**Acabamento da última área vazia:** a inspeção geométrica da fixture identificou que em abas externas de 1440 px as **posições impressas do texto eram idênticas** às de uma aba de 390 px, mas as folhas de Resultados/Experiências/Depoimentos eram maiores devido a alturas `scrollHeight` e caixas vazias calculadas **antes da impressão**. A medição Mobile passa a buscar o último **elemento-folha realmente renderizado**, mais margem de segurança de 64/72 CSS px, em vez de aceitar o tamanho inflado do grid/contêiner. A cor de fundo do espaço inferior de Sobre segue o segundo painel grafite em vez de criar uma faixa laranja. A QA física passa a reprovar alturas que mudem com a largura da aba externa, além de exigir 13/13 folhas. Escopo exclusivo Mobile do PDF; Desktop continua congelado.


**Nova assertiva de paridade no SHA `6600cfa` (18/11/2026):** [PDF Renderer QA #44219125343](https://github.com/tuliust/PortfolioTulius/actions/runs/44219125343) = **FAILURE** apesar de 13/13 folhas Mobile na referência de 390 px e em aba de 1440 px separadamente, e Desktop 13/13. A QA passou a comparar **alturas de cada uma das 13 folhas**, detectando diferenças no Mobile entre aba estreita e larga (até 489 pt em Resultados). Os textos físicos de ambas saíam nas mesmas posições; a altura sobrava porque algumas regras base do CSS do **próprio exportador** ainda usavam `vw` da janela externa antes da impressão. A correção aplica também às regras base com `vw` a conversão para `cqw`, antes das regras responsivas de 390 px. O teste de paridade permanece habilitado, sem relaxar tolerância ou atribuir PASS até nova execução.


### Regressão física identificada no SHA `da91859` e correção (18/11/2026)

- [Validate #44219597639](https://github.com/tuliust/PortfolioTulius/actions/runs/44219597639): **FAILURE** por formatação de uma única expressão de `normalizedBaseRules.push`.
- [PDF Renderer QA #44219597751](https://github.com/tuliust/PortfolioTulius/actions/runs/44219597751): **FAILURE**, seis das nove variantes físicas (os dois Desktop continuaram com 13/13 folhas). O PDF Mobile sintético tinha 13 folhas, mas cada experiência aparecia com **três colunas ilegíveis**. Por isso o extrator textual intercalava `INVEST` e `RS` com texto de outras colunas, e não encontrava `INVEST RS` em sequência; a reprovação representava um problema de layout real, não apenas de reconhecimento de título.
- Correção: `ensureMobileReferenceCss` passa a copiar **apenas as propriedades cujo valor inclua `vw`**, transformadas em `cqw`, sem duplicar todo o CSS base nem redefinir `display: block` do Mobile. O teste físico exige explicitamente três regiões **empilhadas verticalmente** no primeiro trabalho (Invest RS) em cada variante Mobile, antes de analisar texto e quantidades de páginas. Permanecem os testes de paridade de alturas 390×1440 px, 13 seções e variante editorial360. Exigir nova execução com `SUCCESS`, sem presumir aceite produtivo por publicação `READY`.


**Refinamento após [PDF Renderer QA #44220674306](https://github.com/tuliust/PortfolioTulius/actions/runs/44220674306) (18/11/2026):** **FAILURE estritamente de paridade de altura**, não mais de layout de experiências. Mobile original/clean, parcial e editorial360 retornaram **13/13** ou **4/4 folhas**, com Experiências empilhadas verticalmente, títulos encontrados e textos preservados. Nas duas versões de aba larga a comparação de papel detectou **41,04 pt extras em Resultados** e cerca de **7,92–8,16 pt extras por experiência**. A correção seguinte congela, também nas declarações de CSS base do PDF Mobile, unidades de altura `vh`/`svh`/`dvh`/`lvh` para a referência 844 px, do mesmo modo já usado nas media queries. Mantém a tolerância rigorosa de 3 pt no comparador e o código Desktop sem alteração. `Validate` do SHA `c0e412b` e Export Docs foram **SUCCESS**; o resultado da QA anterior permanece FAILURE no histórico.

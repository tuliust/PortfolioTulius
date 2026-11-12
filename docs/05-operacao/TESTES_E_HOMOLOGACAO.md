# Testes, CI e homologação
**Status:** roteiro de manutenção · **Revisão:** 11/11/2026.

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

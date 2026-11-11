# P3 — Continuidade da otimização do LCP mobile

## Aviso de vigência — 01/11/2026

Este plano de execução documenta etapas e diagnósticos de performance anteriores ao commit funcional `aa71737e`. **Não usar seus números como última medição nem como autorização para modificar arquitetura, CMS ou infraestrutura.** O resultado consolidado e as limitações do último SHA estão em [P3_LCP_MOBILE_RESULTADOS_2026-10-31.md](P3_LCP_MOBILE_RESULTADOS_2026-10-31.md); o acompanhamento vigente é [P3-PERF-01](OPEN_ISSUES.md).

O objetivo real é **LCP ≤2,5 s no mobile**, sem relaxar gates, alterar fotografia, conteúdo ou tipografia sem necessidade e sem confundir três amostras Lighthouse simuladas com uma medição aplicada ou com p75 real.

---

> **Arquivo legado por assunto:** seções datadas abaixo registram decisões e medições de seus próprios SHAs; não as tratar como status operacional atual.

## Diagnóstico de limitação simulada vs. aplicada e adiamento de SEO (31/10/2026)

**Fase A — instrumento comparável sem alterar o site:** [`f8416fe`](https://github.com/tuliustsangaropulos/PortfolioTulius/commit/f8416fe9fc65e4cdea9ef0cb87fbb0c335297f75) acrescentou `P3_LCP_THROTTLING_COMPARISON` à triagem do Lighthouse 13.5.0 e uma captura mobile suplementar com `--throttling-method=devtools`, explicitamente **não bloqueante**. A auditoria [P3 #41207318806](https://github.com/tuliustsangaropulos/PortfolioTulius/actions/runs/41207318806) passou: mediana simulada LCP mobile **4,084 s**, mediana LCP observada sem limitação **0,504 s** (amostras 2 e 3 com 0,504 s; amostra 1 teve 2,326 s sob carga elevada), e LCP com limitação real **3,241 s** (uma amostra). A diferença é esperada porque a simulação do Lighthouse usa 4× de CPU e modelo de rede móvel; a decomposição `lcp-breakdown-insight` usa eventos do carregamento observado. **Não somar durações observadas para explicar a métrica simulada.** A captura `devtools` também é laboratório, não dado real de usuários p75.

**Fase B — experimento de rede não crítica:** [`e6018f4`](https://github.com/tuliustsangaropulos/PortfolioTulius/commit/e6018f4a95ccfd382f97be7458fe8d02f622e690) adiou apenas os dois requests PostgREST de SEO (`pages`, `site_settings`) para depois de a montagem inicial do Perfil ter sido concluída e o navegador ter tido oportunidade de pintar. As cinco consultas essenciais para o conteúdo editorial, os depoimentos, o retrato WebP, os filtros CMS, Auth/RLS e a visualização administrativa ficaram inalterados. O SEO inicial já é emitido em `index.html` por `generate-seo.mjs`; a sincronização de meta tags em tempo de execução continua ativa. A prévia autenticada mantém o fluxo anterior imediato.

A auditoria [P3 #41207713084](https://github.com/tuliustsangaropulos/PortfolioTulius/actions/runs/41207713084) **PASS**, [CI #41207713000](https://github.com/tuliustsangaropulos/PortfolioTulius/actions/runs/41207713000) **PASS**. Três amostras mobile: **LCP simulado mediano 3,765 s** (antes 4,084 s; diferença −319 ms), FCP mediano 2,037 s, Performance 86/100, TBT 53 ms, CLS 0,000405. A captura adicional com limitação aplicada deu **3,239 s** (antes 3,241 s, ganho não demonstrado). A primeira dobra em browser sem limitação apresentou `p3:profile-dom-committed=422 ms` e `p3:seo-fetch-start=423 ms`, com a amostra de LCP do retrato em ~432 ms. Isso **confirma início após montagem do DOM, mas NÃO confirma início após o evento LCP**. As requisições SEO foram transferidas para depois da montagem e não foram eliminadas. As 38 capturas de 13 seções/25 painéis, menu, RLS público e rotas administrativas anônimas foram aprovadas sem erros e sem mutações.

**Interpretação cautelosa:** o ganho de mediana no Lighthouse simulado é observável, porém **não comprova ganho causal de usuários reais**; o LCP com limitação aplicada ficou praticamente igual numa única amostra, e houve variação de rede/CPU nos testes. A alteração permanece pela separação verificável entre requisições essenciais e opcionais, não como objetivo cumprido. O site ainda ultrapassa a meta **LCP mobile ≤2,5 s** em 1,265 s na mediana simulada e 0,739 s na única captura aplicada. Não alterar os limites do gate conservador P3, não declarar 2,5 s alcançados, e não executar testes autenticados transacionais na produção.

**Próximas frentes:** priorizar um experimento isolado de *font/CSS delivery* com paridade visual rigorosa e os dois métodos de limitação; investigar consolidação de solicitações REST como proposta arquitetural separada, pois exigiria alteração de API/infraestrutura ou schema não autorizada. Capturar p75 de campo apenas se houver base de dados suficiente e autorização para mensuração.

**Data:** 31/10/2026. **Repositório:** `tuliustsangaropulos/PortfolioTulius`. **Situação:** desempenho mobile ainda acima da meta; alterações funcionais validadas e experimento sem ganho revertido.

## Experimento: adiar miniatura pesada da seção Sobre (31/10/2026)

Implementado em [`521bd55`](https://github.com/tuliustsangaropulos/PortfolioTulius/commit/521bd551e96b7957596f6cc609e3c60bf817bbdc), com formatação CI em [`11d0dac`](https://github.com/tuliustsangaropulos/PortfolioTulius/commit/11d0dac737e403545f4f0d51320fe9bb5790dbeb). A miniatura CMS `a46a4091-...-tulius_tablet.png` (900×1200, ~399 KB) agora só recebe `src` quando fica a até 600 px da viewport; reserva sua proporção 900×1200, mantém `alt`, estilos, original no Supabase e fallback sem IntersectionObserver. Somente a URL publicada e aprovada recebe o tratamento; outros itens e futuras trocas no CMS continuam com a lógica anterior.

**Duas auditorias P3 completas, antes e após a correção de formatação:**
- [#41203650367](https://github.com/tuliustsangaropulos/PortfolioTulius/actions/runs/41203650367): PASS, mobile LCP mediano **4,379 s**, Performance **76**, desktop LCP **1,068 s**.
- [#41203713347](https://github.com/tuliustsangaropulos/PortfolioTulius/actions/runs/41203713347): PASS, mobile LCP mediano **4,208 s**, Performance **84**, desktop LCP **1,018 s**. O diagnóstico `P3_LCP_CRITICAL_PATH` confirmou `largestOtherImages: []` no mobile: a imagem secundária de ~399 KB deixou de competir pela rede na primeira dobra; não afetou o retrato LCP WebP já existente. `P3_ABOUT_IMAGE_FIRST_FOLD` confirmou `deferred: true`. A auditoria dos 13 blocos desktop, 25 painéis mobile e 38 capturas passou com **0 falhas**, incluindo verificação de carregamento efetivo das imagens quando o painel é visitado. RLS anônimo, rota administrativa não autenticada e interação do menu passaram. [CI #41203713367](https://github.com/tuliustsangaropulos/PortfolioTulius/actions/runs/41203713367) PASS, incluindo testes e build.

**Interpretação:** há economia **verificada** de ~399 KB de transferência inicial no mobile, sem modificação visual ou editorial. O LCP não mostrou melhora consistente frente à referência de **4,093 s** e variou nas duas rodadas, algumas realizadas concorrentemente; portanto **não atribuir ganho de LCP** à mudança. Esta é otimização de payload, **não** conclusão da meta Web Vitals. A pendência `P3-PERF-01` permanece aberta com diferença aproximada de **1,6–1,9 s** para 2,5 s, conforme rodada.

Próxima investigação: correlacionar o LCP **simulado** no Lighthouse com marcas reais `p3:profile-dom-committed` e `p3:profile-image-loaded`; a decomposição `lcp-breakdown-insight` de apenas centenas de milissegundos **não soma** à métrica simulada de ~4 segundos. Isolar estilos e fontes externos somente com testes de paridade e comparação repetida; assinaturas de cache/preflight dependem do Supabase e não justificam alterar RLS, APIs ou infraestrutura.

## Etapa adicional — cliente PostgREST público isolado (31/10/2026)

**Implementado** nos commits `bda10f8` a `47f949d`; o código entregue preserva leitura do CMS pelo PostgREST oficial sem importar os módulos completos de Auth/Realtime/Storage na primeira dobra. O cliente Supabase completo permanece carregado dinamicamente nas rotas administrativas e prévia protegida. O helper `src/lib/public-read.ts` usa a chave publicável existente e as mesmas políticas RLS; **não houve mudança de banco, schema, políticas, contas, arquivos ou configuração Vercel**.

**Verificação de produção:** [P3 #41183307575](https://github.com/tuliustsangaropulos/PortfolioTulius/actions/runs/41183307575), sucesso no commit `d087424`. Na amostragem mobile Lighthouse 13.5.0 (três rodadas), LCP mediano **4,093 s**, FCP mediano **1,986 s**, Performance **85/100**, TBT **25 ms**, CLS **0,000629**. O LCP desktop mediano foi **1,046 s**, Performance **98/100**. O HTML público pré-carrega `public-postgrest` (~5,4 KB transferidos), sem requisitar `supabase-sdk` (~56 KB anteriormente). O teste confirmou `adminRouterRequested=false`, `fullSupabaseSdkRequested=false`, `publicPostgrestRequested=true`, 13 seções, 25 painéis e 38 capturas, nenhuma falha; P5 público/RLS `PASS`, sem operações de escrita. As duas rotas `/admin` e `/admin/preview` anônimas redirecionam à autenticação. **A prévia autenticada transacional não foi testada** (P2 suspenso).

**CI atual:** [Validate #41202307819](https://github.com/tuliustsangaropulos/PortfolioTulius/actions/runs/41202307819), sucesso no commit `47f949d`: formatação, TypeScript, 29 arquivos de testes, build e smoke offline. O smoke diferencia build local sem variáveis Supabase (fallback) do build de produção com CMS. Não há mudança adicional de runtime entre `d087424` e `47f949d`.

**Leitura cautelosa:** ganho aparente de ~298 ms frente à última mediana de 4,391 s, mas uma rodada Lighthouse não comprova causalidade; remoção do SDK inicial e redução de JS requisitado são fatos confirmados. Persistem nove preflights REST, CSS e fontes bloqueantes e uma imagem secundária de ~399 KB (não o LCP, prioridade baixa). Essas hipóteses ainda não justificam retirar autenticação, editar fotografias/cores/fontes ou mudar a arquitetura de atualização instantânea do CMS. **P3-PERF-01 segue ABERTA: falta ~1,593 s para alcançar 2,5 s.** O gate de regressão P3 existente não equivale à aprovação da meta Web Vitals p75 de campo.

## Evolução controlada

| Código / rodada | LCP mobile mediano | LCP desktop mediano | Resultado |
|---|---:|---:|---|
| `494aba3` — referência inicial | 7,704 s | 1,738 s | P3 reprovado por LCP mobile |
| `ae393e0` — preload WebP corretamente sincronizado com o CMS | 4,352 s | 1,044 s | CI e P3 aprovados |
| `27f1024` — retirada apenas do preload administrativo | 4,266 s | 1,150 s | P3 reprovado: import estático administrativo ainda requisitado |
| `2aaf336` — correção efetiva do grupo Rolldown | 4,224 s | 1,025 s | CI e P3 aprovados |
| `ccb1b53` — experimento de montagem progressiva no mobile | 4,334 s | 0,994 s | CI e P3 aprovados; sem ganho demonstrado |
| `87c9348` — reversão do experimento | 4,395 s | 1,081 s | CI e P3 aprovados; interface original preservada |

Medições: três amostras Lighthouse 13.5.0 por execução; mediana, rede e CPU sintéticas. A pequena variação entre 4,224 e 4,395 s **não** é evidência de regressão causal. A redução frente aos 7,704 s iniciais é relevante, mas a meta de **LCP ≤2,5 s continua aberta**. O gate P3 conservador de 6,5 s não substitui a meta Web Vitals.

Evidências: [P3 inicial #41180490449](https://github.com/tuliustsangaropulos/PortfolioTulius/actions/runs/41180490449), [P3 WebP #41181655824](https://github.com/tuliustsangaropulos/PortfolioTulius/actions/runs/41181655824), [P3 router #41182057509](https://github.com/tuliustsangaropulos/PortfolioTulius/actions/runs/41182057509), [P3 progressivo #41182252213](https://github.com/tuliustsangaropulos/PortfolioTulius/actions/runs/41182252213) e [P3 reversão #41182454457](https://github.com/tuliustsangaropulos/PortfolioTulius/actions/runs/41182454457).

## Correções mantidas

1. `scripts/generate-seo.mjs` usa `scripts/portrait-preload.mjs`: conserva o `imagesrcset` WebP 600/900 quando a fotografia CMS corresponde à versão aprovada; caso o CMS publique outra fotografia, o preload acompanha a nova URL. Os cinco testes do helper passaram.
2. `vite.config.ts` deixou o pacote `react-router` fora do grupo vendor inicial e eliminou o grupo manual que contaminava o bundle público. O HTML e o JS da home não requisitam o roteador administrativo; `/admin` permanece protegido e funcional.
3. `src/components/public/PublicSite.tsx` e `scripts/p3-browser-smoke.mjs` registram marcos de primeiro painel e LCP. Nenhum dado editorial, ativo fotográfico, schema, RLS, Auth ou Storage foi modificado.
4. A montagem em duas etapas por `requestAnimationFrame` foi testada, não demonstrou ganho de LCP e foi revertida integralmente, sem manter seus efeitos e dependências extras.

## Gargalo residual e hipóteses a medir

No Lighthouse mobile da rodada `2aaf336`, FCP mediano ~3,078 s e LCP mediano ~4,224 s. A primeira amostra mostrou estimativa de ~1,45 s de recursos bloqueantes para FCP (CSS principal e CSS Google Fonts), **sem economia direta de LCP demonstrada** pelo insight. `unused-javascript` estimou ~72 KiB de JavaScript inicial desnecessário; o chunk `supabase-sdk` apresentou aproximadamente 80,6% de bytes não utilizados nesta amostra. A análise das requisições REST também encontrou preflights CORS e uma imagem secundária de aproximadamente 399 KiB carregada antes do término da navegação.

Esses sinais são **hipóteses de otimização, não efeitos medidos de uma correção**. Evitar simplesmente recomprimir o WebP LCP (29,6 KB), desativar fontes sem comparação, afrouxar gates ou apresentar somente o Perfil vazio. O retrato aprovado e o conteúdo real devem continuar sendo o elemento LCP.

Próxima frente técnica recomendada: avaliar uma alternativa leve **somente para leitura pública de dados publicados**, sem substituir o cliente administrativo autenticado nem alterar RLS. Antes de alterar a arquitetura, instrumentar FCP→LCP, custo de inicialização React/vendor e requisições REST; implementar um único experimento reversível, preservar dados e filtros do CMS, e executar P3 completo no mesmo SHA da Vercel. Um cache HTML estático de conteúdo do CMS sem invalidação editorial não atende ao requisito de atualização imediata.

## Aceites e limites operacionais

- CI, TypeScript, testes, build e smoke devem passar; 13 seções desktop, 25 painéis mobile e 38 capturas sem falhas.
- P5 público continua read-only; P2 administrativo transacional segue suspenso. Nenhum teste de gravação em produção ou staging pago.
- Não tocar em conteúdo publicado, no backup privado, em mídia ou nas decisões de segurança P1.
- Não usar `zoom` global nem `transform:scale()` na raiz. Preservar menu, âncoras, fotografia, fontes e composição editorial.
- Registrar mediana e dispersão do LCP, FCP, TBT, CLS, elemento LCP e SHA. Resultado de laboratório não substitui dados de campo p75.
- O script `scripts/p3-lcp-triage.mjs` inclui diagnóstico `P3_LCP_CRITICAL_PATH`, registrando somente rótulos de recursos e métricas, sem parâmetros de query, credenciais ou conteúdo do CMS.

**Pendência vigente:** `P3-PERF-01` permanece **aberta** até o LCP mobile alcançar ≤2,5 s com integridade da página real.

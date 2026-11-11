# PortfolioTulius — P3: auditoria de qualidade e aceite

## Auditoria P3 — aceite dos badges/CDI/alternância em navegador (31/10/2026)

[Audit P3 #41179623669](https://github.com/tuliustsangaropulos/PortfolioTulius/actions/runs/41179623669) no código [`fb0caebd`](https://github.com/tuliustsangaropulos/PortfolioTulius/commit/fb0caebd98a32568355b4e3069958d664972ae7f): **P3_CMS_COMPETENCIES_MEDIA PASS** (Invest RS, Prefeitura SP, Vale, TV Globo/SporTV, Grupo InPress e CDI: cinco badges cada; slides da CDI apontando para arquivos sem texto; mesma fonte e caixa alta nos botões; "Projetos" maior inicialmente). **P3_EXPERIENCE_SWITCH PASS** (ao selecionar "Trajetória": 24,192 px versus "Projetos" 13,608 px, com retorno ao estado anterior), **P3_PROJECT_GALLERY_LINK PASS**, **P3_BROWSER_AUDIT failures=0**, **P4 38 capturas, 13 seções desktop e 25 painéis mobile, failures=0**, **P5 público 3/3 sem mutações**.

**P6 não aprovado:** LCP mobile mediano **7,725 s**, Performance 68, CLS 0,098, meta ≤2,5 s não cumprida; desktop LCP **1,700 s**, Performance 93 PASS. A workflow P3 termina `failure` apenas pelo gate conservador de performance mobile. Não interpretar a falha como regressão funcional dos badges/CMS/CDI. Preservar `P3-PERF-01` aberta. Versão documental posterior não altera código público.

## Verificação P3 final — vínculo projetos / galeria — 31/10/2026

A [auditoria P3 #41178735154](https://github.com/tuliustsangaropulos/PortfolioTulius/actions/runs/41178735154) do código funcional [`41a96e37`](https://github.com/tuliustsangaropulos/PortfolioTulius/commit/41a96e3715cdc47ee73ab225374cf72b2e739205) confirmou: **P3_EXPERIENCE_SWITCH PASS** (trajetória e retorno aos quatro projetos; sete títulos de tópicos em negrito); **P3_PROJECT_GALLERY_LINK PASS** (clique em "Organização de eventos" seleciona slide 2/4 e avançar pela seta ativa "Plataforma de eventos e relacionamento" também na lista); **P3_BROWSER_AUDIT failures=0** (13 seções desktop/25 painéis mobile), **P4_EDITORIAL_SUMMARY 38 capturas, failures=0**, **P5_PUBLIC_RESULT 3/3 mutations=0**. Verificação do logo sem borda, cinco tags e rolagem interna contextual também passou.

O P6 Lighthouse do mesmo job encerrou como `failure` **somente pelo orçamento de LCP mobile**: mediana **7,628 s**, Performance 69, CLS ~0,098; o LCP era a imagem correta do Perfil (`P6_LCP_CONTENT_GATE PASS`). Desktop LCP **1,725 s**, Performance 93, PASS. Não declarar meta ≤2,5 s atingida. A `main` foi atualizada com documentação posteriormente, sem mudança no código público; CI [#41178828372](https://github.com/tuliustsangaropulos/PortfolioTulius/actions/runs/41178828372) aprovado. Homologação P2 transacional continua suspensa.

## Nova medição P3 durante correções administrativas — 31/10/2026

A [Audit P3 Lighthouse #41173406644](https://github.com/tuliustsangaropulos/PortfolioTulius/actions/runs/41173406644), no SHA de código CMS [`c043375`](https://github.com/tuliustsangaropulos/PortfolioTulius/commit/c04337579f50d07d8437db4e8f02a89c6e17279c), confirmou **P3_BROWSER_AUDIT failures=0**, **P4 13 desktop / 25 mobile / 38 capturas, failures=0**, **P5 público 3/3, mutations=0** e retrato correto como elemento LCP em mobile/desktop. O Lighthouse de três amostras marcou **desktop LCP mediano 1,655 s PASS** e **mobile LCP mediano 7,824 s FAIL**, Performance mobile 70; teto sintético 6,5 s e meta real ≤2,5 s permanecem violados. O workflow terminou `failure` somente pelo orçamento de performance mobile.

Essa é uma medição do SHA `c043375`, anterior apenas ao ajuste de formatação e à documentação subsequente; não há nova auditoria P3 específica do último SHA documental. **Não inferir mudança causal no LCP pela interface do CMS, nem encerrar P3-PERF-01.** O CI do SHA funcional `6913d91` passou integralmente e a Vercel publicou o mesmo código; os commits seguintes são documentais. Nenhuma mutação de Supabase ou alteração de conteúdo público foi realizada nesta rodada.

## Atualização P3/P6 — 29/10/2026: gate corrigido; performance mobile aberta

**SHA funcional:** [`4a8412e`](https://github.com/tuliustsangaropulos/PortfolioTulius/commit/4a8412e93c99db4fae15e57d1e19785581daaf51). [CI #40824692978](https://github.com/tuliustsangaropulos/PortfolioTulius/actions/runs/40824692978) **success**, deployment Vercel Production **READY** no mesmo SHA, [P3 #40824693037](https://github.com/tuliustsangaropulos/PortfolioTulius/actions/runs/40824693037): **failure exclusivamente no orçamento sintético P6 mobile**.

- **Gate GitHub↔Vercel:** o status GitHub `Vercel` ausente em deploys `READY` foi substituído por fingerprint estático `p3-deployment.json` gerado no build com `VERCEL_GIT_COMMIT_SHA`, validado pelo domínio `tulius.work`. O gate **PASS** no SHA correto e permitiu executar Lighthouse completo. Sem secrets ou alteração de configuração Vercel.
- **Preload do retrato:** `scripts/generate-seo.mjs` consulta o bloco publicado `perfil/a` e substitui o preload antigo `/media/tulius-portrait-dark.jpg` pela URL atual de `content_json.items[0].image`. Na ausência de URL confiável, omite o preload remoto; o build Vercel registrou `preload do retrato sincronizado com CMS`. Fotografia e dados não foram alterados.
- **Gate P6 de conteúdo:** agora valida o elemento `img` dentro de `.mobile-profile-hero` / `.profile-portrait` em vez de exigir um nome de arquivo fixo. Isto aceita o PNG publicado no CMS sem aceitar uma página vazia. **PASS** em mobile e desktop.
- **Auditoria funcional:** `P3_BROWSER_AUDIT failures=0`, `P5_PUBLIC_RESULT 3/3 mutations=0`, `P4_EDITORIAL_SUMMARY captures=38 desktop=13 mobile=25 failures=0`. Lighthouse: a11y/SEO/boas práticas 100/100.
- **Lighthouse mediano (3 amostras):** mobile **Performance 69, LCP 7.545,89 ms** (variação 7.203–7.663 ms) e desktop **Performance 94, LCP ~1.607 ms**. O **orçamento P6 mobile de 6,5 s falhou** e a **meta ideal ≤2,5 s segue não cumprida**. Não chamar auditoria global de aprovada.
- **Diagnóstico:** o LCP agora é um PNG público atual do Supabase (a imagem aprovada do Perfil), com sugestão Lighthouse de ~1.008 KiB de economia na entrega de imagens e até ~3,1 s de possível economia de LCP (estimativa Lighthouse, não medida de ganho). Preload reduziu atraso de requisição da amostra inicial de ~947 ms para ~69 ms, mas a mediana de LCP não demonstrou cumprimento do alvo. Próximo passo técnico é obter **uma versão otimizada da imagem real, sem substituí-la nem apagar o original**, validar fidelidade visual e medir no mesmo método. Não habilitar transformação cobrável do Supabase nem alterar CMS/Storage sem escopo autorizado.


**Início:** 28/10/2026. **Critério:** verificar a mesma implementação publicada, sem alterar conteúdo editorial, licenças, dados do CMS ou identidade visual.

> **Aceite automatizado final (28/10/2026): APROVADO.** A [reexecução #40757162085 (tentativa 2)](https://github.com/tuliustsangaropulos/PortfolioTulius/actions/runs/40757162085) confirmou **13 seções, 25 painéis mobile, 38 capturas, 8 viewports e zero falhas**. Veja o [termo específico de aceite automatizado](P3_ACEITE_AUTOMATIZADO_FINAL_2026-10-28.md). A conferência visual humana será realizada em nova frente/novo chat; **LCP mobile ≤2,5 s ainda não alcançado**.

## Resultado P3 automatizado — 28/10/2026, deployment correto

**Situação:** **PASS nos gates automatizados; aceite humano e meta de LCP mobile continuam pendentes.** Execução [Audit P3 Lighthouse #40747019980](https://github.com/tuliustsangaropulos/PortfolioTulius/actions/runs/40747019980), `workflow_dispatch` não utilizado: disparo por `push` de `main` no commit [`e3bfccf467c730cc0a869f2db6addaaf7f65ca14`](https://github.com/tuliustsangaropulos/PortfolioTulius/commit/e3bfccf467c730cc0a869f2db6addaaf7f65ca14), status final **`success`**. O deployment [`dpl_C1YFn6m9iE2Jc5cVjjL1VoKHTydk`](https://vercel.com/tuliustsangaropulos-creates-projects/portfolio-tulius/C1YFn6m9iE2Jc5cVjjL1VoKHTydk) foi confirmado `READY`, mesmo SHA, aliases `tulius.work` e `www.tulius.work`.

**Prova de vinculação do SHA:** o workflow aguardou no GitHub a aprovação do status `Vercel=success` para `e3bfccf` às **18:39:04 UTC**. A medição Lighthouse **mobile** iniciou às **18:39:15.948 UTC** e a **desktop** às **18:39:29.675 UTC**, ambas **depois** do aceite do deployment. Os resultados abaixo pertencem ao site neste deployment; qualquer novo commit documental tem SHA distinto e deve preservar esta referência temporal.

| Indicador Lighthouse 13.5.0 | Mobile | Desktop |
|---|---:|---:|
| Performance | **82** | **97** |
| Acessibilidade | **100** | **100** |
| Boas Práticas | **100** | **100** |
| SEO | **100** | **100** |
| FCP | **2.317,66 ms** | **562,51 ms** |
| LCP | **4.376,20 ms** | **1.262,24 ms** |
| TBT | **57 ms** | **0 ms** |
| CLS | **0,000629** | **0,000126** |

**Contrato público e evidências (PASS):**

- `P3_BROWSER_AUDIT {"failures":0}`: oito viewports, navegação/hash, menu, foco e ausência de overflow; **13 seções e 25 painéis mobile**.
- `P4_EDITORIAL_SUMMARY {"captures":38,"desktop":13,"mobile":25,"failures":0,"badPanels":[]}`: 38 screenshots de painéis inteiros, imagens decodificadas, sem painéis vazios e sem imagens quebradas. A checagem de Contato a 320 px preservou três valores em uma linha.
- `P5_PUBLIC_RLS {"result":"PASS","publicSections":13,"publicNavigation":13,"adminsExposed":0,"issuesExposed":0,"revisionsExposed":0,"auditLogsExposed":0}`: acesso público/anon sem dados de administração. Não equivale a homologação de escrita/Storage do P2.
- `P6_PERFORMANCE_BUDGET`: **PASS** mobile e desktop, com limites conservadores de regressão; o orçamento mobile é `Performance >=55`, `LCP <=6,5 s`, **não** a meta de Web Vitals `LCP <=2,5 s`.
- Artefatos GitHub Actions: `p4-editorial-38-panels` e `p3-viewport-screenshots` (retenção até **04/11/2026**); `p6-lighthouse-json` (até **11/11/2026**). Preservar cópias permanentes antes do vencimento, se necessárias.

**Inspeção visual de revisão:** mosaicos gerados a partir das 38 capturas, incluindo 13 desktop/25 mobile, sem painel vazio ou quebra visual evidente na amostra. A inspeção em escala reduzida **não comprova** fidelidade pixel a pixel ao Figma/Canva, leitor de tela, ergonomia em dispositivo físico nem zoom nativo 200%. Essas verificações continuam no aceite humano.

### Prioridade máxima de performance: LCP mobile (não resolvido)

- Elemento real identificado: **retrato da seção Perfil mobile**, `/media/tulius-portrait-dark.jpg`, arquivo local de **13.198 bytes**, com preload HTML, `loading=eager`, `fetchpriority=high` e `decoding=async`. Portanto, otimizar **apenas compressão/download desse JPEG** tem pouco suporte causal.
- Na rodada válida, o insight de LCP informa subpartes de **81 ms** TTFB, **60 ms** de atraso de requisição, **45 ms** de carregamento e **749 ms** de renderização do elemento. Estas subpartes vêm do modelo específico de Lighthouse e **não devem ser somadas como se explicassem sozinhas os 4,38 s totais**; são úteis como ordem de grandeza da etapa de render.
- FCP **2,32 s** e diferença até o LCP de aproximadamente **2,06 s**. A página pública é montada pelo React depois das consultas do Supabase; deve-se instrumentar a linha do tempo `navigation → resposta(s) Supabase → commit React → imagem exibida` antes de alterar o renderizador.
- `render-blocking-insight` encontrou CSS principal e Google Fonts; estima economia **~550 ms em FCP**, **0 ms em LCP** nessa rodada. Ensaios históricos de carga não bloqueante de fontes foram revertidos por falta de ganho consistente. Não modificar tipografia licenciada, cores ou composição sem A/B sustentado.
- Long tasks e vendor JavaScript variam: na primeira tentativa de P3, com medição **não vinculada ao deployment novo**, houve **TBT 1.003 ms/Performance 51**; na rodada válida, **TBT 57 ms/Performance 82**, **sem mudança funcional no site**. Tratar a grande variação de TBT como sinal para repetir o laboratório (ao menos três execuções comparáveis) e olhar a distribuição/mediana, não prova de regressão nem de melhora causal.
- Próximos experimentos priorizados: **(1)** marcar os instantes de render de Perfil e respostas CMS/Supabase, procurando espera por dados não críticos para a dobra inicial; **(2)** rastrear custo inicial de React/vendor e eventual preload desnecessário do chunk `admin-router` no público, sem desabilitar proteção do admin; **(3)** comparar três medições mobile no mesmo ambiente e analisar FCP/LCP/TBT/CLS; **(4)** testar uma mudança pequena por vez, com rollback se prejudicar composição ou Core Web Vitals. **Não foi aplicada alteração funcional de performance nesta etapa**.

**Decisão P3:** contrato de renderização e qualidade automatizada **APROVADO**, preservando **ressalva aberta de LCP mobile >2,5 s** e **aprovação visual humana pendente**. O relatório Lighthouse do SHA anterior de 26/10 (Performance 72/LCP 4,60 s) permanece histórico; comparações entre SHAs/ambientes não são demonstração de causalidade.

## Fonte de verdade e versões

A auditoria histórica de 26/10, [run #40299848896](https://github.com/tuliustsangaropulos/PortfolioTulius/actions/runs/40299848896), foi executada no commit `9d118da8108181664867835f09ca93f55fe63218` e registrou mobile Performance **72**, LCP **4.604,02 ms**, FCP **2.423,68 ms**, TBT **347 ms**, CLS **0,0004**; desktop Performance **97**, LCP **1.244,08 ms**; Acessibilidade, Boas Práticas e SEO **100/100** nos dois. O mesmo job registrou `P3_BROWSER_AUDIT failures=0` e `P4_EDITORIAL_SUMMARY captures=38 desktop=13 mobile=25 failures=0`. **Não atribuir essas medições ao deployment atual.**

**Pré-auditoria de 28/10:** GitHub `main` em `fb487af642c668083bf6f2db6c3160acbaa402bf`, [CI aprovada](https://github.com/tuliustsangaropulos/PortfolioTulius/actions/runs/40746000813), Vercel [`dpl_4zvyVEqQtzxkdPkVC1TPrYKTcPNY`](https://vercel.com/tuliustsangaropulos-creates-projects/portfolio-tulius/4zvyVEqQtzxkdPkVC1TPrYKTcPNY) `READY`, SHA correspondente. O commit desta preparação cria novo SHA/deployment; registrar o real após o resultado da auditoria.

## Matriz do aceite P3

| Gate | Evidência exigida | Critério |
|---|---|---|
| Origem da publicação | SHA do GitHub Actions, SHA do último deployment `READY` da Vercel, alias `tulius.work`, hora de execução do Lighthouse. | Coincidirem ou documentar explicitamente a discrepância; não comparar a execução de um SHA com outro. |
| Site público | `scripts/p3-browser-smoke.mjs`, oito viewports e navegação. | 13 seções públicas, 25 painéis mobile visíveis, sem overflow, erros ou falhas de interação. |
| Evidências visuais | `scripts/p4-visual-audit.mjs`. | 38 capturas (13 desktop + 25 mobile), imagens decodificadas, sem painéis vazios ou quebrados. Não equivale a equivalência estética com Canva/Figma. |
| Acessibilidade | Lighthouse mobile/desktop e inspeção de menu/teclado. | Alvo de aceite automatizado: a11y >=95 em ambos; zoom 200% e leitor de tela reais exigem validação humana. |
| SEO | `scripts/smoke-production.mjs` e Lighthouse. | Score SEO >=95 e configurações canonical/robots/sitemap sem regressão. |
| Performance | Lighthouse JSON completos do run atual. | Registrar FCP, LCP, TBT, CLS e scores; não confundir gate tolerante `mobile LCP <=6500 ms` com meta ideal `LCP <=2500 ms`. |
| LCP mobile | `scripts/p3-lcp-triage.mjs`, dados do Lighthouse 13, imagens/fontes e renderização. | Identificar elemento causador e gargalo prioritário; propor alteração mínima baseada em evidência, não otimizar somente a pontuação. |

**Registro histórico da preparação:** este arquivo inicialmente continha apenas o plano e a solicitação de nova execução. Os resultados efetivos e a ressalva de LCP estão documentados no início do arquivo.

## P2 antes de P3

O [P5 administrativo read-only](https://github.com/tuliustsangaropulos/PortfolioTulius/actions/runs/40745631770) passou 4/4 com `contentMutations=0`. Porém o [relatório P2](P2_HOMOLOGACAO_ADMINISTRATIVA_2026-10-28.md) ainda exige ensaios com **fixture CMS e Storage binário autenticados**, protegidos por plano de restauração e limpeza. **Não se deve registrar P2 integralmente aprovada** apenas para iniciar P3; essa pendência é independente da auditoria pública.

## Primeira tentativa P3 em 28/10 — diagnóstico, sem aceite

O [run #40746505324](https://github.com/tuliustsangaropulos/PortfolioTulius/actions/runs/40746505324), workflow SHA `f418a96e09178f8646e618b6813da7ab1ba2c387`, produziu Lighthouse mobile **Performance 51, FCP 3,50 s, LCP 4,66 s, TBT 1.003 ms, CLS 0**, e desktop **Performance 96, LCP 1,28 s**, ambos **100/100** em Acessibilidade, Boas Práticas e SEO. **Não é aceite do SHA:** o relatório mobile começou às **18:35:36Z**, mas o deployment `dpl_GmzHMZN9zA7WmyidTn54wsesNqNZ` só ficou `READY` aproximadamente às **18:35:42Z** (status GitHub Vercel `success` às 18:35:43Z). Portanto, o mobile pode refletir o deployment anterior; o desktop iniciou às 18:35:52Z.

O gate `P6_PERFORMANCE_BUDGET` reprovou mobile (score 51 inferior ao mínimo de laboratório 55). Como o workflow executava o gate antes do browser e das capturas, a execução não completou a verificação de 13 seções/25 painéis. **Correção do pipeline:** aguardar status `Vercel=success` para o **SHA do próprio run** no GitHub antes da primeira requisição ao domínio, coletar browser e 38 imagens independentemente de o score estar abaixo do orçamento e aplicar o gate ao final, preservando o status de falha por regressão.

**Diagnóstico causal preliminar do JSON:** o LCP é `/media/tulius-portrait-dark.jpg` (13.198 bytes) na seção Perfil mobile; está no preload HTML, com `fetchpriority=high` e sem lazy-loading. O insight de LCP atribui ~**2.051 ms** ao atraso de renderização do elemento, contra ~**156 ms** ao carregamento de recurso. `vendor-ro3N29ZD.js` originou tarefas longas; o bloco de renderização por CSS de Google Fonts afeta FCP, mas Lighthouse indicou **LCP savings=0** para esse insight. Não trocar tipografia/identidade visual nem presumir que recomprimir essa imagem pequena resolverá o gargalo. Exigir nova medição do deployment correto e comparar a variância de TBT antes de ajustes funcionais.

## Interpretação

Performance Lighthouse é **dado de laboratório**, variável entre execuções e distinta dos Core Web Vitals de campo. Para comparar antes/depois de uma alteração de LCP, obter execução do mesmo SHA e depois uma medição no SHA novo, preservando a configuração e o tipo de dispositivo. Manter artefatos JSON e screenshots do run (retenção limitada do GitHub Actions).

## Experimento P3 — consulta SEO fora do caminho crítico (28/10/2026)

**Hipótese derivada do código:** `usePortfolio` faz sete consultas em `Promise.all` e só libera o conteúdo depois que **todas** terminam; `pages` e `site_settings` alimentam título/canonical/OG, mas **não** a composição da primeira seção. O experimento move essas duas leituras para uma promessa independente, iniciada imediatamente, sem aguardar seu resultado para liberar a renderização. As outras cinco consultas (seções, painéis, placements, tokens e navegação) e suas regras de erro permanecem no bloqueio crítico. Os metadados estáticos do HTML seguem como fallback seguro.

**Instrumentação:** `performance.mark` para início da requisição, chegada das cinco dependências principais e composição dos dados; a suíte de navegador registra tempos e nomes de tabelas das requisições Supabase, sem parâmetros, JWT ou conteúdo editorial. A alteração é **funcional somente na ordem de liberação de SEO**, sem redimensionamento de imagem, alteração de layout, tema ou conteúdo.

**Aceite necessário:** verificar CI, Vercel `READY` no mesmo SHA, P3 completo (13/25/38, A11y/SEO), LCP mobile e TBT. **Não declarar ganho de performance até medir.** Caso SEO regressione, reverter pontualmente a separação. O baseline comprovado segue [P3 #40747019980](https://github.com/tuliustsangaropulos/PortfolioTulius/actions/runs/40747019980): LCP mobile 4,38 s, score 82.

## Ensaio P3 — primeira dobra antes das seções fora da tela (28/10/2026)

O componente público originalmente montava todas as **13 seções** (com o stack de seis experiências) em uma única atualização React após carregar dados. O teste desta rodada preserva a primeira seção na primeira pintura e monta o restante **dois quadros de animação depois**; URLs com hash inicial e prévia autenticada começam com árvore completa, e a restauração de hash é reexecutada quando o conteúdo restante é liberado. O conteúdo final é idêntico, sem mudanças em HTML/CSS, fotografia, fontes ou textos. O novo marcador `p3:below-fold-render-start` permite inspecionar a ordem.

**Hipótese:** reduzir trabalho de layout/reconciliação antes de apresentar o retrato (LCP). **Critério:** CI, 13 seções/25 painéis/38 screenshots, acessibilidade, SEO e Lighthouse no deployment do mesmo SHA; se houver regressão funcional ou de LCP em laboratório comparável, reverter. O desempenho **não está homologado como melhorado** até a coleta.
## Resultado do ensaio de dobra isolada — descartado após medição (28/10/2026)

No [run P3 #40755835498](https://github.com/tuliustsangaropulos/PortfolioTulius/actions/runs/40755835498), SHA `ddd21464a5144aa7980c7707e35d99a048990bee`, Vercel `READY`, os testes de navegador, 13 seções, 25 painéis, 38 capturas, SEO e A11y passaram. Mobile: **Performance 60, LCP 3.969,67 ms, TBT 1.086 ms, FCP 2.509 ms**; desktop Performance 97, LCP 1.302 ms. Embora o LCP individual tenha caído em comparação ao último run de 4,22 s, a piora potencial de TBT e score mobile **impede aceite sem mais amostras**.

**Medida tomada:** reverter exclusivamente o estado `belowFoldReady` no componente público, restaurando a montagem normal de todas as seções. A separação anterior das duas consultas opcionais de SEO continua, pois passou nos gates e não mostrou efeito visual/regressão comprovado. Sem alteração de CSS, design ou conteúdo.

**Melhoria do método:** a auditoria agora coleta três execuções Lighthouse mobile no mesmo SHA/deployment e informa mediana, amplitude, TBT e FCP. Não declarar redução até haver baseline repetido e uma alteração independente com comparação equivalente.

## Três amostras mobile no mesmo deployment — #40756305871 (28/10/2026)

A [auditoria #40756305871](https://github.com/tuliustsangaropulos/PortfolioTulius/actions/runs/40756305871), SHA `d8a45559be05febe23c1b6167aacf5de0c5ba47c`, deployment Vercel `READY` confirmado pelo workflow, registrou os seguintes números mobile:

| Amostra | Performance | LCP | FCP | TBT |
|---|---:|---:|---:|---:|
| 1 | 54 | 4,89 s | 3,51 s | 821 ms |
| 2 | 83 | 4,31 s | 2,31 s | 7 ms |
| 3 | 83 | 4,23 s | 2,31 s | 47 ms |
| **Mediana** | **83** | **4,31 s** | **2,31 s** | **47 ms** |

Todos os relatórios tiveram Accessibility/SEO/Best Practices 100/100; desktop Performance 97/LCP 1,23 s, e 13 seções, 25 painéis, 38 capturas e testes públicos passaram. **O run foi marcado FAILURE por avaliação do orçamento apenas na primeira amostra** (54 abaixo de 55), embora a mediana passasse. A alteração do gate P6 passa a usar **mediana das três amostras mobile** (mesmos limites 55 e LCP 6,5 s), verifica A11y/SEO/boas práticas em **cada amostra**, e CLS máximo, mantendo desktop como antes. Não esconder os resultados individuais: a alta dispersão confirma variância do laboratório.

**Decisão técnica:** o LCP mediano **4,31 s** ainda excede o objetivo **2,5 s**. Não houve ganho causal demonstrável em relação ao baseline de 4,38 s; manter o trabalho de performance aberto, mesmo que o orçamento conservador do CI passe. O teste transacional P2 continua sem ambiente autorizado.

## Falha do runner Chrome e ajuste de coleta — 28/10/2026

A [auditoria #40756743808](https://github.com/tuliustsangaropulos/PortfolioTulius/actions/runs/40756743808), SHA `07f8f4c`, teve erro de inicialização do Chrome headless (`waiting for dynamic debugging port`), **sem produzir Lighthouse mobile**. O único desktop apresentou Performance 73 apesar de LCP 1,13 s. O workflow rejeitou corretamente as evidências ausentes; **não é medição válida de regressão de produção**.

A coleta foi fortalecida para **até três tentativas de inicialização quando uma captura falha**, com três relatórios mobile e três desktop do mesmo deployment; o gate usa mediana de desempenho/LCP em ambos, sem reduzir limites (mobile 55/LCP 6,5 s; desktop 90/LCP 3 s) e preserva verificações rígidas para acessibilidade, SEO, boas práticas e CLS. Os testes de navegador continuam executáveis mesmo se o Lighthouse falhar. A meta real de LCP mobile **≤2,5 s** continua pendente.

## Auditoria estabilizada válida — 28/10/2026, SHA 50a66f8

[GitHub Actions P3 #40757162085](https://github.com/tuliustsangaropulos/PortfolioTulius/actions/runs/40757162085) concluiu **SUCCESS** após confirmar Vercel `READY` no commit [`50a66f896deb87e315b194e65e3de964495beeb8`](https://github.com/tuliustsangaropulos/PortfolioTulius/commit/50a66f896deb87e315b194e65e3de964495beeb8). A medição usa 3 amostras mobile e 3 desktop, com mediana de Performance/LCP, pior resultado de acessibilidade/SEO/boas práticas e maior CLS. Os orçamentos não foram afrouxados.

| Indicador (mediana de três amostras) | Mobile | Desktop |
|---|---:|---:|
| Performance | **82** | **98** |
| LCP | **4.324,51 ms** | **1.158,10 ms** |
| FCP | **2.459,72 ms** | Conforme artifact JSON |
| TBT | **1 ms** | Conforme artifact JSON |
| A11y/SEO/Boas Práticas | **100/100 em todas as amostras** | **100/100 em todas as amostras** |
| Gate de regressão | **PASS** | **PASS** |

**Amplitude LCP mobile:** 4.269,47–4.504,45 ms. As notas individuais de Performance mobile foram **53, 82 e 82**; a primeira amostra apresentou TBT de **1.478,79 ms**, contra 0 e 1 ms nas outras. Não ocultar a variância do runner. A mediana não é Core Web Vitals de campo, e o objetivo **LCP ≤2.500 ms continua NÃO atendido**.

**Contrato e segurança pública:** `P3_BROWSER_AUDIT failures=0`, `P4_EDITORIAL_SUMMARY captures=38,desktop=13,mobile=25,failures=0`, `P5_PUBLIC_RLS PASS`; zero exposição de tabelas administrativas nas consultas anônimas previstas. A avaliação estética humana, zoom nativo 200% e leitor de tela real não foram substituídos por esses testes.

**Parecer:** o experimento de separar SEO do bloqueio de renderização permaneceu por preservar comportamento e passar nos gates; não há evidência de ganho causal suficiente para fechar a prioridade do LCP. A montagem adiada das seções foi revertida. Próximos experimentos devem isolar custo de JavaScript inicial, render React e CSS de fontes, com novas medições comparáveis e rollback pontual.

## Ensaio dirigido de LCP mobile — 29/10/2026 UTC (solicitação do chat de 28/10)

**Objetivo ainda NÃO atingido:** LCP mobile ≤2,5 s. Baseline documentado no SHA anterior à rodada: **4,36 s**, P3 [#40794804504](https://github.com/tuliustsangaropulos/PortfolioTulius/actions/runs/40794804504). O alvo permanece como requisito, **não** confundir a aprovação do orçamento de regressão do CI com cumprimento da meta.

**Hipótese confirmada no código:** a árvore React renderizava simultaneamente as composições desktop e mobile de todas as seções, mesmo quando o CSS escondia uma das versões. **Otimização mantida:** `PublicSite` e `ExperienceStack` agora montam apenas a versão correspondente ao `matchMedia("(max-width: 767px)")`, acompanhando mudanças de viewport. Não modifica conteúdo, ordem, CSS visual ou metadados; reduz DOM e trabalho de componentes ocultos. O P3 passou a exigir **25 painéis apenas em mobile** e ausência de árvore mobile em desktop, sem afrouxar a checagem de 13 seções, navegação, zoom e overflow. Um acesso a `.name-lockup` inexistente em mobile no teste foi corrigido.

### Experimentos e evidências (mesmo tipo de Lighthouse, três amostras por dispositivo)

| Versão | Experimento | Mediana LCP mobile | Decisão |
|---|---|---:|---|
| `cbc5bc2` | Baseline com ambas as árvores DOM | 4,36 s | Referência anterior |
| `638e54c` | Render responsivo exclusivo, CI/P3 [#40796975171](https://github.com/tuliustsangaropulos/PortfolioTulius/actions/runs/40796975171) | **4,18 s** | Mantido |
| `9f9a4a3` | `content-visibility:auto` em seções mobile fora da primeira dobra, CI/P3 [#40797088345](https://github.com/tuliustsangaropulos/PortfolioTulius/actions/runs/40797088345) | **4,19 s** | Revertido: sem ganho relevante e com complexidade de altura intrínseca |
| `82db120` | CSS de fontes Google não bloqueante, CI/P3 [#40797397621](https://github.com/tuliustsangaropulos/PortfolioTulius/actions/runs/40797397621) | **4,31 s** | Revertido: FCP melhorou, não houve ganho de LCP |
| `4ab9ce5` | **Código funcional final**, apenas render exclusivo mantido, [CI #40797703964](https://github.com/tuliustsangaropulos/PortfolioTulius/actions/runs/40797703964) e [P3 #40797703855](https://github.com/tuliustsangaropulos/PortfolioTulius/actions/runs/40797703855) ambos **success** | **4,30 s** (Performance 80) | Mantido como melhoria de DOM, sem atribuir ganho estatisticamente robusto |

A auditoria final `4ab9ce5` confirmou **13 seções, 25 painéis mobile, 38 capturas sem falhas, 12 viewports sem overflow, P5 anônimo 3/3 e zero mutações**; desktop LCP mediano **1,07 s**, Performance 98. A variabilidade entre runs impede declarar a redução de 4,36 para 4,30 como melhora causal conclusiva, embora a duplicação de DOM tenha sido eliminada de maneira verificável. Vercel Production `READY` no SHA funcional antes da auditoria.

**Bottleneck restante:** o LCP é o retrato `/media/tulius-portrait-dark.jpg` já pré-carregado, `fetchpriority=high`, cerca de 13 KB. O relatório atribui atraso principalmente a execução do bundle e ao trabalho de renderização/hidratação e layout, não à transferência dessa foto. Bundle `vendor` anteriormente medido com **397,10 kB minificados / 111,04 kB gzip**. A próxima intervenção necessária para perseguir ≤2,5 s é investigar uma **redução arquitetural real do JavaScript inicial e do caminho de composição React/Supabase**, com testes comparáveis, possível divisão de dependências e rollback isolado. Não fazer SSR, alterar as leituras públicas/RLS ou persistir snapshots sem avaliar risco de conteúdo desatualizado e impacto na segurança. Não usar mudanças de métrica, esconder LCP, atrasar intencionalmente recursos críticos nem afrouxar orçamentos para declarar sucesso.

**Restrições preservadas:** sem mudanças de banco, Supabase Storage, autenticação, custos, fontes finais, conteúdo aprovado, temas, dimensões visuais, layout mobile/desktop ou P2 transacional suspenso.

## Segunda frente P3 — divisão de dependências e falha de canário (29/10/2026 UTC)

**Objetivo: LCP mobile ≤2,5 s segue ABERTO.** Baseline validado da rodada anterior: [P3 #40797703855](https://github.com/tuliustsangaropulos/PortfolioTulius/actions/runs/40797703855), mediana **4,30 s**. Nesta rodada:

1. **Ensaio de cliente REST anônimo customizado — REJEITADO, com regressão funcional.** Commits `7049ee2`/`41817e6`: separaram SDK do Supabase (vendor 397,10 → 182,16 kB minificados; SDK 214,58 kB em chunk próprio), mas a nova leitura não chegou a requisitar dados no navegador. A auditoria [P3 #40799127268](https://github.com/tuliustsangaropulos/PortfolioTulius/actions/runs/40799127268) encontrou `publicSections=0`, `resources=[]`, erro do caminho público e **15 falhas de browser**. O Lighthouse registrou LCP ~**2,26 s**, **valor inválido** porque não havia conteúdo. **Nunca usar esta medição como cumprimento de meta.** A causa provável está na implementação do adaptador/execução do fetch, ainda não isolada conclusivamente; não atribuir à RLS sem prova. Nenhuma operação SQL ou migration ocorreu.
2. **Rollback imediato**, [commit `49fbfda`](https://github.com/tuliustsangaropulos/PortfolioTulius/commit/49fbfdabd69886582587f19caacb3d01ada803e0). A auditoria [P3 #40799749896](https://github.com/tuliustsangaropulos/PortfolioTulius/actions/runs/40799749896) passou: `publicSections=13`, 25 painéis mobile, 38 capturas, P5 anônimo 3/3, zero mutações; LCP mobile mediano **4,312 s**, desktop **1,039 s**.
3. **Ensaio seguro somente de empacotamento — MANTIDO**, [commit `e1846ac`](https://github.com/tuliustsangaropulos/PortfolioTulius/commit/e1846ac207dcfc45bc575a27905b0ed37ac305d7). **O `usePortfolio` e as requisições Supabase originais foram preservados**; Vite gera chunk `supabase-sdk` (214,58 kB minificados, 54,78 kB gzip) separado de `vendor` (182,16 kB, 56,69 kB gzip). Isso **não remove** o SDK do carregamento inicial: apenas separa transferências, parsing e cache. [CI Validate #40799952744](https://github.com/tuliustsangaropulos/PortfolioTulius/actions/runs/40799952744) **success**; [P3 #40799952773](https://github.com/tuliustsangaropulos/PortfolioTulius/actions/runs/40799952773) **success**: 13 seções, 25 painéis, 38 capturas, P5 3/3 sem mutações, LCP mobile mediano **4,248 s**, desktop **1,008 s**. A diferença de ~64 ms contra o rollback é menor que a variabilidade esperada do laboratório e **não comprova ganho causal significativo**.
4. **Nova proteção de qualidade P6:** além dos orçamentos e das verificações de P3, o gate de Lighthouse agora exige que o LCP de **cada** amostra corresponda ao retrato de perfil publicado (`tulius-portrait-dark.jpg`, com seletor responsivo correto). Se o conteúdo sumir, o gate **falha** mesmo que a pontuação melhore. Não elevar a performance reduzindo a integridade da página.

**Limites:** o P2 com JWT admin continua suspenso; nenhum custo, schema, RLS, Storage, mídia ou dado aprovado foi alterado. O experimento público falho foi removido do código. Para aproximar ≤2,5 s, estudar a redução efetiva do trabalho de JS/hidratação do primeiro painel em ambiente com canário funcional **antes** da promoção; não publicar novamente um adaptador REST não validado. O aceite das interfaces e o contrato de zoom não foram revogados.

### Auditoria final da proteção P6 e divisão dos chunks — 29/10/2026 UTC

No SHA funcional [`cc30446`](https://github.com/tuliustsangaropulos/PortfolioTulius/commit/cc304462bf9bf2ab0d8583b85920eb136a127916), [CI #40800444163](https://github.com/tuliustsangaropulos/PortfolioTulius/actions/runs/40800444163) e [P3 #40800444157](https://github.com/tuliustsangaropulos/PortfolioTulius/actions/runs/40800444157) passaram, com Vercel Production `READY`. P3: **13 seções**, **25 painéis mobile**, **38 capturas**, `P3_BROWSER_AUDIT failures=0`, P5 anônimo **3/3**, **0 mutações**. O novo **`P6_LCP_CONTENT_GATE` passou em mobile e desktop**, comprovando que o LCP medido era o retrato publicado. Mediana Lighthouse mobile: **Performance 82, LCP 4,421 s**; desktop: **Performance 97, LCP 1,235 s**. O valor de 4,248 s do experimento `e1846ac` não se repetiu; **não há evidência de melhora causal do LCP** frente ao baseline de aproximadamente 4,30 s. A meta mobile **≤2,5 s permanece aberta**. Preservar o SDK e o conteúdo original; a separação dos chunks está mantida apenas como isolamento/cache, **não** como aceite de desempenho.


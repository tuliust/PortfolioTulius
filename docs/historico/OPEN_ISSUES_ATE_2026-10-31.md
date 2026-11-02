# Pendências operacionais vigentes — PortfolioTulius

## P3 — Medição aplicada e consultas SEO fora do lote inicial (31/10/2026)

[`f8416fe`](https://github.com/tuliustsangaropulos/PortfolioTulius/commit/f8416fe9fc65e4cdea9ef0cb87fbb0c335297f75) distinguiu LCP observado, simulado e limitação aplicada. [`e6018f4`](https://github.com/tuliustsangaropulos/PortfolioTulius/commit/e6018f4a95ccfd382f97be7458fe8d02f622e690) colocou consultas opcionais `pages`/`site_settings` depois da montagem do Perfil. [P3 #41207713084](https://github.com/tuliustsangaropulos/PortfolioTulius/actions/runs/41207713084) **PASS**, [CI #41207713000](https://github.com/tuliustsangaropulos/PortfolioTulius/actions/runs/41207713000) **PASS**: mobile LCP mediano simulado **3,765 s**, Performance **86/100**, CLS 0,000405; limitação aplicada **3,239 s** (uma amostra, antes 3,241 s, sem ganho demonstrado). A auditoria confirmou 38 capturas, 13 seções/25 painéis, RLS público e navegação sem falhas; nenhuma mutação. `p3:seo-fetch-start` ocorreu depois de `p3:profile-dom-committed`, mas antes da amostra do LCP: não afirmar pintura completa anterior. A meta **≤2,5 s continua não alcançada** (P3-PERF-01 ABERTA); [evidências completas](P3_LCP_MOBILE_EXECUCAO_2026-10-31.md).

## P3 — Miniatura da seção Sobre sem transferência antecipada (31/10/2026)

[`11d0dac`](https://github.com/tuliustsangaropulos/PortfolioTulius/commit/11d0dac737e403545f4f0d51320fe9bb5790dbeb): imagem PNG CMS secundária de aproximadamente **399 KB** adiada até se aproximar da viewport, preservando o arquivo original e os painéis. [P3 #41203713347](https://github.com/tuliustsangaropulos/PortfolioTulius/actions/runs/41203713347) **PASS**: transferência inicial mobile sem o PNG, 13 seções / 25 painéis / 38 capturas, 0 erros, LCP mobile mediano **4,208 s** e desktop **1,018 s**. [CI #41203713367](https://github.com/tuliustsangaropulos/PortfolioTulius/actions/runs/41203713367) PASS. O ganho é de **bytes transferidos**, não houve comprovação de redução causal do LCP frente à referência de 4,093 s. **P3-PERF-01 continua ABERTA (objetivo ≤2,5 s)**. [Detalhes](P3_LCP_MOBILE_EXECUCAO_2026-10-31.md).

## P3 — Isolamento do SDK público concluído (31/10/2026)

A home agora usa `@supabase/postgrest-js` isoladamente; SDK completo permanece disponível sob demanda para `/admin` e prévia protegida. [Auditoria P3 #41183307575](https://github.com/tuliustsangaropulos/PortfolioTulius/actions/runs/41183307575) **PASS** no código de runtime: LCP mobile mediano **4,093 s**, Performance **85/100**; 13 seções, 25 painéis, 38 capturas, RLS público e navegação sem falhas. O [CI #41202307819](https://github.com/tuliustsangaropulos/PortfolioTulius/actions/runs/41202307819) **PASS** no commit `47f949d` (29 arquivos de testes, TS, build e smoke); Vercel Production READY. O LCP ainda está **1,593 s acima da meta de 2,5 s**, portanto **P3-PERF-01 permanece ABERTA**; a parte autenticada transacional do CMS não foi exercitada. Nenhuma alteração de banco, conteúdo, Storage ou autenticação. [Relatório e evidências](P3_LCP_MOBILE_EXECUCAO_2026-10-31.md).

## Continuidade P3 — LCP mobile (31/10/2026)

A otimização do preload WebP e a correção do import estático administrativo reduziram a mediana sintética de LCP mobile de **7,704 s** para a faixa de **4,2–4,4 s**. O experimento de renderização progressiva não trouxe ganho e foi revertido. O CI e a auditoria P3 do código revertido `87c9348` foram aprovados (13 seções/25 painéis/38 capturas). **P3-PERF-01 permanece ABERTA**: objetivo ≤2,5 s não alcançado; sem alteração de Supabase, conteúdo ou CMS. [Relatório integral](P3_LCP_MOBILE_EXECUCAO_2026-10-31.md).

## Revisão mobile concluída; desempenho P3 ainda pendente — 31/10/2026

A [revisão mobile #41180490449](https://github.com/tuliustsangaropulos/PortfolioTulius/actions/runs/41180490449) passou os testes de navegador e responsividade em 360/390/430 px, a expansão dos três depoimentos e 38 capturas de 13 seções/25 painéis, sem erros funcionais. O [CI #41180490364](https://github.com/tuliustsangaropulos/PortfolioTulius/actions/runs/41180490364) passou. O retrato de Contato, inicialmente com altura zero, foi corrigido e agora mede 574 px, ancorado à base. A Formação/Ferramentas não apresentavam dados duplicados: os cabeçalhos do segundo painel foram diferenciados e todos os registros mantidos. Seção 01, Olá!, escala dos títulos e altura dos depoimentos foram adaptadas por CSS mobile. Alt inválido da imagem de Contato foi corrigido no JSONB do bloco aprovado, sem alteração de mídia.

**P3-PERF-01 permanece aberta:** mediana de LCP mobile **7,704 s** (meta ≤2,5 s), Performance 69; desktop 1,738 s PASS. A falha do workflow P3 é causada pelo gate de desempenho mobile, não pela auditoria funcional. P2 transacional permanece suspensa; não introduzir alterações de banco ou infraestrutura adicionais sem escopo.

## Auditoria P3 — aceite dos badges/CDI/alternância em navegador (31/10/2026)

[Audit P3 #41179623669](https://github.com/tuliustsangaropulos/PortfolioTulius/actions/runs/41179623669) no código [`fb0caebd`](https://github.com/tuliustsangaropulos/PortfolioTulius/commit/fb0caebd98a32568355b4e3069958d664972ae7f): **P3_CMS_COMPETENCIES_MEDIA PASS** (Invest RS, Prefeitura SP, Vale, TV Globo/SporTV, Grupo InPress e CDI: cinco badges cada; slides da CDI apontando para arquivos sem texto; mesma fonte e caixa alta nos botões; "Projetos" maior inicialmente). **P3_EXPERIENCE_SWITCH PASS** (ao selecionar "Trajetória": 24,192 px versus "Projetos" 13,608 px, com retorno ao estado anterior), **P3_PROJECT_GALLERY_LINK PASS**, **P3_BROWSER_AUDIT failures=0**, **P4 38 capturas, 13 seções desktop e 25 painéis mobile, failures=0**, **P5 público 3/3 sem mutações**.

**P6 não aprovado:** LCP mobile mediano **7,725 s**, Performance 68, CLS 0,098, meta ≤2,5 s não cumprida; desktop LCP **1,700 s**, Performance 93 PASS. A workflow P3 termina `failure` apenas pelo gate conservador de performance mobile. Não interpretar a falha como regressão funcional dos badges/CMS/CDI. Preservar `P3-PERF-01` aberta. Versão documental posterior não altera código público.

## Revisão de experiências: badges, alternância tipográfica e CDI sem texto — 31/10/2026

- **Dados revisados no Supabase:** seis empresas com cinco tags editoriais cada. A Invest RS mantém as cinco competências já aceitas. Foram adicionados registros do tipo `{title: "Competências aplicadas", tags: [...]}` ao início de `content_blocks.content_json.items` do painel A da Prefeitura de São Paulo, Vale, TV Globo/SporTV, Grupo InPress e CDI Comunicação, preservando todos os demais itens, slides, métricas, status e coleções. Verificação SQL posterior confirmou **6/6 empresas com 5 tags**, sem alteração de schema, RLS, tabelas ou `career_experiences`.
- **Site público:** os botões `PROJETOS E REALIZAÇÕES` e `TRAJETÓRIA` usam agora **a mesma fonte de display e caixa alta**. O ativo fica maior e o inativo menor, invertendo a hierarquia quando o usuário seleciona Trajetória; os controles acessíveis `aria-pressed` e `aria-controls` foram preservados.
- **CMS:** `ContentStudio` ganhou campo dedicado **Competências aplicadas — tags abaixo do período**, uma por linha, salvando no próprio bloco A somente pelo botão Salvar existente. Há orientação sobre vínculo entre itens visíveis e títulos dos slides e atalho para a coleção `career_experiences`, que guarda o texto integral de Trajetória. Projetos, slides, competências e coleções não foram fundidos; não há autoescrita silenciosa.
- **CDI Comunicação — arte corrigida:** [job GitHub #41179537232](https://github.com/tuliustsangaropulos/PortfolioTulius/actions/runs/41179537232) **success**: três SVGs existentes descarregados do Storage, dois nós `<text>` removidos **por imagem** e checksum SHA-256 verificado. Três novos objetos publicados em `portfolio-generated/2026-10-31-cdi-no-text/`, com os três slides da CDI atualizados (3/3, verificação SQL posterior). **Os arquivos originais, proporção 1200×675 e conteúdos ilustrativos foram preservados**; não confundir com fotografias originais ou com as 19 outras ilustrações de 1200×1350. A rotina autenticada partiu de Storage privado e promoveu explicitamente ao público.
- **Verificações:** [CI #41179537245](https://github.com/tuliustsangaropulos/PortfolioTulius/actions/runs/41179537245) aprovado; revisão [`fb0caebd`](https://github.com/tuliustsangaropulos/PortfolioTulius/commit/fb0caebd98a32568355b4e3069958d664972ae7f) adicionou checagens de navegador de seis listas de badges, imagens CDI sem texto e tamanho/fonte dos controles. A [P3 #41179623669](https://github.com/tuliustsangaropulos/PortfolioTulius/actions/runs/41179623669) é uma medição separada; manter P3-PERF-01 aberto enquanto LCP mobile exceder 2,5 s. Não declarar homologação P2 transacional paga ou testes destrutivos.

## Verificação P3 final — vínculo projetos / galeria — 31/10/2026

A [auditoria P3 #41178735154](https://github.com/tuliustsangaropulos/PortfolioTulius/actions/runs/41178735154) do código funcional [`41a96e37`](https://github.com/tuliustsangaropulos/PortfolioTulius/commit/41a96e3715cdc47ee73ab225374cf72b2e739205) confirmou: **P3_EXPERIENCE_SWITCH PASS** (trajetória e retorno aos quatro projetos; sete títulos de tópicos em negrito); **P3_PROJECT_GALLERY_LINK PASS** (clique em "Organização de eventos" seleciona slide 2/4 e avançar pela seta ativa "Plataforma de eventos e relacionamento" também na lista); **P3_BROWSER_AUDIT failures=0** (13 seções desktop/25 painéis mobile), **P4_EDITORIAL_SUMMARY 38 capturas, failures=0**, **P5_PUBLIC_RESULT 3/3 mutations=0**. Verificação do logo sem borda, cinco tags e rolagem interna contextual também passou.

O P6 Lighthouse do mesmo job encerrou como `failure` **somente pelo orçamento de LCP mobile**: mediana **7,628 s**, Performance 69, CLS ~0,098; o LCP era a imagem correta do Perfil (`P6_LCP_CONTENT_GATE PASS`). Desktop LCP **1,725 s**, Performance 93, PASS. Não declarar meta ≤2,5 s atingida. A `main` foi atualizada com documentação posteriormente, sem mudança no código público; CI [#41178828372](https://github.com/tuliustsangaropulos/PortfolioTulius/actions/runs/41178828372) aprovado. Homologação P2 transacional continua suspensa.

## Estado da experiência: lista vinculada ao slide — 31/10/2026

**Entregue em código:** [`41a96e37`](https://github.com/tuliustsangaropulos/PortfolioTulius/commit/41a96e3715cdc47ee73ab225374cf72b2e739205), CI [#41178735173](https://github.com/tuliustsangaropulos/PortfolioTulius/actions/runs/41178735173) aprovado e Vercel READY. Projetos correspondem aos títulos de slides ativos, com seleção bidirecional e destaque laranja; itens sem mídia correspondente não recebem associação fictícia, e indicadores quantitativos permanecem visíveis em grupo complementar. A trajetória pública omite apenas tópicos duplicados identificados por empresa; o conteúdo integral da coleção `career_experiences` não foi modificado.

**Homologações ainda independentes:** execução integral [P3 #41178735154](https://github.com/tuliustsangaropulos/PortfolioTulius/actions/runs/41178735154), eventual inspeção visual manual em 1440/390 px e LCP mobile ≤2,5 s; P2 transacional isolada permanece suspensa. Não reabrir ocorrências editoriais já resolvidas.

## Atualização — ilustrações e alternância da seção profissional (31/10/2026)

**Solicitação implementada:** 19 novas versões SVG livres de texto visual, todas 1200×1350, 16 vinculadas aos slides das cinco empresas, três alternativas no acervo. [Publicação autenticada e verificada #41178250462](https://github.com/tuliustsangaropulos/PortfolioTulius/actions/runs/41178250462): 19/19 publicadas e 16/16 vinculadas. Mídias antigas mantidas como histórico de reversão, sem exclusão ou sobrescrita. Imagens continuam **conceituais, não registros reais**.

Na interface pública, as cinco competências existentes da Invest RS são badges abaixo do período; o item `Competências aplicadas` não se repete entre os projetos. Botões `Projetos e realizações` e `Trajetória` alternam as listas (sem expansão adicional), com prefixos `• ...:` em negrito; preservados conteúdos e cargos do acervo. Código [`79c1ab1`](https://github.com/tuliustsangaropulos/PortfolioTulius/commit/79c1ab1a17f674f4ee75d0cd90b2b992b3c07e1a).

**Ainda pendente:** aceite visual desktop/mobile da mudança, CI/P3 da release conforme seus resultados, LCP mobile ≤2,5 s e P2 transacional com ambiente isolado (suspenso). Não reinterpretar essas pendências como resolvidas pela publicação dos arquivos.

## Estado atualizado em 31/10/2026 — revisão editorial e UX do CMS

**Código:** [`01a3a287`](https://github.com/tuliustsangaropulos/PortfolioTulius/commit/01a3a28731817c510616408d85196d10dd206113), [Validate #41175411745](https://github.com/tuliustsangaropulos/PortfolioTulius/actions/runs/41175411745) **success** e Vercel Production **READY** no mesmo SHA (`dpl_B64aMBXM9URAwppjwWcaxfjoTJJq`). A P3 do novo código é independente; não afirmar que LCP mobile foi corrigido.

**UX administrativa:** removido o aviso repetitivo "Origem do conteúdo: Itens editados neste bloco" de todos os editores, sem retirar acesso a "Editar registros vinculados" quando há coleção. A orientação "Textos da seção 02 — coluna direita" foi movida para o ícone de informações, visível por mouse ou clique e acessível via teclado. A prévia de "Ajustar enquadramento" ganhou área geometricamente limitada, imagem isolada e controles de posição/zoom sem sobreposição. Testes estáticos `admin-editor-notices-framing.test.ts` e CI aprovados; inspeção visual específica em 1440px e 390px ainda requer validação humana.

**Supabase — gravação editorial expressamente solicitada e conferida por leitura posterior:** **0** ocorrências `editorial_issues` abertas (oito desta rodada passaram a `resolved` e uma já estava resolvida), **3** depoimentos publicados e **2** exemplos fictícios arquivados reversivelmente. Permanecem Matheus Gomes, Ana Beatriz Neves e Fábio Seixas; nenhuma recomendação de Marcelo Ventura foi criada, pois não há texto autêntico disponível no acervo. Cargo Invest RS confirmado como "Assessor Executivo | Núcleo de Comunicação"; CDI alinhada à captura de LinkedIn fornecida, com texto detalhado na coleção e síntese nos quatro cards; Perfil e Vale exibem somente a articulação/atuação envolvendo 14 países; idiomas "inglês fluente / espanhol avançado" e cargo InPress foram confirmados. Imagens da Invest RS preservadas com aviso de caráter ilustrativo, alt provisórios corrigidos. Conteúdo original da mídia e Storage não foram modificados.

**Limites:** o proprietário autorizou as gravações pontuais de conteúdo desta rodada. Isso **não** reabre a homologação transacional P2, não autoriza staging pago, alteração de RLS, testes destrutivos, exclusão permanente, nem altera a pendência P3 de LCP mobile. Os depoimentos de Marcelo Ventura poderão ser acrescentados futuramente **somente** mediante texto real e autorização. Os registros anteriores deste documento são históricos e devem ser interpretados à luz desta atualização.

## P3-PERF-01 — evidência atualizada em 31/10/2026

[Audit P3 #41173406644](https://github.com/tuliustsangaropulos/PortfolioTulius/actions/runs/41173406644) no SHA de código `c043375`: integridade **13 seções desktop / 25 painéis mobile / 38 capturas, 0 falhas**, P5 público **3/3 sem mutações**, imagem correta como LCP; **mobile LCP mediano 7,824 s FAIL**, desktop **1,655 s PASS**. Ainda ultrapassa orçamento mobile sintético de 6,5 s e meta ≤2,5 s. Os commits posteriores são formatação/documentação, sem mudanças na renderização pública. Não reabrir arquitetura ou alterar o gate sem experimento controlado; diagnóstico de critical path permanece aberto.

## Situação após implementação CMS-UX — 31/10/2026

**Resolvido em código (não fechar aceite transacional):** CMS-UX-01 (dropdown de ícones), CMS-UX-02 (alinhamento de logo/slide) e CMS-UX-03 (modal de mídia com envio privado/publicação explícita). CMS-UX-04 preservado e coberto por verificações existentes e testes estáticos. Código [`6913d91`](https://github.com/tuliustsangaropulos/PortfolioTulius/commit/6913d91c71041457d3425836ee2e96f93677bc59), [CI Validate #41173453310](https://github.com/tuliustsangaropulos/PortfolioTulius/actions/runs/41173453310) **success**, Vercel Production **READY** no mesmo SHA. P5 read-only da biblioteca de ícones: [#41173340958](https://github.com/tuliustsangaropulos/PortfolioTulius/actions/runs/41173340958) **success**, sem gravações.

**Ainda pendente:** revisão visual específica dos novos controles, evidência E2E autenticada do novo modal sem escrita, fluxos de edição/publicação/upload com JWT real (**P2 SUSPENSO**, não executar produção nem contratar staging), P3-PERF-01 mobile (LCP mediano 7,757 s; meta ≤2,5 s), oito `editorial_issues`, dois depoimentos ilustrativos e decisões de proveniência/licenças/segurança/limpeza P1. Não houve alteração do Supabase, Storage, conteúdos, auth ou RLS nesta implementação. O backlog abaixo é preservado como histórico do momento anterior.

## Histórico das solicitações manuais de 31/10/2026 — posteriormente implementadas

**Registro histórico do estado anterior à implementação; os itens abaixo tiveram código entregue em 31/10/2026, mas ainda não receberam aceite visual integral ou P2 transacional:**
1. **CMS-UX-01:** biblioteca de **50 ícones em dropdown/popover visual**, cinco categorias e células apenas gráficas; seleção única de indicador e até três ícones de plataformas; sem listas sempre expandidas.
2. **CMS-UX-02:** corrigir espaçamento/alinhamento vertical de **Descrição alternativa do logo** (campo próximo ao título) e **Legenda da imagem** nos slides; preserve textos/alt/URL/enquadramento e acessibilidade mobile.
3. **CMS-UX-03:** abrir **Biblioteca de imagens em modal** e permitir **Enviar mídia dentro do modal**, reutilizando fluxo privado → publicação deliberada já existente; não selecionar upload privado antes de estar publicado nem alterar Storage sem consentimento e autorização P2.
4. **CMS-UX-04:** manter Salvar flutuante somente ativo quando há edição, avisos internos personalizados e `beforeunload` nativo obrigatório para fechar/recarregar; seleção cancelada não altera rascunho.

Evidências: quatro capturas entregues no chat de 31/10; critérios, localização no código, casos de teste e ordem de execução no [documento de continuidade](CONTINUIDADE_CMS_FONTES_E_PENDENCIAS_2026-10-31.md). As capturas **não foram publicadas no repositório**.

**Pendências independentes preservadas:** P3-PERF-01 (LCP mobile último ~7,757s, meta ≤2,5s); P2 transacional suspenso sem custos; aceite visual manual das novas correções após futura execução; oito ocorrências editoriais abertas, direitos/proveniência, objetos privados e riscos de manutenção/segurança. Não fechar testes somente por CI READY. Contagens vigentes: 14 seções totais, 13 públicas, 8 menu, 5 depoimentos, 34 registros de mídia (read-only 31/10). Aceite P5 read-only mais recente [#41172037326](https://github.com/tuliustsangaropulos/PortfolioTulius/actions/runs/41172037326), 4/4 sem gravação de conteúdo.



## Pendências definitivas após nova verificação — 31/10/2026

**Concluído e validado:** `main` [`e3c85c2`](https://github.com/tuliustsangaropulos/PortfolioTulius/commit/e3c85c275bc727c9c658b5cdaa5528f41dfb72fa) com [CI #41172037322](https://github.com/tuliustsangaropulos/PortfolioTulius/actions/runs/41172037322) **success**, Vercel **READY**, e [P5 Admin Read-Only #41172037326](https://github.com/tuliustsangaropulos/PortfolioTulius/actions/runs/41172037326) **success**. A suíte autenticada validou oito módulos, 50 ícones visualmente selecionáveis, mobile 390px sem overflow, barra flutuante reativa, alt opcional, alerta personalizado de navegação, prévia de 14 seções e logout, com `contentMutations=0`.

**P3-PERF-01 — permanece ABERTO:** [P3 #41171332333](https://github.com/tuliustsangaropulos/PortfolioTulius/actions/runs/41171332333) com 13 seções/25 painéis/38 capturas, 0 erros de browser, P5 público 3/3 sem mutações. Desktop LCP ~1,64s PASS; mobile ~7,76s FAIL (meta ≤2,5s). A antecipação de uma consulta restrita ao perfil foi **revertida** por ausência de ganho e risco de composição pública incompleta; a versão WebP aprovada continua em uso. Não mudar o limite P3 nem oferecer como pronta uma arquitetura ainda não verificada.

**P2 transacional — SUSPENSO:** o proprietário não aprovou custo de staging; **não** executar gravações, restaurar conteúdo, publicar fixtures, alterar Auth/RLS, comprar recursos ou gravar/remover arquivos em produção para homologação. Requer autorização expressa posterior.

**Aceite visual humano — aguardando observação do proprietário:** a inspeção automatizada autenticada cobre comportamento mobile e DOM, mas não equivale a uma assinatura visual humana, a teste físico em todos os aparelhos ou a homologação de salvamento real. No refresh/fechamento o aviso é necessariamente nativo; na navegação interna permanece o popup personalizado.

**Demais decisões independentes:** continuam **8 ocorrências editoriais abertas** no banco e pendências de mídias/licenças, segurança e manutenção do histórico. Não encerrar, apagar ou alterar sem decisão de conteúdo e proveniência.



## Pendências após edição e WebP — 31/10/2026

**Concluído em código e CI:** revisão do campo Texto alternativo (sempre opcional), retirada de todos os controles visíveis Nota editorial, alternância Mobile/Desktop em um único seletor na seção Olá!, biblioteca visual de **50 ícones em cinco categorias**, botões de mídia com ícones, e barra flutuante Salvar condicionada a alterações nos formulários administrativos. Fluxos internos usam confirmações próprias; reload/fechamento com rascunhos usa confirmação nativa por limitação do navegador. CI [#41170233909](https://github.com/tuliustsangaropulos/PortfolioTulius/actions/runs/41170233909) **success** no SHA funcional [`ac07b948`](https://github.com/tuliustsangaropulos/PortfolioTulius/commit/ac07b9486eade886ea1d0d09e73e16d06c3b7de0).

**Otimização material aplicada:** derivadas WebP da fotografia aprovada, 600px/29.568B e 900px/51.458B, checksums de origem verificados; nenhuma alteração nos dados ou no PNG original do Supabase. O teste [P3 #41170190190](https://github.com/tuliustsangaropulos/PortfolioTulius/actions/runs/41170190190) confirmou 13/25/38, P5 3/3 mutations=0 e LCP element PASS, **mas LCP mobile = 7,797s (FAIL)**. Não fechar P3-PERF-01. Investigar próximas barreiras de renderização/consultas/long tasks sem mudar mídia aprovada ou relaxar metas.

**Continuam pendentes:** aceite manual desta rodada em viewport real, P3-PERF-01 (performance mobile), P2 transacional previamente suspenso, revisões editoriais/licenças e decisões de higiene/segurança anteriormente bloqueadas. Não iniciar operações de Storage em produção, remover arquivos privados, alterar Auth/RLS ou pagar por serviços sem autorização específica.



## Validação após reversão P3 — 31/10/2026

**Versão funcional restaurada:** SHA [`cc1e17e`](https://github.com/tuliustsangaropulos/PortfolioTulius/commit/cc1e17ea9fafb72ecc47401ca75924ab1f75f92b), com [CI Validate #41168586077](https://github.com/tuliustsangaropulos/PortfolioTulius/actions/runs/41168586077) **success** e Vercel **READY** no mesmo SHA. O código de dados e renderização pública voltou ao conteúdo do HEAD `1fcd773`, após teste experimental sem ganho sustentado; os componentes auxiliares desse ensaio foram removidos. Nenhuma alteração em banco, arquivos de imagem ou composição editorial.

**P3 de produção após reversão:** [#41168586130](https://github.com/tuliustsangaropulos/PortfolioTulius/actions/runs/41168586130) verificou o SHA publicado e aprovou a integridade funcional do site (browser failures=0; **13 desktop, 25 mobile, 38 capturas sem falhas**; P5 anonymous 3/3, mutations=0), incluindo gate do retrato correto. LCP desktop mediano **1,685 s PASS**, mobile mediano **7,571 s / Performance 73 FAIL** pelo limite sintético conservador 6,5 s e meta ≤2,5 s. O resultado global P3 permanece reprovado **exclusivamente no orçamento mobile**, não na integridade da composição. A variação de 7,37 a 7,66 s entre execuções reforça que o experimento não resolveu o problema.

**Bloqueios sem intervenção não autorizada:** criação de derivada otimizada exige acesso verificável aos bytes da fotografia publicada para confirmar identidade e qualidade do recorte; nenhuma cópia distinta encontrada pode ser promovida por presunção. A criação de ambiente P2 potencialmente cobrável, gravações administrativas, exclusões de arquivos privados, alterações de licenças ou de segurança continuam condicionadas às decisões expressamente registradas pelo proprietário. Não tratá-las como implementadas.



## Tentativa P3 mobile sem ganho sustentado — 31/10/2026

**Resultado técnico verificado:** o experimento de composição antecipada apenas da seção Perfil foi medido em [P3 #41168050252](https://github.com/tuliustsangaropulos/PortfolioTulius/actions/runs/41168050252) (mediana LCP mobile **7,371 s**, P6 FAIL) e, após formatação sem alteração funcional, em [P3 #41168377912](https://github.com/tuliustsangaropulos/PortfolioTulius/actions/runs/41168377912) (mediana **7,640 s**, Performance 72, P6 FAIL). O baseline anterior era **7,664 s**: a diferença é pequena e incompatível com afirmação de ganho causal ou meta cumprida. As duas execuções verificaram SHA publicado, 13 seções/25 painéis mobile/38 capturas sem falhas, browser 0 erros e P5 anônimo 3/3 sem mutações. LCP do retrato aprovado manteve-se como elemento esperado. **Decisão: reverter o experimento de composição progressiva**, que acrescentava uma renderização intermediária sem benefício comprovado; preservar lógica de dados e conteúdo publicados. A medição 7,640 s é evidência histórica do ensaio **revertido**, não resultado de produção da versão revertida.

**Pendência P3-PERF-01 segue aberta:** o Lighthouse atribui potencial de economia de entrega de imagem ~1.008 KiB no conjunto, mas isso não garante redução equivalente do LCP. A foto efetivamente publicada `b171afda-2708-44eb-b3e5-ab2b7ff13236-tulius_site.png` (Storage público, tamanho registrado **684.305 bytes**) continua inalterada. Não foi possível obter com garantia o arquivo binário original através das interfaces disponíveis para gerar e verificar uma derivada fiel. Não substituir a foto por outro arquivo de nome parecido, não alterar `content_json`/Storage, não chamar serviço de transformação potencialmente cobrável. Para prosseguir: obter bytes originais verificáveis, produzir variante de largura/formatos adequados com comparativo visual, manter original preservado, testar entrega no frontend e medir P3 no SHA correspondente.

**Bloqueios independentes mantidos:** P2 transacional segue suspenso por decisão anterior contra custos; não executar CRUD real de produção, staging cobrável nem alterar Auth/RLS. Revisões de licenças, objetos privados, Edge Function, branches antigas e inventário de Fontes dependem das autorizações/insumos listados no histórico. Sem exclusões automáticas.



## Situação atual após o aceite manual e ajuste mobile — 30/10/2026

**Fechado por declaração do proprietário:** a revisão manual anterior do Editor do Site (seções/blocos/coleções, Experiências Profissionais, itens, popups e toasts). O código funcional para responsividade do CMS está em [`f2f8e4f`](https://github.com/tuliustsangaropulos/PortfolioTulius/commit/f2f8e4fe7a54e371a96ceff546b711ca5b0bcd19), com [CI #41140863031](https://github.com/tuliustsangaropulos/PortfolioTulius/actions/runs/41140863031) **success** e Vercel Production **READY**. As menções históricas a "verificação manual pendente" nos registros abaixo foram superadas para as telas anteriormente avaliadas; **não representam testes de CRUD com JWT nem aceitação específica da nova composição mobile em aparelho físico**.

**Mobile administrativo implementado:** shell em coluna, navegação superior rolável, formulários em uma coluna, mídia 2/1 colunas conforme largura, botões 44px, modais/toasts móveis e entradas iOS sem zoom de foco. Testes `admin-mobile-layout.test.ts` e CI aprovados. Nenhuma alteração de banco.

**Permanece aberto — P3-PERF-01:** [P3 #41140863050](https://github.com/tuliustsangaropulos/PortfolioTulius/actions/runs/41140863050) conferiu 13/25/38, 0 falhas de browser, P5 3/3 sem mutações e LCP desktop ~1,69 s; **LCP mobile mediano ~7,66 s** (limite 6,5 s, meta ≤2,5 s) reprovado. O preload do arquivo real substituiu preload do fallback, sem evidência de melhora causal. Para superar o principal gargalo, é necessária **derivada comprimida da fotografia aprovada**, mantendo seu conteúdo, recorte e original. Não ativar transformação de imagens do Supabase (pode exigir plano Pro e cobrança) nem trocar mídia sem autorização específica. Não reduzir artificialmente a cobertura P3 ou relaxar o orçamento.

**Permanece bloqueado por decisão anterior — P2 transacional:** não provisionar staging pago nem executar operações reais de gravação/publicação/Storage com JWT de admin na produção. Demais pendências editoriais e de licença são decisões independentes; não declará-las encerradas automaticamente.



## Verificação manual — diálogos e correção de Coleções (30/10/2026)

Implementado em [`120e681`](https://github.com/tuliustsangaropulos/PortfolioTulius/commit/120e681ec66fdd39596fbc7ba4a4efa81d341b42), [CI #41139782822](https://github.com/tuliustsangaropulos/PortfolioTulius/actions/runs/41139782822) **success** e [Vercel READY](https://vercel.com/tuliustsangaropulos-creates-projects/portfolio-tulius/4kMTvrv5sVDJoP8kaUQLEVQmBZUo) no mesmo SHA. Corrigido no código o campo `tools_text` enviado indevidamente por Coleções; teste unitário protege payload. `confirm/alert/prompt` nativos não são mais usados no CMS, com política de teste estático. Toasts têm variantes de estado e o acervo ganhou fontes contextuais e prévia desktop/mobile.

**Conferência autenticada ainda pendente:** abrir/cancelar diálogos por mouse e teclado, foco/Escape, confirmar que dados não salvos não são descartados ao cancelar, conferir toasts, testar visual da prévia e fontes vinculadas. Ao fechar/recarregar a aba, navegador não permite diálogo próprio; removida a antiga confirmação nativa, portanto conteúdo não salvo pode ser perdido. **Não executar CRUD de teste no banco de produção:** P2 transacional continua suspenso por decisão do proprietário. A meta LCP mobile ≤2,5 s permanece pendente e separada.


## Verificação manual pendente — agrupamento de Experiências Profissionais (30/10/2026)

Implementação restrita ao painel administrativo em [`05a4cf1`](https://github.com/tuliustsangaropulos/PortfolioTulius/commit/05a4cf1f27962d1df24fbf4cd53aceb0192955a6), com [CI #41137954207](https://github.com/tuliustsangaropulos/PortfolioTulius/actions/runs/41137954207) **success** e [Vercel READY](https://vercel.com/tuliustsangaropulos-creates-projects/portfolio-tulius/EQ5dA4FFMrt9dJqvB5nrxuHjG3ri) no mesmo SHA. As seis seções de experiência aparecem no Editor como uma entrada **Experiências Profissionais**, com seletor interno de trabalho. Os slugs e dados continuam separados; não há mudança no site público.

**Checar manualmente:** escolher cada um dos seis trabalhos; manter o painel correto, prévia e ações de edição; testar aviso de rascunho não salvo ao trocar de empresa; conferir usabilidade em diferentes larguras. **P2 transacional suspenso**: sem gravações reais de teste. O [P3 #41137881739](https://github.com/tuliustsangaropulos/PortfolioTulius/actions/runs/41137881739) terminou em `failure` apenas no orçamento P6: **LCP mobile 7,694 s**, Performance 69, contra 6,5 s de orçamento e meta ≤2,5 s. Navegador 0 falhas, 13 seções, 25 painéis, 38 capturas sem falhas, P5 3/3 sem mutações e LCP desktop 1,664 s aprovado. A pendência P3 mobile permanece independente do agrupamento administrativo.


## Conferência manual pendente — acordeão e controles do Editor — 30/10/2026

Implementação no [`0c2abd0`](https://github.com/tuliustsangaropulos/PortfolioTulius/commit/0c2abd042b1050ec1db5899c13438a9fb367101f), [CI #41136712312](https://github.com/tuliustsangaropulos/PortfolioTulius/actions/runs/41136712312) **success** e [Vercel Production READY](https://vercel.com/tuliustsangaropulos-creates-projects/portfolio-tulius/UN2YUd9uz1QxXWL1nCARrJinKFkP). Os itens de blocos ficam recolhidos (um expandido por vez), com ajuda contextual em Valor/métrica, Metadado/URL e Imagem do item, input de alt junto ao título e botões de mídia somente com ícones no seletor indicado. A regressão de lógica de expansão/reordenação/exclusão tem testes unitários.

**Aceite manual da interface continua pendente:** verificar hover/clique/teclado nas ajudas, nome acessível dos ícones, alinhamento em desktop/mobile e retenção de rascunhos ao mudar de item. Sem homologar escrita real na produção enquanto P2 estiver suspenso. A auditoria [P3 #41136601132](https://github.com/tuliustsangaropulos/PortfolioTulius/actions/runs/41136601132) encerrou globalmente em `failure` porque o SHA inicial deixou de ser servido durante as correções posteriores. Os testes públicos **13/25/38**, browser **0 falhas** e P5 **3/3 sem mutações** passaram; Lighthouse não foi executado, logo não há nova medida válida de LCP. P3 mobile LCP ≤2,5 s continua em aberto e não foi declarado resolvido por esta mudança administrativa.


## Editor administrativo integrado — 30/10/2026

**Implementado no SHA funcional [`bc4f3ca`](https://github.com/tuliustsangaropulos/PortfolioTulius/commit/bc4f3cadc3de8751039954e46b1c19ef05c406a2):** uma entrada **Editor do site** integra a navegação de seções, blocos e coleções; o editor identifica a fonte manual/vinculada, oferece formulário avançado recolhível, prévia protegida e alertas de alterações não salvas. CI [#41134897178](https://github.com/tuliustsangaropulos/PortfolioTulius/actions/runs/41134897178) **success**, Vercel Production **READY** no mesmo SHA. Sem mutação Supabase nem mudança da aplicação pública fora de CSS administrativo.

**Acompanhar na verificação manual:** inspeção da nova navegação contextual e das transições com rascunhos no CMS autenticado, inclusive criação de seção e registro; testar persistência real apenas se o P2 transacional for reautorizado com ambiente isolado. O P3 [#41134316506](https://github.com/tuliustsangaropulos/PortfolioTulius/actions/runs/41134316506) passou nas verificações públicas 13/25/38 e P5 3/3 sem mutações, mas terminou **failure pelo LCP mobile ~7,54 s** acima do orçamento P6 de 6,5 s. A meta ≤2,5 s continua aberta; não reabrir redesign do site público por esse fato isolado. O novo editor não cria vínculo entre coleções e blocos automaticamente.


## P3-PERF-01 — 29/10/2026: gargalo de imagem continua aberto

**SHA funcional:** [`4a8412e`](https://github.com/tuliustsangaropulos/PortfolioTulius/commit/4a8412e93c99db4fae15e57d1e19785581daaf51). [CI #40824692978](https://github.com/tuliustsangaropulos/PortfolioTulius/actions/runs/40824692978) **success**, deployment Vercel Production **READY** no mesmo SHA, [P3 #40824693037](https://github.com/tuliustsangaropulos/PortfolioTulius/actions/runs/40824693037): **failure exclusivamente no orçamento sintético P6 mobile**.

**Resolvido:** bloqueio da auditoria por ausência do status GitHub `Vercel`; a checagem lê o SHA implantado em produção e permitiu executar as seis amostras. **Ainda aberto:** LCP mobile mediano **7,55 s** / alvo **≤2,5 s**, com orçamento conservador P6 de 6,5 s reprovado. O retrato é um PNG CMS/Supabase atual, potencial de economia aproximado de **1.008 KiB** apontado pelo Lighthouse; requer obter/servir derivada otimizada preservando original, sem executar transformação cobrável ou gravação CMS/Storage em produção. A auditoria funcional 13/25/38 e P5 3/3 passou; não confundir com P6. [Evidências e diagnóstico](P3_QUALIDADE_ACEITE_2026-10-28.md).


## Verificação manual — Olá! e Invest RS, 29/10/2026

- **Seção 02 “Olá!” (somente desktop):** para que a silhueta da fotografia personalizada alcance a margem inferior do painel, `src/index.css` compensou a faixa transparente inferior da imagem com altura `calc(100% + clamp(2rem, 5.5dvh, 3rem))`, posicionada no topo e recortada pelo contêiner existente. Mantidos fonte original no Supabase, enquadramento do CMS, colunas, textos, cor laranja e composição mobile. Sem zoom/scale global.
- **Logos das experiências:** a borda e o preenchimento cinza foram retirados somente de `.experience-heading > .company-mark` (logo acima do título da empresa). Os seis ícones do seletor superior mantêm bordas, tamanho, links e navegação.
- **Invest RS:** de oito itens cadastrados, ficam **quatro visíveis** (Competências aplicadas; Guia de Boas-Vindas; Organização de eventos; Plataforma de eventos e relacionamento) e **quatro marcados `isHidden=true`** (Estratégia de CRM e mailing institucional; Cartões de visita digitais; Conteúdo e apresentações institucionais; Inovação, IA e automação). Os dois últimos já estavam ocultos. Nenhum texto, registro, bloco ou slide foi excluído ou alterado. A alteração foi transacionada no JSONB do bloco B `222cc514-c860-4ec4-bc01-40a9084dc2e9` com guardas de título e estado anterior, e conferida em leitura posterior. O painel **Blocos** continua com a opção “Exibir este item em Projetos e realizações” e indica “Ocultado”. O conteúdo de fallback foi alinhado com a publicação; outras cinco empresas mantidas.
- **Critério de regressão:** `scripts/p3-browser-smoke.mjs` ganhou `P3_ABOUT_INVEST_FIT` para 1512×691, zoom nativo: altura/recorte da foto desktop, borda inexistente do logo grande, borda preservada na navegação superior, exatamente quatro projetos Invest RS e ausência de scroll interno. Aferir junto à auditoria P3; teste automatizado não substitui inspeção visual real.

**Commit funcional:** [`d882d7a`](https://github.com/tuliustsangaropulos/PortfolioTulius/commit/d882d7a71ff45e0d6980cf85fbcaa6533f0f89db). [CI #40815457072](https://github.com/tuliustsangaropulos/PortfolioTulius/actions/runs/40815457072) `success`, Vercel Production `READY`; [P3 #40815457107](https://github.com/tuliustsangaropulos/PortfolioTulius/actions/runs/40815457107) em execução na criação deste registro. P2 transacional continua suspenso e LCP mobile ≤2,5s permanece pendente. Não houve custo adicional, mudança de RLS, Storage, arquivo de mídia ou estrutura do banco.


## Biblioteca de Mídia — editor no item e status editorial único (29/10/2026)

**Escopo autorizado:** a Biblioteca de Mídia do CMS agora substitui a miniatura clicada por um editor **na mesma posição da grade** (largura de duas colunas com reflow responsivo); o editor não é mais montado no final da página. Botão de fechamento **X** com rótulo acessível. Foi removido **apenas o controle de entrada “Texto alternativo”**; os metadados antigos `alt_text` permanecem no banco, e a prévia do admin continua a usá-los quando existentes, com fallback para o nome do arquivo. Fotos e componentes públicos conservam seus `alt` próprios.

**Status:** a única opção editorial no admin é **Publicado**; a interface não oferece mais o seletor Rascunho/Em revisão/Arquivado. Em upload e substituição, o registro `media_assets.status` é gravado como `published`, mas o arquivo novo/substituído continua inicialmente em `portfolio-private` **até o usuário acionar “Disponibilizar no site”**. Esse controle continua usando a cópia segura Storage→Storage já existente, com rollback quando os metadados não persistem, sem sobrescrever um arquivo público diretamente. Arquivos públicos continuam sem substituição direta para não expor rascunhos. O botão **Salvar** preserva `alt_text`, `storage_path` e outros metadados não editados.

**Banco no encerramento desta atualização:** após identificar uploads concorrentes ocorridos durante a inspeção, a atualização guardada e não destrutiva foi concluída com **27 registros `published`** (**24** em `portfolio-public` e **3** em `portfolio-private`); **21 textos alternativos não vazios preservados**. O primeiro plano SQL foi abortado antes da gravação ao detectar 25→27 registros. RLS vigente `public media metadata` exige `status='published' AND storage_bucket='portfolio-public'` para leitura anônima; `PublishedMediaPicker` aplica ambos os filtros, portanto a unificação de status não expõe mídias privadas. A nova prova unitária `media-publication.test.ts` verifica esse filtro. Nenhum arquivo foi excluído ou copiado, nenhum bucket foi aberto e nenhuma política de RLS foi alterada. **Publicado é status editorial, não afirmação de disponibilidade pública de mídia privada.**

**Código:** [`6c5e3e0`](https://github.com/tuliustsangaropulos/PortfolioTulius/commit/6c5e3e0f8991d825652844decbd482b86892457b), formatado em [`c9cb3de`](https://github.com/tuliustsangaropulos/PortfolioTulius/commit/c9cb3dee73fadd11fc1a7bae86a78e8a89e039fb). [CI #40812587748](https://github.com/tuliustsangaropulos/PortfolioTulius/actions/runs/40812587748) `success`. [P3 #40812459767](https://github.com/tuliustsangaropulos/PortfolioTulius/actions/runs/40812459767) validou 13 seções, 25 painéis mobile, 38 capturas, zero falhas de browser e P5 público 3/3; **o gate Lighthouse P6 falhou** por LCP mobile instável (~7,68 s) e ausência de correspondência do retrato na amostra. Nova execução solicitada; **não considerar o P3 aprovado até confirmação**. A homologação de gravações com JWT administrativo real permanece suspensa conforme P2, de modo que o fluxo de upload/publicação não deve ser declarado homologado ponta a ponta.


## Menu público sem grupos — compactação final (29/10/2026)

**Solicitação do proprietário:** manter as oito opções integralmente visíveis, evitando rolagem vertical nas alturas usuais; remover da navegação pública os subtítulos `PERFIL`, `EXPERIÊNCIA`, `REFERÊNCIAS` e a assinatura `Comunicação · Estratégia · Reputação`. Não modificar nomes, ordem, numeração nem âncoras dos oito links.

**Implementação:** `src/components/public/Navigation.tsx` não renderiza títulos de grupo nem a assinatura estática. `src/index.css` usa espaçamento compacto e linhas com `grid-auto-rows: clamp(44px, 9dvh, 72px)`; todos os alvos têm altura mínima de 44 px. A rolagem permanece apenas como fallback para zoom de acessibilidade, excesso futuro de itens ou viewport excepcionalmente baixo. Menu responsivo sem `zoom` CSS ou mudanças na identidade visual.

**Admin:** `NavigationStudio` remove o campo de grupos, mantém rótulo, âncora, status, visibilidade, reordenação e salvar. Novos registros e gravações posteriores usam `group_name='Menu'` por compatibilidade com a coluna existente. **Supabase:** os 14 registros da tabela `public.navigation_items` foram atualizados apenas no campo `group_name` de Perfil/Experiência/Referências para `Menu`, transação com guardas de 14 totais e 8 visíveis. Conferência após atualização: **14 registrados, 8 visíveis, 6 ocultos, grupo único Menu**. Sem DDL, alterações RLS, exclusões, mudança de textos/âncoras, custos ou migrações; a frase final era hardcoded, não existia em `site_settings`.

**Evidência:** commit funcional [`bfd3f7e`](https://github.com/tuliustsangaropulos/PortfolioTulius/commit/bfd3f7e25b03dc6fa0e647f44eb1f3bb92905f96) com formatação no [`0e06df6`](https://github.com/tuliustsangaropulos/PortfolioTulius/commit/0e06df6c031e01da3bf9453f8a6246d1f80409b1), [CI #40810591049](https://github.com/tuliustsangaropulos/PortfolioTulius/actions/runs/40810591049) **success** e [P3 #40810488285](https://github.com/tuliustsangaropulos/PortfolioTulius/actions/runs/40810488285) **success**. Teste `P3_MENU_FIT_MOBILE` em **390×844**: 8 links, grupos 0, footer ausente, `scrollHeight=clientHeight=844`, último link até y=662,09. Teste `P3_MENU_FIT_DESKTOP` em **1512×691**: 8 links, grupos 0, footer ausente, `scrollHeight=clientHeight=691`, último link até y=573,58. P3: **0 falhas**, 13 seções, 25 painéis mobile, 38 capturas, P5 anônimo 3/3, zero mutações. Mobile Lighthouse Performance 82, LCP **4,44 s**, meta ≤2,5 s ainda aberta; desktop LCP **1,18 s**.

**Prevenção:** os testes P3 agora verificam número de links, ausência de grupos/rodapé, ausência de rolagem interna e visibilidade do último link, além de foco e Escape. A frente de P2 transacional segue suspensa; não equiparar o teste de leitura pública à homologação de escrita CMS com JWT real.


## Refinamento tipográfico pontual da primeira seção — 29/10/2026

**Pedido atendido:** melhorar a legibilidade dos textos menores, o ritmo dos quatro destaques laterais e a numeração dos cinco cards da abertura, **sem alterar a composição editorial aprovada**. A intervenção está estritamente localizada no CSS `@media (min-width: 1101px)`: mantém a divisão das colunas, retrato, selo 360°, título principal, paleta, conteúdo, foto e layout mobile.

- Legibilidade: descrições das experiências e dos destaques laterais agora têm ao menos **11,52 px** no viewport de referência; frase em itálico **12,64 px**; títulos dos destaques com incremento discreto.
- Competências: numeração laranja dos cinco cards em **9,76 px**, mantendo fundo, posição, links e contraste.
- Compensação de microespaçamentos na coluna esquerda (gap entre introdução e lista, gap dos destaques e padding dos itens) para não empurrar `IDIOMAS` para fora da primeira dobra.
- **Proibida a reintrodução de zoom/transform global.** O tamanho do título principal, o selo e a fotografia não mudaram.

**Evidência do SHA funcional:** [`c098a60`](https://github.com/tuliustsangaropulos/PortfolioTulius/commit/c098a60d306601ac7d2e8e24ba41be80891832fd), [CI #40807420317](https://github.com/tuliustsangaropulos/PortfolioTulius/actions/runs/40807420317) **success** e [P3 #40807420323](https://github.com/tuliustsangaropulos/PortfolioTulius/actions/runs/40807420323) **success**. No viewport **1512×691**, com escala CSS nativa 1: cabeçalho 54 px; título a 66 px; cards de 199 a 281 px; último destaque termina em 669,39 px; **sobreposição selo/anos = 0 px²**. P3: **13 seções, 25 painéis mobile, 38 capturas, 0 falhas e P5 anônimo 3/3 sem mutações**. Lighthouse mediano: mobile Performance 82, **LCP 4,45 s** (meta ≤2,5 s **ainda não atendida**); desktop Performance 98, LCP 1,15 s. Nenhuma mudança Supabase, Storage, CMS, migração, token ou custo.

A referência visual de densidade continua sendo a **última captura fornecida com o navegador a 75%, desejada a 100%**; as referências antigas ficam como histórico. A comparação estética final em navegador físico fica a critério do proprietário, sem reabrir aceites anteriores.


## Referência desktop vigente — 29/10/2026 (substitui a referência histórica de 125%)

**Solicitação mais recente:** em 1512×691 px de área útil, a captura de navegador a **75%** é a composição desejada **com o navegador em 100%**. Os ajustes anteriores que usavam a captura a 125% como referência ficam **históricos/superados**. Nunca reproduzir a densidade por `zoom`, `transform:scale()` no contêiner raiz, alteração global do `html` ou cálculo de escala baseado em `vw` aplicado à página inteira.

A correção [`90975ca`](https://github.com/tuliustsangaropulos/PortfolioTulius/commit/90975ca6fea36095920eaccd0344aab4a2ad3cde) calibra apenas **tipografia secundária, espaçamentos de cards, ritmos verticais e altura do cabeçalho** dentro de `@media (min-width: 1101px)`. A foto, largura das duas colunas, título principal e selo circular mantêm a geometria original, com pequeno deslocamento local do selo para eliminar colisão com o texto. O `--header` reduzido é restrito à página pública em desktop largo; admin, mobile e dados Supabase não mudaram.

**Evidências automatizadas:** [CI #40806132618](https://github.com/tuliustsangaropulos/PortfolioTulius/actions/runs/40806132618) `success`; [P3 #40806132632](https://github.com/tuliustsangaropulos/PortfolioTulius/actions/runs/40806132632) `success`, Vercel Production `READY` no mesmo SHA funcional. No viewport de referência **1512×691, escala nativa 1**, o teste `P3_DESKTOP_DENSITY` registrou `headerHeight=54`, `nameTop=66`, `nameFontPx=85`, `cardsTop=199`, `cardsBottom=279`, `finalHighlightBottom=669.2`, `badgeYearsOverlapPx2=0`. Navegador `failures=0`, 13 seções, 25 painéis mobile, 38 capturas editoriais sem falhas e P5 público 3/3 sem mutações. Medianas Lighthouse: mobile Performance **83**, LCP **4,30 s** (meta ≤2,5 s ainda pendente); desktop Performance **97**, LCP **1,17 s**.

**Prevenção:** `src/lib/layout-zoom.test.ts` continua proibindo zoom global; o P3 agora mede as posições da primeira dobra em 1512×691, além de 12 outras resoluções, exige o último destaque visível e detecta interseção do selo com a descrição. Esses testes não substituem a confirmação visual do proprietário em seu navegador físico; **somente o aceite estético da nova composição fica aguardando inspeção**.


> **Estado das pendências após a conversa — 28/10/2026.** A rodada manual de experiências, depoimentos, Contato, menu e CMS foi declarada validada pelo proprietário. A correção posterior da **escala desktop nativa** passou no P3, sem `zoom` global em 12 resoluções, porém a equivalência estética exata com a última referência ainda não recebeu confirmação após o deployment. Permanecem o **LCP mobile ≤2,5 s**, o **P2 transacional suspenso**, decisões separadas de P1/segurança e **oito ocorrências editoriais**. O registro histórico detalhado abaixo inclui frases de etapas superadas e deve ser lido nessa ordem de precedência. [Resumo do chat](CONTINUIDADE_CHAT_MANUAL_ZOOM_E_FONTES_2026-10-28.md).

> **Decisão posterior do proprietário — 28/10/2026:** a verificação manual visual e funcional de todas as áreas ajustadas neste chat foi **validada pelo proprietário**. Não solicitar novo aceite visual dessas áreas por rotina. A aceitação manual não homologa CRUD/Storage com JWT administrativo, não atinge automaticamente a meta LCP mobile e não autoriza exclusões, custos ou mudanças de segurança. O estado técnico vigente é sempre o HEAD e seus testes, nunca os SHAs históricos citados abaixo.

## Etapa 5 — Aceite automatizado concluído; manual separado (28/10/2026)

A [reexecução GitHub Actions #40757162085 (tentativa 2)](https://github.com/tuliustsangaropulos/PortfolioTulius/actions/runs/40757162085) confirmou **13 seções, 25 painéis mobile, 38 capturas, 8 viewports e zero falhas**. [Termo de aceite automatizado](P3_ACEITE_AUTOMATIZADO_FINAL_2026-10-28.md). **Não é pendência repetir essa auditoria automaticamente** sem nova alteração relevante do site.

**Aberto em frente distinta / novo chat:** aceite manual visual e funcional em dispositivos reais, zoom 200% nativo, leitor de tela e ajustes decorrentes da análise do proprietário. **Aberto no P3:** meta LCP mobile ≤2,5 s. **Bloqueado no P2:** ensaios transacionais, por decisão de não aprovar custos adicionais.

**Última revisão documental:** 28/10/2026. Este arquivo contém **somente itens abertos**, com escopo, evidência e próxima decisão. O [histórico acumulado até esta revisão](historico/OPEN_ISSUES_ACUMULADO_ATE_2026-10-28.md) preserva todas as notas de 25–28/10, inclusive falhas P5 já resolvidas e antigas cotas/deployments Vercel. A referência principal de estado é o [índice operacional](ESTADO_ATUAL_VIGENTE.md).

## Bloqueio deliberado — P2 transacional (28/10/2026)


**P2-TRANS-00 — SUSPENSO POR DECISÃO DO PROPRIETÁRIO.** O proprietário **não aprovou despesas neste momento**. Cotação consultada para uma branch Supabase de homologação: **US$ 0,01344/h**, mais possíveis cobranças por consumo. Não houve confirmação de custo nem criação de branch; o ambiente isolado inexiste.

**Não executar até nova autorização expressa:** criação de projeto/branch de homologação, confirmação de custo, provisionamento de usuários ou Secrets de staging, execução manual do workflow P2 ou qualquer substituição por CRUD/Storage na produção. Os itens **P2-TRANS-01 a P2-TRANS-04 permanecem abertos e bloqueados por P2-TRANS-00**, não reprovados nem concluídos. P5 administrativo read-only continua **PASS 4/4**. A [suíte preparada](P2_TRANSACIONAL_STAGING_2026-10-28.md) fica versionada, sem execução. **Não reapresentar aprovação de custo por rotina**; somente se o proprietário retomar a frente ou trouxer alternativa isolada autorizada. P3 performance segue como frente independente.

## Prioridade alta

| Código | Frente | Evidência atual | Critério para encerrar |
|---|---|---|---|
| **P2-TRANS-01** | CRUD e publicação reais CMS | [P5 read-only 4/4 aprovado](P2_HOMOLOGACAO_ADMINISTRATIVA_2026-10-28.md); **não testou gravação** | Fixture isolada, JWT admin real, criar/editar/reordenar/publicar/verificar/reverter sem tocar conteúdo aprovado; logs e antes/depois |
| **P2-TRANS-02** | Storage binário real | Consultas RLS e `storage.objects` existem; não comprovam transferência real de bytes | Fixture PNG sintético, checksum, upload privado/download autorizado/bloqueio não admin/promoção/substituição/limpeza, com recuperação verificada |
| **P2-TRANS-03** | Recuperação de conteúdo | `content_revisions=12`, `audit_logs=12`; [ADMIN_CMS](ADMIN_CMS.md) documenta **restauração pela UI não implementada** | Definir se é requisito de UI: implementar e testar quando autorizado, ou homologar procedimento operacional reversível e explicitar limitação |
| **P2-TRANS-04** | Autorização negativa real | Papel não admin e claims foram **simulados** em SQL; P5 usa somente conta admin real | Conta de teste não admin isolada e JWT emitido pelo Auth; verificar API HTTP/Storage sem expor tokens |
| **P3-PERF-01** | LCP mobile | [P3 válido #40747019980](https://github.com/tuliustsangaropulos/PortfolioTulius/actions/runs/40747019980): mobile Performance 82, LCP **4,38 s** | Baseline repetido no SHA correto, análise causal React/Supabase, otimização pontual + medição comparável; alvo **≤2,5 s**, sem regressão |
| **P0-FONTES-01** | Seleção de Fontes ChatGPT | Guia atualizado nas Fontes, mas inventário ainda contém oito históricos/ativos e precisa de limpeza manual | Arquivar backups, preservar variante de 80 linhas, retirar redundâncias das Fontes e acrescentar guia/índice vigente; conferir lista final |

## Prioridade média — decisões ainda abertas

| Código | Frente | Condição para concluir |
|---|---|---|

| **P1-MIDIA-01** | Proveniência | Conferir licença e créditos dos 2 PNGs (usados InPress/Vale) e decidir entre as duas coleções divergentes de 19 SVGs; ambas são **ilustrativas** |
| **P1-STORAGE-01** | Objetos privados | Dois PNGs privados têm par público equivalente por path/tamanho/`eTag`; definir política de retenção, backup e integridade antes de qualquer exclusão |
| **P1-FUNC-01** | Edge Function inativa | Função de importação v2 está implantada mas responde 410; validar integrações externas e recuperação antes de eventual undeploy |
| **P1-BRANCH-01** | Branches antigas | Branch navegação: 4 commits exclusivos revisados, principal comportamento já está na `main`; motion: 0 exclusivos. Manter até aprovação expressa para arquivar/excluir |
| **P0-HIST-01** | Fonte seção 01 | A Fonte ChatGPT de **80 linhas** diverge da versão GitHub de **53**; backup histórico integral deve ser guardado antes de removê-la da lista ativa |

## Aceite manual encerrado na conversa atual

**P3-VISUAL-01 — encerrado por decisão expressa do proprietário:** a conferência visual e funcional solicitada neste chat foi declarada validada. Esta declaração não equivale a auditoria instrumental adicional de leitor de tela, testes transacionais ou desempenho mobile. Os parágrafos históricos abaixo conservam sua redação da época.

## Pendências editoriais no banco

**8 linhas `editorial_issues` abertas e 1 resolvida** em 28/10/2026; **não** são os códigos de trabalho técnico da tabela acima. O inventário no GitHub contém apenas contagens agregadas, sem reproduzir anotações internas não publicadas. A avaliação/fechamento editorial deve ocorrer no CMS, com confirmação do proprietário. Os SVGs não comprovam projetos reais e os PNGs de logotipo não possuem créditos de licença verificados.

## Decisões preservadas, não classificadas como correção técnica

A decisão anterior de **não revogar o token pessoal Supabase historicamente exposto** e **não habilitar Leaked Password Protection** foi expressamente registrada; ambos são riscos aceitos, não resolvidos e **não devem ser alterados sem nova autorização**. [Contexto histórico de segurança](SECURITY_RLS.md).

## Já homologado — não reabrir automaticamente

- P5 admin read-only: [#40745631770](https://github.com/tuliustsangaropulos/PortfolioTulius/actions/runs/40745631770), login/8 módulos/prévia/logout **4/4 PASS**, `contentMutations=0`. Falhas de execuções antigas pertencem ao histórico.
- P3 público automatizado: [#40747019980](https://github.com/tuliustsangaropulos/PortfolioTulius/actions/runs/40747019980), 13 seções/25 painéis/38 screenshots, SEO e a11y 100, sem falhas de viewport; ainda há as ressalvas acima.
- Infraestrutura anterior à consolidação: [CI `40747847554`](https://github.com/tuliustsangaropulos/PortfolioTulius/actions/runs/40747847554) e [Vercel `dpl_GAgdukRpirZ8j3foDFB4E5FKEtNk`](https://vercel.com/tuliustsangaropulos-creates-projects/portfolio-tulius/GAgdukRpirZ8j3foDFB4E5FKEtNk) no mesmo SHA `56cce265`. A nova consolidação também dispara CI/deploy próprio.

## P3 — ensaio de carregamento inicial (28/10/2026)

Experimento com consultas SEO fora da barreira de renderização, preservando as cinco dependências editoriais de `usePortfolio` e registrando marcos `P3_FIRST_FOLD_TIMING`. **Pendente verificação de Lighthouse no novo SHA**, sem assumir redução de LCP; [detalhes](P3_QUALIDADE_ACEITE_2026-10-28.md).

## P3 — estabilidade do LCP em laboratório

A primeira dobra renderizada separadamente reduziu o LCP num run, mas elevou o TBT mobile: [run #40755835498](https://github.com/tuliustsangaropulos/PortfolioTulius/actions/runs/40755835498) (LCP 3,97 s, TBT 1.086 ms, Performance 60). Essa alteração foi **revertida**, preservando a separação assíncrona de SEO. A auditoria foi ampliada para **três medições mobile** e mediana; a meta LCP ≤2,5 s continua aberta. Ver [P3](P3_QUALIDADE_ACEITE_2026-10-28.md).

## P3 — primeira mediana Lighthouse de 3 amostras (28/10/2026)

[Run #40756305871](https://github.com/tuliustsangaropulos/PortfolioTulius/actions/runs/40756305871), mesmo SHA/Vercel: amostras mobile **54/83/83** em Performance; **4,89/4,31/4,23 s** LCP. **Mediana 83 e 4,31 s**, TBT mediano 47 ms, Accessibility/SEO 100; todos os 13/25/38 testes de browser passaram. Run saiu `failure` porque o gate anterior olhava somente a primeira amostra 54. Gate atualizado para mediana, sem relaxar limites; ainda exige nova execução. **Meta 2,5 s continua não atendida.**

## P3 — mediana estabilizada com workflow aprovado (28/10/2026)

[Audit #40757162085](https://github.com/tuliustsangaropulos/PortfolioTulius/actions/runs/40757162085) passou no SHA `50a66f8`, com **3 mobile + 3 desktop**. Mediana mobile **82/100 e LCP 4,32 s**, desktop **98/100 e 1,16 s**; A11y, SEO e boas práticas 100; **13/25/38 PASS**. Primeira amostra mobile Performance 53 e TBT 1.479 ms, outras duas 82 e 0–1 ms: manter monitoramento de variância, não declarar performance estável em dispositivo real. O **LCP mobile ≤2,5 s permanece pendente**; [P3](P3_QUALIDADE_ACEITE_2026-10-28.md).

**P2 transacional:** [workflow isolado preparado](P2_TRANSACIONAL_STAGING_2026-10-28.md), sem execução de fixture até criar staging e aprovar custo/credenciais de teste. Não usar produção.

## Acompanhar após esta rodada manual (28/10/2026)

Alterações implementadas conforme pedido: listas públicas de experiência com flag `isHidden` (sem apagar 13 itens), cinco depoimentos na coleção (dois **fictícios explicitamente sinalizados**), grade de cards expansíveis, rodapé/foto/setas de Contato e menu lateral de oito entradas. Não reabrir como pendências de implementação se CI e auditoria estiverem aprovados, mas **validar manualmente** a aparência nas resoluções reais, truncamento e expansão dos depoimentos, links da barra das seis experiências, legibilidade do rodapé e ausência de sobreposição no LinkedIn. Confirmar que o CMS exibe o rótulo **Ocultado** para os 13 itens, e que os novos depoimentos estão editáveis em **Coleções → Depoimentos**. Não confundir os dois exemplos fictícios com recomendações profissionais reais; decidir posteriormente se serão substituídos por depoimentos autênticos.

Permanece o bloqueio deliberado do P2 transacional e a meta LCP mobile ≤2,5 s; o acréscimo de conteúdo via SQL solicitado pelo proprietário não equivale a homologar fluxos de CRUD com JWT pela interface.

### Validação, sem encerramento do aceite humano

**Validação automatizada da rodada manual (28/10/2026):** [CI Validate #40773898800](https://github.com/tuliustsangaropulos/PortfolioTulius/actions/runs/40773898800) `success`; [Audit P3 #40773898835](https://github.com/tuliustsangaropulos/PortfolioTulius/actions/runs/40773898835) `success`, no SHA funcional [`faa43e2`](https://github.com/tuliustsangaropulos/PortfolioTulius/commit/faa43e2709bdcbe917e6e81bee2abb220dde5456) com Vercel Production `READY` antes da auditoria. Navegador: 13 seções, 25 painéis mobile, 8 viewports sem overflow, navegação sticky `PASS`, 38 capturas (13 desktop/25 mobile), zero falhas e zero painéis inadequados. P5 anônimo: 13 seções e 8 links de menu válidos, sem exposição de dados privados, `mutations=0`. O teste P4 reconhece a composição **intencionalmente fotográfica** de `contato/a` mobile somente quando a imagem existe e decodifica; todos os demais painéis mantêm critérios originais de conteúdo. Lighthouse mediano: mobile 75/LCP 4,69 s; desktop 94/LCP 1,56 s. Gate de regressão passou, mas LCP mobile ≤2,5 s **não está aprovado**. Aceite humano permanece aberto.

## Pendência de homologação administrativa — revisão manual (28/10/2026)

A inspeção de todos os módulos e os ajustes de UI de Seções/Mídia não substituem testes transacionais com autenticação administrativa: permanece pendente validar em ambiente seguro, com autorização, o ciclo **editar → salvar → reler → publicar/arquivar → verificar no público** em Seções, Blocos, Coleções, Identidade, Mídia, Navegação, SEO e Revisões, além de upload/substituição e RLS efetiva. Revisão de enquadramento por área: verificar também recortes reais em desktop/mobile e zoom nativo. Não executar esses testes em produção por conveniência enquanto P2 estiver suspenso.

O formato Open Graph depende dos pixels reais do arquivo compartilhado: CSS do portfólio não recorta imagens de terceiros. Os 19 créditos legados permanecem retidos, embora não apresentados/editados; eventual limpeza exigiria decisão separada, pois o pedido atual foi remover o **campo da interface** e não apagar dados históricos.

### Evidências da auditoria administrativa integral — 28/10/2026

[Relatório por aba](AUDITORIA_ADMIN_MANUAL_2026-10-28.md): auditoria de código de dez áreas, sem mutações P2. CI #40776321190 aprovado; auditoria pública P3 #40776111312 aprovada; 21/21 títulos de mídia sincronizados com nome de arquivo no Supabase e 19 créditos históricos preservados sem uso. O LCP mobile e o teste real de gravação do CMS permanecem pendentes.

### Auditoria da versão funcional de correções — 28/10/2026

[CI de implementação #40781440231](https://github.com/tuliustsangaropulos/PortfolioTulius/actions/runs/40781440231) **success** no SHA [`ae4033e`](https://github.com/tuliustsangaropulos/PortfolioTulius/commit/ae4033e3720d8252e5af3270c71f7470877341ec). [Auditoria P3 #40781440227](https://github.com/tuliustsangaropulos/PortfolioTulius/actions/runs/40781440227) **success**, 8 viewports sem overflow, 13 seções, 25 painéis, 38 capturas sem falhas, 6 experiências navegáveis, P5 anônimo 3/3, nenhum dado de produção escrito. Lighthouse mediana de três amostras: **mobile Performance 80, LCP 4,38 s**; **desktop Performance 97, LCP 1,09 s**. A meta mobile ≤2,5 s não foi alcançada. Diagnóstico registrou fonte Google render-blocking e custo de execução/avaliação do bundle JavaScript, além da variabilidade de laboratório. A antecipação da consulta de depoimentos remove etapa sequencial de rede, mas não comprova ganho sustentável de LCP. **Não alterar orçamento de regressão para declarar o requisito aprovado.** A auditoria de browser foi executada no SHA funcional; os commits posteriores apenas documentam o aceite manual.

As verificações da versão documental de `main` são [CI #40781599089](https://github.com/tuliustsangaropulos/PortfolioTulius/actions/runs/40781599089) e [Export Docs #40781598923](https://github.com/tuliustsangaropulos/PortfolioTulius/actions/runs/40781598923), ambas **success**. Vercel Production `READY` no mesmo commit documental antes deste registro. A declaração expressa do proprietário encerra a fase de aceite manual do chat; não encerra metas de performance ou P2 transacional.

## Zoom CSS global removido — prevenção de regressão (28/10/2026)

Novo achado manual: 100% de zoom do navegador exibindo conteúdo pequeno, com referência desejada em 125%. **Causa técnica solucionada no código:** removido o antigo `--desktop-visual-scale` de `.public-site` e as compensações associadas. A garantia estática `src/lib/layout-zoom.test.ts` e a auditoria de navegador P3 cobrem zoom/transform globais e a transição desktop/tablet. Se as capturas a 100% em navegador físico mostrarem diferenças do anexo desejado, corrigir dimensões locais de componentes, sem retornar a zoom global. Não reabrir o aceite dos demais ajustes já aprovados; P2 e LCP mobile permanecem independentes.

### Evidências do ajuste nativo de escala — Auditoria 28/10/2026

**SHA funcional** [`8a45e9b`](https://github.com/tuliustsangaropulos/PortfolioTulius/commit/8a45e9bc0663ee15e9b0797785900308f6622712), [CI Validate #40794804474](https://github.com/tuliustsangaropulos/PortfolioTulius/actions/runs/40794804474) **success**, [P3 Lighthouse + browser #40794804504](https://github.com/tuliustsangaropulos/PortfolioTulius/actions/runs/40794804504) **success** e Vercel Production `READY` no mesmo SHA previamente à auditoria.

**Novos testes do contrato de escala:** 12/12 viewports (1920×1080, 1757×832, 1440×900, 1366×768, 1200×800, 1101×800, 1100×800, 768×1024, 720×450, 390×844, 360×800, 320×700) registraram `getComputedStyle(.public-site).zoom === "1"`, `transform === "none"` e `overflowPx=0`. A passagem de 1101 para 1100 px não altera artificialmente a escala (fonte da marca: 61,656 px e 61,6 px, respectivamente). **13 seções**, **25 painéis mobile**, **38 capturas editoriais**, **nenhum erro** de navegador ou painel; 6 experiências e galeria navegáveis. P5 público anônimo 3/3 e `mutations=0`.

**Performance (mediana de 3 execuções Lighthouse)**: mobile Performance **78**, LCP **4,36 s**, desktop Performance **97**, LCP **1,09 s**. O gate de regressão foi aprovado, porém **LCP mobile ≤2,5 s não foi atingido**. Alteração de zoom não constitui intervenção em performance mobile. O teste em 720 px é uma simulação por largura de viewport e **não** comprova zoom nativo de 200% em todos os navegadores.

O mecanismo global anterior deve permanecer **proibido** pelo teste `src/lib/layout-zoom.test.ts` e pela checagem de estilo calculado `P3_VIEWPORT`; correções futuras de tipografia/densidade devem ser locais e responsivas, sem novo percentual de zoom CSS.

### P3-PERF-01 — nova medição do LCP mobile (29/10/2026 UTC)

**Aberto: objetivo ≤2,5 s ainda não atendido.** Código funcional `4ab9ce5`: mediana de três amostras mobile **4,30 s**, Performance 80; [P3 #40797703855](https://github.com/tuliustsangaropulos/PortfolioTulius/actions/runs/40797703855) `success`. Baseline anterior 4,36 s; a pequena diferença não comprova melhoria causal. Mantida a eliminação da dupla árvore React desktop/mobile. Revertidos `content-visibility` e fontes Google não bloqueantes porque não melhoraram LCP. Próxima frente: reduzir o trabalho do JavaScript inicial (bundle vendor/React/Supabase), sem mudanças em produção não autorizadas. [Relatório](P3_QUALIDADE_ACEITE_2026-10-28.md).

### P3-LCP — ensaio de divisão de JS, 29/10/2026 UTC

**Meta ≤2,5 s aberta.** Experimento de REST anônimo customizado `7049ee2/41817e6` gerou página vazia e **foi revertido** (`49fbfda`). O LCP ~2,26 s durante a falha **não é válido**, porque 0 seções foram renderizadas. O P3 de recuperação [#40799749896](https://github.com/tuliustsangaropulos/PortfolioTulius/actions/runs/40799749896) passou com 13/25/38 e LCP mobile **4,312 s**. A abordagem segura `e1846ac` preserva o SDK e separa chunks apenas no Vite, [P3 #40799952773](https://github.com/tuliustsangaropulos/PortfolioTulius/actions/runs/40799952773) `success`, LCP **4,248 s**, porém sem melhora causal demonstrada. Novo gate `P6_LCP_CONTENT_GATE` exige o retrato real em todas as amostras; não aceitar score de página vazia. [Relatório P3](P3_QUALIDADE_ACEITE_2026-10-28.md).

### Auditoria final da proteção P6 e divisão dos chunks — 29/10/2026 UTC

No SHA funcional [`cc30446`](https://github.com/tuliustsangaropulos/PortfolioTulius/commit/cc304462bf9bf2ab0d8583b85920eb136a127916), [CI #40800444163](https://github.com/tuliustsangaropulos/PortfolioTulius/actions/runs/40800444163) e [P3 #40800444157](https://github.com/tuliustsangaropulos/PortfolioTulius/actions/runs/40800444157) passaram, com Vercel Production `READY`. P3: **13 seções**, **25 painéis mobile**, **38 capturas**, `P3_BROWSER_AUDIT failures=0`, P5 anônimo **3/3**, **0 mutações**. O novo **`P6_LCP_CONTENT_GATE` passou em mobile e desktop**, comprovando que o LCP medido era o retrato publicado. Mediana Lighthouse mobile: **Performance 82, LCP 4,421 s**; desktop: **Performance 97, LCP 1,235 s**. O valor de 4,248 s do experimento `e1846ac` não se repetiu; **não há evidência de melhora causal do LCP** frente ao baseline de aproximadamente 4,30 s. A meta mobile **≤2,5 s permanece aberta**. Preservar o SDK e o conteúdo original; a separação dos chunks está mantida apenas como isolamento/cache, **não** como aceite de desempenho.

### Verificação complementar do desempenho — 29/10/2026

A repetição da [auditoria P3 #40812459767](https://github.com/tuliustsangaropulos/PortfolioTulius/actions/runs/40812459767) concluiu com **failure apenas no orçamento Lighthouse P6**; as verificações de rotas e responsividade permaneceram aprovadas (`P3_BROWSER_AUDIT failures=0`, 13 seções, 25 painéis, 38 capturas, P5 anônimo 3/3). Mediana mobile **LCP 8,455 s, Performance 69**; desktop **LCP 1,685 s, Performance 93**; o gate de retrato esperado como LCP não conseguiu confirmar o elemento em nenhuma das duas categorias. Uma execução anterior do mesmo código havia registrado LCP mobile ~7,680 s e também falhou no P6. **Não declarar aceite de desempenho; a meta ≤2,5 s e a investigação da variância permanecem abertas.** O teste funcional do site público não indica perda de seções, mídias ou RLS; ainda não há evidência causal relacionando a piora sintética às alterações exclusivamente administrativas. Homologação de escrita autenticada do CMS segue suspensa (P2).

### Evidência final adicional: auditoria P3 #40815457107 — 29/10/2026

No SHA funcional `d882d7a` (mesmo código público da documentação `cce4869`), o navegador automatizado mediu `P3_ABOUT_INVEST_FIT`: `aboutBottom=1382`, `portraitBottom=1420` (38 px extras recortados ao fim), `count=4`, `listHeight=422`, `listScrollHeight=422` (nenhuma rolagem no painel Invest RS), `headingLogoBorder=0px`, `indexLogoBorder=1px`. `P3_BROWSER_AUDIT failures=0`, `P5_PUBLIC_RESULT passed=3/3 mutations=0` e `P4_EDITORIAL_SUMMARY captures=38 failures=0`. O site mostrou `publicSections=13`, `portraitComplete=true`.

**Importante: o job P3 final tem resultado global `failure` por falha de integração de status, não por falha funcional:** o gate `Confirm Vercel production deployment status for audit SHA` consultou 30 vezes o status de commit com contexto `Vercel` e recebeu `missing`, mesmo havendo deployment `READY` confirmado diretamente pelo conector Vercel. Como Lighthouse dependia desse gate, as seis amostras não foram produzidas e o gate P6 reportou `missing sample`. Não afirmar aprovação da auditoria completa nem inferir mudança de LCP com base nessa execução. A meta LCP mobile ≤2,5 s e o ajuste do gate GitHub↔Vercel seguem como **pendências independentes**, sem suspender o sucesso dos testes funcionais de layout.

[Execução P3](https://github.com/tuliustsangaropulos/PortfolioTulius/actions/runs/40815457107) · [CI funcional](https://github.com/tuliustsangaropulos/PortfolioTulius/actions/runs/40815457072) · [Deployment funcional READY](https://vercel.com/tuliustsangaropulos-creates-projects/portfolio-tulius/CW4JH4aXUtmCGW3Hx6Gi5Phvrs34).


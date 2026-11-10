# Complemento final de regressão P3 — execução reprovada

> **Atualização posterior — 09/11/2026, commit `9b902579` (resultado FINAL da regressão).** A convergência funcional foi aprovada, mas o P3 deste SHA terminou **FAILURE**, não "pendente": [P3 #42731103548](https://github.com/tuliustsangaropulos/PortfolioTulius/actions/runs/42731103548). Lighthouse mobile LCP: **3.516,403 / 3.631,569 / 3.467,873 ms**, mediana **3.516,403 ms > teto imutável 3.500 ms** (excesso 16,403 ms). `P6_PERFORMANCE_BUDGET mobile result=FAIL`, `P6_RELEASE_REGRESSIONS` registra o excesso. Browser 0 falhas, P4 38 capturas sem falhas, SEO/paridade PASS, desktop LCP 864,261 ms PASS, e `P3_DEPLOYMENT_GATE` confirmou por HTTP que a produção servia `9b9025798fe1d453674283e670af4f9704bde973`. **Etapa 5: BLOQUEADA para este SHA**, sem reclassificar como sucesso o P3 anterior do SHA `4069611d` (mediana 3.496,608 ms PASS). A variação entre essas duas medições demonstra risco real de instabilidade laboratorial; nenhuma meta foi flexibilizada.
>
> Outros resultados do MESMO SHA `9b902579`: [Validate #42731104023](https://github.com/tuliustsangaropulos/PortfolioTulius/actions/runs/42731104023) SUCCESS **260/260**; [P5 #42731103839](https://github.com/tuliustsangaropulos/PortfolioTulius/actions/runs/42731103839) SUCCESS **119/119**, inclusive **87/87 browser sintético**; [P5 read-only #42731103645](https://github.com/tuliustsangaropulos/PortfolioTulius/actions/runs/42731103645) SUCCESS **19/19, 0 writes**; [exportação #42731103626](https://github.com/tuliustsangaropulos/PortfolioTulius/actions/runs/42731103626) SUCCESS. Supabase produtivo continuou somente leitura, 0 INSERT/UPDATE/DELETE, Storage ou DDL nesta execução; etapa 6 NÃO autorizada/não executada. O commit posterior que incorpora este adendo também exigirá conferência de seus próprios workflows; não presumir resultado.

A regressão falha é um resultado definitivo do workflow e não apaga sucesso P5/Validate/SEO do mesmo commit. Não há código de frontend alterado pelo commit `${parent.slice(0,8)}`; o desvio de 16,403 ms foi medido em Lighthouse sintético, não atribuído a mudança visual. Nenhuma tentativa manual de mascarar medições foi feita.

---

## Relatório anterior e histórico

# P2/P4/P5 — relatório de aceite técnico convergente (09/11/2026)

> **Estado vigente de aceite — 09/11/2026.** Evidências finais da rodada no SHA [`4069611d0b68c80b677f297ad74f6113009fc587`](https://github.com/tuliustsangaropulos/PortfolioTulius/commit/4069611d0b68c80b677f297ad74f6113009fc587), todas executadas no mesmo SHA. Este adendo prevalece sobre descrições históricas de jobs pendentes ou falhos **para este SHA**; não altera os resultados anteriores. Um commit documental posterior precisa de nova conferência de seus próprios workflows e fingerprint de deploy.

| Controle no SHA `4069611d` | Evidência comprovada |
|---|---|
| Validate | [#42712745845](https://github.com/tuliustsangaropulos/PortfolioTulius/actions/runs/42712745845): **SUCCESS**, 260/260 Vitest em 56 arquivos, formatação, TypeScript, build, smoke, sintaxe |
| P5 Local Transactional | [#42712745803](https://github.com/tuliustsangaropulos/PortfolioTulius/actions/runs/42712745803): **SUCCESS**, 119/119 = 8 Auth/RLS + 11 P2/RPC + 87 navegador + 8 mídia/API + 5 SEO, stack local `127.0.0.1:54321` e `cloudConnections:0` nos relatórios aplicáveis |
| CMS autenticado read-only | [#42712745840](https://github.com/tuliustsangaropulos/PortfolioTulius/actions/runs/42712745840): **SUCCESS**, 19/19, zero escritas de conteúdo |
| P3 Lighthouse, P4 e SEO públicos | [#42712746106](https://github.com/tuliustsangaropulos/PortfolioTulius/actions/runs/42712746106): **SUCCESS**, browser 0 falhas, 38 capturas (13 desktop/25 mobile), paridade SEO PASS, RLS anônimo 3/3 |
| Exportação documental | [#42712745982](https://github.com/tuliustsangaropulos/PortfolioTulius/actions/runs/42712745982): **SUCCESS** |
| P3 LCP mobile — gate mantido | 3.471,651 / 3.514,925 / 3.496,608 ms, mediana **3.496,608 ms PASS**, limite **≤3.500 ms**, margem **3,392 ms**. Fragilidade real: 1/3 amostras superou o teto |
| P3 Lighthouse inicial | Mobile 84 performance; desktop 99. Acessibilidade/boas práticas/SEO 100 em ambos; LCP desktop 970,905 ms |
| Produção publicada | P3 `P3_DEPLOYMENT_GATE` e P5 `P5_DEPLOYMENT_GATE MATCH`: leitura HTTP de `/p3-deployment.json` confirmou exatamente `4069611d0b68c80b677f297ad74f6113009fc587`. Vercel `dpl_7JC1riVMnW3iL1KSkSmh2MKtUXTx` READY, aliases `tulius.work` / `www.tulius.work` |

**Etapa 2 — APROVADA TECNICAMENTE NO SINTÉTICO, COM RESSALVAS.** Hero A/B, cores/famílias/estilos de Identidade, tipografia e tamanhos por dispositivo, placements desktop/mobile A/mobile B com isolamento, navegação, revisão sem escrita/restauração/CAS e renderer foram exercitados. As sete coleções normalizadas `portfolio_projects`, `metrics`, `skills`, `education`, `language_levels`, `tool_categories`, `contact_channels` passaram em criar/publicar, editar/reabrir, despublicar/republicar com ID estável; `career_experiences` e `testimonials` tiveram cenários próprios de edição, releitura, publicação, CAS e renderer. A cobertura é representativa, **não** varredura combinatória de todos os campos/estilos de cada schema. A atomicidade P2 foi demonstrada localmente, mas **a RPC composta ainda não existe na produção**.

**Etapa 3 — APROVADA TECNICAMENTE NO SINTÉTICO, COM RESSALVAS.** Upload/publicação, `title`, `alt_text`, `credit`, `focal_point`, releitura após reabrir, renomeação privada/publicação, CAS, exclusão de objetos e referências, falhas injetadas HTTP 503 de catálogo SQL/PostgREST e upload Storage, preservação de rascunho, compensação e verificação sem órfãos passaram. Renderer público conferiu ponto focal global e override por uso em Hero desktop/mobile, Sobre desktop/mobile, galerias desktop/mobile e logo desktop. A reconciliação da renomeação de ACK incerto passou em **testes unitários**, não em navegador real com resposta perdida após commit; `credit` é **metadado de catálogo**, não legenda pública automática autorizada.

**Etapa 5 — GATES AUTOMATIZADOS APROVADOS PARA O SHA ACIMA, COM RESSALVAS.** CI, suite integrada, produção servindo mesmo SHA, performance sob orçamento, SEO/paridade, responsividade e público passaram. A aprovação **não** significa aceite visual humano em celular real/zoom 200% nem performance garantida fora das três amostras. Não ampliar o orçamento ou mascarar variação.

**Supabase de produção — SOMENTE LEITURA.** Projeto `portfolio` HEALTHY; SELECT em 09/11/2026: 14 seções, 28 blocos, 56 placements, 75 mídias. Nove versões de migration remota; `public.save_section_block_atomic`, `block_placements.updated_at` e trigger P2 ausentes. As dependências `public.set_updated_at` e `private.require_portfolio_admin` existem. Zero INSERT/UPDATE/DELETE, Storage ou DDL produtivos executados nesta rodada.

**Etapa 6 — NÃO AUTORIZADA/NÃO EXECUTADA.** A migration incremental exata é `supabase/migrations/20261109024100_p2_composite_section_block_save.sql`: acrescenta `block_placements.updated_at` com default e trigger de atualização; cria RPC `public.save_section_block_atomic` com verificação admin, CAS e rollback PostgreSQL e restringe EXECUTE a autenticados. Não reescreve intencionalmente conteúdo editorial, mas altera schema/contrato de gravação e inicializa timestamp nas linhas existentes. Antes de autorizar/aplicar: **comprovar backup/restore utilizável, conferir compatibilidade e história remota de migrations divergente, preparar reversão da RPC/trigger/coluna e pós-verificações**. Nenhum backup recuperável foi verificado nesta auditoria. O proprietário deve fornecer autorização separada e explícita.

**Rastreabilidade:** antes do resultado convergente, a tentativa 1 de [P5 #42682410740](https://github.com/tuliustsangaropulos/PortfolioTulius/actions/runs/42682410740) falhou por inicialização Docker; a tentativa 2 terminou SUCCESS (89/89 naquele SHA). Outras execuções com problemas de instrumentação/fixture foram historicamente reprovadas e corrigidas, sem reclassificar as falhas. O resultado de 119/119 e P3 com mediana aprovada pertence a `4069611d0b68c80b677f297ad74f6113009fc587`, não a versões anteriores.

---

## Histórico detalhado P2/P4 (preservado sem reclassificação)

# Relatório P2/P4 — adendo vigente

## Adendo de execução de fechamento técnico P2/P4 — 09/11/2026

**Data:** 09/11/2026. **Branch:** `main`. **SHA funcional validado:** `442c72cf7b0bc8b7dc3738c822ce7aab18e75814`.
[Evidência P5 #42711984678](https://github.com/tuliustsangaropulos/PortfolioTulius/actions/runs/42711984678) `completed/success`; [Validate #42711984680](https://github.com/tuliustsangaropulos/PortfolioTulius/actions/runs/42711984680) `completed/success`.
**Importante:** um commit somente documental gera outro SHA e exige nova convergência. Não atribuir os resultados do SHA funcional ao novo SHA antes de seus jobs terminarem.

| Verificação no SHA funcional | Resultado comprovado |
|---|---|
| P5 original (Auth/RLS e dados fictícios) | 8/8 PASS |
| RPC composta P2, CAS e rollback | 11/11 PASS |
| Navegador autenticado local | **87/87 PASS** |
| Mídia sintética Auth/Storage/API | 8/8 PASS |
| SEO sintético, static build e rollback | 5/5 PASS |
| **P5 agregado** | **119/119 PASS**, `127.0.0.1:54321`, `cloudConnections:0` nos grupos que registram esta propriedade |
| Validate | **260/260 Vitest**, 56 arquivos, formatação, TypeScript, build, smoke e sintaxe PASS |

**Etapa 2 — COBERTURA TÉCNICA SINTÉTICA APROVADA COM RESSALVAS:** sete coleções normalizadas `portfolio_projects`, `metrics`, `skills`, `education`, `language_levels`, `tool_categories`, `contact_channels`: cada uma passou na UI por criação/publicação/PostgREST, edição/releitura pós-reabertura, despublicação/arquivamento e republicação com ID preservado. Os outros dois grupos, `career_experiences` e `testimonials`, foram homologados no editor embutido com persistência, reabertura, CAS obsoleto e leitura no renderer desktop/mobile. UI de Hero A/B, navegação, estados não salvos, dispositivos e isolamento desktop/mobile A/mobile B, tipografia, tokens de Identidade, comparação e restauração de revisões com preservação de status/visibilidade e CAS também passaram. **Limites:** não há afirmação de teste combinatório de todas as propriedades visuais em todos os nove schemas; concorrência de cada coleção é representada por casos específicos, não por varredura completa. Aceite visual humano em dispositivos reais permanece independente.

**Etapa 3 — BIBLIOTECA APROVADA TECNICAMENTE NO SINTÉTICO, COM RESSALVAS:** UI de upload/publicação, edição de título/`alt_text`/`credit`/`focal_point`, fechar e reabrir, renomeação privada com promoção, CAS, exclusão sem órfãos e falhas HTTP 503 de PATCH catálogo/POST Storage passaram. Renderização pública de ponto focal global e override por uso validada em Hero desktop/mobile, Sobre desktop/mobile, galeria de Experiências desktop/mobile e logo de Experiências desktop. Remoção de mídia ainda referenciada limpou ponteiros no Hero e Sobre e eliminou objeto/registro. A rotina de renomeação privada reconcilia resposta SQL incerta por leitura: somente limpa a cópia nova com prova de que o catálogo continua no arquivo anterior; quando incerto, mantém ambas para análise. Dois novos Vitest de erro incerto confirmaram os comportamentos. **Limites:** casos de resposta perdida/timeout da renomeação foram testados em unidade, não em navegador com Storage real; `credit` é metadado de catálogo e não foi autorizada/implementada legenda pública automática. Não extrapolar para todo tipo possível de referência externa.

**Falhas anteriores documentadas sem reclassificação:** os runs [#42707527325](https://github.com/tuliustsangaropulos/PortfolioTulius/actions/runs/42707527325), [#42708182119](https://github.com/tuliustsangaropulos/PortfolioTulius/actions/runs/42708182119), [#42708965865](https://github.com/tuliustsangaropulos/PortfolioTulius/actions/runs/42708965865), [#42709234814](https://github.com/tuliustsangaropulos/PortfolioTulius/actions/runs/42709234814) e [#42710744226](https://github.com/tuliustsangaropulos/PortfolioTulius/actions/runs/42710744226) falharam por instrumentação/fixtures de navegador durante a expansão. Os cenários foram corrigidos e o conjunto passou integralmente em #42711984678. Registrar tentativas falhas como falhas históricas, não como aprovações.

**Supabase produtivo SOMENTE LEITURA:** SELECT confirmou 14 seções, 28 blocos, 56 placements, 75 mídias; `save_section_block_atomic` ausente e nenhuma migração/alteração de Storage/INSERT/UPDATE/DELETE produtiva nesta execução. A migration `supabase/migrations/20261109024100_p2_composite_section_block_save.sql` **não foi executada** e exige autorização específica separada, verificação prévia de backup, compatibilidade de schema e plano de reversão.

**Vercel:** deployment `dpl_H9EpM2d17jVMF1wZ5uPwqy6YHpwn` no estado `READY` e alias `tulius.work` para o SHA funcional. O SHA documental posterior exige novo teste do fingerprint HTTP `/p3-deployment.json`.

**Etapa 5 e LCP (próximos gates):** executar Validate, P5 local, P5 admin read-only, produção pública, SEO/P4 e P3 no SHA documental final. Na última medição anterior [P3 #42696549446](https://github.com/tuliustsangaropulos/PortfolioTulius/actions/runs/42696549446), SHA `283e4f3`, LCP mobile foi mediana **3.692,071 ms FAIL** (limite imutável **≤3.500 ms**). Não atribuir essa medição ao SHA funcional atualizado. A etapa 5 não pode receber aceite global até a verificação do P3 no SHA final e o gate de LCP; o usuário solicitou tratar LCP como última avaliação antes de eventual etapa 6.

**Etapa 6:** NÃO AUTORIZADA, NÃO EXECUTADA. Nunca interpretar autorização para etapas 2/3/5/LCP como autorização de DDL ou escrita em produção.

**Cronologia incremental importante:** o último resultado integral anterior foi P5 89/89 no SHA `283e4f3`; 109/109 em [#42709965748](https://github.com/tuliustsangaropulos/PortfolioTulius/actions/runs/42709965748), 113/113 em [#42711294079](https://github.com/tuliustsangaropulos/PortfolioTulius/actions/runs/42711294079) e, finalmente, **119/119 no SHA `442c72cf` em [#42711984678](https://github.com/tuliustsangaropulos/PortfolioTulius/actions/runs/42711984678)**. Os 87 casos de navegador são aprovados **numa única execução** desse SHA. Esses marcos não representam, isoladamente, P3 do SHA final nem ativação da RPC cloud.


---

## Snapshots anteriores preservados como histórico

# Convergência e ressalvas — adendo mais recente

## Adendo final de auditoria de P3 — 09/11/2026, SHA `d36193e118693f43f4b85672514135ca5988b334`

> Resultados definitivos **do SHA citado**; este adendo técnico não representa aprovação de um SHA posterior. A alteração de instrumentação que acompanha o presente documento apenas espera a conclusão real da consulta pública antes de avaliar o DOM; **não altera nem flexibiliza o teto Lighthouse, nem a apresentação do site**.

- **Validate [#42694555321](https://github.com/tuliustsangaropulos/PortfolioTulius/actions/runs/42694555321): SUCCESS. P5 [#42694555255](https://github.com/tuliustsangaropulos/PortfolioTulius/actions/runs/42694555255): SUCCESS.** Exportação documental [#42694555064](https://github.com/tuliustsangaropulos/PortfolioTulius/actions/runs/42694555064): SUCCESS.
- **P3 [#42694555023](https://github.com/tuliustsangaropulos/PortfolioTulius/actions/runs/42694555023): FAILURE em duas tentativas.** Tentativa 1: LCP mobile 3.627,739 / 3.356,583 / 3.660,037 ms, mediana **3.627,739 ms**; browser 0 falhas. Tentativa 2: LCP mobile 3.625,215 / 3.648,032 / 3.637,844 ms, mediana **3.637,844 ms**, com 2 falhas de navegador durante carregamento remoto inicial. **Orçamento continua mediana ≤3.500 ms e está REPROVADO; não declarar P3 ou etapa 5 aprovada.**
- Na tentativa 2, `P3_FIRST_FOLD_TIMING` registrou apenas `p3:profile-bootstrap-start` e `p3:portfolio-fetch-start`, **0 seções renderizadas**, e o diagnóstico do menu encontrou **0 entradas** enquanto o CMS público ainda não havia terminado de carregar. A tentativa 1 havia encontrado 8 entradas e layout válido. O instrumento de navegador passou a aguardar milestones reais antes de determinar a geometria do menu; caso a consulta demore além do timeout, continuará falhando. Isso **não corrige** nem mascara o LCP acima do orçamento.
- Na tentativa 2, paridade SEO público PASS, 38 capturas editoriais sem falhas automáticas, verificações de RLS anônimo PASS, Lighthouse desktop dentro do budget; categorias acessibilidade, boas práticas e SEO obtiveram 100 nos relatórios conferidos.
- O workflow P3 confirmou por HTTP `/p3-deployment.json` que o domínio **servia exatamente `d36193e`**: `P3_DEPLOYMENT_GATE ... production=verified`. Isso é mais forte que depender apenas de `Vercel READY`.
- **Etapas 2/3:** mantêm status de aceitação PARCIAL até provas dos campos/coleções/framings residuais; P2 em produção permanece NÃO INSTALADA. **Etapa 5: BLOQUEADA** pelo LCP até medição satisfatória de três amostras em um SHA único. Nenhuma escrita no Supabase produtivo foi feita nesta execução.

---

## Histórico de evidências anteriores preservado

# P2/P4 — apêndice mais recente

## Apêndice de homologação sintética — execução em 09/11/2026

**Baseline auditado:** `b2c732213ba34789b7e04761dfff84fb91fcbc7f` (`main` na conferência). **Rerun P5:** [#42682410740](https://github.com/tuliustsangaropulos/PortfolioTulius/actions/runs/42682410740), `run_attempt=2`, `completed/success`. **Validate:** [#42682411152](https://github.com/tuliustsangaropulos/PortfolioTulius/actions/runs/42682411152), `completed/success`.

| Suíte P5 | Resultado | Evidência efetiva |
|---|---:|---|
| Oito cenários originais | 8/8 | Auth/RLS, publicações e acesso local |
| RPC P2 composta | 11/11 | CAS em seção/bloco/placement, rollback após atualização da seção, usuário não-admin, reenvio após ACK incerto |
| E2E navegador JWT admin | **57/57** | UI salvar/reler, mídia, Hero, navegação, Trajetória, depoimentos, sete coleções, placements, tipografia, Identidade e revisões |
| Storage e catálogo API | 8/8 | Mídia privada/publicada, RLS, renomeação e compensação de SQL, exclusão |
| SEO sintético | 5/5 | Save RPC, rollback, HTML estático, canonical/robots/sitemap, publicação |
| **Total** | **89/89** | `127.0.0.1:54321`, dados fictícios, sem cloud writes |

**Novos cenários do browser comprovados individualmente:** `MEDIA_UI_SQL_PATCH_503_PRESERVES_DRAFT`, `MEDIA_UI_FAILED_CATALOG_READ_PRESERVES_DRAFT`, `MEDIA_UI_STORAGE_503_NO_ORPHAN`, `MEDIA_UI_STALE_CAS_REJECTED`, `MEDIA_UI_PRIVATE_RENAME_AUTO_PUBLISH_NO_ORPHANS`, `MEDIA_UI_DELETE_NO_ORPHANS`, `PLACEMENT_UI_DESKTOP_MOBILE_AND_SIBLING_ISOLATION`, `DEVICE_UI_DESKTOP_TYPOGRAPHY_PERSISTED`, `DEVICE_UI_MOBILE_TYPOGRAPHY_INDEPENDENT`, `IDENTITY_UI_COLOR_FONT_TYPE_SAVE_DB`, `REVISION_UI_PREVIEW_NO_WRITE`, `REVISION_UI_RESTORE_ALLOWED_FIELDS_ONLY`, `REVISION_UI_STALE_CAS_DENIED`. Os sete fluxos de coleções exibidos como `COLLECTION_UI_* ` validaram criação, publicação e consulta; a despublicação e a concorrência foram cenários representativos, não cada tabela. O run terminou sem falhas, mas a primeira tentativa do mesmo run foi reprovada por inicialização Docker/porta e não é reclassificada.

**Validate funcional:** 56 arquivos Vitest, 258/258 PASS; formatação, TypeScript, build, smoke e sintaxe PASS. Não foram produzidos artefatos P5 nessa segunda tentativa (a prova é o job log).

**P3, Vercel, Supabase:** último P3 anterior [#42677818677](https://github.com/tuliustsangaropulos/PortfolioTulius/actions/runs/42677818677) falhou no LCP mobile mediano 3.648,364 ms; não há P3 aprovado para `b2c7322` neste snapshot. Vercel `dpl_BGTbvqwWkckcczUuePdZ3euVm6et` `READY` e alias `tulius.work` para o SHA funcional; fingerprint HTTP ainda por conferir. Supabase produtivo lido sem mutação: 14 seções, 28 blocos, 56 placements, 75 mídias, nove migrations remotas; `save_section_block_atomic` inexistente.

**Limitações explícitas:** sem aceitação integral de todos os campos e CRUD de todas as nove coleções; sem E2E por uso do `focal_point` em Hero/Sobre/galerias; sem legenda pública automática de `credit`; não demonstrar resposta incerta de toda operação distribuída; sem P3 no SHA final nem aceite visual final. **P2 em produção bloqueada pela autorização específica da etapa 6; não executar nesta rodada.**

---

## Documentação anterior preservada

# Adendo de evidências da execução conectada

> **Adendo auditável — 09/11/2026.** Informação mais recente que os snapshots abaixo. Fonte: [execução conectada das etapas 1–5](EXECUCAO_ETAPAS_1_A_5_2026-11-09.md), commit funcional `f9e48dcb`, CI e SELECT de produção. Preserve os documentos originais logo abaixo como histórico, sem atribuir a eles o estado atual.

**Prova mais recente do código funcional `f9e48dcb`:** [P5 #42566409424](https://github.com/tuliustsangaropulos/PortfolioTulius/actions/runs/42566409424) **SUCCESS 52/52**, incluindo **20/20 UI em navegador**; [Validate #42566409385](https://github.com/tuliustsangaropulos/PortfolioTulius/actions/runs/42566409385) **SUCCESS**. Código alterado em `index.html` (preload assíncrono da fonte aprovada, performance ainda sem aceite Lighthouse no SHA final), `src/components/admin/EnhancedMediaLibrary.tsx` (crédito) e `scripts/p4-local-admin-browser.mjs` (cenários CMS/mídia/navegação/Hero). Falhas anteriores de fixture `d1a042ca` e race do teste `63933c10` são históricas, corrigidas.

**Supabase cloud:** SELECT/RPC/listagem migrations somente leitura; `save_section_block_atomic` ausente, nove migrations remotas; sem writes. **Pendências:** performance P3 medida no SHA documental final, matriz P4 residual, homologação visual humana, autorização separada migration. [Relato técnico detalhado](EXECUCAO_ETAPAS_1_A_5_2026-11-09.md).

---

## Histórico anterior preservado

# P2/P4 — Relatório de execução e aceite parcial (09/11/2026)

**Repositório:** `tuliustsangaropulos/PortfolioTulius` • **Branch:** `main`. **Código funcional desta rodada:** `f28d91069fb2174feb47a3f1b61a9e8f608cea37` (retorno da preferência de rede ao estado `auto`). Este documento pode receber SHA próprio; sempre conferir HEAD e `/p3-deployment.json` no dia da leitura.

## Evidências cronológicas sem extrapolação

| Área | Commit / run | Resultado real |
|---|---|---|
| P5 sintético antes da rodada | [#42556090560](https://github.com/tuliustsangaropulos/PortfolioTulius/actions/runs/42556090560), `7e8d7f82` | 30/30 PASS (8 + 11 + 6 + 5) |
| Validate antes da rodada | [#42556090444](https://github.com/tuliustsangaropulos/PortfolioTulius/actions/runs/42556090444) | SUCCESS |
| Lighthouse antes da rodada | [#42556090544](https://github.com/tuliustsangaropulos/PortfolioTulius/actions/runs/42556090544) | **FAIL**; LCP mobile 3684,469 / 3388,348 / 3949,090 ms; mediana **3684,469 ms** |
| Proteção de fallback P2 | [#42561400135](https://github.com/tuliustsangaropulos/PortfolioTulius/actions/runs/42561400135), `4e739dbf` | Validate SUCCESS; +6 Vitest de decisão P2 |
| P5 com mídia real sintética | [#42561707707](https://github.com/tuliustsangaropulos/PortfolioTulius/actions/runs/42561707707), `630fb712` | SUCCESS; 30 cenários anteriores + **8/8** Auth/Storage/metadados/compensação |
| Validate da mídia | [#42561708036](https://github.com/tuliustsangaropulos/PortfolioTulius/actions/runs/42561708036) | SUCCESS |
| LCP, prioridade `auto` | [#42561971244](https://github.com/tuliustsangaropulos/PortfolioTulius/actions/runs/42561971244), `b3dc0a5f` | **FAIL**; amostras 3613,587 / 3616,315 / 2587,048 ms; mediana **3613,587 ms** |
| LCP, prioridade `high` | [#42562429184](https://github.com/tuliustsangaropulos/PortfolioTulius/actions/runs/42562429184), `93176222` | **FAIL**; amostras 3663,424 / 3710,139 / 3493,346 ms; mediana **3663,424 ms** |
| Reversão do experimento pior | `f28d9106` | prioridade `auto` restaurada, sem mudar CSS, tipografia, fotografia ou composição |

As execuções intermediárias do Validate nos commits `31ddbe5c`, `a728751c`, `38cf4702` tiveram falhas (formatação e um mock de teste) corrigidas até o SUCCESS de `4e739dbf`; registros preservados no Actions. Uma execução aprovada no SHA anterior **não** comprova aprovação de commit futuro.

## P2 — implementação e ativação

- A migration incremental `supabase/migrations/20261109024100_p2_composite_section_block_save.sql` implementa `public.save_section_block_atomic`, CAS, autenticação e rollback único para section/block/placements. Onze cenários sintéticos PASS; `AdminApp.tsx` e `AdminModules.tsx` integram novo contrato.
- Foi corrigido o fallback inseguro: o SQLSTATE `42883` genérico não permite gravar pelo legado. Apenas `PGRST202` referindo especificamente `public.save_section_block_atomic` habilita o caminho antigo; conflito, erro SQL e conexão incerta param sem uma segunda gravação.
- **Produção:** SELECT de `pg_proc`/`to_regprocedure` em 09/11 indicou RPC nova AUSENTE. Nove versões de migrations registradas. Não houve `db push`, `supabase link`, migração nem teste de escrita na cloud.
- **Status por gate:** implementação técnica PASS; homologação RPC sintética PASS; compatibilidade do frontend legado preservada/inspecionada; ativação produtiva **BLOQUEADA por autorização separada**; aceite final pendente.

## P4 — evidências e lacunas

- **Navegador sintético:** 6 testes básicos PASS (login JWT admin, edição não salva, save/releitura DB, fechar/reabrir, desktop, mobile).
- **SEO sintético:** 5 verificações PASS (RPC, rollback, paridade HTML estático/banco, canonical/robots/sitemap, publicação). SEO real só muda no HTML após build/deploy Git.
- **Mídia Auth/Storage/PostgREST sintéticos:** 8 testes PASS: usuários admin/não-admin, RLS privado, negação de mutação, `alt_text`/`credit`/`focal_point` com versão, renomeação privada, compensação de upload após falha SQL com 0 órfãos, promoção pública, exclusão controlada. `scripts/p4-local-media.mjs` exige runner isolado e loopback `127.0.0.1:54321`; nenhum objeto real utilizado.
- **Ainda não demonstrado:** ciclo UI completo de todos os grupos Hero A/B, botões/ordem, media framing visual, navegação, tokens, coleções, Trajetória, depoimentos, revisões, falha HTTP e conflito na UI; a nova cobertura de mídia foi API/Storage, não a tela da Biblioteca.
- **Contrato midiático:** `alt_text` canônico priorizado pelo hook público e comprovado em testes unitários para desktop/mobile, imagens de Sobre, logos e slides. `credit` e `focal_point` persistem como metadados; não prometer exibição ou aplicação global no renderer sem implementação/testes específicos.

## Lighthouse e visual

O elemento LCP mobile segue sendo o texto SVG do selo do Hero. O relatório sugere CSS e Google Fonts bloqueantes, trabalho JavaScript e entrega de imagem como áreas investigáveis. **Nenhuma das duas medições do experimento autorizou marcar orçamento aprovado.** Não houve alteração de fontes, identidade visual, imagens, CSS, animações, layout ou meta de LCP; foi escolhida a prioridade de rede `auto` entre as duas variações testadas, pois teve melhor mediana observada. Meta obrigatória **mediana de 3 execuções ≤3500 ms** permanece.

## Operações pendentes e autorização

1. Completar E2E sintéticos por formulário/campo, com UI → gravar → DB → recarregar → renderer desktop/mobile, conflitos e falhas.
2. Completar E2E da Biblioteca pela UI, além dos oito cenários Storage/API.
3. Resolver o LCP sem alterar identidade e provar mediana do SHA final ≤3500 ms.
4. Consolidar Validate/P5/P3 no mesmo SHA final e verificar Vercel READY + fingerprint servido; obter aceite visual humano.
5. **Somente com autorização específica e separada:** preparar plano de compatibilidade/rollback e instalar/verificar a migration P2 em produção.
6. Atualizar manualmente as fontes privadas no Projeto ChatGPT: push no GitHub não as substitui.

**Conclusão válida nesta data:** **P2 = PARCIAL** (implementada e validada localmente, ativação bloqueada); **P4 = PARCIAL** (UI básica e mídia/API sintética aprovadas, cobertura integral e LCP pendentes). Nenhum aceite operacional final declarado.

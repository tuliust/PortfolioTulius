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

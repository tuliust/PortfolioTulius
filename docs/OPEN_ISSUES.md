# Pendências após regressão do mesmo SHA

## Bloqueio P3 e pontos abertos — 09/11/2026, SHA `d36193e118693f43f4b85672514135ca5988b334`

> Resultados observados **do SHA citado**; este adendo técnico não representa aprovação de um SHA posterior. A alteração de instrumentação que acompanha o presente documento apenas espera a conclusão real da consulta pública antes de avaliar o DOM; **não altera nem flexibiliza o teto Lighthouse, nem a apresentação do site**.

- **Validate [#42694555321](https://github.com/tuliustsangaropulos/PortfolioTulius/actions/runs/42694555321): SUCCESS. P5 [#42694555255](https://github.com/tuliustsangaropulos/PortfolioTulius/actions/runs/42694555255): SUCCESS.** Exportação documental [#42694555064](https://github.com/tuliustsangaropulos/PortfolioTulius/actions/runs/42694555064): SUCCESS.
- **P3 [#42694555023](https://github.com/tuliustsangaropulos/PortfolioTulius/actions/runs/42694555023): FAILURE em duas tentativas.** Tentativa 1: LCP mobile 3.627,739 / 3.356,583 / 3.660,037 ms, mediana **3.627,739 ms**; browser 0 falhas. Tentativa 2: LCP mobile 3.625,215 / 3.648,032 / 3.637,844 ms, mediana **3.637,844 ms**, com 2 falhas de navegador durante carregamento remoto inicial. **Orçamento continua mediana ≤3.500 ms e está REPROVADO; não declarar P3 ou etapa 5 aprovada.**
- Na tentativa 2, `P3_FIRST_FOLD_TIMING` registrou apenas `p3:profile-bootstrap-start` e `p3:portfolio-fetch-start`, **0 seções renderizadas**, e o diagnóstico do menu encontrou **0 entradas** enquanto o CMS público ainda não havia terminado de carregar. A tentativa 1 havia encontrado 8 entradas e layout válido. O instrumento de navegador passou a aguardar milestones reais antes de determinar a geometria do menu; caso a consulta demore além do timeout, continuará falhando. Isso **não corrige** nem mascara o LCP acima do orçamento.
- Na tentativa 2, paridade SEO público PASS, 38 capturas editoriais sem falhas automáticas, verificações de RLS anônimo PASS, Lighthouse desktop dentro do budget; categorias acessibilidade, boas práticas e SEO obtiveram 100 nos relatórios conferidos.
- O workflow P3 confirmou por HTTP `/p3-deployment.json` que o domínio **servia exatamente `d36193e`**: `P3_DEPLOYMENT_GATE ... production=verified`. Isso é mais forte que depender apenas de `Vercel READY`.
- **Etapas 2/3:** mantêm status de aceitação PARCIAL até provas dos campos/coleções/framings residuais; P2 em produção permanece NÃO INSTALADA. **Etapa 5: BLOQUEADA** pelo LCP até medição satisfatória de três amostras em um SHA único. Nenhuma escrita no Supabase produtivo foi feita nesta execução.

---

## Histórico de evidências anteriores preservado

# Pendências — adendo mais recente

## Atualização das pendências — 09/11/2026, após P5 `b2c7322`

**Não manter como “aguardando resultado” os testes já concluídos:** [P5 #42682410740 (tentativa 2)](https://github.com/tuliustsangaropulos/PortfolioTulius/actions/runs/42682410740) **success, 89/89** (57/57 UI); [Validate #42682411152](https://github.com/tuliustsangaropulos/PortfolioTulius/actions/runs/42682411152) **success, 258/258 Vitest**. Injeções HTTP 503 de PATCH de catálogo e POST de Storage passaram no mesmo workflow, com testes de preservação/compensação. Também passaram editores de Trajetória e depoimentos, sete coleções, Identidade, tipografia e revisões nos cenários testados.

**Pendências atuais, sem extrapolar o alcance dos testes:**

1. **P0 — Etapa 6 autorizada separadamente:** migration `supabase/migrations/20261109024100_p2_composite_section_block_save.sql` segue **não aplicada** ao banco cloud; `public.save_section_block_atomic` ausente no SELECT de produção. Confirmar snapshot, compatibilidade e recuperação antes de pedir autorização de aplicação.
2. **P1 — P3 Lighthouse / convergência:** último P3 localizado [#42677818677](https://github.com/tuliustsangaropulos/PortfolioTulius/actions/runs/42677818677) **FAIL em SHA anterior**; mediana LCP mobile 3.648,364 ms, acima do teto 3.500 ms. Exigir **nova mediana de três** no SHA documental final, sem flexibilização do budget, além de paridade SEO, auditoria de navegador e fingerprint HTTP.
3. **P1 — Cobertura CMS ainda parcial:** sete coleções normalizadas tiveram criação/publicação/consulta; falta demonstrar CRUD e concorrência completo individualmente em todas as nove coleções, reabertura e validações por campo, todos os estilos Hero/cores/fontes nomeadas e isolamentos mobile B/desktop. Não alterar CSS ou conteúdo aprovado apenas para completar testes.
4. **P1 — Biblioteca / enquadramento e erros incertos:** faltam demonstrações E2E públicas por componente (Hero/Sobre/galerias) da precedência entre `media_assets.focal_point` não padrão e override individual e remoção de referências reais sintéticas por uso; cobrir resposta incerta/timeout de forma explícita. `credit` continua metadado, sem legenda pública automática. Avaliar possível aviso de sucesso anterior após erro de catálogo, observado como diagnóstico não conclusivo no log.
5. **P1 — Etapa 5:** os resultados finais de Validate, P5 e P3 devem convergir no mesmo SHA servido. Vercel marcou o SHA funcional `b2c7322` `READY` com alias `tulius.work`; falta confirmação da resposta do fingerprint após o commit documental e a revisão manual visual em dispositivos reais.
6. **Manual:** aceite visual humano e eventual decisão editorial sobre exibição de crédito público. Nenhuma autorização geral para prosseguir inclui escrita no Supabase produtivo.

**Restrições preservadas:** esta atualização é só documentação. Nenhuma escrita cloud Supabase, nenhum ajuste visual/textual/mídia produtiva, nenhum deploy ou migration manual. As falhas de tentativas anteriores não são apagadas pelo rerun aprovado.

---

## Documentação anterior preservada

# Pendências vigentes — etapas 1 a 5

> **Adendo auditável — 09/11/2026.** Informação mais recente que os snapshots abaixo. Fonte: [execução conectada das etapas 1–5](EXECUCAO_ETAPAS_1_A_5_2026-11-09.md), commit funcional `f9e48dcb`, CI e SELECT de produção. Preserve os documentos originais logo abaixo como histórico, sem atribuir a eles o estado atual.

**Já comprovado:** P5 sintético **52/52** e 20 verificações de navegador em [#42566409424](https://github.com/tuliustsangaropulos/PortfolioTulius/actions/runs/42566409424); crédito da mídia editável; CAS P2 e mídia; menu e Hero parcial. **Não reabrir** esses casos por causa dos snapshots históricos abaixo.

1. **P0 — Production P2:** `save_section_block_atomic` ausente da produção; migration incremental **não autorizada** e intocada.
2. **P1 — P3 mobile LCP:** baseline 3.876,691 ms **FAIL**; experimentar mesmo Google Fonts em CSS assíncrono e medir mediana de três Lighthouse em commit estável (≤3.500 ms). Audit anterior em SHA ultrapassado não é aceite.
3. **P1 — Cobertura P4 residual:** matriz por campo Hero A/B e editor de estilos/placements, coleções, Trajetória, depoimentos, revisões/restauração, mobile editorial e estados de falhas de rede ainda não inteiramente testados em UI.
4. **P2 — Media distribuída:** casos API de compensação PASS; falta injeção de falha pós-SQL e resultado desconhecido pela interface, precedência de focal point vs override de uso, e decisão de eventual legenda pública de crédito.
5. **P2 — SEO:** garantir validação do SHA publicado no P3; build é necessário para SEO estático. Sem ensaio de edição cloud.
6. **Manual:** revisão visual em dispositivos, atualização Fontes privadas, autorização explícita separada P2 e aceite.

---

## Histórico anterior preservado

# Atualização operacional — P2/P4, 09/11/2026

> **Atualização de continuidade — 09/11/2026.** Este trecho prevalece sobre quaisquer snapshots datados abaixo. Código inicialmente auditado em `7e8d7f82`, agora incluindo correção de fallback P2 (`4e739dbf`), suíte de mídia sintética (`630fb712`) e experimentos de prioridade da consulta inicial de Perfil (`b3dc0a5f` e `93176222`). **Não foi aplicada migration nem houve escrita de ensaio no Supabase de produção.** A migration `20261109024100_p2_composite_section_block_save.sql` existe em Git, mas `public.save_section_block_atomic` está **ausente no banco produtivo** (SELECT em `pg_proc`); usar o caminho legado até autorização separada. Veja [relatório de execução](P2_P4_RELATORIO_EXECUCAO_2026-11-09.md), [plano de aceite](P2_P4_PLANO_ACEITE_2026-11-08.md) e [mapa CMS → renderer](MAPA_CAMPOS_CMS_RENDERER.md).

## Pendências novas ou reconfirmadas (09/11/2026)
1. **P0 — Ativação transacional P2:** proibida sem aprovação explícita. Após aprovar, conferir compatibilidade e migrações remotas, snapshot/rollback, rodar somente comandos autorizados e verificar a assinatura/proteções da RPC.
2. **P1 — Lighthouse mobile:** baseline #42556090544 mediana 3.684,469 ms; #42561971244 mediana 3.613,587 ms, ambos FAILED. A segunda prova do `93176222` está no #42562429184. Exigir três execuções equivalentes e mediana ≤3.500 ms, sem aumentar orçamento.
3. **P1 — UI integrada P4:** matriz completa Hero A/B, painel, botões, fundo, mídia, formatos, mobile editorial, destinos ocultos, navegação, tokens, Trajetória, depoimentos, histórico.
4. **P2 — Mídia e Storage:** API sintética 8 PASS; ainda testar UI salvar/recarregar, indisponibilidade, resultado HTTP incerto, falha de remoção física pós-BD, e precedência de `focal_point` versus `mediaFraming`.
5. **P2 — SEO:** após atualização editorial autorizada, rebuild e paridade de HTML/OG/canonical/robots/sitemap no domínio.
6. **P2 — Convergência de SHA:** Validate, P5 e P3 no mesmo HEAD, deployment READY e impressão digital pública; aceite visual pelo proprietário.

---

## Documento anterior preservado para rastreabilidade

# Verificações técnicas — sem reabertura automática do encerramento

**Situação em 05/11/2026:** o proprietário encerrou administrativamente os checklists anteriores, conforme [decisão registrada](ENCERRAMENTO_OPERACIONAL_2026-11-05.md). Esta página não reabre automaticamente aquele backlog. Ela identifica **lacunas de homologação e acompanhamento técnico** após os novos pedidos, sem autorizar alterações destrutivas nem mudanças na exibição pública atual. [Registro anterior completo](historico/OPEN_ISSUES_ANTES_REORGANIZACAO_2026-11-05.md).

**Baseline funcional:** [`79aa3c07`](https://github.com/tuliustsangaropulos/PortfolioTulius/commit/79aa3c07ce6c9106b1d504c1f574731bf70fb5d2). [Validate `#42020574434`](https://github.com/tuliustsangaropulos/PortfolioTulius/actions/runs/42020574434) **aprovado**. A última [P3 `#42020342275`](https://github.com/tuliustsangaropulos/PortfolioTulius/actions/runs/42020342275), do SHA **`0873eeff`**, **falhou** (7 critérios de navegador e mediana mobile **3,537 s**, acima de **3,5 s**). Sem P3 própria localizada do baseline `79aa3c07`.

## O que tem código, mas não aceite completo

| Verificação | Evidência existente | O que ainda não está comprovado |
|---|---|---|
| **P3 navegador / responsividade e LCP** | Último run citado reprovado; P4 teve 38 capturas automáticas sem falhas no mesmo run | P3 do SHA funcional final, causa das 7 falhas, comportamento em 320 px e métricas após mudanças posteriores |
| **Exibição mobile / seta da primeira tela** | Regras de CSS/JSX implementadas no Perfil, Olá, Ferramentas e Experiências | Inspeção física de iPhone em alturas baixas, estado sticky, contorno do retrato e seta visível sem deslizar; **não modificar o site só para “melhorar” sem novo pedido** |
| **Trajetória editada inline** | Formulário com registro em `career_experiences`, validação e guarda `updated_at` no código; CI aprovado | Gravar, salvar e reler dados com sessão administrativa real; concorrência entre dois editores |
| **Mídia — upload e exclusão** | Rotinas de upload público e RPC de limpeza; duas fases banco/Storage | Teste seguro e reversível autenticado, tratamento de falha após SQL e restauração de arquivo; **não executar em ativos de produção históricos** |
| **Texto alternativo e enquadramento** | Campos de edição centralizados na Biblioteca, valores copiados para JSONB no vínculo | Propagação automática de alterações posteriores de `alt_text` a blocos que já armazenam cópias legadas |
| **Contadores e migrações Supabase** | Snapshot 75 mídias, 128 objetos, RPC presente | Causa não atribuída da mudança de 76→75/129→128; identidade do arquivo de migration versus linha registrada no histórico |
| **SEO após editar CMS** | `generate-seo.mjs` gera HTML estático no build | Salvar SEO, gerar novo build autorizado e conferir HTML/OG/canonical/sitemap pós-publicação |

**Critério de qualidade:** descrever separadamente **implementado**, **testado automaticamente**, **implantado**, **testado autenticado** e **aceito visualmente**. Não usar P6 parcial, P4 sem falhas ou `READY` como prova de P3 integral aprovado.

## Proteções para qualquer retomada

- A **apresentação atual publicada é a correta**. Manter CSS, imagens, tipografia, textos, ordem, comportamentos e responsividade inalterados nesta frente documental.
- Não fazer uploads/exclusões de teste em produção, edições de dados, RLS/Auth/Storage ou nova infraestrutura sem autorização clara e cenário controlado.
- Para homologação transacional, o ambiente escolhido é **Supabase local + Docker, seed sintética**, nunca `supabase/seed.sql` em staging. [Procedimento](SUPABASE_STAGING_LOCAL_ISOLADO_2026-11-02.md).
- A meta mobile é **LCP mediano ≤3,5 s** em três medições Lighthouse sintéticas, não p75 de usuários reais. Inspeções e métricas devem registrar o SHA exato.

[Estado vigente](ESTADO_ATUAL_VIGENTE.md) · [Auditoria dos pedidos](AUDITORIA_PEDIDOS_CHAT_2026-11-05.md) · [Histórico de pendências e decisões](historico/OPEN_ISSUES_ANTES_REORGANIZACAO_2026-11-05.md).


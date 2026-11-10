# Bloqueio P3 mais recente — sem aceite da etapa 5

> **Atualização posterior — 09/11/2026, commit `9b902579` (resultado FINAL da regressão).** A convergência funcional foi aprovada, mas o P3 deste SHA terminou **FAILURE**, não "pendente": [P3 #42731103548](https://github.com/tuliustsangaropulos/PortfolioTulius/actions/runs/42731103548). Lighthouse mobile LCP: **3.516,403 / 3.631,569 / 3.467,873 ms**, mediana **3.516,403 ms > teto imutável 3.500 ms** (excesso 16,403 ms). `P6_PERFORMANCE_BUDGET mobile result=FAIL`, `P6_RELEASE_REGRESSIONS` registra o excesso. Browser 0 falhas, P4 38 capturas sem falhas, SEO/paridade PASS, desktop LCP 864,261 ms PASS, e `P3_DEPLOYMENT_GATE` confirmou por HTTP que a produção servia `9b9025798fe1d453674283e670af4f9704bde973`. **Etapa 5: BLOQUEADA para este SHA**, sem reclassificar como sucesso o P3 anterior do SHA `4069611d` (mediana 3.496,608 ms PASS). A variação entre essas duas medições demonstra risco real de instabilidade laboratorial; nenhuma meta foi flexibilizada.
>
> Outros resultados do MESMO SHA `9b902579`: [Validate #42731104023](https://github.com/tuliustsangaropulos/PortfolioTulius/actions/runs/42731104023) SUCCESS **260/260**; [P5 #42731103839](https://github.com/tuliustsangaropulos/PortfolioTulius/actions/runs/42731103839) SUCCESS **119/119**, inclusive **87/87 browser sintético**; [P5 read-only #42731103645](https://github.com/tuliustsangaropulos/PortfolioTulius/actions/runs/42731103645) SUCCESS **19/19, 0 writes**; [exportação #42731103626](https://github.com/tuliustsangaropulos/PortfolioTulius/actions/runs/42731103626) SUCCESS. Supabase produtivo continuou somente leitura, 0 INSERT/UPDATE/DELETE, Storage ou DDL nesta execução; etapa 6 NÃO autorizada/não executada. O commit posterior que incorpora este adendo também exigirá conferência de seus próprios workflows; não presumir resultado.

**P0 efetivo:** manter a etapa 5 bloqueada até obter mediana mobile ≤3.500 ms em três medições válidas para um único SHA. Não repetir apenas para selecionar amostra favorável nem alterar budget. O aceite técnico sintético das etapas 2/3 permanece válido com ressalvas; falta autorização produtiva P2 e aceite visual humano.

---

## Pendências documentadas anteriormente e evidências históricas

# Pendências e ressalvas vigentes — após convergência do SHA 4069611d

**Os gates técnicos automatizados das etapas 2, 3 e 5 obtiveram resultados finais PASS no SHA `4069611d0b68c80b677f297ad74f6113009fc587`**, não estão mais "pendentes" nessa revisão. Evidências: [P5 119/119](https://github.com/tuliustsangaropulos/PortfolioTulius/actions/runs/42712745803), [Validate 260/260](https://github.com/tuliustsangaropulos/PortfolioTulius/actions/runs/42712745845), [CMS read-only 19/19](https://github.com/tuliustsangaropulos/PortfolioTulius/actions/runs/42712745840), [P3/LCP/SEO/browser](https://github.com/tuliustsangaropulos/PortfolioTulius/actions/runs/42712746106) e [exportação](https://github.com/tuliustsangaropulos/PortfolioTulius/actions/runs/42712745982). A mediana mobile de **3.496,608 ms** passou pelo teto inalterado de 3.500 ms **por apenas 3,392 ms**. O fingerprint HTTP da produção coincidiu com o SHA; Vercel READY.

**Pendências realmente abertas / ressalvas:**

1. **Etapa 6 — bloqueada por autorização específica.** `supabase/migrations/20261109024100_p2_composite_section_block_save.sql` existe apenas em Git/local sintético. A produção não tem RPC `save_section_block_atomic` nem coluna/trigger P2. Backup testado, plano de retorno validado e reconciliação do histórico de nove migrations remotas ainda exigem checagem **antes** de qualquer DDL.
2. **Desempenho — aprovado com margem mínima, risco de regressão.** A segunda amostra LCP teve 3.514,925 ms; não afirmar estabilidade estatística ou de campo. Manter budget ≤3.500 ms e monitorar em mudanças futuras, sem afrouxar critério.
3. **Aceite visual humano:** testar dispositivo real, zoom nativo 200%, leitor de tela e fidelidade à composição aprovada. Browser sintético/38 capturas não substituem essa aprovação.
4. **Cobertura CMS/mídia:** cenário combinatório de todos os campos/coleções não foi executado; timeout/ACK perdido pós-commit da renomeação foi verificado em unidade, não em E2E de Storage; o crédito não é legenda pública automática; referências externas não mapeadas continuam fora da garantia.
5. **Fontes privadas ChatGPT:** não são sincronizadas automaticamente com o GitHub. Não publicar backup privado, licenças nem secrets.

**Sem escritas produtivas de Supabase e sem etapa 6.** O presente adendo separa o resultado final do SHA `4069611d` de falhas e estados provisórios **históricos** reproduzidos abaixo. Quando este documento gerar novo SHA, verificar os próprios jobs e o fingerprint dele, sem herdar aprovação.

---

## Histórico de pendências por SHA (não descreve o estado corrente)

# Pendências técnicas — adendo vigente

## Pendências efetivas após homologação sintética ampliada — 09/11/2026

**Resolvidos na matriz aprovada:** 87/87 navegador dentro de 119/119 P5, 260/260 Vitest, CRUD editorial representativo de sete coleções com reabertura e ciclo despublicar/republicar, CAS de Trajetória/depoimentos/Contato, isolamento mobile B, enquadramento global e individual em Hero/Sobre/galeria/logotipo, remoção referenciada sem órfãos, falhas 503 e reconciliação privada da renomeação incerta (Vitest). Fontes: [P5 #42711984678](https://github.com/tuliustsangaropulos/PortfolioTulius/actions/runs/42711984678) e [Validate #42711984680](https://github.com/tuliustsangaropulos/PortfolioTulius/actions/runs/42711984680), SHA `442c72cf7b0bc8b7dc3738c822ce7aab18e75814`.

**Ainda exigem gate ou decisão:**

1. **P0 — Desempenho LCP mobile:** meta intacta mediana de três Lighthouse ≤3.500 ms. Última medição anterior (#42696549446, outro SHA) **FAIL 3.692,071 ms**. Exigir P3 do SHA final; não flexibilizar orçamento nem declarar sucesso com amostra isolada.
2. **P0 — Convergência Etapa 5:** Validate, P5, CMS read-only, P3 Lighthouse, P4 visual, SEO e Vercel fingerprint devem estar no **mesmo SHA** final. O próximo commit documental precisa rodar e ser conferido; aceitação visual humana permanece externa às asserções.
3. **P0 — Produção P2 / etapa 6:** migration `20261109024100_p2_composite_section_block_save.sql` não autorizada e não aplicada. RPC `save_section_block_atomic` ausente. Antes de pedido de autorização, reconciliar migrations históricas, confirmar backup/rollback, requisitos e validação read-only.
4. **Ressalvas de aceitação CMS:** não extrapolar a 87 testes para todas as combinações possíveis de estilos, famílias, tamanhos, alinhamentos e campos das nove coleções. Fluxos por coleção foram validados nas matrizes indicadas; revisão humana desktop/mobile é necessária.
5. **Ressalvas de mídia:** resposta incerta da renomeação validada por testes unitários + lógica conservadora de releitura, não por teste HTTP browser de pós-commit sem ACK. `credit` não é legenda pública automática; decisão editorial separada seria necessária para mudar o renderer. Referências externas não mapeadas exigem revisão específica.
6. **Arquivos privados do Projeto ChatGPT:** documentação do GitHub não substitui automaticamente anexos/snapshots históricos. Manter hierarquia de fontes vigente.

**Zero gravações produtivas de Supabase, zero alteração de conteúdo público e nenhuma etapa 6 executada.**


---

## Snapshots anteriores preservados como histórico

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


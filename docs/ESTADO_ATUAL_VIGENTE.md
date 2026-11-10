> **ESTADO VIGENTE EM 10/11/2026:** consultar [checklist oficial atualizado](CHECKLIST_PENDENCIAS_VIGENTE_2026-11-10.md) antes de qualquer status histórico abaixo. Duas cópias privadas de backup SQL foram verificadas com SHA-256; restauração PostgreSQL 17, backup de objetos Storage, reconciliação operacional das migrations e implantação P2 continuam pendentes. Aceites de LCP e visual foram concedidos. O material abaixo preserva o histórico e pode referir-se a situações superadas.

---

# Atualização operacional — 10/11/2026 (aceites e condição de segurança)

O proprietário **aceitou formalmente** o desvio LCP mobile do P3 e **homologou visualmente o site em dispositivos reais**, por declaração expressa. Não tratar o LCP como PASS: último resultado `5f1db1f9`, mediana **3.510,791 ms > 3.500 ms**, [P3 FAILURE](https://github.com/tuliustsangaropulos/PortfolioTulius/actions/runs/42733926964). O campo crédito saiu da interface administrativa no commit `28b8e2c8`, sem excluir dados históricos nem alterar o público.

O pré-check remoto confirmou **11 migrations no GitHub / 9 registradas no Supabase**, com diferença de timestamp da migration de mídia, baseline não registrado e P2 ainda não aplicada. O plano Free não possui a exportação/backup automático exigido neste fluxo e a [pasta de destino](https://drive.google.com/drive/folders/1KYWGJVvrxDsCgKjahkqRtNeJztcTImd8) foi encontrada vazia. **Não executar a migration de produção antes de obter backup recuperável, restauração isolada validada e plano de reversão.** Nenhum DDL, UPDATE ou DELETE produtivo foi realizado nesta conferência. Detalhes em [pendências atuais](OPEN_ISSUES.md).

---

# Quadro vigente de encerramento operacional — etapas 2, 3 e 5

**Registro:** 09/11/2026 (Brasília). **Etapa 2: FINALIZADA TECNICAMENTE (com ressalvas). Etapa 3: FINALIZADA TECNICAMENTE (com ressalvas). Etapa 5: VERIFICADA E FINALIZADA COMO EXECUÇÃO — RESULTADO NÃO CONFORME no LCP mobile (P3). Etapa 6: NÃO AUTORIZADA.** Ver [relatório de fechamento](ENCERRAMENTO_OPERACIONAL_ETAPAS_2_3_5_2026-11-09.md).

**Base de evidências:** commit `9ed21dc5714eb469dce72e340701ae70122400c3` (a `main` antes do presente registro), todos os cinco workflows dessa base já terminaram. [P5 local](https://github.com/tuliustsangaropulos/PortfolioTulius/actions/runs/42731876916) `success` **119/119** (8 base, 11 P2/RPC, 87 navegador autenticado, 8 mídia/API, 5 SEO); [Validate](https://github.com/tuliustsangaropulos/PortfolioTulius/actions/runs/42731876889) `success` **260/260** Vitest/56 arquivos e build; [P5 CMS read-only](https://github.com/tuliustsangaropulos/PortfolioTulius/actions/runs/42731877020) `success` **19/19 e zero escritas**; [exportação](https://github.com/tuliustsangaropulos/PortfolioTulius/actions/runs/42731877235) `success`; [P3 Lighthouse](https://github.com/tuliustsangaropulos/PortfolioTulius/actions/runs/42731876931) **`failure`** por LCP mobile mediano **3.505,522 ms**, limite inalterado **≤3.500 ms**, desvio **+5,522 ms**. Amostras: 3.505,522 / 3.486,274 / 3.600,028 ms. P3 registrou zero falhas do navegador, 38 capturas editoriais sem falhas automáticas, SEO em paridade e LCP desktop 879,231 ms PASS. `P3_DEPLOYMENT_GATE` e `P5_DEPLOYMENT_GATE` confirmaram por leitura HTTP o SHA de referência realmente servido pelo domínio. Vercel `dpl_A5gcp7h4QhziiiFkASM7QJiDPsZy` `READY` e alias `tulius.work`.

A finalização solicitada da etapa 5 é **administrativa/operacional**, não aprovação do P3. O orçamento ≤3.500 ms não foi alterado; a não conformidade de +5,522 ms permanece explícita. A produção Supabase permaneceu só em leitura; a RPC/migration P2 não foi aplicada. Este adendo documenta o SHA de referência e **não presume** os resultados de CI do novo commit documental.

---

## Estados por SHA e histórico anteriormente registrados

# Atualização de regressão após documentação — Gate P3 REPROVADO

> **Atualização posterior — 09/11/2026, commit `9b902579` (resultado FINAL da regressão).** A convergência funcional foi aprovada, mas o P3 deste SHA terminou **FAILURE**, não "pendente": [P3 #42731103548](https://github.com/tuliustsangaropulos/PortfolioTulius/actions/runs/42731103548). Lighthouse mobile LCP: **3.516,403 / 3.631,569 / 3.467,873 ms**, mediana **3.516,403 ms > teto imutável 3.500 ms** (excesso 16,403 ms). `P6_PERFORMANCE_BUDGET mobile result=FAIL`, `P6_RELEASE_REGRESSIONS` registra o excesso. Browser 0 falhas, P4 38 capturas sem falhas, SEO/paridade PASS, desktop LCP 864,261 ms PASS, e `P3_DEPLOYMENT_GATE` confirmou por HTTP que a produção servia `9b9025798fe1d453674283e670af4f9704bde973`. **Etapa 5: BLOQUEADA para este SHA**, sem reclassificar como sucesso o P3 anterior do SHA `4069611d` (mediana 3.496,608 ms PASS). A variação entre essas duas medições demonstra risco real de instabilidade laboratorial; nenhuma meta foi flexibilizada.
>
> Outros resultados do MESMO SHA `9b902579`: [Validate #42731104023](https://github.com/tuliustsangaropulos/PortfolioTulius/actions/runs/42731104023) SUCCESS **260/260**; [P5 #42731103839](https://github.com/tuliustsangaropulos/PortfolioTulius/actions/runs/42731103839) SUCCESS **119/119**, inclusive **87/87 browser sintético**; [P5 read-only #42731103645](https://github.com/tuliustsangaropulos/PortfolioTulius/actions/runs/42731103645) SUCCESS **19/19, 0 writes**; [exportação #42731103626](https://github.com/tuliustsangaropulos/PortfolioTulius/actions/runs/42731103626) SUCCESS. Supabase produtivo continuou somente leitura, 0 INSERT/UPDATE/DELETE, Storage ou DDL nesta execução; etapa 6 NÃO autorizada/não executada. O commit posterior que incorpora este adendo também exigirá conferência de seus próprios workflows; não presumir resultado.

---

## Evidências convergentes anteriores e histórico

# Estado técnico vigente — convergência das etapas 2, 3 e 5

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

---

## Arquivo histórico: estados e adendos anteriores (preservados integralmente)

# Estado técnico — adendo vigente pós-homologação P2/P4

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
---

## Snapshots anteriores preservados como histórico

# Estado técnico e regressões — adendo mais recente

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

# Estado atual — adendo mais recente

## Atualização operacional comprovada — 09/11/2026 (SHA funcional `b2c732213ba34789b7e04761dfff84fb91fcbc7f`)

> Adendo de continuidade, sem modificação do código público ou de dados produtivos. O SHA deste registro documental será posterior ao SHA funcional citado; **não atribuir a ele sucesso automático** de workflows anteriores. Consultar as execuções do commit documental antes de homologar a convergência.

- **Etapa 2 / CMS: PARCIAL, com cobertura sintética ampliada comprovada.** [P5 #42682410740, tentativa 2](https://github.com/tuliustsangaropulos/PortfolioTulius/actions/runs/42682410740) terminou `success`, incluindo 57/57 cenários de navegador autenticado. Hero A/B, reordenação e globals, navegação, Trajetória, depoimentos, sete coleções normalizadas, placements desktop e mobile A, tipografia independente, Identidade e revisões foram exercitados com dados fictícios, gravação/releitura no PostgREST local quando assertada, renderer desktop/mobile nos casos especificados e conflitos CAS. **Não equivale** a CRUD completo (criar, editar, despublicar, reabrir, concorrer) individualmente em todas as nove coleções, nem a matriz exaustiva de cores, estilos nomeados, alinhamentos e painel mobile B. Esses gates permanecem parciais.
- **Etapa 3 / Biblioteca: PARCIAL, ampla cobertura positiva e negativa demonstrada.** O mesmo P5 confirma upload/publicação, alt/título/crédito/ponto focal, persistência ao reabrir, CAS, renomeação privada com promoção, exclusão sem órfãos e injeções HTTP `503` em PATCH SQL/PostgREST e POST Storage com preservação sintética de rascunho/ausência de objetos órfãos. Restam conferir via navegador a precedência de enquadramento global e por uso em Hero, Sobre e galerias, referências de conteúdo em casos de exclusão e os estados de resposta incerta; **`credit` é metadado de catálogo, sem legenda pública automática comprovada**.
- **P5 agregado: 89/89 PASS** = 8 cenários originais + 11 P2/RPC/CAS/rollback + 57 navegador + 8 Storage/API + 5 SEO, todos com endereço `127.0.0.1:54321` e `cloudConnections: 0` nos grupos que reportam esse campo. Erros de instrumentação e uma falha Docker na primeira tentativa foram históricos; o resultado final da tentativa 2 é `success`, não um sucesso retroativo das tentativas falhas.
- **Validate #42682411152: SUCCESS** no mesmo SHA funcional: formatação, TypeScript, **258/258 testes Vitest (56 arquivos)**, build, smoke e sintaxe dos testes de navegador.
- **P3 Lighthouse: BLOQUEIO ainda aberto.** A execução mais recente localizada antes desta atualização, [#42677818677](https://github.com/tuliustsangaropulos/PortfolioTulius/actions/runs/42677818677), era de **outro SHA** (`06105c35013c7bd8b483c4d14ac0390ef7d9a16d`) e falhou com LCP mobile mediano **3.648,364 ms > 3.500 ms**, apesar de navegador sem falhas, SEO em paridade e Lighthouse acessibilidade/boas práticas/SEO 100. **Não há P3 aprovado atribuível ao SHA `b2c7322` nesta conferência**. Não afrouxar o orçamento.
- **Vercel:** consulta autenticada identificou deploy de produção `dpl_BGTbvqwWkckcczUuePdZ3euVm6et` em estado `READY`, commit `b2c7322`, com alias `tulius.work`. A leitura HTTP do JSON de fingerprint do domínio não foi concluída nesta auditoria; não equivaler o metadata do Vercel à leitura da resposta HTTP.
- **Supabase de produção: somente leitura, zero alterações realizadas nesta execução.** SELECT confirmou 14 seções, 28 blocos, 56 placements, 75 mídias; consulta a `pg_proc` retornou **zero** funções `public.save_section_block_atomic`; listagem de migrations: nove versões, sem `20261109024100`. Não houve inserts, updates, deletes, alterações em Storage ou migrations remotas.
- **Etapa 5: PARCIAL/BLOQUEADA.** Validate e P5 do SHA funcional passaram, mas P3 do mesmo SHA e aceite visual final faltam. O commit documental que incorpora este adendo deve acionar Validate, P5 e P3 por path filter; os resultados **ainda precisam ser observados**. Não declarar convergência até validar os IDs e SHA efetivos.
- **Etapa 6: DEPENDENTE DE AUTORIZAÇÃO ESPECÍFICA, NÃO EXECUTADA.** Arquivo: `supabase/migrations/20261109024100_p2_composite_section_block_save.sql`; adiciona `block_placements.updated_at` e seu trigger, além da RPC `public.save_section_block_atomic` (gravação composta com CAS/rollback e verificação de administrador). Nenhuma migration pode ser aplicada sem autorização separada, snapshot/backup e plano de recuperação. A implantação não reescreve conteúdo editorial como efeito normal, mas muda o contrato de persistência e deve ser monitorada.

Consulte os detalhes do [relatório P2/P4](P2_P4_RELATORIO_EXECUCAO_2026-11-09.md) e [pendências vigentes](OPEN_ISSUES.md).

---

## Documentação anterior preservada

# Estado operacional — atualização das etapas 1 a 5

> **Adendo auditável — 09/11/2026.** Informação mais recente que os snapshots abaixo. Fonte: [execução conectada das etapas 1–5](EXECUCAO_ETAPAS_1_A_5_2026-11-09.md), commit funcional `f9e48dcb`, CI e SELECT de produção. Preserve os documentos originais logo abaixo como histórico, sem atribuir a eles o estado atual.

- **P2:** RPC composta implementada/testada com 11 cenários sintéticos; não instalada em produção (nove migrations remotas sem a nova). Caminho legado continua, sem atomicidade conjunta em produção.
- **P3:** baseline LCP mobile mediana 3.876,691 ms **FAIL**. Carregamento assíncrono da folha de fontes preserva pesos e famílias finais, mas o novo resultado de Lighthouse **não estava verificado** no momento deste adendo. Exigir CI P3 do SHA final e verificação do domínio.
- **P4:** E2E navegador **20/20 PASS** e suíte local total **52/52 PASS** em [P5 #42566409424](https://github.com/tuliustsangaropulos/PortfolioTulius/actions/runs/42566409424). Inclui UI de mídia, navegação, conflito de seção e subset Hero A/B; não cobre toda a matriz do CMS.
- **Validate:** [#42566409385](https://github.com/tuliustsangaropulos/PortfolioTulius/actions/runs/42566409385) SUCCESS no commit funcional `f9e48dcb`. Este adendo requer um novo gate para o SHA documental final.
- **Produção:** Supabase consultado somente em leitura, sem migrations ou Storage/cloud writes; Vercel auto-deployment associado a `main`. Aceite visual e aprovação de migration P2 continuam decisões manuais.

---

## Histórico anterior preservado

# Atualização operacional — P2/P4, 09/11/2026

> **Atualização de continuidade — 09/11/2026.** Este trecho prevalece sobre quaisquer snapshots datados abaixo. Código inicialmente auditado em `7e8d7f82`, agora incluindo correção de fallback P2 (`4e739dbf`), suíte de mídia sintética (`630fb712`) e experimentos de prioridade da consulta inicial de Perfil (`b3dc0a5f` e `93176222`). **Não foi aplicada migration nem houve escrita de ensaio no Supabase de produção.** A migration `20261109024100_p2_composite_section_block_save.sql` existe em Git, mas `public.save_section_block_atomic` está **ausente no banco produtivo** (SELECT em `pg_proc`); usar o caminho legado até autorização separada. Veja [relatório de execução](P2_P4_RELATORIO_EXECUCAO_2026-11-09.md), [plano de aceite](P2_P4_PLANO_ACEITE_2026-11-08.md) e [mapa CMS → renderer](MAPA_CAMPOS_CMS_RENDERER.md).

## Situação P1–P5 em 09/11/2026
- **P1:** concluída tecnicamente; regressão de TypeScript, Vitest e build passou no Validate #42562429153.
- **P2:** implementação/RPC e 11 cenários CAS/rollback sintéticos aprovados; o fallback não aceita erro SQL interno `42883` como ausência de função; **produção ainda usa RPC anterior e não recebeu nova migration**.
- **P3:** mediana LCP mobile referência 3.684,469 ms (**FAIL**, teto ≤3.500). Experimento `b3dc0a5f` mediana 3.613,587 ms (**FAIL**); segundo experimento `93176222` medido em #42562429184, decisão depende da mediana. Identidade visual, fotos e CSS preservados.
- **P4 editor:** 6/6 UI básicas com escrita/releitura/renderer sintético; matriz ampla Hero, navegação, coleções e revisões pendente.
- **P4 mídia:** 8/8 novas verificações reais de Auth/Storage/metadados/compensações sintéticas em #42561707707; UI da Biblioteca completa pendente. `alt_text` canônico já refletido na composição em testes unitários; `credit` e `focal_point` são metadados, sem efeito público global automático comprovado.
- **P4 SEO:** 5/5 sintéticos, HTML estático só após novo build/deploy.
- **P5:** 30/30 referência #42556090560; mais 8 de mídia no workflow #42561707707. Não atribuir sucesso de run antigo ao SHA final.

---

## Documento anterior preservado para rastreabilidade

# PortfolioTulius — estado operacional vigente

**Snapshot conferido:** 05/11/2026 · **Fonte:** `main`, GitHub Actions e Vercel. A visão pública exibida hoje é o **baseline visual a preservar integralmente**. Não interpretar este Markdown como monitoramento em tempo real. O [estado acumulado anterior, com todos os marcos e métricas](historico/ESTADO_ATUAL_VIGENTE_ANTES_REORGANIZACAO_2026-11-05.md), foi preservado.

## Versões e evidências, sem misturar escopos

| Item | Comprovação |
|---|---|
| **Último commit funcional antes desta reorganização** | [`79aa3c07ce6c9106b1d504c1f574731bf70fb5d2`](https://github.com/tuliustsangaropulos/PortfolioTulius/commit/79aa3c07ce6c9106b1d504c1f574731bf70fb5d2) |
| **Validação de código** | [Validate #42020574434](https://github.com/tuliustsangaropulos/PortfolioTulius/actions/runs/42020574434): **success** (formatação, TypeScript, testes, build, smoke e sintaxe) |
| **Produção** | Vercel **READY**, `https://tulius.work/p3-deployment.json` apontando para **`79aa3c07`** durante a consulta |
| **Última auditoria P3 localizada** | [#42020342275](https://github.com/tuliustsangaropulos/PortfolioTulius/actions/runs/42020342275), commit anterior **`0873eeff`**, **failure global**, apesar de deployment do próprio SHA confirmado |
| **Detalhamento P3 anterior** | **7 falhas** no navegador; mediana LCP mobile sintético de **3.536,634 ms**, acima do limite **3.500 ms**. P4 produziu **38 capturas sem falhas automáticas** e P5 público foi validado separadamente. São métricas **desse SHA**, não do `79aa3c07` |
| **P3 para `79aa3c07`** | **Não localizada** nesta auditoria. O CI verde do último commit não substitui P3 |
| **Experiência real com CMS** | Operações autenticadas de salvar/reler campos, upload e exclusão não foram homologadas nesta rodada documental |

**Importante:** qualquer commit **somente documental** após `79aa3c07` pode gerar novo SHA e nova execução do build, sem alteração de conteúdo funcional. Não promover o SHA documental a evidência de aceite visual ou P3.

## Contrato público e CMS implementados

- A identidade visual, a fotografia, as cores, tipografia, cortes, animações e composição **estão aprovadas como exibição atual** e não devem ser modificadas por tarefas documentais.
- O perfil mobile foi compactado para trazer a seta à primeira dobra; o bloco duplicado “Experiência em destaque” foi ocultado apenas no mobile. A seção **Olá** contém o retrato sem cortes laterais no desktop e muda para fundo grafite apenas após a foto no mobile.
- **Ferramentas** mobile usa distribuição mais alta/espaçada; em **Experiências**, a faixa de logos muda para laranja somente ao ficar sticky. A renderização mobile concentra a experiência ativa e preserva a navegação pelos seis logos.
- No **Editor do Site**, os botões de criação de seção/bloco/item foram retirados da UI; abas **Editar seção / Acervo estruturado** ficaram compactas no cabeçalho; o botão **Salvar** utiliza o registro agregado de ações pendentes.
- **Trajetória** da experiência é editada na mesma página (Empresa, Cargo, Local, Início, Fim, Ordem, Status e Descrição). O tooltip ao lado de “Slides relacionados aos projetos” substitui as explicações extensas; o atalho para Coleções foi retirado. Os dados continuam em `career_experiences`.
- A **Biblioteca de Mídia** é o local da edição do alt e do enquadramento; o Editor não apresenta entradas locais. As cópias de alt em JSONB não têm atualização retroativa confirmada.
- A **Prévia** administrativa possui modo mobile com razão **390:844**. Os valores SEO só são refletidos no HTML estático **após um novo build**. Domínio canonical: **`https://tulius.work/`**.

Referências de implementação: [CMS](ADMIN_CMS.md), [layout responsivo](RESPONSIVE_LAYOUT.md) e [auditoria dos pedidos](AUDITORIA_PEDIDOS_CHAT_2026-11-05.md).

## Inventário de banco — somente snapshot anterior

Consulta somente leitura registrada em 05/11: **14 seções** (14 publicadas, 13 visíveis), **14 entradas de navegação** (14 publicadas), **75 mídias catalogadas** (72 públicas, 3 privadas), **128 objetos físicos** no Storage (72 públicos, 56 privados), e **0 `editorial_issues` abertas** naquele momento. Um snapshot anterior tinha 76 mídias e 129 objetos; **não há atribuição comprovada para a diferença**. Esses totais **não são atualizados automaticamente**; nenhuma gravação no Supabase foi feita nesta reorganização.

## Encerramento histórico e verificações técnicas

Em 05/11/2026 o proprietário declarou encerrada a frente anterior por **decisão administrativa e aceite visual**. [Registro de encerramento](ENCERRAMENTO_OPERACIONAL_2026-11-05.md). Isso não converte testes não executados em sucesso, nem significa que uma nova solicitação seja automaticamente um backlog antigo reaberto. Para lacunas restantes, consultar [Verificações técnicas](OPEN_ISSUES.md).

**Hierarquia operacional:** código e dados do SHA vigente → CI e deployment desse SHA → evidência de navegador / CMS específica → aceite estético do proprietário. [Índice documental](README.md) · [Arquivo completo da versão anterior](historico/ESTADO_ATUAL_VIGENTE_ANTES_REORGANIZACAO_2026-11-05.md).


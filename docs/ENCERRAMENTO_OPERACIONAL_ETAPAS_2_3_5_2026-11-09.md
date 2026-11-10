# Encerramento operacional das etapas 2, 3 e 5 — PortfolioTulius

**Registro em:** 09/11/2026, horário Brasília; evidências GitHub Actions podem constar em 10/11 UTC. **Branch:** `main`. **Natureza:** fechamento de trabalho e verificação de resultados, sem declarar aceite dos critérios reprovados e sem autorizar a etapa 6.

## Estados finais das frentes de trabalho

| Etapa | Estado da execução | Resultado técnico / limite |
|---|---|---|
| **2 — CMS** | **FINALIZADA TECNICAMENTE** | Suíte sintética aprovada nos cenários implementados, com ressalvas não ocultadas. A RPC composta não está instalada no banco produtivo. |
| **3 — Biblioteca de Mídia** | **FINALIZADA TECNICAMENTE** | Suíte sintética aprovada nos cenários implementados, com limitações explicitadas. |
| **5 — Convergência, regressão e documentação** | **VERIFICADA E FINALIZADA COMO EXECUÇÃO** | **Resultado de aceite: NÃO CONFORME** no gate de desempenho P3 mobile. Não converter um workflow `failure` em `success`. |
| **6 — Migration produtiva** | **NÃO INICIADA / NÃO AUTORIZADA** | Depende de autorização posterior específica, backup, compatibilidade e rollback. |

## Verificações e links atribuídos a um único SHA

**Base de evidências:** commit `9ed21dc5714eb469dce72e340701ae70122400c3` (a `main` antes do presente registro), todos os cinco workflows dessa base já terminaram. [P5 local](https://github.com/tuliustsangaropulos/PortfolioTulius/actions/runs/42731876916) `success` **119/119** (8 base, 11 P2/RPC, 87 navegador autenticado, 8 mídia/API, 5 SEO); [Validate](https://github.com/tuliustsangaropulos/PortfolioTulius/actions/runs/42731876889) `success` **260/260** Vitest/56 arquivos e build; [P5 CMS read-only](https://github.com/tuliustsangaropulos/PortfolioTulius/actions/runs/42731877020) `success` **19/19 e zero escritas**; [exportação](https://github.com/tuliustsangaropulos/PortfolioTulius/actions/runs/42731877235) `success`; [P3 Lighthouse](https://github.com/tuliustsangaropulos/PortfolioTulius/actions/runs/42731876931) **`failure`** por LCP mobile mediano **3.505,522 ms**, limite inalterado **≤3.500 ms**, desvio **+5,522 ms**. Amostras: 3.505,522 / 3.486,274 / 3.600,028 ms. P3 registrou zero falhas do navegador, 38 capturas editoriais sem falhas automáticas, SEO em paridade e LCP desktop 879,231 ms PASS. `P3_DEPLOYMENT_GATE` e `P5_DEPLOYMENT_GATE` confirmaram por leitura HTTP o SHA de referência realmente servido pelo domínio. Vercel `dpl_A5gcp7h4QhziiiFkASM7QJiDPsZy` `READY` e alias `tulius.work`.

## Etapa 2 — cobertura encerrada no escopo comprovado

Foram demonstrados: edição, salvamento e releitura de Hero A/B; estilos/cores/famílias tipográficas e tamanhos relevantes; isolamentos de placements desktop, mobile A e mobile B; fluxos de sete coleções normalizadas (criação/publicação, edição/reabertura, despublicação/republicação conservando ID); Trajetória e depoimentos nos editores integrados; navegação; comparações de revisão sem gravação, restauração controlada, status/visibilidade preservados, conflitos CAS; renderização pública nas combinações verificadas. O resultado está contido nos 87 cenários de navegador da P5 e na suíte de unidade.

**Ressalvas mantidas sem reabrir a etapa:** não houve varredura combinatória de cada campo de cada coleção, nem validação física de todos os aparelhos/tecnologias assistivas. A transação composta P2 está testada no Supabase sintético, mas **não instalada na produção**; sua ativação faz parte exclusivamente da etapa 6 após autorização.

## Etapa 3 — cobertura encerrada no escopo comprovado

Foram demonstrados no sintético: upload e publicação; `title`, `alt_text`, `credit` e `focal_point`; fechar/reabrir; precedência de focal global e ajuste por uso em Hero/Sobre/galerias e logotipo nas composições testadas; renomeação privada/promoção; proteção CAS; limpeza de catálogo, objeto e referências suportadas; falhas injetadas 503 em SQL/PostgREST e Storage, preservação de rascunho e compensação de falhas.

**Ressalvas mantidas:** o cenário de ACK incerto/timeout após commit de renomeação teve testes unitários, não E2E completo com Storage real e resposta perdida; `credit` continua metadata de catálogo, sem legenda pública automática; referências externas não mapeadas não estão cobertas pela prova. Isso não é tratado como falha de cenário aprovado.

## Etapa 5 — resultado verificado e execução finalizada

O conjunto de workflows do SHA de referência terminou, incluindo o P3 com **`failure`**. A única não conformidade de gate explicitamente identificada foi LCP mobile mediano 3.505,522 ms > 3.500 ms; os critérios de navegador, SEO, P4 e paridade do deploy passaram. O proprietário determinou que a **etapa de verificação fosse finalizada mesmo diante de uma reprovação**. Por isso:
- A tarefa de executar/verificar a etapa 5 é **concluída**;
- Seu **resultado de aceite permanece reprovado no critério de LCP mobile**;
- O risco de desempenho deve permanecer documentado e requer decisão do proprietário antes da etapa 6;
- Não se repete uma suíte apenas para escolher amostras favoráveis, e não se altera o orçamento para obter aprovação;
- O encerramento da etapa 5 **não equivale a encerramento integral do projeto**.

## Segurança, produção e mudança documentada

Consultas exclusivamente `SELECT` no Supabase produtivo `portfolio` confirmaram **14 seções, 28 blocos, 56 placements e 75 mídias**. A função `public.save_section_block_atomic` e a coluna `block_placements.updated_at` não existem na produção na última inspeção. **Nesta rodada de fechamento, zero INSERT/UPDATE/DELETE, DDL ou alterações de Storage produtivas.** Não ocorreu migração produtiva nem alteração de fotos, conteúdo ou identidade visual. O GitHub `main` pode desencadear deploy Vercel mesmo para mudança documental.

A migration da futura etapa 6 é **`supabase/migrations/20261109024100_p2_composite_section_block_save.sql`**: acrescenta `block_placements.updated_at` e trigger; cria `public.save_section_block_atomic` com administração obrigatória, CAS, validação e transação com rollback. Faz DDL no banco produtivo e inicializa timestamp nas linhas existentes; não tem o objetivo de reescrever conteúdo editorial. Antes da etapa 6, exigem-se confirmação de backup recuperável, reconciliação de migrations históricas, compatibilidade, plano de recuperação e aprovação separada para essa operação exata.

## Rastreabilidade documental

Os estados de `9ed21dc5` são imutáveis como evidência histórica. Este relatório será incluído em um **novo commit exclusivamente documental**. Os workflows eventualmente disparados pelo novo SHA devem ser inspecionados por seu próprio ID e não herdam automaticamente sucesso ou falha do SHA anterior. A classificação da etapa 5 como *execução finalizada* é independente do resultado de qualquer nova repetição; resultados novos permanecem registráveis sem falsificar a homologação anterior.

**Decisões pendentes do proprietário antes da etapa 6:** aceitar ou exigir tratamento do risco de LCP; confirmar backup e recuperação; confirmar que o escopo da etapa 6 se limita à migration acima; autorizar separadamente a operação de produção **somente após** os pré-requisitos. Nenhuma resposta a perguntas de planejamento equivale a autorização de escrita.

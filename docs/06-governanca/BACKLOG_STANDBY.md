# Backlog STANDBY — não executar
**Estado:** suspenso para futuras solicitações · **Revisão documental:** 16/11/2026. Nenhuma pendência é reaberta por esta atualização. O produto já está concluído; esta lista não autoriza intervenções.

## Evidência adicional ao risco ST-01 — 16/11/2026

No SHA [`8ed19b0`](https://github.com/tuliust/PortfolioTulius/commit/8ed19b098349e882f7c7dbb9b926114b6451e17e), [P3 #43846278955](https://github.com/tuliust/PortfolioTulius/actions/runs/43846278955) confirmou **navegador/responsividade PASS (0 falhas)** após corrigir as duas assertivas obsoletas de quatro para **cinco projetos**, e **38 capturas PASS**, projeto ↔ galeria, troca Trajetória/Projetos, rotas admin anônimas, SEO, RLS e tolerância parcial de leitura pública. O marcador `P3_DEPLOYMENT_GATE` confirmou o SHA servido em produção. Entretanto, **P3 global = FAILURE exclusivamente no orçamento mobile**: LCP mediano **3.649,202 ms** (meta **≤3.500 ms**); desktop **895,144 ms** (PASS). [Validate #43846279093](https://github.com/tuliust/PortfolioTulius/actions/runs/43846279093) e [Export Docs #43846279061](https://github.com/tuliust/PortfolioTulius/actions/runs/43846279061) foram **SUCCESS**; Vercel production `dpl_9Ti9ghY6ZC6tJ2DbCmT6Wg9L8XUm` estava **READY**. O proprietário **encerrou a revisão editorial** e aceitou o risco residual, sem considerar o LCP corrigido nem reclassificar o workflow como SUCCESS. Não houve mudança de Hero, Olá, conteúdo público ou banco nesta correção de teste.

O item ST-01 permanece **standby**. A aceitação do risco não é ordem de otimização e não permite flexibilizar o limite de 3.500 ms ou reabrir Hero/Olá. O trabalho editorial específico já está concluído e não deve voltar a aparecer como pendência da fase anterior.

| ID | Tema registrado | Eventual gatilho |
|---|---|---|
| ST-01 | Oscilação de LCP mobile: baseline 11/11 **3.627,065 ms (FAILURE)**; P3 16/11 em `2b573ca` **3.261,879 ms (SUCCESS)**, `652dea0` **3.746,315 ms (FAILURE)**, `9915964` **3.458,135 ms (SUCCESS)** e revisão editorial `aeffc5f` **3.609,314 ms (FAILURE)**. Limite **3.500 ms**; risco residual aceito, não corrigido. | Pedido explícito de otimização; não agir só pela oscilação |
| ST-02 | 7 avisos de funções `SECURITY DEFINER` autenticadas | Revisão de autorização |
| ST-03 | 19 políticas permissivas / 8 índices sem uso | Auditoria de banco |
| ST-04 | Proteção de senhas vazadas desligada, custo recusado | Nova decisão de custo |
| ST-05 | PAT pessoal historicamente exposto, revogação não verificada | Incidente ou auditoria específica |
| ST-06 | 19 SVGs divergentes Git/Storage, dois PNGs de logos e direitos | Curadoria de mídia |
| ST-07 | Cópias privadas e política de retenção Storage | Plano de retenção/backup |
| ST-08 | Edge Function `portfolio-illustrative-import-20261026` ainda ACTIVE | Inventário de dependências |
| ST-09 | Melhorias gerais CMS/SEO/UX/A11y **ainda não autorizadas**; a intervenção específica dos quatro indicadores × cinco categorias da seção 03 já foi realizada fora deste backlog | Nova solicitação específica; não presumir que a implementação de Resultados encerrou todo o item |
| ST-10 | Registros `editorial_issues` e metadados históricos | Curadoria editorial |
| ST-11 | Workflows pontuais antigos: cinco arquivados e removidos dos gatilhos na Etapa 03; seis workflows preservados. Deploy Vercel por commits documentais continua possível | Revisão futura de custos e disparos sem enfraquecer a validação |
| ST-12 | P5 Admin Read-Only falhou por timeout Puppeteer (18 s) no SHA histórico `c4bc83ce`; **causa não determinada nem considerada corrigida**. Runs posteriores P5 read-only e local transacional tiveram **SUCCESS** em `cb953dad`, sem provar a causa da falha antiga ou edição autenticada integral no último SHA. | Pedido futuro de diagnóstico específico; não reexecutar teste produtivo automaticamente |

**Não agir** a partir desses itens: sem exclusões, alterações de schema, relaxamento do Lighthouse, testes em produção, publicação de mídia ou uso de tokens. Registrar sempre SHA, evidência, riscos e decisão quando algo for reaberto. Risco aceito não significa corrigido.

[Segurança](../04-infraestrutura/SEGURANCA_E_ACESSOS.md) · [Auditoria antiga](../P1_INVESTIGACAO_HIGIENE_2026-10-28.md).

As Etapas 01–05 foram concluídas na esfera documental; ver [termo de encerramento](ENCERRAMENTO_CONSOLIDACAO_2026-11-11.md). A documentação de uma falha não é um aceite técnico da falha.

**Separação de escopos:** a solicitação de 16/11 autorizou a nova apresentação de Resultados e os campos do editor (P3 público **SUCCESS** em `9915964`), sem encerrar genericamente ST-09 nem executar ST-10. A curadoria editorial específica de `career_experiences` foi **realizada e aceita no ciclo posterior de 16/11**, com cinco projetos por empresa e Trajetórias revisadas; não criar novo item de backlog. A comprovação independente das métricas e qualquer ensaio autenticado integral do CMS são temas diferentes, **não executados nesta auditoria**. Os P5 sintéticos/read-only anteriores não comprovam gravação autenticada dos registros atuais. Aceite do proprietário não converte P3 FAILURE em PASS.

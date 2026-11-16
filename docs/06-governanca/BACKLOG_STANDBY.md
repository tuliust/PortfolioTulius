# Backlog STANDBY — não executar
**Estado:** suspenso para futuras solicitações · **Revisão documental:** 16/11/2026. Nenhuma pendência é reaberta por esta atualização. O produto já está concluído; esta lista não autoriza intervenções.

| ID | Tema registrado | Eventual gatilho |
|---|---|---|
| ST-01 | Oscilação de LCP mobile: baseline 11/11 **3.627,065 ms (FAILURE)**; P3 16/11 em `2b573ca` **3.261,879 ms (SUCCESS)**, em `652dea0` **3.746,315 ms (FAILURE)** e em `9915964` **3.458,135 ms (SUCCESS)**. Limite **3.500 ms** permanece. | Pedido explícito de otimização; não agir só pela oscilação |
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

**Separação de escopos:** a solicitação de 16/11 autorizou a nova apresentação de Resultados e os campos do editor (P3 público **SUCCESS** em `9915964`), sem encerrar genericamente ST-09 nem executar ST-10. A curadoria de `career_experiences` e a comprovação de indicadores continuam **fora da higiene documental** e dependem de revisão editorial específica. Testes P5 sintéticos/read-only anteriores não comprovam salvamento autenticado de todos os novos indicadores no SHA final.

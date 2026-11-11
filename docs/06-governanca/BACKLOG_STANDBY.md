# Backlog STANDBY — não executar
**Estado:** suspenso para futuras solicitações · **Revisão:** 11/11/2026. O produto já está concluído; esta lista não autoriza intervenções.

| ID | Tema registrado | Eventual gatilho |
|---|---|---|
| ST-01 | P3 LCP mobile mediano 3.627,065 ms > 3.500 no baseline | Pedido de otimização |
| ST-02 | 7 avisos de funções `SECURITY DEFINER` autenticadas | Revisão de autorização |
| ST-03 | 19 políticas permissivas / 8 índices sem uso | Auditoria de banco |
| ST-04 | Proteção de senhas vazadas desligada, custo recusado | Nova decisão de custo |
| ST-05 | PAT pessoal historicamente exposto, revogação não verificada | Incidente ou auditoria específica |
| ST-06 | 19 SVGs divergentes Git/Storage, dois PNGs de logos e direitos | Curadoria de mídia |
| ST-07 | Cópias privadas e política de retenção Storage | Plano de retenção/backup |
| ST-08 | Edge Function `portfolio-illustrative-import-20261026` ainda ACTIVE | Inventário de dependências |
| ST-09 | Melhorias CMS/SEO/UX/A11y não essenciais | Nova solicitação |
| ST-10 | Registros `editorial_issues` e metadados históricos | Curadoria editorial |
| ST-11 | Workflows pontuais antigos: cinco arquivados e removidos dos gatilhos na Etapa 03; seis workflows preservados. Deploy Vercel por commits documentais continua possível | Revisão futura de custos e disparos sem enfraquecer a validação |
| ST-12 | P5 Admin Read-Only falhou por timeout Puppeteer (18 s) no SHA `c4bc83ce`, após verificações iniciais PASS. **Causa não determinada, nem tratada como risco previamente aceito** | Pedido futuro de diagnóstico, sem reexecução automática de teste produtivo |

**Não agir** a partir desses itens: sem exclusões, alterações de schema, relaxamento do Lighthouse, testes em produção, publicação de mídia ou uso de tokens. Registrar sempre SHA, evidência, riscos e decisão quando algo for reaberto. Risco aceito não significa corrigido.

[Segurança](../04-infraestrutura/SEGURANCA_E_ACESSOS.md) · [Auditoria antiga](../P1_INVESTIGACAO_HIGIENE_2026-10-28.md).

As Etapas 01–05 foram concluídas na esfera documental; ver [termo de encerramento](ENCERRAMENTO_CONSOLIDACAO_2026-11-11.md). A documentação de uma falha não é um aceite técnico da falha.

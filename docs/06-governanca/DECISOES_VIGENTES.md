# Decisões vigentes do proprietário
**Status:** aceites e limites de manutenção · **Revisão:** 16/11/2026. Decisões antigas permanecem vigentes salvo autorização posterior explícita.

| Tema | Decisão consolidada |
|---|---|
| Produto | Site **concluído** e identidade aprovada; não reabrir construção |
| Design | Preservar fontes, CSS, fotos, textos, responsividade e animações salvo pedido explícito |
| Versões | Código/banco/deploy atuais por SHA prevalecem sobre relatórios antigos |
| Git | Trabalho em `main`, sem novas branches ou PRs, conforme [`AGENTS.md`](../../AGENTS.md) |
| Homologação | Supabase CLI + Docker **local sintético**, sem outro staging cloud |
| P2 | RPC aplicada em produção; não reaplicar baseline |
| Crédito | Coluna `media_assets.credit` removida por migration concluída |
| Desempenho | Orçamento LCP mobile ≤3,5 s mantido; variação residual aceita, FAILURE continua FAILURE |
| Auth | `Leaked Password Protection` não habilitada por custo recusado, risco aceito |
| PAT histórico | Decisão anterior de não revogação; revogação não comprovada |
| Storage | Não excluir originais/duplicatas sem estudo e operação específica |
| Pendências | Itens do **backlog histórico** continuam em standby; as solicitações novas de manutenção de 16/11 foram autorizadas e executadas no escopo de Resultados |
| Fontes privadas | **Cinco fontes consolidadas, revisadas em 16/11/2026 e confirmadas como únicas fontes privadas ativas do Projeto ChatGPT**; as oito anteriores permanecem fora das fontes ativas, conforme fechamento de 11/11. A substituição foi realizada pelo proprietário. Essas fontes são **snapshots privados, sem sincronização automática** com o GitHub; seu conteúdo não foi publicado no repositório. |
| Branches históricas | **Excluídas pelo proprietário**, somente `main` verificada via GitHub |
| Etapas 01–05 | **Consolidação documental e higiene encerradas** em 11/11; novo ciclo de manutenção autorizado em 16/11 não reabre as etapas anteriores |
| Resultados · seção 03 | Em 16/11, implementação autorizada dos cinco temas compactos e 20 indicadores (quatro por tema), com quatro métricas na visão geral. **Publicação técnica** não significa comprovação independente dos números nem conclusão da revisão de Experiências Profissionais. |
| Performance do ciclo 16/11 | Manter LCP mobile mediano ≤3.500 ms; auditorias por SHA registram **SUCCESS** e **FAILURE**, sem encobrir a oscilação. |

O aceite do site não transforma CI falho em PASS; um documento de migration não é prova de aplicação; deployment READY não é teste de gravação administrativa. Nenhuma dessas decisões concede autorização para mudanças invisíveis de segurança, conteúdo ou mídia nesta organização documental.

[Estado atual](../01-projeto/ESTADO_ATUAL.md) · [Standby](BACKLOG_STANDBY.md) · [encerramento histórico](../ENCERRAMENTO_OPERACIONAL_2026-11-05.md).

[Termo final com evidências e falhas observadas](ENCERRAMENTO_CONSOLIDACAO_2026-11-11.md).

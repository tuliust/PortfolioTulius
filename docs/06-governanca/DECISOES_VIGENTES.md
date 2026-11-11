# Decisões vigentes do proprietário
**Status:** aceites e limites de manutenção · **Revisão:** 11/11/2026.

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
| Pendências | **Todas em standby**, não executar automaticamente |
| Fontes privadas | Consolidar no projeto ChatGPT sem publicar no Git |

O aceite do site não transforma CI falho em PASS; um documento de migration não é prova de aplicação; deployment READY não é teste de gravação administrativa. Nenhuma dessas decisões concede autorização para mudanças invisíveis de segurança, conteúdo ou mídia nesta organização documental.

[Estado atual](../01-projeto/ESTADO_ATUAL.md) · [Standby](BACKLOG_STANDBY.md) · [encerramento histórico](../ENCERRAMENTO_OPERACIONAL_2026-11-05.md).

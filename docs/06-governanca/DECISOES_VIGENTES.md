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
| Resultados e Experiências · 16/11 | Duas métricas substitutas (`400+` contatos; `32 influenciadores`), cinco projetos por empresa e Trajetória com abertura + bullets foram aplicados; o proprietário encerrou e aceitou a revisão editorial. Publicação não equivale a comprovação independente de cada métrica. |
| Performance do ciclo 16/11 | Manter LCP mobile mediano ≤3.500 ms. P3 de `aeffc5f`: **FAILURE**, mediana **3.609,314 ms**. Risco residual aceito para o encerramento, não corrigido e não reclassificado. |

O aceite do site não transforma CI falho em PASS; um documento de migration não é prova de aplicação; deployment READY não é teste de gravação administrativa. Nenhuma dessas decisões concede autorização para mudanças invisíveis de segurança, conteúdo ou mídia nesta organização documental.

[Estado atual](../01-projeto/ESTADO_ATUAL.md) · [Standby](BACKLOG_STANDBY.md) · [encerramento histórico](../ENCERRAMENTO_OPERACIONAL_2026-11-05.md).

[Termo final com evidências e falhas observadas](ENCERRAMENTO_CONSOLIDACAO_2026-11-11.md).


## Escopo autorizado pelo proprietário — revisão editorial (16/11/2026)

Aprovação explícita para duas substituições no tema Imprensa e Influenciadores de Resultados e padronização das seis experiências: cinco projetos por empresa e Trajetória com abertura/bullets em negrito. O restante do site (em especial Perfil, Sobre, outros indicadores, design e mídias) deve ser preservado. Dados fornecidos pelo proprietário: 32 influenciadores distintos ao longo de CDI/InPress/Vale; mailing pessoal atual com mais de 400 contatos únicos; Invest RS/Guia, plataforma de eventos e estratégia CRM concluídos e entregues; destaque a Expointer, Mercopar e SIAL; Prefeitura/Plataforma SUBPI entregue para cerca de 1.000 servidores e terceirizados com dashboards/relatórios, ranking institucional 12º→2º e referência editorial de aproximadamente dois milhões de cidadãos atendidos. Não transformar contribuição individual em causalidade de resultados institucionais. A ordem atual e mídias aprovadas permanecem.

## Encerramento editorial declarado pelo proprietário — 16/11/2026

O proprietário considera **concluídas** a revisão e a homologação editorial das seções Resultados e Experiências, respeitando as restrições de não alterar Perfil/Hero, Olá, conteúdo/mídia sem aprovação ou operações em standby. O [P3 #43842659962](https://github.com/tuliust/PortfolioTulius/actions/runs/43842659962) permanece **FAILURE** por duas expectativas obsoletas de quatro projetos (corrigidas no script) e LCP mobile acima do orçamento. O aceite do risco não é declaração de correção nem de workflow `SUCCESS`; o Validate funcional `aeffc5f` foi **SUCCESS**. Documentação pública é canônica para implementação; as cinco fontes privadas anteriores a este ciclo precisam de substituição manual quando revisadas.

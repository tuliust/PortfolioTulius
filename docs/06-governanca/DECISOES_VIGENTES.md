# Decisões vigentes do proprietário

## Preferência de atualização das fontes privadas — 20/11/2026

O proprietário solicitou **não atualizar os cinco snapshots Markdown anexados ao Projeto após cada ação**. Durante a sequência de manutenção, os resultados verificáveis continuam registrados nos guias canônicos da `main` quando materialmente relevantes. **A consolidação/substituição manual dos anexos privados será feita em um único lote ao final das execuções**, após indicação do proprietário. Não criar múltiplas versões intermediárias, duplicatas ativas ou publicar arquivos/dados privados no GitHub. Esta decisão não altera os controles técnicos, a documentação canônica, o backlog standby nem as regras de não intervenção produtiva.


## Decisão operacional atualizada — 19/11/2026

O proprietário declarou que **excluiu os PATs antigos**, superando a decisão histórica de mantê-los, mas a correspondência do PAT originalmente exposto permanece não comprovada por identidade. A revogação do token Google foi informada pelo proprietário, sem confirmação independente de reconexão do rclone. Não usar/criar novos PATs para esta atividade.

Neste ciclo foram autorizados testes sintéticos locais e documentação via GitHub, inspeção de Supabase/Vercel somente leitura, sem mudanças produtivas de Auth/RLS/grants/migrations ou deploy manual. O proprietário executou no Windows três exportações SQL do PostgreSQL remoto em 19/11 (roles, schema e dados); o terminal reportou sucesso e tamanhos não nulos. A **integridade, abrangência integral de Auth/Storage e recuperação de dados reais não foram confirmadas**. Manter dumps e credenciais somente em armazenamento privado; não enviar dados reais ao repositório ou aos conectores.


## Aceite definitivo dos PDFs Desktop e Mobile — 18/11/2026

Após reexportar e **inspecionar visualmente ambos os PDFs reais**, o proprietário declarou “Está tudo ok. Considere concluído.” A homologação **dos PDFs Desktop e Mobile está ENCERRADA POR ACEITE**. Referência de código funcional `609218bd2bfede558f22c44002e62e9e21b2aada`; contrato e evidências em [Exportação PDF](../05-operacao/EXPORTACAO_PDF.md).

Essa decisão **não** modifica o orçamento LCP Mobile, não reclassifica workflows antigos de FAILURE e não autoriza intervenções em CMS, Supabase, RLS/Auth, Storage, design aprovado, nem itens em standby. Os aceites anteriores de 11/16–11 permanecem registrados abaixo com seus SHAs originais.

---

**Status:** aceites e limites de manutenção · **Revisão:** 16/11/2026. Decisões antigas permanecem vigentes salvo autorização posterior explícita.

## Decisão final da revisão editorial — 16/11/2026

No SHA [`8ed19b0`](https://github.com/tuliust/PortfolioTulius/commit/8ed19b098349e882f7c7dbb9b926114b6451e17e), [P3 #43846278955](https://github.com/tuliust/PortfolioTulius/actions/runs/43846278955) confirmou **navegador/responsividade PASS (0 falhas)** após corrigir as duas assertivas obsoletas de quatro para **cinco projetos**, e **38 capturas PASS**, projeto ↔ galeria, troca Trajetória/Projetos, rotas admin anônimas, SEO, RLS e tolerância parcial de leitura pública. O marcador `P3_DEPLOYMENT_GATE` confirmou o SHA servido em produção. Entretanto, **P3 global = FAILURE exclusivamente no orçamento mobile**: LCP mediano **3.649,202 ms** (meta **≤3.500 ms**); desktop **895,144 ms** (PASS). [Validate #43846279093](https://github.com/tuliust/PortfolioTulius/actions/runs/43846279093) e [Export Docs #43846279061](https://github.com/tuliust/PortfolioTulius/actions/runs/43846279061) foram **SUCCESS**; Vercel production `dpl_9Ti9ghY6ZC6tJ2DbCmT6Wg9L8XUm` estava **READY**. O proprietário **encerrou a revisão editorial** e aceitou o risco residual, sem considerar o LCP corrigido nem reclassificar o workflow como SUCCESS. Não houve mudança de Hero, Olá, conteúdo público ou banco nesta correção de teste.

Decisão: homologação editorial/funcional **considerada encerrada pelo proprietário**, com falha de performance **registrada e aceita como risco**, não corrigida. Hero, Olá, Storage, Auth/RLS, migrations e standby não foram reabertos. As cinco fontes privadas anexadas permanecem snapshots e precisam de revisão manual após a troca de conteúdo e dos SHAs.

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

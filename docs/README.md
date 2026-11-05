> **RODADA POSTERIOR (05/11/2026):** [Reconciliação de implementação dos pedidos deste chat](RECONCILIACAO_IMPLEMENTACAO_CHAT_2026-11-05.md) — baseline funcional `5599b2f0e0`, CI aprovado, publicação Vercel READY e limites de homologação explicitados. A decisão administrativa de encerramento abaixo é **histórica**, não prova de que novos pedidos foram ensaiados.

> **FONTE OPERACIONAL VIGENTE — ENCERRADO em 05/11/2026:** [Encerramento operacional por decisão do proprietário — 05/11/2026](ENCERRAMENTO_OPERACIONAL_2026-11-05.md). Checklists anteriores passam a ser **histórico de execução**; todos os IDs remanescentes foram baixados por decisão do proprietário, reabríveis apenas com nova necessidade. Sem erros visuais observados pelo proprietário. Não apagar evidências nem presumir backups/testes sem execução.

# Documentação técnica — PortfolioTulius

**Fonte operacional:** branch [`main`](https://github.com/tuliustsangaropulos/PortfolioTulius/commits/main), acompanhada de CI, deploy e, quando pertinente, consulta CMS. Documentos datados registram um SHA e **não** se atualizam automaticamente.

## Comece por aqui

- [README principal](../README.md) — aplicação, instalação, scripts, publicação e último marco auditado.
- [AGENTS.md](../AGENTS.md) — regras obrigatórias e restrições de alteração.
- [Estado operacional vigente](ESTADO_ATUAL_VIGENTE.md) — snapshots históricos e referência para o estado comprovado.
- [Reconciliação posterior dos pedidos do chat](RECONCILIACAO_IMPLEMENTACAO_CHAT_2026-11-05.md) — matriz de implementação, CI, Vercel, Supabase, lacunas de aceite e cautelas de preservação.
- [Pendências e limitações](OPEN_ISSUES.md) — encerramento histórico e limites de validação da nova rodada.
- [Guia das Fontes do ChatGPT](GUIA_FONTES_CHATGPT.md) — hierarquia e quatro anexos persistentes.

## Referências por assunto

| Assunto | Documento |
|---|---|
| Estrutura, rotas e carregamento CMS | [Arquitetura](ARCHITECTURE.md) |
| Entidades, blocos e campos dinâmicos | [Modelo de conteúdo](CONTENT_MODEL.md) |
| Editor e homologação administrativa | [CMS](ADMIN_CMS.md) |
| Identidade visual e tipografia | [Design system](DESIGN_SYSTEM.md) |
| Breakpoints, painéis, rolagem e imagens | [Layout responsivo](RESPONSIVE_LAYOUT.md) |
| Projetos/galerias/carreira publicados | [Experiências unificadas](EXPERIENCIAS_UNIFICADAS_2026-10-31.md) |
| Interações, movimento e acessibilidade | [UX e motion](UX_UI_MOTION.md) |
| LCP, SEO e auditorias | [Relatório de otimização LCP](P3_LCP_MOBILE_RESULTADOS_2026-10-31.md) · [Execução P3](P3_LCP_MOBILE_EXECUCAO_2026-10-31.md) |
| Segurança, políticas e limites RLS | [Segurança/RLS](SECURITY_RLS.md) |
| Vercel e publicação | [Deploy](DEPLOYMENT.md) |
| P1/P2/P3/P4/P5/P6 históricos | [Índice histórico](historico/README.md) |

## Critérios de aceitação

**Implementado** não significa **CI aprovado**; CI não significa **P3 aprovado**; P3/Lighthouse não substitui **p75 de visitantes reais** ou **inspeção estética humana**. Documente cada estado separadamente, sempre com links de SHA e execução. **O limite vigente de LCP mobile desde 02/11 é ≤3,5 s (mediana de três), não 2,5 s.** A P3 de 31/10 e os 38 screenshots são históricos; ver [rodada de 05/11](RECONCILIACAO_IMPLEMENTACAO_CHAT_2026-11-05.md).

## Arquivamento

Relatórios e handoffs de datas anteriores são fontes históricas. **Não os remova do Git nem os use para reinterpretar o presente.** Os documentos operacionais extensos anteriores a esta consolidação foram copiados, byte a byte via blobs existentes, para [docs/historico](historico/README.md), preservando o conteúdo e a rastreabilidade. Outros registros cronológicos mantiveram seus caminhos originais para não quebrar links existentes.

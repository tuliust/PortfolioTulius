> **ESTADO FUNCIONAL CONFERIDO — 05/11/2026:** [`5ed489af`](https://github.com/tuliustsangaropulos/PortfolioTulius/commit/5ed489af5879589565cb0101e420065bfbf50552) é o último código identificado na `main`, com [Validate #42014122089](https://github.com/tuliustsangaropulos/PortfolioTulius/actions/runs/42014122089) **success** e deployment de produção Vercel `dpl_8ZMJhUViSeVzx6gP12jtuPHaruuX` **READY** no mesmo SHA. O [ajuste administrativo `94466303`](https://github.com/tuliustsangaropulos/PortfolioTulius/commit/94466303617b18e343dddeb64d2ca7e39f131475) integra esse histórico, com [CI #42011905996](https://github.com/tuliustsangaropulos/PortfolioTulius/actions/runs/42011905996) **success**. O encerramento de 05/11 é anterior aos novos pedidos; **não** há aceite comprovado de operações reais autenticadas de upload/exclusão/salvamento, nem de pixels finais de Contato e transições em aparelho. [Matriz de requisitos, limites e evidências](RECONCILIACAO_IMPLEMENTACAO_CHAT_2026-11-05.md). Os marcos de 31/10 e os commits anteriores abaixo são históricos.

> **FONTE OPERACIONAL VIGENTE — ENCERRADO em 05/11/2026:** [Encerramento operacional por decisão do proprietário — 05/11/2026](ENCERRAMENTO_OPERACIONAL_2026-11-05.md). Checklists anteriores passam a ser **histórico de execução**; todos os IDs remanescentes foram baixados por decisão do proprietário, reabríveis apenas com nova necessidade. Sem erros visuais observados pelo proprietário. Não apagar evidências nem presumir backups/testes sem execução.

# Documentação técnica — PortfolioTulius

**Fonte operacional:** branch [`main`](https://github.com/tuliustsangaropulos/PortfolioTulius/commits/main), acompanhada de CI, deploy e, quando pertinente, consulta CMS. Documentos datados registram um SHA e **não** se atualizam automaticamente.

## Comece por aqui

- [README principal](../README.md) — aplicação, instalação, scripts, publicação e último marco auditado.
- [AGENTS.md](../AGENTS.md) — regras obrigatórias e restrições de alteração.
- [Estado operacional vigente](ESTADO_ATUAL_VIGENTE.md) — snapshots históricos e referência para o estado comprovado.
- [Reconciliação dos pedidos do chat até 05/11](RECONCILIACAO_IMPLEMENTACAO_CHAT_2026-11-05.md) — **fonte central para as novas alterações**, evidências dos SHAs e limites de aceite; o encerramento administrativo anterior é histórico.
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

**P3 do SHA funcional `5ed489af`:** [Audit P3 #42014121880](https://github.com/tuliustsangaropulos/PortfolioTulius/actions/runs/42014121880) **failure global** em `Browser routes and responsive viewports` (7 falhas automatizadas; Perfil mobile a 320 px entre elas). Em subgates separados, `P6_PERFORMANCE_BUDGET PASS`: LCP mediano de 3 simulações mobile **3,372 s** sob a meta **≤3,5 s**; desktop **0,905 s**. P5 read-only **3/3**, P4 **38 capturas sem falha automática**. Esses resultados parciais não equivalem a P3 aprovado, p75 real ou aceite visual humano.

## Critérios de aceitação

**Implementado** não significa **CI aprovado**; CI não significa **P3 aprovado**; P3/Lighthouse não substitui **p75 de visitantes reais** ou **inspeção estética humana**. Documente cada estado separadamente, sempre com links de SHA e execução. **O limite vigente de LCP mobile desde 02/11 é ≤3,5 s (mediana de três), não 2,5 s.** A P3 de 31/10 e os 38 screenshots são históricos; ver [rodada de 05/11](RECONCILIACAO_IMPLEMENTACAO_CHAT_2026-11-05.md).

## Arquivamento

Relatórios e handoffs de datas anteriores são fontes históricas. **Não os remova do Git nem os use para reinterpretar o presente.** Os documentos operacionais extensos anteriores a esta consolidação foram copiados, byte a byte via blobs existentes, para [docs/historico](historico/README.md), preservando o conteúdo e a rastreabilidade. Outros registros cronológicos mantiveram seus caminhos originais para não quebrar links existentes.

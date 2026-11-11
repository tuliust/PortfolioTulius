# PortfolioTulius — documentação temática

**ÍNDICE CANÔNICO | Revisão 11/11/2026 | baseline auditado `0627947`.** O site está finalizado. Os documentos nesta estrutura orientam manutenção; relatórios antigos são evidências de suas datas e SHAs, não estado vivo.

## Por assunto

| Necessidade | Fonte de referência |
|---|---|
| Estado do projeto | [Estado atual](01-projeto/ESTADO_ATUAL.md) |
| Componentes e dados | [Arquitetura](01-projeto/ARQUITETURA.md) |
| Cores, tipografia, identidade | [Design](02-design/IDENTIDADE_VISUAL.md) |
| Desktop, mobile e acessibilidade | [Responsividade](02-design/RESPONSIVIDADE_E_ACESSIBILIDADE.md) |
| Painel e ajustes de conteúdo | [CMS](03-cms/GUIA_ADMINISTRATIVO.md) |
| Campos, tabelas e renderer | [Modelo de dados](03-cms/MODELO_DE_DADOS.md) |
| Fotos, SVG, upload, Storage | [Mídias](03-cms/MIDIAS_E_STORAGE.md) |
| Banco, migrations, RPCs, Auth | [Supabase](04-infraestrutura/SUPABASE.md) |
| Permissões, políticas, chaves | [Segurança](04-infraestrutura/SEGURANCA_E_ACESSOS.md) |
| Domínios, publicação e SEO | [Vercel](04-infraestrutura/VERCEL_DEPLOY_SEO.md) |
| CI, Lighthouse, homologação | [Testes](05-operacao/TESTES_E_HOMOLOGACAO.md) |
| Restauração e rollback | [Backup](05-operacao/BACKUP_E_RECUPERACAO.md) |
| Identificadores e variáveis | [Configurações](06-governanca/CONFIGURACOES_E_INTEGRACOES.md) |
| Branches antigas e limpeza manual | [Referências de branches](06-governanca/BRANCHES_E_REFERENCIAS.md) |
| O que já foi decidido | [Decisões](06-governanca/DECISOES_VIGENTES.md) |
| Itens a não executar agora | [Backlog standby](06-governanca/BACKLOG_STANDBY.md) |
| Consultas por ChatGPT/Codex | [Guia para IA](06-governanca/GUIA_USO_POR_IA.md) |

## Política de leitura

Primeiro [`AGENTS.md`](../AGENTS.md), o guia temático e o código atual. Em conflitos: pedido vigente → código/serviços por SHA → CI do mesmo SHA → contratos canônicos → histórico datado. Distinguir teste sintético de escrita produtiva, deployment READY de CI verde e risco aceito de correção.

**Informações superadas em relatórios antigos:** a RPC P2 está em produção; a coluna de crédito de mídia foi removida; o staging escolhido é Supabase CLI/Docker local. Os itens do [standby](06-governanca/BACKLOG_STANDBY.md) não são ordens automáticas.

## Histórico organizado e fases

[Baseline pré-consolidação](historico/preconsolidacao-2026-11-11/ESTADO_PRE_CONSOLIDACAO.md) e [CSV de 384 hashes Git](historico/preconsolidacao-2026-11-11/ARQUIVOS_GIT_PRE_CONSOLIDACAO.csv). [Arquivo histórico organizado](historico/README.md), [estilos/visual](baselines/2026-11-07/REFERENCIAS_VISUAIS.md), [evidência sanitizada](evidence/p2-backup-counts-2026-11-10.json).

**Etapa 02:** contratos e índice concluídos. **Etapa 03 (11/11/2026):** [84 documentos legados arquivados](historico/legado-ate-2026-11-11/INDEX.md), mantendo stubs em seus caminhos anteriores e preservando blobs originais. [Cinco workflows obsoletos retirados e preservados](historico/workflows-retirados-2026-11-11/README.md); seis workflows operacionais permanecem. **Branches antigas continuam no remoto**: documentação e análise de exclusão realizadas, porém a integração GitHub disponível não permite remover referências de branch; executar a exclusão posteriormente pela interface, se desejado. **Etapa 04:** substituir Fontes privadas anexadas ao ChatGPT, sem sincronização automática.

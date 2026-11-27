# PortfolioTulius — documentação temática

**Atualização de 26/11/2026:** a otimização do carregamento de Olá em `197a41d` foi homologada com quatro workflows SUCCESS, P3 zero falhas e LCP mobile mediano 3,032 s/93. A correção subsequente de fragmentos inválidos passou 314 testes e Chromium isolado; novo resultado CI por SHA ainda deve ser confirmado. Consultar [estado atual](01-projeto/ESTADO_ATUAL.md) e [matriz](05-operacao/TESTES_E_HOMOLOGACAO.md).

**Entrada única para manutenção.** Leia primeiro as [regras obrigatórias](../AGENTS.md) e o [estado consolidado](01-projeto/ESTADO_ATUAL.md). A manutenção de 26/11/2026 consolidou Hero/Contato mobile e os seletores de fotografia de Olá no CMS (`0314101`, Production READY); Validate e P5 local SUCCESS; encerramento P3/P5 confirmado em `ca63496` (Production READY, P3/P5/Validate/Export Docs SUCCESS, P5 22/22 sem escritas, P3 zero falhas e LCP mobile mediano 3,172 s). Evidências na [matriz de testes](05-operacao/TESTES_E_HOMOLOGACAO.md). A correção técnica de 25/11 (`65b9e69`, P3 SUCCESS, LCP mobile 3,134 s) permanece como evidência datada. Standby preservado.

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
| Exportação PDF Desktop/Mobile, aceite e impressão | [Guia PDF](05-operacao/EXPORTACAO_PDF.md) |
| Restauração e rollback | [Backup](05-operacao/BACKUP_E_RECUPERACAO.md) |
| Identificadores e variáveis | [Configurações](06-governanca/CONFIGURACOES_E_INTEGRACOES.md) |
| Branches antigas e limpeza manual | [Referências de branches](06-governanca/BRANCHES_E_REFERENCIAS.md) |
| Encerramento oficial das Etapas 01–05 | [Termo final e validações](06-governanca/ENCERRAMENTO_CONSOLIDACAO_2026-11-11.md) |
| Como manter os guias atualizados após mudanças | [Protocolo de atualização](06-governanca/PROTOCOLO_ATUALIZACAO_DOCUMENTAL.md) |
| O que já foi decidido | [Decisões](06-governanca/DECISOES_VIGENTES.md) |
| Itens a não executar agora | [Backlog standby](06-governanca/BACKLOG_STANDBY.md) |
| Consultas por ChatGPT/Codex | [Guia para IA](06-governanca/GUIA_USO_POR_IA.md) |

## Política de leitura

Primeiro [`AGENTS.md`](../AGENTS.md), o guia temático e o código atual. Em conflitos: pedido vigente → código/serviços por SHA → CI do mesmo SHA → contratos canônicos → histórico datado. Distinguir teste sintético de escrita produtiva, deployment READY de CI verde e risco aceito de correção.

**Informações superadas em relatórios antigos:** a RPC P2 está em produção; a coluna de crédito de mídia foi removida; o staging escolhido é Supabase CLI/Docker local. Os itens do [standby](06-governanca/BACKLOG_STANDBY.md) não são ordens automáticas.

## Organização das pastas

| Pasta | Função |
|---|---|
| `01-projeto/` a `06-governanca/` | Guias canônicos por assunto; consultar antes de alterar código. |
| [`historico/`](historico/README.md) | Registros anteriores, decisões e evidências datadas; não constituem novas autorizações. |
| [`historico/consolidacao-2026-11-25/`](historico/consolidacao-2026-11-25/README.md) | Versões integrais anteriores dos pontos de entrada, preservadas por blob e SHA. |
| `baselines/`, `evidence/`, `sql/` | Referências técnicas e evidências versionadas; não executar SQL histórico automaticamente. |
| `docs/*.md` (exceto este índice) | 84 encaminhadores legados preservados por compatibilidade; não são contratos vigentes. |

Não remover os encaminhadores, evidências ou arquivos de runtime por conveniência. Os sete workflows ativos permanecem em `.github/workflows/`; os retirados estão em [histórico de workflows](historico/workflows-retirados-2026-11-11/README.md).

## Histórico e continuidade

- [Estado anterior e índice acumulado até 25/11/2026](historico/consolidacao-2026-11-25/README.md), inclusive registros de backup, Resultados, Experiências e PDF de 12–25/11.
- [Backups e recuperação](05-operacao/BACKUP_E_RECUPERACAO.md): aceite administrativo de 20/11 e verificação posterior de 21/11; restore real integral não executado.
- [Termo de encerramento da consolidação original](06-governanca/ENCERRAMENTO_CONSOLIDACAO_2026-11-11.md) e [histórico anterior](historico/README.md).

Os cinco snapshots privados do Projeto ChatGPT não sincronizam com GitHub. Não publicar conteúdo privado; seguir o [protocolo de atualização](06-governanca/PROTOCOLO_ATUALIZACAO_DOCUMENTAL.md).

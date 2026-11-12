# PortfolioTulius — documentação temática

**ÍNDICE CANÔNICO | Revisão 12/11/2026 | baseline histórica auditada `0627947`.** O site está finalizado. Os documentos nesta estrutura orientam manutenção; relatórios antigos são evidências de suas datas e SHAs, não estado vivo.

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
| Encerramento oficial das Etapas 01–05 | [Termo final e validações](06-governanca/ENCERRAMENTO_CONSOLIDACAO_2026-11-11.md) |
| Como manter os guias atualizados após mudanças | [Protocolo de atualização](06-governanca/PROTOCOLO_ATUALIZACAO_DOCUMENTAL.md) |
| O que já foi decidido | [Decisões](06-governanca/DECISOES_VIGENTES.md) |
| Itens a não executar agora | [Backlog standby](06-governanca/BACKLOG_STANDBY.md) |
| Consultas por ChatGPT/Codex | [Guia para IA](06-governanca/GUIA_USO_POR_IA.md) |

## Política de leitura

Primeiro [`AGENTS.md`](../AGENTS.md), o guia temático e o código atual. Em conflitos: pedido vigente → código/serviços por SHA → CI do mesmo SHA → contratos canônicos → histórico datado. Distinguir teste sintético de escrita produtiva, deployment READY de CI verde e risco aceito de correção.

**Informações superadas em relatórios antigos:** a RPC P2 está em produção; a coluna de crédito de mídia foi removida; o staging escolhido é Supabase CLI/Docker local. Os itens do [standby](06-governanca/BACKLOG_STANDBY.md) não são ordens automáticas.

## Registro consolidado do ciclo de ajustes — 12/11/2026

Este índice reúne **ajustes já registrados** nos contratos canônicos, sem criar uma fonte paralela de especificação. As descrições detalhadas, campos e CSS continuam nos guias de [Responsividade](02-design/RESPONSIVIDADE_E_ACESSIBILIDADE.md), [Identidade](02-design/IDENTIDADE_VISUAL.md), [CMS](03-cms/GUIA_ADMINISTRATIVO.md), [Modelo de dados](03-cms/MODELO_DE_DADOS.md) e [Testes e homologação](05-operacao/TESTES_E_HOMOLOGACAO.md). A baseline `0627947` e o termo de encerramento de 11/11 permanecem históricos.

| Escopo | Ajuste registrado | Registro canônico |
|---|---|---|
| Desktop e mobile | Retirada do toast “Sincronizando conteúdo…”; favicon TT e ícone Apple; seleção/upload no editor SEO com fonte única `site_settings.seo_json.faviconUrl` | [CMS](03-cms/GUIA_ADMINISTRATIVO.md), [Mídias](03-cms/MIDIAS_E_STORAGE.md), [SEO](04-infraestrutura/VERCEL_DEPLOY_SEO.md) |
| Mobile · Perfil/A | Hierarquia do título “Conexões / Autênticas. / Inovação.”, proporção de “TULIUS / TSANGAROPULOS”, retrato alinhado às margens esquerda/inferior; textos elevados; seta visível na primeira dobra e livre para sobrepor a foto | [Responsividade](02-design/RESPONSIVIDADE_E_ACESSIBILIDADE.md), [CMS](03-cms/GUIA_ADMINISTRATIVO.md) |
| Mobile · Perfil/B | Selo de visão 360° acima de “Áreas de Atuação”; faixa de fundo cinza até a régua laranja; token **`color.lightGray` = `#ECECEC`** administrável em Identidade e referenciado em `hero.mobileEditorial.middle.background` | [Identidade](02-design/IDENTIDADE_VISUAL.md), [Modelo de dados](03-cms/MODELO_DE_DADOS.md) |
| Mobile · Resultados | Filetes acima dos indicadores “~8 mil” e “+30” elevados sem alterar valores | [Responsividade](02-design/RESPONSIVIDADE_E_ACESSIBILIDADE.md) |
| Mobile · Formação | Remoção dos filetes superiores iniciais, redistribuição vertical do título “Idiomas e Formação Complementar”, fonte/peso ampliados para o título e referências de instituição/período menores | [Responsividade](02-design/RESPONSIVIDADE_E_ACESSIBILIDADE.md) |
| Mobile · Experiências | Afastamento da numeração dos projetos em relação à régua laranja e rolagem do item aberto para seu início ao selecionar outro projeto | [Responsividade](02-design/RESPONSIVIDADE_E_ACESSIBILIDADE.md) |
| Mobile · Contato | Encaixe da foto na base da área laranja com continuação grafite, remoção do filete acima de “Canais de Contato” e ampliação do subtítulo | [Responsividade](02-design/RESPONSIVIDADE_E_ACESSIBILIDADE.md) |
| Desktop · Perfil, Resultados, Formação e Sobre | Escalas e controles desktop de texto, seta centralizada no viewport, espaçamentos iguais, foto de Sobre até a base, afastamento entre indicador e selo em alturas compactas | [Responsividade](02-design/RESPONSIVIDADE_E_ACESSIBILIDADE.md), [CMS](03-cms/GUIA_ADMINISTRATIVO.md), [Testes](05-operacao/TESTES_E_HOMOLOGACAO.md) |

**Rastreabilidade por ciclo:** mobile/favicons [`45c9f78`](https://github.com/tuliustsangaropulos/PortfolioTulius/commit/45c9f7868e5dd31ae0e231e48cbc3828d250d45a); primeira dobra [`ade1552`](https://github.com/tuliustsangaropulos/PortfolioTulius/commit/ade1552280d2ea2a9362535da23d054329c60a24); token, integração e refinamentos mobile [`e24e91f`](https://github.com/tuliustsangaropulos/PortfolioTulius/commit/e24e91f05eae47ae34f12803a8d90777e96895b2); desktop [`ebda0aa`](https://github.com/tuliustsangaropulos/PortfolioTulius/commit/ebda0aabda776a8513cad963df184199ed0a6e53). Os commits intermediários e resultados de testes estão individualizados em [Testes](05-operacao/TESTES_E_HOMOLOGACAO.md).

**Aceite e limitações por SHA:** o ciclo mobile de `e24e91f` passou em [P3 #43168149664](https://github.com/tuliustsangaropulos/PortfolioTulius/actions/runs/43168149664) (LCP mobile mediano **3.466,042 ms**). Já o ciclo desktop de `ebda0aa` teve [Validate #43197029438](https://github.com/tuliustsangaropulos/PortfolioTulius/actions/runs/43197029438) e [P5 Admin read-only #43197029455](https://github.com/tuliustsangaropulos/PortfolioTulius/actions/runs/43197029455) **SUCCESS**, mas [P3 #43197029431](https://github.com/tuliustsangaropulos/PortfolioTulius/actions/runs/43197029431) **FAILURE global** exclusivamente pelo LCP mobile mediano de **3.670,965 ms**, acima da meta de 3.500 ms. Os testes responsivos e 38 capturas desse SHA passaram. Não converter um resultado histórico PASS em aprovação do SHA mais recente; não reabrir pendências em standby automaticamente.


## Histórico organizado e fases

[Baseline pré-consolidação](historico/preconsolidacao-2026-11-11/ESTADO_PRE_CONSOLIDACAO.md) e [CSV de 384 hashes Git](historico/preconsolidacao-2026-11-11/ARQUIVOS_GIT_PRE_CONSOLIDACAO.csv). [Arquivo histórico organizado](historico/README.md), [origem Figma Make arquivada](historico/figma-make-2026-11-11/README.md), [estilos/visual](baselines/2026-11-07/REFERENCIAS_VISUAIS.md), [evidência sanitizada](evidence/p2-backup-counts-2026-11-10.json).

**Etapa 02:** contratos e índice concluídos. **Etapa 03 (11/11/2026):** [84 documentos legados arquivados](historico/legado-ate-2026-11-11/INDEX.md), mantendo stubs em seus caminhos anteriores e preservando blobs originais. [Cinco workflows obsoletos retirados e preservados](historico/workflows-retirados-2026-11-11/README.md); seis workflows operacionais permanecem. **Branches antigas excluídas pelo proprietário e ausência conferida no GitHub. Etapa 04:** cinco Fontes privadas já anexadas ao projeto ChatGPT, com as oito originais retiradas das Fontes ativas. **Etapa 05:** auditoria de encerramento e registro dos resultados em [termo final](06-governanca/ENCERRAMENTO_CONSOLIDACAO_2026-11-11.md). Os riscos técnicos continuam em standby.

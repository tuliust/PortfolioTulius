# PortfolioTulius — documentação temática

## Situação vigente — aceite PDF e conferência de serviços, 18/11/2026

**Atualização posterior de 18/11:** corrigida a regra de apresentação dos logotipos das Experiências: `logoAlt` é opcional e não bloqueia a imagem quando há URL. O componente público tem teste de regressão para desktop/mobile. Releitura read-only após novos uploads confirmou **90 mídias publicadas e 143 objetos Storage** (87 públicos e 56 privados). **Backup físico primário de 143/143 arquivos confirmado pelo log local do proprietário** (87 públicos, 56 privados, 0 diferenças com `rclone check --download`, 15.946.053 bytes; manifesto SHA-256 gerado segundo a saída do script). **Cópia externa no Google Drive confirmada em 19/11/2026 por inventário e tamanho** (87 públicos + 56 privados = 143 arquivos, 15.946.053 bytes, pastas privadas com permissão somente do proprietário). **Comparação criptográfica por arquivo, conferência independente do manifesto e restauração isolada ainda não confirmadas**. [Guia de backup](05-operacao/BACKUP_E_RECUPERACAO.md). A fotografia anterior do mesmo dia era 87 mídias/140 objetos, sem equivaler ao inventário atual. [Contrato de mídia](03-cms/MIDIAS_E_STORAGE.md) · [Contrato CMS](03-cms/GUIA_ADMINISTRATIVO.md).


**PDF Desktop e Mobile concluídos por aceite visual do proprietário** após inspeção das exportações reais. Código funcional [`609218b`](https://github.com/tuliust/PortfolioTulius/commit/609218bd2bfede558f22c44002e62e9e21b2aada); [Validate SUCCESS](https://github.com/tuliust/PortfolioTulius/actions/runs/44250702060), [QA PDF SUCCESS (6/6 visual, 9/9 físico, 2/2 CSS)](https://github.com/tuliust/PortfolioTulius/actions/runs/44250701938), [P5 read-only SUCCESS no segundo attempt](https://github.com/tuliust/PortfolioTulius/actions/runs/44250702020); Vercel funcional READY no mesmo SHA. [**Contrato vigente de exportação e aceite**](05-operacao/EXPORTACAO_PDF.md).

**Supabase relido em produção (somente leitura):** `portfolio` ACTIVE_HEALTHY, 22 tabelas públicas com RLS/41 políticas, 14 seções (13 publicadas e visíveis), 42 painéis, 28 blocos, 56 placements, **90 mídias publicadas**, **4 projetos normalizados publicados/realizados**, 12 migrations. O Storage contém **87 objetos públicos e 56 privados**,
totalizando **143 objetos**. A revisão de PDF não alterou o banco. O risco de LCP Mobile permanece em [standby](06-governanca/BACKLOG_STANDBY.md), aceito e não corrigido.

**Inventário vigente de CI — 18/11/2026:** a pasta
`.github/workflows/` contém **sete workflows executáveis**:
`audit-p3-lighthouse.yml`, `export-docs-snapshot.yml`,
`hygiene-audit.yml`, `p5-admin-readonly.yml`,
`p5-local-transactional.yml`, `pdf-export-visual.yml`
e `validate.yml`. Os cinco workflows legados
continuam arquivados. A referência histórica de seis
workflows descreve o estado de 11/11/2026 e não
representa o inventário atual.

**Organização:** o novo guia de PDF está na pasta operacional `docs/05-operacao/`. O índice canônico abaixo continua por assunto. Os relatórios antigos preservam seu contexto histórico em `docs/historico/`; nenhum deles deve ser excluído ou tratado como contrato vigente. As cinco fontes privadas do Projeto ChatGPT devem ser substituídas manualmente por snapshots atualizados, sem copiá-las para o GitHub.

---

## Resultado mais recente do ciclo editorial — 16/11/2026

No SHA [`8ed19b0`](https://github.com/tuliust/PortfolioTulius/commit/8ed19b098349e882f7c7dbb9b926114b6451e17e), [P3 #43846278955](https://github.com/tuliust/PortfolioTulius/actions/runs/43846278955) confirmou **navegador/responsividade PASS (0 falhas)** após corrigir as duas assertivas obsoletas de quatro para **cinco projetos**, e **38 capturas PASS**, projeto ↔ galeria, troca Trajetória/Projetos, rotas admin anônimas, SEO, RLS e tolerância parcial de leitura pública. O marcador `P3_DEPLOYMENT_GATE` confirmou o SHA servido em produção. Entretanto, **P3 global = FAILURE exclusivamente no orçamento mobile**: LCP mediano **3.649,202 ms** (meta **≤3.500 ms**); desktop **895,144 ms** (PASS). [Validate #43846279093](https://github.com/tuliust/PortfolioTulius/actions/runs/43846279093) e [Export Docs #43846279061](https://github.com/tuliust/PortfolioTulius/actions/runs/43846279061) foram **SUCCESS**; Vercel production `dpl_9Ti9ghY6ZC6tJ2DbCmT6Wg9L8XUm` estava **READY**. O proprietário **encerrou a revisão editorial** e aceitou o risco residual, sem considerar o LCP corrigido nem reclassificar o workflow como SUCCESS. Não houve mudança de Hero, Olá, conteúdo público ou banco nesta correção de teste.

Os parágrafos de 16/11 que citam `9915964`, `aeffc5f` ou `ad5863c` são marcos datados e não devem ser lidos como o SHA funcional ou de produção mais recente. O teste autenticado completo do CMS não foi executado nesta rodada.

**ÍNDICE CANÔNICO | Revisão 16/11/2026 | revisão editorial encerrada por aceite do proprietário.** Código funcional [`aeffc5f`](https://github.com/tuliust/PortfolioTulius/commit/aeffc5feabc7dfeab426046eb9748e5b8ef81c45), Validate **SUCCESS**; [P3 #43842659962](https://github.com/tuliust/PortfolioTulius/actions/runs/43842659962) **FAILURE** por duas assertivas obsoletas de quatro projetos (agora cinco) e LCP mobile de 3.609,314 ms. Commit documental pré-encerramento [`ad5863c`](https://github.com/tuliust/PortfolioTulius/commit/ad5863c0dbb1386d41482a6d9bbe9dc9a9ba60fc). Baseline `0627947` (11/11) permanece histórica; conferir sempre a `main` atual.

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


## Ciclo de manutenção — seção 03, 16/11/2026

**Implementado:** 20 indicadores em `resultados`/bloco A, quatro para cada uma das cinco categorias em `resultados`/bloco B; quatro indicadores também selecionados para a visão geral. A categoria Comunicação Corporativa usa “Estratégia e Reputação” e “Comunicação que conecta”. A exibição temática é compacta e os textos editoriais anteriores foram preservados no CMS. [Contrato dos campos](03-cms/MODELO_DE_DADOS.md) · [Operação no editor](03-cms/GUIA_ADMINISTRATIVO.md) · [Acessibilidade](02-design/RESPONSIVIDADE_E_ACESSIBILIDADE.md).

**Homologação por SHA:** [`2b573ca` / P3 #43815314121](https://github.com/tuliust/PortfolioTulius/actions/runs/43815314121) **SUCCESS**, LCP mobile **3.261,879 ms**; [`652dea0` / P3 #43816204987](https://github.com/tuliust/PortfolioTulius/actions/runs/43816204987) **FAILURE**, LCP mobile **3.746,315 ms**; [`9915964` / P3 #43817188772](https://github.com/tuliust/PortfolioTulius/actions/runs/43817188772) **SUCCESS**, LCP mobile **3.458,135 ms**. O teste responsivo validou cinco categorias com quatro cards, sem transbordamento, e o SHA final foi confirmado em produção. A variabilidade do LCP permanece sob risco conhecido, sem converter falhas históricas em PASS. [Evidências detalhadas](05-operacao/TESTES_E_HOMOLOGACAO.md).

**Limite editorial:** os indicadores são dados publicados no CMS, não prova documental independente de cada número. A revisão autorizada das seis Experiências foi aplicada ao Supabase e ao renderer no ciclo posterior de 16/11 (cinco projetos visíveis por empresa, abertura + bullets de Trajetória e histórico preservado). As cinco fontes privadas do Projeto ChatGPT são snapshots externos e **não são atualizadas automaticamente** por este Git. Não reabrir o [standby](06-governanca/BACKLOG_STANDBY.md).

## Encerramento da revisão de Experiências — 16/11/2026

O proprietário confirmou o **aceite editorial e o encerramento de escopo**, sem reclassificar falhas históricas de CI. O Supabase foi relido: 20 indicadores, 5 categorias, 30 projetos visíveis nas seis empresas e três projetos normalizados com `project_status=realizado`; o conteúdo histórico foi preservado. As métricas de imprensa agora incluem mailing pessoal `400+` e `32 influenciadores`.

A auditoria P3 do código funcional identificou duas expectativas obsoletas de **quatro** projetos na Invest RS, que foram alinhadas ao padrão aprovado de **cinco** em `scripts/p3-browser-smoke.mjs`. O LCP mobile mediano **3.609,314 ms** no P3 da revisão excedeu o orçamento **3.500 ms**. O resultado daquele run continua **FAILURE**; o risco foi aceito sem alteração de Hero/Olá nem relaxamento do orçamento. [Estado atual](01-projeto/ESTADO_ATUAL.md) · [Testes](05-operacao/TESTES_E_HOMOLOGACAO.md) · [Decisões](06-governanca/DECISOES_VIGENTES.md).

## Histórico organizado e fases

[Baseline pré-consolidação](historico/preconsolidacao-2026-11-11/ESTADO_PRE_CONSOLIDACAO.md) e [CSV de 384 hashes Git](historico/preconsolidacao-2026-11-11/ARQUIVOS_GIT_PRE_CONSOLIDACAO.csv). [Arquivo histórico organizado](historico/README.md), [origem Figma Make arquivada](historico/figma-make-2026-11-11/README.md), [estilos/visual](baselines/2026-11-07/REFERENCIAS_VISUAIS.md), [evidência sanitizada](evidence/p2-backup-counts-2026-11-10.json).

**Etapa 02:** contratos e índice concluídos. **Etapa 03 (11/11/2026):** [84 documentos legados arquivados](historico/legado-ate-2026-11-11/INDEX.md), mantendo stubs em seus caminhos anteriores e preservando blobs originais. [Cinco workflows obsoletos retirados e preservados](historico/workflows-retirados-2026-11-11/README.md); seis workflows operacionais permanecem. **Branches antigas excluídas pelo proprietário**, com ausência conferida no GitHub. **Etapa 04:** cinco Fontes privadas já anexadas ao projeto ChatGPT, com as oito originais retiradas das Fontes ativas. **Etapa 05:** auditoria de encerramento e registro dos resultados em [termo final](06-governanca/ENCERRAMENTO_CONSOLIDACAO_2026-11-11.md). Os riscos técnicos continuam em standby.

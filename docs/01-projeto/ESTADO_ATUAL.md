# Estado atual — PortfolioTulius
**Status:** produto finalizado, com manutenção autorizada concluída na seção 03 e riscos residuais documentados. **Última verificação funcional:** 16/11/2026, SHA [`9915964`](https://github.com/tuliust/PortfolioTulius/commit/9915964f54a37d209b25c778c6d2c50faddf4f77). A baseline [`0627947`](https://github.com/tuliust/PortfolioTulius/commit/0627947897f04635a1dfe720e4d771cf12e3e705) é registro histórico de 11/11, não a versão atual.

## Estado operacional verificado em 16/11/2026

- **GitHub:** [`tuliust/PortfolioTulius`](https://github.com/tuliust/PortfolioTulius), apenas a branch `main` listada na consulta de 16/11. As duas branches `fix/*` foram excluídas anteriormente; o inventário de 384 arquivos pertence à fotografia pré-consolidação de 11/11.
- **Produção e CI:** [P3 #43817188772](https://github.com/tuliust/PortfolioTulius/actions/runs/43817188772) confirmou o SHA `9915964` servido por `https://tulius.work/`, com **SUCCESS**; [Validate #43817188756](https://github.com/tuliust/PortfolioTulius/actions/runs/43817188756) e [Export Docs #43817188776](https://github.com/tuliust/PortfolioTulius/actions/runs/43817188776) **SUCCESS**. Isso comprova o SHA no domínio e os gates executados, não uma nova consulta administrativa `READY` à API da Vercel.
- **Performance:** mediana LCP mobile de **3.458,135 ms** em três Lighthouse (meta ≤3.500 ms); desktop **887,824 ms**. A P3 anterior de `652dea0` foi **FAILURE** em mobile (**3.746,315 ms**). Variabilidade de laboratório permanece, sem reabrir automaticamente o standby.
- **Resultados:** a leitura de produção confirmou dois blocos publicados, A com **20 indicadores** (quatro por cada uma das cinco categorias, quatro `showInOverview=true`) e B com **cinco categorias** `themePresentation="metrics"`. `corporativa` usa “Estratégia e Reputação” / “Comunicação que conecta”. Não houve migration, modificação de RLS ou Storage nesta atualização editorial.
- **Experiências Profissionais:** seis registros publicados permanecem na coleção estruturada, com descrições anteriores aos relatos adicionais deste chat. A conciliação detalhada de números, contextos e comprovações é **revisão editorial pendente**, não atualização executada na coleção.
- **Admin:** novos campos e seleção dos indicadores implementados; P5 read-only e transacional sintético tiveram **SUCCESS** no SHA intermediário `cb953dad`. Não há comprovação específica de novo ciclo completo de gravação autenticada do admin no SHA `9915964`.

## Serviços e inventário — fotografia de 11/11/2026
| Fonte | Estado verificado |
|---|---|
| Site | [tulius.work](https://tulius.work/), identidade visual aprovada |
| GitHub | `main` e duas branches históricas **à época do inventário**; 384 arquivos pré-consolidação. **Atualmente somente `main`** (ver acima) |
| Vercel | projeto `portfolio-tulius`; deployment baseline `dpl_JAMsVoXAsrQHAAzDE7aEKjt6rY5E` READY |
| Supabase | `portfolio` / `zfnrhzplwpjpdljraypt`, PostgreSQL 17, ACTIVE_HEALTHY |
| Banco | 12 migrations, 22 tabelas públicas com RLS, 41 policies |
| Conteúdo | 14 seções (13 publicadas e visíveis), 42 painéis, 28 blocos, 56 placements |
| Mídia | 75 registros, 128 objetos Storage (72 público + 56 privado) |
| P2 | RPC `save_section_block_atomic` presente, com timestamps nos 56 placements |
| Crédito | Coluna `media_assets.credit` já removida |

## Verificações por SHA
Para `0627947`: [Validate #43091103353](https://github.com/tuliustsangaropulos/PortfolioTulius/actions/runs/43091103353), [P5 Admin #43091105469](https://github.com/tuliustsangaropulos/PortfolioTulius/actions/runs/43091105469), [P5 Local #43091105553](https://github.com/tuliustsangaropulos/PortfolioTulius/actions/runs/43091105553) e [Export #43091105486](https://github.com/tuliustsangaropulos/PortfolioTulius/actions/runs/43091105486) **SUCCESS**. [P3 Lighthouse #43091103365](https://github.com/tuliustsangaropulos/PortfolioTulius/actions/runs/43091103365) **FAILURE** por LCP mobile: mediana **3.627,065 ms**, orçamento **≤3.500 ms**. Desktop mediano 893,194 ms, demais controles públicos aprovados. O risco foi aceito para encerramento, sem converter o gate em PASS.

## Recuperação e limites
Registros de 11/11 documentam restore PostgreSQL 17.6 isolado (25 tabelas e 39 FKs), backup físico Storage (128/128, 4.661.351 bytes) e rollback local de P2/crédito. **Bytes privados e manifesto não foram reinspecionados nesta consolidação.** A baseline `202610220001` foi reconciliada no ledger, sem reexecutar DDL. Advisors conhecidos: 7 warnings de funções `SECURITY DEFINER`, 1 proteção de senhas, 8 índices sem uso, 19 políticas permissivas, 0 health.

O produto está encerrado; melhorias técnicas permanecem [em standby](../06-governanca/BACKLOG_STANDBY.md). A cada futura verificação, registrar data, SHA, ambiente e evidência.

## Atualização posterior à baseline — ciclo de 12/11/2026

**Referência de código e documentação consultada:** `main` no commit documental [`0926e6a`](https://github.com/tuliustsangaropulos/PortfolioTulius/commit/0926e6afe6068db5b8addacfe805f413bf534a9b), após as implementações funcionais mobile [`e24e91f`](https://github.com/tuliustsangaropulos/PortfolioTulius/commit/e24e91f05eae47ae34f12803a8d90777e96895b2) e desktop [`ebda0aa`](https://github.com/tuliustsangaropulos/PortfolioTulius/commit/ebda0aabda776a8513cad963df184199ed0a6e53). O inventário acima é **snapshot histórico de 11/11**, não contagem refeita nesta leitura. O [índice canônico](../README.md#registro-consolidado-do-ciclo-de-ajustes--12112026) relaciona todas as mudanças de UI, SEO, CMS, identidade e dados.

- **Supabase produção reconsultado em 12/11:** `design_tokens.color.lightGray` publicado como **Cinza claro `#ECECEC`**; `perfil` bloco A tem `hero.mobileEditorial.middle.background='color.lightGray'`, `top.paddingY=18` e `bottom.paddingY=0`. Campos de Perfil/Formação desktop foram documentados nos guias canônicos e tiveram escrita/relitura em ciclo anterior. Não houve nova mudança de schema, RLS ou Storage nesta consolidação.
- **Validação do ciclo mobile:** [Validate #43168149601](https://github.com/tuliustsangaropulos/PortfolioTulius/actions/runs/43168149601) e [P3 #43168149664](https://github.com/tuliustsangaropulos/PortfolioTulius/actions/runs/43168149664) **SUCCESS** no SHA `e24e91f`, incluindo LCP mobile 3.466,042 ms, seis tamanhos de tela e 38 capturas sem falhas.
- **Validação do ciclo desktop mais recente:** [Validate #43197029438](https://github.com/tuliustsangaropulos/PortfolioTulius/actions/runs/43197029438) e [P5 read-only #43197029455](https://github.com/tuliustsangaropulos/PortfolioTulius/actions/runs/43197029455) **SUCCESS** no SHA `ebda0aa`; [P3 #43197029431](https://github.com/tuliustsangaropulos/PortfolioTulius/actions/runs/43197029431) **FAILURE** somente no orçamento LCP mobile (3.670,965 ms, limite 3.500 ms). Auditoria responsiva e 38 capturas sem falhas; LCP desktop aprovado. A falha deve permanecer explícita, sem intervenção automática.
- **Documentação:** [Validate #43198028076](https://github.com/tuliustsangaropulos/PortfolioTulius/actions/runs/43198028076) e [Export #43198028034](https://github.com/tuliustsangaropulos/PortfolioTulius/actions/runs/43198028034) **SUCCESS** para `0926e6a`. A leitura administrativa **sem escrita** foi homologada no ciclo desktop; não equivale a um teste autorizado de mudança produtiva da paleta pela interface.
- **Publicação:** o gate `P3_DEPLOYMENT_GATE` verificou o domínio público para o SHA funcional `ebda0aa`. Uma consulta direta posterior ao recurso Vercel pelo conector retornou 404 (projeto não localizado nesse escopo), portanto **nenhum status READY novo é afirmado nesta consolidação**.

**Pendências observacionais:** inspeção final de detalhes visuais no Safari físico, teste autenticado da troca de cor pelo editor numa futura operação autorizada e acompanhamento da oscilação de LCP mobile. Manter o backlog em standby sem reabertura por inferência.

### Valores desktop efetivamente relidos no Supabase (12/11/2026)

Os quatro blocos publicados alterados no ciclo desktop foram confirmados por consulta somente leitura: `perfil`/A com frase **24 px** e quatro destaques (títulos **17 px**, textos **16 px**, espaçamento **2 px**); `perfil`/B com seis títulos de empresas **23 px**; `formacao`/bloco 1 com três cursos **30 px** e bloco 2 com duas instituições **29 px**. Esses valores pertencem ao `content_json` existente e não modificam as composições `mobile`. Os ajustes de Resultados (gaps iguais), seta (centro da tela), selo/anos (sem sobreposição em desktop baixo) e foto de Sobre (encaixe visual inferior) são do renderer/CSS. Para futura edição, consultar [CMS](../03-cms/GUIA_ADMINISTRATIVO.md), [modelo](../03-cms/MODELO_DE_DADOS.md) e [homologação](../05-operacao/TESTES_E_HOMOLOGACAO.md). A edição inicial foi por SQL restrito, **não** por teste autenticado de salvamento na UI.

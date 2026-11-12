# Estado atual — PortfolioTulius
**Status:** produto finalizado, com exceções técnicas aceitas. **Data da verificação:** 11/11/2026. **Baseline funcional/documental auditado:** [`0627947`](https://github.com/tuliustsangaropulos/PortfolioTulius/commit/0627947897f04635a1dfe720e4d771cf12e3e705). Não pressupor que é o último SHA da `main`.

## Serviços e inventário
| Fonte | Estado verificado |
|---|---|
| Site | [tulius.work](https://tulius.work/), identidade visual aprovada |
| GitHub | `main`; duas branches históricas; 384 arquivos pré-consolidação |
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

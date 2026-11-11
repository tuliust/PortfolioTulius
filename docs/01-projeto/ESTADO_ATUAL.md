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

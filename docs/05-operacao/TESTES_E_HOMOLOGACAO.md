# Testes, CI e homologação
**Status:** roteiro de manutenção · **Revisão:** 11/11/2026.

## Desenvolvimento local
`pnpm install --frozen-lockfile`; `pnpm format:check`; `pnpm typecheck`; `pnpm test`; `pnpm build`; `pnpm check`; `pnpm smoke:build`. O [`package.json`](../../package.json) é fonte dos comandos. Não usar formatador que reescreva código para uma tarefa só documental.

## Seis workflows operacionais e cinco arquivados

Os seis primeiros seguem em `.github/workflows/`. Os cinco seguintes foram **retirados da execução em 11/11/2026** e apontam para cópias históricas (não são acionáveis no GitHub Actions). [Registro de retirada](../historico/workflows-retirados-2026-11-11/README.md).
| Workflow | Papel |
|---|---|
| [`validate.yml`](../../.github/workflows/validate.yml) | Format, TS, testes, build e smoke |
| [`audit-p3-lighthouse.yml`](../../.github/workflows/audit-p3-lighthouse.yml) | Browser, capturas, SEO, RLS e Lighthouse |
| [`p5-admin-readonly.yml`](../../.github/workflows/p5-admin-readonly.yml) | Login CMS sem escrever dados reais |
| [`p5-local-transactional.yml`](../../.github/workflows/p5-local-transactional.yml) | Auth/RPC/Storage sintéticos isolados |
| [`hygiene-audit.yml`](../../.github/workflows/hygiene-audit.yml) | Verificações offline |
| [`export-docs-snapshot.yml`](../../.github/workflows/export-docs-snapshot.yml) | Exportar documentos |
| [`p1-p3-isolated-preview.yml`](../historico/workflows-retirados-2026-11-11/p1-p3-isolated-preview.yml) | Prévia/editorial isolada |
| [`p2-transactional-staging.yml`](../historico/workflows-retirados-2026-11-11/p2-transactional-staging.yml) | Staging cloud manual antigo, não executar por inferência |
| [`publish-experience-media-once.yml`](../historico/workflows-retirados-2026-11-11/publish-experience-media-once.yml) | Publicação pontual com escrita |
| [`cdi-slide-remove-text.yml`](../historico/workflows-retirados-2026-11-11/cdi-slide-remove-text.yml) | Correção pontual de mídias |
| [`generate-approved-hero.yml`](../historico/workflows-retirados-2026-11-11/generate-approved-hero.yml) | Geração de assets |

**Baseline `0627947`:** [Validate #43091103353](https://github.com/tuliustsangaropulos/PortfolioTulius/actions/runs/43091103353), [P5 Admin #43091105469](https://github.com/tuliustsangaropulos/PortfolioTulius/actions/runs/43091105469), [P5 Local #43091105553](https://github.com/tuliustsangaropulos/PortfolioTulius/actions/runs/43091105553), [Export #43091105486](https://github.com/tuliustsangaropulos/PortfolioTulius/actions/runs/43091105486) SUCCESS. [P3 #43091103365](https://github.com/tuliustsangaropulos/PortfolioTulius/actions/runs/43091103365) FAILURE apenas no LCP mobile (mediana **3.627,065 ms** contra 3.500), desktop 893,194 ms, demais checks PASS. Risco aceito sem relaxar o gate.

## Após mudança futura
Testar desktop/mobile/teclado/zoom; CMS `editar → salvar → reler → DB → renderer` em ambiente local sintético; autorização de não admin; Storage/alt; SEO em novo build. Registrar SHA, ambiente, método e resultado real. Resultados de outro commit não contam.

[Estado](../01-projeto/ESTADO_ATUAL.md) · [backups](BACKUP_E_RECUPERACAO.md).

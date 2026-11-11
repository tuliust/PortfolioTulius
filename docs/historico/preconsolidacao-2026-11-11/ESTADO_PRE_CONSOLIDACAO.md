# Baseline pré-consolidação documental — PortfolioTulius

> **FOTOGRAFIA HISTÓRICA IMUTÁVEL DO ESTADO ANTES DA ETAPA 01.** Data de captura: 2026-11-11. Esta página é uma prova de inventário, **não** um contrato operacional vigente nem uma instrução para modificar infraestrutura. Qualquer commit posterior não altera o conteúdo do Git no commit-base registrado abaixo.

## Identificação e limites

- Repositório: [tuliustsangaropulos/PortfolioTulius](https://github.com/tuliustsangaropulos/PortfolioTulius), visibilidade **pública**.
- Branch padrão: `main`, commit pré-consolidação **[`0627947897f04635a1dfe720e4d771cf12e3e705`](https://github.com/tuliustsangaropulos/PortfolioTulius/tree/0627947897f04635a1dfe720e4d771cf12e3e705)**.
- Tree Git efetiva do commit-base: `eac00dc3f9913134e6147e29e1ae69effde450a6` (captura recursiva completa, `truncated=false`).
- Inventário exato: [CSV de arquivos com SHA de blob](ARQUIVOS_GIT_PRE_CONSOLIDACAO.csv). Cada linha guarda caminho, modo, SHA do blob e tamanho; o commit-base preserva os bytes no histórico Git. Este documento **não constitui exportação binária independente de todo o repositório**.
- 416 entradas Git (384 arquivos e 32 diretórios); 107 arquivos Markdown, 102 sob `docs/`, 16 sob `docs/historico/`.
- 11 workflows versionados em `.github/workflows/`.
- Projeto ChatGPT: **8 arquivos Markdown privados originais preservados separadamente** em ZIP com manifesto SHA-256, fora deste repositório público. Nunca publicar essas Fontes privadas aqui.
- Estado original antes de consolidar: **nenhum documento original movido, nenhuma branch apagada, nenhuma política/variável/linha de banco alterada** nesta etapa.

## Referências de branch no momento da captura

| Branch | Commit original | Protegida? |
|---|---|---|
| `fix/header-hero-section-navigation-20261025` | [`c5d17f4ee904`](https://github.com/tuliustsangaropulos/PortfolioTulius/commit/c5d17f4ee9041ae59f03691585a1ea60b1c06d9f) | Não |
| `fix/p3-motion-units-20261024` | [`909badf42a95`](https://github.com/tuliustsangaropulos/PortfolioTulius/commit/909badf42a95d2a4a84bdb77a0129811c9e952db) | Não |
| `main` | [`0627947897f0`](https://github.com/tuliustsangaropulos/PortfolioTulius/commit/0627947897f04635a1dfe720e4d771cf12e3e705) | Não |

- Rulesets identificados: 0. A `main` estava sem proteção na captura.
- A branch `fix/p3-motion-units-20261024` era ancestral da `main`, sem commits exclusivos; `fix/header-hero-section-navigation-20261025` divergia com quatro commits exclusivos. Nenhuma exclusão nesta etapa.
- [Revisão histórica das branches](../../P1_INVESTIGACAO_HIGIENE_2026-10-28.md) documenta os quatro commits exclusivos e seus impactos.

## CI associado ao commit original

| Workflow | Conclusão | Evidência |
|---|---|---|
| P5 Local Transactional Homologation | success | [#43091105553](https://github.com/tuliustsangaropulos/PortfolioTulius/actions/runs/43091105553) |
| Export PortfolioTulius Documentation | success | [#43091105486](https://github.com/tuliustsangaropulos/PortfolioTulius/actions/runs/43091105486) |
| P5 Admin Read-Only E2E | success | [#43091105469](https://github.com/tuliustsangaropulos/PortfolioTulius/actions/runs/43091105469) |
| Audit P3 Lighthouse | failure | [#43091103365](https://github.com/tuliustsangaropulos/PortfolioTulius/actions/runs/43091103365) |
| Validate PortfolioTulius | success | [#43091103353](https://github.com/tuliustsangaropulos/PortfolioTulius/actions/runs/43091103353) |

**Não confundir site publicado/CI do commit-base com commits posteriores exclusivamente documentais.** A mediana LCP mobile na última P3 `#43091103365` foi 3627,065 ms; o gate de 3500 ms falhou, com risco aceito no encerramento, não transformado em PASS.

## Serviços: referência de configuração (somente leitura)

### Vercel

- Equipe: `tuliustsangaropulos-creates-projects`; projeto `portfolio-tulius`; ID `prj_FVB5Cnk3428OSrWhEyskoqhWOCVW`.
- Framework `vite`; `vercel.json` fixa `pnpm build`, saída `dist`, SPA rewrite e cabeçalhos de cache/noindex.
- Domínios: `tulius.work` e `www.tulius.work` (o primeiro foi confirmado como verificado).
- Deployment PRODUTIVO da fotografia: `dpl_JAMsVoXAsrQHAAzDE7aEKjt6rY5E`, estado `READY`, SHA `0627947897f04635a1dfe720e4d771cf12e3e705`.
- Variáveis de ambiente **somente nomes, sem valores**: `VITE_SUPABASE_URL`, `VITE_SUPABASE_PUBLISHABLE_KEY` — nos destinos Development/Preview/Production, com valores criptografados.

### Supabase

- Projeto `portfolio`, ref `zfnrhzplwpjpdljraypt`, região `us-east-1`, estado `ACTIVE_HEALTHY`, PostgreSQL 17.
- 12 versões de migration registradas; 22 tabelas públicas com RLS habilitado; 41 políticas públicas; 14 seções (13 publicadas e visíveis), 28 blocos, 56 placements, 75 registros de mídia.
- Buckets: `portfolio-public` (público, 72 objetos); `portfolio-private` (privado, 56 objetos), 128 objetos indexados ao todo.
- Edge Function `portfolio-illustrative-import-20261026` implantada, `ACTIVE`, versão 2. Não remover sem verificação de dependências.
- Sem branches Supabase de desenvolvimento identificadas.
- Alertas existentes: Security Advisor 7 `authenticated_security_definer_function_executable` e 1 `auth_leaked_password_protection`; Performance Advisor 8 `unused_index` e 19 `multiple_permissive_policies`; Health Advisor 0. Registrar como histórico/standby, não alterar produção.
- A versão de baseline `202610220001` está registrada com zero statements no ledger; **não aplicar novamente SQL de baseline** por inferência.

## Workflows existentes ao congelar o estado

- `.github/workflows/audit-p3-lighthouse.yml`
- `.github/workflows/cdi-slide-remove-text.yml`
- `.github/workflows/export-docs-snapshot.yml`
- `.github/workflows/generate-approved-hero.yml`
- `.github/workflows/hygiene-audit.yml`
- `.github/workflows/p1-p3-isolated-preview.yml`
- `.github/workflows/p2-transactional-staging.yml`
- `.github/workflows/p5-admin-readonly.yml`
- `.github/workflows/p5-local-transactional.yml`
- `.github/workflows/publish-experience-media-once.yml`
- `.github/workflows/validate.yml`

**Atenção:** alguns workflows são executáveis manualmente e podem gravar conteúdo ou gerar assets. Este inventário não concede autorização de executá-los. Preservar configurações de segurança, papéis, RLS, Storage, Auth, tokens e configurações Vercel.

## Reconstituição da fotografia

1. Abrir o commit `0627947897f04635a1dfe720e4d771cf12e3e705` pelo link acima; não assumir que a `main` futura corresponde a esse estado.
2. Usar o CSV para verificar a existência e o SHA Git de cada um dos 384 arquivos do baseline.
3. Consultar as evidências de execução por SHA e os registros de migrations; os contadores Supabase/Vercel são uma fotografia temporal, não backup de dados ou infraestrutura.
4. Para recuperar fontes privadas do ChatGPT, utilizar o ZIP local separado, preservado fora do repositório público.
5. Não copiar segredos reais, tokens, chaves privadas, valores de env ou mídia privada para este documento.

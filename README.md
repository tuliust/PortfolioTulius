# PortfolioTulius — portfólio editorial e CMS

Site público de comunicação, relações públicas, estratégia e projetos de Tulius Tsangaropulos, publicado em [tulius.work](https://tulius.work/). Stack: **React 19, TypeScript, Vite, Supabase e Vercel**.

> **Preservação obrigatória:** a **exibição atual do site está correta**. A reorganização documental de 05/11/2026 **não modifica** código público, CSS, retratos, mídia, conteúdo editorial, Supabase ou configurações de deploy. O conteúdo anterior deste README foi [arquivado integralmente](docs/historico/README_ANTES_REORGANIZACAO_2026-11-05.md).

## Estado verificado — 05/11/2026

| Tipo de evidência | Estado |
|---|---|
| **Baseline funcional** | [`79aa3c07`](https://github.com/tuliustsangaropulos/PortfolioTulius/commit/79aa3c07ce6c9106b1d504c1f574731bf70fb5d2), último commit **de aplicação** antes da revisão documental |
| **CI Validate** | [`#42020574434`](https://github.com/tuliustsangaropulos/PortfolioTulius/actions/runs/42020574434) — **success** em formatação, TypeScript, testes, build e smoke |
| **Vercel / domínio** | Produção **READY**, com `tulius.work/p3-deployment.json` servindo o SHA funcional `79aa3c07` na consulta desta auditoria |
| **P3 Lighthouse** | [`#42020342275`](https://github.com/tuliustsangaropulos/PortfolioTulius/actions/runs/42020342275), SHA anterior `0873eeff` — **failure global**; 7 falhas de navegador, LCP mobile mediano 3,537 s para meta ≤3,5 s |
| **Aceite transacional** | Salvar/ler de volta Trajetória, upload e exclusão com sessão administrativa real **não homologados nesta rodada** |

**CI aprovado não equivale a P3 aprovada, nem a teste real do CMS.** Não foi localizada uma P3 própria do SHA `79aa3c07`. Este README é um **snapshot datado**, não uma consulta automática do status ao vivo. Commits de documentação posteriores terão SHA diferente sem introduzir mudança funcional.

## Leitura prioritária

- [Índice técnico](docs/README.md) — entrada organizada para todos os contratos atuais.
- [Estado operacional vigente](docs/ESTADO_ATUAL_VIGENTE.md) — fonte principal de evidências e limites do baseline.
- [CMS administrativo](docs/ADMIN_CMS.md) e [layout responsivo](docs/RESPONSIVE_LAYOUT.md) — interface e experiência atual a preservar.
- [Verificações técnicas](docs/OPEN_ISSUES.md) — tarefas de homologação, sem reabrir automaticamente o encerramento.
- [Regras de trabalho](AGENTS.md), [deploy e SEO](docs/DEPLOYMENT.md), [arquivo histórico](docs/historico/README.md).
- [Aceite administrativo de 05/11](docs/ENCERRAMENTO_OPERACIONAL_2026-11-05.md) — decisão histórica do proprietário, não substitui testes técnicos futuros.

## Estrutura da aplicação

- `src/components/public/`: renderização pública, menu, experiências e seções.
- `src/components/admin/`: CMS, mídia, prévia e áreas administrativas.
- `src/hooks/usePortfolio.ts`: leitura/composição de conteúdo do Supabase.
- `src/content/defaultTokens.ts` e `src/content/fallback.ts`: tokens e fallback de desenvolvimento/offline.
- `src/index.css`: estilos responsivos e identidade visual.
- `supabase/`: migrations e testes; **não aplicar automaticamente** em produção.
- `scripts/`: smoke, SEO no build e auditorias; `docs/`: contratos atuais e arquivo cronológico.

## Desenvolvimento e validação

Requisitos: Node.js compatível com Vite e `pnpm`. Instalar com `pnpm install --frozen-lockfile`, configurar apenas variáveis **públicas** indicadas em `.env.example` (sem versionar `.env.local`) e executar `pnpm dev`.

Antes de integrar código, utilizar `pnpm check` ou os comandos `pnpm format:check`, `pnpm typecheck`, `pnpm test` e `pnpm build`. Não afirmar que esses comandos foram rodados localmente nesta reorganização; as evidências são dos workflows citados.

## Publicação e segurança

A Vercel integra a branch `main`. Confirmar **separadamente** SHA do commit, CI, deployment READY e versão efetivamente servida. Alterações nos dados de SEO do CMS chegam ao HTML estático (título, OG, canonical, sitemap) **no próximo build**. Canonical confirmado: **https://tulius.work/**.

Staging escolhido: **Supabase CLI + Docker local com seed sintética**, não projeto cloud adicional. Não aplicar migrations nem testar exclusões reais só para validar documentação. [Procedimento seguro](docs/SUPABASE_STAGING_LOCAL_ISOLADO_2026-11-02.md) e [meta LCP mobile ≤3,5 s](docs/DECISOES_LCP_3_5_STAGING_LOCAL_2026-11-02.md).

Para a cronologia completa, usar o [README pré-reorganização](docs/historico/README_ANTES_REORGANIZACAO_2026-11-05.md) e os [demais snapshots](docs/historico/README.md).


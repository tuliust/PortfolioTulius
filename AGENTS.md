# PortfolioTulius

Portfólio editorial com CMS, desenvolvido em React 19, TypeScript, Vite, Tailwind CSS v4 e Supabase. O desenvolvimento é feito localmente com Codex/VS Code; a Vercel é o destino de publicação.

## Regras de trabalho

- Preserve integralmente o design, textos, fotografias, cores, fontes, responsividade e componentes existentes, salvo solicitação explícita.
- Faça alterações pequenas e localizadas. Preserve a acessibilidade, os metadados SEO e os fluxos público e administrativo.
- Trabalhe e registre commits exclusivamente na branch `main`; não crie branches de trabalho nem pull requests. Antes de modificar, confira `git status -sb` e sincronize com `git pull --ff-only origin main` quando seguro.
- Atenção: pushes para `main` podem disparar publicação automática na Vercel. Valide as alterações e revise o diff antes do push; não use force-push, reset destrutivo ou operações de infraestrutura para corrigir problemas de código.
- Não altere schema, migrations, dados, políticas ou configuração do projeto Supabase sem solicitação explícita.
- Não altere configurações da Vercel nem faça deploy sem solicitação explícita.
- Nunca leia, exiba, copie ou versione valores reais de `.env.local`, `.env.*` ou tokens. Use `.env.example` apenas para documentar nomes e placeholders.
- Não rode formatadores que reescrevam arquivos ou testes sem solicitação; quando solicitado, prefira os scripts existentes no `package.json`.

## Estrutura

- `src/main.tsx` e `src/App.tsx`: entrada da aplicação.
- `src/app/routes.tsx`: rotas públicas, administrativas e 404.
- `src/components/public/`: site público e navegação.
- `src/components/admin/`: CMS e autenticação administrativa.
- `src/hooks/usePortfolio.ts`: conteúdo, fallback local e metadados SEO.
- `src/content/fallback.ts`: conteúdo editorial local.
- `src/lib/supabase.ts`: cliente Supabase configurado por variáveis de ambiente.
- `src/index.css`: estilos globais, Tailwind CSS v4 e tokens visuais.
- `supabase/`: migrations, seed, funções e roteiro RLS; não aplicar automaticamente.

## Desenvolvimento local

Requer Node.js compatível com Vite e pnpm. Instale com `pnpm install --frozen-lockfile`. Copie `.env.example` para `.env.local` e preencha as variáveis públicas já configuradas para o projeto Supabase existente. Inicie com `pnpm dev`.

Scripts disponíveis: `pnpm format:check`, `pnpm typecheck`, `pnpm test`, `pnpm build` e `pnpm check` (executa as verificações em sequência).

## UI e estilos

Use classes utilitárias Tailwind diretamente no JSX. Mantenha regras base globais dentro de `@layer base` em `src/index.css` para que utilities possam sobrescrevê-las. Preserve as fontes e os tokens visuais existentes. CSS `@import` deve permanecer antes das regras CSS.

## Publicação

A Vercel executa o build Vite (`pnpm build`). As variáveis `VITE_SUPABASE_URL` e `VITE_SUPABASE_PUBLISHABLE_KEY` devem existir no ambiente local e nos ambientes Vercel apropriados. Não incluir chaves `service_role` no frontend. Antes de publicar, revisar o diff, validar SEO/domínio e seguir `docs/DEPLOYMENT.md`; não executar deploy sem pedido explícito.


## Homologação isolada e performance (decisão 02/11/2026)

Para staging, usar **somente Supabase CLI + Docker local**, `supabase/config.toml` com `seed.local.synthetic.sql`, nunca `supabase/seed.sql` ou `supabase link/db push`. O procedimento está em `docs/SUPABASE_STAGING_LOCAL_ISOLADO_2026-11-02.md`. A meta operacional vigente de LCP mobile é **≤3,5 s** (mediana de três Lighthouse), mantendo identidade visual intacta. Este guia não autoriza alterar produção, RLS, Auth ou mídias.

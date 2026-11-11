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

A Vercel executa o build Vite (`pnpm build`). As variáveis `VITE_SUPABASE_URL` e `VITE_SUPABASE_PUBLISHABLE_KEY` devem existir no ambiente local e nos ambientes Vercel apropriados. Não incluir chaves `service_role` no frontend. Antes de publicar, revisar o diff, validar SEO/domínio e seguir `docs/04-infraestrutura/VERCEL_DEPLOY_SEO.md`; não executar deploy sem pedido explícito.


## Homologação isolada e performance (decisão 02/11/2026)

Para staging, usar **somente Supabase CLI + Docker local**, `supabase/config.toml` com `seed.local.synthetic.sql`, nunca `supabase/seed.sql` ou `supabase link/db push`. O procedimento de referência está em `docs/04-infraestrutura/SUPABASE.md` e `docs/05-operacao/BACKUP_E_RECUPERACAO.md`. A meta operacional vigente de LCP mobile é **≤3,5 s** (mediana de três Lighthouse), mantendo identidade visual intacta. Este guia não autoriza alterar produção, RLS, Auth ou mídias.

## Roteamento documental vigente (11/11/2026)

Ler [índice temático](docs/README.md) e o contrato do assunto antes de editar. O [estado consolidado](docs/01-projeto/ESTADO_ATUAL.md), o código `main` e os serviços reais por SHA prevalecem sobre relatórios datados. Itens em [standby](docs/06-governanca/BACKLOG_STANDBY.md) não são ordens automáticas; seguir [guia de IA](docs/06-governanca/GUIA_USO_POR_IA.md). Preservar todas as demais regras de design, branch, segurança, segredos e deploy deste arquivo.


## Arquivo histórico após Etapa 03

Os documentos antigos em `docs/*.md` são **apenas apontadores** para [cópias históricas](docs/historico/legado-ate-2026-11-11/INDEX.md); não devem ser tratados como instrução técnica atual. Os workflows legados foram [arquivados](docs/historico/workflows-retirados-2026-11-11/README.md). O CI ativo permanece em `.github/workflows/`; não reativar tarefas antigas por inferência.

## Documentação obrigatória após modificações

Toda implementação ou alteração **material** efetivamente realizada exige atualizar, na mesma entrega, o(s) guia(s) temático(s) correspondentes, conforme [protocolo permanente de atualização documental](docs/06-governanca/PROTOCOLO_ATUALIZACAO_DOCUMENTAL.md). Não concluir uma tarefa alegando sucesso sem conferir o estado do código/CMS/ambiente e registrar a documentação da mudança; sempre que viável, versionar documentação e código no mesmo commit. Para alterações feitas apenas em serviços externos, registrar o estado validado em commit documental separado. Não modificar relatórios históricos nem publicar fontes privadas.

# Arquitetura do PortfolioTulius
**Status:** referência canônica · **Atualizado:** 11/11/2026. Stack: React 19, TypeScript, Vite, Tailwind CSS v4, Supabase e Vercel.

## Camadas
- [`src/main.tsx`](../../src/main.tsx): carrega o site público; roteador administrativo lazy.
- [`src/app/routes.tsx`](../../src/app/routes.tsx): `/admin/login`, `/admin/*`, `/admin/preview` e 404.
- [`PublicSite.tsx`](../../src/components/public/PublicSite.tsx), [`Navigation.tsx`](../../src/components/public/Navigation.tsx), [`ExperienceStack.tsx`](../../src/components/public/ExperienceStack.tsx): páginas, âncoras e experiência editorial.
- [`AdminApp.tsx`](../../src/components/admin/AdminApp.tsx), [`AdminModules.tsx`](../../src/components/admin/AdminModules.tsx) e editores extraídos: CMS e prévia.
- [`usePortfolio.ts`](../../src/hooks/usePortfolio.ts), [`placements.ts`](../../src/lib/placements.ts), [`media-alt-sync.ts`](../../src/lib/media-alt-sync.ts): consultas, composição, metadados de mídia.
- [`public-read.ts`](../../src/lib/public-read.ts): PostgREST público independente do SDK completo de Auth/Storage.
- [`supabase.ts`](../../src/lib/supabase.ts), [`p2-composite-save.ts`](../../src/lib/p2-composite-save.ts): autenticação, cliente e persistência.
- [`generate-seo.mjs`](../../scripts/generate-seo.mjs), [`vercel.json`](../../vercel.json): SEO de build e deploy.

## Contratos
Leitura pública: PostgREST/RLS → `sections`, `content_blocks`, `section_panels`, `block_placements` e coleções → `usePortfolio` → renderizadores desktop/mobile. `content_json` guarda conteúdo; placements guardam exibição. Não duplicar dados por viewport.

Admin: Auth → vínculo `admin_users`/guarda administrativa → editores → CAS/RPC, revisão e releitura. A RPC composta `save_section_block_atomic` está instalada. SEO estático exige novo build; SQL + Storage não é transação distribuída.

A página inicial não deve carregar antecipadamente o roteador de administração. `src/content/fallback.ts` serve como fallback controlado, não substituto de dados produtivos.

## Proteções
Preservar aparência, conteúdo, fotos, responsividade, A11y, SEO e RLS. Não executar migrations nem reformatar UI sem pedido concreto. [Modelo de dados](../03-cms/MODELO_DE_DADOS.md), [CMS](../03-cms/GUIA_ADMINISTRATIVO.md).

# Contrato CMS → Supabase → renderer
**Status:** referência canônica · **Revisão:** 11/11/2026. Conferir [migrations](../../supabase/migrations/), [tipos](../../src/types/content.ts) e banco real antes de mudar schema.

## Grupos de tabelas públicas (22 com RLS)
| Finalidade | Tabelas |
|---|---|
| Acesso | `admin_users` |
| Página/design | `pages`, `site_settings`, `design_tokens` |
| Composição | `sections`, `section_panels`, `content_blocks`, `block_placements` |
| Menu | `navigation_items` |
| Coleções | `career_experiences`, `portfolio_projects`, `metrics`, `skills`, `education`, `language_levels`, `tool_categories`, `testimonials`, `contact_channels` |
| Mídias | `media_assets` |
| Histórico | `editorial_issues`, `content_revisions`, `audit_logs` |

Snapshot: 14 seções, 42 painéis, 28 blocos, 56 placements, 75 mídias; 13 seções visíveis publicadas.

## Semântica
`sections`: identidade/estado/ordem da seção; `section_panels`: desktop/mobile-a/mobile-b; `content_blocks.content_json`: conteúdo, Hero, imagens e vínculos; `block_placements`: ordem, visibilidade, layout, `style_config`, `motion_config` e `updated_at`. Não migrar blocos manuais para coleções sem decisão editorial.

[`usePortfolio.ts`](../../src/hooks/usePortfolio.ts) + [`placements.ts`](../../src/lib/placements.ts) compõem o site. `media_assets.alt_text` é fonte canônica de alt para mídias reconhecidas; `focal_point` global só atua na ausência de override local de enquadramento (ver [`media-alt-sync.ts`](../../src/lib/media-alt-sync.ts)). `career_experiences` alimenta Trajetória e `testimonials`, Depoimentos. `pages`/`site_settings` alimentam SEO após build.

## Fonte única do selo mobile (11/11/2026)

`content_blocks.content_json.items[0].hero.mobileEditorial.middle` pertence ao bloco A da seção `perfil`. O renderer mobile reaproveita essa configuração no painel B, acima de “Áreas de Atuação”; ela não deve ser copiada para um bloco B. Fundo e cor do selo usam agora `#FAFAFA` e `#FF5414`, respectivamente, mantendo edição no admin e leitura do mesmo JSONB. Esse reposicionamento não muda `sections.sort_order`, `section_panels` ou o Hero desktop.

O painel B do Contato passa a compor sua apresentação mobile a partir dos tokens publicados em `design_tokens`, sem alterar `sections.theme`. Altura, distribuição vertical, microtexto sticky e ocultação visual de competências são regras no React/CSS, sem migration ou campos novos.

## Escrita
`save_section_block_atomic` P2 instalada: CAS e rollback para seção/bloco/placements. `save_home_seo_atomic` para SEO; Storage exige fluxo separado. A coluna `credit` não existe mais. [Mapa antigo](../MAPA_CAMPOS_CMS_RENDERER.md) é evidência histórica, não schema vigente.

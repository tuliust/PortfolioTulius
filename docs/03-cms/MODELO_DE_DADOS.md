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

`content_blocks.content_json.items[0].hero.mobileEditorial.middle` pertence ao bloco A da seção `perfil`. O renderer mobile reaproveita essa configuração no painel B, acima de “Áreas de Atuação”; ela não deve ser copiada para um bloco B. **Registro histórico de 11/11:** o fundo era `#FAFAFA` e a cor do selo `#FF5414`, com edição no admin e leitura do mesmo JSONB. **Estado vigente desde 12/11:** o fundo referencia `color.lightGray` no mesmo JSONB (o valor publicado inicial da paleta é `#ECECEC`); a cor da seta/selo continua independente e não foi substituída. Esse reposicionamento não muda `sections.sort_order`, `section_panels` ou o Hero desktop.

O painel B do Contato passa a compor sua apresentação mobile a partir dos tokens publicados em `design_tokens`, sem alterar `sections.theme`. Altura, distribuição vertical, microtexto sticky e ocultação visual de competências são regras no React/CSS, sem migration ou campos novos.

## Escrita
`save_section_block_atomic` P2 instalada: CAS e rollback para seção/bloco/placements. `save_home_seo_atomic` para SEO; Storage exige fluxo separado. A coluna `credit` não existe mais. [Mapa antigo](../MAPA_CAMPOS_CMS_RENDERER.md) é evidência histórica, não schema vigente.

## Contrato do favicon (12/11/2026)

A fonte única da seleção editável é `site_settings.seo_json.faviconUrl`, texto HTTPS publicado na biblioteca de mídia ou `/favicon.png` (padrão local); atualizado pela RPC de SEO existente e lido pelo cliente público no carregamento diferido de metadados. `src/lib/site-icons.ts` aplica a URL de maneira segura e `scripts/generate-seo.mjs` define os links `icon` e `apple-touch-icon` no HTML do build. O upload utiliza as tabelas/políticas existentes da biblioteca `media_assets` e o bucket `portfolio-public`; nenhum schema, FK, migração ou RLS foi alterado. `site_settings.favicon_media_id` permanece sem uso neste contrato, evitando duas referências editáveis contraditórias.

## Contrato `color.lightGray` → Perfil/B (12/11/2026)

A tabela existente `public.design_tokens` contém uma linha publicada adicional: `token_key='color.lightGray'`, `token_value='#ECECEC'`, `display_name='Cinza claro'`, `value_type='color'`, `scope='global'`, `style_config={}`. A referência é persistida em `content_blocks.content_json.items[0].hero.mobileEditorial.middle.background='color.lightGray'` **somente no bloco A publicado de Perfil**, que continua sendo a única fonte de configuração do selo exibido no painel B. O frontend lê os tokens publicados pelo fluxo já existente, `defaultTokens.lightGray` funciona como fallback e `PublicSite` injeta a variável CSS `--light-gray`; `heroColor`/admin reconhecem o novo token. A geometria do fundo cinza até a linha laranja está no CSS mobile, não na tabela de painéis. Nenhuma migration, coluna, tabela, policy ou duplicação de registro é necessária.

## Estilos desktop dos ajustes de 12/11/2026

Sem mudança de schema. A escala de Perfil e Formação usa `content_blocks.content_json.items[].desktop`; a frase editorial usa `items[0].hero.desktop.introSize`. Os objetos `mobile` e `hero.mobileEditorial` permanecem independentes. Centralização da seta, distâncias entre colunas de Resultados e posição da foto em Sobre são CSS/renderer, sem migração, nova tabela ou token global.

### Mapeamento dos registros desktop efetivamente publicados (releitura de 12/11/2026)

| Seção | `content_blocks.sort_order` | Campo em `content_json` | Valor |
|---|---:|---|---|
| `perfil` | 1 | `items[0].hero.desktop.introSize` | `24` |
| `perfil` | 1 | `items[1..4].desktop.{titleSize,textSize,spacing}` | `17,16,2` por destaque |
| `perfil` | 2 | `items[5..10].desktop.titleSize` | `23` por empresa |
| `formacao` | 1 | `items[0..2].desktop.titleSize` | `30` por curso |
| `formacao` | 2 | `items[0..1].desktop.titleSize` | `29` por instituição |

São **quatro blocos publicados** alterados com configuração desktop, sem mudança de `items[].mobile`, `hero.mobile` ou `hero.mobileEditorial`. Itens fora desses índices, `resultados` e `sobre` não receberam novos valores no banco. A gravação inicial foi SQL restrito em `content_blocks.content_json`, com checagem de cardinalidade/ausência de overrides e atualização de `updated_at`, seguida de releitura; **não** foi uma gravação demonstrada pela interface do CMS. Para edições futuras, continuar usando a RPC/CAS existente.

O renderer `PublicSite.tsx` e `src/index.css` aplicam `--item-desktop-title-size`, `--item-desktop-text-size` e `--hero-desktop-intro-size`. Resultados (`--results-column-gap`), seta e foto de Sobre são geometria do renderer/CSS, não colunas ou parâmetros extras do modelo.

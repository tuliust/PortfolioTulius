# Contrato CMS → Supabase → renderer

## Fonte canônica das Experiências — 22/11/2026

O bloco A de cada experiência pode conter `content_json.experienceProjects`: array JSONB com `{ id, item?, slide?, slideOrder?, includeInGallery? }`. `item` preserva o `ContentItem` com `isHidden` e estilos; `slide` preserva imagem, alt, legenda e enquadramento; `id` é estável; `includeInGallery=false` oculta imagem sem apagá-la. Slides sem projeto ficam como entradas sem `item` até revisão editorial.

`usePortfolio` expõe a coleção somente a partir de A publicado (ou prévia autorizada). `ExperienceStack` e PDF derivam textos e galeria da mesma coleção por `experienceProjectId/projectId`. Na ausência da coleção, permanecem os blocos e slides anteriores como fallback. `career_experiences.description`, competências e logo não mudam. **Sem migrations, tabelas novas ou alterações de RLS e Storage.**

**Status:** referência canônica · **Revisão:** 16/11/2026. Conferir [migrations](../../supabase/migrations/), [tipos](../../src/types/content.ts) e banco real antes de mudar schema.

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

**Inventário relido do Supabase em 18/11/2026:** 14 seções (13 publicadas/visíveis), 42 painéis, 28 blocos, 56 placements, **90 registros de mídia `published`** (fotografias anteriores: 75, 82 e 87), **4 projetos normalizados `published/realizado`** (a fotografia antiga era 3), 6 Trajetórias publicadas e 22 tabelas públicas com RLS. O `resultados` mantém os blocos A/B publicados: respectivamente **20 itens** e **5 temas** por breakpoint. Esses números são contagens de banco, **não** objetos físicos de Storage, comprovação das métricas ou autorização de limpeza. O PDF foi aceito sem qualquer migração/alteração de dados.

## Semântica

**Logo de experiências (18/11/2026):** `content_blocks.content_json.experienceMedia.logo` e `logoAlt` são campos opcionais independentes. O renderer usa a URL presente como condição de visibilidade do logotipo; um `logoAlt` ausente/vazio resulta em `alt=""` (empresa identificada por texto visível ao lado), não no monograma. Sem URL, o monograma permanece. Sem mudança de tabelas, RPC ou policies.

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

## Estilos desktop dos ajustes de 12/11/2026 (snapshot histórico; valores revisados em 16/11)

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


## Contrato desktop do indicador de anos — 16/11/2026

O modelo TypeScript `HeroDeviceStyle` recebeu a propriedade opcional **`yearsSize?: number`**, persistida sem DDL em `content_blocks.content_json.items[0].hero.desktop.yearsSize` do Perfil/A. `PublicSite.heroStyle` propaga o valor para `--hero-desktop-years-size`, e o CSS aplica um `clamp()` que conserva adaptação em larguras menores; o campo é editável no `HeroLeftEditor`. Não existe campo novo em `sections`, `design_tokens` ou `block_placements`.

Persistência adicional desta intervenção: Perfil/A `hero.desktop.introSize=15`; Perfil/B seis valores `items[5..10].desktop.titleSize=21`; Sobre/B cinco valores `items[0..4].desktop.textSize=14`. As propriedades móveis não foram substituídas. A leitura de `desktop.textSize` de Sobre/B já fazia parte de `itemStyle`, mas `src/index.css` agora respeita `--item-desktop-text-size` para essa coluna.

## Resultados por categoria — contrato vigente de 16/11/2026

A seção `resultados` conserva os mesmos dois `content_blocks` publicados, sem migration ou alteração de RLS. A carga inicial em produção foi **SQL restrito sob guardas de versão e releitura**; as próximas edições seguem RPC/CAS no editor, com persistência separada dos blocos A e B. No bloco A, os itens de indicadores continuam usando `title`, `value`, `text`, `metricIcon`, `relatedThemeKeys`, e passam a admitir `showInOverview?: boolean` e `overviewOrder?: number`. A omissão de `showInOverview` mantém itens antigos na visão geral; `false` os restringe às categorias, e o valor `true` os inclui explicitamente. A visão geral aplica a ordem `overviewOrder` enquanto cada categoria segue a ordem dos itens no array.

No bloco B, os cinco temas existentes mantêm `themeKey`, `themeAxis`, `themeTitle`, `themeSubtitle` e os campos editoriais originais. A propriedade opcional `themePresentation: "metrics" | "editorial"` controla a grade compacta sem excluir os textos antigos. `src/lib/result-metrics.ts` centraliza a seleção dos quatro cards gerais e os quatro cartões de cada tema. A edição permanece em `src/components/admin/AdminModules.tsx`, o renderer em `src/components/public/PublicSite.tsx`, e `src/content/fallback.ts`/`src/content/resultThemes.ts` reproduzem o conteúdo para indisponibilidade do Supabase.

**Estado publicado relido em 16/11/2026:** 20 itens no A, quatro por cada `themeKey` (`corporativa`, `projetos`, `eventos`, `marketing`, `imprensa`) e quatro `showInOverview=true`, ordenados independentemente como R$ 12 milhões, +225%, 100+ ao vivo, 25 eventos. Os cinco itens do B têm `themePresentation="metrics"`. A atualização inicial foi feita por SQL JSONB transacional com guardas de versão, não por migração nem por salvamento via UI; os blocos permanecem independentes no CMS. [Evidências](../05-operacao/TESTES_E_HOMOLOGACAO.md).


## Contrato editorial de Experiências — 16/11/2026

`content_blocks.content_json.items` nas seis seções mantém competências e cinco itens com `title`/`text` não ocultos. Registros históricos não selecionados permanecem como `isHidden=true`. `experienceMedia.slides` permanece com os slides aprovados (três ou quatro) e pode ter cardinalidade diferente da lista textual. Para itens sem slide associado, o renderer permite seleção sem alterar a galeria.

O texto integral de Trajetória permanece em `career_experiences.description`, com abertura e linhas `• Rótulo: corpo`. O frontend desktop deixa de suprimir bullets por prefixos legados e usa o mesmo texto do mobile. `portfolio_projects.project_status` distingue o estado de execução de `portfolio_projects.status`; Guia, Plataforma e SUBPI foram confirmadas como entregues pelo proprietário e devem ter seu estado e seus resumos coerentes. A estratégia CRM reside em bloco editorial existente, sem linha normalizada obrigatória.

A seção `resultados` mantém 20 itens no bloco A e cinco categorias no B. Substituídos somente os itens 19 e 20, preservando `relatedThemeKeys=['imprensa']` e `overviewOrder=3` no item 19.

## Renderer de PDF — Etapa 2 (16/11/2026)

A entrada é `PortfolioSection[]`, `DesignTokens` e `careerDescriptions` por slug estável. `selectPublishedPdfSections` usa `status=published`, `visible=true` e `number` (`sections.sort_order`) sem gravações. Resultados reaproveita `ResultsCenter/selectResultMetrics` em sequência (4 indicadores no overview e 20 distribuídos nos cinco temas). As experiências utilizam itens publicados de A/B com `isHidden!==true`, Trajetória de `career_experiences.description`, e ocultam slides somente no renderer. Depoimentos reutilizam os itens compostos por placements e são expandidos. Nenhum schema/migration/RLS/Storage alterado.

# Bloco 1 / P1 — Inventário de campos e painéis (leitura)

**Data da consulta:** 02/11/2026. **Fonte:** tabelas públicas do Supabase em modo SELECT e definição dos formulários em `src/components/admin/AdminModules.tsx`. **Sem escrita.**

## Resumo da base publicada

- **14 seções** (13 visíveis, `competencias` oculta), **28 blocos publicados** (**26 manuais + 2 ligados a `testimonials`**), **42 painéis de seção**, **75 mídias cadastradas**.
- Cada bloco manual continua sendo a referência de exibição. Uma coincidência literal de título indica um **candidato a comparar**, nunca autorização para trocar `source_collection`.
- Os 26 blocos são listados abaixo, incluindo os dois painéis de cada uma das 13 seções manuais ou parcialmente manuais (excluem-se os 2 de depoimentos já vinculados).

## Matriz integral dos 26 blocos manuais

`Campos` é a união das chaves em `content_json.items`. As chaves complementares `content_json.experienceMedia` são listadas em Mídia. O mapa de fonte candidata serve **apenas para triagem** e nunca significa que todo o bloco pertence àquela coleção.

| Seção/painel | ID (prefixo) | Itens | Campos editoriais presentes | Mídia de experiência | Candidato / coincidências |
| --- | --- | ---: | --- | --- | --- |
| perfil/A | `a2f4770b` | 5 | alt, image, label, text, title | — | career_experiences · 0 títulos |
| perfil/B | `a092fea1` | 11 | label, meta, targetSlug, text, themeKey, title | — | career_experiences · 6 título(s) |
| sobre/A | `49fbe2d3` | 1 | aboutDesktopAlt, aboutDesktopImage, alt, image, label, text, title | — | sem alvo direto · 0 títulos |
| sobre/B | `2410a612` | 5 | text, title | — | sem alvo direto · 0 títulos |
| resultados/A | `f7908ce3` | 4 | metricIcon, relatedThemeKeys, text, title, value | — | metrics · 0 títulos |
| resultados/B | `ccb158ca` | 5 | inheritedHighlights, themeAxis, themeKey, themeSubtitle, themeSummary, themeTitle, themeTopics, title | — | skills · 0 títulos |
| competencias/A | `f1511c92` | 2 | text, title | — | skills · 0 títulos |
| competencias/B | `b1495f5a` | 3 | text, title | — | skills · 0 títulos |
| formacao/A | `1bc36dc9` | 3 | label, meta, title | — | education · 3 título(s) |
| formacao/B | `418c8543` | 2 | label, meta, title | — | language_levels · 0 títulos |
| invest-rs/A | `a38ceca7` | 3 | alt, image, tags, text, title | logo + 4 slides | portfolio_projects · 1 título(s) |
| invest-rs/B | `222cc514` | 5 | isHidden, text, title | — | portfolio_projects · 1 título(s) |
| prefeitura-sp/A | `d114003e` | 6 | label, tags, text, title, value | logo + 3 slides | portfolio_projects · 0 títulos |
| prefeitura-sp/B | `9a95d195` | 4 | isHidden, label, text, title | — | portfolio_projects · 1 título(s) |
| vale/A | `46948db2` | 4 | label, tags, text, title, value | logo + 3 slides | portfolio_projects · 1 título(s) |
| vale/B | `08763d31` | 3 | label, text, title | — | portfolio_projects · 0 títulos |
| globo-sportv/A | `50e2980c` | 4 | label, tags, text, title | logo + 3 slides | portfolio_projects · 0 títulos |
| globo-sportv/B | `de868897` | 11 | isHidden, label, meta, text, title | — | portfolio_projects · 0 títulos |
| inpress/A | `f76cd26a` | 3 | label, tags, text, title | logo + 3 slides | portfolio_projects · 0 títulos |
| inpress/B | `0f677f0a` | 2 | label, text, title | — | portfolio_projects · 0 títulos |
| cdi/A | `825eb267` | 3 | label, tags, text, title | logo + 3 slides | portfolio_projects · 0 títulos |
| cdi/B | `712c86b5` | 2 | label, text, title | — | portfolio_projects · 0 títulos |
| ferramentas/A | `4b6b0baf` | 3 | text, title, toolIcons | — | tool_categories · 3 título(s) |
| ferramentas/B | `717c437f` | 3 | text, title, toolIcons | — | tool_categories · 3 título(s) |
| contato/A | `d9ee5efc` | 1 | alt, image, text, title | — | sem alvo direto · 0 títulos |
| contato/B | `2b337092` | 3 | meta, title, value | — | contact_channels · 3 título(s) |

## Comparação do CMS com as tabelas estruturadas

A lista de campos abaixo corresponde aos formulários observados na configuração atual das nove coleções; o restante exige outra interface, lógica de associação ou é editado em outro módulo. Campos operacionais `id`, `status`, `sort_order`, `created_at`, `updated_at` e `editorial_note` foram excluídos da coluna de lacunas por não serem campos de apresentação comuns.

| Coleção | Campos expostos no formulário da coleção | Campos estruturados sem campo direto no formulário |
| --- | --- | --- |
| `career_experiences` | `company`, `role`, `location`, `start_date`, `end_date`, `description` | `skills` |
| `portfolio_projects` | `title`, `summary`, `details`, `project_status` | `experience_id` |
| `metrics` | `label`, `value_text`, `unit`, `context` | `section_id` |
| `skills` | `name`, `category` | — |
| `education` | `institution`, `course`, `degree_type`, `start_date`, `end_date` | — |
| `language_levels` | `language`, `level_label`, `evidence_note` | — |
| `tool_categories` | `title`, `tools (transformado)` | — |
| `testimonials` | `author_name`, `author_role`, `quote_text` | `photo_media_id` |
| `contact_channels` | `channel_type`, `label`, `value`, `url` | — |

**Limites do inventário automático:** ter um formulário não comprova o ciclo completo salvar → recuperar → exibir em produção. Campos calculados, status, visual/responsivo e relações externas precisam de fluxos específicos. `tools_text` é uma apresentação do JSON `tools`, não uma coluna separada no banco. `skills` em `career_experiences`, `experience_id` dos projetos e `photo_media_id` dos depoimentos não devem ser completados por inferência.

## Diferenças com maior risco de substituição visual

- **Perfil/B:** mistura cinco áreas de atuação com seis experiências; vincular a lista inteira a `career_experiences` poderia eliminar cinco cards e os `targetSlug` de navegação.
- **Formação/A:** os três títulos e tipos coincidem, mas `education` projeta `text` e `meta` de maneira diferente. A regra aprovada preserva `meta` e acrescenta o `text` completo; a prévia visual continua isolada.
- **Formação/B:** os títulos das instituições não coincidem literalmente com os títulos da coleção `language_levels`; exige contrato editorial de apresentação.
- **Ferramentas/A+B:** títulos coincidentes, mas `tools_text` e `toolIcons` são dados de apresentação distintos; uma vinculação simples apagaria ícones editoriais.
- **Contato/B:** há três cards públicos e quatro linhas de `contact_channels`; o conversor estruturado usa `text` onde os cards atuais usam `value` e links de `meta`. Vínculo simples alteraria layout e links.
- **Projetos em experiências:** apenas quatro projetos estruturados; alguns cards de projeto estão ocultos (`isHidden`) e o conversor genérico descarta esses estados. Não sincronizar pelo título.
- **Galerias:** os seis logos e 19 slides estão em `content_json.experienceMedia`. Não existem colunas equivalentes em `career_experiences`; não migrar por posição.
- **Métricas:** valores públicos em cards e linhas de `metrics` podem representar assuntos relacionados, mas divergem em rótulo, `unit`, `context`, `value` e visibilidade. Exigem aprovação por campo.
- **Competências:** a seção continua com blocos `published`, porém `sections.is_visible=false`; preservar o conteúdo oculto.

## Campos do grafo e do layout

- **Pages / site_settings:** título, descrição, favicon, SEO JSON, locale, status. HTML de robôs gerado em build; salvar no CMS não equivale a publicar HTML.
- **Sections:** `slug`, `title`, `eyebrow`, `intro`, `sort_order`, `layout_variant`, `theme`, `animation_preset`, `status`, `is_visible`.
- **Content blocks:** `block_type`, `content_json` (itens, imagens, alt, estilos, tags, campos especiais, `experienceMedia`), `media_id`, `mobile_panel`, `sort_order`, `status`, `is_placeholder`, `editorial_note`.
- **Section panels:** breakpoint/panel key, tema, layout, `style_config`; **block placements:** posição, visibilidade, layout, estilos e configurações de movimento.
- **Design tokens:** 12 tokens publicados previamente auditados; novas alterações requerem comparação em desktop/mobile.
- **Mídia:** catálogo com bucket, caminho, título, créditos, `alt_text`, posição focal, dimensões e status; caminhos/atributos não devem ser inventados.

## Próximas aprovações

Revisar as diferenças **por bloco**, inclusive conteúdo oculto e aparências responsivas. Não gravar `content_json` nem marcar vínculos só pela coincidência de texto. Relatório individual das experiências em [P1 experiências](BLOCO_1_P1_EXPERIENCIAS_2026-11-02.md).

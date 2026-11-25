# Contrato CMS → Supabase → renderer

## Conferência de dados após os ajustes de interface — 25/11/2026

Releitura somente leitura das seis seções e dos arrays canônicos A: 28 fichas (4/4/5/5/5/5), 24 projetos centrais (4/4/5/5/3/3), 22 slides ativos (4/4/5/3/3/3) e zero fichas `slide.mediaType=video`. Seis intros preservam os dados originais; separadores e hierarquia são exclusivamente de apresentação. A configuração SEO publicada usa `faviconUrl=/favicon.png` e `ogImage` para `tulius-site-600.webp`. A leitura anterior à correção do Perfil identificou o mesmo PNG nos campos desktop/mobile, com fundo inferior #FAFAFA. Não houve UPDATE, migration ou mudança de contrato CMS nesta consolidação. As contagens de 23/11 abaixo são históricas. [Estado](../01-projeto/ESTADO_ATUAL.md).

## Apresentação uniforme de `sections.intro` nas Experiências — 25/11/2026

Leitura das seis seções publicadas confirmou o formato `cargo | unidade · período · localização` (unidade e localização opcionais). O renderer `ExperienceIntro` separa a primeira ocorrência de ` · ` e mantém o restante unido pelo mesmo separador na linha de período/localização; sem período não cria linha vazia. Remove `|` terminal sem complemento apenas na renderização e impede que uma barra válida fique isolada no final da linha por espaço inseparável após ela. Usa a classe e a escala existentes da Invest RS para todas as empresas, desktop/mobile/PDF. Nenhum UPDATE, mudança de schema, edição CMS ou nova localização foi realizado.

## Compactação das seis Trajetórias — 25/11/2026

Alteração exclusivamente editorial, autorizada e confirmada em produção. Foram substituídas somente as seis descrições publicadas em `career_experiences.description` (mais metadado temporal automático, quando aplicável). O formato permanece parágrafo introdutório + 4/5 linhas `• Rótulo: corpo`; `splitExperienceBullet` aplica negrito até os dois-pontos, e o renderer completo usa o mesmo texto no desktop, mobile e PDF. `TRAJECTORY_RECOMMENDED_CHARS = 650` continua recomendação, não restrição de schema. Os conteúdos aprovados somam 3.346 caracteres brutos, antes 11.409. A releitura confirmou igualdade exata dos seis textos, hashes dos demais campos de carreira (excluindo descrição e updated_at) e hashes integrais das seis seções e 12 blocos publicados. Projetos, slides, competências, IDs, status, mídia, layout, schema, Auth/RLS e Storage não foram alterados. As versões compactas estão no [Guia CMS](GUIA_ADMINISTRATIVO.md); o inventário anterior é histórico, não autorização para restaurar descrições. Encaixe sem scroll e exportação PDF ainda não validados.

## Revisão editorial das seis Experiências — 25/11/2026

**Executado e relido no Supabase**, a pedido do proprietário, sobre a publicação de referência `85f939c369d4b52c54216b3041db23a20432e39d`. Este inventário substitui as contagens datadas de 23/11: **28 fichas canônicas armazenadas, 24 itens centrais visíveis, 24 fichas com mídia configurada e 22 slides ativos**.

| Experiência (slug) | Centro visível | Galeria ativa | Fichas ocultas |
|---|---:|---:|---:|
| invest-rs | 4 | 4 | 0 |
| prefeitura-sp | 4 | 4 | 0 |
| vale | 5 | 5 | 0 |
| globo-sportv | 5 | 3 | 0 |
| inpress | 3 | 3 | 2 |
| cdi | 3 | 3 | 2 |

Identidade editorial: `sections.title/eyebrow/intro`; competências: `content_json.items` de A; projetos: `experienceProjects[].item.title/text`; legenda independente: `slide.title/caption`. Ordem do centro alinhada à ordem das mídias; IDs e flags de galeria existentes preservados. As duas fichas de Globo sem galeria ativa receberam títulos e legendas, mas não foram habilitadas sem os MP4 correspondentes. As quatro fichas excedentes de InPress/CDI permanecem com `showInCenter=false` e `includeInGallery=false`. Os arrays legados A/B foram ajustados para compatibilidade, sem mudar o contrato; a galeria legada não substitui a canônica.

Trajetória: seis `career_experiences.description` publicadas complementadas preservando as atribuições anteriores; conteúdos condensados ou retirados do centro foram mantidos/integrados nessas descrições. Sem alteração dos demais campos de carreira. Nenhuma alteração em schema, migrations, Auth/RLS, Storage, mídia, placements, renderer ou configuração Vercel. Hashes dos 24 objetos de slide, excluindo somente título e legenda, idênticos antes/depois; verificação de dados SUCCESS. Validação visual desktop/mobile/PDF não executada. O fallback local de desenvolvimento permanece separado, com seu acervo ilustrativo; produção configurada não deve substituí-la por fallback obsoleto em falhas de leitura.

## Reprodução automática e preenchimento do vídeo — 24/11/2026

A reprodução pública do `mediaType=video` passa pelo `ExperienceVideoPlayer`, que tenta reprodução automática inicialmente muda quando pelo menos 25% do vídeo selecionado está visível e a aba está ativa; pausa fora da tela/aba e ao desmontar. Mantém controles e suspende a rotação enquanto o vídeo está selecionado; não repete ao terminar. Sem mudança de campos, schema, RPC, Storage ou objetos.

## Upload administrativo de vídeos — 24/11/2026

`experienceProjects[].slide.mediaType` omitido significa imagem; `video` usa `videoPath` (nome UUID.mp4 no bucket `portfolio-videos`) e `image` como capa opcional. A URL é derivada da configuração Supabase, sem aceitar URL externa. O renderer pausa o carrossel enquanto o vídeo está selecionado; PDF continua sem galeria. Sem migração dos JSONB existentes. O catálogo usa `mime_type=video/mp4`; seletores de imagens excluem vídeo.

## Contrato efetivo de Experiências no Supabase — 23/11/2026

Após limpeza transacional das seis seções, cada bloco A **publicado** contém `content_json.experienceProjects` com **5 fichas** (`id` estável, `item`, `slide?`, `showInCenter`, `includeInGallery`, `slideOrder?`). A área central usa `item.title/text` e a direita usa `slide.title/caption/image`; a associação pública não depende da igualdade dos títulos. São **30 projetos e 17 slides canônicos**, sem projetos históricos marcados `isHidden=true`; a Invest RS tem 2 slides, os outros trabalhos têm 3. Nas arrays antigas `items` (A/B) restam os cinco projetos visíveis e, no A, `Competências aplicadas`; a galeria legada conserva somente os slides vinculados.

A migração não alterou tabelas, views, migrations, políticas RLS, Auth, catálogo/Storage, Trajetórias ou campos de identidade; o banco recebeu alterações JSONB seletivas nos blocos-alvo. Uma ficha nova com `showInCenter=false` e `includeInGallery=false` continua armazenada, diferentemente dos itens históricos removidos por solicitação expressa.

## Campos do projeto único por experiência (23/11/2026)

O bloco A armazena content_json.experienceProjects: objetos { id, item, slide?, showInCenter?, includeInGallery?, slideOrder? }. item.title e item.text abastecem só o centro; slide.title, slide.caption, slide.image, slide.alt e slide.framing só a direita. showInCenter=false oculta apenas o cartão central; includeInGallery=false oculta apenas a imagem; ambas falsas preservam uma ficha oculta no CMS. O slide exige título, descrição e imagem quando publicado. O ID vincula slide.projectId a item.experienceProjectId, sem casar pelo título.

A coleção canônica alimenta página pública e PDF. Sem coleção, o fallback legado continua disponível até a migração: itens antigos isHidden=true e slides sem título correspondente único não entram no novo editor. A limpeza de JSONB remove só os registros históricos especificados, preservando Competências aplicadas, logotipo e metadados; sem alteração de schema, RLS, Auth ou Storage.

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

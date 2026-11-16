# Arquitetura do PortfolioTulius
**Status:** referência canônica · **Atualizado:** 16/11/2026. Stack: React 19, TypeScript, Vite, Tailwind CSS v4, Supabase e Vercel.

## Camadas
- [`src/main.tsx`](../../src/main.tsx): carrega o site público; roteador administrativo lazy.
- [`src/app/routes.tsx`](../../src/app/routes.tsx): `/admin/login`, `/admin/*`, `/admin/preview` e 404.
- [`PublicSite.tsx`](../../src/components/public/PublicSite.tsx), [`Navigation.tsx`](../../src/components/public/Navigation.tsx), [`ExperienceStack.tsx`](../../src/components/public/ExperienceStack.tsx): páginas, âncoras e experiência editorial.
- [`AdminApp.tsx`](../../src/components/admin/AdminApp.tsx), [`AdminModules.tsx`](../../src/components/admin/AdminModules.tsx) e editores extraídos: CMS e prévia.
- [`usePortfolio.ts`](../../src/hooks/usePortfolio.ts), [`placements.ts`](../../src/lib/placements.ts), [`media-alt-sync.ts`](../../src/lib/media-alt-sync.ts): consultas, composição, metadados de mídia.
- [`result-metrics.ts`](../../src/lib/result-metrics.ts): filtro dos indicadores por categoria e ordenação independente da visão geral.
- [`public-read.ts`](../../src/lib/public-read.ts): PostgREST público independente do SDK completo de Auth/Storage.
- [`supabase.ts`](../../src/lib/supabase.ts), [`p2-composite-save.ts`](../../src/lib/p2-composite-save.ts): autenticação, cliente e persistência.
- [`generate-seo.mjs`](../../scripts/generate-seo.mjs), [`vercel.json`](../../vercel.json): SEO de build e deploy.

## Contratos
Leitura pública: PostgREST/RLS → `sections`, `content_blocks`, `section_panels`, `block_placements` e coleções → `usePortfolio` → renderizadores desktop/mobile. `content_json` guarda conteúdo; placements guardam exibição. Não duplicar dados por viewport.

Admin: Auth → vínculo `admin_users`/guarda administrativa → editores → CAS/RPC, revisão e releitura. A RPC composta `save_section_block_atomic` está instalada. SEO estático exige novo build; SQL + Storage não é transação distribuída.

O arquivo autogerado legado `utils/supabase/info.tsx` foi removido da árvore atual por não ser a fonte vigente de configuração; o [cliente efetivo](../../src/lib/supabase.ts) recebe URL e chave publicável por variáveis `VITE_*`. O valor público embutido no arquivo histórico não foi copiado para a documentação. Ver [arquivo de origem](../historico/figma-make-2026-11-11/README.md).

A página inicial não deve carregar antecipadamente o roteador de administração. `src/content/fallback.ts` serve como fallback controlado, não substituto de dados produtivos.

## Seção 03 — Resultados e projetos (contrato vigente desde 16/11)

A fonte de verdade de `resultados` permanece em **dois blocos JSONB já existentes**: A contém os 20 indicadores (`title`, `value`, `text`, `metricIcon`, `relatedThemeKeys`, `showInOverview` e `overviewOrder`); B contém as cinco categorias (`themeKey`, `themeAxis`, `themeTitle`, `themeSubtitle`, `themePresentation` e campos editoriais preservados).

O caminho é **CMS/Supabase → `usePortfolio` → `selectResultMetrics` → `ResultsCenter` → desktop/mobile**. `showInOverview=false` exclui o indicador da abertura geral, sem excluí-lo das categorias; a propriedade omitida conserva o comportamento legado. `themePresentation="metrics"` exibe eixo/título/subtítulo e grade compacta; o texto editorial original continua persistido. O admin no [`AdminModules.tsx`](../../src/components/admin/AdminModules.tsx) permite inclusão, edição, associação, ordem e modo de apresentação. O fallback em [`fallback.ts`](../../src/content/fallback.ts) e [`resultThemes.ts`](../../src/content/resultThemes.ts) acompanha o contrato, mas **não substitui** o estado vivo do CMS.

A atualização inicial de produção foi feita por SQL JSONB com guardas de versão dos dois registros, seguida de releitura. O salvamento normal no admin continua via RPC/CAS, **separadamente por bloco**, sem transação conjunta presumida entre A e B. Não foram introduzidas migrations ou alterações de Auth/RLS/Storage. Detalhes: [modelo de dados](../03-cms/MODELO_DE_DADOS.md), [CMS](../03-cms/GUIA_ADMINISTRATIVO.md) e [testes](../05-operacao/TESTES_E_HOMOLOGACAO.md).

## Proteções
Preservar aparência, conteúdo, fotos, responsividade, A11y, SEO e RLS. Não executar migrations nem reformatar UI sem pedido concreto. [Modelo de dados](../03-cms/MODELO_DE_DADOS.md), [CMS](../03-cms/GUIA_ADMINISTRATIVO.md).

## Intervenção desktop 12/11/2026 — componentes e limites

O Hero desktop é renderizado em [`PublicSite.tsx`](../../src/components/public/PublicSite.tsx): o link `.profile-next-section` foi movido de dentro de `.profile-main` para filho direto de `.profile-desktop` para usar como referência a largura completa da seção. [`src/index.css`](../../src/index.css) contém as regras desktop de fonte/densidade (`min-width: 768px`), as duas lacunas iguais de Resultados (`--results-column-gap`), a escala de Formação, o alinhamento da foto de Sobre e a proteção de sobreposição entre selo e indicador de anos quando a altura da tela é curta.

O editor especializado de Perfil usa [`HeroLeftEditor.tsx`](../../src/components/admin/HeroLeftEditor.tsx), [`HeroHighlightsEditor.tsx`](../../src/components/admin/HeroHighlightsEditor.tsx) e [`HeroRightEditor.tsx`](../../src/components/admin/HeroRightEditor.tsx), com `NumericField` para valores desktop já previstos no contrato `ContentItem.desktop` e `HeroVisualConfig.desktop`. Formação continua no editor genérico. A apresentação mobile permanece na árvore de renderização própria, sem novo bloco, placement ou cópia de texto.

O fluxo regular **admin → RPC `save_section_block_atomic` → leitura → renderer** não mudou. Para fixar os valores iniciais aprovados, a intervenção realizou **UPDATE restrito diretamente nos quatro blocos publicados** de Perfil/Formação com verificação posterior; isso **não** constitui teste de salvar pelo admin. [Guia CMS](../03-cms/GUIA_ADMINISTRATIVO.md), [modelo de dados](../03-cms/MODELO_DE_DADOS.md) e [homologação](../05-operacao/TESTES_E_HOMOLOGACAO.md).


## Revisão editorial autorizada — Experiências e dois indicadores (16/11/2026)

A seção Resultados conserva vinte métricas e cinco temas; somente duas entradas do tema `imprensa` mudam: `100+ ao vivo` → mailing pessoal `400+` e `200+` → `32 influenciadores`. A primeira permanece na terceira posição da visão geral. Os indicadores anteriores continuam representados na experiência Globo/SporTV. `perfil` e `sobre` não são alterados.

As seis experiências apresentam cinco projetos textuais por empresa, independentemente da quantidade (três ou quatro) de slides ilustrativos. O renderer associa a galeria somente quando há título correspondente; a galeria e suas imagens permanecem preservadas. Textos publicados vêm de `content_blocks.content_json.items`, trajetórias de `career_experiences.description` e estados editoriais de projetos de `portfolio_projects`. O mirror `src/content/experienceEditorial.ts` existe somente como fallback quando a publicação não tem banco configurado; o Supabase continua sendo fonte vigente. O frontend público e o editor leem os registros do banco, sem segunda escrita no site.

## Renderer estático de exportação PDF — Etapa 2 (16/11/2026)

Foi criado `src/components/public/PdfPortfolio.tsx` como componente read-only, sem rota, tela de admin ou geração de arquivo nesta etapa. Recebe `sections`, `tokens`, `careerDescriptions`, `device`, `colorMode` e `includedSlugs`, sem acesso a serviços e sem salvar dados. `src/lib/pdf-export-sections.ts` seleciona apenas seções publicadas/visíveis ordenadas por `number` (oriundo de `sort_order`).

O renderer reutiliza `Section`, `ResultsCenter`, `RESULT_THEME_KEYS` e `TestimonialCards` de `PublicSite.tsx`; `expandedForExport` exibe depoimentos integrais. `PdfExperienceSection` em `ExperienceStack.tsx` reutiliza marca, introdução e `ExperienceDetails complete`, exibe projetos e Trajetória simultaneamente e não monta galerias nem menu de empresas. `PdfPortfolio.css` só é importado pelo componente de exportação.

**Pendente:** carregamento consistente do CMS e Trajetórias, viewport real, PDF de uma página física por seção, links finais e paridade visual. Nenhuma rota pública, schema, Auth/RLS, Storage ou configuração Vercel mudou.

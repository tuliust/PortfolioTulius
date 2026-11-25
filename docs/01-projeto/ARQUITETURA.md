# Arquitetura do PortfolioTulius

## Pintura prioritária do Perfil público — 25/11/2026

`usePortfolio.ts` inicia as consultas não críticas após o Perfil como antes, mas a composição do grafo completo aguarda `waitForProfilePaint()` (`src/lib/profile-paint.ts`): decode do retrato e dois frames, limitados a 1 s. Navegação por fragmento, aba oculta e preview autenticado não recebem espera. Falha de decode e limite de tempo sempre liberam a renderização; o conteúdo continua vindo exclusivamente do CMS publicado. Fontes, animações, layout, SEO e tratamentos de falha preservados. [Testes e evidências por SHA](../05-operacao/TESTES_E_HOMOLOGACAO.md).


## Seleção da fotografia por mídia — 25/11/2026

A URL exata do PNG atual tem duas derivações de transporte: WebP qualidade 90 para tela mobile até 767 px; WebP sem perda para desktop e impressão. A condição `screen` impede aplicar a compressão RGB ao PDF impresso. Os preloads de build selecionam a mesma variante por viewport. Fonte CMS, alfa, dimensões, layout e enquadramento preservados. O smoke mobile verifica título do slide e descrição da ficha vinculada por ID; a matriz desktop aguarda fontes e mantém diagnóstico de posição em caso de timeout. [Testes](../05-operacao/TESTES_E_HOMOLOGACAO.md).


## Transporte do retrato e contrato do smoke — 25/11/2026

`ApprovedProfileImage` oferece WebP sem perda para a URL exata do PNG atual; mantém o original como fallback de `<picture>`. O build sincroniza o preload com essa mesma regra; outras URLs preservam o fluxo CMS existente. Sem mudanças de renderização, dados ou configuração de infraestrutura. P3 deriva contratos de projetos, competências e slides da resposta pública de `sections`, independentemente do DOM, mantendo a relação por ID e temporização 8 s/3 s. [Mídias](../03-cms/MIDIAS_E_STORAGE.md) · [Testes](../05-operacao/TESTES_E_HOMOLOGACAO.md).


## Contrato de apresentação e navegação de Experiências — 25/11/2026

O renderer mantém as seis fichas sticky e os dados CMS existentes. `ExperienceStack.tsx` usa `ExperienceIntro` compartilhado com PDF para separar cargo e período, calcula destaque com marcadores desktop não-sticky `experience-anchor-<slug>` e usa `src/lib/experience-hash.ts` também em `PublicSite.tsx` e `Navigation.tsx`. A posição de rolagem não depende do painel sobreposto. CSS mantém quadro 1:1, cabeçalho opaco quando índice fixado e transparência da foto editorial pública mobile (exclui PDF). A leitura de 25/11 confirma 28 fichas, 24 projetos centrais, 22 slides ativos, quatro ocultos e zero fichas de vídeo. [Estado consolidado](ESTADO_ATUAL.md) · [Responsividade](../02-design/RESPONSIVIDADE_E_ACESSIBILIDADE.md).

## Consolidação dos seis conjuntos de projetos em produção — 23/11/2026

O Supabase já contém **5 registros canônicos por experiência** (30 projetos e 17 slides), associados por ID estável. O editor e o renderer consultam a mesma coleção JSONB em A. Os arrays legados permanecem somente com o conteúdo que era publicado; itens `isHidden=true` e slides órfãos foram removidos daqueles arrays. A função de importação por título é agora apenas fallback de compatibilidade, não a fonte efetiva das seis seções.

A transação foi restrita a 12 blocos de experiências, conferiu hashes das versões anteriores sob lock e verificou contagens após a execução. Nenhuma escrita em RLS/Auth/Storage, schema ou conteúdo de outras seções foi necessária. A cópia privada dos 25 objetos JSON excluídos não está no repositório.

## Experiências com duas áreas e sincronização por ID (23/11/2026)

ExperienceProjectsEditor.tsx salva uma ficha com textos de centro e slide separados e flags independentes showInCenter/includeInGallery, no JSONB do bloco A por RPC/CAS, com releitura. experience-projects.ts deriva duas listas da mesma coleção; ExperienceStack.tsx vincula o slide ativo ao item central por ID, mesmo com títulos diferentes. Sem vínculo central visível, nenhum item deve receber destaque arbitrário.

O carrossel avança em 3000 ms para a empresa ativa; interação manual reinicia a contagem em 8000 ms e o ciclo volta a 3000 ms. A aba oculta, preferência por movimento reduzido e galerias menores que dois slides suspendem o temporizador. Mantêm-se os componentes, responsividade, Trajetória, PDF, SEO e identidade visual existentes.

## Unificação editorial das Experiências — 22/11/2026

`ExperienceProjectsEditor.tsx` lê A/B e os slides aprovados, oferece fichas integradas e salva `content_json.experienceProjects` apenas em A por RPC P2/CAS. O conversor `legacyExperienceProjects` preserva itens históricos ocultos e slides ambíguos, sem SQL de migração. `usePortfolio.ts` detecta o novo campo, e `ExperienceStack.tsx`/PDF derivam os projetos e os slides da mesma lista, com fallback legada quando o campo não existe. Não alterar design público, Trajetória, bibliotecas de mídia ou a infraestrutura por causa dessa interface.

## Contrato atual de impressão PDF — 18/11/2026

A geração continua exclusivamente no navegador, sem backend PDF ou novas tabelas. O renderer `PdfPortfolio` consome o conteúdo publicado; `PdfPrintReady` aguarda fontes/imagens/Trajetórias; `pdf-print-layout.ts` monta regras físicas `@page`. **Desktop:** `PdfExportPanel.tsx` imprime diretamente o iframe validado de **1440 px** por `printDesktopReferenceFrame()` (`pdf-print-launch.ts`), evitando uma nova aba estreita onde o CSS do site ocultaria `.desktop-panel`. **Mobile:** aba separada, viewport interno **390 px**, folhas físicas separadas para Perfil, Sobre e Resultados; reserva exclusiva de **176 px** em `sobre-diferenciais`. Nenhum componente público, conteúdo ou migration foi modificado.

O proprietário confirmou **aceite visual de ambos os PDFs reais** em 18/11. A especificação operacional atual, os testes e os limites estão em [Exportação PDF](../05-operacao/EXPORTACAO_PDF.md); as etapas anteriores abaixo são registros de evolução e não substituem a solução corrigida.

---

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

## Etapa 3 — contrato de modos visuais PDF (16/11/2026)

`src/lib/pdf-export-options.ts` define as referências 1440×900 CSS px para Desktop e 390×844 CSS px para Mobile. `PdfPortfolio` publica os atributos `data-pdf-reference-width/height`; a futura geração deve configurar o viewport real do Chromium, pois uma classe CSS não ativa media queries do navegador. `Section` recebeu `pdfExport` opcional, marcando `data-pdf-section` somente na exportação; `ResultsCenter` recebeu `staticForExport` para retirar o foco/ARIA da navegação temática em modo estático.

Os depoimentos exportados passam a ser elementos `article` em lugar de botões. O comportamento padrão da página pública permanece inalterado. Esta etapa ainda não introduz rota, tela administrativa ou serviço de geração de PDF.

## Fixture visual isolada da Etapa 3 (16/11/2026)

`pdf-export-qa.html` e `src/pdf-export-qa.tsx` criam entrada exclusiva do servidor Vite de desenvolvimento. Usam `src/content/fallback.ts` e Trajetórias sintéticas, **não** Supabase de produção. O build padrão tem somente `index.html` como entrada e o workflow QA verifica que `dist/pdf-export-qa.html` não existe. O script `scripts/pdf-export-visual-smoke.mjs` utiliza Chromium em quatro modalidades e o workflow `.github/workflows/pdf-export-visual.yml` publica capturas como artefato interno do CI. Nenhuma rota de PDF foi adicionada ao app publicado.

## Etapa 4 — painel de exportação PDF (16/11/2026)

O módulo lazy `PdfExportPanel.tsx` está no menu do `AdminApp` como **Exportar PDF**. A nova rota `/admin/pdf-preview` é específica e exige `useAdminGuard` antes da montagem do conteúdo. `pdf-preview-config.ts` valida dispositivo, paleta e slugs selecionados. O iframe recebe viewport intrínseco 1440×900 ou 390×844 CSS px, escalado apenas dentro do espaço administrativo.

`PdfPreviewPage.tsx` lê `usePortfolio(false)` e `career_experiences.description` publicados por PostgREST; não expõe rascunhos nem fallback local. Seções e Trajetórias ausentes bloqueiam a prévia. Leituras de seções e Trajetórias são independentes, não um snapshot transacional. Não há geração de PDF, alteração de schema, Auth/RLS ou escrita no CMS.

## Etapa 5 — geração PDF nativa e páginas variáveis (16/11/2026)

A exportação usa **CSS Paged Media e impressão nativa do navegador**, sem backend, novas dependências ou transporte de conteúdo do CMS. `src/lib/pdf-print-layout.ts` mede cada `[data-pdf-section]` e gera regras `@page` nomeadas: largura de 1440 px (Desktop) ou 390 px (Mobile) e altura individual de até 16.000 px por seção, evitando cortes em blocos longos. O mecanismo preserva texto pesquisável e hiperlinks nativos e converte âncoras para seções excluídas em links para https://tulius.work/.

`PdfPreviewPage.tsx` só sinaliza prontidão ao iframe após carregar fontes e imagens visíveis. `PdfExportPanel.tsx` verifica origem e janela da mensagem antes de habilitar **Gerar PDF**, chamando `iframe.contentWindow.print()`. O navegador abre seu próprio diálogo, onde o usuário escolhe **Salvar como PDF**; não há download binário automático. O PDF só é apresentado como pronto se dados, imagens, Trajetórias e seções estiverem completos. Não houve mudança de CMS, Auth/RLS ou produção fora do fluxo Git.

## PDF — correções da homologação real de 17/11/2026

A preparação das imagens saiu da rota admin para o componente isolado `src/components/public/PdfPrintReady.tsx`, compartilhado com a fixture Chromium de QA (com `prepareOnBeforePrint=false` no teste). Imagens `loading=lazy` passam primeiro a `eager` e são aguardadas via `img.decode()`, antes de consultar `naturalWidth`, evitando a falha transitória na prévia mobile. Um erro de mídia não desmonta `PdfPortfolio`: a prévia permanece visível e a mensagem `portfolio-pdf-error` desabilita a impressão no painel. A geração continua condicionada a imagens reais carregadas, sem substituição de arquivos e sem escritas no CMS. O site público não importa o componente.

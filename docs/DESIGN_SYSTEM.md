# Design system

## Contrato editorial registrado no mobile em 01/11/2026 (referência datada)

**Precedência desde 05/11:** a aparência pública vigente está correta e deve ser preservada. Na versão mobile atual, a lista duplicada de “Experiência em destaque” foi omitida do segundo painel do Perfil; o fundo de Olá muda para grafite abaixo da foto; Ferramentas foram elevadas; a faixa das logos das Experiências recebe laranja apenas no estado sticky. Ver [Layout atual](RESPONSIVE_LAYOUT.md), não interpretar as descrições de 01/11 abaixo como comando para restaurar elementos removidos.

Preservar cores, tipos, fotografias, pictogramas, alinhamentos e a escala desktop vigente. Os mockups de outubro são referências conceituais, não substituem conteúdo CMS publicado nem determinam alturas rígidas.

- **Perfil:** abertura clara/escura em duas telas editoriais; nome, posicionamento profissional derivado do campo CMS, retrato WebP, selo 360° e seta circular. Segundo painel com áreas e experiências.
- **Olá!:** laranja, `OLÁ!` uma única vez na abertura, fotografia original ampliada, texto introdutório e cinco diferenciais em fluxo contínuo, sem cartão redundante.
- **Resultados:** fundo claro, título de grande presença, categorias em `select` mobile e quatro indicadores 2×2 na visão geral; preservar textos, ícones e seleção CMS.
- **Formação/Ferramentas:** painéis escuros, formação com títulos longos legíveis e espaçamento reduzido; ferramentas em seis linhas com ícones SVG originais alternados, título principal com tamanho original.
- **Experiências:** faixa de seis logos, identidade da empresa e abas com hierarquia editorial, corpo contínuo de projetos vinculados às mídias; desktop não herda a regra sticky mobile. Abaixo de 621 px de altura, liberar a identidade em vez de esconder conteúdo.

Fontes tipográficas e desenho dos elementos são os já existentes no código. Último estado [`aa71737e`](https://github.com/tuliustsangaropulos/PortfolioTulius/commit/aa71737e48834bb987c4a7cb6a3353ae1cf221fb); paridade automatizada não equivale a aprovação estética humana. [Leia a especificação responsiva](RESPONSIVE_LAYOUT.md).

---

> **Arquivo legado por assunto:** seções datadas abaixo registram decisões e medições de seus próprios SHAs; não as tratar como status operacional atual.

## Mobile — composição revisada em 31/10/2026

Contratos visuais publicados [`494aba3`](https://github.com/tuliustsangaropulos/PortfolioTulius/commit/494aba3fa98d061c52fed4897e28349773534920): nome de abertura sem corte horizontal; retrato/selo/anos sem sobreposição prevista; painel Olá! dimensionado pelo conteúdo; tipografia principal mobile com escala comum; Formação e Ferramentas continuam com dois grupos editorialmente diferentes, sem cabeçalho principal duplicado; depoimentos compactos com expansão por toque; Contato com foto em alinhamento inferior. Nenhuma regra altera a composição desktop.

Medidas reais e testes [P3 #41180490449](https://github.com/tuliustsangaropulos/PortfolioTulius/actions/runs/41180490449): 360, 390, 430 px PASS; 13 seções desktop, 25 painéis mobile, 38 capturas sem falhas; 0 horizontal overflow. Permanecem as mídias originais e todo conteúdo editorial. O LCP mobile segue aberto (7,704 s).

## Revisão de experiências: badges, alternância tipográfica e CDI sem texto — 31/10/2026

- **Dados revisados no Supabase:** seis empresas com cinco tags editoriais cada. A Invest RS mantém as cinco competências já aceitas. Foram adicionados registros do tipo `{title: "Competências aplicadas", tags: [...]}` ao início de `content_blocks.content_json.items` do painel A da Prefeitura de São Paulo, Vale, TV Globo/SporTV, Grupo InPress e CDI Comunicação, preservando todos os demais itens, slides, métricas, status e coleções. Verificação SQL posterior confirmou **6/6 empresas com 5 tags**, sem alteração de schema, RLS, tabelas ou `career_experiences`.
- **Site público:** os botões `PROJETOS E REALIZAÇÕES` e `TRAJETÓRIA` usam agora **a mesma fonte de display e caixa alta**. O ativo fica maior e o inativo menor, invertendo a hierarquia quando o usuário seleciona Trajetória; os controles acessíveis `aria-pressed` e `aria-controls` foram preservados.
- **CMS:** `ContentStudio` ganhou campo dedicado **Competências aplicadas — tags abaixo do período**, uma por linha, salvando no próprio bloco A somente pelo botão Salvar existente. Há orientação sobre vínculo entre itens visíveis e títulos dos slides e atalho para a coleção `career_experiences`, que guarda o texto integral de Trajetória. Projetos, slides, competências e coleções não foram fundidos; não há autoescrita silenciosa.
- **CDI Comunicação — arte corrigida:** [job GitHub #41179537232](https://github.com/tuliustsangaropulos/PortfolioTulius/actions/runs/41179537232) **success**: três SVGs existentes descarregados do Storage, dois nós `<text>` removidos **por imagem** e checksum SHA-256 verificado. Três novos objetos publicados em `portfolio-generated/2026-10-31-cdi-no-text/`, com os três slides da CDI atualizados (3/3, verificação SQL posterior). **Os arquivos originais, proporção 1200×675 e conteúdos ilustrativos foram preservados**; não confundir com fotografias originais ou com as 19 outras ilustrações de 1200×1350. A rotina autenticada partiu de Storage privado e promoveu explicitamente ao público.
- **Verificações:** [CI #41179537245](https://github.com/tuliustsangaropulos/PortfolioTulius/actions/runs/41179537245) aprovado; revisão [`fb0caebd`](https://github.com/tuliustsangaropulos/PortfolioTulius/commit/fb0caebd98a32568355b4e3069958d664972ae7f) adicionou checagens de navegador de seis listas de badges, imagens CDI sem texto e tamanho/fonte dos controles. A [P3 #41179623669](https://github.com/tuliustsangaropulos/PortfolioTulius/actions/runs/41179623669) é uma medição separada; manter P3-PERF-01 aberto enquanto LCP mobile exceder 2,5 s. Não declarar homologação P2 transacional paga ou testes destrutivos.

## Lista de projetos integrada à galeria — 31/10/2026

A cor laranja e a borda esquerda identificam o **mesmo índice** na lista e no slide de projetos; botões sem bordas adicionais permitem clique, foco/teclado e `aria-current`. A seleção é elevada ao componente de experiência, compartilhada pelas versões desktop e mobile. Títulos dos slides são a fonte do vínculo; conteúdo oculto nunca é revelado por associação automática. Métricas sem imagem são exibidas em bloco compacto não clicável.

A visão `Trajetória` substitui os projetos e prioriza contexto e atividades não descritos nos slides. Apenas duplicações editoriais identificadas são omitidas na apresentação pública, sem deletar textos do CMS. Preservados aspecto visual, tipografia, ordem de slides, logos e mídias de 1200×1350 sem texto interno. [Código](https://github.com/tuliustsangaropulos/PortfolioTulius/commit/41a96e3715cdc47ee73ab225374cf72b2e739205).

## Experiências — componentes editoriais de 31/10/2026

A coluna esquerda apresenta cargo e período, seguidos de badges discretos com borda arredondada, `flex-wrap` e fonte pequena, usando **apenas tags existentes** no CMS (Invest RS tem cinco). A coluna central contém alternância exclusiva de visualização: `Projetos e realizações` (título grande) e `Trajetória` (menor), com `button`, `aria-pressed`, `aria-controls` e indicador visual ativo. A trajetória é texto editorial original; títulos iniciados por marcador até dois-pontos usam `strong`; a visão padrão continua sendo os projetos. O conteúdo mantém rolagem interna somente quando necessário no desktop.

A galeria preserva a legenda e o título **abaixo** da mídia, mas os 19 SVGs do conjunto `portfolio-generated/2026-10-31-no-text/` não incorporam palavras no desenho. Dimensões 1200×1350; 16 imagens nos slides, três adicionais no acervo. Imagens ilustrativas não devem ser apresentadas como registros documentais. Confirmação via [job de publicação #41178250462](https://github.com/tuliustsangaropulos/PortfolioTulius/actions/runs/41178250462).

## Ajustes administrativos do CMS — 31/10/2026

O editor usa biblioteca visual de 50 ícones em cinco categorias dentro de popover compacto, com estados de seleção, foco e Escape. Logo e slides das experiências têm labels e inputs alinhados pelo topo, sem alterar texto ou mídia. A escolha de imagem usa modal responsivo com rolagem interna; upload entra no bucket privado e só pode virar opção pública após publicação expressa. Esses componentes adotam a tipografia, contraste, indicadores e alvos de 44px do admin existente; a interface pública não foi redesenhada. Código [`6913d91`](https://github.com/tuliustsangaropulos/PortfolioTulius/commit/6913d91c71041457d3425836ee2e96f93677bc59). Inspeção visual específica ainda pendente e P2 transacional suspenso.

## Direção

Publicação editorial de alta energia: contraste entre grafite, laranja e papel; tipografia condensada; assimetria; linhas finas; numeração; selo circular e setas.

Tokens padrão: `orange #FF5414`, `ink #171617`, `paper #FAFAFA`, `cream #F8F4F1`, `muted #514742`, `orangeDark #BC390C`. Eles são editáveis em `design_tokens` e aplicados como custom properties validadas.

## Tipografia

- Big Shoulders Display: títulos e métricas, carregada do Google Fonts (OFL).
- Inter: textos e interface, carregada do Google Fonts (OFL).
- Neue Montreal: não servida até confirmação da licença web.
- Heading Now Trial: proibida no bundle e no repositório.

## Componentes

`Navigation`, `MobilePanel`, `ItemCard`, `Badge360`, headings editoriais, cards de métricas, timelines, tags, depoimentos e links de contato. Variações são controladas por `layout_variant`, `theme` e conteúdo, não por HTML arbitrário.

Texto pequeno usa grafite sobre laranja. Foco é visível; botões têm alvo mínimo de 44px.

## Ajustes da abertura — 25/10/2026

- Os cinco cards numerados do lado direito da primeira seção são links integrais, com feedback de hover e foco e paleta grafite/laranja; não confundir seus números (01–05) com o antigo contador de seções do header.
- O selo circular usa o texto padrão **VISÃO 360° DA COMUNICAÇÃO E MARKETING ·**, distribuído ao longo do caminho SVG e reposicionado acima do limite inferior do painel. O texto continua editável no conteúdo do herói.
- A seta inferior do painel direito anima somente o ícone em ciclo discreto; a regra global de `prefers-reduced-motion` impede animação contínua quando o usuário prefere movimento reduzido.
- Âncoras das seções desktop fazem alinhamento pelo topo, sem `scroll-margin-top` do header. O menu lateral tem o título literal **MENU**.

## Quantidade e distribuição dos textos — seções 02 e 03, 26/10/2026

A seção 02 (fundo laranja) apresenta **cinco declarações inicialmente** na coluna direita desktop; a lista é administrável e sua altura pode variar após inclusões/exclusões. A primeira declaração também acompanha a foto no painel A mobile; as demais são listadas no painel B mobile. Preservar o equilíbrio vertical, as regras de tamanho e o recorte central existentes e verificar visualmente quando a lista ultrapassar a altura disponível.

A seção 03 mantém seus **quatro indicadores** à esquerda/centro e exibe **cinco temas de especialidades** na coluna da direita, correspondentes aos cards 01–05 da abertura. Os números desses cards pertencem apenas à seção 01; os títulos da seção 03 não são numerados nem se tornam links nesta entrega.

## Seção 03 — interação e leitura (26/10/2026)

A apresentação conserva a coluna de título **Resultados e projetos em destaque** à esquerda. Na **Visão geral**, a área central mostra os quatro indicadores com ícones em lugar dos números 01–04. A coluna direita apresenta os cinco temas e a opção de retorno à visão geral como botões com hover, foco visível e estado ativo. Ao selecionar tema, o centro apresenta seu eixo, título, subtítulo, temas relacionados, texto curto, conteúdo de Competências reaproveitado e indicadores somente quando pertinentes. Os cinco cards clicáveis da abertura abrem `#resultados` no tema escolhido.

O mobile apresenta títulos/filtros e conteúdo central em sequência em um único painel. Em desktop de altura reduzida, a área central poderá rolar independentemente para manter o bloco temático acessível; validar legibilidade e ausência de cortes. Preservar as cores, fontes, proporções dos cards, contrastes e `prefers-reduced-motion` já definidos.

Os textos originais de **Habilidades**, **Gestão**, **Competências**, **Relações** e **Destaques** da antiga seção 04 estão agora visíveis como destaques de apoio nos dossiês pertinentes. Os registros da seção 04 continuam conservados no CMS e a seção não aparece mais no site público.

## Direção visual — Formação e seis experiências (26/10/2026)

**Formação:** fundo cinza-escuro da identidade `#171617`; títulos e corpo brancos, elementos de destaque laranja. Mesmos conteúdos e tipografia.

**Experiências:** fundo branco uniforme, seis painéis com sobreposição por rolagem vertical (o seguinte fica acima do anterior). Cabeçalho geral permanece; abaixo, uma barra de seleção fixa contém marca pequena + título de cada empresa e estado ativo. Na ausência da logomarca real, usar monograma **identificado como provisório**. Conteúdo do painel: pequeno logo acima do título; lista de projetos e realizações; galeria visual à direita com enquadramento consistente, legenda, contador, navegação por setas e indicadores clicáveis.

Os 18 slots de mídia representam temas de projeto reais, mas **as imagens ainda não existem no acervo aprovado**. O componente mantém placeholders textuais com contraste e não exibe imagens de bancos de imagens como prova do trabalho. O CMS define URLs e descrições acessíveis para futura substituição. Mobile usa nav horizontal rolável, conteúdo textual seguido da galeria; respeitar `prefers-reduced-motion`. Validar a experiência sticky em navegadores móveis e telas baixas para evitar bloqueios de scroll.

**Ajuste responsivo posterior à captura:** a auditoria visual encontrou a galeria mobile parcialmente coberta por conteúdo do próximo empregador quando se mantinha `position:sticky` em painéis mais altos que o viewport. A partir do commit `6cfe4d04`, a sobreposição sticky é **exclusiva do desktop/tablet**, e no mobile os painéis de experiência voltam a `position:relative`, permitindo leitura integral; a barra de empresas continua sticky e horizontal. Publicação desse ajuste depende de nova disponibilidade de deploy na Vercel.

## Ferramentas e estados de interação — 26/10/2026

**Ferramentas:** substituir o creme anterior pelo cinza-escuro da identidade (`var(--ink)`) em toda a seção; texto auxiliar branco, títulos alternando branco/laranja para dar hierarquia. Cada grupo da coluna direita ganha de dois a três círculos laranja com pictogramas SVG brancos, compondo blocos próximos à referência enviada. Os ícones representam plataformas e práticas por ilustração vetorial local, sem afirmar que são logos oficiais. Ajustar tamanho para desktop, tablet e mobile; manter conteúdo textual e contrastes.

**Seção 01:** os seis cards de histórico profissional recebem interação na superfície inteira, com fundo sutil alaranjado, linha de acento à esquerda, título em laranja-escuro e foco visível. Não aplicar esse estilo à fotografia nem aos cinco cards temáticos (que mantêm o hover anterior).

**Contato:** títulos de canais e valores são brancos ao passar o cursor ou focalizar o link; o fundo laranja, o texto secundário e o ícone de seta permanecem.

## Verificação manual: experiências, depoimentos e contato (28/10/2026)

O volume da coluna de experiências é editorialmente controlado: até seis itens visíveis como composição padrão, com os excedentes ocultos no CMS, nunca descartados. Os depoimentos usam cards quadrados uniformes (3 colunas × 2 linhas desktop), texto com truncamento em linhas e expansão sob clique/teclado; o card expandido ocupa duas linhas e a grade reacomoda os demais. A identificação **fictícia** dos dois exemplos é explícita.

Contato passa a ter três colunas: chamada à esquerda, retrato central de altura disponível, links à direita; assinatura e localização compõem faixa de rodapé. As setas dos links ocupam coluna própria, sem cobrir URLs. No mobile a foto, os links e o rodapé permanecem acessíveis em fluxo vertical.

## Media framing contextual — revisão manual (28/10/2026)

O CMS exibe dimensões esperadas **como referência de composição**, não como redimensionamento automático: herói e foto de Contato aproximadamente 900×1200 (3:4), miniquadros 600×600 (1:1), foto central de Olá! aproximadamente 900×1200 (3:4), logos quadrados aproximadamente 400×400, slides de experiência 900×1000 (9:10) e Open Graph 1200×630. Uma janela com prévia de proporção, X, Y e zoom aplica apenas o recorte de apresentação por área. Fotos e logos originais preservados; arquivos do Storage não são processados. As seções editoriais especiais mantêm composição/efeitos fixos; os controles correspondentes permanecem desabilitados na UI em vez de produzir alterações falsas.

### Referência visual desktop mais recente (29/10/2026)

A nova solicitação do proprietário **substituiu** a captura anterior que buscava 125%: **o aspecto desejado a 100% agora é o visto a 75%** no anexo mais recente, em desktop ~1512×691. A implementação é localizada na mídia `min-width:1101px`, sem zoom/scale global e sem alterar dados. O P3 [#40806132632](https://github.com/tuliustsangaropulos/PortfolioTulius/actions/runs/40806132632) passou: início do título 66 px, cards 199–279 px, quatro destaques até 669 px e sobreposição selo/anos zero, além dos 13/25 painéis e 38 capturas. A meta LCP mobile ≤2,5 s permanece aberta. Esta referência **prevalece** sobre as referências anteriores a 75%/125% documentadas no histórico. O aceite estético da última mudança ainda depende de inspeção do proprietário.

## Refinamento tipográfico pontual da primeira seção — 29/10/2026

**Pedido atendido:** melhorar a legibilidade dos textos menores, o ritmo dos quatro destaques laterais e a numeração dos cinco cards da abertura, **sem alterar a composição editorial aprovada**. A intervenção está estritamente localizada no CSS `@media (min-width: 1101px)`: mantém a divisão das colunas, retrato, selo 360°, título principal, paleta, conteúdo, foto e layout mobile.

- Legibilidade: descrições das experiências e dos destaques laterais agora têm ao menos **11,52 px** no viewport de referência; frase em itálico **12,64 px**; títulos dos destaques com incremento discreto.
- Competências: numeração laranja dos cinco cards em **9,76 px**, mantendo fundo, posição, links e contraste.
- Compensação de microespaçamentos na coluna esquerda (gap entre introdução e lista, gap dos destaques e padding dos itens) para não empurrar `IDIOMAS` para fora da primeira dobra.
- **Proibida a reintrodução de zoom/transform global.** O tamanho do título principal, o selo e a fotografia não mudaram.

**Evidência do SHA funcional:** [`c098a60`](https://github.com/tuliustsangaropulos/PortfolioTulius/commit/c098a60d306601ac7d2e8e24ba41be80891832fd), [CI #40807420317](https://github.com/tuliustsangaropulos/PortfolioTulius/actions/runs/40807420317) **success** e [P3 #40807420323](https://github.com/tuliustsangaropulos/PortfolioTulius/actions/runs/40807420323) **success**. No viewport **1512×691**, com escala CSS nativa 1: cabeçalho 54 px; título a 66 px; cards de 199 a 281 px; último destaque termina em 669,39 px; **sobreposição selo/anos = 0 px²**. P3: **13 seções, 25 painéis mobile, 38 capturas, 0 falhas e P5 anônimo 3/3 sem mutações**. Lighthouse mediano: mobile Performance 82, **LCP 4,45 s** (meta ≤2,5 s **ainda não atendida**); desktop Performance 98, LCP 1,15 s. Nenhuma mudança Supabase, Storage, CMS, migração, token ou custo.

A referência visual de densidade continua sendo a **última captura fornecida com o navegador a 75%, desejada a 100%**; as referências antigas ficam como histórico. A comparação estética final em navegador físico fica a critério do proprietário, sem reabrir aceites anteriores.

## Menu público sem grupos — compactação final (29/10/2026)

**Solicitação do proprietário:** manter as oito opções integralmente visíveis, evitando rolagem vertical nas alturas usuais; remover da navegação pública os subtítulos `PERFIL`, `EXPERIÊNCIA`, `REFERÊNCIAS` e a assinatura `Comunicação · Estratégia · Reputação`. Não modificar nomes, ordem, numeração nem âncoras dos oito links.

**Implementação:** `src/components/public/Navigation.tsx` não renderiza títulos de grupo nem a assinatura estática. `src/index.css` usa espaçamento compacto e linhas com `grid-auto-rows: clamp(44px, 9dvh, 72px)`; todos os alvos têm altura mínima de 44 px. A rolagem permanece apenas como fallback para zoom de acessibilidade, excesso futuro de itens ou viewport excepcionalmente baixo. Menu responsivo sem `zoom` CSS ou mudanças na identidade visual.

**Admin:** `NavigationStudio` remove o campo de grupos, mantém rótulo, âncora, status, visibilidade, reordenação e salvar. Novos registros e gravações posteriores usam `group_name='Menu'` por compatibilidade com a coluna existente. **Supabase:** os 14 registros da tabela `public.navigation_items` foram atualizados apenas no campo `group_name` de Perfil/Experiência/Referências para `Menu`, transação com guardas de 14 totais e 8 visíveis. Conferência após atualização: **14 registrados, 8 visíveis, 6 ocultos, grupo único Menu**. Sem DDL, alterações RLS, exclusões, mudança de textos/âncoras, custos ou migrações; a frase final era hardcoded, não existia em `site_settings`.

**Evidência:** commit funcional [`bfd3f7e`](https://github.com/tuliustsangaropulos/PortfolioTulius/commit/bfd3f7e25b03dc6fa0e647f44eb1f3bb92905f96) com formatação no [`0e06df6`](https://github.com/tuliustsangaropulos/PortfolioTulius/commit/0e06df6c031e01da3bf9453f8a6246d1f80409b1), [CI #40810591049](https://github.com/tuliustsangaropulos/PortfolioTulius/actions/runs/40810591049) **success** e [P3 #40810488285](https://github.com/tuliustsangaropulos/PortfolioTulius/actions/runs/40810488285) **success**. Teste `P3_MENU_FIT_MOBILE` em **390×844**: 8 links, grupos 0, footer ausente, `scrollHeight=clientHeight=844`, último link até y=662,09. Teste `P3_MENU_FIT_DESKTOP` em **1512×691**: 8 links, grupos 0, footer ausente, `scrollHeight=clientHeight=691`, último link até y=573,58. P3: **0 falhas**, 13 seções, 25 painéis mobile, 38 capturas, P5 anônimo 3/3, zero mutações. Mobile Lighthouse Performance 82, LCP **4,44 s**, meta ≤2,5 s ainda aberta; desktop LCP **1,18 s**.

**Prevenção:** os testes P3 agora verificam número de links, ausência de grupos/rodapé, ausência de rolagem interna e visibilidade do último link, além de foco e Escape. A frente de P2 transacional segue suspensa; não equiparar o teste de leitura pública à homologação de escrita CMS com JWT real.


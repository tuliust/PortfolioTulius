# Responsividade, UX e acessibilidade

## Alinhamento do retrato de Contato à divisória mobile — 26/11/2026

O proprietário esclareceu que o pedido anterior se referia a Contato, não a Olá. As duas regras introduzidas em `1c54047` para Sobre foram revertidas, restaurando o espaçamento anterior. Em Contato, a transição laranja/grafite de #contato-a e o recuo inferior do retrato passam a compartilhar a variável CSS `--contact-mobile-divider-inset` (mesmo clamp responsivo já existente). Apenas no site público mobile, excluindo PDF, o contêiner reserva essa distância abaixo da imagem e altura mínima suficiente para manter a escala sem invadir o título. O painel pode crescer se necessário em viewports curtos. Mantêm-se a cor, a mídia original, o enquadramento CMS, o conteúdo e a composição desktop/PDF. Não há escrita no Supabase. Teste geométrico Chromium em fixture isolada (320×568, 360×640, 375×667, 390×844, 414×896, 430×932, 767×600 e 390×500) confirmou diferença inferior a 0,1 CSS px entre a base da caixa da imagem e a linha de transição, sem sobreposição do título; isolamento PDF/desktop também verificado. O teste não comprova os pixels opacos da mídia real, o build completo ou a homologação no iPhone. CI e publicação do novo SHA devem ser conferidos separadamente.

## Enquadramento horizontal do retrato da abertura mobile — 26/11/2026

Somente na abertura editorial pública `#perfil-a` até 767 px (excluindo `.pdf-portfolio`), o enquadramento horizontal neutro (x=50) passa a ancorar a borda direita da fotografia (`object-position: 100%`), deslocando a imagem para a esquerda quando `cover` recorta horizontalmente. Valores horizontais não neutros definidos no CMS, posição vertical, zoom, escala, transparência, dimensões da moldura e textos permanecem preservados. O PDF mantém a posição original; desktop, dados Supabase e arquivos de mídia não mudam. Fixture Chromium isolada confirmou a cascata em 320, 360, 375, 390, 414, 430 e 900 px, incluindo isolamento PDF e posição personalizada; build completo, CI e conferência visual de produção ainda pendentes de verificação por SHA.

## Destinos de snap estáveis nas Experiências desktop — 25/11/2026

A navegação continua apontando para marcadores em fluxo `experience-anchor-<slug>`. Esses marcadores passam também a receber `scroll-snap-align: start` em ≥768 px; `.experience-card` usa `scroll-snap-align: none` somente nesse intervalo. Isso impede que o snap escolha uma posição transitória da animação translate/scale da ficha. As fichas conservam sticky, entrada animada, quadro 1:1, cores, conteúdo e posição final. Mobile não foi alterado. O P3 anterior observou destino deslocado −14,234375 px com hash/seleção corretos; a matriz de 30 transições e tolerância de 3 px foi aprovada no P3 #45704116739, código funcional `65b9e69`, com zero falhas de navegador. [Evidências](../05-operacao/TESTES_E_HOMOLOGACAO.md).


## Conferência posterior das cinco correções de interface — 25/11/2026

[P3 #45691463355](https://github.com/tuliust/PortfolioTulius/actions/runs/45691463355) confirmou `P3_DEPLOYMENT_GATE` para `444fee647f96adf61ce72f9a2c07f3ec4af1cc4b` em produção. Evidências parciais **PASS**: 30/30 transições bidirecionais, máscara do cabeçalho na Prefeitura e CDI, molduras quadradas e centralizadas nos dez viewports desktop (incluindo 900 × 600), transparência computada da foto nos seis viewports mobile (320, 360, 375, 390, 414 e 430 px), paridade SEO (incluindo `ogImage`) e leitura pública RLS. **P3 global FAILURE**: cinco falhas no browser; entre elas, timeout de controles de slide e seletor de projeto Invest RS não encontrado. LCP mobile mediano **5.313,371 ms** (meta ≤3.500 ms; amostras 5.445,061 / 5.313,371 / 5.285,598 ms), desktop **1.181,706 ms** PASS. Não atribuir a piora à foto ou a um commit sem investigação específica. Em `a21c55f`, o P3 falhou no teste de navegação por timeout e registrou cinco falhas de browser, apesar do LCP mobile de 3.390,356 ms PASS; a verificação posterior de 30/30 em produção é evidência nova, não reclassificação do run anterior. Canal alfa do PNG, WhatsApp em dispositivo real, aceite visual final e PDF real após as alterações de 25/11 permanecem não confirmados.

O quadro 1:1, hierarquia de identificação, máscara de cabeçalho, âncoras desktop e transparência de Perfil permanecem como descritos nos registros de implementação abaixo. A comprovação parcial no último P3 atualiza as menções anteriores a testes pendentes, sem afirmar aprovação global. [Matriz de CI](../05-operacao/TESTES_E_HOMOLOGACAO.md).

## Transparência do retrato da abertura editorial mobile — 25/11/2026

Na abertura pública `#perfil-a`, a regra base `.mobile360-photo` aplicava `background: var(--ink)` mesmo com a área inferior configurada no CMS como `#FAFAFA`. A partir deste ajuste, somente no site público mobile (até 767 px, excluindo `.pdf-portfolio`), a moldura usa fundo transparente e deixa transparecer a cor configurada em `hero.mobileEditorial.bottom.background`, sem alterar o PNG, geometria, filtro, enquadramento, desktop ou PDF. O Supabase publicado referencia o mesmo PNG em `image` e `hero.mobileEditorial.mobileImage`. O canal alfa do objeto remoto não foi inspecionado por indisponibilidade de acesso binário no ambiente de execução; eventual fundo incorporado ao arquivo não é removido por CSS. O P3 verifica a transparência computada da moldura; homologação visual e CI do novo SHA pendentes neste registro.

## Navegação bidirecional no índice de Experiências — 25/11/2026

No desktop, os painéis `position: sticky` mantêm sua posição visual ao rolar; a âncora HTML do próprio painel não representa sua posição original após ele ficar atrás dos seguintes. `ExperienceStack` renderiza marcadores vazios, sem altura e fora do sticky (`experience-anchor-<slug>`) imediatamente antes de cada painel desktop. O clique normal ou por teclado usa a coordenada absoluta desse marcador com rolagem instantânea, preserva o hash público `#empresa`, registra histórico e mantém foco no link. Cliques modificados continuam nativos. O indicador ativo usa os mesmos marcadores; `PublicSite` e `Navigation` usam o destino estável para acesso por hash, histórico e menu principal. Mobile mantém montagem seletiva, rolagem e comportamento anteriores. Nenhuma mudança em CSS, empilhamento, galeria, dados, CMS ou PDF. P3 passa a verificar os 30 pares ordenados de empresas, painel efetivamente visível, hash, destaque e direção de rolagem. Homologação no site e CI do novo SHA pendentes neste registro.

## Cabeçalho opaco durante o menu sticky das Experiências — 25/11/2026

O cabeçalho fixo desktop era transparente: durante a rolagem das fichas sticky, textos, logos e imagens podiam aparecer atrás da marca e do botão MENU, acima do índice de empresas. `ExperienceStack` passa a identificar a posição sticky do índice também no desktop, reaproveitando a leitura geométrica existente. Em `src/index.css`, apenas a partir de 768 px e enquanto `.experience-index.is-stuck` estiver presente, o cabeçalho recebe fundo opaco `var(--paper)`, texto/foco `var(--ink)` e a marca normal laranja/grafite. Ao sair dessa condição, retorna ao estilo anterior. Não altera altura, z-index, posicionamento, rolagem, âncoras, galeria, conteúdos nem o comportamento mobile. P3 inclui verificação no navegador para Prefeitura e CDI; execução do novo SHA e aceite visual ainda não confirmados neste registro.

## Hierarquia de cargo, período e localização nas Experiências — 25/11/2026

`ExperienceIntro` em `src/components/public/ExperienceStack.tsx` estende às seis experiências o tratamento antes exclusivo da Invest RS: cargo/unidade no primeiro bloco textual e período/localização em `span.experience-period`, com `display: block`, escala menor e peso 600 definidos no CSS existente (inclusive regra mobile). Quebras naturais continuam permitidas; um `|` terminal sem complemento é removido na apresentação, e o separador válido usa espaço inseparável após a barra para não ficar órfão no final da linha. Mantêm-se textos, cargos, períodos, locais, competências, mídias e dados originais. O componente compartilhado também aplica a hierarquia ao PDF Desktop/Mobile, sem alterar CSS de impressão. Testes unitários adicionados; homologação visual e CI do novo SHA ainda não confirmados neste registro.

## Moldura quadrada das galerias de Experiências — 25/11/2026

No código público, `.experience-media-frame` passa a usar `aspect-ratio: 1` nas seis experiências. Desktop: `width: min(100%, 57svh)` e `margin-inline: auto` limitam **os dois eixos** à largura disponível e ao orçamento de altura original; eventual espaço restante fica fora do quadro, na coluna. Mobile: largura de 100% do espaço disponível, sem teto de altura, inclusive no acordeão de projetos. Imagens permanecem em `object-fit: contain`, referência de **1600 × 1600 px**; quadros e imagens quadradas sem zoom adicional não têm faixas internas. Imagens não quadradas ainda podem ter margens. Vídeos mantêm `cover` (podem recortar mais ou menos conforme a proporção) e `contain` em fullscreen. Legendas, controles, autoplay, CMS e dados não foram alterados. O renderer PDF usa `PdfExperienceSection` estático, sem galeria. O P3 inclui verificações de geometria; homologação em navegador e CI do novo SHA ainda pendentes no momento deste registro. A seção histórica de 17/11 descreve a geometria anterior.

## Reprodução automática e preenchimento do vídeo — 24/11/2026

O player público de Experiências preenche o quadro existente no desktop/mobile com `object-fit: cover; object-position: center`; sem distorção, podendo recortar bordas quando a proporção do arquivo divergir da do quadro. Em tela cheia usa `contain`. As imagens permanecem em `contain`. Autoplay inicialmente mudo somente para a empresa/slide ativo com pelo menos 25% de interseção visível e aba ativa; pausa fora da tela, na troca ou aba oculta. A preferência por movimento reduzido impede autoplay. Controles nativos continuam disponíveis. O teste Chromium sintético confirmou dimensões de vídeo iguais às do quadro, fit cover, autoplay mudo e pausa fora da tela em desktop/mobile, e ausência de autoplay com redução de movimento.

## Verificação do formulário administrativo de Experiências — 23/11/2026

No SHA `6c25100`, Validate e P5 Admin Read-Only E2E concluíram em **SUCCESS**. A inspeção autenticada e sem gravações confirmou o título secundário em caixa alta com escala maior que o texto de apoio, as três legendas compactas, títulos e estados de exibição em duas linhas e placeholders dos campos. O CSS está escopado no painel administrativo e a grade dos controles passa a uma coluna em viewport estreito; não houve alteração no layout público.

Na auditoria P3 do mesmo conjunto de CSS (SHA `a11a55e`), o browser público obteve **zero falhas** e 38 capturas aprovadas, mas P3 global **FAILURE** exclusivamente pelo LCP mobile de **3.634,864 ms**, superior à meta de **3.500 ms**. Não se considera o LCP corrigido e não foi feita nova auditoria visual autenticada por screenshot do formulário.

## Editor de Experiências — hierarquia e adaptação do formulário administrativo (23/11/2026)

Ajuste **restrito ao painel admin**, na aba **Experiências Profissionais → Projetos**. O título secundário da ficha, os textos de orientação, os marcadores Centro/Slide/Oculto, as legendas dos três grupos, labels, placeholders e nota de rodapé utilizam a escala tipográfica do CMS existente, sem afetar o renderer público. O `fieldset` permanece semântico e contém uma grade própria para alinhar os controles; abaixo de 768 px, a grade passa a **uma coluna**, com foco visível e os alvos de toque preexistentes preservados. Classes são escopadas em `experience-projects-editor`, sem alteração de identidade visual global, movimento, SEO ou dados.

## Evidência do carrossel publicado — P3 23/11/2026

No SHA `1a352d4`, a auditoria browser [#45202551715](https://github.com/tuliust/PortfolioTulius/actions/runs/45202551715) confirmou `P3_PROJECT_GALLERY_LINK PASS` e `P3_EXPERIENCE_AUTOPLAY PASS`: os dois slides da Invest RS alternam com os projetos centrais corretos; após clique o quadro permaneceu estável aos 3,3 s, avançou após 8 s e retomou 3 s no ciclo seguinte. A avaliação de rotas/responsividade registrou **zero falhas**, e as 38 capturas visuais foram aprovadas. A preferência por movimento reduzido continua desativando o timer.

A mesma execução P3 global terminou **FAILURE somente por LCP mobile mediano 3.575,809 ms > 3.500 ms**, com desktop LCP 945,505 ms **PASS**. Esse indicador de desempenho é uma pendência residual, não uma falha observada de seleção, sincronização ou autoplay; manter o orçamento e não classificá-lo como corrigido.

## Estado real do carrossel das Experiências — 23/11/2026

Com a coleção canônica publicada, cada empresa tem cinco realizações centrais; a Invest RS exibe **dois slides vinculados** (Guia de Boas-Vindas, Organização de eventos), enquanto as outras empresas exibem três. O destaque do item central segue a troca de slide, por ID; títulos diferentes entre centro e slide não impedem a associação. A troca automática é de 3 s, com retomada após 8 s quando há interação. A implementação respeita `prefers-reduced-motion`, visibilidade da aba, empresa ativa e galerias com menos de dois slides. P3 valida o ciclo real no navegador; o estado da execução deve ser consultado pelo SHA.

## Experiências — sincronização e avanço automático (23/11/2026)

A galeria troca a cada **3 segundos** enquanto a empresa é a seção ativa. Ao clicar em projeto central, seta ou marcador, o próximo avanço só acontece **8 segundos** depois; o ciclo subsequente volta a 3 s. O destaque do cartão central acompanha o ID do slide em desktop e o acordeão sincroniza o projeto correspondente no mobile. Centro/slide podem ser ocultos independentemente, sem obrigar todos os projetos a ter imagem.

A rotação é suspensa com a aba oculta, menos de dois slides, empresa inativa ou preferência de usuário por movimento reduzido. Preservar foco, alvos móveis, contraste, alt e geometria existente; validar especialmente rotação, seleção e screenshots que dependem do primeiro slide.

## Resultado vigente do PDF — 18/11/2026

Após a regressão real de impressão descrita ao final deste documento, o proprietário reexportou **Desktop e Mobile** e confirmou o **aceite visual** de ambos. O Desktop usa o iframe de referência 1440 px e não perde painéis em uma aba estreita; o Mobile mantém os cinco diferenciais na mesma folha e conserva a paginação física de referência 390 px. Código funcional `609218b`, QA sintético **SUCCESS**; não houve alteração do CSS ou da experiência pública. Contrato atual: [Exportação PDF](../05-operacao/EXPORTACAO_PDF.md). Registros anteriores sobre “aceite pendente” são históricos.

---

**Status:** contrato de apresentação · **Revisão:** 16/11/2026.

## Modelo
São 14 seções lógicas, 42 painéis cadastrados (desktop, mobile-a, mobile-b para cada seção), mas 13 seções publicadas e visíveis; `competencias` permanece oculta, não excluída. A apresentação mobile A/B é editorialmente distinta do desktop, com conteúdo compartilhado e placements próprios.

Não limitar textos longos a `100dvh`/`overflow:hidden` que tornem conteúdo inacessível. O admin possui prévia mobile em referência **390 × 844**, sem substituir um aparelho real.

## Ajustes mobile de 11/11/2026 (registro histórico; refinado em 12/11)

- **Perfil**: o painel A editorial contém título, apoio, fotografia, nome, experiência e a seta centralizada **abaixo** da composição; utiliza altura mínima da área visível do celular (`100svh`), sem cortar conteúdo em telas pequenas ou zoom. O selo agora é exibido antes de “Áreas de Atuação” no painel B, sem duplicar o JSONB.
- **Selo**: os valores publicados específicos do mobile são fundo claro `#FAFAFA` e inscrição/contorno/seta `#FF5414`; o editor mobile continua controlando texto, cores, tamanho, fonte, espaçamento e visibilidade em `perfil`/A.
- **Resultados**: a visão geral distribui quatro indicadores no espaço vertical restante e o seletor tem respiro maior; outros temas continuam com altura conforme o conteúdo.
- **Formação**: os painéis A/B ocupam juntos no mínimo `100svh`, com maior respiro após os títulos e distribuição dos itens. Conteúdo extenso nunca deve ser cortado.
- **Experiências**: ao atingir a posição sticky, a fileira laranja de logos revela o microtexto “SELECIONE UMA EMPRESA ACIMA”; competências/badges são ocultas apenas na visualização mobile, preservadas no CMS e desktop.
- **Contato**: somente o painel B utiliza grafite (`--ink`), títulos e detalhes brancos/laranjas (`--paper`/`--orange`) e rodapé centralizado; painel A e desktop mantêm o visual aprovado.
- As regras de composição estão restritas a telas de até 767 px; verificar leitura, âncoras, foco, rolagem, safe-area e redução de movimento. Deploy READY não substitui homologação mobile real.

## Navegação e interação
Conservar âncoras/hash, rolagem nativa, `scroll-margin` para header fixo, menu acessível, fechamento por Escape, foco/Tab, Voltar e visibilidade da seção ativa. [`ExperienceStack.tsx`](../../src/components/public/ExperienceStack.tsx) mantém logos/identidade sticky somente dentro das seis experiências, sem rolagem interna; em altura **≤620 px**, o header editorial pode deixar de ficar sticky.

Evitar animações pesadas e respeitar `prefers-reduced-motion`. Imagens precisam de alt apropriado; usar sincronização de metadados do catálogo. Verificar contraste e não esconder conteúdo após zoom.

## Regressão
Viewports históricos: **1920×1080, 1440×900, 1366×768, 768×1024, 720×450, 390×844, 360×800, 320×700**. Conferir imagens, overflow, menu, âncoras, foco, altura reduzida e mobile. P3 mede também LCP, mas aceite estético e orçamento de performance são evidências separadas.

[Design](IDENTIDADE_VISUAL.md) · [CI](../05-operacao/TESTES_E_HOMOLOGACAO.md).

## Refinamentos após conferência no iPhone (12/11/2026)

- **Todas as telas:** o status transitório “Sincronizando conteúdo…” deixou de ser um toast fixo no canto inferior. Avisos reais de erro e o estado vazio continuam distintos.
- **Abertura mobile (≤767 px):** título “CONEXÕES / AUTÊNTICAS. / INOVAÇÃO.” e nome em duas linhas ampliados por `clamp()` (o tamanho máximo e demais propriedades existentes ainda são definidos pelo editor do Hero). A fotografia fica alinhada à borda esquerda e à base de sua grade; o botão de rolar mantém sua posição independente abaixo da composição. Conferir os dispositivos mais estreitos para não haver overflow.
- **Resultados:** somente os separadores horizontais dos indicadores 03 e 04 foram deslocados para cima; não há mudança nos valores ou na altura efetiva dos cards.
- **Formação:** bordas superiores do primeiro item de cada painel removidas visualmente; o subtítulo de idiomas ganha maior distância e fonte, e as linhas de instituições/períodos recebem tipografia menor. Os dados continuam no CMS.
- **Experiências:** a numeração de cada projeto fica afastada da régua esquerda; ao selecionar outro projeto, o conteúdo aberto é alinhado abaixo de cabeçalho, índice de empresas e cabeçalho sticky da experiência. Acessibilidade e clique nos outros projetos precisam permanecer operacionais.
- **Contato:** os pixels transparentes do limite inferior da imagem em PNG revelam um fundo grafite em degradê abrupto no painel A, sem transladar a imagem para fora do painel; o desktop permanece igual. A arte não foi recortada/destruída no Storage.

## Ajuste da primeira dobra, Formação e Contato no iPhone (12/11/2026)

- **Somente mobile (≤767 px).** Na abertura `#perfil-a`, a primeira dobra corresponde a `100svh`; o botão `#perfil-b` é ancorado no rodapé da coluna inferior como elemento absoluto, mantendo-se visível sem rolar e podendo sobrepor a fotografia. A fotografia termina na base do painel, sem o antigo espaço reservado pela seta. Em telas muito baixas (≤560 px) o conteúdo conserva rolagem natural para não cortar texto.
- A primeira linha **TULIUS** recebe escala tipográfica de `1.38em` sobre a fonte mobile do CMS, para aproximar sua largura da primeira letra “O” do sobrenome **TSANGAROPULOS**, sem alterar a segunda linha.
- Os campos já existentes no editor **Perfil → Abertura Editorial 360°** têm os valores publicados `top.paddingY=18` e `bottom.paddingY=0`. A primeira linha da abertura, a fotografia, o nome, o histórico e a seta usam a mesma configuração `hero.mobileEditorial`; não criar segunda cópia nem alterar CSS desktop.
- **Formação:** deslocamento visual leve do subtítulo “IDIOMAS E FORMAÇÃO COMPLEMENTAR” para equilibrar o respiro entre a linha divisória superior e o primeiro idioma; fontes e registros do CMS não mudam.
- **Contato:** removido o gradiente estreito que pintava apenas o contêiner da foto; a faixa grafite ocupa agora toda a largura do painel A, começando na base visível do retrato e encontrando a área B sem lateral laranja. PNG e enquadramento originais mantidos.
- Após publicar, checar em dispositivo iOS real a seta com barras do Safari visíveis, a composição do nome e a transição de cor; os testes Chrome e Lighthouse são evidência automatizada separada.

## Correções mobile adicionais após capturas de 12/11/2026

- **Perfil/A:** todos os textos da coluna à direita da fotografia (`TULIUS TSANGAROPULOS`, experiência e descrição) têm respiro inferior suficiente para não sobrepor o botão de descer, sem modificar o próprio botão. Na primeira dobra, o `overflow` do grid da foto passa a ser visível para que a margem negativa existente alcance a borda esquerda, sem recortar a imagem nem alterar o desktop.
- **Perfil/B:** o fundo do selo, inclusive a área superior até a borda do painel, recebe a cor da identidade `color.lightGray` (`--light-gray`, `#ECECEC` inicialmente). O fundo cinza termina exatamente onde começa a régua horizontal laranja sobre “Áreas de Atuação”; a partir daí, a lista mantém fundo `color.paper`. O CSS transfere o espaço de cabeçalho do painel para a faixa do selo sem duplicar o valor da cor.
- **Formação/B:** “Idiomas e Formação Complementar” recebe leve aumento de tamanho (`clamp(1.5rem, 6.4vw, 2rem)`) e peso **900** da família já existente. A posição/ordem e as informações educacionais publicadas permanecem intactas.
- **Contato/B:** removida somente a borda horizontal no início do painel inferior, acima de “Canais de Contato”, e ampliado o subtítulo (`clamp(1.52rem, 6.6vw, 2rem)`, peso 900), preservando os separadores internos dos canais de contato e o desktop.
- **Verificação:** preservar os seis viewports mobile de 320 a 430 px, os conteúdos legíveis sem horizontal overflow, o contraste do selo, a navegação, os dados compartilhados com desktop e o orçamento LCP mediano de até 3,5 s.

## Decodificação do retrato na abertura mobile (12/11/2026)

O único `ApprovedProfileImage` da abertura editorial mobile recebe `syncDecode`, que usa `decoding="sync"` para priorizar a apresentação do retrato LCP; chamadas do mesmo componente no desktop e em outras seções mantêm `decoding="async"`. A alteração não modifica arquivo, crop, art direction, `fetchPriority="high"`, carregamento `eager` nem os dados do CMS. Comparar as três medições Lighthouse e confirmar que a mudança não piorou o carregamento; não afrouxar o orçamento de 3,5 segundos.

## Refinamentos exclusivos do desktop — 12/11/2026

- **Perfil:** frase editorial e quatro destaques da coluna escura usam tamanhos e espaçamentos próprios do desktop; os seis títulos das empresas respeitam `items[].desktop.titleSize`. Aumento de fontes combinado com compactação vertical; textos, imagens, cores e links mantidos.
- **Seta:** o link da próxima seção é filho direto de `profile-desktop` e centralizado a 50% da **tela inteira**, não da coluna direita. Em alturas compactas, o conteúdo pode crescer e rolar em vez de ser cortado.
- **Resultados:** título/indicadores e indicadores/seletor usam o mesmo `--results-column-gap` horizontal, preservando valores e filtragem.
- **Formação:** títulos dos cursos e idiomas respeitam `items[].desktop.titleSize`; o CSS tem fallback ampliado apenas quando não definido no CMS.
- **Sobre (“Olá!”):** a foto desktop já publicada é deslocada dentro do contêiner, eliminando a faixa inferior laranja sem substituir ou editar o arquivo no Storage.
- **Isolamento:** regras novas limitadas a `@media (min-width: 768px)` e ao `ProfileDesktop`. Os componentes mobile e `hero.mobileEditorial` não foram alterados. Validar também alturas baixas, zoom, navegação e 320–430 px mobile.

### Ajuste fino após auditoria da composição desktop (12/11/2026)

Em janelas desktop de altura até 760 px, o indicador de experiência da primeira tela recebe recuo superior de até 24 px para não tocar o selo circular — sem modificar dimensão ou arquivo da fotografia. O retrato de Sobre permanece recortado pelo próprio contêiner com `overflow:hidden`; seu elemento pode se estender até abaixo da borda para compensar a faixa transparente, mas o conteúdo visível termina na borda da seção. A seta central deve coincidir com o meio do viewport desktop.

### Evidência objetiva do refinamento desktop (12/11/2026)

Em 1512 × 691 px, [P3 #43197029431](https://github.com/tuliustsangaropulos/PortfolioTulius/actions/runs/43197029431) registrou: seta centralizada em **X = 756 px**, lacunas entre as três colunas de Resultados de **24 / 24 px**, menor título em Formação com **29 px**, frase editorial com **24 px**, texto dos destaques com **16 px** e sobreposição entre selo e indicador de anos de **0 px²**. A fotografia de Sobre usa `overflow: hidden` no contêiner e deslocamento em `#sobre .about-portrait.has-custom-image img`; a caixa da imagem pode estender-se abaixo da seção sem extravasar visualmente.

O desktop aplica os novos estilos a partir de **768 px**; o ajuste do indicador cobre alturas até **760 px**, e o fallback para crescimento/rolagem cobre alturas até **700 px**. O mobile (até 767 px) não recebeu novas regras nem edição dos seus dados nesta intervenção. A auditoria de navegador passou com **0 falhas** e **38 capturas** sem falhas (13 desktop, 25 mobile), mas **o job P3 completo ficou FAILURE** pelo LCP mobile (mediana 3.670,965 ms contra limite de 3.500 ms). Verificações geométricas não substituem inspeção subjetiva em navegador real. [Homologação](../05-operacao/TESTES_E_HOMOLOGACAO.md).

## Perfil desktop — separação entre os quatro destaques (13/11/2026)

A primeira coluna de `#perfil` mantém a estrutura de retrato, frase editorial e lista de quatro destaques. Na segunda revisão tipográfica do dia, os campos do CMS para **desktop** passaram a definir frase em **20 px**, quatro títulos laranja em **13 px**, descrições brancas em **15 px** (inalteradas) e espaçamento dos quatro destaques em **10 px** (anteriormente 2 px). O aumento de `desktop.spacing` atua no `padding-block` via `--item-desktop-spacing` e amplia a distância percebida entre a descrição de um destaque e o título do próximo. A lista, os ícones, o alinhamento, as cores, a coluna direita e os campos mobile foram preservados. Não houve alteração de CSS ou breakpoint (desktop a partir de 768 px); as regras de altura baixa e rolagem seguem vigentes.

O Supabase confirmou por `UPDATE ... RETURNING` os valores do bloco A publicado de `perfil`; não houve homologação visual em navegador para todas as dimensões desktop nesta intervenção. O ensaio de 12/11/2026 mencionado acima corresponde à configuração histórica anterior e não comprova a configuração atual.

## Ajustes finos exclusivamente desktop amplo — 13/11/2026

Na faixa **`@media (min-width: 1101px)`**, o CSS de `src/index.css` preserva os campos tipográficos do CMS, a composição mobile (até 767 px) e o layout intermediário (768–1100 px), aplicando somente as seguintes correções geométricas solicitadas após conferência visual:

- **Perfil:** o selo `.profile-portrait .badge-360` desce por um acréscimo `clamp(.6rem, 1.4dvh, 1rem)` à posição desktop existente, ampliando o afastamento do texto “de experiência em Comunicação, Marketing e Conteúdo.”. A caixa `.profile-sidebar-content` recebe `clamp(.65rem, 1.5dvh, 1rem)` de espaço superior adicional, deslocando juntos a frase em itálico e os quatro destaques para baixo, sem editar o texto, os tamanhos vigentes (20/13/15 px) ou o espaçamento de 10 px dos itens no Supabase.
- **Sobre (“Olá!”):** a imagem customizada mantém `overflow: hidden` em `.about-portrait`, o arquivo do CMS e `object-fit: contain`, com ajuste de `top` para `clamp(3.75rem, 9.8dvh, 6rem)` a fim de aproximar o último pixel visível da borda inferior laranja. O texto de apresentação `#sobre .about-heading .section-intro` passa a `clamp(.95rem, 1vw, 1.0625rem)`, limite máximo **17 px**, reduzido do limite desktop anterior de **18,4 px**.
- **Resultados:** `.results-editorial` passa a `minmax(19rem, 1.1fr) minmax(0, 2.8fr)`, diminuindo a largura reservada ao título esquerdo. Os espaços entre esquerda/indicadores e indicadores/seletor permanecem exatamente iguais em nível de grade, pois ambas as lacunas usam `--results-column-gap` no contêiner externo e em `.desktop-content`.

**Escopo e verificação:** mudança restrita a CSS e documentação, sem alteração em React, Supabase, fotos, dados editoriais, navegação, Vercel ou configurações mobile. Ajuste preparado sobre `main` no SHA `e245284cb524cc4afbc4eb1d35c6905fb4646b0a`; revisão estática dos seletores e do escopo desktop antes do commit. A eficácia óptica do encaixe da foto, a ausência de overflow em alturas baixas e a igualdade visual das lacunas dependem de conferência no navegador após o deployment do novo SHA; deploy READY isolado não substitui CI/QA nem a meta histórica de LCP mobile.

## Perfil — legenda, filete fotográfico e marca do cabeçalho desktop (13/11/2026)

Somente a partir de `768px`, no Perfil desktop (`src/index.css`), foram realizados três ajustes localizados:

1. `#perfil .profile-portrait .years span { text-align: center; }` centraliza o texto “de experiência em Comunicação, Marketing e Conteúdo.” na largura do mesmo bloco posicionado que contém o indicador “+15 ANOS”, sem mudar sua posição, texto ou tamanho.
2. `#perfil .profile-portrait::after` desenha um filete de **3 px**, `bottom: 0`, `left: 0`, com `width: min(100%, calc(var(--hero-desktop-image-width, 52%) + 1.5rem))` e fundo `var(--orange)`. Assim começa na borda esquerda e ultrapassa ligeiramente a largura visível da foto, respeitando sua largura desktop editável, sem novo arquivo nem transbordamento da coluna. `pointer-events: none` evita interceptar controles.
3. `.site-header.header-profile .brand-button` recebe `font-size: clamp(1.125rem, 1.08vw, 1.25rem)` e `line-height: 1`. O aumento da assinatura `TULIUS TSANGAROPULOS` não muda `--header`, `.site-header` nem o tamanho da área clicável, e vale somente enquanto a primeira seção estiver ativa no desktop.

A fotografia, os textos, o selo, os tamanhos editáveis e demais componentes do CMS, o mobile (até 767 px) e os estilos das outras seções não foram modificados. O ajuste é de CSS e não precisa de atualização SQL, migração ou armazenamento de mídia. Validar após publicação o encaixe do filete em larguras desktop (inclusive 768–1100 px) e o centro visual da legenda; CI, Vercel READY e verificação em navegador são evidências distintas.

## Estado vigente e aceite visual — Perfil desktop em 13/11/2026

A nova revisão mantém a mesma composição, mas reduz a **frase editorial em itálico para 18 px** e o **filete laranja abaixo da foto para 2 px**. O primeiro ajuste persiste no CMS (`content_blocks.content_json.items[0].hero.desktop.introSize = 18`) e no CSS `.profile-intro` com piso de `1.125rem`; o segundo altera apenas `height: 2px` no pseudo-elemento `#perfil .profile-portrait::after`. O breakpoint permanece `@media (min-width: 768px)`. A largura da linha, as demais propriedades da foto, o layout mobile e a marca no header não foram alterados.

**Aceite visual:** o proprietário considera a homologação visual desta revisão concluída. É aprovação expressa do proprietário, não execução independente de teste browser/pixel-a-pixel. Conferir CI, performance e publicação do SHA separadamente. As descrições anteriores de 20 px e 3 px são histórico das revisões precedentes, não a configuração vigente.


## Respiros e navegação do desktop — 16/11/2026

No Perfil, `profile-desktop` conserva `min-height: 100dvh` e passa a crescer com o conteúdo quando necessário, sem `overflow: hidden` no contêiner principal. `profile-main` reserva espaço inferior para o botão, que recebe diâmetro de 2,6 rem e sobe/desce como elemento completo em looping de 1,9 s; o SVG não anima separadamente. A legenda de “+15 ANOS” ganha distância do selo pelo reposicionamento responsivo do selo e pela redução do indicador. A frase editorial fica com entrelinha 1,18; o título da área continua acima dos títulos das empresas.

Na seção “Olá!”, os textos da coluna direita passam a ler a variável de estilo desktop dos itens, em vez de ignorá-la. Em Resultados (≥1101 px), a grade central de indicadores fica mais estreita, com aumento das duas separações horizontais; de 768 a 1100 px há apenas reforço moderado de espaçamento. Na coluna esquerda das seis Experiências, margens de título, função, período e competências foram ampliadas somente no contêiner `experience-desktop`.

**Única exceção mobile:** o botão `.mobile360-down` (e o fallback `.profile-mobile-next`) preserva 44 px de alvo, recebe o mesmo movimento suave do círculo inteiro e deixa de animar o SVG isoladamente. Os demais estilos e dados mobile permanecem iguais. Para `prefers-reduced-motion: reduce`, a animação é desligada. Confirmar viewport, altura curta, navegação, foco e ausência de clipping no ciclo de testes desta intervenção.


## Botão de navegação do Hero visível na primeira dobra — 16/11/2026

Depois da validação visual de 16/11/2026, o proprietário observou que a seta desktop ficava **abaixo da área visível** porque `.profile-desktop` pode crescer verticalmente (comportamento necessário para não cortar as experiências). A posição inferior absoluta (`bottom`) calculada em relação ao contêiner inteiro não é adequada para esse caso.

A regra final em `src/index.css` fixa a posição **dentro da seção, na altura da primeira dobra**, por `top: calc(100dvh - 3.4rem)` e `bottom: auto`, com `z-index: 3`. Em desktop amplo (**≥1101 px**), o centro horizontal do círculo fica em **63,5% da largura total do Hero**, seguindo a marcação visual do proprietário; entre **768–1100 px**, mantém a centralização horizontal anterior. O link continua descendente de `ProfileDesktop`, navegando pela mesma âncora; não usa `position: fixed`, portanto desaparece naturalmente ao rolar para outras seções. O botão mantém **2,6 rem**, animação de movimento suave do círculo inteiro e regra `prefers-reduced-motion`. O seletor desktop redefine explicitamente `position: absolute`, `grid-column`, margens e transformação horizontal para superar a regra legada `position: static` de janelas desktop com altura ≤640 px.

A alteração **não modifica** o mobile (≤767 px), o conteúdo das duas colunas, o tamanho do Hero, os campos do CMS nem os blocos no Supabase. Os registros antigos que mencionam centralização no viewport e posicionamento inferior descrevem versões anteriores e são superados para desktop amplo por esta decisão posterior.


## Selo completo na abertura desktop — 16/11/2026

O selo `#perfil .profile-portrait .badge-360` permanece posicionado dentro do retrato, mas sua correção de topo passa a utilizar `clamp(1.75rem, 4.2dvh, 2.5rem)` em vez de `clamp(.25rem, 1.3dvh, .7rem)`; a dimensão mínima muda de 42% para 40% da largura do contêiner. Em janelas desktop baixas, a combinação de subida e diminuição evita que a borda do círculo seja ocultada por `overflow:hidden` do retrato, sem aproximá-lo indevidamente da legenda. O texto “+15 ANOS” foi reduzido no CMS desktop de 55 para 51 px; o CSS responsivo `clamp()` existente foi preservado. O retrato, o filete laranja, a seção com altura flexível, a seta e os destaques continuam com suas configurações anteriores. **Mobile (≤767 px) permanece intocado.**

## Resultados compactos — responsividade e acessibilidade (16/11/2026)

O slug `resultados` recebe `.results-center.is-compact` **somente** ao selecionar uma das cinco categorias configuradas com `themePresentation="metrics"`. A apresentação usa eixo/título/subtítulo e quatro indicadores com tipografia e espaçamento reduzidos, filetes e ícones decorativos compactados. **A visão geral preserva quatro cards e a geometria original, sem a classe compacta**; menu da direita no desktop e seletor mobile permanecem.

- **Desktop:** duas colunas × duas linhas; a área central pode rolar verticalmente. Como região com rolagem própria, tem `role="region"`, rótulo acessível, `tabIndex=0` e destaque visual em `:focus-visible`, sem impedir acesso pelo teclado.
- **Mobile:** duas colunas de 421 a 767 px; uma coluna até 420 px; rolagem nativa, sem altura rígida, truncamento do texto ou tab stop extra no contêiner. Não mudar placements/conteúdo de viewport nem ocultar informações para ganhar Lighthouse.
- **Movimento e capturas:** as animações aprovadas são mantidas e obedecem a `prefers-reduced-motion`; a captura P3 aguarda a classe de entrada e a opacidade estabilizada para não registrar cards esmaecidos em transição.
- **Regressão:** [P3 #43817188772](https://github.com/tuliust/PortfolioTulius/actions/runs/43817188772) (`9915964`) percorreu os cinco temas com quatro cards e voltou à visão geral em 320, 390, 430 e 1440 px, sem overflow e com foco acessível. **SUCCESS**; isto não substitui inspeção humana em monitor e aparelho físico. LCP mobile tem variabilidade entre SHAs (ver [Testes](../05-operacao/TESTES_E_HOMOLOGACAO.md)); manter limite ≤3.500 ms.

Os campos editoriais anteriores permanecem no CMS, embora ocultos no modo compacto. Conferir [modelo](../03-cms/MODELO_DE_DADOS.md) e [guia administrativo](../03-cms/GUIA_ADMINISTRATIVO.md).


## Densidade editorial de Experiências — 16/11/2026

A aba Projetos e Realizações passa a exibir **cinco resumos por empresa** em desktop e mobile, independentemente dos três/quatro slides aprovados. Cada resumo tem `title` e `text`; a apresentação aplica limite visual de duas linhas ao parágrafo do projeto, mantendo texto completo no DOM e no CMS. Selecionar item sem slide não deve deslocar a galeria para imagem não correspondente. Preservar foco e teclado dos botões e a navegação de galeria. Trajetória exibe abertura seguida por bullets com rótulos em negrito, com leitura integral e rolagem natural. Validar alturas pequenas e mobile sem overflow ou corte irreversível.

## Exportação visual isolada — Etapa 2 (16/11/2026)

`PdfPortfolio` recebe `desktop`/`mobile` e `original`/`clean`; seu CSS restringe as alterações ao escopo `.pdf-portfolio`. Remove conteúdo interativo apenas na composição PDF, amplia alturas dos blocos e depoimentos, e aplica fundos brancos e escala cinza no modo Clean. A seção lógica mobile mantém painéis A/B na mesma página editorial.

**Não homologado:** a fidelidade pixel-a-pixel, ausência de cortes em PDF e media queries em viewport real; a etapa de geração deverá usar a largura efetiva do dispositivo e páginas de altura adaptativa.

## Viewports e comportamento estático PDF — Etapa 3 (16/11/2026)

As referências de captura da exportação são Desktop 1440×900 e Mobile 390×844, sem escala artificial do desktop. A versão mobile preserva as composições A/B do `Section`; na seção Resultados, até 420 CSS px a lista de indicadores mantém uma coluna, como no site público. Resultados e Trajetória não usam rolagem interna; a exportação de depoimentos usa artigos estáticos. `data-pdf-section` marca as seções lógicas para uma futura composição de uma página física por seção.

**Não comprovado nesta mudança:** paridade visual por screenshots com CMS e mídia de produção, dimensões finais de página PDF e ausência de recorte no arquivo PDF. Os testes de estrutura não substituem essa homologação.

## Evidência visual em ambiente isolado — Etapa 3 (16/11/2026)

O workflow `PDF Renderer Visual QA` monta a mesma árvore React do renderer em viewports Chromium **1440×900** e **390×844**, Original/Clean. Verifica seções lógicas, 4+20 cards de Resultados, experiências e Trajetória, depoimentos integrais, links do Hero, fundos Clean, ausência de navegação e overflow horizontal detectável. Produz 16 capturas de Perfil/Resultados/Invest RS/Depoimentos e relatório JSON no artefato do workflow. São fixtures de fallback com Trajetórias sintéticas; não substituem revisão visual de CMS/mídias produtivas nem certificam páginas físicas do PDF.

A seta interna `profile-mobile-next` (rolagem entre painéis do Perfil mobile) é ocultada apenas no PDF; links dos cinco eixos de atuação permanecem acionáveis. O script Chromium conta esses links pela marcação mobile `.profile-mobile-area-list a` e pela classe desktop `.area-card-link`, sem exigir classes iguais para layouts diferentes.

A revisão manual das imagens de QA identificou que a fixture não carregava as fontes web usadas em `index.html` e que o Perfil mobile podia ter painel A encolhido, gerando sobreposição com B. A entrada isolada passou a carregar as **mesmas famílias Google Fonts sem copiar arquivos**, e o CSS de PDF preserva `min-height:100svh` no primeiro painel mobile. A QA agora verifica fontes carregadas, altura de A e ausência de sobreposição geométrica com B. Essas correções **não modificam o site público**.

## Etapa 4 — prévia administrativa de PDF (16/11/2026)

O iframe recebe viewport de **1440 px Desktop** ou **390 px Mobile**, permitindo media queries efetivas para o dispositivo selecionado. A escala visual aplica-se somente na apresentação do iframe; a abertura em nova aba permite revisão natural. Botões de paleta/dispositivo usam `aria-pressed` e as seções usam checkboxes com rótulos. A rota exige autorização administrativa antes da leitura do conteúdo. Layout público e editor existentes permanecem inalterados.

## PDF nativo — geometria de impressão na Etapa 5 (16/11/2026)

A impressão usa `@page` nomeadas com largura nativa de 1440 px ou 390 px e altura conforme o conteúdo de cada seção. Um documento pode conter páginas de alturas diferentes, em vez de forçar seções extensas ao formato A4. `print-color-adjust: exact` protege a paleta Original e os fundos brancos da variante Clean. Os links e o texto permanecem vetoriais no PDF de Chromium. O botão de gerar é habilitado apenas após o carregamento da prévia; o diálogo de impressão é acessível via navegador. A aparência final dependerá das opções do diálogo (por exemplo, cabeçalhos/rodapés).

## Galeria de projetos sem recorte involuntário (17/11/2026)

Nas seis experiências, `src/index.css` define `.experience-media-frame > img { object-fit: contain; }` em lugar de `cover`. Imagens quadradas de referência **1600 × 1600 px** são mostradas integralmente, sem distorção, dentro do quadro editorial já existente: largura de 100%, limite desktop de **57svh** e proporções responsivas próprias dos painéis mobile. Pode sobrar fundo neutro nas laterais ou no topo/rodapé. Navegação, legenda, texto alternativo, ordem dos slides, recuo de projetos e geometria do quadro permanecem preservados. Um zoom maior que 1 definido pelo editor de enquadramento pode ampliar a imagem intencionalmente.

Demais fotografias: **Perfil** desktop preserva o recorte editorial aprovado (referência 1200 × 1600 px) e mobile já usa `contain` (variante otimizada 900 × 1200 px quando aplicável); **“Olá!”** já usa `contain` com máscara e deslocamento desktop intencionais (1200 × 1600 px desktop; 900 × 1200 px mobile); **Contato** conserva o enquadramento inferior desktop da mídia transparente (1200 × 1600 px) e `contain` mobile; os **logos** já usam `contain`, preferencialmente em SVG (512 × 512 px como referência raster). Dimensões são orientações para arquivos, não tamanhos CSS fixos nem autorização para reescrever mídias. O smoke P3 passa a aferir `objectFit=contain` nas galerias de projetos desktop e mobile. O orçamento LCP mobile ≤3,5 s permanece.

## Homologação PDF — correções de fluxo, retrato e legibilidade (17/11/2026)

A variante `pdf-experience-section` neutraliza `position:sticky` das seis experiências, evitando que uma empresa substitua visualmente a anterior ao rolar; a ordem editorial e o conteúdo de cada seção são preservados. O CSS do retrato em Contato passa a `contain` somente no PDF Desktop, sem cortes laterais. Depoimentos do PDF têm imagens maiores, título/cargo e citação ampliados, além de separação vertical explícita entre identificação e texto, incluindo no mobile. A prévia mobile continua montada durante erros de imagem, e o botão de impressão permanece desabilitado até a mídia estar completa. A QA visual verifica geometria sequencial, crop, tamanho de texto/foto, espaçamento e prontidão após imagens.

## PDF — revisão de Contato, experiências e orientação (17/11/2026)

A variante Desktop da exportação reduz a extensão vertical de Contato, diminui o vazio superior e desloca o retrato aprovado para a borda inferior do quadro, mantendo `object-fit:contain`. Cada experiência posterior à primeira recebe uma **linha separadora de 3 px** na cor laranja no modo Original; a versão Clean usa cinza para manter sua paleta monocromática. O modo Desktop reestrutura apenas a **disposição** dos grupos de Resultados em duas colunas, exibindo integralmente as seis categorias e indicadores, para reduzir a altura da página. Nenhuma dessas regras altera a exibição pública. A guia de impressão de nível superior é isolada da prévia; a barra de ação não aparece em `@media print`.

**Revisão de formato do PDF (17/11/2026):** espaçamentos entre grupos de Resultados são compactados no Desktop para manter orientação paisagem sem ocultar indicadores. A seção Contato no Desktop admite página física de altura menor que a referência de tela de 900 px, mantendo a fotografia encostada à base da composição. Os modos Mobile mantêm retrato e não recebem esses ajustes de Resultados e Contato Desktop.

**Base efetiva de Contato no PDF Desktop, 17/11/2026:** o contêiner da fotografia da exportação não usa mais recorte `overflow:clip`, permitindo que os 52 px de ajuste vertical da imagem transparente permaneçam visíveis até a extremidade inferior. A reserva adicional de 8 px foi removida apenas da página física Contato Desktop. O modo Mobile, o conteúdo e a imagem do site público não mudam.

## PDF — imagem diferida em Sobre e estabilidade da impressão (17/11/2026)

O renderer público de Sobre Mobile usa `DeferredAboutTablet`, que omite `src` até o IntersectionObserver aproximar a imagem da viewport. A prévia PDF precisa validar todas as imagens antes de liberar a impressão, mesmo as que estejam fora da janela visível. Agora, somente com `pdfExport=true`, a imagem é renderizada com `src` direto e `loading="eager"`. A otimização pública permanece intacta. O evento `beforeprint` evita refazer o cálculo das páginas se o manifesto de impressão já estiver instalado.

## Layout físico de exportação PDF — 17/11/2026

A impressão PDF usa tamanho de folha fixo por dispositivo (Desktop 1440×900 px; Mobile 390×844 px), independentemente da altura do conteúdo. Seções iniciam novas folhas; conteúdos extensos fluem pelas páginas adicionais sem redução artificial de fonte ou truncamento. O site público e os placements do CMS não são afetados.
## Exportação PDF Desktop — alturas distintas por seção (17/11/2026)

O renderer de impressão Desktop usa uma folha CSS nomeada e dimensionada para cada uma das 13 seções publicadas, após o carregamento de fontes, imagens e Trajetórias. Resultados e experiências completas podem ter folhas mais altas; Formação, Ferramentas e Depoimentos terminam pouco depois da base visível do conteúdo. A quebra ocorre na mudança do nome CSS da página, sem `break-after: page` adicional. O limite máximo de 16.000 CSS px e o bloqueio de imagens/Trajetórias ausentes permanecem.

A composição PDF de **Sobre** recebe altura de 750 px com fotografia central de 700 px deslocada para cima; em **Contato**, reduz-se o espaço superior e sobe-se o retrato transparente com `object-fit: contain`. As cinco bordas laranja entre as seis experiências desaparecem **somente no PDF Desktop**. O site público e toda a exportação Mobile mantêm seu CSS pré-existente.

**Dependência de aceite:** o teste Chromium por SHA deve comprovar uma página por seção, íntegra e sem folhas brancas; o arquivo do Chrome do proprietário continua sendo a evidência visual definitiva para a versão produtiva.
## PDF Desktop — compactação seletiva e fotos apoiadas à base (17/11/2026)

Após inspecionar o PDF Chrome/Skia de **14 folhas**, constatou-se que `perfil` estava sendo dimensionado abaixo de sua composição real: o item final **Idiomas** escapou sozinho para a segunda folha. A medição do Perfil Desktop agora respeita o piso físico de **900 CSS px**, sem afetar as demais seções e sem ocultar conteúdo.

Em **Sobre**, a fotografia central e a composição têm a mesma altura de referência de **750 px**, sem deslocamento negativo, e a reserva adicional da folha foi removida para aproximar a silhueta à borda inferior. Em **Contato**, o retrato transparente foi deslocado para baixo exclusivamente na exportação Desktop, preservando `object-fit: contain`, links e o rodapé editorial. As cinco primeiras experiências usam a borda efetiva das três colunas, acrescida de reserva de segurança, para reduzir a área branca inferior; **CDI** permanece com o dimensionamento anterior. Em **Ferramentas**, a reserva de segurança passa de 280 para 210 px, sem truncar o grid. Identidade pública, Mobile, CMS e mídias mantidos.

## Ajuste exclusivo do PDF Desktop — fotografias e folgas inferiores (17/11/2026)

Na composição para impressão (não na página pública), a altura da folha de **Sobre** é medida pelo grid de texto/foto sem computar o deslocamento visual do PNG; o retrato é deslocado 24 px para compensar transparência inferior. Em **Contato**, a folha conserva reserva de 56 px em relação ao grid, separada da translação de 72 px da imagem. A diagramação das **seis experiências** mantém três colunas e todo o texto, com 64 CSS px de folga após a última coluna; o padding inferior original não é herdado no PDF. São regras exclusivas do Desktop, sem modificar Mobile ou imagens do CMS. A eficácia física deve ser verificada na QA de PDF e na exportação real do Chrome.


## PDF Desktop — correção complementar de transparência inferior (18/11/2026)

O PDF produtivo de 13 folhas do proprietário, salvo pelo Chrome/Skia, mostrou que a geometria da imagem não equivale ao limite dos pixels visíveis: a fotografia termina aproximadamente **7 pt acima da folha em Sobre (página 2)** e **16 pt em Contato (página 13)**, apesar da QA anterior aprovar as caixas do DOM. Para compensar somente o inset transparente dos PNGs publicados, a translação de Sobre passou de **24 para 36 CSS px** e a de Contato de **72 para 96 CSS px** no CSS isolado `PdfPortfolio.css`. A folha de Contato mantém `overflow: clip` para que o deslocamento não crie folha adicional; o CSS de medição `pdf-print-layout.ts` e as dimensões do papel não mudam. O site público, Mobile, mídias e dados do CMS permanecem inalterados.

O teste visual do exportador verifica as novas posições geométricas das imagens e o recorte de Contato. **A confirmação de zero faixa abaixo dos pixels opacos dos PNGs produtivos depende de regenerar o PDF no Chrome**; fixture e DOM não podem substituir essa inspeção visual.


## PDF Mobile — correção de quebra e renderização no Chrome (18/11/2026)

O arquivo produtivo Mobile Chrome/Skia de 32 folhas mostrou fontes e disposição diferentes da prévia de 390 px, indicadores em duas colunas na impressão, primeiro Hero empilhado em vez da composição aprovada, excesso de papel branco e continuação isolada de Trajetórias, Ferramentas e Contato. O diagnóstico identifica uma diferença entre o **viewport de 390 px do iframe** e a **aba de impressão potencialmente larga**: consultas de mídia aplicadas pelo browser dependem da largura da aba, não da caixa interna do PDF.

O renderer `pdf-print-layout.ts` agora, **somente com `device=mobile`**, reaplica as regras de media query do site que correspondem ao viewport canônico 390×844, convertendo unidades `vw` em `cqw` relativas ao contêiner PDF fixado em 390 px; nenhum CSS público é modificado. Passa a usar `@page` nomeada **390 px × altura calculada pela seção**, eliminando folhas órfãs e sem comprimir conteúdo. Em `PdfPortfolio.css`, o sobrenome do Perfil é mantido íntegro, sem quebra de uma letra isolada. O Desktop conserva o mesmo ramo de renderização, valores, estilos e código de paginação da versão aceita.

Risco residual: páginas Mobile com Trajetórias longas podem ficar fisicamente altas, como no formato Desktop aprovado. A QA física deve exigir 13 folhas para 13 seções completas e preservação de Trajetórias/links, inclusive em um **cenário adicional com janela de impressão de 1440 px**, que reproduz a diferença entre iframe e aba.


**Complemento técnico Mobile do PDF (18/11/2026):** os valores de `svh`, `dvh` e `vh` das media queries originais são congelados na altura de referência **844 px** somente na folha Mobile. Sem isso, mudar o tamanho da folha altera também a altura da fotografia de Sobre (55svh) e da composição do Perfil, gerando paginação circular. A variante editorial360 está coberta em fixture sintética própria; o layout público e a exportação Desktop permanecem intocados.


**Acabamento final de medição Mobile (18/11/2026):** para eliminar espaço inferior causado pela janela Desktop na aba de impressão, a altura da folha Mobile é obtida da última caixa de conteúdo renderizada (`leaf`), não do `scrollHeight` de wrappers. Reserva de 64 CSS px para Sobre e 72 px para as demais seções, mantendo o conteúdo e evitando páginas órfãs. A cor de fundo da folha de Sobre continua grafite abaixo de seu segundo painel. Um teste de paridade compara as alturas de folha da mesma fixture em abas 390 px e 1440 px. Nenhuma mudança no site público, CMS ou PDF Desktop.


**Paridade de cálculo com aba externa larga (18/11/2026):** além das regras de media query mobile, o CSS de base carregado pelo renderer PDF que contém unidades `vw` é reavaliado em `cqw` da largura interna de 390 px. Isso evita que a medição de folhas aumente quando a aba de impressão é larga, mantendo as mesmas dimensões e legibilidade do conteúdo Mobile. Validar na QA física por folha; o Desktop não usa esse ramo.


## PDF Mobile — correção da regressão das três colunas (18/11/2026)

A análise do PDF sintético físico gerado pelo SHA `da91859` constatou que a seção **Invest RS** e as demais experiências eram diagramadas em três colunas extremamente estreitas, como no Desktop, apesar de a prévia Mobile exigir empilhamento vertical. A causa era a injeção, no final da cascata CSS, de **regras base inteiras** que contivessem algum `vw`: essa duplicação também reaplicava `display: grid` e `grid-template-columns`, sobrepondo `display: block` do Mobile. Agora o normalizador reemite **somente as declarações cujo próprio valor contenha `vw`**, convertendo essas unidades em `cqw`; não duplica `display`, `grid`, `position` nem demais propriedades. A escala tipográfica do PDF mantém 390 px de referência mesmo em aba larga. Nenhum seletor Desktop, regra de medição Desktop, mídia ou conteúdo do site público foi modificado.


**Paridade de alturas físicas (18/11/2026):** a normalização seletiva do PDF Mobile aplica-se agora tanto a `vw → cqw` quanto a `vh/svh/dvh/lvh → px` (referência vertical fixa 844 px) também nas declarações base, não somente nas media queries. O contêiner 390 px permanece em uma coluna. Essa mudança existe somente no CSS injetado do PDF Mobile e não altera o site público nem o caminho Desktop.


**Medida geométrica da folha Mobile (18/11/2026):** para evitar diferenças de altura de papel apesar de conteúdo idêntico, as folhas passam a ser dimensionadas pelo último retângulo de **texto real** (via DOM `Range`) ou de **mídia visível** (`img`, `svg`, `canvas`, `video`), com margem inferior de segurança 64/72 px. As caixas de wrappers vazias não influenciam mais o corte da folha. A paridade externa 390/1440 px é verificável na QA física. Desktop continua com algoritmo original intacto.


**Fontes de títulos do PDF Mobile em aba larga (18/11/2026):** `PdfPortfolio.css` fixa agora, **somente no renderer Mobile**, o `font-size` de `.pdf-results-page .section-intro` (`clamp(1rem,1.2cqw,1.15rem)`), `.pdf-results-group-heading` (`clamp(1.5rem,2.6cqw,2.6rem)`) e `.pdf-experience-column-heading` (`clamp(1.45rem,2cqw,2rem)`) na largura interna do documento. Esses três valores replicam a composição de 390px aprovada e evitam crescer ao abrir a impressão em uma aba de 1440px. Mantêm fontes, pesos, cores e textos originais, sem afetar o layout público ou a impressão Desktop.


## PDF Mobile — CSS compilado de produção e bloqueio da exportação (18/11/2026)

A captura do painel autenticado apresenta **"As regras responsivas do PDF Mobile não foram carregadas."**, embora a prévia 390 × 844 esteja visível. O erro ocorre no guardião `ensureMobileReferenceCss` antes da abertura do diálogo de impressão, e **não** comprova ausência da mídia ou dos dados. A QA anterior utilizava apenas `pnpm dev`, enquanto a Vercel serve CSS processado/minificado. O reconhecedor antigo aceitava somente consultas legadas `(max-width: 767px)`, não formas minificadas como `(width <= 767px)`; também não atravessava grupos aninhados `@layer/@supports`.

A correção testa queries com `matchMedia` de um iframe temporário de **390×844 px**, remove o iframe antes de medir papel, reconhece sintaxe de faixa moderna e percorre os grupos CSS em profundidade. Mantém a exigência de **ao menos uma regra Mobile carregada** para não imprimir silenciosamente o layout errado; CSS Base com unidades de viewport continua normalizado **somente em declarações pertinentes** e antes da cascata Mobile. Sem alterações no código Desktop, no conteúdo, nas mídias nem no site público.

O workflow `PDF Renderer Visual QA` passa a executar, além da fixture Vite dev, uma **fixture isolada do build Vite compilado** (`PDF_QA_BUILD=1`) servida por `vite preview`, com os cenários Mobile editorial360 de janela 390 px e aba 1440 px. Esse modo existe somente no CI; a compilação normal não inclui `pdf-export-qa.html` e continua checada por `PDF_QA_NOT_PUBLISHED`. A QA física deve comprovar conteúdo pesquisável, paginação 13/13, uma coluna e paridade de altura. **A correção fica condicionada a CI SUCCESS e confirmação posterior no Chrome com conteúdo real.**


**Resultado de validação do bloqueio Mobile no CSS compilado (18/11/2026):** o SHA funcional `df247b2` passou no CI tanto com o Vite dev quanto com o **Vite build otimizado servido por `vite preview`**. A media query Mobile é reconhecida em CSS compilado usando `matchMedia` da viewport temporária 390×844 e varredura de grupos CSS aninhados. O arquivo de teste continua ausente do build Vercel normal (`PDF_QA_NOT_PUBLISHED PASS`). O Desktop e o layout público não foram alterados. O resultado com fixture é reproduzível, mas a revisão da mensagem no **navegador administrativo autenticado do proprietário** ainda requer uma atualização da página e nova tentativa de geração.


## PDF Mobile — refinamento solicitado no PDF real de 13 folhas (18/11/2026)

O proprietário homologou o Desktop e solicitou somente o acabamento Mobile. O arquivo produtivo anexado mostra (p. **1**) o retrato inferior maior que o bloco nome/experiência e a seta de rolagem; (p. **2**) uma faixa laranja sob a fotografia de Sobre; (p. **3**) os indicadores temáticos de Resultados em uma única coluna; (p. **5–10**) bordas superiores laranjas entre experiências; e (p. **13**) o retrato de Contato ligeiramente baixo e uma faixa laranja abaixo do rodapé grafite. Os textos, valores, fotos e identidade editorial existentes ficam preservados.

No CSS **exclusivo de exportação Mobile** (`PdfPortfolio.css`), o retrato inferior de `#perfil-a` recebe altura restrita a aproximadamente **200–228 CSS px** com alinhamento vertical central ao bloco ao lado, e a seta `.mobile360-down` é ocultada (não no site público). Em Sobre, a foto é transladada **16 px** dentro de seu contêiner recortado, sem aumentar a altura da folha. Os cinco conjuntos temáticos de Resultados usam grade de **duas colunas**, enquanto a Visão geral continua com uma, com fontes proporcionais à largura interna de **390 px**. As seis experiências deixam de receber bordas laranjas/cinzentas entre folhas. Em Contato, retrato e início da faixa grafite sobem juntos **9,6 px**, e o fundo grafite da seção preenche a margem física inferior no modo Original; Clean continua branco.

Em `pdf-print-layout.ts`, as folhas seguem **com alturas calculadas individualmente pelo texto e mídias**, sem forçar altura mínima de 844 px para Perfil e sem alterar o algoritmo, medidas ou cores de Desktop. A QA visual exige cinco grades temáticas de duas colunas, ausência de filetes entre experiências e ocultação da seta. A QA física continua exigindo uma folha por seção, links, texto pesquisável, integridade das Trajetórias e paridade entre abas de 390/1440 px. A confirmação de alinhamento pixel a pixel das fotografias reais ainda depende de PDF produtivo regenerado e conferido; não confundir fixture com aceite do Chrome do proprietário. Sem alterações em site público, CMS, Supabase, Auth/RLS/Storage, migrations ou mídias.


**Revisão visual complementar do Perfil editorial (18/11/2026):** a rasterização da fixture física de `eaa7b2f` revelou que, mesmo com a foto menor, o nome TULIUS subia e cruzava o rodapé do cabeçalho preto. A causa é a translação vertical de `.mobile360-bottom-copy` originalmente aplicada ao site público para afastar o texto da seta de rolagem; no PDF a seta é oculta e a translação não deve existir. No renderer Mobile, o bloco de nome e experiência volta a `transform: none` com alinhamento vertical central e o retrato é ajustado para aproximadamente **208–244 px**, enquadrando o primeiro e último texto. Preserva-se o enquadramento da fotografia e o deslocamento lateral aprovado do site. A QA física editorial360 passa a aferir geometricamente quatro condições antes de imprimir: nome abaixo do cabeçalho, foto começando pelo menos 4 px antes do nome, foto terminando pelo menos 4 px depois da descrição e seta invisível, em abas Mobile e larga. Nenhuma regra do site público ou PDF Desktop foi alterada.


**Compactação por conteúdo no Perfil do PDF Mobile (18/11/2026):** a rasterização da fixture do SHA `315420f` confirmou foto e texto inferior sem sobreposição e com seta ausente, mas identificou uma área branca significativa depois do último item de **Áreas de atuação** (conteúdo do painel Perfil/B). Como esse é o último bloco efetivamente publicado da seção Perfil, a altura física de `[data-pdf-section=perfil]` passa a tomar o limite do último `#perfil-b .profile-mobile-area-list li` quando presente, acrescido dos **72 px** de proteção editorial já existentes. O espaço previsto para futuros itens no site público deixa de ampliar indevidamente o PDF. Caso a lista não exista, permanece a medição genérica por textos/mídias. Nenhuma página recebe altura fixa, e Desktop não é alterado. Exigir 13/13 folhas, legibilidade dos links, índice de áreas completo e QA editorial360 em 390/1440 px.


**Reversão da tentativa de medição pelo último item (18/11/2026):** a QA física do SHA `dd7d25d` terminou **SUCCESS**, mas a altura física da folha Perfil editorial360 **aumentou** de **1169,04 pt** (SHA `315420f`) para **1181,04 pt**. O retângulo externo do último item da lista ficou maior que o limite de seus glifos e não trouxe compactação real. Para preservar o contrato de dimensionamento por conteúdo e evitar uma exceção desnecessária vinculada à estrutura do CMS, a medição do Perfil retorna ao mesmo cálculo de `Range.getClientRects()` de textos e caixas de mídia usado nas demais seções. O resultado da tentativa permanece histórico, não deve ser descrito como economia de espaço. As mudanças de fotos, linhas, grid e ocultação de seta continuam vigentes. A conferência com o novo PDF real é a prova final do acabamento.


## Homologação Mobile — separação das seis primeiras folhas (18/11/2026)

**Escopo funcional:** commit `b225b0e9742d8323b69b7e6fe36f832cc1d661ce`, exclusivo do exportador PDF Mobile. A preparação da impressão divide os dois painéis de Perfil (abertura/áreas), os dois painéis de Sobre (Olá/Diferenciais) e os grupos de Resultados (Visão Geral/Temas), conservando o conteúdo publicado por movimentação dos nós DOM apenas na aba de impressão; não duplica ou suprime indicadores, links ou fotos. O grupo extra já publicado **Estratégia e Reputação / Comunicação Corporativa** é mantido ao final dos quatro grupos temáticos representados nas capturas, sem página órfã; essa é uma conciliação editorial conservadora que ainda requer inspeção visual da exportação produtiva.

**Folhas previstas para seleção integral:** 16, com alturas dinâmicas por folha, preservando as 13 seções CMS e a ordem posterior à seção Resultados. Referências de paginação: 1 Abertura, 2 Visão 360°/Áreas, 3 Olá, 4 Diferenciais, 5 Visão Geral, 6 grupos temáticos; a Formação e todas as seções seguintes permanecem como antes, deslocadas apenas na numeração física. O Desktop e suas regras de medição não foram modificados. A cor, a fotografia, a fonte, os ícones, as métricas e os vínculos continuam oriundos do conteúdo publicado.

**Rastreabilidade técnica:** `src/lib/pdf-print-layout.ts` (divisão de nós, CSS responsivo e altura física), `src/components/public/PdfPortfolio.tsx` (identificadores temáticos de leitura), `src/components/public/PdfPortfolio.css` (fundo e reserva de impressão), `scripts/pdf-export-pdf-smoke.mjs` e `src/lib/pdf-print-layout.test.ts`. Os testes sintéticos previstos verificam 16 folhas físicas na seleção completa, separações e textos pesquisáveis; sua execução não é presumida por este registro. Nenhum arquivo do site público, do CMS, do banco ou do PDF Desktop foi intencionalmente alterado.

**Status na criação deste registro:** implementação commitada; Validate, QA física/visual, CSS compilado, comparação visual com as seis referências, Vercel e aceite produtivo **pendentes de reconfirmação por SHA**. Um resultado histórico anterior não confirma esta entrega.


### Evidência final — PDF Mobile com seis folhas editoriais (18/11/2026)

**Estado da implementação:** `main@5a9937ac682282b2a7b3f48a1ed8536314866d60`. A mudança principal usa as mesmas seções CMS, mas monta 16 folhas físicas no Mobile, separando apenas os blocos dos painéis de Perfil, Sobre e Resultados. Os demais slugs seguem iguais, sem alteração do conteúdo publicado. A fotografia da abertura editorial é medida com a compensação pontual de 158px da cascata Chrome print e o contêiner é limitado à altura da folha para remover a sobra inferior.

**Testes confirmados (CI sintético isolado):**
- [Validate PortfolioTulius](https://github.com/tuliust/PortfolioTulius/actions/runs/44242737237): `SUCCESS` (formatador, TypeScript, testes unitários, produção e smoke).
- [PDF Renderer Visual QA](https://github.com/tuliust/PortfolioTulius/actions/runs/44242737229): `SUCCESS`; QA visual sintético `6/6`, PDFs físicos `9/9`, CSS compilado `2/2`. PDFs gerados com textos selecionáveis, hyperlinks de navegação nas áreas e de contato, folha própria para cada segmento, sem páginas órfãs. Mobile editorial gerado com 16 folhas tanto em 390px quanto com Chrome em aba larga; alturas equivalentes.

**Geometria física sintética do Hero editorial no Chrome** (largura constante de 293,04pt = 390px CSS; folha/altura em px CSS, arredondada): 01/532, 02/727, 03/732, 04/685, 05/1212, 06/3267, 07/691, 08/2224, 09/2183, 10/2187, 11/2159, 12/2177, 13/2159, 14/787, 15/1177, 16/1183. Inspeção adicional do PDF de fixture: a fotografia termina visualmente na borda inferior da primeira folha; a terceira também encerra junto à fotografia; a quinta apresenta quatro indicadores em coluna única; a sexta contém os grupos em duas colunas e preserva o grupo adicional publicado `Estratégia e Reputação` após os quatro grupos da referência. O conteúdo da quarta folha não sofreu alterações editoriais.

**Preservação:** Desktop mantém 13 folhas no QA, com geometria e conteúdo anteriores; Formação, experiências, Ferramentas, Depoimentos e Contato preservam as alturas verificadas no fixture anterior. O código do site público, as migrações e os dados do CMS não foram modificados.

**Limite de homologação:** esses resultados provêm da fixture local com dados sintéticos, não de um PDF exportado com sessão autenticada e CMS produtivo. As capturas e o PDF real encaminhados pelo responsável serviram como referência visual para inspeção e confecção de uma prévia independente. **Não foi comprovada a paridade pixel a pixel do PDF final produtivo com os seis anexos**; essa comparação e o aceite explícito do responsável continuam pendentes. A publicação automática da Vercel deve ser reconfirmada no HEAD documental definitivo.


## Incidente da exportação real — Desktop vazio e folha órfã Mobile (18/11/2026)

**Evidência recebida:** PDF Desktop real com 14 folhas: páginas 1 (Perfil), 2 (Sobre), 4 (Formação), 11 (Ferramentas) e 14 (Contato) apresentavam somente o fundo; Depoimentos se fragmentou entre 12–13. PDF Mobile real com 17 folhas: a frase final do quinto diferencial de Sobre saiu da página 4 para uma folha 5 órfã, deslocando o restante da paginação. Os testes de fixture anteriores, embora SUCCESS, não reproduziam esses dois problemas.

**Causa Desktop:** `PdfExportPanel` preparava a prévia em iframe CSS de 1440px, mas abria outra aba para imprimir; quando essa aba tem viewport CSS estreita, a regra responsiva do site `.desktop-panel {display:none}` esconde as cinco seções que reutilizam `Section`, embora o papel continue com largura 1440px. **Mudança:** em **Gerar PDF**, imprimir diretamente a janela do iframe Desktop de referência, já validada, sem reabrir aba com breakpoint divergente. Mobile mantém sua aba independente. Trata-se de fluxo do exportador, sem alteração do site público ou do Desktop editorial.

**Causa Mobile:** a reserva física de 64px para `sobre-diferenciais` não acomodava o último texto real, que fragmentava em nova folha. Apenas essa reserva foi elevada para **176px**. A fixture Mobile isolada passou a usar os cinco diferenciais recebidos; o smoke físico exige a sentença de encerramento na própria folha dos diferenciais.

**Arquivos:** `PdfExportPanel.tsx`, `pdf-print-launch.ts`, `pdf-print-launch.test.ts`, `pdf-print-layout.ts`, `pdf-export-qa.tsx`, `pdf-export-pdf-smoke.mjs`. Nenhuma alteração em Supabase, Auth, RLS, Storage, migrations, conteúdo ou mídias publicados. **Validação do novo SHA:** inicialmente pendente de Validate, QA física/visual, CSS compilado, deployment e reexportação autenticada com o CMS real. Não usar QA sintético como prova automática de aceite produtivo.

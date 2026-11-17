# Responsividade, UX e acessibilidade
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

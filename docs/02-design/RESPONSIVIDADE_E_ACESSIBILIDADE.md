# Responsividade, UX e acessibilidade
**Status:** contrato de apresentação · **Revisão:** 11/11/2026.

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

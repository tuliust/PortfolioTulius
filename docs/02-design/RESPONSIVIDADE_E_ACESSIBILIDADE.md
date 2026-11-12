# Responsividade, UX e acessibilidade
**Status:** contrato de apresentação · **Revisão:** 11/11/2026.

## Modelo
São 14 seções lógicas, 42 painéis cadastrados (desktop, mobile-a, mobile-b para cada seção), mas 13 seções publicadas e visíveis; `competencias` permanece oculta, não excluída. A apresentação mobile A/B é editorialmente distinta do desktop, com conteúdo compartilhado e placements próprios.

Não limitar textos longos a `100dvh`/`overflow:hidden` que tornem conteúdo inacessível. O admin possui prévia mobile em referência **390 × 844**, sem substituir um aparelho real.

## Ajustes mobile de 11/11/2026

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

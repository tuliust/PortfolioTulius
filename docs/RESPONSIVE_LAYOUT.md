# Layout responsivo — contrato vigente

**Referência de código:** [`79aa3c07`](https://github.com/tuliustsangaropulos/PortfolioTulius/commit/79aa3c07ce6c9106b1d504c1f574731bf70fb5d2), em 05/11/2026. A **exibição atual do site é a referência a preservar**: este documento **não autoriza** alterar CSS, imagens, tipografia, cortes, estrutura, ordem ou rolagem. A versão detalhada anterior foi arquivada [integralmente](historico/RESPONSIVE_LAYOUT_ANTES_REORGANIZACAO_2026-11-05.md), com seus testes e SHAs históricos.

## Princípios invariantes

- A interface pública usa dimensionamento responsivo **nativo**. Não introduzir `zoom` CSS nem `transform: scale` no contêiner geral para tentar reproduzir capturas.
- Preservar tokens, paleta preto/grafite/laranja, fontes vigentes e proporções dos retratos. Não criar media queries ou alterá-las por mera reorganização documental.
- Usar `min-height` e rolagem natural quando o conteúdo exceder a viewport; não cortar textos ou criar `overflow-y:auto` interno obrigatório nos conteúdos de Experiências apenas para forçar uma dobra.
- Regras históricas de 75% e 125% de zoom do navegador são **referências de comparação**, não instruções para escalar a aplicação. A [história de densidade e zoom](historico/RESPONSIVE_LAYOUT_ANTES_REORGANIZACAO_2026-11-05.md) deve permanecer acessível.

## Página pública — desktop e mobile

**Desktop e tablet:** as seções preservam estrutura, hierarquia, composição e comportamento aprovados; o Perfil mantém suas colunas e fotografia. As seis experiências preservam navegação, projetos, galeria e Trajetória; não substituir dados do CMS por conteúdo hardcoded. Os retratos personalizados em **Olá** usam contenção da imagem para evitar corte das laterais (`object-fit: contain`).

**Mobile:** a aplicação monta a composição mobile própria, em vez de reduzir a página desktop com zoom. Mudanças já implementadas em CSS/JSX e a preservar:

- **Perfil / primeira tela:** título, apresentação e retrato ficam no fluxo da primeira dobra; o botão com seta inferior foi reposicionado para aparecer sem rolagem em alturas usuais. **Isso ainda não comprova a visibilidade em todo aparelho**, principalmente 320 px e telas baixas. O painel seguinte apresenta áreas de atuação e mantém oculto o bloco duplicado **Experiência em destaque**, deixando área inferior livre.
- **Olá:** laranja até a margem inferior da fotografia; a continuação abaixo usa o preto/grafite da paleta (`#sobre .about-mobile-continuation`). No desktop, não recortar as laterais da foto customizada.
- **Ferramentas:** grupos mais elevados e espaçados para aproveitar a área superior vazia, com fluxo de conteúdo sem colisões. Não repetir títulos quando o painel de continuação não exige.
- **Experiências:** uma empresa ativa inicialmente (**Invest RS**) e seleção por seis logos. A faixa superior muda para **laranja somente quando realmente fixa** (`.experience-index.is-stuck`); sem estado sticky, sua cor normal permanece. Projetos e galeria seguem sincronizados; ao selecionar Trajetória, texto integral e badges acompanham a rolagem da página. Em viewports muito baixos, a barra pode deixar de ser sticky para priorizar leitura.
- **Contato e Depoimentos:** manter as fotos, contornos, disposição e comportamento de expansão já existentes; medidas históricas não definem uma nova modificação de CSS.

As contagens históricas de **13 seções desktop / 25 painéis mobile / 38 capturas** descrevem o teste da estrutura publicada de seus SHAs; a quantidade de nós mobile montados simultaneamente pode variar após otimizações do renderer. Consultar os testes do **SHA em análise** antes de declarar essas contagens vigentes.

## CMS responsivo e Prévia

O admin utiliza layouts adaptativos, sem afetar a árvore pública. Em sua página separada **Prévia**, o modo Mobile tem largura máxima **390 px** e iframe de proporção **390:844**; a simulação não inclui barras de navegação do iOS e não é prova de equivalência com um aparelho real.

## Evidência e qualidade

| Fonte | Situação |
|---|---|
| [CI do `79aa3c07`](https://github.com/tuliustsangaropulos/PortfolioTulius/actions/runs/42020574434) | **Aprovado** (testes e build); não é inspeção visual humana |
| [P3 `0873eeff`](https://github.com/tuliustsangaropulos/PortfolioTulius/actions/runs/42020342275) | **Reprovada** em navegador/responsividade e orçamento de performance; SHA anterior |
| P3 específica do `79aa3c07` | **Não localizada** até esta auditoria documental |
| Comparação visual da seta, do sticky e da continuidade de Olá em iPhone real após últimas mudanças | **Não homologada nesta rodada** |

Meta de LCP mobile desde 02/11: **≤3,5 s**, mediana de três simulações; medição sintética não equivale a **p75 de visitantes reais**. Não corrigir falhas P3 modificando a composição já aceita sem analisar o caso e receber um novo pedido. [Histórico técnico detalhado](historico/RESPONSIVE_LAYOUT_ANTES_REORGANIZACAO_2026-11-05.md) · [Estado vigente](ESTADO_ATUAL_VIGENTE.md) · [Pendências de verificação](OPEN_ISSUES.md).


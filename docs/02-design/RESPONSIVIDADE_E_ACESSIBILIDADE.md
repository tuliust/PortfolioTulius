# Responsividade, UX e acessibilidade
**Status:** contrato de apresentação · **Revisão:** 11/11/2026.

## Modelo
São 14 seções lógicas, 42 painéis cadastrados (desktop, mobile-a, mobile-b para cada seção), mas 13 seções publicadas e visíveis; `competencias` permanece oculta, não excluída. A apresentação mobile A/B é editorialmente distinta do desktop, com conteúdo compartilhado e placements próprios.

Não limitar textos longos a `100dvh`/`overflow:hidden` que tornem conteúdo inacessível. O admin possui prévia mobile em referência **390 × 844**, sem substituir um aparelho real.

## Navegação e interação
Conservar âncoras/hash, rolagem nativa, `scroll-margin` para header fixo, menu acessível, fechamento por Escape, foco/Tab, Voltar e visibilidade da seção ativa. [`ExperienceStack.tsx`](../../src/components/public/ExperienceStack.tsx) mantém logos/identidade sticky somente dentro das seis experiências, sem rolagem interna; em altura **≤620 px**, o header editorial pode deixar de ficar sticky.

Evitar animações pesadas e respeitar `prefers-reduced-motion`. Imagens precisam de alt apropriado; usar sincronização de metadados do catálogo. Verificar contraste e não esconder conteúdo após zoom.

## Regressão
Viewports históricos: **1920×1080, 1440×900, 1366×768, 768×1024, 720×450, 390×844, 360×800, 320×700**. Conferir imagens, overflow, menu, âncoras, foco, altura reduzida e mobile. P3 mede também LCP, mas aceite estético e orçamento de performance são evidências separadas.

[Design](IDENTIDADE_VISUAL.md) · [CI](../05-operacao/TESTES_E_HOMOLOGACAO.md).

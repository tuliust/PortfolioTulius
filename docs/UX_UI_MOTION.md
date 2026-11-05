# UX, interação e motion

**Fonte funcional de 05/11/2026:** [`79aa3c07`](https://github.com/tuliustsangaropulos/PortfolioTulius/commit/79aa3c07ce6c9106b1d504c1f574731bf70fb5d2), [CI aprovado](https://github.com/tuliustsangaropulos/PortfolioTulius/actions/runs/42020574434). O site publicado está visualmente correto; esta documentação **não autoriza alterações de animação, timings, cores, interação ou scroll**. [P3 anterior falhou](https://github.com/tuliustsangaropulos/PortfolioTulius/actions/runs/42020342275), não substituída por nova P3 do último SHA.

## Comportamento e acessibilidade

- Em Experiências mobile, a faixa de seis logos altera o fundo para laranja **somente quando realmente sticky** (`.experience-index.is-stuck`). A identidade da empresa e os projetos seguem no fluxo de rolagem natural; em telas ≤620 px de altura a identidade pode deixar de ser sticky.
- Os botões Projetos e realizações/Trajetória, links, foco, Escape e menus existentes devem manter semântica de controle e navegação.
- Os presets de transição disponíveis no Editor: **Nenhuma, Fade, Subir, Vir da esquerda, Vir da direita e Zoom suave**. A configuração em `sections.animation_preset` é usada na entrada de viewport, e `prefers-reduced-motion` deve ser respeitado.
- **Não homologado após a última mudança:** comparação visual de todas as transições e do sticky em iPhone físico. A verificação de código não substitui isso.

## Registro anterior (referência histórica de 01/11/2026)

## Comportamento atual — adendo mobile 01/11/2026

O modo mobile de Experiências mantém **uma única rolagem vertical natural**, faixa de logos e ficha da empresa sticky sem sair dos limites da seção. Na altura ≤620 px, a ficha passa a fluir normalmente; nunca esconda conteúdo só para manter os dois níveis fixos. Abas `Projetos e realizações`/`Trajetória` e acordeão usam botões nativos com estados acessíveis, sem interceptar a rolagem. O modo `prefers-reduced-motion` precisa continuar respeitado.

**Nota:** a seção abaixo é o contrato original de motion; revalidar qualquer mudança interativa com o teste de navegador antes de descrever como aceita.

---

> **Arquivo legado por assunto:** seções datadas abaixo registram decisões e medições de seus próprios SHAs; não as tratar como status operacional atual.

Reveals usam opacity/transform, cerca de 520ms. Drawer usa 250ms; setas deslocam 4px. `IntersectionObserver` ativa conteúdo ao entrar em tela, sem interceptar a rolagem.

`prefers-reduced-motion` desliga scroll suave, snap e transições. O menu fecha com Escape, clique externo ou destino, bloqueia apenas o body enquanto aberto e mantém controles focáveis.

Próxima evolução do CMS: persistir os parâmetros completos de `motion_config` já modelados em `block_placements`.

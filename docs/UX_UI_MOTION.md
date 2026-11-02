# UX, interação e motion

## Comportamento atual — adendo mobile 01/11/2026

O modo mobile de Experiências mantém **uma única rolagem vertical natural**, faixa de logos e ficha da empresa sticky sem sair dos limites da seção. Na altura ≤620 px, a ficha passa a fluir normalmente; nunca esconda conteúdo só para manter os dois níveis fixos. Abas `Projetos e realizações`/`Trajetória` e acordeão usam botões nativos com estados acessíveis, sem interceptar a rolagem. O modo `prefers-reduced-motion` precisa continuar respeitado.

**Nota:** a seção abaixo é o contrato original de motion; revalidar qualquer mudança interativa com o teste de navegador antes de descrever como aceita.

---

> **Arquivo legado por assunto:** seções datadas abaixo registram decisões e medições de seus próprios SHAs; não as tratar como status operacional atual.

Reveals usam opacity/transform, cerca de 520ms. Drawer usa 250ms; setas deslocam 4px. `IntersectionObserver` ativa conteúdo ao entrar em tela, sem interceptar a rolagem.

`prefers-reduced-motion` desliga scroll suave, snap e transições. O menu fecha com Escape, clique externo ou destino, bloqueia apenas o body enquanto aberto e mantém controles focáveis.

Próxima evolução do CMS: persistir os parâmetros completos de `motion_config` já modelados em `block_placements`.

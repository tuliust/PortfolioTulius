> **ATUALIZAÇÃO DOCUMENTAL DE 05/11/2026:** referência funcional [`31943c12`](https://github.com/tuliustsangaropulos/PortfolioTulius/commit/31943c12b8214aa1d4aad957d159ddcea010835e), [Validate #42016989021](https://github.com/tuliustsangaropulos/PortfolioTulius/actions/runs/42016989021) **success**, Vercel READY. **P3 geral não aprovado** no run [#42016688466](https://github.com/tuliustsangaropulos/PortfolioTulius/actions/runs/42016688466) de `04cf1240`: 7 falhas de navegador, apesar de P6 LCP mobile mediano de 3,484 s passar isoladamente. [Auditoria integral dos pedidos](AUDITORIA_PEDIDOS_CHAT_2026-11-05.md).
No mobile, a faixa de logos de Experiências recebe fundo laranja somente com a classe `is-stuck`; falta inspeção de rolagem e sticky em iPhone real. 

> **ATUALIZAÇÃO DE INTERAÇÃO — 05/11/2026:** [`94466303`](https://github.com/tuliustsangaropulos/PortfolioTulius/commit/94466303617b18e343dddeb64d2ca7e39f131475) disponibiliza as transições iniciais da seção **Nenhuma, Fade, Subir, Vir da esquerda, Vir da direita e Zoom suave** no Editor. `sections.animation_preset` é lido pelo site e `IntersectionObserver` adiciona `cms-section-entered`; CSS só anima após o ingresso em viewport e respeita `prefers-reduced-motion`. No [`5ed489af`](https://github.com/tuliustsangaropulos/PortfolioTulius/commit/5ed489af5879589565cb0101e420065bfbf50552), a faixa de logos mobile altera a cor quando efetivamente sticky. **Código e CI verificados; comparação visual de todas as opções em dispositivos reais não homologada.** [Registro](RECONCILIACAO_IMPLEMENTACAO_CHAT_2026-11-05.md).

**P3 do SHA funcional `5ed489af`:** [Audit P3 #42014121880](https://github.com/tuliustsangaropulos/PortfolioTulius/actions/runs/42014121880) **failure global** em `Browser routes and responsive viewports` (7 falhas automatizadas; Perfil mobile a 320 px entre elas). Em subgates separados, `P6_PERFORMANCE_BUDGET PASS`: LCP mediano de 3 simulações mobile **3,372 s** sob a meta **≤3,5 s**; desktop **0,905 s**. P5 read-only **3/3**, P4 **38 capturas sem falha automática**. Esses resultados parciais não equivalem a P3 aprovado, p75 real ou aceite visual humano.

# UX, interação e motion

## Comportamento atual — adendo mobile 01/11/2026

O modo mobile de Experiências mantém **uma única rolagem vertical natural**, faixa de logos e ficha da empresa sticky sem sair dos limites da seção. Na altura ≤620 px, a ficha passa a fluir normalmente; nunca esconda conteúdo só para manter os dois níveis fixos. Abas `Projetos e realizações`/`Trajetória` e acordeão usam botões nativos com estados acessíveis, sem interceptar a rolagem. O modo `prefers-reduced-motion` precisa continuar respeitado.

**Nota:** a seção abaixo é o contrato original de motion; revalidar qualquer mudança interativa com o teste de navegador antes de descrever como aceita.

---

> **Arquivo legado por assunto:** seções datadas abaixo registram decisões e medições de seus próprios SHAs; não as tratar como status operacional atual.

Reveals usam opacity/transform, cerca de 520ms. Drawer usa 250ms; setas deslocam 4px. `IntersectionObserver` ativa conteúdo ao entrar em tela, sem interceptar a rolagem.

`prefers-reduced-motion` desliga scroll suave, snap e transições. O menu fecha com Escape, clique externo ou destino, bloqueia apenas o body enquanto aberto e mantém controles focáveis.

Próxima evolução do CMS: persistir os parâmetros completos de `motion_config` já modelados em `block_placements`.

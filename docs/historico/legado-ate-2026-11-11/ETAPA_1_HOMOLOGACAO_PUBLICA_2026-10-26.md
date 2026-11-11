# Etapa 1/3 — auditoria automatizada do site público

**Data da execução:** 26/10/2026. **Natureza:** leitura de CI, publicação, navegador conectado, logs e artefatos; nenhuma alteração em produção.

## Escopo e provas

- Repositório `tuliustsangaropulos/PortfolioTulius`, HEAD na conferência: `e6cba1ec3b3158931a1395a50868a139eb421b9b`.
- [Validate PortfolioTulius 40280401168](https://github.com/tuliustsangaropulos/PortfolioTulius/actions/runs/40280401168): formatação, TypeScript, build, SEO, smoke e **39 testes unitários em 6 arquivos** aprovados.
- Vercel: deployment `dpl_DEAtJaZsRybM7HRV84TbYkZpT8gX` `READY`, commit `1f528b9560a062a5a0459de88516fd56ee9fc6b8`. Comparação com HEAD da ocasião: mudanças somente em documentos/workflow, sem divergência de código do aplicativo.
- [Audit P3 Lighthouse 40276635257](https://github.com/tuliustsangaropulos/PortfolioTulius/actions/runs/40276635257), SHA `d6bca9e59b49e9cea534b79f64cdd63d4de056a1`: smoke HTTP/SEO, rotas anônimas, menu/teclado/hash, temas de resultados, pilha de experiências, RLS público e responsividade passaram. **8 viewports** sem overflow horizontal; **38 capturas** de seções/painéis, sendo 13 desktop e 25 mobile. Esse teste não foi executado no HEAD daquele instante.
- Artefatos do Actions consultados: JSON Lighthouse mobile/desktop, screenshots de viewports e capturas editoriais. O relatório original e o pacote ZIP foram entregues como anexos da conversa de auditoria; **os arquivos binários não foram incorporados ao Git**, e os artifacts do Actions têm prazo de expiração.

## Lighthouse da execução histórica

| Métrica | Mobile | Desktop |
|---|---:|---:|
| Performance | 70 | 97 |
| Acessibilidade | 96 | 96 |
| Boas práticas | 100 | 100 |
| SEO | 100 | 100 |
| LCP | 4,54 s | 1,16 s |
| TBT | 336 ms | 0 ms |

**Problemas comprovados:** cinco elementos `.item-meta` de Formação tinham contraste insuficiente (~3,2:1) por colisão de regra global `!important` com o CSS da seção escura. Foram reportadas oportunidades de ~53 KiB na entrega de imagem e ~102 KiB de JS não utilizado na execução de laboratório; essas estimativas não demonstram automaticamente a melhor solução de carregamento.

## Continuidade / resolução posterior

A correção de contraste foi aplicada na **etapa 3** e comprovada pela [auditoria 40286141852](https://github.com/tuliustsangaropulos/PortfolioTulius/actions/runs/40286141852): acessibilidade **100/100 em mobile e desktop**, Performance mobile **75** e desktop **96** (LCP mobile ~4,51 s). Manter a necessidade de otimização mobile e homologação em dispositivo real.

**O que esta etapa não testou:** sessão JWT administrativa, upload/download de bytes, CRUD produtivo, zoom 200%, fidelidade pixel a pixel e inspeção visual humana de todas as transições.

Referência de estado corrente: [Auditoria consolidada](AUDITORIA_ETAPAS_1_A_3_ESTADO_ATUAL_2026-10-26.md). Não substituir o contexto temporal acima por medidas posteriores.

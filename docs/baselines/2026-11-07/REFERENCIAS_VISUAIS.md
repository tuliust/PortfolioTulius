# Referências visuais anteriores às alterações de Identidade e Editor do Site

**Código da referência:** [`207327b1ebe974e768a81f752fe1184249d210ba`](https://github.com/tuliustsangaropulos/PortfolioTulius/commit/207327b1ebe974e768a81f752fe1184249d210ba). **Origem:** GitHub Actions [Audit P3 Lighthouse, run 42324142930](https://github.com/tuliustsangaropulos/PortfolioTulius/actions/runs/42324142930). **Resultado global do P3:** failure. O inventário não altera as capturas nem sua interpretação.

## Arquivos originais recuperados

1. **p3-viewport-screenshots** — 17 PNG, artifact **13554207489** (capturado 07/11/2026; expira **14/11/2026**). Referências de viewports incluem `p3-320x700.png`, `p3-360x800.png`, `p3-390x844.png`, `p3-720x450.png`, `p3-768x1024.png`, `p3-1440x900.png`, `p3-1920x1080.png`, além de menus, Resultados e Experiências. ZIP SHA-256: `4e63b5ba62651b8cd05dee4c69bc467744672911fcb7ca75b2b94943d9bb2334`.
2. **p4-editorial-38-panels** — 38 PNG, artifact **13554112734** (capturado 07/11/2026; expira **14/11/2026**). Contém 13 painéis desktop e 25 painéis mobile; destaque para `p4-desktop-01-perfil-desktop.png`, `p4-mobile-01-perfil-a.png`, `p4-mobile-01-perfil-b.png`. ZIP SHA-256: `1a6e239c0c678e93de55da8769c7f06b094968313fa3cc9e5d17fca35c14545e`.

**Pacote de entrega nesta conversa:** os dois ZIPs foram extraídos e recompilados **sem alterar PNGs** em `referencias_visuais_baseline_2026-11-07.zip` (55 PNG + `LEIA-ME.json`), SHA-256 `a6d5d2e88bd4ec1eb7d9e2e3f5a879f46bfdcdff9b8e0555e6f11060f032767b`. Este arquivo está disponível como anexo gerado no chat; **não foi versionado no repositório**, que é público. Salve uma cópia local antes do vencimento dos artifacts.

## Uso na comparação futura

- Comparar **mesma seção, mesmo dispositivo, mesma largura/altura, mesmo conteúdo e mesma fonte carregada**.
- Desktop: Perfil, seção Sobre, Resultados, Formação, 6 Experiências, Ferramentas, Depoimentos e Contato.
- Mobile: Perfil A e B; demais painéis correspondentes; casos 320, 360, 390, 430 px devem ser rechecados mesmo quando a captura antiga não tiver exatamente 430 px.
- Fotografias e referências antigas fornecidas no chat são evidências adicionais, mas **não** devem ser confundidas com screenshots do código `207327b`.
- O P3 anterior reprovado não deve ser tratado como aceite manual nem como baseline de performance cumprida.

## Integridade

As capturas resultam do workflow do SHA acima. O conteúdo público e os estilos podem sofrer atualização remota independente do GitHub; por isso sempre registrar **data/commit** e, para comparação fiel, congelar também a cópia de **campos de apresentação** do Supabase disponível [aqui](cms-estilos-supabase.json).

O manifesto é estável no GitHub. Os ZIPs dos artifacts originais podem expirar; o pacote entregue na conversa deve ser preservado separadamente.

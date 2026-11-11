# P2 — Desempenho, carregamento e homologação

Data: 2026-10-24. Branch: `main`. Site: https://tulius.work.

## Referência anterior

No build local aprovado do P1, o maior arquivo JS tinha **533,01 kB minificados / 156,46 kB gzip**. O Vite exibia aviso para chunks superiores a 500 kB. Isso **não equivale** a uma medição de Core Web Vitals nem representa o total baixado pela página.

## Mudanças desta etapa

1. **Divisão de código:** `vite.config.ts` usa `build.rolldownOptions.output.codeSplitting.groups` do Vite 8/Rolldown para isolar código de `node_modules` em chunk `vendor`. O objetivo é evitar invalidar o cache do framework em toda edição editorial e reduzir o maior chunk. A soma do JS não necessariamente diminui.
2. **Imagens:** cards renderizados recebem `loading="lazy"` e `decoding="async"`; o retrato da seção inicial recebe `loading="eager"`, `fetchPriority="high"` e `decoding="async"`. As proporções, fontes de imagens e estilos CSS não mudaram.
3. **Fontes:** Google Fonts foi movido de `@import` no CSS para uma tag `<link rel="stylesheet">` descoberta pelo HTML; há `preconnect` para os domínios CSS e de fontes. O conjunto de famílias e pesos foi mantido.
4. **Payload Supabase:** a seleção pública de `sections` e `content_blocks` solicita apenas os campos utilizados pelo renderer; não modifica tabelas ou RLS.
5. **Cache:** bundles estáticos hashados mantêm `immutable`; o HTML passa a exigir revalidação para evitar apontar para scripts antigos.
6. **Medição:** `scripts/report-bundle.mjs` exibe tamanho minificado e gzip de cada chunk JS/CSS, a soma dos chunks JS e um aviso se o maior chunk superar 500 kB.
7. **Smoke HTTP:** `pnpm smoke:prod` valida código HTTP, HTML/título/canonical, `robots.txt`, `sitemap.xml` e `X-Robots-Tag` da rota administrativa, sem credenciais.

## Verificações locais

Na branch `main` do VS Code (PowerShell):

```powershell
git pull --ff-only origin main
pnpm.cmd typecheck
pnpm.cmd test
pnpm.cmd build
pnpm.cmd smoke:prod
git status -sb
```

A linha `P2 bundle:` informará o maior JS efetivo. Compare esse valor com 533,01 kB anteriores. Se um chunk permanecer acima de 500 kB, reavaliar agrupamento após consultar o relatório, **não** esconder o aviso alterando apenas `chunkSizeWarningLimit`.

## Verificação visual e acessibilidade

- Conferir desktop 1440×900 e 1920×1080, especialmente a primeira seção em 100dvh, retrato, selo, destaques e coluna direita.
- Conferir smartphone 390×844, navegação e dois painéis da seção inicial.
- Verificar funcionamento com zoom de 200%, navegação apenas por teclado, menu via Escape, foco e contraste.
- Verificar imagens na aba Network, primeiro carregamento e carregamento com cache; confirmar que os cards abaixo da primeira dobra não são todos carregados imediatamente.
- Executar Lighthouse em mobile/desktop na URL de produção e registrar LCP, CLS, INP e tamanho total transferido. Não afirmar melhoria de métricas sem comparação em condições semelhantes.
- Confirmar `/admin/login` e prévia com sessão administrativa sem alterar conteúdos reais.

## Limites

Este P2 é otimização técnica inicial. Não houve auditoria visual automatizada nem medição de Core Web Vitals neste ambiente. O smoke HTTP não executa React no navegador e não valida login, RLS, editor, mídia ou responsividade. A publicação pode ocorrer pelo GitHub/Vercel antes da homologação manual.

Próximos candidatos: audit de imagem/formatos modernos, divisão mais fina se relatório indicar, auditoria Lighthouse e teste end-to-end autenticado em ambiente seguro.

## Resultado da primeira medição local (2026-10-24)

- TypeScript: passou.
- Vitest: **17/17** testes passaram.
- Build: passou, SEO gerado.
- Maior chunk: **490,56 kB minificado**, `vendor`; **42,45 kB / 8,0%** menor que a referência de 533,01 kB.
- JS total dos quatro chunks: **586,96 kB** minificados. Atenção: soma dos chunks gerados não é o tamanho necessariamente transferido na primeira visita.
- `smoke:prod`: falhou inicialmente com `UND_ERR_CONNECT_TIMEOUT` ao conectar a `tulius.work:443`. Isso não foi um erro de status HTTP, conteúdo, build ou regressão do CSS; a conexão nem foi estabelecida.

## Diagnóstico do smoke remoto

Depois de `pnpm.cmd build`, execute `pnpm.cmd smoke:build` para verificar os arquivos gerados *offline*. Esse comando não prova que o domínio público está acessível.

O `smoke:prod` agora inicia Node 24 com `--use-env-proxy` para suportar `HTTP_PROXY`/`HTTPS_PROXY` caso o ambiente use proxy. Se ainda houver timeout, no PowerShell:

```powershell
curl.exe -I --max-time 20 https://tulius.work/
Test-NetConnection tulius.work -Port 443
pnpm.cmd smoke:prod
```

Não cole no chat valores de `HTTPS_PROXY` ou outras variáveis que possam conter credenciais. Se o `curl.exe` funcionar mas o Node não, investigue proxy, VPN, firewall, IPv4/IPv6 e certificados locais; se ambos falharem, inspecione DNS e conectividade e compare com o endereço do deployment Vercel. Falhas de conectividade não devem ser classificadas como testes positivos.

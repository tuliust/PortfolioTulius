# Missão de performance, qualidade e homologação integral

**Data da análise:** 26/11/2026 (horário de Brasília). **Natureza:** diagnóstico e roteiro de execução para ChatGPT Work, Codex ou outro agente autorizado. **Estado:** missão proposta; as etapas abaixo não foram executadas pelo simples registro deste arquivo. A execução depende de uma solicitação vigente do proprietário. Este roteiro não substitui [AGENTS.md](../../AGENTS.md), o [índice canônico](../README.md), os contratos temáticos ou o [protocolo documental](../06-governanca/PROTOCOLO_ATUALIZACAO_DOCUMENTAL.md); não reabre automaticamente o [standby](../06-governanca/BACKLOG_STANDBY.md).

## 1. Objetivo

Melhorar de forma mensurável a velocidade, estabilidade, confiabilidade, acessibilidade e cobertura de homologação de https://tulius.work/, preservando integralmente o produto aprovado. Prioridade: LCP mobile mediano de até 2,5 s e performance Lighthouse mobile de pelo menos 95, com menor dispersão entre amostras, sem regressão de desktop, design, conteúdo, CMS, PDF, SEO, segurança ou navegação. A missão deve produzir soluções testadas, não somente uma lista de recomendações.

Repositório: [tuliust/PortfolioTulius](https://github.com/tuliust/PortfolioTulius), exclusivamente `main`. Stack: React 19, TypeScript, Vite, Tailwind CSS v4, Supabase e Vercel. Usar ambiente computacional, terminal, navegador e conectores efetivamente disponíveis. Verificar suas capacidades e permissões; não pressupor acesso a Docker, Safari real ou credenciais administrativas.

## 2. Evidência de partida e evolução

Em 26/11, a leitura da main, da Vercel e dos workflows confirmou o SHA funcional [5815875a8f562d98ace37d8261799cb36bab607f](https://github.com/tuliust/PortfolioTulius/commit/5815875a8f562d98ace37d8261799cb36bab607f), deployment [GQyNBNN6HNdkKevaPYiiVP5gkDeu](https://vercel.com/tuliust/portfolio-tulius/GQyNBNN6HNdkKevaPYiiVP5gkDeu) Production READY, gate P3 com SHA correspondente e Supabase ACTIVE_HEALTHY. Quatro workflows do SHA concluíram SUCCESS:

- [Validate #45918969944](https://github.com/tuliust/PortfolioTulius/actions/runs/45918969944): formatação, TypeScript, 314/314 testes em 68 arquivos, build, smoke offline e sintaxe browser.
- [P3 Lighthouse #45918969919](https://github.com/tuliust/PortfolioTulius/actions/runs/45918969919): três amostras por dispositivo; P6 PASS, zero falhas browser, 38 capturas editoriais sem falhas, três verificações públicas/RLS com zero mutações.
- [PDF Visual QA #45918969988](https://github.com/tuliust/PortfolioTulius/actions/runs/45918969988): SUCCESS da suíte sintética, não novo aceite autenticado de PDF real.
- [Export Docs #45918969953](https://github.com/tuliust/PortfolioTulius/actions/runs/45918969953): SUCCESS.

| Referência | LCP mobile mediano | Performance mobile | LCP desktop mediano | Performance desktop |
|---|---:|---:|---:|---:|
| 25/11, referência prévia de otimização | 5,313 s | — | — | — |
| [ca63496](https://github.com/tuliust/PortfolioTulius/commit/ca63496b2d945cf2f05e0ac564bc839048c0fd79) | 3,172 s | 92 | 0,957 s | 99 |
| [197a41d](https://github.com/tuliust/PortfolioTulius/commit/197a41d2996ea06071b0f50cf080711bcde4c286) | 3,032 s | 93 | 0,946 s | 99 |
| [5815875](https://github.com/tuliust/PortfolioTulius/commit/5815875a8f562d98ace37d8261799cb36bab607f) | 3,273 s | 90 | 0,943 s | 99 |

Últimas amostras mobile Lighthouse 13.5.0 (simulated throttling):

| Amostra | LCP (ms) | FCP (ms) | TBT (ms) | Performance | CLS |
|---|---:|---:|---:|---:|---:|
| 1 | 4383,451 | 2446,753 | 1947,174 | 54 | 0 |
| 2 | 3272,982 | 2125,817 | 28 | 90 | 0 |
| 3 | 3175,382 | 2068,803 | 11 | 91 | 0 |

A mediana cumpre o orçamento vigente (3500 ms); a meta desejada de 2500 ms ainda não foi atingida. A amostra 1 tem desvio expressivo de CPU/TBT; não atribuir causalidade à correção de fragmentos nem confundir diferença entre rodadas com regressão comprovada. A medição aplicada (DevTools) de 2828,410 ms é diagnóstica, não substitui o protocolo oficial. Não há INP real comprovado nesta análise.

Já implementado: otimização do retrato principal mobile, adiamento da fotografia de Olá em `197a41d` (a imagem de 485.376 bytes deixou de constar entre recursos pesados iniciais mobile), e tratamento seguro de fragmentos inválidos em `5815875`, com regressão isolada aprovada. Experimento WebP de Olá: 344.112 bytes contra 485.376 do PNG, dimensões 1086×1448, alfa e pixels visíveis idênticos; não incorporado ao repositório por limitação de transferência binária do conector. Avaliar benefício incremental, sem substituir mídia original.

Cobertura anterior comprovada: 37/37 URLs de imagens publicadas responderam HTTP 200, 54/54 registros publicados tinham objeto correspondente, 8/8 destinos de navegação válidos, 24/24 seleções de seis empresas em 320/390/768/1440 px, sem overflow; LinkedIn HTTP 200, WhatsApp HTTP 302 para domínio oficial, e-mail com formato válido (sem envio). HTTPS principal/WWW, robots e sitemap responderam 200; WWW sem redirecionamento explícito; HTTP puro retornou ECONNRESET no sandbox (inconclusivo). Três rotas admin anônimas redirecionaram para login. P5 Admin Read-Only 22/22 em `ca63496`, não reexecutado nos dois SHAs posteriores; novo P5 local transacional, Firefox, WebKit/Safari, iPhone físico, vídeo real e exportação PDF autenticada no SHA vigente não comprovados. O aceite histórico do PDF real de 18/11 permanece válido.

## 3. Hipóteses prioritárias

A auditoria P3 de `5815875` aponta na amostra mobile mais lenta:

| Área | Evidência | Investigação |
|---|---|---|
| Thread principal / JavaScript | TBT 1947 ms; tarefas do index até 423 ms e vendor até 364 ms; execução de scripts 1503 ms | Coverage, traces, React Profiler, divisão de chunks, tarefas longas e composição |
| Renderização LCP | atraso de renderização do elemento 813 ms no trace | Descoberta/paint do retrato, efeitos, ordem de montagem, dependências |
| CSS/layout | styleLayout 1706 ms; CSS bloqueante sinalizado em 382 ms | CSS crítico, layout/reflow, animações, scroll snap, coverage |
| Vendor | aproximadamente 46,4% não utilizado na abertura, 27.966 bytes sinalizados de 60.282 | dependências reais, tree shaking, separação pública/admin |
| Rede | 11 preflights | waterfall, payloads, duplicidade, prioridades e dependências |
| Mídias desktop | estimativa Lighthouse 637 KiB de economia | variantes de transporte, dimensões, lazy loading |
| Variabilidade | LCP 3175–4383 ms; TBT 11–1947 ms | baseline pareada, ambiente/runner, CPU e rede |

O LCP identificado é o retrato aprovado `/media/tulius-inicial-600.webp`. Os tempos do trace não são aditivos ao LCP simulado; economias estimadas não são ganhos garantidos. Não alterar o elemento LCP para satisfazer artificialmente o orçamento. O caminho público já separa o roteador admin; preservar a configuração e medir qualquer alteração de bundle.

## 4. Metas e critérios de aceite

| Indicador | Meta adicional da missão |
|---|---|
| Performance Lighthouse mobile e desktop | ≥95 em mediana |
| LCP mobile | ≤2500 ms em mediana de três amostras; pior amostra preferencialmente ≤3500 ms |
| LCP desktop | ≤1200 ms em mediana |
| FCP mobile | ≤1800 ms |
| TBT | ≤200 ms; investigar qualquer amostra discrepante |
| CLS | ≤0,1 em todas as amostras |
| INP real, se disponível | ≤200 ms no p75; não inventar valor nem usar TBT como equivalência |
| Acessibilidade, SEO e boas práticas | buscar 100; nenhuma perda frente aos limites e evidências vigentes |
| Testes aplicáveis | 100% dos executados aprovados; não executados/bloqueados permanecem separados |
| Navegação, mídias, erros JS e regressões | zero falhas reproduzíveis nos cenários homologados |

Preservar o guard P6 vigente, inclusive LCP mobile ≤3500 ms, condições de conteúdo LCP, CLS e demais limites. Não reduzir critérios, esconder conteúdo ou relaxar testes para obter PASS. A meta de 2500 ms é adicional, não alteração automática do gate. Medir condições comparáveis, cache frio, mesma metodologia, dispositivo, CPU/rede e versão Lighthouse; três amostras por dispositivo conforme protocolo e repetições diagnósticas quando necessárias. Registrar mínimo, mediana, máximo e dispersão; distinguir laboratório de campo.

## 5. Roteiro de execução

### W1 — Preparação e diagnóstico

Ler AGENTS e guias canônicos. Revalidar main/SHA, código, CI, Vercel e Supabase; verificar estado de trabalho (`git status -sb`, `git pull --ff-only origin main` quando seguro). Identificar disponibilidade de terminal, navegadores, Docker, conexões e limites. Registrar baseline, artefatos, screenshots, traces, waterfall, coverage, bundles e matriz evidência/hipótese/risco/prioridade. Conferir mudanças posteriores ao SHA de partida; não repetir tarefas comprovadamente concluídas.

### W2 — JavaScript e React

Investigar dependências, chunks do Vite, código não utilizado, tree shaking, lazy loading abaixo da dobra, separação pública/admin, React Profiler, rerenders, reconciliação, hooks, efeitos, listeners, observers, montagem de galerias/carrosséis/SVG e composição de seções. Antecipar Perfil sem perder âncoras, foco, SEO, conteúdo dinâmico, resiliência ou interação imediata. Não reintroduzir experimento profile-paint removido sem hipótese/evidência nova. Preferir melhorias pequenas demonstráveis à reconstrução.

### W3 — CSS, fontes e renderização

Analisar coverage, estilos críticos, divisão e carregamento seguro do CSS, reflow/repaint, layout thrashing, propriedades caras, fontes/preloads, animações e scroll snap, trabalho fora da viewport. Manter ordem do cascade, CSS @import, fontes/pesos, cores, proporções, dimensões, espaçamentos e composição. Comparar screenshots, geometria e diferenças relevantes de pixels antes/depois em todos os modos; não afrouxar tolerâncias para esconder regressão.

### W4 — Imagens, vídeos e recursos

Inventariar mídia realmente utilizada, dimensões, prioridade, duplicidades, srcset/sizes, preload, decoding, lazy loading, cache, headers e bytes. Testar variantes WebP/AVIF quando adequado, com preferência sem perdas para fotos aprovadas; comprovar transparência e enquadramento. Avaliar o WebP experimental de Olá e economia desktop. Derivada estática deve corresponder à URL exata vigente do CMS e respeitar trocas editoriais e PDF; não substituir/excluir original ou publicar mídia fictícia. Testar vídeos existentes e controles com fixture sintética; vídeo real apenas se disponível, sem cadastrar conteúdo novo.

### W5 — Supabase e rede

Diagnóstico produtivo somente leitura: consultas iniciais, redundância, preflights, campos/payloads, filtros, concorrência, dependências, latência, composição JSON, coleções secundárias, alt/enquadramento, cache, atualização e falhas parciais. Investigar redução segura de viagens de rede e trabalho inicial. Não esconder falhas com fallback editorial desatualizado nem alterar schema, migrations, RPCs, Auth, RLS, dados, Storage ou configuração. Para testes de banco utilizar exclusivamente Supabase CLI + Docker local com `supabase/config.toml` e `seed.local.synthetic.sql`, nunca seed de produção ou link/db push. Se indisponível, registrar bloqueio e avançar nas demais etapas.

### W6 — Site público e compatibilidade

Conferir catálogo publicado atual (13 seções na referência), painéis, navegação, menu, âncoras, fragmentos válidos/inválidos, histórico, seis experiências e transições Projetos/Trajetória, Resultados, Formação, Ferramentas, Depoimentos, Contato, galerias, mídia, teclado, foco, contraste, alt, semântica, movimento reduzido, scroll snap, links internos/externos, 404, HTTP/HTTPS/WWW e canonical. Não enviar mensagens, ligar ou autenticar em serviços de terceiros durante a verificação de links. Registrar redirecionamentos e falhas inconclusivas. Testar Chromium, Firefox e WebKit quando disponíveis, 320/360/390/414/430/768/1024/1280/1440/1920 px e paisagem; conferir console/rede, overflow, sobreposição, cortes. Distinguir WebKit emulado, Safari real e iPhone físico. Corrigir defeitos reproduzíveis no escopo, sem modificar infraestrutura por inferência.

### W7 — CMS e PDF

Reutilizar P5 Admin Read-Only existente; verificar login/logout, proteção de rotas, módulos, catálogo, seletores, enquadramento, projetos, galerias, vínculos estáveis, prévia e descarte. Verificar edição, persistência, revisão/restauração, publicação/despublicação e ordenação exclusivamente em ambiente sintético; não realizar escrita de teste em produção. Conferir feedback e integridade CMS/renderer. Reutilizar PDF Visual QA: Desktop/Mobile, Original/Clean, seleção integral/parcial, fontes e imagens, texto pesquisável, links, paginação, cortes, proporção, impressão. Preservar aceite histórico do PDF real; não declarar fixture sintética como exportação autenticada. Se acesso autorizado read-only ao CMS real não estiver disponível, registrar a limitação; não buscar segredos.

### W8 — Resiliência, SEO e segurança operacional

Simular falhas de rede/leituras em ambiente controlado, timeouts e respostas inesperadas; verificar mensagens, recuperação e conteúdo já carregado. Conferir acesso anônimo, proteção administrativa e exposição de dados, RLS somente leitura; meta tags, robots, sitemap, canonical, Open Graph, favicon, cache e redirects. Corrigir problemas de código comprovados no escopo; não reabrir auditorias de segurança, retenção ou outras tarefas em standby sem autorização específica.

### W9 — Automação e regressão

Revisar os sete workflows ativos e ampliar cobertura necessária sem retirar testes. Executar `pnpm format:check`, `pnpm typecheck`, `pnpm test`, `pnpm build`, `pnpm smoke:build` (ou `pnpm check` + smoke), Validate, P3 Lighthouse, P5 Admin Read-Only, testes transacionais sintéticos, PDF Renderer Visual QA, Export Docs e verificações de segurança/higiene pertinentes. Criar regressão por erro corrigido. Usar gates existentes e comparar por SHA funcional. Se o conector não disparar workflow, buscar meio autorizado no Work ou reportar não executado. Nunca usar rerun de SHA antigo como nova homologação.

### W10 — Entrega incremental

Para cada hipótese: reproduzir → implementar mínima mudança → testar isoladamente → comparar baseline e visual → revisar diff → documentar → commit main somente se autorizado e validado → verificar integração Git/Vercel automática, SHA servido, CI e regressão. Se resultado insuficiente ou negativo, não publicar experimento; se regressão produtiva, corrigir/reverter pontualmente por novo commit após validação, sem force-push/reset destrutivo/deploy manual. Não avançar mudanças dependentes enquanto a anterior não estiver verificada. Iterar enquanto houver oportunidade relevante e segura; parar quando ganhos não se sustentarem, houver risco de regressão ou limites concretos.

## 6. Restrições

Preservar design, textos, mídia, responsividade, funcionalidade, SEO, segurança e dados. Sem reconstrução/migração de framework, novas branches/PRs, alterações de infraestrutura, Auth/RLS/schema/migrations/Storage ou custos/planos pagos não autorizados. Sem operações destrutivas, escrita produtiva de testes, acesso/exposição de segredos, publicação de fontes privadas, relaxamento de testes ou reabertura automática do standby. Não realizar deploy manual. Encerrar ambientes temporários após ensaios. A solicitação de execução vigente deve determinar a autorização de commits e publicação pela integração existente; este arquivo não é ordem permanente. Solicitar intervenção humana apenas por bloqueio real de acesso, custo, autorização ou risco não contornável; continuar o restante.

## 7. Relatório e encerramento

Atualizar guias canônicos afetados no mesmo trabalho, preferencialmente no commit funcional, conforme [protocolo](../06-governanca/PROTOCOLO_ATUALIZACAO_DOCUMENTAL.md). As cinco fontes privadas consolidadas do Projeto ChatGPT são snapshots; quando desatualizadas, indicar quais e entregar versões completas para substituição privada, sem publicar seu conteúdo.

Entregar panorama executivo, diagnóstico com evidências, hipóteses descartadas, soluções implementadas e não publicadas, métricas antes/depois (amostras e condições), matriz por cenário/dispositivo/navegador, arquivos e commits, CI/deployment/artefatos por SHA, riscos e pendências. Classificar SUCCESS/FAILURE/não executado/não confirmado/bloqueado, com distinção entre sintético e produção. Informar metas atingidas/total avaliável e metas sem medição; não declarar 100% por ausência de evidência.

Critério final: buscar LCP mobile ≤2,5 s, performance ≥95 e aprovação de todos os cenários aplicáveis, sem regressão do produto. Se a meta não for atingida, apresentar o melhor resultado comprovado, tentativas, limites e próximos passos necessários. A execução não se encerra automaticamente na primeira melhoria.

## 8. Referências canônicas

[Arquitetura](../01-projeto/ARQUITETURA.md) · [Estado atual](../01-projeto/ESTADO_ATUAL.md) · [Responsividade](../02-design/RESPONSIVIDADE_E_ACESSIBILIDADE.md) · [CMS](../03-cms/GUIA_ADMINISTRATIVO.md) · [Mídias](../03-cms/MIDIAS_E_STORAGE.md) · [Supabase](../04-infraestrutura/SUPABASE.md) · [Segurança](../04-infraestrutura/SEGURANCA_E_ACESSOS.md) · [Vercel e SEO](../04-infraestrutura/VERCEL_DEPLOY_SEO.md) · [Testes](TESTES_E_HOMOLOGACAO.md) · [PDF](EXPORTACAO_PDF.md) · [Backup](BACKUP_E_RECUPERACAO.md) · [Guia IA](../06-governanca/GUIA_USO_POR_IA.md).

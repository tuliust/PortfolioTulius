# P4 / P5 / P6 — Encerramento das ações automatizáveis

> **Registro histórico de 25/10/2026.** Este documento não substitui o [estado auditado após as etapas 1–3 de 26/10/2026](AUDITORIA_ETAPAS_1_A_3_ESTADO_ATUAL_2026-10-26.md). As referências a 14 seções, 42 capturas e a escores Lighthouse mais antigos são medições válidas apenas para seus próprios SHAs.

Data: **25/10/2026** · Branch: **`main`** · Produção: https://tulius.work/

## Escopo e critério

Este documento registra ações efetivamente implementadas e verificadas, e distingue **automação aprovada** de **aceite humano ainda não realizado**. A referência visual final não foi modificada deliberadamente. Não foram criados usuários ou credenciais nem alterados dados editoriais, URLs, DNS, buckets ou configurações de Auth.

A decisão expressa do proprietário, anteriormente registrada em `docs/P4_P5_EXECUCAO.md`, de não revogar o PAT histórico e de não ativar Leaked Password Protection permanece em vigor. Ambas ficam fora do escopo, sem solicitações adicionais.

## P4 — Verificação visual automatizada

- `scripts/p4-visual-audit.mjs`: **42 painéis** (14 desktop em 1440×900 e 28 mobile em 390×844) capturados em PNG por elemento completo, não apenas recortes de viewport. Aguarda `document.fonts.ready` e carregamento de imagens; falha quando qualquer imagem do painel estiver quebrada, quando faltarem painéis, houver carregamento de erro ou conteúdo insuficiente e quando existir overflow horizontal.
- `scripts/p3-browser-smoke.mjs`: **8 viewports** (1920×1080, 1440×900, 1366×768, 768×1024, 720×450, 390×844, 360×800, 320×700), redirecionamentos protegidos, menu e foco inicial, Tab/Shift+Tab, Escape, fechamento e retorno de foco, navegação hash/Voltar e preferência por movimento reduzido.
- Contato em 320 px: valores dos três contatos sem quebras indevidas.
- Todas as verificações acima passaram no run https://github.com/tuliustsangaropulos/PortfolioTulius/actions/runs/40238280650.
- **Limite:** evidência de renderização e funcionamento não prova fidelidade pixel a pixel ou julgamento estético em relação aos projetos Canva/Figma/PDF; o usuário fará essa aprovação na última etapa.

## P5 — Testes de segurança e CMS

- `scripts/p5-public-rls.mjs` executa **consultas GET reais no Supabase em produção como visitante anônimo**, reutilizando apenas os cabeçalhos publicáveis do navegador (sem registrar os valores); verifica que são visíveis somente **14 seções publicadas**, com **zero** registros acessíveis de administradores, pendências editoriais, revisões ou audit logs. Confirma também redirecionamento de `/admin` e `/admin/preview` para login sem sessão. Aprovado; nenhuma escrita.
- `scripts/p5-admin-readonly.mjs` existe como suíte opt-in de autenticação real via Secrets `P5_ADMIN_EMAIL` e `P5_ADMIN_PASSWORD`. A suíte foi reforçada para verificar a seleção efetiva dos módulos administrativos e acusar qualquer requisição de modificação de conteúdo/Storage. **Não foi executada com sessão JWT real**, pois as credenciais não estão disponíveis pelas integrações atuais.
- Testes anteriores em transação SQL reversível cobriram criação, edição, publicação, duplicação, reorder, validação de placeholders, SEO e auditoria; não substituem E2E real do editor ou upload/download binário no Storage.
- **Limite:** CRUD via UI, upload real e restauração editorial a partir de revisões permanecem sem comprovação E2E. Não testar escrita diretamente no conteúdo publicado sem fixture isolado e estratégia de limpeza.

## P6 — Performance, SEO e deploy

- O site público agora carrega `PublicSite` diretamente em `/`; somente rotas administrativas e desconhecidas carregam o React Router via import dinâmico. A configuração de code splitting Vite/Rolldown mantém dependências React Router em um chunk `admin-router`, separado do bundle inicial.
- Comparação de **builds**, não de Core Web Vitals de campo: maior chunk de **490,56 kB** minificado / **140,88 kB gzip** passou a **397,10 kB / 111,04 kB gzip**; o roteador administrativo ocupa chunk separado de **93,11 kB / 30,78 kB gzip**. O JS total gerado permanece aproximadamente igual — houve **redução no caminho inicial do site público**, não desaparecimento de código.
- Foi ensaiada a remoção do agrupamento de bibliotecas; ela **piorou** o chunk inicial para 533,45 kB, portanto foi revertida. A carga não bloqueante das fontes também não mostrou ganho consistente e foi revertida, preservando a tipografia do projeto. Um preload do retrato local inicial foi mantido, com arquivo já confirmado no CMS.
- Lighthouse 13.5.0 em produção após a divisão de rotas, run https://github.com/tuliustsangaropulos/PortfolioTulius/actions/runs/40238280650: mobile **Performance 81**, **Acessibilidade 100**, **Boas Práticas 100**, **SEO 100**, LCP **4,35 s**, FCP **2,21 s**, TBT **135 ms**, CLS quase zero. Desktop **Performance 98** e 100 nas demais categorias, LCP **1,11 s**. Variação de execução impede atribuir integralmente os ganhos de score à alteração de código.
- **Última execução do gate de regressão**: https://github.com/tuliustsangaropulos/PortfolioTulius/actions/runs/40238529882 — **PASS mobile e desktop**. Lighthouse mobile **73** (LCP **4,52 s**, TBT **199 ms**, CLS 0), desktop **97** (LCP **1,20 s**), com **100/100 em acessibilidade, boas práticas e SEO** nos dois perfis. Os scores de laboratório variam: não atribuir ganho isolado de Lighthouse à alteração do bundle nem declarar LCP mobile resolvido.
- Workflow remoto preserva relatórios Lighthouse JSON e screenshots dos viewports/painéis como artefatos de Actions. `scripts/p6-lighthouse-guard.mjs` estabelece limites conservadores para regressões severas: Accessibility/SEO/Best Practices >=95, CLS <=0,1, Performance mobile >=55 e desktop >=90, LCP mobile <=6,5 s e desktop <=3 s. Esses limites **não** são metas ideais de Web Vitals nem garantia de velocidade em campo.
- HTML SEO, `robots.txt`, `sitemap.xml`, canonical, restrições de indexação do admin e smoke HTTP são verificados automaticamente.
- O LCP mobile na faixa dos 4 s permanece **oportunidade de melhoria**; a auditoria de qualidade técnica é válida, mas não prova atendimento ao patamar “bom” de Core Web Vitals.

## Gate antes da homologação manual do proprietário

1. Confirmar que **Validate PortfolioTulius** e **Audit P3 Lighthouse** passaram para o código publicado.
2. Confirmar deployment Vercel **READY** no commit `main` final.
3. Evidências de P4: 42 PNGs e relatórios de 8 viewports; P5: relatório `P5_PUBLIC_RLS`; P6: JSON Lighthouse e indicadores de bundle.
4. Não modificar mais o produto automaticamente **depois** de iniciar a homologação manual.

## Última ação — homologação do proprietário (não executada pelo assistente)

Conferir o site em desktop e telefone reais, incluindo zoom nativo de 200%, teclado, menu, leitura/contraste, todas as composições em comparação com o Figma final e os materiais Canva/PDF originais. Autenticar-se em `/admin/login` para revisar módulos, visualizar a prévia e sair; se optar por testar gravação/upload/publicação, utilizar **fixture descartável** em um procedimento com backup/restauração — nunca conteúdo real sem salvaguardas. Validar cargos, métricas, licenças e mídias das nove pendências editoriais somente com as fontes originais.

**Decisão de encerramento:** as ações automatizáveis executadas estão documentadas; os aceites humanos e a comprovação E2E autenticada exigem o acesso/juízo do proprietário. Nenhum desses itens deve ser descrito como “aprovado” antes da verificação real.

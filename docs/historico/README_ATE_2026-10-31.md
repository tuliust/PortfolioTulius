# Portfólio editorial — Tulius Tsangaropulos

## Revisão de experiências: badges, alternância tipográfica e CDI sem texto — 31/10/2026

- **Dados revisados no Supabase:** seis empresas com cinco tags editoriais cada. A Invest RS mantém as cinco competências já aceitas. Foram adicionados registros do tipo `{title: "Competências aplicadas", tags: [...]}` ao início de `content_blocks.content_json.items` do painel A da Prefeitura de São Paulo, Vale, TV Globo/SporTV, Grupo InPress e CDI Comunicação, preservando todos os demais itens, slides, métricas, status e coleções. Verificação SQL posterior confirmou **6/6 empresas com 5 tags**, sem alteração de schema, RLS, tabelas ou `career_experiences`.
- **Site público:** os botões `PROJETOS E REALIZAÇÕES` e `TRAJETÓRIA` usam agora **a mesma fonte de display e caixa alta**. O ativo fica maior e o inativo menor, invertendo a hierarquia quando o usuário seleciona Trajetória; os controles acessíveis `aria-pressed` e `aria-controls` foram preservados.
- **CMS:** `ContentStudio` ganhou campo dedicado **Competências aplicadas — tags abaixo do período**, uma por linha, salvando no próprio bloco A somente pelo botão Salvar existente. Há orientação sobre vínculo entre itens visíveis e títulos dos slides e atalho para a coleção `career_experiences`, que guarda o texto integral de Trajetória. Projetos, slides, competências e coleções não foram fundidos; não há autoescrita silenciosa.
- **CDI Comunicação — arte corrigida:** [job GitHub #41179537232](https://github.com/tuliustsangaropulos/PortfolioTulius/actions/runs/41179537232) **success**: três SVGs existentes descarregados do Storage, dois nós `<text>` removidos **por imagem** e checksum SHA-256 verificado. Três novos objetos publicados em `portfolio-generated/2026-10-31-cdi-no-text/`, com os três slides da CDI atualizados (3/3, verificação SQL posterior). **Os arquivos originais, proporção 1200×675 e conteúdos ilustrativos foram preservados**; não confundir com fotografias originais ou com as 19 outras ilustrações de 1200×1350. A rotina autenticada partiu de Storage privado e promoveu explicitamente ao público.
- **Verificações:** [CI #41179537245](https://github.com/tuliustsangaropulos/PortfolioTulius/actions/runs/41179537245) aprovado; revisão [`fb0caebd`](https://github.com/tuliustsangaropulos/PortfolioTulius/commit/fb0caebd98a32568355b4e3069958d664972ae7f) adicionou checagens de navegador de seis listas de badges, imagens CDI sem texto e tamanho/fonte dos controles. A [P3 #41179623669](https://github.com/tuliustsangaropulos/PortfolioTulius/actions/runs/41179623669) é uma medição separada; manter P3-PERF-01 aberto enquanto LCP mobile exceder 2,5 s. Não declarar homologação P2 transacional paga ou testes destrutivos.

## Estado atualizado em 31/10/2026 — revisão editorial e UX do CMS

**Código:** [`01a3a287`](https://github.com/tuliustsangaropulos/PortfolioTulius/commit/01a3a28731817c510616408d85196d10dd206113), [Validate #41175411745](https://github.com/tuliustsangaropulos/PortfolioTulius/actions/runs/41175411745) **success** e Vercel Production **READY** no mesmo SHA (`dpl_B64aMBXM9URAwppjwWcaxfjoTJJq`). A P3 do novo código é independente; não afirmar que LCP mobile foi corrigido.

**UX administrativa:** removido o aviso repetitivo "Origem do conteúdo: Itens editados neste bloco" de todos os editores, sem retirar acesso a "Editar registros vinculados" quando há coleção. A orientação "Textos da seção 02 — coluna direita" foi movida para o ícone de informações, visível por mouse ou clique e acessível via teclado. A prévia de "Ajustar enquadramento" ganhou área geometricamente limitada, imagem isolada e controles de posição/zoom sem sobreposição. Testes estáticos `admin-editor-notices-framing.test.ts` e CI aprovados; inspeção visual específica em 1440px e 390px ainda requer validação humana.

**Supabase — gravação editorial expressamente solicitada e conferida por leitura posterior:** **0** ocorrências `editorial_issues` abertas (oito desta rodada passaram a `resolved` e uma já estava resolvida), **3** depoimentos publicados e **2** exemplos fictícios arquivados reversivelmente. Permanecem Matheus Gomes, Ana Beatriz Neves e Fábio Seixas; nenhuma recomendação de Marcelo Ventura foi criada, pois não há texto autêntico disponível no acervo. Cargo Invest RS confirmado como "Assessor Executivo | Núcleo de Comunicação"; CDI alinhada à captura de LinkedIn fornecida, com texto detalhado na coleção e síntese nos quatro cards; Perfil e Vale exibem somente a articulação/atuação envolvendo 14 países; idiomas "inglês fluente / espanhol avançado" e cargo InPress foram confirmados. Imagens da Invest RS preservadas com aviso de caráter ilustrativo, alt provisórios corrigidos. Conteúdo original da mídia e Storage não foram modificados.

**Limites:** o proprietário autorizou as gravações pontuais de conteúdo desta rodada. Isso **não** reabre a homologação transacional P2, não autoriza staging pago, alteração de RLS, testes destrutivos, exclusão permanente, nem altera a pendência P3 de LCP mobile. Os depoimentos de Marcelo Ventura poderão ser acrescentados futuramente **somente** mediante texto real e autorização. Os registros anteriores deste documento são históricos e devem ser interpretados à luz desta atualização.

> **CMS UX implementado no código em 31/10/2026:** alinhamento de logo/legenda, catálogo de 50 ícones recolhível e seletor de mídia em modal com upload inicialmente privado e publicação explícita. [CI #41173453310](https://github.com/tuliustsangaropulos/PortfolioTulius/actions/runs/41173453310) aprovado; Vercel READY no mesmo SHA. **Ainda pendentes:** inspeção visual dos controles novos, P2 transacional suspenso e meta LCP mobile. Consulte [estado vigente](docs/ESTADO_ATUAL_VIGENTE.md).



Site público e CMS editorial em **React 19, TypeScript, Vite, Tailwind CSS v4 e Supabase**, publicado em [tulius.work](https://tulius.work/) pela Vercel a partir de `main`.

> **Etapa 5 — aceite automatizado aprovado:** [reexecução #40757162085 (tentativa 2)](https://github.com/tuliustsangaropulos/PortfolioTulius/actions/runs/40757162085), 13 seções, 25 painéis mobile, 38 capturas, 8 viewports e zero falhas. [Relatório de aceite](docs/P3_ACEITE_AUTOMATIZADO_FINAL_2026-10-28.md). **Aceite manual concluído pelo proprietário em 30/10/2026; LCP mobile ainda aberto.**

> **Fonte operacional única:** [docs/ESTADO_ATUAL_VIGENTE.md](docs/ESTADO_ATUAL_VIGENTE.md). Contém o snapshot de dados mais recente, evidências P0–P3, o estado real de homologação e as pendências atuais. **Confirme GitHub, Supabase e Vercel ao vivo antes de cada alteração:** este arquivo não atualiza automaticamente contagens/SHAs.

> **P2 transacional suspenso por decisão do proprietário (28/10/2026):** não foram aprovados custos para criar uma branch Supabase de homologação (cotação **US$ 0,01344/h**, mais possível consumo). Não provisionar ambiente pago, não disparar a suíte manual de escrita e não testar em produção. O P5 read-only permanece aprovado; as pendências transacionais ficam abertas, sem prazo, até nova autorização expressa. [Detalhes](docs/P2_TRANSACIONAL_STAGING_2026-10-28.md).

## Leitura obrigatória antes de qualquer ajuste

1. [`AGENTS.md`](AGENTS.md) — regras de preservação, segurança, branches e escopo.
2. [Índice vigente](docs/ESTADO_ATUAL_VIGENTE.md) e [pendências abertas](docs/OPEN_ISSUES.md).
3. **Layout e conteúdo:** [Design system](docs/DESIGN_SYSTEM.md), [Responsividade](docs/RESPONSIVE_LAYOUT.md), [Modelo de conteúdo](docs/CONTENT_MODEL.md) e [CMS](docs/ADMIN_CMS.md).
4. **Infra/segurança:** [Deploy](docs/DEPLOYMENT.md), [RLS](docs/SECURITY_RLS.md), [arquitetura](docs/ARCHITECTURE.md).
5. **Históricos:** [README acumulado anterior](docs/historico/README_ACUMULADO_ATE_2026-10-28.md), [pendências cumulativas](docs/historico/OPEN_ISSUES_ACUMULADO_ATE_2026-10-28.md), [auditoria de fases](docs/AUDITORIA_ETAPAS_1_A_3_ESTADO_ATUAL_2026-10-26.md). Não usá-los como estado corrente.

Para novos chats do projeto, consultar o [guia de Fontes](docs/GUIA_FONTES_CHATGPT.md) e a Fonte exclusiva de produto/design. **Código e dados vivos têm precedência sobre snapshots históricos.**

## Situação de entrega (28/10/2026)

- **P0:** consolidação documental versionada; sincronização das Fontes do projeto ChatGPT continua manual.
- **P1:** investigação de mídias/Storage/importador/branches concluída; nenhuma exclusão aprovada. [Evidências](docs/P1_INVESTIGACAO_HIGIENE_2026-10-28.md).
- **P2:** [P5 autenticado de leitura 4/4 PASS](https://github.com/tuliustsangaropulos/PortfolioTulius/actions/runs/40745631770), `contentMutations=0`; CRUD/publicação/restauração e Storage binário com fixture ainda não homologados.
- **P3:** [auditoria automatizada válida](https://github.com/tuliustsangaropulos/PortfolioTulius/actions/runs/40747019980), 13 seções/25 painéis mobile/38 capturas, a11y/SEO 100; **LCP mobile 4,38 s**, meta ≤2,5 s pendente; aceite visual humano pendente.

Esses status têm evidências e limites detalhados no índice; P5 read-only **não** homologa gravações no CMS.

## Desenvolvimento local

Pré-requisitos: **Node.js compatível com Vite 8** e **pnpm**.

```bash
pnpm install --frozen-lockfile
cp .env.example .env.local
pnpm dev
```

Configure **somente valores públicos** de `VITE_SUPABASE_URL` e `VITE_SUPABASE_PUBLISHABLE_KEY` em `.env.local`; não versionar o arquivo. Nunca usar chave `service_role` no frontend. Em outros ambientes, copiar `.env.example` manualmente conforme o sistema operacional.

## Testes e publicação

```bash
pnpm format:check
pnpm typecheck
pnpm test
pnpm build
pnpm check
```

Rotas principais: `/` (pública), `/admin/login`, `/admin` (protegida), `/admin/preview` (protegida), demais rotas 404. O conteúdo tem fallback local e origem principal Supabase quando configurado.

A integração **GitHub `main` → Vercel Production** cria deployment automaticamente em pushes. Antes de atribuir uma medição Lighthouse ao código, conferir que o deployment `READY` e a execução Actions correspondem ao **mesmo SHA**. Build: `pnpm build`; saída `dist/`. `supabase/migrations/` **não** é aplicado por build e a baseline inicial **não deve ser reaplicada**.

**Não modificar design, textos, mídia, segurança, branches, migrations ou dados aprovados fora do pedido.** Trabalhar somente na `main` conforme `AGENTS.md`; verificar diff, CI e Vercel após commits.

## Atualização operacional — P2 staging e medição P3 (28/10/2026)

O [P2 transacional](docs/P2_TRANSACIONAL_STAGING_2026-10-28.md) tem workflow manual e fixture seguros preparados, porém **ainda não foi executado** porque não existe staging Supabase aprovado e a criação de branch exige confirmação de custo. O [P3 #40757162085](https://github.com/tuliustsangaropulos/PortfolioTulius/actions/runs/40757162085) confirmou no deployment correspondente **Performance mobile 82/LCP mediano 4,32 s**, desktop 98/1,16 s (3 amostras por dispositivo), 13 seções/25 painéis/38 capturas e a11y/SEO 100. **A meta de LCP mobile continua aberta**. O índice [vigente](docs/ESTADO_ATUAL_VIGENTE.md) indica os próximos passos e não deve ser interpretado como SHA futuro fixo.

## Correções da verificação manual — 28/10/2026

A primeira rodada de revisão ajustou densidade visual desktop e, depois, quatro frentes específicas: **experiências** (até seis projetos visíveis por empresa, excedentes ocultados sem exclusão), **depoimentos** (cinco cartões expansíveis em grade desktop 3×2, dois registros **fictícios/ilustrativos identificados**, fonte única na coleção do CMS), **contato** (fotografia central isolada, rodapé com assinatura/localização, seta LinkedIn sem colisão) e **menu** (Início, Projetos em Destaque, Graduação e um único atalho Experiência Profissional → Invest RS; demais itens preservados). São **13 seções públicas e 8 entradas visíveis no menu**, com barra horizontal das seis experiências intacta.

Dados alterados em produção somente sob pedido expresso do proprietário, sem migration ou exclusões: **13 cards JSONB ocultados, 2 depoimentos fictícios adicionados, 2 blocos vinculados à coleção `testimonials`, 4 rótulos e 5 flags de menu atualizados**. Aceite humano permanece pendente. P2-TRANS e despesas de staging continuam suspensos; essas alterações editoriais não equivalem a testes transacionais P2.

### Evidências desta rodada

**Validação automatizada da rodada manual (28/10/2026):** [CI Validate #40773898800](https://github.com/tuliustsangaropulos/PortfolioTulius/actions/runs/40773898800) `success`; [Audit P3 #40773898835](https://github.com/tuliustsangaropulos/PortfolioTulius/actions/runs/40773898835) `success`, no SHA funcional [`faa43e2`](https://github.com/tuliustsangaropulos/PortfolioTulius/commit/faa43e2709bdcbe917e6e81bee2abb220dde5456) com Vercel Production `READY` antes da auditoria. Navegador: 13 seções, 25 painéis mobile, 8 viewports sem overflow, navegação sticky `PASS`, 38 capturas (13 desktop/25 mobile), zero falhas e zero painéis inadequados. P5 anônimo: 13 seções e 8 links de menu válidos, sem exposição de dados privados, `mutations=0`. O teste P4 reconhece a composição **intencionalmente fotográfica** de `contato/a` mobile somente quando a imagem existe e decodifica; todos os demais painéis mantêm critérios originais de conteúdo. Lighthouse mediano: mobile 75/LCP 4,69 s; desktop 94/LCP 1,56 s. Gate de regressão passou, mas LCP mobile ≤2,5 s **não está aprovado**. Aceite humano permanece aberto.

### Revisão manual do CMS — Seções e Mídia (28/10/2026)

- **Seções:** lista de status em português; publicação confirmada e limitada à RPC `publish_section` (sem liberação automática de placeholders); `Salvar alterações` não promove rascunhos nem arquiva contornando os botões. O campo **Exibir no site** continua ligado a `sections.is_visible`. Layouts editoriais especiais são fixos e indicados como tal no formulário; layout/motion de seções genéricas e temas compatíveis são refletidos pelo renderer público.
- **Feedback:** avisos flutuantes com fechamento e duração de 7 s nos formulários de Seções, Blocos, Coleções, Identidade, Mídia, Navegação, SEO e Revisões. Confirmações para operações relevantes continuam explícitas.
- **Mídia:** miniatura e nome do arquivo com extensão até selecionar um item. Apenas o item selecionado abre formulário de descrição/status, substituição e publicação. Campo **Crédito/licença** removido da interface e de atualizações futuras; 19 valores legados foram preservados no banco, sem exibição/uso. Os 21 títulos no Supabase foram igualados aos basenames de `storage_path`, sem alterar bytes.
- **Posicionamento da mídia:** seletores exibem área e dimensão de referência; janela permite regular X, Y, zoom e restaurar. Configuração por uso é salva junto ao bloco JSONB e refletida nas imagens públicas após salvar; arquivo Storage original nunca é recortado nem alterado. Para imagem Open Graph, a proporção 1200×630 px é orientativa: a mídia usada pelo crawler continua sendo o arquivo original, que deve ser preparado antes do upload.

**Limite do aceite:** inspeção de caminhos de dados, TypeScript, testes unitários, build, P3/P5 e leitura Supabase não substituem homologação de gravações com sessão administrativa real. P2 transacional segue suspenso sem gastos adicionais.

### Auditoria dos módulos administrativos

Ver [auditoria das dez abas](docs/AUDITORIA_ADMIN_MANUAL_2026-10-28.md), incluindo limites de homologação P2, registros SQL preservados e evidências de CI/P3.

## Ajustes técnicos de baixo risco após o aceite manual — 28/10/2026

- **Visão geral CMS:** substituída a frase fixa das 14 seções/2 distribuições por contagem dinâmica de seções visíveis e cadastradas, e contador das `editorial_issues` efetivamente abertas. Não houve alteração de registros.
- **Depoimentos:** grade desktop passa a ter duas linhas uniformes e cartões quadrados, com expansão ocupando duas linhas. No mobile mantém-se uma coluna fluida. Textos e cinco registros publicados preservados.
- **Janela X/Y/zoom:** o diálogo agora recebe foco inicial, retém Tab/Shift+Tab, permite Escape e devolve o foco ao controle anterior ao fechar; o arquivo original e configurações preexistentes continuam intocados.
- **Carregamento público:** a consulta de depoimentos, única coleção atualmente vinculada no Supabase público, é iniciada em paralelo à consulta da estrutura de seções. Isso remove uma etapa sequencial de rede no carregamento inicial; não constitui por si só comprovação de LCP ≤2,5 s.
- **Aceite humano:** declarado concluído pelo proprietário nesta conversa. P2, direitos de mídias, riscos de segurança anteriormente aceitos, exclusões de Storage/branches, 8 ocorrências editoriais e reconciliação de Fontes ChatGPT seguem como decisões separadas.

### Prevenção de regressão de escala desktop (28/10/2026)

O site público utiliza **escala natural de navegador**, sem redução CSS global para simular 75% do zoom. A nova referência de composição é a captura fornecida a 125% do navegador, desejada a 100%. Mudanças futuras devem ajustar tipografia/colunas/margens por componente e breakpoint, **nunca** `zoom` na raiz `.public-site` nem um `transform:scale()` global. `src/lib/layout-zoom.test.ts` e `scripts/p3-browser-smoke.mjs` impedem a reintrodução do padrão anterior; consultar [responsividade](docs/RESPONSIVE_LAYOUT.md). Nenhuma alteração de CMS, dados ou Storage foi necessária.

### Continuidade da frente manual e Fontes do ChatGPT — 28/10/2026

A documentação da rodada de verificação manual, das duas referências de zoom e da reconciliação dos **quatro arquivos atualmente anexados ao projeto ChatGPT** está em [`docs/CONTINUIDADE_CHAT_MANUAL_ZOOM_E_FONTES_2026-10-28.md`](docs/CONTINUIDADE_CHAT_MANUAL_ZOOM_E_FONTES_2026-10-28.md). O estado atual sempre é o SHA da `main`, não as cópias de Fontes datadas; não reabrir a revisão manual anterior sem novo achado.

### LCP mobile — otimização medida, meta ainda aberta

A rodada de 29/10 eliminou a montagem duplicada de DOM desktop/mobile no site público, com P3 13/25/38 e CI aprovados. LCP mobile mediano do SHA final `4ab9ce5`: **4,30 s** (baseline 4,36 s); o objetivo **≤2,5 s continua NÃO ATENDIDO**. Experimentos de `content-visibility` e carregamento não bloqueante de fontes foram revertidos por ausência de ganho. Evidências e próximo diagnóstico arquitetural em [qualidade P3](docs/P3_QUALIDADE_ACEITE_2026-10-28.md).

### Prevenção de score Lighthouse falso após divisão de chunks

O P3 de 29/10 isolou os chunks do Supabase sem mudar o cliente ou as consultas públicas. Uma tentativa anterior de REST customizado foi revertida quando deixou o site vazio: LCP baixo sem conteúdo **não é melhoria**. Novo gate `P6_LCP_CONTENT_GATE` exige o retrato publicado como LCP nas três amostras mobile/desktop. O objetivo ≤2,5 s continua aberto. [P3 completo](docs/P3_QUALIDADE_ACEITE_2026-10-28.md).

### Auditoria final da proteção P6 e divisão dos chunks — 29/10/2026 UTC

No SHA funcional [`cc30446`](https://github.com/tuliustsangaropulos/PortfolioTulius/commit/cc304462bf9bf2ab0d8583b85920eb136a127916), [CI #40800444163](https://github.com/tuliustsangaropulos/PortfolioTulius/actions/runs/40800444163) e [P3 #40800444157](https://github.com/tuliustsangaropulos/PortfolioTulius/actions/runs/40800444157) passaram, com Vercel Production `READY`. P3: **13 seções**, **25 painéis mobile**, **38 capturas**, `P3_BROWSER_AUDIT failures=0`, P5 anônimo **3/3**, **0 mutações**. O novo **`P6_LCP_CONTENT_GATE` passou em mobile e desktop**, comprovando que o LCP medido era o retrato publicado. Mediana Lighthouse mobile: **Performance 82, LCP 4,421 s**; desktop: **Performance 97, LCP 1,235 s**. O valor de 4,248 s do experimento `e1846ac` não se repetiu; **não há evidência de melhora causal do LCP** frente ao baseline de aproximadamente 4,30 s. A meta mobile **≤2,5 s permanece aberta**. Preservar o SDK e o conteúdo original; a separação dos chunks está mantida apenas como isolamento/cache, **não** como aceite de desempenho.

### Referência visual desktop mais recente (29/10/2026)

A nova solicitação do proprietário **substituiu** a captura anterior que buscava 125%: **o aspecto desejado a 100% agora é o visto a 75%** no anexo mais recente, em desktop ~1512×691. A implementação é localizada na mídia `min-width:1101px`, sem zoom/scale global e sem alterar dados. O P3 [#40806132632](https://github.com/tuliustsangaropulos/PortfolioTulius/actions/runs/40806132632) passou: início do título 66 px, cards 199–279 px, quatro destaques até 669 px e sobreposição selo/anos zero, além dos 13/25 painéis e 38 capturas. A meta LCP mobile ≤2,5 s permanece aberta. Esta referência **prevalece** sobre as referências anteriores a 75%/125% documentadas no histórico. O aceite estético da última mudança ainda depende de inspeção do proprietário.

### Primeira dobra desktop — refinamento de legibilidade (29/10/2026)

Com a geometria original mantida e sem `zoom` global, foram refinados apenas os textos secundários, as numerações 01–05 e os microespaçamentos da coluna esquerda. [CI #40807420317](https://github.com/tuliustsangaropulos/PortfolioTulius/actions/runs/40807420317) e [P3 #40807420323](https://github.com/tuliustsangaropulos/PortfolioTulius/actions/runs/40807420323) `success`, com 13 seções, 25 painéis e 38 capturas. O último destaque permanece dentro de 1512×691 e sem sobreposição com o selo. [Detalhamento no design system](docs/DESIGN_SYSTEM.md). O LCP mobile continua aberto (~4,45 s nesta amostra).

### Menu público compacto — 29/10/2026

Removidos subtítulos Perfil/Experiência/Referências e assinatura da gaveta; as oito opções mantêm ordem, destinos e altura mínima de toque 44 px. Admin sem edição de grupos; Supabase `navigation_items` preserva 14 registros (8 visíveis, 6 ocultos), todos com `group_name='Menu'` por compatibilidade. [CI #40810591049](https://github.com/tuliustsangaropulos/PortfolioTulius/actions/runs/40810591049) e [P3 #40810488285](https://github.com/tuliustsangaropulos/PortfolioTulius/actions/runs/40810488285) passaram; sem scroll em 390×844 nem 1512×691. Detalhes em [CMS](docs/ADMIN_CMS.md) e [responsividade](docs/RESPONSIVE_LAYOUT.md). LCP mobile segue aberto.

### Ajuste da Biblioteca de Mídia — 29/10/2026

A edição de cada mídia é aberta **no espaço do item clicado** na grade; botão X substitui “Fechar detalhes”; removido o campo de entrada de texto alternativo, sem apagar os metadados existentes. **Status editorial único “Publicado”** no admin e no banco: 27 registros publicados, 24 em bucket público, 3 ainda no bucket privado, com RLS e seletor de mídia mantendo as três privadas inacessíveis nas páginas públicas. Upload/substituição continuam em Storage privado até o comando explícito “Disponibilizar no site”. [Código `c9cb3de`](https://github.com/tuliustsangaropulos/PortfolioTulius/commit/c9cb3dee73fadd11fc1a7bae86a78e8a89e039fb), [CI #40812587748](https://github.com/tuliustsangaropulos/PortfolioTulius/actions/runs/40812587748) aprovado. P3 público: 13/25/38 e RLS 3/3 passaram; teste LCP falhou e está em repetição. Detalhes no [CMS](docs/ADMIN_CMS.md).

### Última verificação manual de composição — 29/10/2026

A fotografia central de “Olá!” foi ajustada localmente para encostar visualmente na margem inferior do desktop, sem alterar mobile ou aplicar zoom global. Os logos grandes das experiências estão sem borda; o seletor superior ficou intocado. Invest RS usa quatro itens visíveis, quatro ocultos **sem exclusão** no Supabase e sinalizados no admin Blocos. [Commit funcional](https://github.com/tuliustsangaropulos/PortfolioTulius/commit/d882d7a71ff45e0d6980cf85fbcaa6533f0f89db), [CI aprovado](https://github.com/tuliustsangaropulos/PortfolioTulius/actions/runs/40815457072), [auditoria P3 em andamento](https://github.com/tuliustsangaropulos/PortfolioTulius/actions/runs/40815457107). LCP mobile permanece pendente.



### Editor administrativo unificado — 30/10/2026

A navegação do CMS apresenta **Editor do site** no lugar de Seções, Blocos e Coleções como entradas separadas. O proprietário escolhe a seção uma vez e acessa conteúdo, informações, acervo estruturado e prévia contextual. O editor identifica blocos com fonte manual ou coleção explicitamente vinculada; ajustes técnicos de placements permanecem no modo avançado. Contratos de dados, ações de salvamento, status e guardas de publicação existentes foram preservados, sem mudanças no site público ou no Supabase. [Detalhes e limites](docs/ADMIN_CMS.md).

### CMS mobile, conclusão manual e performance (30/10/2026)

O proprietário declarou encerrada a verificação manual anterior. A interface `/admin` foi adaptada para celulares/tablets com menu superior rolável, formulários de uma coluna, diálogos acessíveis e grade de mídia flexível; [CI #41140863031](https://github.com/tuliustsangaropulos/PortfolioTulius/actions/runs/41140863031) aprovado. A auditoria pública [P3 #41140863050](https://github.com/tuliustsangaropulos/PortfolioTulius/actions/runs/41140863050) passou 13 seções/25 painéis/38 capturas e P5 sem mutações, mas **não passou no orçamento de LCP mobile (~7,66 s)**. O novo preload aponta para a foto original publicada, sem ganho conclusivo. Para resolver P3-PERF-01 é necessária derivada otimizada fiel, sem mudança de dados/Storage nem serviço pago não autorizado. P2 transacional permanece suspenso. [Estado detalhado](docs/ESTADO_ATUAL_VIGENTE.md).

### Verificação de fechamento técnico — 31/10/2026

No [commit funcional `e3c85c2`](https://github.com/tuliustsangaropulos/PortfolioTulius/commit/e3c85c275bc727c9c658b5cdaa5528f41dfb72fa), CI e Vercel estão aprovados; o [P5 autenticado read-only #41172037326](https://github.com/tuliustsangaropulos/PortfolioTulius/actions/runs/41172037326) validou 8 módulos, 50 ícones, editor mobile, proteção de rascunhos e logout, com zero mutações. A [P3 #41171332333](https://github.com/tuliustsangaropulos/PortfolioTulius/actions/runs/41171332333) após reversão do experimento não regressou na integridade 13/25/38, mas manteve **LCP mobile ~7,76s FAIL**; a meta ≤2,5s ainda exige nova frente arquitetural comprovada. P2 transacional continua suspenso; aceite visual humano da última rodada e 8 pendências editoriais aguardam confirmação/decisão. [Estado e evidências](docs/ESTADO_ATUAL_VIGENTE.md).

# Checklist de execução — PortfolioTulius

**[Novo checklist operacional P1–P3, Bloco 1](CHECKLIST_BLOCO_1_P1_P2_P3_2026-11-02.md)** · [evidências da execução](BLOCO_1_P2_P3_EVIDENCIAS_2026-11-02.md) · [inventário de 26 blocos](BLOCO_1_P1_INVENTARIO_2026-11-02.md).

**Etapa 2 · P4 em execução parcial, com decisões editoriais registradas**

**Atualizado em:** 02/11/2026. **Último SHA validado antes desta atualização:** `47874e42d32dc3df5257d02f4281275615a2fb35` ([CI aprovado](https://github.com/tuliustsangaropulos/PortfolioTulius/actions/runs/41397758622)). O documento preserva o histórico de P0–P3 e a classificação das pendências em P4.1–P4.6.

**Status correto:** parte das correções de código e das auditorias **já foi executada e validada**; as seis decisões de Formação/A e a aplicação do mesmo conjunto de campos às seis experiências **já foram aprovadas como diretrizes**. Isso **não** autoriza publicar a vinculação de Formação/A, sincronizar os dados das experiências ou modificar fotografias e configurações de produção sem as aprovações restantes.

## Resumo operacional vigente

| Frente | Executado ou decidido | Ainda pendente |
| --- | --- | --- |
| **P4.1 — Blocos e editorial** | 26 blocos manuais inventariados; Formação/A: 6 escolhas individuais respondidas (`meta=A`, `text=B`) e prévia **isolada em memória** implementada/testada; campos adicionais comuns às seis experiências definidos | Prévia **visual** em desktop/mobile e aceite de publicação; comparação/aceite dos valores de cada experiência; vínculos individuais |
| **P4.2 — CMS e staging** | CMS autenticado em modo leitura validado (6/6); plano de staging **isolado com dados fictícios** documentado | Provisionamento autorizado, testes de gravação, revisão, publicação e recuperação em staging |
| **P4.3 — Fotografia e mídia** | 75 mídias cadastradas verificadas; 53 objetos privados preservados; 19 slides e 6 logos auditados; proprietário confirmou as 3 fotografias atuais dos depoimentos; decisão de **manter** os 14 metadados alt | Vincular fotografias por IDs após ingestão e aprovação; homologação visual de enquadramentos; nenhum arquivo excluído |
| **P4.4 — Site, SEO e LCP** | 4 falhas de Contato corrigidas; falhas HTTP simuladas 4/4; 8 campos estáticos de SEO conferidos; plano de disparo seguro após publicação documentado | Implantar SEO automático somente após autorização; LCP mobile ≤2,5 s **não atingido** (última mediana simulada 3,419 s) |
| **P4.5 — Segurança** | Auditoria de leitura realizada; plano de endurecimento preparado | Staging com JWTs reais de teste e autorizações específicas para qualquer mudança em Auth, RLS ou RPCs |
| **P4.6 — Otimizações** | Login admin separado em chunk próprio; inventário técnico realizado | Otimizações adicionais com benefício mensurável e sem alteração da identidade visual |

**Critérios de encerramento:** uma implementação validada em CI **não** equivale a homologação editorial. Formação/A continua manual até a prévia visual e o aceite específico para publicação. As revisões humanas, as operações transacionais e a meta de desempenho permanecem abertas.

## Política de consolidação

- **P0:** registrar apenas as entregas implementadas. Todo trabalho remanescente de P0 permanece em P4.1–P4.2.
- **P1:** absorvida integralmente pelas pendências P4.3–P4.4; não há nova execução independente de P1.
- **P2:** diagnóstico de leitura da segurança e automações, correção pontual da hierarquia de títulos, Lighthouse acessibilidade **100/100 mobile e desktop** no SHA `4546b57`, P5 anônimo 3/3, teste de viewport e 38 capturas visuais sem violações capturadas; **pendências** seguem em P4.5. Não houve alteração de RLS, Auth, DDL, índices ou grants.
- **P3:** inventário e refatoração isolada de rota de login concluídos com validação automática. **Pendências não concluídas** seguem em P4.6.
- **Verificações finais:** precisam ser repetidas no SHA de encerramento de P4; um CI anterior não substitui essa execução.
- **Vistoria humana:** sempre por último.

## P0 — Entregas implementadas

- [x] Confirmar SHA/CI/deployment nos commits das alterações.
- [x] Mapear contratos das nove coleções estruturadas.
- [x] Validar campos obrigatórios, status, ordem e links em coleções.
- [x] Ligar descrição de seis trajetórias ao identificador estável das experiências existentes.
- [x] Corrigir seleção de mídia em prévia protegida e confirmar leitura de gravação em fluxos administrativos selecionados.
- [x] Registrar decisões editoriais: integração gradual; campos de experiência a escolher; todas as áreas, uma por vez; fotos explícitas; aprovação de diferenças; publicação com fluxo atual.
- [x] Implementar comparação e aprovação de divergências antes de alterar a origem de um bloco.
- [x] Preservar dados editoriais, imagens e Storage durante essas alterações.

**Não confundir implementação com homologação total.** Os 26 blocos manuais e todos os testes transacionais pendentes continuam na P4.

## P2 — Implementações e verificações registradas

- [x] Revisar, por leitura de SQL, RLS das 22 tabelas públicas, políticas de Storage, funções administrativas e autenticação.
- [x] Verificar, no catálogo SQL, que as seis RPCs `SECURITY DEFINER` alertadas possuem chamada a `private.require_portfolio_admin()`. Isto não prova resistência a todas as tentativas de exploração.
- [x] Inspecionar as 19 sobreposições de políticas permissivas `SELECT` e os 9 índices não utilizados, sem modificar políticas nem remover índices.
- [x] Revisar os oito workflows GitHub, o deploy Vercel e isolamento da rota pública de autenticação.
- [x] Corrigir hierarquia semântica dos projetos das seis experiências, com Lighthouse acessibilidade 100/100 desktop e mobile no SHA `4546b57`.
- [x] Verificar RLS anônima 3/3 sem mutação; a sessão anônima não recebeu registros de administradores, revisões, logs nem questões editoriais.
- [x] Executar verificações automatizadas desktop, tablet e mobile; 38 capturas editoriais sem erros capturados.

**Pendências de P2 transferidas:** P4.5.

## P3 — Inventário e otimização implementada

- [x] Inventariar tamanhos de módulos e bundles antes da mudança. Os maiores arquivos eram `src/index.css` (~135 KB), `AdminModules.tsx` (~125 KB), `PublicSite.tsx` (~45 KB), `AdminApp.tsx` (~43 KB) e o fallback editorial (~33 KB).
- [x] Extrair `AdminLogin` de `AdminApp.tsx` para componente independente e carregá-lo por import dinâmico exclusivamente na rota de login, preservando formulário, fluxo Auth e apresentação.
- [x] Fazer o painel importar `defaultTokens` diretamente de `src/content/defaultTokens.ts`, não do agregado `fallback.ts`.
- [x] Adicionar ao smoke test de build uma prova de que o login e a aplicação administrativa têm chunks próprios.
- [x] Inventariar como **candidatos à revisão, nunca à exclusão automática**: dois workflows pontuais de mídia (`publish-experience-media-once.yml`, `cdi-slide-remove-text.yml`), seus scripts, os arquivos JSON originais de ilustrações e o fallback editorial.
- [x] Validar alteração com formatação, TypeScript, testes unitários, build e smoke no SHA base: [Actions](https://github.com/tuliustsangaropulos/PortfolioTulius/actions/runs/41381532791).
- [x] Verificar deployment `READY` correspondente ao SHA base; push direto na `main` provoca deploy automático.

### Resultado mensurável da separação de chunks

| Métrica | Anterior (SHA `4546b57`) | Após correção (SHA `5accb75`) |
| --- | ---: | ---: |
| Login dedicado | inexistente | 1,72 KB minificado |
| `AdminApp` | 110,09 KB | 108,62 KB |
| JS minificado total | 700,15 KB | 700,43 KB |
| Chunks JS | 11 | 12 |
| Maior chunk JS | 198,19 KB | 198,19 KB |

A mudança cria um ponto de carregamento independente para o login. **Não demonstra ganho no LCP público, no tempo de login ou em métricas de campo.** É uma otimização de fronteira de carregamento e organização. O CSS global e a configuração do Vite não foram alterados.

**Pendências de P3 transferidas:** P4.6.

## P4.1 — Blocos manuais e integração editorial (P0/P1 anterior)

- [x] Inventariar os **26 blocos manuais**; comparação automatizada preliminar registrada na auditoria P4.
- [x] Selecionar **Formação/A** como piloto e comparar por campo os 3 registros de `education`; [6 diferenças documentadas](P4_PILOTO_FORMACAO_A_2026-11-02.md).
- [x] Receber as **6 decisões individuais** de Formação/A: `meta=A` (preservar os três períodos publicados); `text=B` (adicionar os três nomes completos de instituições).
- [x] Implementar e testar **prévia isolada somente em memória**, com IDs, ordem e metadados bloqueados contra desvios; [especificação e comparação](P4_PILOTO_FORMACAO_A_2026-11-02.md).
- [ ] Homologar a **prévia visual** em desktop/mobile, integrar o adaptador específico aprovado ao fluxo de vinculação e autorizar separadamente a publicação; o bloco continua manual.
- [ ] Confrontar textos, fotos, links, ordem, estado, metadados e estilos por painel.
- [ ] Solicitar aprovação de **cada divergência** antes de substituir origem.
- [ ] Vincular gradualmente apenas os blocos aprovados, mantendo originais recuperáveis.
- [x] Identificar os 6 campos adicionais escolhidos nas experiências: empresa, cargo, localização, período, projetos/realizações e mídias (logos/galerias), além da descrição já ligada.
- [x] Definir **o mesmo conjunto de campos adicionais para as seis experiências**.
- [ ] Comparar os **valores de cada campo em cada experiência**, inclusive projetos e mídia; aprovar individualmente as diferenças, definir referências de mídia e validar a prévia antes de sincronizar.
- [ ] Homologar propagação de experiências, projetos, métricas, formação, idiomas, ferramentas, depoimentos e contato.

## P4.2 — CMS, Supabase e editor (P0 anterior)

- [ ] Completar inventário de todos os campos editoriais, imagens, galerias, URLs, SEO, ordem, visibilidade e status.
- [ ] Verificar, campo a campo, formulário → gravação → Supabase → recuperação → prévia → público.
- [ ] Corrigir divergências remanescentes entre dados estruturados e `content_json`.
- [ ] Validar criar/editar/duplicar/ordenar/arquivar/publicar/ocultar seções e blocos.
- [x] Executar testes autenticados de leitura: 8 módulos, 9 coleções, 50 ícones, alterações não salvas, prévia de 14 seções, cancelamento de mídia e logout; **6/6, sem escrita**.
- [ ] Homologar prévia de rascunhos e guardas em cenários adicionais com operações salvas no staging.
- [ ] Homologar histórico e recuperação limitada.
- [x] Preparar [plano de staging com dados fictícios](P4_PLANOS_AUTORIZACOES_2026-11-02.md), revisando o workflow manual já existente.
- [ ] Provisionar ambiente e executar gravações somente após autorização de infraestrutura/credenciais/testes; **não usar produção nem seed editorial**.

## P4.3 — Fotografia, biblioteca e galerias (P1 anterior)

- [x] Conferir 75/75 registros de mídia com seus objetos Storage por bucket e caminho, sem alteração de dados.
- [ ] Investigar 53 objetos privados sem cadastro, **sem exclusão automática**.
- [x] Gerar [inventário dos 14 registros de mídia com alt vazio ou curto](P4_INVENTARIO_ALT_2026-11-02.md) por leitura do catálogo; sem gravar descrições inferidas.
- [x] Registrar opção **C: manter os metadados alternativos atuais**, inclusive os 14 registros previamente triados; nenhuma gravação realizada.
- [ ] Reabrir revisão de alt somente em caso de nova instrução ou falha de acessibilidade comprovada.
- [x] Testar cancelamento do seletor de mídia autenticado, preservando imagem salva sem escrita.
- [ ] Homologar upload privado, publicação deliberada, seleção, substituição e cancelamentos de operações com gravação em staging.
- [x] Validar por consultas a existência dos seis logos e 19 slides e a presença de título, legenda e texto alternativo em todos.
- [ ] Homologar visualmente enquadramentos, textos sobre imagens e galeria nos dispositivos finais.
- [x] Registrar confirmação explícita das 3 correspondências autor/fotografia; verificar existência dos 3 arquivos estáticos no repositório.
- [ ] Aprovar ingestão dos arquivos ao catálogo de mídia e posterior associação de `photo_media_id` a cada autor; **nenhum UUID de mídia disponível foi inferido e nenhum vínculo foi gravado**.

## P4.4 — Site, SEO e desempenho (P1 anterior)

- [x] Corrigir os quatro critérios P3 de alinhamento da seção Contato; verificação de navegador posterior: zero falhas.
- [x] Repetir Lighthouse mobile e registrar análise de fonte, CSS, JavaScript e atrasos de renderização; mediana **3,419 s** no SHA funcional `a0dfbeb` (meta ainda não alcançada).
- [ ] Otimizar LCP mobile para ≤2,5 s com medição comparativa e sem alterações involuntárias de conteúdo/fotografia/design.
- [x] Implementar preservação do conteúdo já carregado e da lista administrativa diante de falha posterior de leitura.
- [x] Injetar falhas GET de `section_panels` e `testimonials` em navegador; primeira dobra preservada com aviso, 2/2 cenários aprovados no ensaio anterior.
- [x] Homologar no navegador a recuperação de depoimentos com GET 503: 13 seções, três retratos e aviso de erro preservados; leitura completa da coleção continua sendo fonte primária quando disponível ([P3/P4 41389455933](https://github.com/tuliustsangaropulos/PortfolioTulius/actions/runs/41389455933)).
- [x] Ampliar falhas simuladas GET 503 para `design_tokens` e `pages`; **4/4 cenários** aprovados, sem perder as 13 seções quando a consulta não é essencial ([auditoria 41391579658](https://github.com/tuliustsangaropulos/PortfolioTulius/actions/runs/41391579658)).
- [ ] Homologar recuperação de mídia e carregamento após reconexão com diferentes condições reais de rede; estes testes não foram realizados.
- [x] Fazer `radius.card` publicado alimentar o CSS dos cartões de depoimento, com validação e testes unitários.
- [x] Revisar os 12 tokens publicados e ligar `font.heading` também ao seletor visual `--font-display`, preservando a tipografia atual por padrão.
- [ ] Homologar visualmente as futuras alterações de fontes no CMS em desktop/mobile.
- [x] Verificar em navegador **8 campos de SEO do HTML estático versus as linhas públicas do CMS**, sem escrita ([auditoria 41391579658](https://github.com/tuliustsangaropulos/PortfolioTulius/actions/runs/41391579658)).
- [ ] Definir mecanismo seguro de atualização do HTML de SEO após um novo salvamento publicado; o teste de paridade atual **não** comprova atualização automática pós-salvamento.

## P4.5 — Segurança, isolamento e acessibilidade pendentes de P2

- [ ] Homologar isolamento real admin / autenticado não admin / anônimo com JWTs separados em ambiente isolado; **não** usar identidade simulada em produção.
- [ ] Revisar e, se autorizado, endurecer permissões de execução das seis RPCs `SECURITY DEFINER`, a função auxiliar em schema privado, `search_path`, funções privilegiadas e Auth.
- [ ] Decidir sobre proteção Supabase contra senhas vazadas (Advisor aponta desativada); mudança exige aprovação específica.
- [ ] Propor e testar consolidação das 19 permissões RLS sobrepostas somente se houver ganho comprovado e sem alteração de acesso; analisar os nove índices antes de considerar remoção.
- [ ] Revisar proteção da branch `main`, regras/rulesets, ações de mídia com credenciais e workflow que usa `contents: write`. Leitura de branch protection não foi autorizada pelo conector GitHub (403); não presumir proteção inexistente.
- [ ] Testar com leitores de tela reais, contraste contextual, teclado completo em todos os formulários, ampliação nativa de 200% e 400%, foco, erros de formulário e dispositivos físicos.
- [ ] Resolver eventuais falhas remanescentes de contraste/textos alternativos e navegação, preservando o layout aprovado.

## P4.6 — Organização, recursos e otimizações pendentes de P3

- [ ] Avaliar extração de módulos independentes de `AdminModules.tsx` (>120 KB) apenas com contratos, testes e benefício mensurável.
- [ ] Revisar `PublicSite.tsx` e `src/index.css` por responsabilidades e repetição; não refatorar estilos sem capturas de regressão desktop/mobile.
- [ ] Quantificar oportunidades de deduplicação de consultas em `usePortfolio.ts`, inclusive caminhos da primeira dobra, depoimentos e seção completa, preservando fontes e filtros RLS.
- [ ] Auditar estratégia de cache e preloads, balanceando atualizações editoriais imediatas e LCP.
- [ ] Avaliar dependências de scripts históricos e arquivos temporários/duplicados antes de qualquer desativação ou limpeza, sem exclusão automática de mídia ou conteúdos.
- [ ] Medir novamente login, bundle do admin e navegador real; comparar antes/depois e reverter otimizações que não tragam benefício.

## Verificações finais automatizadas

- [x] Confirmar **CI e exportação de documentação** aprovados para o último ciclo da prévia isolada de Formação/A: commit `47874e42`, [Validate](https://github.com/tuliustsangaropulos/PortfolioTulius/actions/runs/41397758622) e [Export](https://github.com/tuliustsangaropulos/PortfolioTulius/actions/runs/41397758538).
- [x] Confirmar que a prévia `formation-pilot-preview.ts` ainda **não** alimenta o renderizador público e que nenhuma gravação ou vinculação foi aprovada. As verificações finais de toda a P4 continuam abertas abaixo.


- [ ] Rodar formatação, TypeScript, unit tests, build e smoke no **SHA final após P4**, não apenas no SHA P3.
- [ ] Rodar testes de CMS sem escrita em produção; staging transacional só com autorização.
- [ ] Reexecutar P3 navegador, P4 visual, P5 RLS/admin e medições de LCP.
- [ ] Verificar deployment de produção igual ao SHA final aprovado.
- [ ] Auditar ausência de regressões de conteúdo, fotos, navegação, layout, SEO e estados.
- [ ] Entregar relatório com evidências, problemas pendentes e limites das ferramentas.

## Etapa final — Vistoria humana

- [ ] Ler o relatório.
- [ ] Examinar visual/funcionamento de todas as seções do site público.
- [ ] Examinar todos os módulos do CMS.
- [ ] Comunicar erros e solicitar correções complementares.
- [ ] Autorizar mudanças adicionais quando necessário.
- [ ] Dar aceite humano final.

## Evidências relevantes

- [CI P2 e hierarquia de cabeçalhos](https://github.com/tuliustsangaropulos/PortfolioTulius/actions/runs/41380787867)
- [Lighthouse P2: acessibilidade 100/100; P3 ainda falho em Contato](https://github.com/tuliustsangaropulos/PortfolioTulius/actions/runs/41380788001)
- [CI P3 com chunks de login independentes](https://github.com/tuliustsangaropulos/PortfolioTulius/actions/runs/41381532791)

**Limites:** sem alteração de schema, políticas RLS, grants, dados editoriais, imagens, Storage ou configurações de Vercel. Revisões manuais e ensaios autenticados ainda pendentes. A produção é publicada automaticamente em pushes à `main`.

## Execução automática P4.1–P4.4 em 02/11/2026

Inventário e comparações preliminares, auditoria do Storage, correções de recuperação, raio de cartões e Contato e ensaios P3/P5: consultar [relatório P4](P4_AUDITORIA_AUTOMATICA_2026-11-02.md). **Os testes transacionais, aprovações editoriais individuais, fotos de depoimentos, LCP ≤ 2,5 s e SEO imediatamente atualizado para robôs continuam pendentes.** A conclusão parcial não autoriza migração de dados.

### Evidências adicionais de P4 concluídas

- [P3/P4: Contato sem regressões e injeção de falhas 2/2](https://github.com/tuliustsangaropulos/PortfolioTulius/actions/runs/41384467574)
- [P5: CMS autenticado e cancelamento de mídia sem escrita, 6/6](https://github.com/tuliustsangaropulos/PortfolioTulius/actions/runs/41384753740)

### P4 — Continuidade automática (falhas parciais e identidade visual)

- [x] Implementar fallback não destrutivo por fonte de coleção: distinguir requisição indisponível de coleção publicada vazia, mantendo fotos e cópias manuais, com testes de unidade.
- [x] Adicionar ao workflow P3 a verificação via navegador do fallback de coleção; a homologação é considerada concluída somente quando o workflow correspondente terminar com sucesso.
- [x] Auditar os 12 tokens publicados e corrigir o vínculo de `font.heading` com os seletores `--font-display`, sem alterar a escolha tipográfica existente.
- [x] Gerar lista de decisão de 14 arquivos com metadados alt a conferir, sem editar a biblioteca.

## Encerramento do escopo executável automaticamente — 02/11/2026

- [x] CI no commit funcional `38097a4`: formatação, TypeScript, testes, build e smoke ([run 41389455931](https://github.com/tuliustsangaropulos/PortfolioTulius/actions/runs/41389455931)).
- [x] Auditoria de navegador P3/P4 no mesmo SHA: zero falhas, 38 capturas sem violações detectadas, anônimo RLS 3/3 e falhas parciais 2/2 ([run 41389455933](https://github.com/tuliustsangaropulos/PortfolioTulius/actions/runs/41389455933)).
- [x] Verificar o efeito do token publicado `font.heading` em `--font-display`, mantendo o valor atual Big Shoulders Display; todos os 12 tokens publicados foram revisados.
- [x] Fornecer [inventário dos 14 atributos alt para revisão](P4_INVENTARIO_ALT_2026-11-02.md).
- [x] Atualizar [relatório executivo das ações automáticas e bloqueios restantes](P4_ENCERRAMENTO_AUTOMATICO_2026-11-02.md).
- [ ] LCP mobile ≤2,5 segundos: **não atingido**; 3,389 s de mediana do Lighthouse simulado no SHA funcional (três execuções).
- [ ] Testes CRUD transacionais, mudanças de segurança, migrações editoriais, substituição de imagens e SEO estático sem redeploy **não estão autorizados ou homologados** automaticamente.

A vistoria humana final e novos testes transacionais permanecem explicitamente pendentes.

## Continuação automatizada verificada — SEO estático e falhas (02/11/2026)

- [x] `scripts/p4-seo-parity.mjs`: comparar **8 campos** de HTML entregue aos robôs com valores publicados do Supabase, usando exclusivamente GETs já feitos pelo navegador; [P3/P4 audit 41391579658](https://github.com/tuliustsangaropulos/PortfolioTulius/actions/runs/41391579658).
- [x] `scripts/p4-partial-failure.mjs`: simular respostas 503 de `section_panels`, `testimonials`, `design_tokens` e `pages`; **4 de 4 passaram**, nenhuma mutação ou foto alterada.
- [x] CI do código funcional: formatação, TS, testes, build e smoke [Validate 41391579816](https://github.com/tuliustsangaropulos/PortfolioTulius/actions/runs/41391579816).
- [x] Reexecutar auditoria de navegador: zero falhas; **38 capturas**, RLS anônimo 3/3; Lighthouse acessibilidade 100/100 na medição anterior; [run 41391579658](https://github.com/tuliustsangaropulos/PortfolioTulius/actions/runs/41391579658).
- [ ] SEO atualizado automaticamente no HTML após novo salvamento, LCP ≤2,5 s e testes transacionais **continuam pendentes**.
- [x] Reunir respostas à [matriz de decisões](P4_TESTES_SEO_FALHAS_E_DECISOES_2026-11-02.md) e registrar as escolhas efetivas em [P4_DECISOES_2026-11-02.md](P4_DECISOES_2026-11-02.md); a autorização de publicação e as homologações restantes **não** foram concedidas.

## P4 — Decisões recebidas e preparação técnica (02/11/2026)

- [x] Registrar [as 8 decisões editoriais e técnicas do proprietário](P4_DECISOES_2026-11-02.md), sem interpretá-las como autorização para escrever em produção.
- [x] Preparar [comparação de Formação/A](P4_PILOTO_FORMACAO_A_2026-11-02.md); as seis escolhas foram respondidas (`meta=A`, `text=B` para cada formação), com prévia isolada sem gravações.
- [x] Incluir teste automatizado de proteção das 6 divergências e do conteúdo manual (`src/lib/collection-link-review.test.ts`); aprovado em [Validate 41394155842](https://github.com/tuliustsangaropulos/PortfolioTulius/actions/runs/41394155842).
- [x] Confirmar 3 arquivos `public/media/matheus-gomes.jpg`, `ana-beatriz-neves.jpg`, `fabio-seixas.jpg` e seus depoimentos estruturados; os caminhos estáticos não estão cadastrados em `media_assets`, e os `photo_media_id` continuam nulos.
- [x] Preservar os 14 `alt_text` do catálogo conforme opção C do proprietário.
- [x] Elaborar [planos técnicos](P4_PLANOS_AUTORIZACOES_2026-11-02.md) de staging fictício, disparo seguro de SEO publicado, hardening de segurança e experiências de LCP sem mudança visual.
- [ ] Formação/A: **aprovadas as seis decisões**; ainda falta prévia visual desktop/mobile, integração do adaptador ao caminho de vinculação e autorização de publicação. A versão pública atual continua prevalecendo.
- [ ] Experiências: escopo **comum às seis** já definido; revisar os valores, projetos e mídias de **cada empresa** antes de qualquer alteração de exibição.
- [ ] Fotos: após proposta de ingestão aprovada, criar registros de mídia e associar IDs em fluxo editorial autorizado; sem substituição ou perda das imagens atuais.
- [ ] Staging, SEO automático e mudanças de segurança exigem autorizações de implantação distintas. **Nada foi provisionado ou reconfigurado** nesta preparação.
- [ ] Meta de LCP mobile ≤ 2,5 s segue aberta (última mediana simulada **3,419 s**); sem alterações de tipografia, fotos ou layout.

## Decisões complementares aplicadas à prévia — 02/11/2026

- [x] **Experiências:** campo empresa, cargo, localização, período, projetos/realizações e fotos/logos/galerias terão **escopo igual para as seis empresas**. **Valores e fotos não foram sincronizados.**
- [x] **Formação/A:** período `meta=A` para as três formações; nome completo `text=B` para as três formações. Todas as **seis escolhas respondidas**.
- [x] Compor prévia puramente em memória com três textos novos; testes impedem mudanças silenciosas de IDs, título, grau, período, fonte e ordem; CI correspondente no GitHub Actions.
- [ ] Visualizar a proposta no CMS/desktop/mobile e obter autorização específica para vincular `Formação/A`; sem gravação nesta rodada.
- [ ] Comparar, em cada uma das seis empresas, os valores individuais dos campos globais escolhidos, projetos e referências de mídia; fotografias/logos/galerias preservados até aprovação pontual.

## Bloco 1 reorganizado — P1/P2/P3 executado parcialmente em 02/11/2026

- [x] Inventário por campo dos 26 blocos manuais e matriz de cobertura dos formulários das nove coleções; [P1](BLOCO_1_P1_INVENTARIO_2026-11-02.md).
- [x] Comparação dos campos comuns nas seis experiências e quatro projetos estruturados; [relatório](BLOCO_1_P1_EXPERIENCIAS_2026-11-02.md).
- [x] Classificação por metadados dos 53 objetos privados sem cadastro; nenhum arquivo excluído; [triagem](BLOCO_1_P1_STORAGE_2026-11-02.md).
- [x] Prévia DOM isolada de Formação/A em 3 viewports, 6 imagens e 0 escritas, com [workflow 3/3 PASS](https://github.com/tuliustsangaropulos/PortfolioTulius/actions/runs/41402653744); isso **não** é homologação humana nem publicação.
- [x] Fixtures de staging totalmente sintéticas e teste de guardas de nomes/status/identificadores, sem provisionar ambiente ou executar CRUD.
- [x] Baseline de rede nos 3 viewports: 10 GETs e 9 endpoints distintos, incluindo 2 consultas de `sections` destinadas a Perfil e grafo completo.
- [ ] Finalizar comparação individual dos valores de todos os 26 blocos, implantação real de staging, otimizações com ganhos medidos e aceite de prévia visual por proprietário. A meta LCP ≤2,5 s permanece pendente.

[Checklist atualizado do Bloco 1](CHECKLIST_BLOCO_1_P1_P2_P3_2026-11-02.md) · [evidências P2/P3](BLOCO_1_P2_P3_EVIDENCIAS_2026-11-02.md).

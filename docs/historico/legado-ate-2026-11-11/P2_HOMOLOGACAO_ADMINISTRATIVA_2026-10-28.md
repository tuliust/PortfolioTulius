# PortfolioTulius — P2: homologação administrativa e Storage

**Execução:** 28/10/2026 · **Branch:** `main` · **Base antes desta documentação:** [`3bb35a912565046e61605c9e7ce90c214c8640ea`](https://github.com/tuliustsangaropulos/PortfolioTulius/commit/3bb35a912565046e61605c9e7ce90c214c8640ea) · **Supabase:** `zfnrhzplwpjpdljraypt`.  
**Estado vigente da P2 (28/10/2026): PARCIAL.** **P5 Admin Read-Only E2E concluído com sucesso** no [run #40745631770](https://github.com/tuliustsangaropulos/PortfolioTulius/actions/runs/40745631770), commit `af95b5daac2032b10ff1b5962918618a417dd862`: login Auth real, 8 módulos, prévia com 14 seções (incluindo `competencias`), logout e bloqueio de reacesso. Log final `passed=4`, `expected=4`, `contentMutations=0` (nenhuma requisição de escrita de CMS/Storage **detectada pela suíte**). **P2 integral ainda não homologada:** faltam CRUD/publicação/restauração de conteúdo pela UI e upload/download/substituição binária real de Storage com fixture isolada.

> **Decisão posterior de 28/10/2026 — P2 transacional SUSPENSO.** O proprietário optou por **não aprovar custos adicionais agora**. A cotação de branch Supabase foi **US$ 0,01344/h**, com possível consumo adicional, **sem aceite**. Não houve criação de ambiente isolado nem teste transacional real. Não confirmar cobrança, criar branch/projeto, configurar teste pago ou executar gravações em produção. Permanecem pendentes CRUD/publicação/restauração, JWT de usuário não administrador real e upload/download binário; somente o **P5 autenticado read-only 4/4** está homologado. Ver [decisão e pré-condições](P2_TRANSACIONAL_STAGING_2026-10-28.md). Reabrir apenas mediante solicitação expressa posterior.

## Fechamento P5 autenticado de leitura — 28/10/2026

**Resultado: PASS**, confirmado nos logs do GitHub Actions [P5 Admin Read-Only E2E #40745631770](https://github.com/tuliustsangaropulos/PortfolioTulius/actions/runs/40745631770), em `main` no commit [`af95b5daac2032b10ff1b5962918618a417dd862`](https://github.com/tuliustsangaropulos/PortfolioTulius/commit/af95b5daac2032b10ff1b5962918618a417dd862). Workflow `workflow_dispatch`, tentativa 1, execução `completed/success`; job `admin-readonly` e passo `Run authenticated read-only browser checks` aprovados.

| Gate | Saída registrada | Situação |
|---|---|---|
| P5-01 Login | `P5_ADMIN_LOGIN {"result":"PASS","authenticated":true}` | **PASS — sessão real Supabase Auth** |
| P5-02 Navegação | `P5_ADMIN_MODULES {"result":"PASS","modules":8}` | **PASS — oito módulos** |
| P5-03 Prévia | `P5_ADMIN_PREVIEW {"result":"PASS","sectionCount":14,"hiddenSectionPresent":true}` | **PASS — 14 seções no editor, incluindo `competencias` oculta do site público** |
| P5-04 Logout | `P5_ADMIN_LOGOUT {"result":"PASS","reaccessBlocked":true}` | **PASS — sessão encerrada e acesso de prévia redirecionado ao login** |
| Resumo de proteção | `P5_READONLY_RESULT {"passed":4,"expected":4,"contentMutations":0}` | **PASS — nenhuma requisição `POST/PUT/PATCH/DELETE` a `/rest/v1/` ou `/storage/v1/object/` detectada durante a suíte** |

**O que isto homologa:** login administrativo com credenciais existentes nos Secrets do GitHub, abertura dos oito módulos, exibição da prévia de rascunhos, encerramento da sessão e bloqueio de prévia sem sessão, exatamente no escopo do script. Não valida edição ou publicação de conteúdo, não testa um JWT não administrador emitido pelo Auth, e não comprova operações binárias ou restauração editorial de revisão. A verificação `contentMutations=0` usa observação de requisições pelo navegador, não é uma auditoria de todas as alterações possíveis ao banco.

**Evolução dos ensaios:** a tentativa inicial #40743655591 (sem Secrets) não executou login; a reexecução passou em login/módulos e falhou na prévia por sincronismo; #40745002663 passou também na prévia e falhou no clique de logout em viewport pequena. A suíte foi estabilizada em `af95b5d` com viewport 1440×900, espera por 14 seções e clique físico de logout. **As falhas anteriores são históricas e não devem prevalecer sobre o run final aprovado.**

**Pendências P2 após P5:** (1) fixture editorial isolada para CRUD, publicação/retorno e restauração via UI; (2) fixture binária no Storage para upload, download, bloqueios e compensação/limpeza; (3) testes negativos HTTP/JWT com usuário comum real quando houver ambiente e conta de ensaio autorizados. Não inserir segredos em relatórios e não alterar dados publicados sem plano reversível.

## Histórico: tentativa P5 anterior — 28/10/2026

A execução [#40743655591](https://github.com/tuliustsangaropulos/PortfolioTulius/actions/runs/40743655591), vinculada ao SHA `d28c5b2400c1332cb2e3faf706f613a43e0fb7de`, foi disparada manualmente e reexecutada (**attempt 2**) depois da criação dos Secrets do repositório. O resultado continua `failure`, mas a causa foi isolada nos logs:

| Marco | Log da segunda tentativa | Julgamento |
|---|---|---|
| Primeiro disparo, sem Secrets | `P5_ADMIN_NOT_RUN`, exit code 2 | Configuração ausente; não é resultado negativo de login. |
| Autenticação real | `P5_ADMIN_LOGIN {"result":"PASS","authenticated":true}` | **PASS**: login com credenciais em Secrets no fluxo de navegador. |
| Oito módulos | `P5_ADMIN_MODULES {"result":"PASS","modules":8}` | **PASS**: navegação pelos módulos do CMS. |
| Prévia com 14 seções | `Error: Prévia administrativa incompleta`, exit code 1 | **NÃO HOMOLOGADA**. O script aguardava apenas a faixa `.preview-banner`, exibida mesmo durante `loading`, e verificava imediatamente o DOM. Evidência insuficiente para concluir perda real de seções. |
| Logout e reentrada bloqueada | Não houve linha `P5_ADMIN_LOGOUT` | **NÃO EXECUTADO** por falha anterior. |
| Auditoria de mutações | Suíte interrompida antes da verificação final | **NÃO HOMOLOGADA**; o teste não reportou escrita, mas não completou o gate final. |

**Correção aplicada à suíte nesta atualização:** aguardar a conclusão da leitura do conteúdo até `section.portfolio-section` = **14**, incluindo `#competencias` (seção cadastrada e oculta no site público); reconhecer `.data-error` como falha real; e emitir apenas diagnósticos estruturais (`sectionCount`, `loading`, `failed`, `hiddenSectionPresent`) em eventual falha. Não imprimir credenciais, UID, conteúdo editorial ou tokens. O teste continua read-only, com os mesmos quatro gates e mesma proteção de mutações. **Correção do script não equivale a execução aprovada.**

**Próxima execução:** criar **novo** `Run workflow` na branch `main` depois que o commit desta correção estiver publicado e a Vercel corresponder ao novo SHA. **Não usar `Re-run jobs` da execução #40743655591**, que permanece associada ao script antigo no SHA `d28c5b2`. Após o run, conferir `P5_ADMIN_PREVIEW`, `P5_ADMIN_LOGOUT`, `P5_READONLY_RESULT passed=4/4` e `contentMutations=0`. Mesmo aprovado, isso não substitui testes de escrita, publicação e Storage binário em fixture.

As demais seções abaixo registram a **primeira conferência P2 anterior ao disparo manual**, válida como histórico do estágio naquela hora.

## Histórico: terceira execução P5 nº 40745002663, 28/10/2026

A execução [#40745002663](https://github.com/tuliustsangaropulos/PortfolioTulius/actions/runs/40745002663) usou **`c4f0358c66ba1cc14d57f15643884e3d74350ea3`** (script corrigido da prévia), mas terminou `failure` no gate de logout.

| Gate executado | Log do run | Resultado |
|---|---|---|
| Login real | `P5_ADMIN_LOGIN {"result":"PASS","authenticated":true}` | **PASS** |
| Oito módulos do CMS | `P5_ADMIN_MODULES {"result":"PASS","modules":8}` | **PASS** |
| Prévia do CMS | `P5_ADMIN_PREVIEW {"result":"PASS","sectionCount":14,"hiddenSectionPresent":true}` | **PASS**; confirma `competencias` em prévia autenticada, apesar de oculta na publicação |
| Logout | Puppeteer `Node is either not clickable or not an Element` na linha 102, em `page.click(".logout-button")` | **FAIL do driver**, não comprova falha funcional do Auth |
| Proteção pós-logout | Não alcançada | **PENDENTE** |

**Diagnóstico:** a suíte Puppeteer usa por padrão viewport **800×600**. O layout administrativo tem `.admin-sidebar` com `height: 100vh`, 10 controles de menu e botão `.logout-button` após eles (CSS `margin-top:auto`). Nessa viewport baixa, o botão pode ficar fora da área clicável; o seletor existe e é encontrado, mas `page.click` falha. Não atribuir a erro de sessão ou do Supabase sem teste.

**Correção de ensaio:** fixar viewport desktop em **1440×900** logo após criar a página, esperar botão de logout visível, asserir sua posição dentro do retângulo da janela e usar **clique físico do Puppeteer**, não `HTMLElement.click()` nem chamada direta a `signOut`. Nenhum componente do produto, stylesheet, política ou dado foi alterado. A suíte continua exigindo `P5_READONLY_RESULT passed=4, expected=4, contentMutations=0`.

**Ação futura necessária:** depois de validar o novo commit pela CI e Vercel, disparar **um novo `Run workflow` na `main`**, e não `Re-run jobs` do run anterior. Sem nova execução, logout e bloqueio pós-logout permanecem **não homologados**. CRUD do CMS, restauração editorial e upload/download binário real do Storage continuam **fora do escopo da suíte read-only**.

## 1. Escopo efetivamente executado

1. Leitura do workflow GitHub [`P5 Admin Read-Only E2E`](../.github/workflows/p5-admin-readonly.yml), da suíte [`scripts/p5-admin-readonly.mjs`](../scripts/p5-admin-readonly.mjs), da interface [`AdminApp.tsx`](../src/components/admin/AdminApp.tsx) e do cliente de Auth [`src/lib/supabase.ts`](../src/lib/supabase.ts). Os seletores de login, rótulos dos oito módulos, prévia e logout foram conferidos contra a implementação versionada; **não houve teste de browser autenticado**.
2. Leitura das policies reais do PostgreSQL (`public`, `storage.objects`), privilégios e definições das RPCs `SECURITY DEFINER`. Todas as **22/22 tabelas públicas** estão com RLS ativo. As **6 RPCs públicas administrativas** expostas a `authenticated` chamam `private.require_portfolio_admin()` no corpo, com erro `portfolio_admin_required` (`42501`) para identidade não administradora.
3. **Três transações SQL independentes e não destrutivas** com `BEGIN READ ONLY` e `ROLLBACK`, simulando papéis de acesso pelo banco. O usuário administrador foi obtido internamente de `admin_users` **sem imprimir qualquer UID ou credencial**; o usuário comum recebeu um UUID artificial sem cadastro administrativo. Não houve uso de JWT real ou senha.
4. Captura agregada de contagens antes/depois dos testes para detectar mudanças acidentais. As contagens permaneceram iguais. Nenhuma API de mutação, operação de Storage de bytes ou escrita de dados editoriais foi realizada.

## 2. Resultado dos gates executados

| Caso | Mecanismo | Resultado | Asserções principais |
|---|---|---|---|
| P2-SQL-01 — visitante `anon` | Transação `READ ONLY`, `SET LOCAL ROLE anon`, `DO` com asserções e `ROLLBACK` | **PASS** | 13 seções visíveis, 21 mídias públicas; 0 `storage.objects` privados, 0 `admin_users`, 0 `editorial_issues`, 0 `audit_logs`, 0 `content_revisions` acessíveis. |
| P2-SQL-02 — `authenticated` comum | Mesmo isolamento, `request.jwt.claim.sub` **simulado** com UUID não administrador | **PASS** | Mesmo isolamento de leitura; `private.require_portfolio_admin()` negou acesso com `SQLSTATE 42501`, mensagem `portfolio_admin_required`. |
| P2-SQL-03 — `authenticated` admin | Mesmo isolamento, UID existente usado apenas como claim **simulada em sessão SQL** | **PASS** | 14 seções, 2 objetos privados, 1 associação em `admin_users`, 9 questões editoriais, 12 revisões e 12 auditorias acessíveis; guarda administrativa liberada. |
| P2-DB-04 — integridade antes/depois | Consultas agregadas `SELECT`, sem role switching | **PASS** | 14 seções (13 públicas), 42 painéis, 28 blocos, 56 placements, 21 mídias com 0 referência física ausente, 23 objetos Storage (21 públicos/2 privados), 8 pendências abertas, 12 revisões, 12 auditorias, 1 usuário Auth e 1 admin. |
| P2-WF-05 — capacidade de CI | Inspeção estática do YAML e suíte de navegador, conferência da listagem GitHub Actions | **PREPARADO, NÃO EXECUTADO** | Workflow manual usa `P5_ADMIN_EMAIL` e `P5_ADMIN_PASSWORD` via `secrets.*`; 0 execuções de evento `workflow_dispatch` retornadas pelo GitHub em 28/10. |
| P2-E2E-06 — login/8 módulos/prévia/logout com JWT real | `P5 Admin Read-Only E2E` via Actions | **PENDENTE** | Necessita secrets previamente configurados e execução manual. A conexão atual permite consultar runs, **não** configurar/ler secrets nem disparar `workflow_dispatch`. |
| P2-E2E-07 — CMS CRUD/publicação/revisão | Sessão Auth real, fixture isolada, restore/check | **PENDENTE** | Não usar conteúdo real; backup, escopo de fixture e limpeza devem ser definidos antes de qualquer escrita. |
| P2-E2E-08 — Storage binário | Upload, leitura privada/signed URL, promoção pública, substituição, conferência de bytes e cleanup | **PENDENTE** | Consultas a metadados de `storage.objects` **não** comprovam download/upload de bytes nem autorização JWT pelo endpoint Storage. |

**Limite metodológico:** `SET LOCAL ROLE` + `request.jwt.claim.sub` não é token assinado pelo Supabase Auth. Os resultados SQL confirmam o comportamento de RLS/guarda nessas sessões simuladas, não o fluxo HTTPS, sessão persistente, renovação de token, navegador, CORS, permissões de Storage API ou UI. `ROLLBACK` de uma transação SQL não comprova restauração de uma revisão editorial pela interface.

## 3. Revisão das proteções efetivas

- **Tabelas:** RLS ativo nas 22 tabelas públicas. Consultas SQL simuladas não visualizaram dados administrativos, histórico, issues ou Storage privado como anon e não admin.
- **Storage:** `storage.objects` tem política de `SELECT` para `portfolio-public` (`anon`/`authenticated`) e política `ALL` para `portfolio-public`/`portfolio-private` condicionada a `private.is_portfolio_admin(auth.uid())` para `authenticated`. Testar o endpoint binário com JWT real continua necessário.
- **Guardas:** `private.require_portfolio_admin()` consulta `private.is_portfolio_admin(auth.uid())` e lança `portfolio_admin_required` em falha. As RPCs públicas administrativas `create_section_with_panels`, `duplicate_section`, `publish_section`, `save_content_block_atomic`, `save_home_seo_atomic` e `swap_section_order` contêm chamada à guarda. Esta é **inspeção do código SQL** e **teste direto da guarda**, não execução de todas as RPCs por API.
- **Auth frontend:** `isAdmin()` exige sessão `supabase.auth.getUser()` e correspondência em `admin_users`; o formulário usa `signInWithPassword`. O teste de integração com credenciais não ocorreu.
- **Decisões preservadas:** não revogar o token Supabase histórico e não habilitar Leaked Password Protection, conforme decisão expressa registrada em [`docs/SECURITY_RLS.md`](SECURITY_RLS.md). São riscos aceitos e **não corrigidos**, não medidas tecnicamente aprovadas.

## 4. Procedimento histórico para preparar P5 — já executado com sucesso em 28/10/2026

> **Não repetir por rotina:** o P5 foi aprovado na execução [#40745631770](https://github.com/tuliustsangaropulos/PortfolioTulius/actions/runs/40745631770). Os passos seguintes permanecem apenas para reexecução autorizada, por exemplo após uma mudança relevante do login; não são pendências P2. O que falta é CMS/Storage transacional, conforme [pendências vigentes](OPEN_ISSUES.md).

1. Na conta proprietária do GitHub, acessar **Settings → Secrets and variables → Actions** do repositório e configurar os dois nomes exatos `P5_ADMIN_EMAIL` e `P5_ADMIN_PASSWORD` com uma conta administrativa já autorizada no Supabase. **Nunca** colar os valores em issues, commits, logs, chat ou documentação. Não criar novo administrador para teste sem autorização.
2. Abrir [Actions → P5 Admin Read-Only E2E](https://github.com/tuliustsangaropulos/PortfolioTulius/actions/workflows/p5-admin-readonly.yml), selecionar **Run workflow**, branch `main`. Se os secrets estiverem ausentes, o script sinaliza explicitamente `P5_ADMIN_NOT_RUN`; não interpretar essa falha como teste de autenticação.
3. Conferir **quatro gates** no log do run: `P5_ADMIN_LOGIN`, `P5_ADMIN_MODULES`, `P5_ADMIN_PREVIEW`, `P5_ADMIN_LOGOUT` e o resumo `P5_READONLY_RESULT` com `passed=4`, `expected=4`, `contentMutations=0`. Se houver falha, preservar URL e logs sem compartilhar dados pessoais/sessões.
4. Ao obter o run, registrar **URL, ID, SHA da execução, data, conclusão e gates** neste índice. `success` do workflow é evidência de seu escopo **somente leitura**, não de CRUD, Storage real ou rollback.

**Motivo de não ter sido executado nesta rodada:** a integração GitHub disponível fornece leitura de workflows/runs e reexecução de jobs existentes, mas não oferece operação de `workflow_dispatch` inicial ou gestão de Secrets. A conexão Supabase fornece SQL administrativo, não a senha do usuário Auth. Buscar senhas, tokens ou simular login por acesso SQL privilegiado não é método válido nem seguro para validar JWT real.

## 5. Matriz segura para ensaios de escrita e Storage (não executada)

**Gate de pré-execução:** ambiente de staging ou fixture inequivocamente isolada, destino e nomenclatura explícitos (ex.: `p2-fixture-<UUID>`), responsável/escopo e janela autorizados, snapshot lógico antes de gravar, procedimento de restauração testado, possibilidade de remover **metadado e objetos em ambos os buckets** e evidência das contagens anteriores. Em produção, **não criar conteúdo público efêmero** sem aceite específico; RLS e triggers podem gerar revisões/auditorias irreversíveis mesmo após arquivar um item.

| Sequência proposta | Critério de PASS futuro |
|---|---|
| Login real e isolamento | JWT Auth admin válido abre oito módulos/prévia; JWT não admin e anon não acessam admin/Storage privado, sem tokens nos logs. |
| CMS em fixture | Criar rascunho isolado, editar bloco, validar ordem e preview, publicar somente com autorização, testar retorno do site e reverter estado sem atingir seções reais. |
| Storage em fixture | Upload privado de arquivo de bytes conhecidos, download admin, bloqueio anônimo; promover, verificar integridade da cópia, testar substituição e apagar **somente** os objetos da fixture; no código atual `promote()` deixa a origem privada após publicação. |
| Revisão/restauração | Confirmar gravação dos triggers e reconstituição de conteúdo na UI; **listagem de `content_revisions` não demonstra rollback funcional**. |
| Encerramento | Confirmar ausência de objetos/linhas de fixture órfãs, IDs removidos ou arquivados conforme o procedimento, contagens finais e ausência de alteração das 21 mídias e dos 23 objetos anteriores. |

Até esses testes, a classificação correta é **“P2 parcialmente verificada, aceite integral pendente”**. O P3 visual/performance pode ser planejado separadamente, mas não deve atribuir à P2 uma homologação que não ocorreu.

## 6. Evidências de referência

- Workflow: [`p5-admin-readonly.yml`](../.github/workflows/p5-admin-readonly.yml) e [suíte `p5-admin-readonly.mjs`](../scripts/p5-admin-readonly.mjs).
- Código: [`AdminApp.tsx`](../src/components/admin/AdminApp.tsx), [`supabase.ts`](../src/lib/supabase.ts) e [`AdminModules.tsx`](../src/components/admin/AdminModules.tsx).
- Histórico do teste anterior: [`P4_P5_EXECUCAO.md`](P4_P5_EXECUCAO.md) e [`SECURITY_RLS.md`](SECURITY_RLS.md).
- [P1 — proveniência/duplicação de Storage](P1_INVESTIGACAO_HIGIENE_2026-10-28.md).
- Fonte de verdade: consultas ao [projeto Supabase](https://supabase.com/dashboard/project/zfnrhzplwpjpdljraypt) e metadados GitHub Actions em 28/10/2026. Nenhuma credencial foi consultada ou divulgada.

## Nota de encerramento de escopo antes do P3 — 28/10/2026

O P5 autenticado de **leitura** permanece integralmente homologado (4/4, [#40745631770](https://github.com/tuliustsangaropulos/PortfolioTulius/actions/runs/40745631770)). Não foram produzidas provas de **escrita/publicação/restauração pela interface** ou **transferência binária do Storage com JWT real e cleanup de fixture**. Esses pontos não foram declarados aprovados e continuam como **pendências residuais P2**, exigindo ambiente/fixture isolados, plano de reversão e execução autorizada. **O P3 público pode prosseguir independentemente, mas seu sucesso não encerra os testes transacionais P2.** A auditoria P3 está registrada em [`P3_QUALIDADE_ACEITE_2026-10-28.md`](P3_QUALIDADE_ACEITE_2026-10-28.md).

## Preparação adicional — suíte P2 isolada

Consulte [`P2_TRANSACIONAL_STAGING_2026-10-28.md`](P2_TRANSACIONAL_STAGING_2026-10-28.md). A suíte está no GitHub mas **não foi executada**, pois não existe staging e a criação de branch Supabase exige aprovação do custo. O workflow manual exige ref isolado, URL correspondente, contas Auth de homologação e seis Secrets próprios. Nenhum CRUD nem byte de produção foi alterado nesta preparação.

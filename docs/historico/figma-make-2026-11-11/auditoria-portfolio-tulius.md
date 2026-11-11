# Auditoria do portfólio de Tulius e plano de conclusão

> **CLASSIFICAÇÃO EM 05/11/2026:** plano e diagnóstico **históricos de 23/10/2026** (ex.: `07ba853`, seis testes, estrutura original). **Não usar o bloco “O que impede considerar o projeto completo” como backlog vigente**, nem interpretar os critérios da época como instrução para mudar a interface atualmente aprovada. Ver [Estado vigente](../docs/ESTADO_ATUAL_VIGENTE.md), [Verificações técnicas](../docs/OPEN_ISSUES.md), [CMS](../docs/ADMIN_CMS.md) e [Índice](../docs/README.md). Esta anotação não modifica a análise original.

## 1. Objetivo desta auditoria

Verificar o repositório atual contra o prompt original, `guidelines.md`, os PDFs desktop/mobile e os critérios de aceite, distinguindo:

- **Concluído e verificado:** existe implementação e há evidência executada.
- **Implementado parcialmente:** existe código, mas falta escopo, integração ou teste necessário.
- **Gerado, não aplicado:** arquivos existem, porém dependem de ação externa.
- **Pendente:** requisito ausente ou sem evidência suficiente.

Esta auditoria não considera uma interface “funcional” apenas porque seus controles aparecem na tela; persistência, autorização e retorno real do banco são parte do aceite.

---

## 2. Evidências verificadas agora

> **Última atualização:** 2026-10-23 — sessão de aplicação do banco e configuração do preview.

### Repositório e engenharia

- O repositório está limpo, sem mudanças locais pendentes (commit `07ba853`).
- `pnpm check` (formato + TypeScript + 6 testes + build): **aprovado integralmente**.
- O build de produção gera bundle principal de **729 KB gzip: 212 KB**; aviso de tamanho não bloqueante.
- `figma make verify-bootstrap`: **aprovado** — dev server responde com 2xx na porta correta.
- `figma make verify-deploy-preview`: **aprovado** — cached preview reconstruído e implantado com variáveis de ambiente injetadas.
- Não há suíte automatizada de componentes, integração ou E2E configurada.

### Estrutura encontrada

- 14 registros de seção no fallback editorial + seed aplicado.
- 14 slugs/âncoras estáveis.
- Um renderer gera dois painéis mobile A/B para cada seção, totalizando estruturalmente 28 painéis.
- Rotas existentes: `/`, `/admin/login`, `/admin/*`, `/admin/preview`, fallback 404.
- `vercel.json` com rewrite SPA e cache de assets existe no repositório.
- 22 tabelas declaradas na migration.
- Documentos pedidos existem em `README.md`, `guidelines.md` e `docs/`.

### O que foi executado no ambiente remoto (Supabase `zfnrhzplwpjpdljraypt`)

- **Migration aplicada** pelo operador via Supabase Dashboard SQL Editor: `supabase/migrations/202610220001_portfolio_cms.sql`.
- **Seed aplicado** pelo operador: `supabase/seed.sql` — páginas, seções, tokens, navegação e blocos de conteúdo populados.
- **Primeiro administrador cadastrado** em `admin_users` pelo operador.
- **Variáveis de ambiente configuradas** no Figma Make e em `.env` local:
  - `VITE_SUPABASE_URL=https://zfnrhzplwpjpdljraypt.supabase.co`
  - `VITE_SUPABASE_PUBLISHABLE_KEY=sb_publishable_fzkESraR-hBvp5anM6kb4g_6QDKRCcZ`
- Dev server reiniciou automaticamente após criação do `.env` (`[vite] .env changed, restarting server`).

### Limite da evidência atual

- **RLS não foi testado ponta a ponta** (`supabase/tests/rls.sql` ainda não foi executado no projeto remoto).
- Login, CRUD do admin, Storage e publicação não foram testados ponta a ponta.
- Não houve teste visual automatizado ou manual registrado nos viewports de aceite.
- A migration inclui políticas públicas sem `drop policy if exists`; reaplicação pode falhar.

---

## 3. Matriz de conformidade

## 3.1 Site público e conteúdo

| Requisito | Estado | Evidência / lacuna |
|---|---|---|
| 14 seções lógicas na ordem pedida | **Concluído estruturalmente** | `src/content/fallback.ts` possui 14 seções e slugs corretos. |
| 28 painéis mobile | **Concluído estruturalmente** | `PublicSite.tsx` renderiza A e B para cada seção. Não há teste visual dos 28 painéis. |
| Perfil mobile 01A/01B conforme PDF | **Implementado, não homologado visualmente** | Nome monumental, faixa, retrato, +15 anos, selo, destaques, cinco áreas e seis organizações estão presentes. Falta comparação visual nos viewports exigidos. |
| Composições desktop editoriais | **Parcial** | Há layouts por tema/tipo, porém as seções 02–14 usam um renderer genérico; fidelidade tela a tela ao PDF não foi registrada por teste visual. |
| Conteúdo dos PDFs | **Majoritariamente implementado** | Textos, métricas, experiências, ferramentas e depoimentos estão no fallback/seed. Algumas descrições foram resumidas no seed. |
| Placeholders X/Y/Z/XXXXX preservados | **Concluído** | Permanecem marcados como rascunho editorial. |
| Fotografias reais, sem páginas rasterizadas | **Concluído** | Imagens individuais estão em `public/media`; PDFs não são usados como páginas inteiras. |
| Menu fixo com 14 destinos | **Implementado** | Drawer, links e indicador existem. |
| Hash e histórico | **Parcial** | Clique no menu usa `pushState` e scroll. Falta tratamento explícito de `popstate/hashchange`, foco no destino e teste do botão Voltar. |
| Destaque automático da seção | **Implementado** | Usa `IntersectionObserver`. |
| Acessibilidade do drawer | **Parcial** | Escape existe, mas não há focus trap, foco inicial no drawer nem retorno de foco ao fechar por Escape/clique no backdrop. `aria-hidden` sozinho não impede foco em descendentes. |
| H1 único e hierarquia semântica | **Pendente** | O site público não possui `<h1>`; o nome principal é renderizado com `span`. |
| Alt text | **Parcial** | Alguns ativos têm alt; depoimentos e itens do seed podem resultar em `alt=""` apesar de serem informativos. |
| Reduced motion | **Concluído em CSS/comportamento base** | Media query e scroll sem animação estão implementados. |
| Motion configurável por preset do CMS | **Pendente** | Há animação fixa e colunas no schema, mas não editor, leitura ou aplicação dinâmica de parâmetros. |
| Conteúdo sem corte | **Não comprovado** | CSS usa `min-height` e permite crescimento, o que é adequado, mas faltam testes 320px, baixa altura e zoom 200%. |
| SEO editável | **Pendente** | Metadados estáticos estão em `.figma/make/site.json`; não há editor SEO nem consumo de `pages/site_settings`. |
| Open Graph/favicons finais | **Parcial** | Título/descrição existem; não há imagem OG final nem favicon editorial validado. |

## 3.2 Fonte de dados e frontend Supabase

| Requisito | Estado | Evidência / lacuna |
|---|---|---|
| Cliente Supabase com URL/chave pública | **Concluído** | `src/lib/supabase.ts` lê `VITE_*`; variáveis configuradas no Figma Make e em `.env`; dev server reiniciado com vars ativas. |
| Supabase como fonte de verdade | **Parcial** | `usePortfolio` consulta Supabase primeiro com dados reais do seed; cai silenciosamente no fallback se a consulta falhar ou vier vazia. |
| Conteúdo principal não fixado em componentes | **Parcial** | Conteúdo está separado em `fallback.ts`; seed popula o banco, mas fallback ainda pode mascarar falhas. |
| Leitura publicada | **Ativa com dados reais** | Consulta `sections + content_blocks`, `design_tokens`, `navigation_items`, `pages` e `site_settings` com seed aplicado. |
| Uso de navegação e coleções normalizadas | **Pendente** | Frontend não consulta `navigation_items`, experiências, projetos, métricas, educação, ferramentas, depoimentos, contatos ou mídia cadastrada. |
| Painéis/placements editáveis | **Pendente** | Frontend não consulta `section_panels` nem `block_placements`; usa `mobile_panel` diretamente no bloco. |
| Estado de erro honesto | **Parcial** | Existe fallback e aviso apenas para leitor de tela; visitante não vê diagnóstico quando o banco falha. |

## 3.3 Admin/CMS

| Requisito | Estado | Evidência / lacuna |
|---|---|---|
| Login Supabase Auth | **Implementado em código, não testado** | `signInWithPassword` e logout existem. |
| Autorização por `admin_users` | **Implementada em código/schema, não testada** | Não depende apenas de `authenticated`. |
| Dashboard dinâmico | **Parcial** | Contagem publicada vem das seções; “9 pendências” e parte do checklist são fixos, sem consulta a `editorial_issues`/logs. |
| CRUD de seções | **Parcial e com defeitos** | Edita metadados, arquiva e tenta duplicar/ordenar. Não cria seção do zero e não exclui com cascade controlada. |
| Reorder acessível | **Provavelmente quebrado** | O schema tem `unique(page_id, sort_order)`. O código troca duas ordens em updates sequenciais; o primeiro tende a colidir antes do segundo. Deve ser transacional/RPC. |
| Duplicação de seção | **Incompleta** | Duplica apenas a linha de `sections`; não copia painéis, blocos, placements nem relações. Pode colidir em `sort_order`. |
| Editor de blocos/variantes | **Pendente** | Não existe `BlockEditor` nem CRUD de `content_blocks`. |
| Divisão mobile A/B | **Pendente** | Não há UI para mover/ordenar blocos entre A/B. |
| Conteúdo estruturado | **Pendente** | Não há editores de experiências, projetos, métricas, formação, idiomas, skills, ferramentas, depoimentos ou contatos. |
| Navegação editável | **Pendente** | `NavigationEditor` é somente leitura e deriva de `sections`; não usa `navigation_items`. |
| Tokens de marca | **Parcial** | Somente seis cores. Fontes, escalas, espaçamentos, raios, fundos e presets não são editáveis. |
| Editor de animações | **Pendente** | Schema existe; UI e consumo não. |
| Biblioteca de mídia | **Parcial** | Upload privado e listagem existem. |
| Alt, crédito, substituição e publicação de mídia | **Pendente** | Não há formulários/ações correspondentes nem promoção ao bucket público. |
| SEO por página | **Pendente** | Sem UI e sem persistência a partir do admin. |
| Draft/publicação | **Parcial** | Status de seção pode ser alterado, mas não há transação de publicação consistente para blocos/tokens/mídia nem validação de campos obrigatórios/placeholders. |
| Preview protegido | **Implementado em código, não testado** | Guard administrativo e query incluindo drafts existem. |
| Revisões e auditoria | **Somente schema** | Não há triggers de snapshot/audit, consultas, UI de histórico ou rollback. |
| Pendências editoriais no painel | **Pendente** | Dashboard mostra número fixo; não lista, resolve ou persiste revisão de `editorial_issues`. |
| Validação tipada/allowlist | **Parcial** | Selects limitam alguns layouts/temas; JSON de blocos não possui editor/validador runtime. |

## 3.4 Banco, RLS e Storage

| Requisito | Estado | Evidência / lacuna |
|---|---|---|
| Schema relacional | **Aplicado** | Migration `202610220001_portfolio_cms.sql` executada no projeto `zfnrhzplwpjpdljraypt` pelo operador. |
| RLS em todas as tabelas | **Aplicado** | Políticas criadas junto com a migration; não testadas automaticamente ainda. |
| Leitura anônima somente publicada | **Aplicada, não testada** | Políticas existem e foram criadas; `supabase/tests/rls.sql` ainda não foi executado. |
| Não permitir autopromoção | **Aplicado, não testado** | `admin_users` restrição ativa; não verificado via teste automatizado. |
| Storage público/privado | **Aplicado** | Buckets e políticas criados com a migration. |
| Seed representativo | **Aplicado** | `seed.sql` executado: páginas, seções, tokens, navegação, blocos, experiências e pendências populados. |
| Seed de `section_panels`/`block_placements` | **Pendente** | Tabelas ficam vazias. |
| Seed das coleções normalizadas | **Majoritariamente pendente** | Apenas `career_experiences` recebe dados; projetos, métricas, skills, formação, idiomas, ferramentas, depoimentos, contatos, mídia, revisões e logs não são populados. |
| Testes RLS automatizados | **Pendente** | `supabase/tests/rls.sql` existe e faz rollback automático; ainda não foi executado no projeto remoto pelo operador. |
| Migration idempotente | **Parcial** | Vários objetos usam `if not exists`, mas políticas públicas são criadas sem `drop policy if exists`; reaplicação pode falhar. |
| Histórico/audit automático | **Pendente** | Tabelas existem, mas não há triggers ou RPCs que gravem mudanças. |

## 3.5 Documentação e deploy

| Requisito | Estado | Evidência / lacuna |
|---|---|---|
| README e documentos pedidos | **Concluído** | Todos os arquivos principais existem. |
| Procedimento do primeiro admin | **Concluído** | SQL documentado e executado pelo operador; primeiro `admin_users` cadastrado. |
| Estado honesto da integração | **Atualizado** | README deve ser atualizado para refletir que migration/seed já foram aplicados. |
| Lista de pendências editoriais | **Concluído** | Nove itens em `docs/OPEN_ISSUES.md` e no seed. |
| Configuração Vercel | **Arquivo existe, deploy pendente** | `vercel.json` com rewrite SPA e cache de assets está no repositório; deploy real em produção não foi executado. |
| Variáveis de ambiente | **Configuradas no Make e em .env** | `VITE_SUPABASE_URL` e `VITE_SUPABASE_PUBLISHABLE_KEY` ativas; cached preview e dev server reiniciados. |
| Integração GitHub | **Somente documentada** | Não há evidência de push/PR/deploy; isso não deve ser declarado concluído. |

---

## 4. Conclusão executiva

### O que está sólido

1. Base React/TypeScript compilável; `pnpm check` aprovado integralmente.
2. Estrutura pública com 14 seções, 28 painéis e identidade visual reconhecível.
3. Conteúdo editorial inicial substancial e placeholders preservados.
4. Navegação principal, responsividade base e reduced-motion.
5. Schema Supabase aplicado, RLS ativa, buckets criados, seed representativo executado.
6. Primeiro admin cadastrado; autenticação disponível para teste.
7. Variáveis de ambiente configuradas; dev server e cached preview conectados ao banco real.
8. `vercel.json` com rewrite SPA pronto para deploy.
9. Esqueleto de autenticação/admin e algumas operações persistentes.

### O que impede considerar o projeto “completo”

1. RLS não testada automaticamente (`rls.sql` pendente de execução).
2. CMS cobre apenas uma fração dos campos e entidades obrigatórios.
3. Reorder e duplicação de seções não são confiáveis com o schema atual (sem RPC transacional).
4. Conteúdo normalizado, placements A/B, mídia publicada, SEO, motion, revisões e auditoria não estão conectados.
5. Acessibilidade do drawer e hierarquia H1 estão incompletas.
6. Não existem testes visuais, E2E ou CRUD executados.
7. Deploy Vercel em produção não foi executado.

Portanto, o estado correto é: **site público conectado ao banco real com seed e preview funcional; CMS parcialmente implementado; RLS aplicada mas não validada automaticamente; critérios completos de aceite ainda pendentes**.

---

## 5. Plano de conclusão recomendado

## Fase 0 — Confirmar e proteger o ambiente Supabase ✅ CONCLUÍDA

1. ✅ Projeto alvo confirmado: `zfnrhzplwpjpdljraypt`.
2. ✅ Migration `202610220001_portfolio_cms.sql` aplicada pelo operador via Supabase Dashboard.
3. ✅ Seed `seed.sql` aplicado: páginas, seções, tokens, navegação, blocos e experiências populados.
4. ✅ Primeiro administrador cadastrado em `admin_users`.
5. ✅ Variáveis de ambiente (`VITE_SUPABASE_URL`, `VITE_SUPABASE_PUBLISHABLE_KEY`) configuradas no Figma Make e `.env`; dev server e cached preview conectados.
6. ⏳ Token pessoal Supabase foi exposto no histórico deste repositório público. **Revogar pelo painel Supabase → Account → Access Tokens**; confirmar rotação de quaisquer integrações dependentes. Remoção nesta versão não elimina o histórico Git.
7. ⏳ Fallback silencioso ainda ativo; em produção, erro de consulta deve gerar estado observável.

**Saída:** banco aplicado, seed ativo, admin cadastrado, preview funcional. Token a revogar.

## Fase 1 — Corrigir e completar o schema antes da aplicação

1. Tornar a migration seguramente reaplicável ou dividir em migrations incrementais.
2. Criar RPC transacional `swap_section_order(section_a, section_b)` para reorder sem violar `unique(page_id, sort_order)`.
3. Criar RPC transacional `duplicate_section(section_id)` que copie:
   - seção;
   - painéis desktop/mobile A/mobile B;
   - blocos;
   - placements;
   - configurações de motion/style;
   - sem copiar status publicado por padrão.
4. Criar fluxo transacional de publicação que valide seção, blocos, mídias e placeholders e grave `published_at`.
5. Criar triggers/RPCs de `content_revisions` e `audit_logs`.
6. Definir constraints JSON/validação de:
   - `style_config`;
   - `motion_config`;
   - `content_json`;
   - URLs e tipos de contato.
7. Seed completo:
   - três painéis por seção (desktop, mobile A, mobile B);
   - placements;
   - mídia inicial/metadados;
   - projetos, métricas, skills, educação, idiomas, ferramentas, depoimentos e contatos;
   - nove pendências editoriais;
   - sem admin inventado.

**Saída:** schema consistente, transações seguras e seed representando o conteúdo real.

## Fase 2 — Criar uma camada de dados tipada

1. Gerar tipos TypeScript do schema Supabase.
2. Separar repositórios/serviços:
   - publicação pública;
   - drafts/admin;
   - mídia;
   - revisão/auditoria.
3. Fazer o site público consumir:
   - `pages/site_settings`;
   - `navigation_items`;
   - `sections/panels/placements/blocks`;
   - coleções normalizadas;
   - URLs públicas de mídia.
4. Remover `any` do adaptador `toSection`.
5. Implementar loading, empty e error states honestos.
6. Invalidar/recarregar dados após publicação sem depender de refresh manual.

**Decisão recomendada:** usar catálogo de blocos allowlisted; nunca executar CSS/JS vindo do banco.

## Fase 3 — Completar o CMS

### Seções e blocos

1. Criar seção do zero, duplicar via RPC, arquivar/restaurar e reorder transacional.
2. Editor de blocos por tipo:
   - hero;
   - rich text;
   - métricas;
   - cards/projetos;
   - timeline;
   - skills/ferramentas;
   - mídia;
   - quote;
   - contato.
3. Controles acessíveis para mover bloco:
   - ordem desktop;
   - mobile A;
   - mobile B;
   - visibilidade por breakpoint.
4. Preview desktop/mobile ao lado do editor.

### Coleções estruturadas

CRUD completo para experiências, projetos, métricas, formação, idiomas, competências, ferramentas, depoimentos e contatos, com ordem, status e pendência editorial.

### Mídia

1. Upload privado.
2. Editar alt, título, crédito, licença e focal point.
3. Substituir arquivo preservando referência.
4. Promover/copy para bucket público somente na publicação.
5. Remover/arquivar com verificação de uso.

### Design, navegação, motion e SEO

1. Tokens de cores, fontes autorizadas, escalas, espaçamento, raios, container e cards.
2. Editor real de `navigation_items`, preservando aliases/slugs publicados.
3. Presets de animação com limites seguros e preview reduced-motion.
4. SEO global/por página: title, description, OG image, robots e canonical quando o domínio existir.
5. Pendências editoriais, revisões, logs e rollback básico.

## Fase 4 — Corrigir o site público e a acessibilidade

1. Transformar o nome principal em H1 único sem perder a composição visual.
2. Garantir H2 por seção e H3 apenas em itens subordinados.
3. Implementar drawer modal acessível:
   - foco inicial;
   - focus trap;
   - `inert`/ocultação do conteúdo de fundo;
   - retorno de foco em todos os fechamentos;
   - Escape e clique externo.
4. Implementar `hashchange/popstate`, foco no destino e scroll compensado.
5. Completar alt text das imagens informativas.
6. Verificar contraste após edição de tokens; impedir combinações inválidas.
7. Validar todos os 14 desktops e 28 mobiles contra PDF/conteúdo.
8. Revisar layouts 02–14 para reduzir o aspecto de renderer genérico e aproximar cada composição do PDF desktop.

## Fase 5 — Testes obrigatórios

### Automatizados

1. Unitários para adaptadores, validações e presets.
2. Integração para repositórios Supabase.
3. E2E com Playwright:
   - menu, Escape, foco e hash/back;
   - 14 âncoras;
   - 28 painéis;
   - login/logout;
   - CRUD de seção/bloco/coleção;
   - reorder;
   - upload/alt/crédito;
   - preview e publicação;
   - edição de tokens.
4. Testes RLS executáveis com anon, usuário comum e admin:
   - leitura publicada;
   - bloqueio de draft;
   - bloqueio de escrita anon/comum;
   - bloqueio de autopromoção;
   - bucket privado bloqueado;
   - admin autorizado.

### Visuais e acessibilidade

1. Screenshots comparativos em:
   - 1920×1080;
   - 1440×900;
   - 1366×768;
   - tablet;
   - 390×844;
   - 360×800;
   - 320px.
2. Zoom 200%, teclado completo e reduced-motion.
3. Axe/Lighthouse e revisão manual de headings/landmarks.
4. Testar textos longos, painel maior que viewport e safe areas.

**Saída:** evidência anexável a cada checkbox de aceite.

## Fase 6 — Performance e deploy

1. Fazer code splitting das rotas administrativas para reduzir o bundle público.
2. Otimizar imagens e publicar tamanhos responsivos.
3. Adicionar configuração Vercel/rewrite SPA.
4. Configurar variáveis públicas na Vercel.
5. Aplicar canonical, robots e OG após definição de domínio.
6. Executar smoke tests no preview e na produção.
7. Registrar versão, migration aplicada, testes e pendências editoriais remanescentes.

---

## 6. Ordem de prioridade

### Bloqueadores

1. ✅ ~~Aplicar migration e seed.~~
2. ✅ ~~Cadastrar primeiro admin.~~
3. ⏳ Executar `supabase/tests/rls.sql` no projeto remoto (requer psql local ou Supabase Dashboard).
4. ⏳ Corrigir schema/reorder/duplicação (RPC transacional).
5. ⏳ Implementar blocos, placements e publicação transacional.

### Alta prioridade

1. Coleções estruturadas.
2. Mídia completa.
3. Navegação/design/motion/SEO editáveis.
4. Acessibilidade do menu e H1.
5. Testes E2E e visuais.

### Antes do lançamento

1. Resolver as nove pendências editoriais.
2. Confirmar créditos/licenças das mídias e Neue Montreal.
3. Otimizar bundle/imagens.
4. ⏳ Executar `npx vercel --prod` com vars `VITE_SUPABASE_URL` e `VITE_SUPABASE_PUBLISHABLE_KEY` configuradas no painel Vercel (`vercel.json` já existe no repositório).
5. Configurar domínio, OG final e smoke tests em produção.
6. ⏳ Revogar token de acesso pessoal Supabase após confirmar que não é mais necessário.

---

## 7. Critério de encerramento

O projeto só deve ser chamado de completo quando:

1. O site público estiver consumindo dados publicados do Supabase sem fallback silencioso em produção.
2. Todo conteúdo/apresentação exigidos forem editáveis no admin.
3. Reorder, duplicação, mídia, preview e publicação forem transacionais e testados.
4. RLS e Storage passarem casos positivos e negativos.
5. Os 14 layouts desktop e 28 painéis mobile forem homologados nos viewports definidos.
6. Acessibilidade, SEO, documentação e deploy tiverem evidência real.
7. Pendências editoriais restantes estiverem explicitamente resolvidas, ocultas ou aprovadas como rascunho.

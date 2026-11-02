# Checklist consolidado — PortfolioTulius após P3

**Vigência:** 02/11/2026 (UTC). **Base funcional P3:** `5accb752908442856cec8af0003f89a599cb3497`. Este documento substitui a classificação operacional anterior **sem apagar** os históricos e documentos de etapas originais. Ele distingue entrega automática de aceite humano e representa pendências **transferidas**, não concluídas.

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

- [ ] Inventariar/comparar os **26 blocos manuais** individualmente com coleções de destino e campos efetivamente apresentados.
- [ ] Confrontar textos, fotos, links, ordem, estado, metadados e estilos por painel.
- [ ] Solicitar aprovação de **cada divergência** antes de substituir origem.
- [ ] Vincular gradualmente apenas os blocos aprovados, mantendo originais recuperáveis.
- [ ] Escolher individualmente quais campos das experiências serão sincronizados.
- [ ] Homologar propagação de experiências, projetos, métricas, formação, idiomas, ferramentas, depoimentos e contato.

## P4.2 — CMS, Supabase e editor (P0 anterior)

- [ ] Completar inventário de todos os campos editoriais, imagens, galerias, URLs, SEO, ordem, visibilidade e status.
- [ ] Verificar, campo a campo, formulário → gravação → Supabase → recuperação → prévia → público.
- [ ] Corrigir divergências remanescentes entre dados estruturados e `content_json`.
- [ ] Validar criar/editar/duplicar/ordenar/arquivar/publicar/ocultar seções e blocos.
- [ ] Homologar prévia de rascunhos e guardas de mudanças não salvas.
- [ ] Homologar histórico e recuperação limitada.
- [ ] Executar testes de gravação somente em staging isolado com autorização específica.

## P4.3 — Fotografia, biblioteca e galerias (P1 anterior)

- [ ] Auditar correspondência dos 75 registros de mídia com objetos Storage.
- [ ] Investigar 53 objetos privados sem cadastro, **sem exclusão automática**.
- [ ] Revisar textos alternativos e metadados, inclusive 14 registros sinalizados por alt vazio ou curto na consulta de P2.
- [ ] Homologar upload privado, publicação deliberada, seleção, substituição e cancelamento sem alterações.
- [ ] Verificar logos, 19 slides de seis experiências, enquadramentos e legendas.
- [ ] Associar depoimentos aos IDs das fotos aprovadas, sem inferência por nome ou ordem.

## P4.4 — Site, SEO e desempenho (P1 anterior)

- [ ] Resolver quatro critérios P3 ainda falhos na seção Contato, sem alteração involuntária de design.
- [ ] Repetir medidas de LCP mobile, decompondo fontes, CSS, JS, rede e consultas; perseguir ≤2,5 s, atualmente sem comprovação.
- [ ] Testar degradação segura com falhas parciais do Supabase.
- [ ] Corrigir `radius.card` e outros tokens sem correspondência pública.
- [ ] Verificar SEO de CMS versus HTML publicado, inclusive atualização após salvar.

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

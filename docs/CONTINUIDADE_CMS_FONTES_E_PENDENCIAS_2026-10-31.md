# PortfolioTulius — continuidade documental e backlog de UX do CMS

## Aviso: este handoff foi superado pela implementação posterior

**Registro histórico de 31/10/2026, anterior às entregas CMS-UX.** As expressões `PENDENTE`, `NÃO IMPLEMENTADO` e os próximos passos nas seções abaixo descrevem a situação **naquele SHA**. Em commits posteriores, o [estado do CMS](ADMIN_CMS.md) e o [estado vigente](ESTADO_ATUAL_VIGENTE.md) registraram implementação em código de CMS-UX-01 (popover 50 ícones), CMS-UX-02 (alinhamento alt/legenda) e CMS-UX-03 (biblioteca em modal). **Não executar essas tarefas novamente por leitura deste arquivo.**

A inspeção humana e P2 transacional permanecem separadas e suspensas até autorização. Este arquivo foi mantido na rota original para preservar links de handoff e a especificação histórica, não como backlog atual. Consulte [Pendências realmente abertas](OPEN_ISSUES.md).

---

> **Arquivo legado por assunto:** seções datadas abaixo registram decisões e medições de seus próprios SHAs; não as tratar como status operacional atual.

**Data da conferência:** 31/10/2026. **Natureza:** documentação e especificação para o próximo chat; **não é implementação das correções descritas abaixo**.  
**Repositório:** `tuliustsangaropulos/PortfolioTulius` · branch obrigatória `main`. **Base lida:** [`e611429`](https://github.com/tuliustsangaropulos/PortfolioTulius/commit/e611429aa88cadb6e8f1bdda43529f423718fe1f). A próxima sessão deve conferir novamente HEAD, CI, Vercel e Supabase quando necessário: nenhum SHA desta página é perpetuamente vigente.

## 1. Hierarquia e escopo da auditoria

1. Prevalecem o código e os documentos da `main`, confirmados por CI e deployment no mesmo SHA, e as observações manuais mais recentes do proprietário.
2. Consultar `AGENTS.md`, `README.md`, `docs/ESTADO_ATUAL_VIGENTE.md`, `docs/OPEN_ISSUES.md`, este arquivo e, por tema, `docs/ADMIN_CMS.md`, `docs/DESIGN_SYSTEM.md`, `docs/RESPONSIVE_LAYOUT.md`, `docs/CONTENT_MODEL.md`, `docs/P3_ACEITE_AUTOMATIZADO_FINAL_2026-10-28.md`, `docs/P2_HOMOLOGACAO_ADMINISTRATIVA_2026-10-28.md`.
3. As quatro Fontes Markdown do projeto ChatGPT conferidas em 31/10/2026 são: `GUIA_FONTES_VIGENTES_PORTFOLIOTULIUS_ATUALIZADO_2026-10-28.md`, `ESTADO_ATUAL_VIGENTE_PORTFOLIOTULIUS_2026-10-28.md`, `CONTEXTO_PRODUTO_DESIGN_PORTFOLIOTULIUS.md` e `BACKUP_CONTINUIDADE_SECAO_01_VERSAO_80_LINHAS_2026-10-28.md`. Os dois primeiros são **snapshots antigos**; substituição no projeto ChatGPT é **manual**. Os dois últimos são históricos a preservar sem reescrever.
4. O backup privado da seção 01 tem **80 linhas** e SHA-256 `67db85f1cc497e6f51625f19472f76a753707cb0c7b34407af73d7f23b4ff288`; não copiá-lo ao repositório público. A cópia GitHub de 53 linhas não é equivalente.
5. As quatro imagens fornecidas nesta solicitação são evidência visual anexada à **conversa**, não fotos autorizadas para publicação nem novos arquivos de código. Não publicar capturas com dados editoriais sem autorização.

## 2. Situação comprovada (antes das correções futuras)

| Frente | Situação e evidência |
|---|---|
| Entrega | `main` [`e611429`](https://github.com/tuliustsangaropulos/PortfolioTulius/commit/e611429aa88cadb6e8f1bdda43529f423718fe1f), [Validate #41172157025](https://github.com/tuliustsangaropulos/PortfolioTulius/actions/runs/41172157025) **success**, [Export Docs #41172156985](https://github.com/tuliustsangaropulos/PortfolioTulius/actions/runs/41172156985) **success**, Vercel Production **READY** para o mesmo SHA. |
| Conteúdo público | [Audit P3 #41171332333](https://github.com/tuliustsangaropulos/PortfolioTulius/actions/runs/41171332333): **13 seções desktop, 25 painéis mobile compostos, 38 capturas sem falhas**, erros de browser 0, P5 público 3/3 sem mutações. Há **14 seções cadastradas** (uma oculta). |
| Desempenho | LCP mediano desktop **1,643 s PASS**; mobile **7,757 s FAIL**, frente P3-PERF-01 aberta, meta ≤2,5 s. Variantes WebP da foto aprovada de **600×800 / 29.568 bytes** e **900×1200 / 51.458 bytes**, PNG original e dados preservados. O experimento de consulta antecipada foi **revertido** após regressão de integridade. Não falsificar o orçamento. |
| CMS autenticado | [P5 Admin Read-Only #41172037326](https://github.com/tuliustsangaropulos/PortfolioTulius/actions/runs/41172037326): login, oito módulos, viewport **390×844 sem overflow**, biblioteca de **50 ícones visuais** com `aria-label`, Salvar flutuante habilita/desabilita corretamente, alt opcional, confirmação ao deixar rascunho, prévia de **14 seções**, logout e bloqueio. **4/4 PASS, contentMutations=0**. Isso **não comprova gravações** em produção. |
| Supabase somente leitura | Conferência 31/10: **14** seções cadastradas, **13** publicadas/visíveis, **8** entradas de navegação publicadas/visíveis, **5** depoimentos publicados, **34** registros em `media_assets`, **8** `editorial_issues` abertas. Não confundir contagem de linhas físicas `section_panels` com 25 composições capturadas em P3. |
| P2 | Homologação transacional CRUD/publicação/revisão/upload/Storage com JWT real **SUSPENSA** por decisão anterior contra custos de staging e gravações de teste em produção. Não reabrir sem autorização expressa. |

### Implementações já concluídas — não refazer por engano

Editor do Site unificado (Seções/Blocos/Coleções), agrupamento administrativo de seis trabalhos em **Experiências Profissionais**, itens de blocos recolhidos com expansão única, toasts e confirmações personalizadas, informações contextuais, ações de mídia com ícones, texto alternativo **opcional**, retirada de **Nota editorial** dos formulários (colunas e dados legados preservados), seletor Mobile/Desktop para imagem da seção **Olá!**, biblioteca de 50 ícones em cinco grupos, Salvar flutuante por formulário com controle de alterações, proteção de navegação interna, aviso **nativo** de navegador ao atualizar/fechar aba (limitação da plataforma), CMS responsivo e WebP responsivo da foto aprovada. Essas funcionalidades constam do código; as mudanças **solicitadas neste documento ainda não**.

## 3. Novas correções de UX — próximas solicitações (NÃO IMPLEMENTADAS)

### CMS-UX-01 — Ícones em dropdown/popover, em todas as páginas pertinentes

**Evidência:** captura 1 da solicitação de 31/10: biblioteca com 50 pictogramas ocupa altura excessiva, exibida integralmente no formulário.  
**Código vigente:** `src/components/admin/VisualIconLibrary.tsx` renderiza `<fieldset className="visual-icon-library">` e cinco categorias expandidas; `src/lib/icon-catalog.ts` contém os 50 ícones. Pontos de chamada: `src/components/admin/AdminModules.tsx` em `VisualIconLibrary` (indicadores) e `PlatformIconLibrary` (ferramentas); conferir outros seletores de ícone (ex.: seta simples) e aplicar contrato visual coerente.

**Contrato para próxima implementação:**
- Exibir inicialmente um **controle compacto de dropdown**, com ícone(s) escolhido(s) e indicador de abertura. Ao abrir, **painel suspenso/popover** com as **mesmas 50 opções gráficas em categorias**, sem ocupar altura permanente da página; não converter para `<select>` textual nem eliminar categorias/ícones existentes.
- Escolha única para `metricIcon`; nas ferramentas, preservar multiseleção de até **3** `toolIcons`; valores salvos anteriormente continuam legíveis e editáveis.
- Pictogramas sem título visível por célula, com nome acessível por `aria-label`/tooltip; navegação teclado (Enter/Espaço, Escape, foco), fechar ao clicar fora, botão de seleção com `aria-expanded`, foco restituído ao gatilho e sem scroll horizontal no celular.
- Não escrever valores no banco até o Salvar flutuante do bloco; mudança deve contar como `dirty`. Reutilizar catálogo e contrato `src/types/content.ts` / `src/lib/validation.ts`; não alterar renderização pública dos ícones.
- **Aceite:** dropdown inicialmente fechado em desktop e 320/390/768px, 50 escolhas disponíveis, categorias corretas, 1 e até 3 escolhas funcionais, acessibilidade e persistência somente após fluxo aprovado (P2 continua bloqueado).

### CMS-UX-02 — Alinhar “Descrição alternativa do logo” e “Legenda da imagem”

**Evidências:** capturas 2 e 4 de 31/10: entrada do texto alternativo do logo fica deslocada verticalmente para o centro; **Legenda da imagem** tem espaço grande acima do campo e desalinhamento com **Fotografia do slide**. Preservar exatamente os textos atuais, inclusive os que pareçam provisórios; esta solicitação é **layout, não edição editorial**.  
**Código vigente:** `src/components/admin/AdminModules.tsx` (~linhas 993–1055, 1140–1203) usa `field-grid`, `PublishedMediaPicker`, `<label>` do logo e um `.map` para `title`, `alt`, `caption` seguido de foto; CSS `src/index.css` contém margens de `.field-grid label` e `display:grid`.  
**Contrato:**
- Alinhar **descrição alternativa do logo** pelo topo da linha e posicionar o `input` imediatamente abaixo do rótulo (sem grande faixa vazia); marcar como **opcional**, sem `required`.
- Em cada slide, alinhar título, descrição alternativa, legenda e imagem em grade consistente, com `align-items:start`/`align-content:start` e agrupamento sem esticar labels à altura das miniaturas. Reorganizar colunas/linhas quando necessário sem trocar os valores de `experienceMedia.logoAlt`, `slides[].caption`, `slides[].alt` e `slides[].image`.
- No celular, todos os campos ficam em uma coluna, próximos de seus rótulos; foco e altura de toque adequados. Aceite visual em 1440px e 390px; alterações devem ser somente de layout.

### CMS-UX-03 — Biblioteca de imagens em modal, com upload no próprio modal

**Evidência:** captura 3 da solicitação de 31/10: clicar no botão da imagem abre uma lista de imagens **inline**, empurrando o restante da página; não oferece upload no mesmo contexto.  
**Código vigente:** `src/components/admin/PublishedMediaPicker.tsx` usa `open` para renderizar `<div className="published-media-panel" role="region">...` dentro do formulário; consulta só `media_assets` públicos/publicados, com busca, seleção e fechamento. A lógica existente em `src/components/admin/AdminModules.tsx` → `EnhancedMediaLibrary` faz upload via `stagePrivateMediaChange` no bucket `portfolio-private`, cadastro e promoção explícita para `portfolio-public`; **não** duplicar a rotina nem contornar essa segurança.
**Contrato:**
- Ao clicar em **Escolher da biblioteca**, abrir um **modal/dialog padronizado**, não uma grade expandida no formulário; busca, thumbnails, seleção, estados de carregamento/erro/vazio e fechamento. Modal responsivo e com rolagem **dentro do diálogo**.
- **Enviar mídia** dentro do mesmo modal. Reutilizar ou extrair o fluxo seguro existente (validação JPG/PNG/WebP/SVG, até 8 MB, upload inicialmente privado, metadados, possível promoção explícita para público). **Nunca exibir mídia privada como publicação acessível a todos**; novo upload não pode ser selecionado na seção pública até estar publicado. Evitar seleção silenciosa ou publicação automática.
- Reuso para todos os `PublishedMediaPicker` do CMS (logo, slides, itens, SEO etc.), sem campo duplicado e sem perder enquadramento X/Y/zoom. Atribuir URL/alt somente após seleção voluntária. O item atual, o texto alternativo e a posição permanecem se modal for cancelado.
- Padrões: `role="dialog"`, `aria-modal`, título acessível, foco inicial, trap de Tab, Escape, restauração de foco, click-outside conforme política existente, toasts padronizados e confirmação para ações potencialmente destrutivas; não usar `alert/confirm/prompt` do JS.
- **Aceite:** abrir/fechar, filtrar, selecionar item existente, cancelar sem `dirty`, checar upload e publicação de forma unitária/mocks; ensaios **transacionais reais** somente após autorização P2 e ambiente isolado. Verificar mobile sem rolagem horizontal.

### CMS-UX-04 — Regra do Salvar e estados de formulário após modais

Manter Salvar flutuante, desabilitado até alteração. A seleção de um ícone ou imagem publicada deve modificar só o rascunho até Salvar; fechar modal/cancelar upload não habilita indevidamente. Navegação interna com rascunho exige popup próprio; `beforeunload` em refresh/fechar **obrigatoriamente** produz confirmação nativa do navegador, que não pode ser substituída com proteção equivalente. **Não remover o aviso nativo para aparentar padronização visual.**

## 4. Sequência de implementação sugerida no próximo chat

1. Conferir `main`/CI/Vercel, ler este handoff e docs de design/arquitetura/CMS; abrir a imagem/captura vigente e verificar os campos em viewports desktop/mobile.
2. Corrigir os espaçamentos dos labels/inputs (CMS-UX-02) e criar testes de layout, sem mudança de conteúdo.
3. Refatorar biblioteca de ícones como dropdown visual reutilizável (CMS-UX-01), preservando catálogo 50 e teste de seleção única/múltipla.
4. Converter picker de mídia para modal e compartilhar os serviços de upload seguro (CMS-UX-03). Só testes mockados/read-only enquanto P2 suspenso.
5. Validar `pnpm format:check`, `pnpm typecheck`, `pnpm test`, `pnpm build`, `pnpm smoke:build`; testar acessibilidade, navegação de foco, dirty guard, viewport 320/390/768/1440, regressão de painel público e guardar evidências por SHA.
6. Publicar pela `main` conforme autorização, confirmar CI e Vercel no mesmo SHA e P3 se houver mudança pública; atualizar `ESTADO_ATUAL_VIGENTE`, `OPEN_ISSUES`, `ADMIN_CMS`, `DESIGN_SYSTEM`/responsividade se necessário, e a Fonte de estado do ChatGPT **manualmente**.

## 5. Pendências independentes — não confundir com este backlog

- **P3-PERF-01:** LCP mobile mediano 7,757 s vs alvo ≤2,5 s; não encerrado por WebP, consulta parcial, alteração do gate ou desempenho desktop.
- **P2 transacional:** suspenso por ausência de autorização de custo; P5 read-only aprovado não abrange escrita CMS, Storage ou restauração via JWT.
- **Editorial:** 8 `editorial_issues` abertas e revisão de 2 depoimentos explicitamente fictícios; cabe decisão do proprietário. Não inventar conteúdo, autoria, crédito ou correção automática.
- **P1/segurança/manutenção:** licenciamento/proveniência, objetos privados, função inativa, branches e riscos aceitos; não excluir arquivos nem mudar RLS/usuários/tokens sem escopo expresso.
- **Fontes ChatGPT:** guia e estado ativos de 28/10 foram congelados. Preparar substitutos datados de 31/10, preservar o registro histórico de produto/design e o backup 80 linhas. **Não há sincronização automática GitHub → anexos do projeto ChatGPT.**

## 6. Governança de documentação

- **Fonte operacional:** GitHub `docs/ESTADO_ATUAL_VIGENTE.md` para resumo, `docs/OPEN_ISSUES.md` para pendências, `docs/ADMIN_CMS.md` para comportamento, e **este arquivo** para próximos ajustes reproduzíveis.
- **Histórico imutável:** `docs/P3_ACEITE_AUTOMATIZADO_FINAL_2026-10-28.md` documenta o aceite **daquela data**, não garante aprovação do LCP no presente; relatórios datados de P1/P2/P3, logs de tentativas, contextos e capturas anteriores devem continuar distinguíveis, não sobregravados.
- Não criar guias duplicados com as mesmas recomendações conflitantes; apontar guias do ChatGPT ao resumo vigente e manter os quatro anexos ativos (dois substituíveis, dois históricos), salvo decisão expressa diferente.
- Documentação da solicitação de 31/10 **não altera código do CMS**. Confirmar isso no diff do commit documental.

**Próximo chat:** executar **CMS-UX-01, CMS-UX-02 e CMS-UX-03**, preservar **CMS-UX-04**, testar e atualizar evidências. Não declarar resolvidos sem código, testes e aceite.

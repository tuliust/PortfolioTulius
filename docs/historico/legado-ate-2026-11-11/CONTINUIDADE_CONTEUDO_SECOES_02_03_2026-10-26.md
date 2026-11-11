# PortfolioTulius — Continuidade do conteúdo das seções 02 e 03

**Etapa:** 26/10/2026  
**Repositório:** https://github.com/tuliustsangaropulos/PortfolioTulius (branch `main`)  
**Produção:** https://tulius.work/  
**Contexto:** continuidade da correção visual da seção 02; sem pedido de redesign de outras seções.

## 1. Escopo solicitado

Na seção 02 (`#sobre`), permitir pelo CMS **adicionar, editar, excluir e ordenar** textos da coluna direita. Os cinco textos iniciais, na ordem estabelecida:

1. **Estratégia também é escuta.** — Uma trajetória conectando organizações e pessoas.
2. **Comunicação de ponta a ponta** — Conecto estratégia, reputação, conteúdo, tecnologia e gestão de projetos.
3. **Visão editorial** — Clareza para temas complexos, repertório internacional e execução orientada por contexto.
4. **Resultados que orientam decisões** — Indicadores e análise de desempenho para transformar estratégia em impacto mensurável.
5. **A voz de quem lidera** — Posicionamento e mensagens que fortalecem lideranças e criam conexões com públicos estratégicos.

Na seção 03 (`#resultados`), substituir os sete títulos do bloco de especialidades que apareciam na coluna direita (inclusive `XXXXX · X/Y/Z`) pelos cinco títulos dos cards 01–05 da seção inicial:

1. Comunicação Corporativa
2. Gestão e execução de projetos
3. Relações Públicas e Gestão de Eventos
4. Marketing Digital, Branding e Performance
5. Imprensa e Influenciadores

**Preservar:** a fotografia central da seção 02, o título e a introdução da esquerda, os indicadores e valores da seção 03, a composição dos cinco cards clicáveis da seção 01 e as demais seções.

## 2. Estrutura implementada no CMS

A seção `sobre` usa os mesmos dois blocos persistentes:

- Painel A `content_blocks.id = 49fbe2d3-fe6d-459c-a298-35b6a9fe563d` — **um item de mídia**, título técnico `Imagem da seção 02`; preserva `image=/media/tulius-portrait.jpg`, `alt` e os campos opcionais de imagem central desktop `aboutDesktopImage`/`aboutDesktopAlt`.
- Painel B `content_blocks.id = 2410a612-17df-48fe-93a3-fd1c6504a200` — **uma lista única e ordenada** de cinco objetos JSONB `{title,text}`. Quantidade administrável e não limitada a cinco.

O editor existente `src/components/admin/AdminModules.tsx` já possui botões de inclusão, exclusão com confirmação e movimentação para cima/baixo, além dos campos título/texto. Acrescentou-se orientação contextual quando é selecionado `sobre` / painel B.

**Como editar:** `/admin` → **Blocos e painéis** → selecionar **Olá!** → bloco **B** → usar **Adicionar item**, os campos **Título / Texto**, as setas e o botão **Remover item**, depois **Salvar alterações**. O salvamento continua pela RPC `save_content_block_atomic` com revisão/auditoria existentes. O primeiro texto da lista também aparece com a foto no mobile A; os demais aparecem no mobile B. O renderizador desktop mostra todos os textos da lista B na coluna direita.

A foto permanece gerenciável no **painel A**; a coluna esquerda da seção 02 permanece gerenciada pelo módulo **Seções**. **Não apagar o item de imagem do painel A.**

## 3. Alterações da seção 03

O bloco do painel B `id = ccb158ca-ee6a-4305-873d-8230a03de216` foi atualizado para conter apenas os cinco títulos solicitados. A lista reproduz o conteúdo editorial dos cards de abertura no instante desta entrega; **não foi implantado vínculo dinâmico automático**, de modo que alterações futuras de nomes devem ser coordenadas entre os dois blocos se a equivalência for desejada.

O painel A de `resultados` (4 métricas) foi preservado integralmente. A marcação `is_placeholder` do bloco B foi removida e sua nota antiga, apagada; o registro da pendência `editorial_issues.id = 0250a5de-800b-40b4-be8b-1ee4d4214d0f` foi mantido com `status=resolved`, texto da decisão e `reviewed_at`. A remoção deste placeholder não comprova nem resolve outras divergências editoriais documentadas.

## 4. Escrita e verificação no Supabase

Projeto Supabase: `zfnrhzplwpjpdljraypt` (`portfolio`). O conteúdo de três blocos (`sobre/A`, `sobre/B`, `resultados/B`) e o issue de placeholder foram alterados **em uma única transação SQL** com guardas dos valores anteriores. **Sem mudança de schema, migrations, Auth, RLS, Storage, contas ou variáveis de implantação.** O bloco `resultados/A` foi somente lido.

Uma consulta posterior confirmou: `sobre/A = 1` item técnico de imagem, `sobre/B = 5` textos na ordem especificada, `resultados/B = 5` títulos, `resultados/A = 4` indicadores inalterados e `editorial_issues.status = resolved` para a questão antiga.

## 5. Código, testes e publicação

- `src/components/public/PublicSite.tsx`: `AboutDesktop` usa somente os itens do painel B; no mobile, `MobilePanel` aplica o primeiro texto de B ao item de foto do painel A, mostrando B a partir do segundo item no painel mobile B.
- `src/content/fallback.ts`: cinco textos e cinco especialidades sincronizados com o banco publicado.
- `src/components/admin/AdminModules.tsx`: orientação contextual para gerir toda a lista de textos.
- `src/content/fallback.test.ts`: testes dos cinco textos, da imagem do painel A, das quatro métricas e da correspondência editorial dos cinco temas entre as seções 01 e 03.

Verificações realizadas: **GitHub Actions `Validate PortfolioTulius` aprovado** no commit documental `29551f6ec74077da6aff195e779ab355b3c289b8`, run [40267290567](https://github.com/tuliustsangaropulos/PortfolioTulius/actions/runs/40267290567), após passagem de formatação, TypeScript, testes unitários, build e smoke. O deployment de produção da Vercel desse mesmo commit foi confirmado como `READY` (`dpl_AnruK2ENPPDoozk24qWA31DrJTdx`). As alterações documentais posteriores devem ter CI/deploy conferidos separadamente; esses checks não substituem homologação real dos controles administrativos.

**Pendências de homologação:** fluxo real de adição, edição, exclusão, reordenação e gravação via navegador com JWT administrativo; inspeção visual em desktop e mobile com a lista de cinco itens; overflow em altura de tela reduzida. Não confundir sucesso dos testes unitários ou gravação direta em banco com teste autenticado do admin.

## 6. Documentação e Fontes do projeto ChatGPT

Atualizados no GitHub: `README.md`, `docs/ADMIN_CMS.md`, `docs/CONTENT_MODEL.md`, `docs/ARCHITECTURE.md`, `docs/DESIGN_SYSTEM.md`, `docs/OPEN_ISSUES.md`, `docs/ESTADO_ATUAL_AUDITORIA_2026-10-25.md` e este relatório. `AGENTS.md` e os documentos históricos das seções 01 e 02 foram mantidos, sem substituir as etapas anteriores.

**Fontes ChatGPT:** anexar este Markdown como registro mais recente e atualizar a cópia do relatório consolidado de auditoria, se ainda estiver anexada a versão antiga. Preservar os demais arquivos como histórico; o relatório anterior da seção 02 agora representa apenas o estado daquela etapa, não o conteúdo publicado atual.

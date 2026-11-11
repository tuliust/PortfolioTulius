# PortfolioTulius — Continuidade da seção 01 e preparação da seção 02

**Data da etapa:** 25/10/2026 (horário de Porto Alegre).  
**Projeto:** https://tulius.work/  
**Código:** https://github.com/tuliustsangaropulos/PortfolioTulius — branch `main`.  
**Status:** implementações da seção 01 publicadas no fluxo GitHub → Vercel; homologação visual e administrativa real ainda pendente.

## 1. Solicitações do proprietário nesta etapa

1. Transformar as **cinco caixas numeradas de especialidades** do painel direito da seção 01 em links clicáveis na **superfície inteira**; acrescentar hover. Por padrão, todas devem levar à **seção 03 (`#resultados`)**, mas cada destino deverá ser alterável pelo admin.
2. Subir o selo circular do painel esquerdo para evitar corte; atualizar sua inscrição para **“VISÃO 360° DA COMUNICAÇÃO E MARKETING”** e distribuir a frase ao redor da circunferência.
3. Animar discretamente e em looping a seta que aponta para baixo, com respeito a `prefers-reduced-motion`.
4. Corrigir a rolagem da seta para abrir a **seção 02 (`#sobre`) desde o topo da janela**, sem a faixa da seção 01.
5. Mudar o cabeçalho do menu lateral de **“ÍNDICE / 14 SEÇÕES”** para **“MENU”**.
6. Atualizar a documentação no GitHub e entregar este relatório Markdown para anexar às fontes do projeto ChatGPT. A **seção 02 será tratada depois**, sem alteração editorial neste pacote.

## 2. Implementação técnica

- `src/types/content.ts`: o item de conteúdo admite `targetSlug?: string`. Trata-se de **atributo do JSONB existente**, não nova coluna ou tabela.
- `src/components/admin/AdminModules.tsx`: **Blocos e painéis** → seção **Perfil** → bloco do **painel B** → itens **01–05**: campo “Destino do card (seção interna)”. O editor apresenta o destino padrão `resultados` e permite escolher outro slug de seção. A gravação usa a RPC existente `save_content_block_atomic`.
- `src/lib/validation.ts` e `src/lib/validation.test.ts`: validação de formato de slug e resolução do destino contra a lista de **seções publicadas e visíveis**. Se o destino estiver ausente ou indisponível, usa `resultados`; se a seção 03 também estiver indisponível, não gera um link quebrado.
- `src/components/public/PublicSite.tsx`: torna links reais os cinco cards de especialidades no desktop e os cinco correspondentes do painel B mobile; preserva os demais `ItemCard`. Altera o texto padrão do selo, distribui a legenda ao longo do `textPath` circular e mantém a âncora da seta para a seção seguinte.
- `src/index.css`: adiciona hover/foco acessível com realce laranja em toda a caixa; desloca o selo para cima; anima apenas o ícone da seta; remove `scroll-margin-top` da seção desktop para alinhar a próxima seção ao topo. Mantém a regra existente de redução de movimento.
- `src/content/fallback.ts`: sincroniza o texto padrão do selo com o renderer.
- `src/components/public/Navigation.tsx`: título literal “MENU” no drawer.

**Preservação:** as caixas continuam numeradas 01–05 (não confundir com o antigo contador das seções no header). Não houve alteração de textos de experiências, imagens, políticas RLS, migrations, permissões, configurações de Vercel ou estrutura do banco.

## 3. Supabase, publicação e limites de verificação

Projeto Supabase: `portfolio`, ref `zfnrhzplwpjpdljraypt`. A inspeção confirmou 14 seções e o bloco do perfil com cinco itens no painel A e 11 no painel B. O primeiro item do painel A **não tem `hero.badgeText` persistido**; portanto o novo texto do selo utiliza o valor padrão do frontend. Os cinco cards ainda não precisam de `targetSlug` gravado porque a regra padrão já os direciona a `#resultados`.

**Nenhuma alteração de dados no Supabase nesta etapa.** O fluxo de gravação real do novo seletor no admin exige teste posterior com sessão autenticada. O build da Vercel retornou `READY` nos commits da implementação, mas **READY não substitui** inspeção visual e execução documentada das suítes de teste.

## 4. Critérios de aceite ainda a verificar manualmente

- Testar a página em desktop largo, desktop baixo (ex.: 1366×768), tablet e mobile; conferir foto, selo completo e ausência de overflow/recorte.
- Verificar os cinco cards com mouse e teclado: hover, foco, clique em área vazia da caixa, scroll para `#resultados`, e o mesmo destino no mobile.
- Testar a seta: loop discreto, preferência de movimento reduzido e alinhamento exato da seção 02 no topo após clique.
- Abrir e fechar o menu; conferir “MENU”, navegação, contraste e foco.
- Em sessão administrativa real, editar um `targetSlug`, salvar e validar no site; restaurar o valor anterior com procedimento controlado. Não tratar este teste como já realizado.
- Confirmar resultados da suíte `pnpm check` e testes de navegador/GitHub Actions no SHA de publicação; Vercel `READY` confirma o build, não necessariamente format/typecheck/Vitest.

## 5. Documentação sincronizada

Atualizados no GitHub: `README.md`, `docs/OPEN_ISSUES.md`, `docs/ADMIN_CMS.md`, `docs/CONTENT_MODEL.md`, `docs/ARCHITECTURE.md`, `docs/DESIGN_SYSTEM.md` e o relatório de auditoria de estado, além deste documento. `AGENTS.md` continua válido e não requer alteração por este pacote.

**Fontes ChatGPT:** anexar **este arquivo** como nova fonte de continuidade. A versão anexada de `ESTADO_ATUAL_AUDITORIA_2026-10-25.md` poderá ser substituída pela versão mais recente em `docs/` do GitHub. Os outros cinco arquivos originais são registros históricos: preservá-los, sem reescrever decisões ou inventários dos SHAs anteriores.

## 6. Próxima etapa

A próxima rodada será exclusivamente sobre a **seção 02**, conforme novas observações do proprietário. Não iniciar refatorações adicionais antes delas.

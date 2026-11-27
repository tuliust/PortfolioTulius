# Exportação PDF — contrato e aceite vigente

## QA sintética após adiamento da fotografia de Olá — 26/11/2026

[PDF Renderer Visual QA #45915235566](https://github.com/tuliust/PortfolioTulius/actions/runs/45915235566) SUCCESS no SHA [197a41d](https://github.com/tuliust/PortfolioTulius/commit/197a41d2996ea06071b0f50cf080711bcde4c286). Seis modos visuais sem falhas, geração nativa de PDFs pesquisáveis e com links (13 folhas desktop e 16 mobile na fixture integral), fixture CSS compilada PASS e fixture excluída do build público. O adiamento público de Olá não se aplica a PDF; sem mudança de renderer ou fluxo de impressão. Não é nova exportação autenticada com dados reais nem modifica o aceite de 18/11. [Testes](TESTES_E_HOMOLOGACAO.md).

## QA sintética após correção de performance pública — 25/11/2026

[PDF Renderer Visual QA #45704659078](https://github.com/tuliust/PortfolioTulius/actions/runs/45704659078) **SUCCESS**, `main@65b9e69ba3cc875ca4960cd71ac1e7eed9d5dd53`, disparado no SHA funcional final após os ajustes de preload, transporte de imagem e snap público. A cópia sem perda da foto atual continua sendo usada na impressão; textos, geometria e fluxo do exportador não foram alterados. Essa execução usa fixtures sintéticas; não equivale a um novo PDF autenticado com todos os dados/fotografias reais nem substitui os limites de evidência e aceites datados abaixo. [Validação completa](TESTES_E_HOMOLOGACAO.md).


**Situação em 18/11/2026:** **Desktop e Mobile homologados visualmente pelo proprietário**, após exportação real e correções da regressão. A declaração expressa “Está tudo ok. Considere concluído” encerra o **aceite produtivo do PDF**. Código funcional de referência: [`609218bd2bfede558f22c44002e62e9e21b2aada`](https://github.com/tuliust/PortfolioTulius/commit/609218bd2bfede558f22c44002e62e9e21b2aada).

> Este é o contrato operacional atual. Históricos nos outros guias conservam suas datas e resultados de CI, mas avisos antigos de “PDF pendente” não anulam o aceite posterior. Os PDFs reais e as capturas recebidos pelo proprietário são arquivos privados da conversa, **não** devem ser versionados no GitHub.

## 1. Modo Desktop e Mobile

| Modo | Referência | Mecanismo atual |
|---|---|---|
| Desktop | 1440 × 900 px; 13 seções publicadas e visíveis | O painel prepara/valida o iframe de 1440 px e chama `printDesktopReferenceFrame` → `iframe.contentWindow.print()`, diretamente nele. Não abre aba estreita que possa ativar o breakpoint Mobile e ocultar `.desktop-panel`. |
| Mobile | 390 × 844 px de referência | A impressão abre aba própria com regras responsivas referenciadas a 390 px; `preparePdfPrintLayout` cria folhas físicas por painel. A aba externa pode ser larga sem alterar a composição interna. |
| Original/Clean | Mesmos dados publicados | A versão Clean neutraliza a paleta somente no PDF; não altera tokens no CMS. |

**Composição Mobile no QA físico integral (16 folhas):** 1 Perfil/Abertura, 2 Visão 360°/Áreas, 3 Olá, 4 Diferenciais, 5 Visão Geral (quatro métricas, uma coluna), 6 grupos temáticos (duas colunas, inclusive o quinto tema publicado **Estratégia e Reputação**), 7 Formação, 8–13 Experiências, 14 Ferramentas, 15 Depoimentos, 16 Contato. **Desktop: 13 folhas no QA físico integral.** Essas contagens são da **fixture sintética**, não uma afirmação sobre o número de páginas dos PDFs reais que o proprietário aceitou.

O exportador não cria uma imagem raster única: texto pesquisável e hiperlinks devem permanecer nativos e clicáveis. A ordenação e os dados continuam oriundos do conteúdo publicado do CMS. Seleções parciais podem ter outra quantidade de folhas e apontar âncoras excluídas para `https://tulius.work/`.

## 2. Passo a passo no CMS

1. Abrir **Exportar PDF**, escolher dispositivo (Desktop/Mobile), identidade (Original/Clean) e seções.
2. Aguardar **Documento pronto para impressão**. `PdfPrintReady` espera fontes e imagens carregadas/decodificadas; seções, Trajetórias ou mídias ausentes bloqueiam a geração.
3. Clicar **Gerar PDF**: Desktop imprime o **iframe** já preparado em 1440 px; Mobile abre uma **nova aba** e prepara a impressão nesse contexto.
4. No Chrome: escolher **Salvar como PDF**, **Margens: Nenhuma**, **Gráficos de segundo plano: ativados**, sem cabeçalhos nem rodapés. Não usar um driver virtual do sistema com papel A4 ou texto rasterizado.
5. Conferir o resultado visual e a presença de texto pesquisável, links, fotografias e folhas sem cortes. Uma futura alteração de conteúdo requer nova validação.

### Arquivos de implementação e teste

- [Renderer](../../src/components/public/PdfPortfolio.tsx) · [CSS PDF](../../src/components/public/PdfPortfolio.css) · [leitura e preparação](../../src/components/public/PdfPrintReady.tsx).
- [Paginação física](../../src/lib/pdf-print-layout.ts) · [lançamento Desktop](../../src/lib/pdf-print-launch.ts) · [painel CMS](../../src/components/admin/PdfExportPanel.tsx) · [prévia autorizada](../../src/components/admin/PdfPreviewPage.tsx).
- [Fixture isolada](../../src/pdf-export-qa.tsx) · [QA físico Chromium](../../scripts/pdf-export-pdf-smoke.mjs) · [workflow](../../.github/workflows/pdf-export-visual.yml).

## 3. Histórico imediato da regressão (18/11/2026)

**Desktop antes da correção:** PDF real com 14 folhas; as folhas 1 (Perfil), 2 (Sobre), 4 (Formação), 11 (Ferramentas) e 14 (Contato) mostravam apenas fundos, e Depoimentos se fragmentou entre 12 e 13. **Causa:** o painel preparava iframe de 1440 px, mas abria outra aba de impressão que poderia estar abaixo de 768 px de viewport, ativando CSS `.desktop-panel { display:none }`. **Solução:** imprimir no iframe de 1440 px já medido, sem recriar o documento em uma aba estreita.

**Mobile antes da correção:** PDF real de 17 folhas, com a última frase de **Comunicação para Lideranças** deslocada para página órfã 5. **Causa:** reserva física de 64 px em `sobre-diferenciais` insuficiente para as cinco descrições reais. **Solução:** reserva restrita a essa folha aumentada para **176 px**; fixture e QA passaram a exigir que a frase final, “Posicionamento e mensagens que fortalecem credibilidade e criam conexões.”, permaneça na folha 4.

**Depois:** o proprietário examinou os dois PDFs produzidos pelo CMS e declarou ambos visualmente **aprovados**. Essa evidência de aceite produtivo é distinta das verificações sintéticas e não implica alteração de dados do Supabase.

## 4. Verificações do código funcional `609218b`

| Verificação | Resultado comprovado |
|---|---|
| [Validate #44250702060](https://github.com/tuliust/PortfolioTulius/actions/runs/44250702060) | **SUCCESS** |
| [PDF Renderer QA #44250701938](https://github.com/tuliust/PortfolioTulius/actions/runs/44250701938) | **SUCCESS**: visual 6/6, impressão física 9/9, CSS compilado 2/2 |
| PDF físico sintético integral | **13 folhas Desktop** e **16 folhas Mobile**, textos pesquisáveis e hyperlinks verificados |
| [P5 Admin Read-Only #44250702020](https://github.com/tuliust/PortfolioTulius/actions/runs/44250702020) | **SUCCESS no segundo attempt**; o primeiro teve timeout e continua historicamente FAILURE |
| Vercel Production | **READY** no commit funcional `609218b`, deployment `dpl_55JJGRMED7dnCtrTu9L3rKsSDTh3` |
| PDF real Desktop e Mobile | **ACEITO PELO PROPRIETÁRIO**, após inspeção visual; PDFs e capturas não versionados aqui |

**Limites:** o aceite do PDF não comprova teste integral de **editar → salvar → reler** todos os campos do CMS e não corrige o risco de LCP mobile aceito no [backlog standby](../06-governanca/BACKLOG_STANDBY.md). Permanecem proibidas alterações inferidas em Supabase, Auth/RLS, Storage, migrations, imagens ou conteúdo.

## 5. Governança

A homologação PDF está **encerrada**. Nova intervenção só por novo escopo explícito, preservando o visual e os dados aprovados. Antes de agir: reler [`AGENTS.md`](../../AGENTS.md), [índice](../README.md), [guia para IA](../06-governanca/GUIA_USO_POR_IA.md), código e serviços por SHA. Após qualquer alteração funcional, atualizar documentação conforme [protocolo](../06-governanca/PROTOCOLO_ATUALIZACAO_DOCUMENTAL.md). As cinco fontes privadas `*_PORTFOLIOTULIUS.md` não são sincronizadas automaticamente e não pertencem a este repositório.

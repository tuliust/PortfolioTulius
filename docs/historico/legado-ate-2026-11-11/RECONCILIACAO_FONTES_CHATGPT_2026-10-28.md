# PortfolioTulius — reconciliação das Fontes do projeto ChatGPT

> **ATUALIZAÇÃO DOCUMENTAL EM 31/10/2026:** este relatório descreve a **conferência histórica de 28/10**. A lista das quatro Fontes foi reconfirmada em 31/10. O **guia e o estado anexados continuam congelados em 28/10** até substituição manual no ChatGPT. Recomendação e backlog atuais: [continuidade 31/10](CONTINUIDADE_CMS_FONTES_E_PENDENCIAS_2026-10-31.md). Não publicar nem alterar o backup privado da seção 01 de 80 linhas. A contagem de **oito Fontes** em documentos anteriores foi superada por quatro arquivos existentes.



**Conferência efetiva: 28/10/2026, após a última correção estrutural de zoom.** Inventário lido da superfície de arquivos do projeto ChatGPT nesta conversa, não inferido de arquivos antigos. Fonte de verdade operacional: GitHub `main`, CI/Vercel no mesmo SHA e Supabase atual quando necessário. Consultar [estado vigente](ESTADO_ATUAL_VIGENTE.md), [pendências](OPEN_ISSUES.md) e [resumo do chat](CONTINUIDADE_CHAT_MANUAL_ZOOM_E_FONTES_2026-10-28.md).

## Quatro documentos Markdown atualmente anexados ao projeto ChatGPT

| Arquivo anexado | Papel real | Recomendação |
|---|---|---|
| `GUIA_FONTES_VIGENTES_PORTFOLIOTULIUS_ATUALIZADO_2026-10-28.md` | Guia congelado no commit `d10ef39`; contém afirmação histórica de aceite humano ainda pendente | **Substituir por cópia revisada** do guia, sem manter duas versões ativas |
| `ESTADO_ATUAL_VIGENTE_PORTFOLIOTULIUS_2026-10-28.md` | Snapshot operacional também congelado em `d10ef39`; 13/13 de navegação histórica, LCP antigo, status manual anterior | **Substituir por cópia revisada** com resumo recente e indicação de consultar `main` |
| `CONTEXTO_PRODUTO_DESIGN_PORTFOLIOTULIUS.md` | Registro amplo de intenções, produto, identidade, 14 seções do plano e decisões de 24–25/10 | **Manter sem reescrever**; é memória histórica de requisitos, não diagnóstico do estado atual |
| `BACKUP_CONTINUIDADE_SECAO_01_VERSAO_80_LINHAS_2026-10-28.md` | Variante exclusiva da seção 01, **80 linhas**, SHA-256 `67db85f1cc497e6f51625f19472f76a753707cb0c7b34407af73d7f23b4ff288` | **Preservar integralmente**, com cópia privada independente; não confundir com a variante GitHub de 53 linhas nem publicar automaticamente |

Além desses documentos, a conversa contém capturas de tela chamadas `image.png`: são anexos da conversa, **não** novas Fontes Markdown permanentes.

## Correção importante do inventário anterior

A listagem de **oito Fontes** no guia anterior e na [reconciliação histórica](historico/RECONCILIACAO_FONTES_CHATGPT_INICIAL_2026-10-28.md) é um snapshot de uma fase anterior, **não** a situação atualmente observada. Nesta conferência foram encontradas exatamente as **quatro Fontes Markdown** acima. Portanto, **não instruir a remover oito arquivos inexistentes na lista atual**.

Não há necessidade operacional de quinta Fonte permanente caso o guia e o estado sejam substituídos. O documento detalhado deste chat permanece no **GitHub** e deve ser consultado pelo conector. Não anexar duplicatas do README, DESIGN_SYSTEM, ADMIN_CMS, P3 ou do novo registro a menos que se pretenda usar o projeto sem acesso ao GitHub.

## Procedimento de atualização do ChatGPT

1. Arquivar as duas cópias atuais do guia e do estado, se for importante manter a proveniência.
2. Substituí-las manualmente por novas cópias Markdown identificadas com a revisão posterior à auditoria de zoom; **não apagar** o contexto de produto/design.
3. Preservar a variante da seção 01 de 80 linhas e seu SHA-256; manter cópia privada fora do GitHub.
4. Confirmar que restam somente **quatro Fontes Markdown ativas** e que o guia aponta para `main`.
5. Lembrar que atualizar arquivos do GitHub **não atualiza automaticamente Fontes do projeto ChatGPT**.

## Pendências que não são de organização de Fontes

- P2 transacional (CRUD, publicação, upload e restauração com JWT real) **suspenso**, sem autorização de custos/staging;
- LCP mobile **4,36 s** (auditoria do ajuste de zoom, mediana de três), meta **≤2,5 s**;
- oito pendências editoriais atuais; decisão separada sobre depoimentos fictícios, direitos de 19 SVGs e 2 PNGs, objetos privados, função 410, branches e riscos de segurança historicamente aceitos;
- confirmação visual **específica da última correção de zoom** na mesma área útil de navegador da captura de referência, sem reabrir automaticamente o aceite manual de experiências/CMS/depoimentos/Contato/menu.

**Segurança:** não publicar backups exclusivos privados, credenciais, tokens ou conteúdo de arquivos privados no repositório público. Não remover ou substituir Fontes do ChatGPT por ação GitHub.

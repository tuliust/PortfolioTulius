# PortfolioTulius — continuidade consolidada do chat de verificação manual e zoom

**Data de consolidação:** 28/10/2026 (horário de Porto Alegre). Este documento é um resumo operacional verificável do **chat**, não substitui documentos técnicos nem concede autorização de mutação em produção.

## Prioridade de fontes
1. `main` de [PortfolioTulius](https://github.com/tuliustsangaropulos/PortfolioTulius), [AGENTS.md](../AGENTS.md), [README](../README.md), [estado vigente](ESTADO_ATUAL_VIGENTE.md), [pendências vigentes](OPEN_ISSUES.md).
2. CI/Vercel correspondente ao mesmo SHA de publicação; dados do Supabase somente se a solicitação exigir.
3. Os quatro documentos anexados ao ChatGPT são **cópias históricas ou derivadas**, não sincronizadas. [Reconciliação de Fontes](RECONCILIACAO_FONTES_CHATGPT_2026-10-28.md).

## Linha do tempo desta conversa

| Frente | Entrega/decisão | Situação |
|---|---|---|
| Referência inicial de zoom | Comparação entre navegador 100% e aparência anterior a 75%; redução global por CSS `zoom` e compensações de viewport implementadas na primeira etapa | **Solução superada**, não reutilizar |
| Experiências | Até seis itens visíveis por empregador; 13 excedentes sinalizados `isHidden`, preservados no JSONB e editáveis pelo admin | Implementado; aceite manual posterior declarado pelo proprietário |
| Depoimentos | Cinco publicados (três anteriores, dois **fictícios e identificados**), grade 3×2 quadrada com expansão, distribuição mobile 2+3 | Implementado; aceite manual posterior declarado pelo proprietário |
| Contato | Fotografia isolada na coluna central, assinatura/localização no rodapé e correção de sobreposição do link LinkedIn | Implementado; aceite manual posterior declarado pelo proprietário |
| Navegação | Rótulos Início, Projetos em Destaque e Graduação; uma entrada Experiência Profissional apontando para Invest RS; demais empresas no índice horizontal, oito links no menu | Implementado; aceite manual posterior declarado pelo proprietário |
| CMS/Seções | Status em português, feedback por toast, confirmação de publicação/arquivamento, verificação de controles de visibilidade/tema/layout | Implementado e inspecionado por código/testes, **sem homologação transacional P2** |
| CMS/Mídia | Biblioteca compacta (miniatura e basename com extensão), edição apenas do arquivo escolhido, campo Crédito/licença ocultado, seletor com orientação de dimensões e diálogo X/Y/zoom por uso | Implementado. Valores históricos de crédito preservados; upload/Storage transacional não homologado |
| Revisão de pendências | Correções de contagem dinâmica Dashboard, linhas uniformes em depoimentos, foco em modal e paralelismo da consulta de testimonials | Implementado e validado por CI/P3 |
| **Último diagnóstico de zoom** | No navegador 100%, composição ficava pequena e a referência desejada estava em 125%; causa era CSS global `zoom` acoplado a `vw` | Causa técnica confirmada |
| **Correção de zoom vigente** | Removidos CSS `zoom` global e `--desktop-visual-scale`, compensações em `svh/dvh/vw`; preservado o layout responsivo e criado `src/lib/layout-zoom.test.ts` | Implementado e auditado, sem dados alterados |

## Aceite: não confundir as duas decisões

O proprietário afirmou que **tudo relacionado à rodada de verificação manual anterior estava validado**. Essa declaração encerra a revisão dos ajustes de experiências, depoimentos, Contato, menu e interface do CMS até aquele ponto. **Depois**, apresentou uma **nova** captura solicitando que 100% tivesse a aparência vista em 125%; a correção técnica desse achado foi publicada e auditada, porém não houve declaração expressa de aceite visual posterior à sua publicação. Não extrapolar o aceite manual anterior para esta nova comparação.

## Evidência técnica mais recente da correção de zoom

- Commit funcional: [`8a45e9b`](https://github.com/tuliustsangaropulos/PortfolioTulius/commit/8a45e9bc0663ee15e9b0797785900308f6622712); [CI Validate #40794804474](https://github.com/tuliustsangaropulos/PortfolioTulius/actions/runs/40794804474) **success**, [P3 #40794804504](https://github.com/tuliustsangaropulos/PortfolioTulius/actions/runs/40794804504) **success**.
- Contrato: **12 resoluções**, `zoom` computado `1`, sem transformação global e sem overflow; **13 seções, 25 painéis, 38 capturas, nenhuma falha de navegador**; P5 anônimo 3/3 `mutations=0`.
- Mediana Lighthouse: **mobile Performance 78, LCP 4,36 s; desktop Performance 97, LCP 1,09 s**. O gate de regressão passou; **LCP mobile ≤2,5 s não passou**.
- Commit posterior `cbc5bc2` adicionou documentação/evidências e passou CI e Vercel READY. Para o SHA **vigente hoje**, consultar HEAD ao vivo; este documento é uma cópia estática.

## Supabase — conferência somente de leitura nesta reconciliação

Foram lidos **14 seções cadastradas, 13 públicas, 8 links de menu, 5 depoimentos publicados, 21 mídias e 8 pendências editoriais abertas**. Todos os 21 títulos das mídias coincidem com o basename armazenado no Storage. Nenhuma gravação SQL, migration, operação em Storage ou alteração editorial foi executada nesta reconciliação.

## Pendências reais e decisões separadas

1. **P3 performance mobile:** LCP atual ~4,36 s versus objetivo ≤2,5 s, exigindo otimização própria e nova medição no mesmo SHA.
2. **P2 transacional suspenso:** não executar CRUD/Storage com JWT real, staging, contas de teste ou custos sem autorização; não equiparar leitura/autoria de código a homologação de mutações.
3. **P2 restauração:** UI de rollback não implementada; exigir decisão de escopo ou processo operacional reversível antes de tratar como concluído.
4. **P1/segurança:** investigar/decidir direitos de mídias ilustrativas, objetos privados, importador 410, branches antigas, token histórico e Leaked Password Protection. Não remover nem alterar automaticamente.
5. **Editorial:** oito issues abertas e eventual substituição futura dos dois depoimentos fictícios por recomendações reais; não editar sem autorização.
6. **ChatGPT Fontes:** duas das quatro cópias anexadas estão defasadas e precisam de substituição manual; os outros dois arquivos devem ser preservados. A variante de **80 linhas** da seção 01 é exclusiva/privada, nunca sobrescrever pela variante GitHub de 53 linhas.
7. **Novo ajuste de zoom:** aguardar **somente** a confirmação estética específica quando o proprietário apresentar/confirmar nova inspeção; o aceite anterior não é revogado.

## Regra preventiva permanente

Não usar CSS `zoom` ou `transform:scale()` global em `.public-site`. Alterações futuras de densidade devem ajustar componentes em CSS responsivo e ser auditadas via `src/lib/layout-zoom.test.ts` e P3, especialmente 1100/1101 px; não ajustar percentuais arbitrariamente a cada rodada. Preservar conteúdo, design e dados, sem despesas adicionais.

## Fontes do projeto ChatGPT — recomendação executiva

**Quatro documentos ativos observados:** (1) guia atualizado antigo, (2) índice operacional antigo, (3) contexto produto/design histórico, (4) backup privado da seção 01 de 80 linhas.

**Ação proposta:** substituir as cópias (1) e (2) por revisões atuais; manter (3) e (4), preservando cópia privada do backup. **Não é necessária uma quinta Fonte permanente**, pois este documento novo reside no GitHub e pode ser lido pelo conector. A gestão das Fontes é manual no ChatGPT, não controlada por commits no GitHub.

### P3 — última rodada de desempenho mobile (29/10/2026 UTC)

A correção de densidade/zoom anterior permanece intacta. A otimização de montar **apenas uma árvore responsiva** por viewport foi mantida; os testes P3 preservam 13 seções, 25 painéis mobile, 38 capturas e zero falhas. Último SHA funcional `4ab9ce5`, [CI #40797703964](https://github.com/tuliustsangaropulos/PortfolioTulius/actions/runs/40797703964) e [P3 #40797703855](https://github.com/tuliustsangaropulos/PortfolioTulius/actions/runs/40797703855) `success`; LCP mobile mediano **4,30 s**, meta **≤2,5 s não atendida**, desktop 1,07 s. Tentativas de contenção de pintura e fontes assíncronas foram **revertidas**. Nenhum dado ou mídia foi alterado. Detalhes e decisões de continuidade em [P3](P3_QUALIDADE_ACEITE_2026-10-28.md).

### Continuação do LCP mobile — 29/10/2026 UTC

Teste de leitor REST público foi revertido por produzir **zero seções**; o Lighthouse falso de 2,26 s é inválido e não representa cumprimento da meta. O Supabase SDK/autenticação originais foram preservados. **Apenas a separação de chunks Vite** foi mantida: `supabase-sdk` e `vendor`. Auditoria P3 `e1846ac`: 13 seções, 25 painéis, 38 capturas, LCP mediano mobile 4,248 s, P5 sem mutações. A meta ≤2,5 s continua aberta e o gate P6 foi reforçado para exigir conteúdo LCP real. Ver [relatório P3](P3_QUALIDADE_ACEITE_2026-10-28.md).

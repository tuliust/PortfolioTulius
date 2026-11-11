# Auditoria do CMS na revisão manual — 28/10/2026

> **Decisão posterior do proprietário — 28/10/2026:** a verificação manual visual e funcional de todas as áreas ajustadas neste chat foi **validada pelo proprietário**. Não solicitar novo aceite visual dessas áreas por rotina. A aceitação manual não homologa CRUD/Storage com JWT administrativo, não atinge automaticamente a meta LCP mobile e não autoriza exclusões, custos ou mudanças de segurança. O estado técnico vigente é sempre o HEAD e seus testes, nunca os SHAs históricos citados abaixo.

## Escopo e evidência

Auditoria de leitura do código vigente e conexão Supabase, sem executar gravações de teste em produção. O proprietário pediu validar todas as abas e o funcionamento dos botões de Seções, além de simplificar a Biblioteca e introduzir ajuste de enquadramento. **O P2 transacional permanece suspenso**, portanto a inspeção do código/TypeScript, os testes unitários e as capturas públicas não constituem aceite de operações reais com JWT administrativo. O histórico P5 de leitura autenticada com oito módulos permanece evidência histórica limitada, não foi repetido nesta rodada.

**Main funcional:** [7ad8030](https://github.com/tuliustsangaropulos/PortfolioTulius/commit/7ad8030722d7168de36e0871897636f725bdb720); [CI Validate #40776321190](https://github.com/tuliustsangaropulos/PortfolioTulius/actions/runs/40776321190) **success**, com formatação, TypeScript, testes, build e smoke offline. [Auditoria P3 #40776111312](https://github.com/tuliustsangaropulos/PortfolioTulius/actions/runs/40776111312) **success**, sobre o SHA público precedente `9718761` (desde então somente alterações do formulário de enquadramento, testes, formatação e documentação). P3: 13 seções, 25 painéis mobile, 8 viewports, 38 capturas sem falhas/overflow e navegação aprovada. LCP mobile mediano **4,32 s** — meta ≤2,5 s ainda não atingida. Vercel Production **READY** no SHA `7ad8030`.

## Revisão por aba

| Aba | Caminho de dados/função inspecionado | Resultado da revisão de código | Limite |
|---|---|---|---|
| Visão geral | `sections`, contagem `editorial_issues`, status de carregamento | Consultas de leitura e estado/situação do Supabase existentes | Não valida persistência |
| Seções | `sections.update`, `publish_section`, `duplicate_section`, `create_section_with_panels`, `swap_section_order`, `sections.update(status=archived,is_visible=false)` | Status de lista traduzido. Publicar/Arquivar exigem confirmação. Salvar bloqueia promoção/arquivamento sem usar o botão. `is_visible` continua lido pela página e navegação públicas. | RPCs e autorizações reais não foram exercitadas nesta rodada |
| Blocos | `save_content_block_atomic`, placements, validação de conteúdo | Enquadramento de fotos e logos por uso, dimensão de referência, tratamento de erro e toast; campo de ocultar itens preservado | Persistência com JWT real pendente |
| Coleções | `insert/update`, `archive`, filtros de status | Ordenação e campos persistíveis examinados, feedback de salvamento; status de lista traduzido | Sem gravação de fixture |
| Identidade | `design_tokens.upsert`, renderer `theme-*` | Cores e fontes aprovadas; classes públicas recebem tokens. Seções especiais não oferecem falsos controles de layout/motion | Sem teste visual de edição de token real |
| Mídia | `media_assets`, URL assinada/pública, upload privado, promoção e substituição compensatórios | Miniaturas com título basename.ext; detalhe do item selecionado; sem campo ou update de crédito/licença; orientação de dimensão e crop nos usos | Sem upload/promoção de bytes de teste |
| Navegação | `navigation_items.upsert` e `buildPublicNavigation` | Rótulos/status/visibilidade persistidos e filtrados no público; feedback de gravação | Sem teste de gravação autenticada |
| SEO | `save_home_seo_atomic`, `withOpenGraphImage` | Atualização atômica existente, seletor com referência 1200×630, toast | Crop de OG não altera arquivo social: preparar original |
| Revisões | `editorial_issues.update`, `content_revisions` | Leitura e ação de resolução persistível com feedback | Sem resolver pendência real de teste |
| Prévia | `/admin/preview`, `usePortfolio(preview)` | Isolamento de Auth e fonte de conteúdo incluindo drafts existentes | Conferência humana de cada layout pendente |

## Escolhas conservadoras

A Biblioteca **não** converte/recorta JPEG/PNG/SVG no Storage. O editor X/Y/zoom mantém a foto original e adiciona campos opcionais a `content_blocks.content_json`; usa `object-position` e `scale()` no uso público. Nas imagens OG de redes sociais, o arquivo original continua controlando o recorte. A remoção de `Crédito/licença` ocorreu na interface e no payload das novas alterações, **não** na coluna SQL; 19 créditos históricos permanecem retidos sem uso. Os **21 títulos de media_assets** foram atualizados no Supabase de forma explícita para o nome final de arquivo com extensão; leitura posterior confirmou 21/21, sem mutações em bytes ou tabelas.

## Pendências mantidas

Homologação segura com conta JWT administrativa para testar efetivamente retorno das RPCs, RLS de escrita, upload/replace, prevenção de dados perdidos e prévia pós-publicação; aceite visual manual de enquadramento nos diferentes dispositivos; desempenho LCP mobile ≤2,5 s. Não reativar P2, não criar staging pago, não apagar dados legados ou editar objetos Storage sem nova autorização.

## Ajustes técnicos de baixo risco após o aceite manual — 28/10/2026

- **Visão geral CMS:** substituída a frase fixa das 14 seções/2 distribuições por contagem dinâmica de seções visíveis e cadastradas, e contador das `editorial_issues` efetivamente abertas. Não houve alteração de registros.
- **Depoimentos:** grade desktop passa a ter duas linhas uniformes e cartões quadrados, com expansão ocupando duas linhas. No mobile mantém-se uma coluna fluida. Textos e cinco registros publicados preservados.
- **Janela X/Y/zoom:** o diálogo agora recebe foco inicial, retém Tab/Shift+Tab, permite Escape e devolve o foco ao controle anterior ao fechar; o arquivo original e configurações preexistentes continuam intocados.
- **Carregamento público:** a consulta de depoimentos, única coleção atualmente vinculada no Supabase público, é iniciada em paralelo à consulta da estrutura de seções. Isso remove uma etapa sequencial de rede no carregamento inicial; não constitui por si só comprovação de LCP ≤2,5 s.
- **Aceite humano:** declarado concluído pelo proprietário nesta conversa. P2, direitos de mídias, riscos de segurança anteriormente aceitos, exclusões de Storage/branches, 8 ocorrências editoriais e reconciliação de Fontes ChatGPT seguem como decisões separadas.


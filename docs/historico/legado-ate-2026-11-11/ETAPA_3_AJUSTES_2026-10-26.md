# Etapa 3 — correções pontuais e consolidação editorial (26/10/2026)

## Alcance e critérios de verdade

Esta atualização é prospectiva; não substitui relatórios históricos de fases anteriores. Referência inicial: `main e6cba1e`; projeto Supabase `zfnrhzplwpjpdljraypt`.

## Conteúdo consolidado no banco

Mediante solicitação expressa do proprietário, três registros publicados de `content_blocks` foram marcados `is_placeholder=false` após conferência exata de seção, painel, título e quantidade de itens:

- `resultados/A`: quatro indicadores existentes (valores, textos e vínculos temáticos inalterados).
- `invest-rs/A`: três itens textuais existentes, incluindo as competências e dois projetos; galeria com três títulos permanece sem fotografias.
- `invest-rs/B`: quatro textos existentes, mantendo **`items[3].placeholder=true`** no item **Ativos visuais**, pois imagens finais ainda aguardam aprovação.

Foram incluídas notas editoriais de consolidação sem alterar `content_json`, título, métrica, número, conteúdo, status de publicação ou ordem. A pendência de mídia da Invest RS e as outras questões editoriais continuam abertas. `resultados/B` já estava validado e foi preservado. Não interpretar a validação de textos como validação independente de números ou aprovação de mídias não fornecidas.

## Correções de código e testes

1. Regra CSS explícita em `#formacao .item-meta` prioriza contraste claro sobre o fundo escuro, corrigindo a causa observada no Lighthouse (5 nós). **Nova medição realizada** no workflow [40286141852](https://github.com/tuliustsangaropulos/PortfolioTulius/actions/runs/40286141852), SHA `9ac8eb5`: acessibilidade 100/100 em mobile e desktop, sem falhas da categoria. A correção foi preservada nas revisões posteriores; isso não equivale à reexecução do Lighthouse no último SHA documental.
2. Upload da biblioteca de mídia privada agora tenta remover o objeto recém-enviado caso falhe a inserção em `media_assets`.
3. Substituição de arquivo privado usa novo caminho temporário, atualiza metadados para o novo objeto e só então exclui o objeto antigo. Falha da atualização limpa o novo objeto sem alterar o antigo. Se a limpeza falhar, o CMS informa a necessidade de remoção manual.
4. Casos unitários simulam sucesso, erro de upload, erro de persistência, compensação, ordenação das operações e falha da limpeza. Não substituem teste de upload/download real com sessão administrativa.
5. Fotografia de abertura superdimensionada, bundle JS e lacunas de autenticação E2E permanecem oportunidades de otimização/homologação, não declaradas corrigidas.

## Segurança e pendências preservadas

Não há alteração de schema, RLS, grants, funções, Auth, buckets, PAT, Leaked Password Protection nem usuários. A navegação foi conciliada no Supabase: o registro `competencias` passou a `is_visible=false`, permanecendo 13 itens de navegação publicados e visíveis. A seção e seu conteúdo histórico continuam preservados.

**Evidências automatizadas:** no commit `e3bc828a487cd5fc17604cd1d20a986292225f8d`, o CI `Validate PortfolioTulius` passou (formatação, TypeScript, 46/46 testes em 7 arquivos, build e smoke). A auditoria `Audit P3 Lighthouse`, executada no SHA `9ac8eb5321baf54eba802ebe10754a40a0e096b6` que contém a correção CSS, passou em 8 viewports e 38 capturas, sem overflow de página; Lighthouse mobile 75/100 performance, 100 acessibilidade, 100 boas práticas e 100 SEO; desktop 96/100 performance, 100 nas outras categorias. O SHA de auditoria precede dois ajustes no wrapper de gravação do CMS, sem mudanças posteriores no CSS público. A Vercel confirmou `READY` do SHA `e3bc828`.

**Pendências de aceite:** validar performance mobile (LCP ~4,51 s), sessão real P5 Admin Read-Only, operações de mídia com JWT real e confirmação manual de UX nos principais breakpoints. A implantação automática e testes de produção não substituem aceite humano nem autenticação administrativa.

## Revisão cruzada das três etapas

A documentação das etapas 1 e 2 foi incorporada ao repositório e o índice [Estado auditado após as etapas 1–3](AUDITORIA_ETAPAS_1_A_3_ESTADO_ATUAL_2026-10-26.md) reúne o inventário vigente. O teste `scripts/p5-public-rls.mjs` passou a verificar também a consistência de navegação publicada com seções públicas. Esse teste exige execução do workflow P3 para comprovação end-to-end em produção; o fato de constar no repositório não implica execução nem resultado.


## Reauditoria após conciliação documental — 26/10/2026

Após a inclusão dos relatórios das etapas 1 e 2 e do índice de estado vigente, o [CI 40288148955](https://github.com/tuliustsangaropulos/PortfolioTulius/actions/runs/40288148955) e o [P3 Lighthouse 40288148755](https://github.com/tuliustsangaropulos/PortfolioTulius/actions/runs/40288148755) passaram no SHA `d3acbed`. O P3 validou o novo teste de consistência entre navegação e seções públicas (13 links / 13 seções, 0 inválidos); Lighthouse mobile performance 80, accessibility 100, desktop performance 98, accessibility 100, 38 capturas e 8 viewports. As medições anteriores 70/96 e 75/100 foram preservadas em seus relatos históricos. O rótulo do artefato P4 foi corrigido de 42 para 38 capturas; a tabela `section_panels` do Supabase continua possuindo 42 registros.


## Limpeza final verificada do painel

Na revisão cruzada posterior, as implementações legadas `MediaLibrary()` e `NavigationEditor()` foram confirmadas sem chamadas em `AdminApp.tsx` e removidas. O painel em uso mantém `EnhancedMediaLibrary` e `NavigationStudio`. A remoção descarta uma variante antiga de upload sem compensação e textos estáticos de 14 destinos, sem alterar dados, rotas ou o módulo ativo. Testes de uso do Storage com JWT real continuam pendentes.

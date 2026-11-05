# Auditoria dos pedidos deste chat — 05/11/2026

> **Natureza:** verificação de implementação de pedidos posteriores ao encerramento histórico do projeto. Esta auditoria consultou código GitHub, CI, Vercel e Supabase **somente leitura**. Não executou gravações de CMS, Auth, RLS, Storage ou infraestrutura. Não converte CI verde em aceite visual ou transacional.
> **Baseline funcional auditado:** commit [`31943c12`](https://github.com/tuliustsangaropulos/PortfolioTulius/commit/31943c12b8214aa1d4aad957d159ddcea010835e), [Validate #42016989021](https://github.com/tuliustsangaropulos/PortfolioTulius/actions/runs/42016989021) **success** (formatação, TypeScript, 173 testes, build, smoke e sintaxe de scripts). Vercel **READY** e o alias `https://tulius.work/p3-deployment.json` retornaram o mesmo SHA. O novo commit apenas documental não equivale a novo teste funcional.

## 1. Mídia, navegação e SEO — retomada da implementação anterior

| Pedido | Evidência | Estado e limite |
|---|---|---|
| Upload direto à biblioteca pública, sem publicação manual | `uploadPublishedMedia`, `PublishedMediaDialog` e bucket `portfolio-public` com status `published`. | **Implementado no código**; upload com sessão administrativa real não foi ensaiado. A mídia não é vinculada automaticamente a uma seção. |
| Excluir por X com confirmação e limpar referências | `deleteMediaAssetEverywhere` usa RPC `delete_media_asset_everywhere` para referências em JSON e catálogo, seguida de remoção física do Storage; há proteção para retratos com URLs fixas. | **Código e RPC presentes**; sem ensaio destrutivo real. A etapa SQL não é transação única com o Storage e pode deixar remoção física pendente. |
| Status de navegação publicado, sem seletor editável | `NavigationStudio` grava status `published`. | **Código e snapshot SQL confirmados:** 14/14 itens publicados, embora nem todos necessariamente visíveis ao público. |
| SEO gerado para mecanismos de busca | `scripts/generate-seo.mjs` gera título, descrição, OG, canonical, robots e sitemap no build. | **Implementado**. Canonical verificado: `https://tulius.work/`, não `tuliust.work`. Salvar SEO no CMS exige **novo deployment** para atualizar HTML estático. |

## 2. Correções responsivas públicas solicitadas

| Pedido | Evidência | Estado |
|---|---|---|
| Olá desktop: não cortar as laterais da fotografia | `.about-portrait.has-custom-image img` usa `object-fit: contain` e alinhamento inferior. | Código **implementado**; enquadramento final ainda sem aceite visual humano. |
| Ferramentas mobile: elevar e espaçar os grupos | CSS de `#ferramentas .mobile-panel` e `.mobile-items` reajustado. | Código **implementado**, sem inspeção final em dispositivo. |
| Experiências mobile: laranja apenas quando a faixa de logos fica sticky | `ExperienceStack.tsx` usa `isIndexStuck`; CSS `.experience-index.is-stuck`. | Código **implementado**, sem teste físico final. |
| Olá mobile: fundo preto/grafite após a fotografia, mantendo laranja até a margem da foto | `#sobre .about-mobile-continuation` usa `var(--ink)`. | Código **implementado**, sem aceite final de pixels. |
| Perfil mobile: esconder “Experiência em destaque” e deixar espaço abaixo das áreas | `ProfileMobileList` não renderiza a lista repetida de experiências; registros do CMS preservados. | Código **implementado**, altura exata do espaço livre não homologada. |
| Primeira tela mobile: seta para baixo visível sem rolar | `profile-mobile-stage`, hero, seta e painel recalibrados para `100svh`, com exceção para telas baixas. | **Tentativa de correção implementada**; visibilidade universal em 320 px e iPhone real **não demonstrada**. |

Referência: commit [`5ed489af`](https://github.com/tuliustsangaropulos/PortfolioTulius/commit/5ed489af5879589565cb0101e420065bfbf50552), [Validate #42014122089](https://github.com/tuliustsangaropulos/PortfolioTulius/actions/runs/42014122089) **success**.

## 3. Editor do Site e Prévia — solicitações mais recentes

| Pedido | Evidência de implementação | Limite |
|---|---|---|
| Mover “Editar seção” e “Acervo estruturado” para a base direita do box de título, em tamanho menor | `AdminApp.tsx` moveu as tabs para `.site-editor-heading`; CSS com `align-items:flex-end`, botões menores e quebra responsiva. | **Implementado**; posição em sessão autenticada não homologada visualmente. |
| Remover “Nova seção” e “Duplicar seção” | Ações de criação/duplicação retiradas de `SectionsEditor`. | **Implementado na UI**; RPCs não excluídas. |
| Remover aviso “Publicado — A visibilidade é ajustada…” | Quadro `editor-readonly-status` da seção retirado. | **Implementado**; indicações de estado em outras áreas permanecem. |
| Substituir “Publicar seção” por “Salvar” | Botão chama `saveRegisteredAdminChanges` no Editor incorporado, que processa alterações registradas de seção/bloco. | **Implementado**, sem ensaio real de salvar e recarregar CMS. |
| Remover “Novo bloco” e “Adicionar item” | Controles retirados de `ContentStudio`. | **Implementado**; conteúdo preexistente preservado. |
| Sidebar com “Oculto” e “6 itens” | `sectionPublicationLabel` simplificado; grupo mostra `entry.sections.length` + “itens”. | **Implementado**, seis experiências no snapshot. |
| Prévia Mobile com altura de tela de celular | iframe mobile usa largura máxima 390 px e `aspect-ratio: 390 / 844`, sem altura reduzida de 75vh. | **Implementado em CSS**; não simula barras do iOS nem substitui aparelho físico. |
| Texto alternativo e metadados editáveis apenas em Mídia | Inputs de alt para item, logo e slide removidos; ajuste local de framing oculto; `EnhancedMediaLibrary` conserva `mediaDraft.altText` e modal de enquadramento. | **Centralização da edição na UI implementada**, mas `item.alt`, `aboutDesktopAlt`, `logoAlt` e `slide.alt` continuam nos blocos JSON. O seletor copia o alt ao vincular: **não foi demonstrada sincronização retroativa** quando alt da Biblioteca muda depois. |

Referência: sequência de commits [`12d22562`](https://github.com/tuliustsangaropulos/PortfolioTulius/commit/12d22562de424ae33381e5228093d42801feed23) até [`31943c12`](https://github.com/tuliustsangaropulos/PortfolioTulius/commit/31943c12b8214aa1d4aad957d159ddcea010835e); [Validate #42016989021](https://github.com/tuliustsangaropulos/PortfolioTulius/actions/runs/42016989021) aprovado.

## 4. Estado real de dados no momento da auditoria

- SQL somente leitura: **14 seções** (14 publicadas, 13 visíveis); **14 itens de navegação** (14 publicados); **0 pendências editoriais abertas**.
- Biblioteca `media_assets`: **75 registros** (72 em `portfolio-public`, 3 em `portfolio-private`). Storage: **72 objetos públicos e 56 privados**, total **128** objetos; contagem de objetos e linhas não é intercambiável.
- Relatos anteriores mencionavam **76 mídias catalogadas / 4 privadas** e **129 objetos**. Há diferença de um registro privado e um objeto privado, **sem autoria nem motivo atribuíveis por estas consultas**. Nenhum objeto foi excluído nesta auditoria.
- A RPC `public.delete_media_asset_everywhere` **existe**. O arquivo versionado `20261105101500_delete_media_asset_everywhere.sql` está no GitHub, mas a versão `20261105101500` **não foi localizada** em `supabase_migrations.schema_migrations`; a tabela inclui `20261105101829`. Não inferir que a versão do arquivo exata foi registrada ou reaplicar SQL por isso.

## 5. CI, P3 e limites de homologação

- **CI do último código funcional:** [#42016989021](https://github.com/tuliustsangaropulos/PortfolioTulius/actions/runs/42016989021), **success** em formatação, TypeScript, testes, build, smoke e sintaxe dos scripts.
- **Vercel**: produção **READY** e SHA `31943c12` confirmado no domínio `tulius.work` antes desta atualização documental.
- **P3 do Editor (`04cf1240`):** [#42016688466](https://github.com/tuliustsangaropulos/PortfolioTulius/actions/runs/42016688466), **failure global** na etapa `Browser routes and responsive viewports` com **7 falhas**; o SHA do deployment foi verificado pelo próprio workflow. Não foi somente atraso de deploy.
- **Subgates do P3:** P6 performance **PASS**: LCP mediano mobile simulado de **3,484 s** em três execuções (meta **≤3,5 s**, margem estreita) e desktop **0,799 s**; P5 público **3/3 PASS**; P4 **38 capturas sem falhas automáticas**. Isso **não** equivale a P3 global aprovado nem a p75 real de usuários.
- **P3 público anterior (`5ed489af`):** [#42014121880](https://github.com/tuliustsangaropulos/PortfolioTulius/actions/runs/42014121880) também teve **failure global**, sete falhas do navegador, incluindo cenário de Perfil a 320 px. Não foi localizada P3 do commit funcional final `31943c12` nesta consulta.
- **Ainda não homologados:** foto de Contato no último pixel opaco; seta da primeira tela e layouts em iPhone real; transições em aparelhos; criação, upload, exclusão, salvamento agregado e releitura com JWT administrativo; atualização retroativa de alt já vinculado.

## 6. Próximas verificações, sem reabrir o encerramento histórico

1. Diagnosticar os sete critérios do navegador na P3 e executar nova P3 no SHA realmente servido, com foco no Perfil a 320/360/390 px e seta na primeira tela.
2. Validar visualmente o novo Editor e a Prévia em sessão administrativa e comparar a tela simulada 390×844 ao aparelho real.
3. Verificar a propagação de metadados de Mídia para JSON legado e HTML público após edição posterior do alt; não declarar fonte única integral sem comprovação.
4. Somente com autorização, cenário reversível e backup, ensaiar salvar seção+bloco, upload e exclusão de mídia; jamais usar produção histórica como fixture descartável.
5. Conferir a diferença de catálogo 76→75, origem do registro da migration e custódia/restauração de arquivos sem alterações destrutivas.

**Fontes:** [`main`](https://github.com/tuliustsangaropulos/PortfolioTulius/commits/main); [Reconciliação acumulada](RECONCILIACAO_IMPLEMENTACAO_CHAT_2026-11-05.md); [Estado](ESTADO_ATUAL_VIGENTE.md); [Encerramento histórico](ENCERRAMENTO_OPERACIONAL_2026-11-05.md); [Pendências](OPEN_ISSUES.md). Os anexos privados e backups do projeto ChatGPT **não** são publicáveis no GitHub.

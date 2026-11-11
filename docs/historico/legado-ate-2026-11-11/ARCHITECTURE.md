# Atualização operacional — P2/P4, 09/11/2026

> **Atualização de continuidade — 09/11/2026.** Este trecho prevalece sobre quaisquer snapshots datados abaixo. Código inicialmente auditado em `7e8d7f82`, agora incluindo correção de fallback P2 (`4e739dbf`), suíte de mídia sintética (`630fb712`) e experimentos de prioridade da consulta inicial de Perfil (`b3dc0a5f` e `93176222`). **Não foi aplicada migration nem houve escrita de ensaio no Supabase de produção.** A migration `20261109024100_p2_composite_section_block_save.sql` existe em Git, mas `public.save_section_block_atomic` está **ausente no banco produtivo** (SELECT em `pg_proc`); usar o caminho legado até autorização separada. Veja [relatório de execução](P2_P4_RELATORIO_EXECUCAO_2026-11-09.md), [plano de aceite](P2_P4_PLANO_ACEITE_2026-11-08.md) e [mapa CMS → renderer](MAPA_CAMPOS_CMS_RENDERER.md).

## Ajustes de arquitetura e limites de integração
A migration `20261109024100_p2_composite_section_block_save.sql` introduz `save_section_block_atomic`, versão de placements (`block_placements.updated_at`), bloqueios ordenados, verificação `private.require_portfolio_admin()` e rollback PostgreSQL. Ela atualiza a seção, o bloco e placements na mesma transação, com comparação de `updated_at`. O frontend escolhe contrato novo quando disponível; somente função especificamente ausente em cache PostgREST habilita o caminho anterior. Banco produtivo **não possui** a nova função. Não reaplicar baseline de 22/10 nem reconciliar histórico remoto com writes arbitrários. A API Storage e o Postgres **não** compartilham uma transação distribuída: publicação, renomeação e exclusão requerem compensação; oito ensaios reais sintéticos passaram, com limites de injeção ainda pendentes.

---

## Documento anterior preservado para rastreabilidade

# Arquitetura

## Registro de arquitetura da revisão de 01/11/2026 (referência datada)

**Referência histórica de 01/11:** código [`aa71737e`](https://github.com/tuliustsangaropulos/PortfolioTulius/commit/aa71737e48834bb987c4a7cb6a3353ae1cf221fb). **Não é o SHA funcional mais recente**. O [Estado atual](ESTADO_ATUAL_VIGENTE.md) e o código de [`main`](https://github.com/tuliustsangaropulos/PortfolioTulius/commits/main) têm precedência. O baseline de 05/11 anterior à reorganização é [`79aa3c07`](https://github.com/tuliustsangaropulos/PortfolioTulius/commit/79aa3c07ce6c9106b1d504c1f574731bf70fb5d2). A árvore pública e o CMS autenticado continuam distintos.

- **Primeira dobra pública:** `index.html` inicia, na rota pública, uma consulta PostgREST com chave **publicável** para a seção Perfil publicada e visível. `src/hooks/usePortfolio.ts` reutiliza a promessa `window.__p3ProfileBootstrap`, compõe a primeira seção com blocos/painéis/placements do CMS antes de aguardar o grafo inteiro; eventual falha mantém o caminho de consulta integral.
- **Carga diferida:** `src/content/defaultTokens.ts` é pequeno; `src/content/fallback.ts` é importado sob demanda somente no cenário de desenvolvimento/offline sem Supabase público. Não salvar fotografias, textos ou dados da homepage como cópias HTML fixas.
- **Supabase:** dados de seções, blocos, ordens e visibilidade respeitam `published` e RLS. O SDK administrativo/autenticado não é necessário à consulta anônima inicial. Nada autoriza modificar RLS/Storage/Auth ou configurar novas variáveis sem pedido.
- **Experiências mobile:** `src/components/public/ExperienceStack.tsx` reutiliza as seis empresas, logos e vínculos CMS; cada empresa mantém âncoras `-a` (identificação/abas sticky) e `-b` (conteúdo contínuo: projetos expansíveis, galeria e trajetória). A barra de logos fica sticky sob o menu e se encerra ao sair de Experiências. Em viewport ≤620 px de altura, o cabeçalho editorial deixa de ficar sticky para priorizar a leitura. O renderer desktop permanece separado.
- **Sem rolagem interna em Experiências:** conteúdos completos percorrem a rolagem vertical natural. O cabeçalho não deve cobrir Ferramentas ao término da sexta empresa.

Ver [responsividade](RESPONSIVE_LAYOUT.md), [proveniência das experiências](EXPERIENCIAS_UNIFICADAS_2026-10-31.md) e [performance](P3_LCP_MOBILE_RESULTADOS_2026-10-31.md).

---

> **Arquivo legado por assunto:** seções datadas abaixo registram decisões e medições de seus próprios SHAs; não as tratar como status operacional atual.

## Camadas

1. `src/components/public`: shell editorial, navegação, renderer e padrões de card.
2. `src/components/admin`: autenticação, proteção por papel e CMS.
3. `src/hooks/usePortfolio.ts`: consulta Supabase e adaptação para o modelo de apresentação.
4. `src/content/fallback.ts`: bootstrap editorial versionado; não substitui a fonte persistente após a migration.
5. `src/lib/supabase.ts`: cliente público e verificação de associação administrativa.
6. `supabase/`: schema, RLS, Storage, seed e roteiro de testes.

React Router opera em Data Mode com `RouterProvider`. O site público usa âncoras; páginas administrativas e 404 usam rotas.

## Fluxo de dados

`sections` é a unidade lógica. Os mesmos `content_blocks` são associados por `block_placements` aos painéis desktop/mobile A/mobile B. O campo `mobile_panel` mantém compatibilidade direta com o renderer. A publicação transacional exige conteúdo e pode bloquear placeholders; o visitante não recebe drafts por RLS.

O fallback só é usado quando a consulta falha ou o schema ainda não existe. Esse estado é explicitado no admin. Não há chave `service_role` no bundle.

## Limitações deliberadas

- Vite é SPA; o HTML principal é indexável, mas SSR/prerender deve ser considerado após definir domínio e plataforma final.
- Edição de layout/motion usa catálogo allowlisted, não CSS/JS arbitrário.
- O painel lista revisões e pendências; restauração granular permanece evolução futura.
- O admin é carregado em chunk separado. O bundle público ainda recebe aviso de tamanho e pode ser dividido adicionalmente.

## Navegação editorial configurável da abertura

`src/components/public/PublicSite.tsx` transforma os primeiros cinco itens do bloco `perfil` / painel B em links internos (<a href="#slug">) no desktop e no painel B mobile. `src/lib/validation.ts` resolve `targetSlug` exclusivamente contra seções efetivamente publicadas/visíveis; na ausência de campo, usa `resultados`. Os demais `ItemCard` e links de contato mantêm comportamento anterior. O CMS administra `targetSlug` dentro do conteúdo JSONB com `save_content_block_atomic`; não há chamada SQL nova nem alteração em `navigation_items`. A navegação por âncora usa o scroll nativo/suave (com suporte a movimento reduzido).

## Revisão do contrato editorial — seções 02/03, 26/10/2026

`AboutDesktop` usa **somente** `section.desktopPanelB ?? section.panelB` para os textos da direita; o bloco A é exclusivamente a fonte da fotografia e dos seus overrides opcionais de desktop. `MobilePanel`, ao renderizar `section.slug === 'sobre'`, compõe o item visual da foto com o **primeiro** `section.panelB[0]` e apresenta `section.panelB.slice(1)` no painel B, garantindo fonte textual única. O número de textos é variável: o CMS pode adicionar/remover/reordenar os itens sem mudança JSX/DDL.

Os cinco títulos da seção `resultados` ficam em `content_blocks` / painel B e correspondem editorialmente às cinco especialidades de `perfil` / painel B (índices 0 a 4); não há consulta dinâmica cruzada. Esta decisão conserva a edição independente pelo CMS e a possibilidade de títulos futuros diferentes, mas requer atenção quando o proprietário solicitar sincronização automática.

A edição de JSONB pelo admin utiliza a RPC `save_content_block_atomic`. O ajuste de conteúdo publicado foi transacional, sem migração, schema novo ou mudança de permissão. O histórico da pendência provisória ficou preservado em `editorial_issues` com status resolvido.

## Resultados interativos e navegação cruzada (26/10/2026)

`PublicSite.tsx` gerencia `selectedTheme` no nível `PublicSite`. Os cards temáticos `ProfileDesktop` / `MobilePanel` usam `onNavigate` apenas quando `resolveHeroCardDestination(...)=resultados`; definem a chave estável `themeKey` antes da navegação nativa `#resultados`. `ResultsDesktop` e `ResultsMobile` compartilham `ResultsCenter` e `ResultsThemeChooser`, com botões reais, foco e `aria-pressed`. O estado `null` mantém a visão geral dos quatro indicadores e `relatedThemeKeys` controla os indicadores associados em cada tema. A UI não fabrica novos valores numéricos.

`src/components/ui/Icons.tsx` fornece o conjunto fixo de SVGs; `ContentItem` em `src/types/content.ts` ganhou campos opcionais. O CMS usa `content_json.items` existente com `save_content_block_atomic`. `src/content/resultThemes.ts` mantém o fallback editorial dos cinco dossiês, sem criar fonte paralela no banco. O teste público foi atualizado para 13 seções e 25 painéis mobile, refletindo a seção `competencias` escondida (`is_visible=false`) e a composição única mobile em `resultados`. O menu mostra índices sequenciais somente dos itens visíveis.

Não foram alterados schema, papéis, policies RLS, Storage ou segredos. As mudanças de conteúdo e visibilidade no Supabase foram transacionais/guardadas e precisam ser documentadas separadamente da aprovação de CI.

## Experiências sobrepostas e galeria editável — 26/10/2026

Em `PublicSite`, os seis slugs contíguos de experiências profissionais são agrupados por `ExperienceStack` (`src/components/public/ExperienceStack.tsx`), renderizados uma vez na posição da primeira empresa. Os painéis possuem `position:sticky;top:0` com `z-index` crescente: a nova experiência desliza sobre a anterior. A barra `experience-index` usa `position:sticky;top:var(--header)` com camada mais elevada que os painéis e mais baixa que o header global; os links usam âncoras existentes das seções, preservando URL/hash/navegação e lógica do menu.

A composição desktop tem título/identidade à esquerda, conteúdos A+B no centro com overflow controlado e galeria de projeto à direita. No mobile o mesmo conteúdo ocupa dois painéis por empresa, preservando o contrato de navegação da auditoria. Botões Anterior/Próximo e pontos permitem selecionar slides; imagens são condicionais à existência de URL e texto alternativo. A ausência de mídia exibe estado explícito de pendência e não impede navegação. A seção Formação utiliza o sistema de componentes anterior, apenas com tema `ink`.

O contrato `ExperienceMedia` tipado é armazenado em `content_json.experienceMedia` do bloco A, carregado pelo hook e editado no `ContentStudio` pelo mesmo salvamento atômico. Não há novo endpoint, migration ou modificação de roles. Os slugs do grupo são estáveis e documentados; adição/reordenação de empresas exigirá reavaliar ordem de stacking.

**Correção mobile:** seis cards altos podem exceder `100svh` devido ao conjunto de itens e galeria. Uma pilha CSS sticky nesses casos sobrepunha elementos do próximo card, confundindo os painéis; o breakpoint `max-width:767px` desativa sticky apenas nos cards (`position:relative`), mantendo a barra de empresas sticky. Desktop conserva o efeito solicitado. Verificar o deploy do commit `6cfe4d04` ou posterior.

## Interatividade visual de Ferramentas, carreira e contato — 26/10/2026

`src/components/public/ToolIcons.tsx` contém os pictogramas SVG autocontidos das ferramentas, sem dependências externas, fontes de ícones ou carregamento por rede. `ContentItem.toolIcons` é validado por `validateContentItems`; `ItemCard` injeta o cluster quando o campo existe. CSS escopado a `#ferramentas` estabelece fundo/tipografia sem afetar outras seções.

Os itens de carreira de `ProfileDesktop` e `MobilePanel` reutilizam `ItemCard` com `targetSlug` somente quando o slug pertence à lista de seções publicadas. A classe `area-card-link` acrescenta hover e foco acessível. Os cinco cards temáticos (índices 0–4) mantêm `resolveHeroCardDestination` e o estado `selectedTheme` anteriores, sem regressão.

`#contato .contact-link` ganha CSS de cor de título e valor em hover/foco. Nenhum JavaScript adicional nem modificação da navegação externa foi necessária. A persistência dos ícones e dos destinos acontece nos blocos existentes de `content_json` via RPC do admin, sem schema novo.

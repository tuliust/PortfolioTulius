# CMS administrativo — contrato vigente

**Contrato revisado em 07/11/2026:** as correções de rótulos, áreas visuais e gerenciamento de depoimentos estão registradas em [Ajustes do Editor](AJUSTES_ADMIN_AREAS_DEPOIMENTOS_2026-11-07.md). A homologação anterior das Etapas 1–5 está em [relatório específico](HOMOLOGACAO_CMS_ETAPA5_2026-11-07.md). A auditoria P3 pública continua independente e com pendências conhecidas.

**Atualização P2 em 08/11/2026:** os metadados públicos de `media_assets` passam a resolver os textos alternativos das imagens nos painéis desktop/mobile na leitura do site. O Editor ganhou confirmação de gravação e proteção de concorrência para textos Hero e metadados administrativos. A gravação de seções, blocos e placements **ainda não constitui uma única transação SQL entre tabelas**; o RPC atual é atômico somente para bloco e placements. Esta limitação exige atenção na homologação e não deve ser apresentada como atomicidade integral.

Este documento descreve a interface **atual** e suas limitações, não a cronologia de cada implementação. A versão integral anterior, com decisões, métricas, screenshots citados e evidências, foi preservada em [CMS antes da reorganização](historico/ADMIN_CMS_ANTES_REORGANIZACAO_2026-11-05.md).

## Acesso e estrutura

O CMS está em `/admin`, com autenticação Supabase Auth e conferência do papel administrativo; a prévia protegida permanece sob `/admin/preview`. Áreas: **Visão geral, Editor do site, Identidade, Mídia, Navegação, SEO, Revisões e Prévia**. O site público e o editor são consumidores distintos do conteúdo Supabase. Erros de rede devem ser apresentados como erro, nunca como sucesso inventado.

- **Editor do site:** lista lateral de seções e experiências. **Informações da seção** e **Conteúdo** estão na mesma página, sem abas de Acervo. Em **Olá!, Resultados e Experiências**, seletores **Esquerda / Centro / Direita** apontam para os campos e blocos existentes, sem criar novos registros. Nas Experiências, o Centro oferece acesso aos projetos dos blocos A e B.
- **Seções:** ajustar conteúdo, ordem e visibilidade pelos controles existentes; indicadores da lista mostram `Publicado` ou `Oculto`. As ações **Nova seção**, **Duplicar seção** e **Publicar seção** não são oferecidas nessa interface; o botão de ação passa a ser **Salvar**. A ausência desses controles **não elimina RPCs ou dados** do banco.
- **Blocos e itens existentes:** editar conteúdo, ordem, placements e campos específicos. **Novo bloco** e **Adicionar item** foram retirados da interface, sem apagar itens preexistentes. O estado `is_placeholder` segue preservado nas gravações.
- **Salvamento:** o Editor usa o registro de ações pendentes e a ação agregada **Salvar**, com proteção de rascunho e mensagens acessíveis. O Hero valida o snapshot original dos seus textos e usa comparação de `updated_at` antes de confirmar a atualização; textos isolados não provocam regravação do bloco. Bloco e placements permanecem na RPC `save_content_block_atomic`. **Falha depois de uma gravação parcial é sinalizada** e exige conferência do administrador; salvar seções, blocos e trajetória ainda envolve operações distintas, não uma transação PostgreSQL única entre todas essas tabelas.
- **Depoimentos:** os registros da tabela original `testimonials` são editados em **Editor do site → Depoimentos → Gerenciar depoimentos**, com pessoa, cargo, texto, ordem, publicação e criação de registro; permanece a proteção de rascunhos e a confirmação de salvamento. **Acervo Estruturado foi retirado do menu**, sem exclusão de tabelas, vínculos ou conteúdo. A trajetória profissional permanece dentro da seção de cada empresa.
- **Identidade:** rótulos e controles de formulário usam agora a mesma tipografia administrativa de **Informações da seção**, sem alterar as famílias ou o CSS do site público.

## P3 — modularização incremental do painel (08/11/2026)

A refatoração da P3 preservou as rotas, a hierarquia dos formulários, os textos, as classes CSS, os payloads e os contratos de Supabase. O arquivo `src/components/admin/AdminModules.tsx` passou de **5.076 para 2.679 linhas** (redução aproximada de 47%). Os nove módulos extraídos conservam o comportamento dos editores anteriores:

- **Edição visual:** `AdminVisualFields.tsx` (controles numéricos e de cor compartilhados), `DeviceStyleEditors.tsx` (desktop/mobile) e `ProfileMobileEditorialEditor.tsx` (abertura editorial mobile).
- **Mídia e conteúdo vinculado:** `EnhancedMediaLibrary.tsx`, `CollectionsStudio.tsx` e `CareerTrajectoryEditor.tsx`.
- **Configurações globais e histórico:** `NavigationStudio.tsx`, `SeoStudio.tsx` e `EditorialStudio.tsx`.

`AdminModules.tsx` conserva `ContentStudio` e **reexporta os módulos auxiliares**, mantendo a API já utilizada por `AdminApp.tsx`. Nenhum registro foi duplicado nem houve migration, mudança de RLS, alteração de Storage ou reconfiguração da Vercel. O registro de salvamento agregado dos editores Navegação e SEO passou a considerar seu estado `dirty`, evitando gravações de formulários não alterados.

Os contratos de renderização dos controles visuais possuem quatro testes em `src/components/admin/admin-visual-editors.test.tsx`, cobrindo limites numéricos, campos desktop/mobile, opções específicas do Hero e as três áreas editoriais da abertura mobile. **O build Vercel por commit não substitui `pnpm check`**, e os testes funcionais com login administrativo, salvar/reabrir e comparação visual em dispositivos reais seguem previstos para a P4. A limitação de atomicidade entre `sections` e `content_blocks` identificada na P2 também permanece documentada.

## Seis experiências — projetos, slides e Trajetória

As seis empresas preservam seus IDs/associações com `sections`, `content_blocks` e `career_experiences`. **Projetos e realizações**, slides editoriais, competências e texto integral da Trajetória têm fontes distintas; não copiar o texto integral da coleção para os blocos JSON.

- O título **Slides relacionados aos projetos** possui um botão de informação. A orientação extensa sobre associação por título, visibilidade dos itens, ordem e indicadores aparece no tooltip acessível, acionável por mouse ou clique. A antiga observação redundante sobre resumos e o botão **Editar trajetória completa (Coleções)** foram retirados.
- O **formulário de Trajetória** está dentro da edição da experiência e contempla **Empresa, Cargo, Local, Início, Fim, Ordem, Status e Descrição** com formatação (bullets, negrito, itálico e sublinhado).
- Os campos da Trajetória persistem na **linha original de `career_experiences`**. O salvamento condicional com `updated_at` busca impedir sobrescrita simples de alterações concorrentes; divergências precisam ser tratadas sem declarar sucesso.
- O vínculo da linha à seção é resolvido por ID/slug conhecido; nenhuma duplicação da descrição em `content_blocks` deve ser introduzida. **A leitura autenticada de produção foi homologada; gravações de teste continuam restritas ao ambiente local sintético, para preservar os dados publicados.**

## Mídia e metadados

- A **Biblioteca de Mídia** concentra a edição de **texto alternativo, título e enquadramento/zoom** do arquivo. O Editor de Seções não deve voltar a oferecer campos locais de texto alternativo nem os controles locais de enquadramento retirados.
- A seleção de imagens usa diálogo/modal; os arquivos existentes só são trocados mediante seleção confirmada. O site público consulta os `media_assets` publicados do bucket `portfolio-public` sem bloquear o primeiro quadro. `src/lib/media-alt-sync.ts` aplica o `alt_text` canônico a `item.alt`, `aboutDesktopAlt`, `hero.mobileEditorial.mobileAlt`, `logoAlt` e `slide.alt` na composição **desktop e mobile**. As cópias históricas nos JSONB **não são regravadas**: se a consulta ao catálogo falhar, prevalece o texto alternativo salvo no próprio bloco. URLs privadas/externas não são alteradas. Se a página já estava aberta antes de uma edição, é necessário recarregá-la para consultar os metadados atualizados.
- Novos uploads utilizam o fluxo de publicação no bucket público e catálogo `media_assets` publicado. A exclusão confirmada deve limpar referências via RPC e depois remover objeto físico no Storage; essas etapas **não formam uma única transação atômica** com o banco. Existem proteções para retratos com referência estática. **Não realizar exclusão real de produção para teste documental.**
- Imagens e metadados anteriores, inclusive créditos preservados em banco, não foram removidos pela reorganização da documentação.

## Outras áreas

- **Navegação:** os 14 registros do snapshot estavam `published`; não oferecer seletor de status editável. Visibilidade individual e publicação não são conceitos equivalentes.
- **SEO:** o CMS armazena metadados, mas título, descrição, Open Graph, canonical e sitemap estáticos são publicados no **build seguinte**, por `scripts/generate-seo.mjs`. Domínio verificado: `https://tulius.work/`.
- **Identidade e transições:** respeitar tokens e presets existentes; alterações de design só com pedido explícito.
- **Revisões:** o histórico de `content_revisions` é preservado. A recuperação assistida é limitada aos campos permitidos e condicionada a confirmação; não implica rollback de objetos do Storage.
- **Prévia:** página administrativa separada, com seleção Desktop/Mobile. O iframe mobile é limitado a **390 px de largura** e usa proporção **390:844**; não reproduz barras do sistema nem substitui ensaio em iPhone real.

## Validação e limites de aceite

| Evidência | Status verificável |
|---|---|
| [`Validate 42020574434`](https://github.com/tuliustsangaropulos/PortfolioTulius/actions/runs/42020574434), SHA `79aa3c07` | **Aprovado**: formatação, TypeScript, testes, build, smoke e sintaxe |
| Vercel produção / `tulius.work/p3-deployment.json` no momento da auditoria | **READY** / SHA `79aa3c07` |
| [`Audit P3 42020342275`](https://github.com/tuliustsangaropulos/PortfolioTulius/actions/runs/42020342275), SHA `0873eeff` | **Reprovado**: navegador/responsividade e orçamento de performance; **não equivale** a uma P3 do SHA `79aa3c07` |
| P2 — teste isolado de `media-alt-sync.ts` (13 asserções) e integridade de 28 blocos / 56 placements por SQL read-only | **Aprovado**: sem inconsistências de desktop/mobile no snapshot |
| P2 — testes integrados com JWT administrativo, `pnpm check` e alterações de mídia no ambiente sintético local | **Não executados nesta rodada** |
| Editar/Salvar/Recarregar, upload e exclusão com JWT administrativo real | **Não homologados nesta rodada** |

O aceite administrativo de [05/11/2026](ENCERRAMENTO_OPERACIONAL_2026-11-05.md) é histórico e não converte esses ensaios não executados em aprovação técnica. Para dúvidas sobre status recente, consultar [Estado vigente](ESTADO_ATUAL_VIGENTE.md), [verificações técnicas](OPEN_ISSUES.md) e [histórico integral](historico/ADMIN_CMS_ANTES_REORGANIZACAO_2026-11-05.md).


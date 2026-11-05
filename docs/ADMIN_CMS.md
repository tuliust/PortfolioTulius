# CMS administrativo — contrato vigente

**Conferência do código funcional:** [`79aa3c07`](https://github.com/tuliustsangaropulos/PortfolioTulius/commit/79aa3c07ce6c9106b1d504c1f574731bf70fb5d2), em 05/11/2026. [CI Validate aprovado](https://github.com/tuliustsangaropulos/PortfolioTulius/actions/runs/42020574434). **Não é homologação de gravações reais com sessão administrativa.**

Este documento descreve a interface **atual** e suas limitações, não a cronologia de cada implementação. A versão integral anterior, com decisões, métricas, screenshots citados e evidências, foi preservada em [CMS antes da reorganização](historico/ADMIN_CMS_ANTES_REORGANIZACAO_2026-11-05.md).

## Acesso e estrutura

O CMS está em `/admin`, com autenticação Supabase Auth e conferência do papel administrativo; a prévia protegida permanece sob `/admin/preview`. Áreas: **Visão geral, Editor do site, Identidade, Mídia, Navegação, SEO, Revisões e Prévia**. O site público e o editor são consumidores distintos do conteúdo Supabase. Erros de rede devem ser apresentados como erro, nunca como sucesso inventado.

- **Editor do site:** lista lateral das seções e experiências; o cabeçalho da seleção concentra as abas compactas **Editar seção** e **Acervo estruturado**, à direita inferior do box. `Informações da seção` e `Conteúdo e painéis` aparecem na mesma página de edição.
- **Seções:** ajustar conteúdo, ordem e visibilidade pelos controles existentes; indicadores da lista mostram `Publicado` ou `Oculto`. As ações **Nova seção**, **Duplicar seção** e **Publicar seção** não são oferecidas nessa interface; o botão de ação passa a ser **Salvar**. A ausência desses controles **não elimina RPCs ou dados** do banco.
- **Blocos e itens existentes:** editar conteúdo, ordem, placements e campos específicos. **Novo bloco** e **Adicionar item** foram retirados da interface, sem apagar itens preexistentes. O estado `is_placeholder` segue preservado nas gravações.
- **Salvamento:** o Editor usa o registro de ações pendentes e a ação agregada **Salvar**, com proteção de rascunho e mensagens acessíveis. Salvar seções, blocos e trajetória envolve **operações persistentes distintas**, e não uma transação PostgreSQL única entre todas essas tabelas. Não afirmar persistência sem sucesso do backend.
- **Acervo estruturado:** continua disponível para editar coleções, quando cabível; o formulário de trajetória da experiência está embutido no editor da própria empresa, sem necessidade do antigo atalho para Coleções.

## Seis experiências — projetos, slides e Trajetória

As seis empresas preservam seus IDs/associações com `sections`, `content_blocks` e `career_experiences`. **Projetos e realizações**, slides editoriais, competências e texto integral da Trajetória têm fontes distintas; não copiar o texto integral da coleção para os blocos JSON.

- O título **Slides relacionados aos projetos** possui um botão de informação. A orientação extensa sobre associação por título, visibilidade dos itens, ordem e indicadores aparece no tooltip acessível, acionável por mouse ou clique. A antiga observação redundante sobre resumos e o botão **Editar trajetória completa (Coleções)** foram retirados.
- O **formulário de Trajetória** está dentro da edição da experiência e contempla **Empresa, Cargo, Local, Início, Fim, Ordem, Status e Descrição** com formatação (bullets, negrito, itálico e sublinhado).
- Os campos da Trajetória persistem na **linha original de `career_experiences`**. O salvamento condicional com `updated_at` busca impedir sobrescrita simples de alterações concorrentes; divergências precisam ser tratadas sem declarar sucesso.
- O vínculo da linha à seção é resolvido por ID/slug conhecido; nenhuma duplicação da descrição em `content_blocks` deve ser introduzida. **Não houve ensaio de edição, salvar e recarregar com credenciais reais nesta rodada.**

## Mídia e metadados

- A **Biblioteca de Mídia** concentra a edição de **texto alternativo, título e enquadramento/zoom** do arquivo. O Editor de Seções não deve voltar a oferecer campos locais de texto alternativo nem os controles locais de enquadramento retirados.
- A seleção de imagens usa diálogo/modal; os arquivos existentes só são trocados mediante seleção confirmada. Há valores legados de alt copiados para JSON nos blocos (`item.alt`, `logoAlt`, `slide.alt` e correlatos). **Editar alt na Biblioteca não tem sincronização retroativa comprovada** com todas essas cópias; não declarar fonte única materializada sem testar.
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
| Editar/Salvar/Recarregar, upload e exclusão com JWT administrativo real | **Não homologados nesta rodada** |

O aceite administrativo de [05/11/2026](ENCERRAMENTO_OPERACIONAL_2026-11-05.md) é histórico e não converte esses ensaios não executados em aprovação técnica. Para dúvidas sobre status recente, consultar [Estado vigente](ESTADO_ATUAL_VIGENTE.md), [verificações técnicas](OPEN_ISSUES.md) e [histórico integral](historico/ADMIN_CMS_ANTES_REORGANIZACAO_2026-11-05.md).


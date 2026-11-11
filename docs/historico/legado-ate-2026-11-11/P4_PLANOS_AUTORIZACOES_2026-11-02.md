# P4 — Planos aprovados para preparação, ainda não para implantação

## A. Staging isolado com dados fictícios

Já existem `.github/workflows/p2-transactional-staging.yml` (**manual**, `workflow_dispatch`) e `scripts/p2-transactional-staging.mjs`: validam ref diferente de produção (`zfnrhzplwpjpdljraypt`), URL igual ao ref e confirmação `CONFIRMO-HOMOLOGACAO-ISOLADA`. Testam com contas artificiais admin/não admin, operações de páginas/blocos e pixel PNG sintético, registrando cleanup. **Não foram executados nesta etapa**.

O `supabase/seed.sql` atual contém **conteúdo editorial real/histórico**: ele **não** atende à escolha de dados inteiramente fictícios.

Proposta: (1) decidir entre ambiente Supabase local com CLI/Docker ou projeto de staging separado, após avaliar custo; (2) revisar migrações em ambiente isolado; (3) criar fixture fictícia **independente** do `seed.sql` editorial; (4) criar duas contas artificiais e buckets de staging; (5) guardar segredos específicos no GitHub; (6) validar/reforçar testes de CRUD, revisão, arquivamento, publicação, RLS e mídia; (7) executar manualmente apenas após autorização adicional e evidências de que não há dados ou URL de produção. **Não executar `db reset --linked` no projeto real**.

Fontes: https://supabase.com/docs/guides/local-development/cli-workflows e https://supabase.com/docs/guides/deployment.

## B. Publicação automática e segura do SEO

Atualmente `scripts/generate-seo.mjs` gera HTML/meta/canonical/robots/sitemap no **build**. A paridade 8/8 do CMS com o HTML foi verificada, mas um salvamento isolado ainda **não** força nova publicação estática.

Arquitetura proposta (não instalada): depois de uma transação de **publicação deliberada** de SEO, um serviço **server-side** autentica o JWT e a associação de administrador, verifica versão publicada, aplica idempotência/limite de frequência e aciona deploy de escopo mínimo. O segredo de deploy fica exclusivamente em variável protegida do servidor (nunca `VITE_*` ou browser). Registrar disparo/resultado e validar SHA servido e 8 campos SEO depois do deploy. Falha de deploy deve produzir status explícito e possibilidade de retentativa sem prometer atualização. Rascunhos não disparam.

Precisa de aprovação separada para criar componente servidor e configurar integração Vercel/GitHub e credenciais.

## C. Segurança — somente plano

Advisors anteriores: 6 RPCs `SECURITY DEFINER` executáveis por `authenticated`; 19 sobreposições permissivas; 9 índices sem uso estatístico; proteção contra senhas vazadas desabilitada. A auditoria anterior verificou guarda interna de administrador nas RPCs; **não** revogar acesso `authenticated` sem alternativa funcional.

Ordem: examinar grants e `search_path`; validar admin, usuário autenticado comum e anônimo **com contas distintas em staging**; medir equivalência de RLS antes de propor consolidação; analisar índices com planos de execução e histórico; planejar proteção de senha e rollback; revisar segredos, branch e workflows. Cada mudança exige aceite específico. **Nenhuma configuração alterada**.

## D. LCP — ajustes exclusivamente técnicos e medidos

**Meta revisada pelo proprietário em 02/11/2026: LCP mobile ≤3,5 s (3.500 ms)**, mediana de três execuções Lighthouse. A mediana mais recente registrada **3,386 s** atende ao novo limite no [ensaio de 02/11/2026](https://github.com/tuliustsangaropulos/PortfolioTulius/actions/runs/41518032045); não equivale a ganho de código nem comprovação p75 de campo. Não alterar fotografia, fonte, recorte, animações/editoria ou layout.

Executar experimentos isolados (ordem de carregamento não visual, JavaScript não crítico, redução de requisições redundantes e cache com invalidação após publicar) apenas com baseline e candidato comparáveis; validar em CI, navegador, P3/P4/P5 e 38 capturas; rejeitar qualquer regressão. Não declarar meta atendida com uma única medição favorável. **Nenhum ajuste visual aplicado nesta etapa**.

## E. Experiências e fotografias

**Escopo confirmado pelo proprietário:** as seis experiências deverão considerar o mesmo conjunto de campos adicionais: empresa, cargo, localização, período, projetos/realizações e fotos/logos/galerias. A descrição já vinculada permanece. Esta aprovação de **escopo** não equivale à aprovação dos valores de cada campo nem à inclusão de novas mídias.

`career_experiences` possui `company`, `role`, `location`, `start_date`, `end_date` e `description`. `portfolio_projects` relaciona projetos por `experience_id`. Fotos/logos/galerias ainda residem em `content_json` da apresentação: não existem colunas equivalentes em `career_experiences`. A descrição já usa vínculo estável aos seis IDs, em `src/lib/career-record-link.ts`. Não sincronizar mídias por coincidência de nome/ordem.

Depoimentos: Matheus Gomes (`ad029e66-9797-48bc-bb72-17b98004afcc`) usa `/media/matheus-gomes.jpg`; Ana Beatriz Neves (`e91e17ac-28f9-46e6-bc0f-4f5465bd3975`) usa `/media/ana-beatriz-neves.jpg`; Fábio Seixas (`03bd38d3-609d-4f99-85c6-b6c3f820960f`) usa `/media/fabio-seixas.jpg`. O proprietário confirmou essas correspondências. Os três arquivos existem em `public/media/` no GitHub; **nenhum caminho equivalente foi encontrado em `media_assets.storage_path`** e `photo_media_id` permanece nulo. Para vincular por ID: propor ingestão dos mesmos bytes para Storage/registro de mídia, verificar fidelidade e depois aprovar cada ID, sem substituir os arquivos usados no site. **Nenhuma ingestão, upload ou vínculo realizado**.


## F. Formação/A — contrato de prévia aprovado, sem gravação

Para os três registros, `meta=A` preserva a versão curta publicada do período e `text=B` acrescenta o nome completo da instituição. A função `src/lib/formation-pilot-preview.ts` compõe a prévia usando os IDs editoriais aprovados e falha se a fonte ou o bloco original divergir. **Não está integrada ao fluxo público nem vinculada ao bloco.** Antes de aplicar, revisar [prévia de conteúdo](P4_PILOTO_FORMACAO_A_2026-11-02.md) e homologar a renderização real no CMS/desktop/mobile; aplicar apenas com autorização individual posterior.

## G. Preparação segura adicional de staging — verificação do destino

Foi adicionada `scripts/p2-stage-destination.mjs`, reutilizada por `scripts/p2-transactional-staging.mjs`, e uma verificação anterior à instalação de dependências no workflow exclusivamente manual `.github/workflows/p2-transactional-staging.yml`. O teste local `scripts/p2-stage-destination.check.mjs` inclui cinco cenários, entre eles recusa do **projeto de produção conhecido**, HTTPS/hostname estritos e frase de confirmação exata. [CI da guarda](https://github.com/tuliustsangaropulos/PortfolioTulius/actions/runs/41514624001). Isso **não prova** que qualquer novo ref seja ambiente isolado: validar a propriedade e a ausência de dados reais manualmente antes de execução. Nenhum projeto foi provisionado e o workflow transacional não foi disparado.

## H. Decisão posterior do proprietário — staging exclusivamente local

A alternativa escolhida é **Supabase local com Docker/CLI**, **sem segundo projeto cloud**. A comparação inicial de alternativas na seção A acima é histórica e foi decidida. `supabase/config.toml` usa somente `seed.local.synthetic.sql` (fictício), mantendo `seed.sql` real fora dos testes; scripts verificam loopback, preflight e RLS anônimo em modo leitura. A execução real da stack **não ocorreu neste ambiente**, por ausência de Docker e CLI. [Guia de execução local](SUPABASE_STAGING_LOCAL_ISOLADO_2026-11-02.md) · [meta LCP vigente](DECISOES_LCP_3_5_STAGING_LOCAL_2026-11-02.md).

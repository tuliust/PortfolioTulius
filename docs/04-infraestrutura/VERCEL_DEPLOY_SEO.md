# Vercel, publicação e SEO

## Reconfirmação de produção — 18/11/2026

A Vercel confirmou o deployment Production
`dpl_HhgHMZBhB3LeT3FKAUBLY4ichQPH` em **READY**,
vinculado à branch `main` do repositório
`tuliust/PortfolioTulius`, no SHA
`df689be1ec699ee823515d2807540452fd79c7e7`.

No GitHub, os workflows Validate e Export Docs
encerraram **SUCCESS** nesse SHA. Trata-se de um
commit documental posterior ao código funcional
dos PDFs Desktop e Mobile (`609218b`).

Essa verificação não constitui uma nova execução
da auditoria P3/Lighthouse nem comprova correção
do LCP mobile. A última falha conhecida permanece
registrada e aceita como risco residual.

Nenhum deploy manual, alteração de DNS, variáveis
de ambiente ou configuração da Vercel foi realizado
nesta conferência.

---

## Publicação confirmada da versão funcional do PDF — 18/11/2026

O deployment Vercel Production **`dpl_55JJGRMED7dnCtrTu9L3rKsSDTh3` está READY** para `main@609218bd2bfede558f22c44002e62e9e21b2aada`; Validate, PDF Renderer QA e P5 read-only encerraram **SUCCESS** nesse SHA (P5 no segundo attempt). O proprietário aceitou os PDFs reais Desktop e Mobile. [Contrato PDF e evidências](../05-operacao/EXPORTACAO_PDF.md).

Um commit **somente Markdown** pode disparar novo deployment pela integração Git/Vercel. Conferir o novo SHA separadamente após este registro; **não** realizar deploy manual nem alterar DNS ou configuração. Os deployments dos parágrafos de 13–16/11 abaixo são históricos.

---

**Status:** contrato operacional · **Revisão:** 16/11/2026. As evidências de 13/11 foram preservadas como históricas; ver a publicação confirmada abaixo.

## Estado mais recente de publicação — 16/11/2026

No SHA [`8ed19b0`](https://github.com/tuliust/PortfolioTulius/commit/8ed19b098349e882f7c7dbb9b926114b6451e17e), [P3 #43846278955](https://github.com/tuliust/PortfolioTulius/actions/runs/43846278955) confirmou **navegador/responsividade PASS (0 falhas)** após corrigir as duas assertivas obsoletas de quatro para **cinco projetos**, e **38 capturas PASS**, projeto ↔ galeria, troca Trajetória/Projetos, rotas admin anônimas, SEO, RLS e tolerância parcial de leitura pública. O marcador `P3_DEPLOYMENT_GATE` confirmou o SHA servido em produção. Entretanto, **P3 global = FAILURE exclusivamente no orçamento mobile**: LCP mediano **3.649,202 ms** (meta **≤3.500 ms**); desktop **895,144 ms** (PASS). [Validate #43846279093](https://github.com/tuliust/PortfolioTulius/actions/runs/43846279093) e [Export Docs #43846279061](https://github.com/tuliust/PortfolioTulius/actions/runs/43846279061) foram **SUCCESS**; Vercel production `dpl_9Ti9ghY6ZC6tJ2DbCmT6Wg9L8XUm` estava **READY**. O proprietário **encerrou a revisão editorial** e aceitou o risco residual, sem considerar o LCP corrigido nem reclassificar o workflow como SUCCESS. Não houve mudança de Hero, Olá, conteúdo público ou banco nesta correção de teste.

Este registro pertence ao deployment `8ed19b0`. Um futuro commit somente documental pode produzir novo deployment Vercel automaticamente e deve ser lido por seu próprio SHA; não usar READY como sinônimo de P3 SUCCESS. Não houve deploy manual nem mudança em domínio, DNS ou configuração.

## Identificação
- Projeto `portfolio-tulius`, ID `prj_FVB5Cnk3428OSrWhEyskoqhWOCVW`, equipe `tuliust` (ID `team_lhnlR7FccWqxK1lK8HTem57S`).
- Vite, `pnpm build`, saída `dist`; domínios `tulius.work` (verificado) e `www.tulius.work`.
- Deployment histórico da baseline `0627947`: `dpl_JAMsVoXAsrQHAAzDE7aEKjt6rY5E` READY. Para versão pública atual, consultar o marcador SHA servido no domínio e a auditoria correspondente, sem reutilizar o ID de 11/11.
- Variáveis cifradas para Development/Preview/Production: `VITE_SUPABASE_URL` e `VITE_SUPABASE_PUBLISHABLE_KEY`; registrar nomes, não valores.

## Publicação da revisão editorial concluída — 16/11/2026

A consulta autenticada da Vercel confirmou deployment **`dpl_5BmipgLgR4BRdcVJTy6X6kghV9vN` = READY**, ambiente `production`, branch `main`, SHA `ad5863c0dbb1386d41482a6d9bbe9dc9a9ba60fc`. Foi um commit **documental** após código funcional `aeffc5f`; [Validate #43843735514](https://github.com/tuliust/PortfolioTulius/actions/runs/43843735514) e [Export #43843735639](https://github.com/tuliust/PortfolioTulius/actions/runs/43843735639) têm **SUCCESS** para `ad5863c`; [Validate #43842658739](https://github.com/tuliust/PortfolioTulius/actions/runs/43842658739) **SUCCESS** para `aeffc5f`. O [P3 #43842659962](https://github.com/tuliust/PortfolioTulius/actions/runs/43842659962) de `aeffc5f` **FAILURE**, com duas assertivas obsoletas de quatro projetos e LCP mobile **3.609,314 ms** acima da meta 3.500 ms. Nenhuma evidência transforma READY em P3 SUCCESS.

O proprietário encerrou e aceitou a revisão editorial com risco residual conhecido. Não houve deploy manual, mudança de domínio, variáveis ou flags para esta auditoria. Para novos pushes, consultar Vercel por SHA e registrar estado atualizado, sem inferir a partir do deployment de `ad5863c`.

## Publicação efetivamente verificada após a transferência — histórico anterior à revisão de Experiências (16/11/2026)

A auditoria [P3 #43817188772](https://github.com/tuliust/PortfolioTulius/actions/runs/43817188772) confirmou `P3_DEPLOYMENT_GATE sha=9915964f54a37d209b25c778c6d2c50faddf4f77 production=verified` em `https://tulius.work/`. O GitHub `main` apontava para o mesmo SHA na consulta de 16/11, com [Validate #43817188756](https://github.com/tuliust/PortfolioTulius/actions/runs/43817188756) e [Export Docs #43817188776](https://github.com/tuliust/PortfolioTulius/actions/runs/43817188776) **SUCCESS**. P3 **SUCCESS**, LCP mobile mediano de **3.458,135 ms** (limite 3.500 ms). O teste prova entrega pública do SHA, **não comprova uma leitura recente do ID/status READY pela API administrativa da Vercel**.

O diagnóstico da integração em 13/11 tinha divergência de metadados antigos e consulta por API sem resultado conclusivo. Os pushes legítimos posteriores mostram que o caminho de publicação está funcional. **Não** reconectar Git, recriar deployment, alterar DNS, variáveis ou equipe apenas para eliminar metadados históricos. Para status/IDs de deployment individual, consultar Vercel com acesso apropriado. [Testes por SHA](../05-operacao/TESTES_E_HOMOLOGACAO.md) · [integrações](../06-governanca/CONFIGURACOES_E_INTEGRACOES.md).

**Commit documental posterior:** [`06af944`](https://github.com/tuliust/PortfolioTulius/commit/06af9444955297a6ee93c9934b369598198afd69) teve [Validate #43825442272](https://github.com/tuliust/PortfolioTulius/actions/runs/43825442272) e [Export Docs #43825442281](https://github.com/tuliust/PortfolioTulius/actions/runs/43825442281) **SUCCESS**, além de status GitHub **Vercel: success / deployment completed** para esse SHA. Isso confirma a integração de publicação segundo o provedor; **não houve P3 Lighthouse novo no SHA documental**. A última comprovação independente do SHA efetivamente servido pela P3 continua sendo `9915964`. Não atribuir a `06af944` o LCP medido no SHA anterior.

## Código e publicação
[`vercel.json`](../../vercel.json) contém SPA rewrite, cache imutável de assets e cabeçalhos `X-Robots-Tag: noindex` para `/admin`. `src/main.tsx` separa o carregamento público da rota admin.

[`scripts/generate-seo.mjs`](../../scripts/generate-seo.mjs) converte informações de `pages` e `site_settings` em título, descrição, Open Graph, canonical, robots e sitemap **durante build**. Salvar SEO no admin **não** atualiza HTML automaticamente: é preciso novo build/deploy.

## Verificar uma publicação
1. Registrar SHA, diff, target e deployment READY.
2. Conferir o SHA **efetivamente servido** em [`p3-deployment.json`](https://tulius.work/p3-deployment.json).
3. Validar CI específico daquele SHA: Validate, P3/browser/LCP/SEO/RLS, P5 conforme escopo.
4. Não confundir READY com CI integral; LCP mediano acima de **3.500 ms** é gate FAILURE mesmo quando o risco foi aceito pelo proprietário.

Não modificar DNS, variáveis, aliases ou deploy manualmente para realizar revisão documental.

[Testes](../05-operacao/TESTES_E_HOMOLOGACAO.md) · [configurações](../06-governanca/CONFIGURACOES_E_INTEGRACOES.md).

## Favicon persistido (12/11/2026)

`index.html` inicia com `/favicon.png` e `/apple-touch-icon.png` para não depender do CMS no primeiro paint. `src/hooks/usePortfolio.ts` aplica a seleção publicada `site_settings.seo_json.faviconUrl` durante a leitura diferida dos metadados; `scripts/generate-seo.mjs` espelha o mesmo valor nos links HTML do build. Um novo upload/escolha de favicon no admin é persistido no Supabase imediatamente ao salvar SEO, mas os links HTML usados por crawlers e atalhos móveis só ficam atualizados **após nova publicação**. Em indisponibilidade de banco, o HTML mantém os dois ícones estáticos aprovados. Nenhuma variável de ambiente ou domínio novo foi necessário.

## Publicação dos ajustes desktop — 12/11/2026

O commit funcional [`ebda0aab`](https://github.com/tuliustsangaropulos/PortfolioTulius/commit/ebda0aabda776a8513cad963df184199ed0a6e53) inclui a tipografia/posicionamento desktop e correção do selo. O job [P3 #43197029431](https://github.com/tuliustsangaropulos/PortfolioTulius/actions/runs/43197029431) verificou **`P3_DEPLOYMENT_GATE MATCH`** para esse SHA efetivamente servido em `https://tulius.work`. A Vercel reportou status de commit **success** ao GitHub, e nenhum ajuste de DNS, projeto, domínio, secret ou configuração de deploy foi necessário.

**Não confundir deploy com homologação integral:** [Validate #43197029438](https://github.com/tuliustsangaropulos/PortfolioTulius/actions/runs/43197029438), [P5 Admin Read-Only #43197029455](https://github.com/tuliustsangaropulos/PortfolioTulius/actions/runs/43197029455) e [Export Docs #43197029494](https://github.com/tuliustsangaropulos/PortfolioTulius/actions/runs/43197029494) foram **SUCCESS**; o P3 foi **FAILURE** somente no gate de LCP mobile, mediana **3.670,965 ms** contra limite **3.500 ms**. O LCP desktop foi **899,800 ms**, e navegador/SEO/RLS passaram. O commit exclusivamente documental posterior [`0926e6af`](https://github.com/tuliustsangaropulos/PortfolioTulius/commit/0926e6afe6068db5b8addacfe805f413bf534a9b) obteve [Validate SUCCESS](https://github.com/tuliustsangaropulos/PortfolioTulius/actions/runs/43198028076) e [Export Docs SUCCESS](https://github.com/tuliustsangaropulos/PortfolioTulius/actions/runs/43198028034); não extrapolar esses resultados para novo P3/P5. O status de deploy informado é evidência operacional por SHA, não motivo para criar deploy manual nesta documentação.

## Histórico de transferência Git/Vercel — auditoria de 13/11/2026

A auditoria de 13/11, anterior aos pushes pós-transferência, confirmou o projeto `portfolio-tulius` na equipe `tuliust`, os dois domínios com `verified=true` e as duas variáveis VITE cifradas nos três ambientes, **sem consultar valores**. O conector estava autenticado com a conta do proprietário, e a captura de *Project Settings → Git* mostrava `tuliust/PortfolioTulius` como repositório conectado.

Naquela data, o deployment `dpl_24KMLj6Q395ANdVFVaK8LoiuhQiP` estava **READY** para `9834fc3a05cf03e26336cea42f08498841b3b0f1`; o GitHub retornou `Vercel: success`. A API de contexto ainda exibia `tuliustsangaropulos/PortfolioTulius` e uma busca retornava `installation_not_found`: **inconsistência de metadados da API, não comprovação de falha de publicação**. Em 13/11 ainda faltava observar um push legítimo posterior; essa lacuna foi sanada pelos gates P3 e status Vercel de 16/11 documentados acima. Não há evidência de que os metadados legados tenham sido limpos administrativamente, e não é necessário reconectar o projeto por essa razão.

As verificações de `ebda0aab` em 12/11 também permanecem históricas: [P3 #43197029431](https://github.com/tuliust/PortfolioTulius/actions/runs/43197029431) confirmou o SHA servido, mas foi **FAILURE** no LCP mobile (3.670,965 ms). A documentação de 13/11 e os SHAs antigos não devem substituir a evidência de 16/11. [Testes](../05-operacao/TESTES_E_HOMOLOGACAO.md).

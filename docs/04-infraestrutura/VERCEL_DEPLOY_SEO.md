# Vercel, publicação e SEO
**Status:** contrato operacional · **Revisão:** 13/11/2026.

## Identificação
- Projeto `portfolio-tulius`, ID `prj_FVB5Cnk3428OSrWhEyskoqhWOCVW`, equipe `tuliust` (ID `team_lhnlR7FccWqxK1lK8HTem57S`).
- Vite, `pnpm build`, saída `dist`; domínios `tulius.work` (verificado) e `www.tulius.work`.
- Deployment do SHA auditado `0627947`: `dpl_JAMsVoXAsrQHAAzDE7aEKjt6rY5E` READY. Commits documentais posteriores geram novo SHA/deployment.
- Variáveis cifradas para Development/Preview/Production: `VITE_SUPABASE_URL` e `VITE_SUPABASE_PUBLISHABLE_KEY`; registrar nomes, não valores.

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

## Conector Vercel, propriedade e vínculo Git — verificação de 13/11/2026

- **Projeto preservado:** `portfolio-tulius`, ID `prj_FVB5Cnk3428OSrWhEyskoqhWOCVW`, na equipe `tuliust`; conector autenticado como `tuliust@gmail.com`. Ambos os domínios `tulius.work` e `www.tulius.work` retornaram `verified=true` e estão associados ao mesmo projeto.
- **Deployment observado antes desta atualização documental:** `dpl_24KMLj6Q395ANdVFVaK8LoiuhQiP`, produção `READY`, SHA `9834fc3a05cf03e26336cea42f08498841b3b0f1` na branch `main`. O GitHub retornou status de commit `Vercel: success` para o SHA. Essa evidência confirma a publicação histórica, não uma homologação integral de CI nem um novo deploy pós-transferência.
- **Configuração de ambiente:** `VITE_SUPABASE_URL` e `VITE_SUPABASE_PUBLISHABLE_KEY` presentes como variáveis cifradas nos alvos Development, Preview e Production; valores não acessados.
- **Integração Git — evidências diferentes:** a captura fornecida do painel *Project Settings → Git* mostra `tuliust/PortfolioTulius` como repositório conectado. A API de contexto ainda lista `tuliustsangaropulos/PortfolioTulius`; a busca de repositórios pela API retorna HTTP 400 `installation_not_found` mesmo quando o namespace `tuliust` aparece. Não desconectar/reconectar nem alterar projeto, DNS ou secrets por inferência dessa diferença.
- **Limite da verificação:** não houve novo push de `main` nem novo ensaio do webhook/deployment automático pós-transferência; a consulta ao endpoint público `p3-deployment.json` não foi homologada nesta auditoria. Um próximo push legítimo poderá fornecer evidência específica, sem criar commit artificial para testar. A homologação P3 do SHA funcional `ebda0aab` segue **FAILURE no LCP mobile**, conforme [testes](../05-operacao/TESTES_E_HOMOLOGACAO.md), independentemente de `READY`.

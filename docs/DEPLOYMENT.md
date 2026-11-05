# Publicação, SEO e verificações

**Contrato operacional — 05/11/2026.** A publicação do site acontece via integração **GitHub `main` → Vercel**, com build Vite. Não criar deploy manual, rollback, mudanças de domínio, projeto, autenticação ou infraestrutura apenas para atualizar a documentação. [Registro anterior completo](historico/DEPLOYMENT_ANTES_REORGANIZACAO_2026-11-05.md).

## Fonte única para identificar a versão ativa

1. Conferir o commit de `main` e, separadamente, qual SHA o domínio `https://tulius.work/p3-deployment.json` está realmente servindo.
2. Verificar o deployment de **Production READY** correspondente ao mesmo SHA na Vercel; `READY` não é equivalente a CI ou P3 aprovados.
3. Conferir [GitHub Actions Validate](https://github.com/tuliustsangaropulos/PortfolioTulius/actions/workflows/validate.yml) para o SHA correspondente.
4. Consultar separadamente o [workflow P3](https://github.com/tuliustsangaropulos/PortfolioTulius/actions/workflows/audit-p3-lighthouse.yml) quando executado. Distinguir falhas de navegador, Lighthouse, captura, SEO e as subseções P4/P5/P6.
5. Nenhuma dessas verificações substitui aprovação visual humana em dispositivo físico nem testes autenticados de gravação e exclusão.

**Baseline funcional verificado antes da reorganização documental:** [`79aa3c07`](https://github.com/tuliustsangaropulos/PortfolioTulius/commit/79aa3c07ce6c9106b1d504c1f574731bf70fb5d2), [Validate #42020574434](https://github.com/tuliustsangaropulos/PortfolioTulius/actions/runs/42020574434) **success**, deployment Vercel **READY**, alias apontando para o mesmo SHA. **P3 própria não localizada.** A última P3 localizada foi [#42020342275](https://github.com/tuliustsangaropulos/PortfolioTulius/actions/runs/42020342275), SHA `0873eeff`, **failure global**. Mudanças somente em Markdown podem criar **novo SHA em `main`** e disparar Vercel; não tratá-lo como uma nova versão funcional sem diff de aplicação.

## SEO

- O canonical de produção verificado é **`https://tulius.work/`**; `tuliust.work` foi citado por engano em pedido anterior e **não** foi confirmado como domínio associado ao projeto.
- O CMS grava valores de SEO, mas `scripts/generate-seo.mjs` gera HTML de título/descrição, OG, canonical, robots e sitemap **no build**.
- **Salvar SEO no CMS não modifica imediatamente HTML estático entregue aos robôs**. É necessário deployment do build atualizado, seguido de verificação de HTML/OG/canonical/sitemap na versão servida.
- Nenhuma atualização documental solicita ou autoriza dados fictícios de SEO, reconfiguração de DNS ou publicação de segredo.

## Proteções de integridade

- **Sem alterações de UI:** mudanças de documentação não devem modificar `src/`, `public/`, `index.html`, estilos, assets, tokens, Vite, Vercel, buckets, banco, RLS, Auth, migrations ou informações editoriais.
- **Sem degradação visual deliberada:** manter o design público atual exatamente como está; qualquer correção de P3 exige investigação específica e solicitação separada.
- **Limite da meta operacional:** LCP mobile ≤3,5 s (mediana de três testes sintéticos); não usar LCP de um SHA antigo como comprovação do mais recente.
- **Rastreabilidade:** registrar o commit de documentação separadamente do **baseline funcional**, sem renomear os históricos como “aprovados”.

[Estado atual](ESTADO_ATUAL_VIGENTE.md) · [Auditoria dos pedidos](AUDITORIA_PEDIDOS_CHAT_2026-11-05.md) · [Arquivo anterior de deployment](historico/DEPLOYMENT_ANTES_REORGANIZACAO_2026-11-05.md).


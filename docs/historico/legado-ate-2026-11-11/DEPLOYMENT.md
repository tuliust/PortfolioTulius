# Atualização operacional — P2/P4, 09/11/2026

> **Atualização de continuidade — 09/11/2026.** Este trecho prevalece sobre quaisquer snapshots datados abaixo. Código inicialmente auditado em `7e8d7f82`, agora incluindo correção de fallback P2 (`4e739dbf`), suíte de mídia sintética (`630fb712`) e experimentos de prioridade da consulta inicial de Perfil (`b3dc0a5f` e `93176222`). **Não foi aplicada migration nem houve escrita de ensaio no Supabase de produção.** A migration `20261109024100_p2_composite_section_block_save.sql` existe em Git, mas `public.save_section_block_atomic` está **ausente no banco produtivo** (SELECT em `pg_proc`); usar o caminho legado até autorização separada. Veja [relatório de execução](P2_P4_RELATORIO_EXECUCAO_2026-11-09.md), [plano de aceite](P2_P4_PLANO_ACEITE_2026-11-08.md) e [mapa CMS → renderer](MAPA_CAMPOS_CMS_RENDERER.md).

## Fluxo de deploy e aceite operacional
1. Consultar HEAD de `main` e `AGENTS.md`, diff e formato; GitHub→Vercel pode publicar qualquer commit, inclusive docs.
2. Confirmar Vercel Production `READY` e o SHA servido em `https://tulius.work/p3-deployment.json`; workflow Lighthouse recusa atribuir medições sem fingerprint igual ao SHA.
3. Conferir Validate e P5 Local Transactional (Docker + seed sintético), não executar testes de escrita contra produção.
4. Conferir três amostras mobile de Lighthouse e orçamento **≤3.500 ms** de mediana, desktop, SEO, browser e layout sem regressão.
5. SEO editorial gravado no CMS só aparece no HTML/canonical/robots/sitemap após novo build da integração Git; sem redeploy manual não autorizado.
6. A nova migration P2 **não pode** ser aplicada por `supabase link`, `db push`, `db pull` ou SQL remoto sem autorização expressa e plano de rollback. Não utilizar `supabase/seed.sql` legado.

---

## Documento anterior preservado para rastreabilidade

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


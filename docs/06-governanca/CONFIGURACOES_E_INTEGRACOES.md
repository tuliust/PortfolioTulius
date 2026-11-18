# Configurações, variáveis e integrações

## Conferência read-only — 18/11/2026

O código funcional PDF `main@609218b` foi validado e publicado no deployment Vercel Production **`dpl_55JJGRMED7dnCtrTu9L3rKsSDTh3` READY**. O Supabase `portfolio` (`zfnrhzplwpjpdljraypt`) retornou **ACTIVE_HEALTHY**; 22 tabelas `public` com RLS, 41 políticas e 12 migrations. Nenhuma variável real, segredo, chave, permissão, DNS ou configuração foi lida/modificada. O aceite do proprietário dos dois PDFs está documentado em [Exportação PDF](../05-operacao/EXPORTACAO_PDF.md). Evidências de 13–16/11 abaixo são históricas.

---

**Status:** inventário seguro, sem segredos · **Revisão:** 16/11/2026. A situação de 13/11 permanece identificada como verificação histórica.

| Serviço | Referência |
|---|---|
| GitHub | [`tuliust/PortfolioTulius`](https://github.com/tuliust/PortfolioTulius), `main` |
| Supabase | Projeto `portfolio`, ref `zfnrhzplwpjpdljraypt`, `us-east-1` |
| Supabase organização | `tuliustsangaropulos`, ID `gupklckstcjwwitbnrdo` (titularidade da conta nova ainda não certificada) |
| Vercel | `portfolio-tulius`, ID `prj_FVB5Cnk3428OSrWhEyskoqhWOCVW` |
| Vercel team | `tuliust`, ID `team_lhnlR7FccWqxK1lK8HTem57S` |
| Domínios | `tulius.work`, `www.tulius.work` |
| Desenvolvimento local | Node 24, pnpm, Supabase CLI + Docker/seed sintética |

## Nomes e destinos de variáveis
- `VITE_SUPABASE_URL` e `VITE_SUPABASE_PUBLISHABLE_KEY` constam em [.env.example](../../.env.example) e na Vercel Development/Preview/Production como variáveis cifradas. **Não documentar valores reais**.
- `P5_ADMIN_EMAIL` e `P5_ADMIN_PASSWORD` aparecem como secrets nos testes de CMS read-only. `SUPABASE_PUBLISHABLE_KEY` é referenciada em workflows pontuais de mídia. Verificar escopo antes de executá-los.
- Nunca levar `service_role`, secret key, PAT, passwords, arquivo `.env.local` ou tokens para frontend ou Markdown público.

Workflows principais utilizam Node **24.16.0** e pnpm **10.34.8** na versão consultada; conferir YAML antes de mudanças. Comandos em [`package.json`](../../package.json), Vercel `pnpm build` → `dist`.

**Remoção de legado Figma Make (11/11/2026):** `utils/supabase/info.tsx`, autogerado e com chave pública embutida, foi retirado do código. A fonte operacional de credenciais publicáveis é [`src/lib/supabase.ts`](../../src/lib/supabase.ts), sob variáveis de ambiente. [Registro histórico](../historico/figma-make-2026-11-11/README.md).

## Onde encontrar
GitHub Settings → Actions/Secrets/Variables; Supabase Dashboard → Database/Auth/Storage/API; Vercel Project Settings → Git/Domains/Environment Variables. Registrar nome, ambiente, finalidade e política de acesso, nunca credenciais.

[Segurança](../04-infraestrutura/SEGURANCA_E_ACESSOS.md) · [Deploy](../04-infraestrutura/VERCEL_DEPLOY_SEO.md).

**Higiene de branches:** [SHA e confirmação de exclusão das branches históricas](BRANCHES_E_REFERENCIAS.md).

## GitHub, Vercel e Supabase — evidências por data

| Referência | Evidência observada | Alcance e ressalva |
|---|---|---|
| **GitHub / 13–16/11** | Repositório `tuliust/PortfolioTulius` (ID `1431748857`), `main` como única branch na consulta de 16/11. | Não alterar referências a URLs antigas em registros históricos; a transferência não altera os commits anteriores. |
| **Vercel / 13/11** | Projeto e equipe da tabela acima; captura *Settings → Git* mostrava o novo repositório. API `get_git_deployment_context` ainda apontava para o namespace antigo e `search_repo` respondeu `installation_not_found`. | A discrepância de metadados não comprovava falha operacional; **não** desconectar/reconectar por inferência. |
| **Site e deploy / 16/11** | [P3 #43817188772](https://github.com/tuliust/PortfolioTulius/actions/runs/43817188772) confirmou SHA `9915964` servido em `tulius.work`; o commit documental [`06af944`](https://github.com/tuliust/PortfolioTulius/commit/06af9444955297a6ee93c9934b369598198afd69) obteve status GitHub `Vercel: success`, Validate e Export Docs **SUCCESS**. | Publicação por pushes legítimos comprovada. **Não** inferir nova P3/LCP nem limpeza dos metadados antigos na API. |
| **Supabase / 13–16/11** | Projeto `portfolio` ainda listado sob organização `tuliustsangaropulos`; consulta SQL produtiva read-only confirmou 20 indicadores e cinco temas na seção 03. | O papel de Owner da conta nova e eventual transferência de organização **não** foram certificados. Não alterar Auth, organização ou credenciais. |

Na verificação de 13/11, as variáveis VITE constavam cifradas em Development/Preview/Production, **sem leitura de valores**. O status Git/Vercel de 16/11 é evidência posterior, não reescrita retroativa da auditoria de 13/11. Nenhum serviço foi reconfigurado nesta consolidação documental.

[Contrato de publicação](../04-infraestrutura/VERCEL_DEPLOY_SEO.md) · [Operação Supabase](../04-infraestrutura/SUPABASE.md) · [Homologação](../05-operacao/TESTES_E_HOMOLOGACAO.md).

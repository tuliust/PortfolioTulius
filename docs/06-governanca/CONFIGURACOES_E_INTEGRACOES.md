# Configurações, variáveis e integrações
**Status:** inventário seguro, sem segredos · **Revisão:** 13/11/2026.

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

## Verificação dos conectores após a transferência — 13/11/2026

- **GitHub:** repositório de destino `tuliust/PortfolioTulius` (ID preservado `1431748857`, branch `main`). A conta `tuliust` teve permissão `admin` confirmada pelo conector. Referências ao proprietário antigo em links históricos identificam evidências de seu período e não devem ser apagadas por substituição indiscriminada.
- **Vercel:** conector autenticado como `tuliust@gmail.com`; equipe `tuliust`; projeto original e domínios preservados. As variáveis `VITE_SUPABASE_URL` e `VITE_SUPABASE_PUBLISHABLE_KEY` foram identificadas como cifradas em Development, Preview e Production, **sem leitura ou registro de valores**.
- **Git/Vercel:** a captura da tela *Project Settings → Git*, fornecida pelo proprietário em 13/11, mostra `tuliust/PortfolioTulius` conectado. A API `get_git_deployment_context`, porém, ainda apresentou `tuliustsangaropulos/PortfolioTulius` e `search_repo` retornou `installation_not_found`. Tratar como discrepância de evidência (possíveis metadados antigos), **não** como prova de quebra ou de reconexão concluída via API. Novo push `main` pós-transferência ainda não foi ensaiado.
- **Supabase:** o conector lista `portfolio` na organização `tuliustsangaropulos`; sua autenticação individual e a condição de Owner da nova conta não são verificáveis pelos endpoints consultados. Não assumir transferência nem autorizar exclusão da conta antiga.
- Auditoria exclusivamente de leitura, sem mudança de infraestrutura, código, ambiente, banco, conteúdo ou credenciais. [Estado Vercel](../04-infraestrutura/VERCEL_DEPLOY_SEO.md) · [Supabase](../04-infraestrutura/SUPABASE.md) · [Resultados](../05-operacao/TESTES_E_HOMOLOGACAO.md).

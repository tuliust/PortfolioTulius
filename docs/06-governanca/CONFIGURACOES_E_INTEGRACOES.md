# Configurações, variáveis e integrações
**Status:** inventário seguro, sem segredos · **Revisão:** 11/11/2026.

| Serviço | Referência |
|---|---|
| GitHub | [`tuliustsangaropulos/PortfolioTulius`](https://github.com/tuliustsangaropulos/PortfolioTulius), `main` |
| Supabase | Projeto `portfolio`, ref `zfnrhzplwpjpdljraypt`, `us-east-1` |
| Vercel | `portfolio-tulius`, ID `prj_FVB5Cnk3428OSrWhEyskoqhWOCVW` |
| Vercel team | `tuliustsangaropulos-creates-projects` |
| Domínios | `tulius.work`, `www.tulius.work` |
| Desenvolvimento local | Node 24, pnpm, Supabase CLI + Docker/seed sintética |

## Nomes e destinos de variáveis
- `VITE_SUPABASE_URL` e `VITE_SUPABASE_PUBLISHABLE_KEY` constam em [.env.example](../../.env.example) e na Vercel Development/Preview/Production como variáveis cifradas. **Não documentar valores reais**.
- `P5_ADMIN_EMAIL` e `P5_ADMIN_PASSWORD` aparecem como secrets nos testes de CMS read-only. `SUPABASE_PUBLISHABLE_KEY` é referenciada em workflows pontuais de mídia. Verificar escopo antes de executá-los.
- Nunca levar `service_role`, secret key, PAT, passwords, arquivo `.env.local` ou tokens para frontend ou Markdown público.

Workflows principais utilizam Node **24.16.0** e pnpm **10.34.8** na versão consultada; conferir YAML antes de mudanças. Comandos em [`package.json`](../../package.json), Vercel `pnpm build` → `dist`.

## Onde encontrar
GitHub Settings → Actions/Secrets/Variables; Supabase Dashboard → Database/Auth/Storage/API; Vercel Project Settings → Git/Domains/Environment Variables. Registrar nome, ambiente, finalidade e política de acesso, nunca credenciais.

[Segurança](../04-infraestrutura/SEGURANCA_E_ACESSOS.md) · [Deploy](../04-infraestrutura/VERCEL_DEPLOY_SEO.md).

**Higiene de branches:** [SHA, commits exclusivos e único procedimento manual restante](BRANCHES_E_REFERENCIAS.md).

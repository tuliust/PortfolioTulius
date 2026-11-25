# PortfolioTulius — portfólio editorial e CMS

Site profissional de comunicação, jornalismo, estratégia e projetos em [tulius.work](https://tulius.work/). O produto foi finalizado e recebeu manutenção pontual autorizada. Consulte o estado técnico vigente para distinguir mudanças publicadas, testes aprovados e riscos ainda abertos.

**Stack:** React 19, TypeScript, Vite, Tailwind CSS v4, Supabase (PostgreSQL/Auth/Storage) e Vercel. Repositório público na branch `main`.

## Documentação para manutenção

1. [Índice temático](docs/README.md) — escolha o guia adequado ao problema.
2. [Regras obrigatórias](AGENTS.md) — preservar UI, segurança, dados e publicação.
3. [Estado técnico](docs/01-projeto/ESTADO_ATUAL.md) · [arquitetura](docs/01-projeto/ARQUITETURA.md).
4. [CMS](docs/03-cms/GUIA_ADMINISTRATIVO.md) · [modelo de dados](docs/03-cms/MODELO_DE_DADOS.md) · [Supabase](docs/04-infraestrutura/SUPABASE.md) · [Vercel/SEO](docs/04-infraestrutura/VERCEL_DEPLOY_SEO.md).
5. [Configurações](docs/06-governanca/CONFIGURACOES_E_INTEGRACOES.md) · [pendências em standby](docs/06-governanca/BACKLOG_STANDBY.md) · [orientação para IA](docs/06-governanca/GUIA_USO_POR_IA.md).

## Código e desenvolvimento

| Caminho | Conteúdo |
|---|---|
| `src/components/public/` | Site público, menu, experiências |
| `src/components/admin/` | CMS, editores e autenticação |
| `src/hooks/usePortfolio.ts` | Leitura e composição do Supabase |
| `src/lib/` | RLS/cliente, persistência, helpers |
| `src/index.css` | Identidade visual e responsividade |
| `supabase/` | Migrations, seeds e testes |
| `scripts/` | SEO, QA, backups e smoke |
| `.github/workflows/` | CI e tarefas específicas |
| `docs/` | Contratos e evidências documentais |

Requer Node 24 compatível e pnpm. Configurar somente variáveis publicáveis de [.env.example](.env.example) em `.env.local` não versionado, executar `pnpm install --frozen-lockfile`, `pnpm dev`. Testar com `pnpm check` (formatação, TypeScript, testes e build).

## Estado e publicação

A Vercel publica a partir da `main`; pushes documentais também podem gerar deployment. O [estado técnico consolidado](docs/01-projeto/ESTADO_ATUAL.md) reúne os ajustes recentes e as evidências por SHA. O [guia de testes](docs/05-operacao/TESTES_E_HOMOLOGACAO.md) mantém o limite LCP mobile de 3,5 s e os resultados completos; publicação READY não equivale a P3 SUCCESS.

[Histórico organizado](docs/historico/README.md) · [Versões anteriores do índice e estado](docs/historico/consolidacao-2026-11-25/README.md). Fontes privadas do Projeto ChatGPT, dumps e backups não pertencem ao Git público.

# PortfolioTulius — portfólio editorial e CMS

Site profissional de comunicação, jornalismo, estratégia e projetos em [tulius.work](https://tulius.work/). O produto foi **finalizado e validado pelo proprietário**. Em 16/11/2026 recebeu manutenção autorizada na seção de Resultados (frontend, CMS, conteúdo e testes), sem reconstruir o produto nem reabrir automaticamente pendências antigas.

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

A Vercel publica a partir da `main`; **push documental também pode gerar deploy**. A baseline de 11/11/2026 é histórica e incluiu uma falha de LCP mobile acima de 3,5 s. Na revisão de Resultados em 16/11, o SHA [`9915964`](https://github.com/tuliust/PortfolioTulius/commit/9915964f54a37d209b25c778c6d2c50faddf4f77) teve [P3 #43817188772](https://github.com/tuliust/PortfolioTulius/actions/runs/43817188772) **SUCCESS**, com LCP mobile mediano de **3.458,135 ms** e cinco categorias com quatro indicadores cada. A auditoria posterior do SHA [`8ed19b0`](https://github.com/tuliust/PortfolioTulius/commit/8ed19b098349e882f7c7dbb9b926114b6451e17e) foi **FAILURE** por LCP mobile mediano de **3.649,202 ms**, apesar dos testes de navegador aprovados. Em 18/11, o SHA funcional [`2bbbae59`](https://github.com/tuliust/PortfolioTulius/commit/2bbbae59b427c909cf7407790c4c6b0f2bbab31c) teve [P3 #44292509279](https://github.com/tuliust/PortfolioTulius/actions/runs/44292509279), [Validate #44292509459](https://github.com/tuliust/PortfolioTulius/actions/runs/44292509459) e [PDF Visual QA #44292509358](https://github.com/tuliust/PortfolioTulius/actions/runs/44292509358) em **SUCCESS**. Estes são resultados vinculados aos respectivos SHAs e não homologação P3 de commits documentais posteriores. A oscilação do LCP mobile continua registrada; a meta de **3.500 ms** não foi alterada. Consultar o [guia de testes](docs/05-operacao/TESTES_E_HOMOLOGACAO.md) e verificar sempre o SHA atual.

[Fotografia anterior ao projeto documental](docs/historico/preconsolidacao-2026-11-11/ESTADO_PRE_CONSOLIDACAO.md). Fontes privadas do Projeto ChatGPT e dumps/binaries não pertencem ao Git público.

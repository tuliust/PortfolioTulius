> **ATUALIZAÇÃO POSTERIOR AO ENCERRAMENTO (05/11/2026):** houve uma nova rodada expressa de mudanças de Experiências, Contato e CMS. Código funcional em [`5599b2f0e0`](https://github.com/tuliustsangaropulos/PortfolioTulius/commit/5599b2f0e030565b224b9ab0c8046c371e14749c), [Validate #42004690688](https://github.com/tuliustsangaropulos/PortfolioTulius/actions/runs/42004690688) aprovado e Vercel Production **READY** nesse SHA. A verificação **não concluiu** aceite visual do pixel inferior de Contato, ensaio autenticado de gravação do CMS nem P3 do último SHA. [Reconciliação dos pedidos e evidências](docs/RECONCILIACAO_IMPLEMENTACAO_CHAT_2026-11-05.md). O encerramento histórico abaixo permanece válido para o período em que foi declarado.

> **PROJETO ENCERRADO ADMINISTRATIVAMENTE — 05/11/2026.** O proprietário inspecionou toda a página e não observou erros. Todos os itens restantes dos checklists foram encerrados **por decisão**, com possibilidade de reabertura futura. Evidência técnica não executada (backup binário, P3 do último SHA funcional, integração de commits locais, gatilho SEO real) permanece documentada sem ser apresentada como sucesso. [Registro vigente](docs/ENCERRAMENTO_OPERACIONAL_2026-11-05.md).

# PortfolioTulius — portfólio editorial e CMS

Site de comunicação, relações públicas e estratégia de Tulius Tsangaropulos, publicado em [tulius.work](https://tulius.work/). Aplicação React 19 + TypeScript + Vite + Supabase, com frontend editorial responsivo, CMS autenticado e publicação automática via Vercel após alterações na `main`.

> **Documentação vigente:** [Índice técnico](docs/README.md) · [Estado comprovado](docs/ESTADO_ATUAL_VIGENTE.md) · [Pendências abertas](docs/OPEN_ISSUES.md) · [Regras obrigatórias](AGENTS.md). Histórico documental anterior: [arquivo de 31/10/2026](docs/historico/README_ATE_2026-10-31.md).

## Estrutura

- `src/components/public/`: site, navegação, seções responsivas e experiências.
- `src/components/admin/`: CMS e fluxos administrativos.
- `src/hooks/usePortfolio.ts`: leitura e composição de dados publicados; o Perfil pode aparecer antes do grafo completo.
- `src/content/defaultTokens.ts` e `src/content/fallback.ts`: tokens e conteúdo offline; fallback carregado sob demanda.
- `supabase/`: migrações e testes existentes; **não aplicar automaticamente**.
- `scripts/`: auditorias, smoke tests e captura editorial.
- `docs/`: contrato técnico vigente e históricos datados.

**Fonte de conteúdo:** Supabase publicado, protegido por RLS, sem hardcode de dados substituindo o CMS. **Contrato atual:** 13 seções no DOM desktop; no mobile, uma das seis experiências por vez (Invest RS inicialmente), com 8 seções e 15 painéis mobile simultaneamente montados. Os antigos 13 desktop + 25 mobile / 38 capturas são **marcos de testes históricos**, não contrato atual.

## Desenvolvimento

```bash
pnpm install --frozen-lockfile
cp .env.example .env.local
pnpm dev
pnpm check
```

Preencha somente as variáveis de ambiente **públicas** documentadas em `.env.example`. Nunca versione segredos, credenciais ou `service_role`. Consulte [AGENTS.md](AGENTS.md) antes de editar. O fluxo do projeto utiliza exclusivamente commits diretos na `main`, sem branches de trabalho ou PRs.

## Qualidade e publicação

- `pnpm format:check`, `pnpm typecheck`, `pnpm test`, `pnpm build` e `pnpm check`.
- [GitHub Actions](https://github.com/tuliustsangaropulos/PortfolioTulius/actions) valida código e executa a auditoria P3 separadamente.
- [Deploy](docs/DEPLOYMENT.md) e [Segurança/RLS](docs/SECURITY_RLS.md).
- **CI aprovado não significa P3 aprovado, nem comprovação de LCP ≤3,5 s ou aceite visual humano.**

## Último marco funcional auditado (31/10/2026)

- Commit [`aa71737e`](https://github.com/tuliustsangaropulos/PortfolioTulius/commit/aa71737e48834bb987c4a7cb6a3353ae1cf221fb): revisão mobile das seções de apresentação, resultados, formação, ferramentas e experiências.
- [Validate #41246204902](https://github.com/tuliustsangaropulos/PortfolioTulius/actions/runs/41246204902): **success**.
- [Audit P3 #41246204897](https://github.com/tuliustsangaropulos/PortfolioTulius/actions/runs/41246204897): **failure**, com quatro verificações anteriores relativas à fotografia de Contato; o conjunto P4 capturou 38 painéis com zero falhas automatizadas.
- LCP mobile simulado **3,492 s** (mediana de três) e diagnóstico aplicado **2,324 s** (uma amostra). A meta vigente ≤3,5 s foi atendida na última mediana de laboratório de 3,386 s; o p75 de campo permanece **não comprovado**.

Este bloco é um **marco histórico fixo** e não o estado automático de futuros commits. Consulte [Estado vigente](docs/ESTADO_ATUAL_VIGENTE.md) e o SHA atual da `main` sempre que iniciar trabalho. Nenhuma mudança editorial ou transacional deve ser inferida desta documentação.


## Homologação em Supabase local

Foi escolhida uma instância local Supabase CLI + Docker, sem projeto cloud adicional. A configuração de seed local é **exclusivamente sintética**; o `supabase/seed.sql` editorial legado nunca deve ser executado no staging. [Guia](docs/SUPABASE_STAGING_LOCAL_ISOLADO_2026-11-02.md) · [nova meta LCP](docs/DECISOES_LCP_3_5_STAGING_LOCAL_2026-11-02.md).

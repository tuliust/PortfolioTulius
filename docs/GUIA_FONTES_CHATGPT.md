# Guia de Fontes ChatGPT — PortfolioTulius

**Revisão:** 01/11/2026. Consulte antes de iniciar uma nova tarefa. O guia é um **índice de prioridades**, não um substituto para código e testes. [Documento de orientação anterior preservado](historico/GUIA_FONTES_CHATGPT_ATE_2026-10-31.md).

## Precedência

1. Conferir a [`main`](https://github.com/tuliustsangaropulos/PortfolioTulius/commits/main), [AGENTS.md](../AGENTS.md), [CI](https://github.com/tuliustsangaropulos/PortfolioTulius/actions), deployment do mesmo SHA e, quando necessário, Supabase **somente leitura**.
2. Consultar [Estado atual](ESTADO_ATUAL_VIGENTE.md), [Pendências](OPEN_ISSUES.md) e [Índice técnico](README.md). Se o código divergir de snapshots, o código e evidências recentes prevalecem.
3. Abrir a documentação específica: [Arquitetura](ARCHITECTURE.md), [Design](DESIGN_SYSTEM.md), [Responsividade](RESPONSIVE_LAYOUT.md), [Experiências](EXPERIENCIAS_UNIFICADAS_2026-10-31.md), [CMS](ADMIN_CMS.md), [Modelo](CONTENT_MODEL.md), [Performance](P3_LCP_MOBILE_RESULTADOS_2026-10-31.md), [Segurança](SECURITY_RLS.md), [Deploy](DEPLOYMENT.md).
4. Tratar documentos datados de continuidade, auditorias antigas e mocks como **histórico com contexto**, jamais como pendência atual automática.

## Fontes persistentes recomendadas neste projeto ChatGPT

| Anexo | Papel |
|---|---|
| `ESTADO_ATUAL_VIGENTE_PORTFOLIOTULIUS_2026-11-01.md` | Instantâneo do último estado verificado, atualizado manualmente |
| `GUIA_FONTES_VIGENTES_PORTFOLIOTULIUS_2026-11-01.md` | Guia único de precedência e links |
| `CONTEXTO_PRODUTO_DESIGN_PORTFOLIOTULIUS.md` | Identidade e decisões de produto históricas, imutável |
| `BACKUP_CONTINUIDADE_SECAO_01_VERSAO_80_LINHAS_2026-10-28.md` | **Backup histórico privado exclusivo**, 80 linhas, SHA-256 `67db85f1cc497e6f51625f19472f76a753707cb0c7b34407af73d7f23b4ff288`; **nunca publicar no GitHub** |

Remover dos anexos ativos cópias concorrentes de 28 e 31/10 **após** confirmar inclusão das versões novas; isso deve ser feito no ChatGPT, não via GitHub.

## Atenção a interpretações incorretas

- `CMS-UX-01/02/03` foram implementados em código posteriormente à [continuidade CMS de 31/10](CONTINUIDADE_CMS_FONTES_E_PENDENCIAS_2026-10-31.md). A homologação transacional P2 e o aceite visual permanecem separados.
- [CI #41246204902](https://github.com/tuliustsangaropulos/PortfolioTulius/actions/runs/41246204902) passou e [P3 #41246204897](https://github.com/tuliustsangaropulos/PortfolioTulius/actions/runs/41246204897) falhou por quatro critérios de Contato. Não dizer que P3 geral está verde.
- A última mediana mobile simulada documentada foi **3,492 s**, acima da meta ≤2,5 s; a amostra aplicada isolada não demonstra p75.
- Não alterar dados, mídias, RLS, Auth, Storage, infra, contratos financeiros, segredos ou conteúdo autoral sem pedido expresso. Não criar conteúdo fictício para atender a mockup.

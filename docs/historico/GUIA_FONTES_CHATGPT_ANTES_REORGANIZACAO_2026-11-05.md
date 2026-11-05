> **ARQUIVO HISTÓRICO — fonte:** [`docs/GUIA_FONTES_CHATGPT.md`](https://github.com/tuliustsangaropulos/PortfolioTulius/blob/79aa3c07ce6c9106b1d504c1f574731bf70fb5d2/docs/GUIA_FONTES_CHATGPT.md), commit `79aa3c07`. Os textos e evidências foram preservados; somente links relativos foram ajustados à localização no arquivo histórico. Não usar como estado vigente.

> **ATUALIZAÇÃO DOCUMENTAL DE 05/11/2026:** referência funcional [`31943c12`](https://github.com/tuliustsangaropulos/PortfolioTulius/commit/31943c12b8214aa1d4aad957d159ddcea010835e), [Validate #42016989021](https://github.com/tuliustsangaropulos/PortfolioTulius/actions/runs/42016989021) **success**, Vercel READY. **P3 geral não aprovado** no run [#42016688466](https://github.com/tuliustsangaropulos/PortfolioTulius/actions/runs/42016688466) de `04cf1240`: 7 falhas de navegador, apesar de P6 LCP mobile mediano de 3,484 s passar isoladamente. [Auditoria integral dos pedidos](../AUDITORIA_PEDIDOS_CHAT_2026-11-05.md).
Na próxima tarefa, começar pela [auditoria dos pedidos](../AUDITORIA_PEDIDOS_CHAT_2026-11-05.md), reler `AGENTS.md`, `main`, CI e produção. **Não publicar anexos privados** de continuidade nem considerar o snapshot funcional `31943c12` automaticamente atualizado.

> **FONTES E PRECEDÊNCIA — 05/11/2026:** usar [`main`](https://github.com/tuliustsangaropulos/PortfolioTulius/commit/5ed489af5879589565cb0101e420065bfbf50552) (SHA conferido no início desta revisão), [Validate #42014122089](https://github.com/tuliustsangaropulos/PortfolioTulius/actions/runs/42014122089), deployment do mesmo SHA e [reconciliação dos novos pedidos](../RECONCILIACAO_IMPLEMENTACAO_CHAT_2026-11-05.md). O encerramento administrativo de 05/11 permanece histórico. **As quatro Fontes privadas não foram publicadas ou substituídas** pela atualização do GitHub.

> **PRIORIDADE MÁXIMA ATUALIZADA — 05/11/2026:** antes de ler checklists datados, consultar [Encerramento operacional e aceites](../ENCERRAMENTO_OPERACIONAL_2026-11-05.md). Estado: **sem backlog ativo**, todos os itens concluídos por decisão, reabertura futura somente mediante necessidade. Os arquivos antigos preservam a história, não descrevem tarefas ativas.

# Guia de Fontes ChatGPT — PortfolioTulius

**Revisão:** 01/11/2026. Consulte antes de iniciar uma nova tarefa. O guia é um **índice de prioridades**, não um substituto para código e testes. [Documento de orientação anterior preservado](GUIA_FONTES_CHATGPT_ATE_2026-10-31.md).

## Precedência

1. Conferir a [`main`](https://github.com/tuliustsangaropulos/PortfolioTulius/commits/main), [AGENTS.md](../../AGENTS.md), [CI](https://github.com/tuliustsangaropulos/PortfolioTulius/actions), deployment do mesmo SHA e, quando necessário, Supabase **somente leitura**.
2. Consultar [Estado atual](../ESTADO_ATUAL_VIGENTE.md), [Pendências](../OPEN_ISSUES.md) e [Índice técnico](../README.md). Se o código divergir de snapshots, o código e evidências recentes prevalecem.
3. Abrir a documentação específica: [Arquitetura](../ARCHITECTURE.md), [Design](../DESIGN_SYSTEM.md), [Responsividade](../RESPONSIVE_LAYOUT.md), [Experiências](../EXPERIENCIAS_UNIFICADAS_2026-10-31.md), [CMS](../ADMIN_CMS.md), [Modelo](../CONTENT_MODEL.md), [Performance](../P3_LCP_MOBILE_RESULTADOS_2026-10-31.md), [Segurança](../SECURITY_RLS.md), [Deploy](../DEPLOYMENT.md).
4. Tratar documentos datados de continuidade, auditorias antigas e mocks como **histórico com contexto**, jamais como pendência atual automática.

## Fontes persistentes recomendadas neste projeto ChatGPT

| Anexo | Papel |
|---|---|
| `ESTADO_ATUAL_VIGENTE_PORTFOLIOTULIUS_2026-11-05.md` | Instantâneo do último estado verificado, atualizado manualmente |
| `GUIA_FONTES_VIGENTES_PORTFOLIOTULIUS_2026-11-05.md` | Guia único de precedência e links |
| `CONTEXTO_PRODUTO_DESIGN_PORTFOLIOTULIUS.md` | Identidade e decisões de produto históricas, imutável |
| `BACKUP_CONTINUIDADE_SECAO_01_VERSAO_80_LINHAS_2026-10-28.md` | **Backup histórico privado exclusivo**, 80 linhas, SHA-256 `67db85f1cc497e6f51625f19472f76a753707cb0c7b34407af73d7f23b4ff288`; **nunca publicar no GitHub** |

Remover dos anexos ativos cópias concorrentes de 28 e 31/10 **após** confirmar inclusão das versões novas; isso deve ser feito no ChatGPT, não via GitHub.

## Atenção a interpretações incorretas

- `CMS-UX-01/02/03` foram implementados em código posteriormente à [continuidade CMS de 31/10](../CONTINUIDADE_CMS_FONTES_E_PENDENCIAS_2026-10-31.md). A homologação transacional P2 e o aceite visual permanecem separados.
- [CI #41246204902](https://github.com/tuliustsangaropulos/PortfolioTulius/actions/runs/41246204902) passou e [P3 #41246204897](https://github.com/tuliustsangaropulos/PortfolioTulius/actions/runs/41246204897) falhou por quatro critérios de Contato. Não dizer que P3 geral está verde.
- **Marco histórico de 31/10:** a mediana mobile simulada foi **3,492 s**; a meta vigente foi posteriormente fixada em **≤3,5 s**, e medições dos SHAs anteriores não comprovam P3 nem p75 do HEAD atual.
- Não alterar dados, mídias, RLS, Auth, Storage, infra, contratos financeiros, segredos ou conteúdo autoral sem pedido expresso. Não criar conteúdo fictício para atender a mockup.

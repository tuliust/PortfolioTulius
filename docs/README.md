# Documentação técnica — PortfolioTulius

**Índice vigente em 05/11/2026.** Esta página distingue documentação **operacional**, **especificações de origem** e **evidências históricas**. Cada commit tem data e escopo; jamais interpretar um snapshot antigo como status corrente de `main`. A versão anterior deste índice está [arquivada](historico/INDICE_DOCUMENTACAO_ANTES_REORGANIZACAO_2026-11-05.md).

## Primeiro acesso — cinco referências essenciais

| Finalidade | Fonte |
|---|---|
| **Regras e proteção de dados** | [`AGENTS.md`](../AGENTS.md) |
| **Estado técnico e evidências de CI/P3** | [Estado atual vigente](ESTADO_ATUAL_VIGENTE.md) |
| **Interface administrativa atual** | [CMS](ADMIN_CMS.md) |
| **Exibição pública responsiva a preservar** | [Layout responsivo](RESPONSIVE_LAYOUT.md) |
| **Validações pendentes sem reabertura automática do projeto** | [Verificações técnicas](OPEN_ISSUES.md) |

**Baseline de aplicação** desta reorganização: [`79aa3c07`](https://github.com/tuliustsangaropulos/PortfolioTulius/commit/79aa3c07ce6c9106b1d504c1f574731bf70fb5d2), [CI `#42020574434` aprovado](https://github.com/tuliustsangaropulos/PortfolioTulius/actions/runs/42020574434) e Vercel READY no mesmo SHA na consulta de 05/11. A última [P3 `#42020342275`](https://github.com/tuliustsangaropulos/PortfolioTulius/actions/runs/42020342275) foi **reprovada** no commit anterior `0873eeff`; **não há P3 própria localizada de `79aa3c07`**. Não atribuir resultado P3 a SHA diferente.

## Contratos por assunto

| Domínio | Fonte principal |
|---|---|
| Arquitetura e carregamento | [`ARCHITECTURE.md`](ARCHITECTURE.md) |
| Entidades, seções, coleções e JSONB | [`CONTENT_MODEL.md`](CONTENT_MODEL.md) |
| Design, cores, tipografia e tokens | [`DESIGN_SYSTEM.md`](DESIGN_SYSTEM.md) |
| Interações, acessibilidade e motion | [`UX_UI_MOTION.md`](UX_UI_MOTION.md) |
| Segurança, funções e RLS | [`SECURITY_RLS.md`](SECURITY_RLS.md) |
| Deploy, SEO estático e versionamento | [`DEPLOYMENT.md`](DEPLOYMENT.md) |
| Experiências e textos editoriais — snapshot | [`EXPERIENCIAS_UNIFICADAS_2026-10-31.md`](EXPERIENCIAS_UNIFICADAS_2026-10-31.md) |
| Guia de precedência entre fontes GitHub/ChatGPT | [`GUIA_FONTES_CHATGPT.md`](GUIA_FONTES_CHATGPT.md) |

## Evidências e marcos cronológicos

- [Auditoria dos pedidos recebidos em 05/11](AUDITORIA_PEDIDOS_CHAT_2026-11-05.md) e [reconciliação acumulada](RECONCILIACAO_IMPLEMENTACAO_CHAT_2026-11-05.md) — documentos **datados**, com SHAs próprios, não monitoramento em tempo real.
- [Encerramento administrativo deliberado pelo proprietário](ENCERRAMENTO_OPERACIONAL_2026-11-05.md) — baixa histórica por decisão, distinta de homologação técnica posterior.
- [Histórico e versões antigas completas](historico/README.md) — relatórios, handoffs, checklists e versões integrais antes da consolidação.
- [`guidelines.md`](../guidelines.md) — **especificação original de 22/10**, não descrição do CMS atual.
- [`plans/auditoria-portfolio-tulius.md`](../plans/auditoria-portfolio-tulius.md) — **diagnóstico de 23/10**, não backlog vigente.

## Convenções de manutenção

1. Contrato atual **curto e explícito**; evidências antigas mantidas no arquivo histórico e referenciadas por permalink de commit.
2. Nunca copiar um cabeçalho de SHA antigo para fazê-lo parecer a versão de `main`. Sempre separar baseline funcional, commit exclusivamente documental, Vercel e P3.
3. Não apagar decisões editoriais, dados de auditoria ou medições históricas. Ao arquivar, reparar os links relativos e manter fonte/commit de origem.
4. Links Markdown relativos devem resolver no caminho onde o arquivo **está agora**. Se um snapshot for movido, seus links devem acompanhar a mudança.
5. **A aparência publicada é a correta e deve permanecer intocada**; organização da documentação não autoriza mudanças em `src/`, CSS, Storage, Supabase, identidade ou SEO.

A [versão anterior integral do índice](historico/INDICE_DOCUMENTACAO_ANTES_REORGANIZACAO_2026-11-05.md) preserva a seleção de fontes e os apontamentos originais.


# Verificações técnicas — sem reabertura automática do encerramento

**Situação em 05/11/2026:** o proprietário encerrou administrativamente os checklists anteriores, conforme [decisão registrada](ENCERRAMENTO_OPERACIONAL_2026-11-05.md). Esta página não reabre automaticamente aquele backlog. Ela identifica **lacunas de homologação e acompanhamento técnico** após os novos pedidos, sem autorizar alterações destrutivas nem mudanças na exibição pública atual. [Registro anterior completo](historico/OPEN_ISSUES_ANTES_REORGANIZACAO_2026-11-05.md).

**Baseline funcional:** [`79aa3c07`](https://github.com/tuliustsangaropulos/PortfolioTulius/commit/79aa3c07ce6c9106b1d504c1f574731bf70fb5d2). [Validate `#42020574434`](https://github.com/tuliustsangaropulos/PortfolioTulius/actions/runs/42020574434) **aprovado**. A última [P3 `#42020342275`](https://github.com/tuliustsangaropulos/PortfolioTulius/actions/runs/42020342275), do SHA **`0873eeff`**, **falhou** (7 critérios de navegador e mediana mobile **3,537 s**, acima de **3,5 s**). Sem P3 própria localizada do baseline `79aa3c07`.

## O que tem código, mas não aceite completo

| Verificação | Evidência existente | O que ainda não está comprovado |
|---|---|---|
| **P3 navegador / responsividade e LCP** | Último run citado reprovado; P4 teve 38 capturas automáticas sem falhas no mesmo run | P3 do SHA funcional final, causa das 7 falhas, comportamento em 320 px e métricas após mudanças posteriores |
| **Exibição mobile / seta da primeira tela** | Regras de CSS/JSX implementadas no Perfil, Olá, Ferramentas e Experiências | Inspeção física de iPhone em alturas baixas, estado sticky, contorno do retrato e seta visível sem deslizar; **não modificar o site só para “melhorar” sem novo pedido** |
| **Trajetória editada inline** | Formulário com registro em `career_experiences`, validação e guarda `updated_at` no código; CI aprovado | Gravar, salvar e reler dados com sessão administrativa real; concorrência entre dois editores |
| **Mídia — upload e exclusão** | Rotinas de upload público e RPC de limpeza; duas fases banco/Storage | Teste seguro e reversível autenticado, tratamento de falha após SQL e restauração de arquivo; **não executar em ativos de produção históricos** |
| **Texto alternativo e enquadramento** | Campos de edição centralizados na Biblioteca, valores copiados para JSONB no vínculo | Propagação automática de alterações posteriores de `alt_text` a blocos que já armazenam cópias legadas |
| **Contadores e migrações Supabase** | Snapshot 75 mídias, 128 objetos, RPC presente | Causa não atribuída da mudança de 76→75/129→128; identidade do arquivo de migration versus linha registrada no histórico |
| **SEO após editar CMS** | `generate-seo.mjs` gera HTML estático no build | Salvar SEO, gerar novo build autorizado e conferir HTML/OG/canonical/sitemap pós-publicação |

**Critério de qualidade:** descrever separadamente **implementado**, **testado automaticamente**, **implantado**, **testado autenticado** e **aceito visualmente**. Não usar P6 parcial, P4 sem falhas ou `READY` como prova de P3 integral aprovado.

## Proteções para qualquer retomada

- A **apresentação atual publicada é a correta**. Manter CSS, imagens, tipografia, textos, ordem, comportamentos e responsividade inalterados nesta frente documental.
- Não fazer uploads/exclusões de teste em produção, edições de dados, RLS/Auth/Storage ou nova infraestrutura sem autorização clara e cenário controlado.
- Para homologação transacional, o ambiente escolhido é **Supabase local + Docker, seed sintética**, nunca `supabase/seed.sql` em staging. [Procedimento](SUPABASE_STAGING_LOCAL_ISOLADO_2026-11-02.md).
- A meta mobile é **LCP mediano ≤3,5 s** em três medições Lighthouse sintéticas, não p75 de usuários reais. Inspeções e métricas devem registrar o SHA exato.

[Estado vigente](ESTADO_ATUAL_VIGENTE.md) · [Auditoria dos pedidos](AUDITORIA_PEDIDOS_CHAT_2026-11-05.md) · [Histórico de pendências e decisões](historico/OPEN_ISSUES_ANTES_REORGANIZACAO_2026-11-05.md).


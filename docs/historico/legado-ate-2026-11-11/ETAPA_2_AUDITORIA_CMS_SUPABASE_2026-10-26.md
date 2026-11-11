# Etapa 2/3 — auditoria operacional de CMS e Supabase

**Data da execução:** 26/10/2026. **Projeto efetivamente examinado:** Supabase `portfolio` (`zfnrhzplwpjpdljraypt`), PostgreSQL 17, `us-east-1`.

## Banco, CMS e integridade — leitura confirmada

| Indicador | Estado observado |
|---|---:|
| Tabelas `public` com RLS | 22/22 |
| Seções cadastradas / visíveis publicadas | 14 / 13 |
| Painéis cadastrados | 42 (incluem a seção oculta) |
| Blocos de conteúdo | 28 |
| Posicionamentos | 56 |
| Migrations registradas remotamente | 7 |
| Pendências editoriais | 8 abertas, 1 resolvida |
| Usuários Auth / administradores | 1 / 1 |
| Arquivos no Storage / metadados de mídia | 0 / 0 |

Nenhum placement órfão, referência cruzada a seção errada, colisão de ordem ou duplicação foi encontrado. A seção antiga `competencias` está preservada com `is_visible=false`; sua entrada de navegação ainda estava publicada/visível no início desta etapa, embora fosse filtrada pelo frontend. Esse metadado foi **corrigido posteriormente na etapa 3**: hoje são 13 itens de navegação visíveis.

## Autorização e Storage

- Consultas SQL **`READ ONLY` com `ROLLBACK`** simularam os papéis `anon`, `authenticated` sem privilégio e `authenticated` com UID da associação administrativa. Os dois primeiros viram 13 seções e **0** registros de `admin_users`, `editorial_issues`, `content_revisions` e `audit_logs`; o admin simulado viu as 14 seções e as linhas administrativas esperadas. Esses testes **não usam JWT real do Auth**.
- Seis RPCs administrativas públicas são `SECURITY DEFINER` e exigem `private.require_portfolio_admin()`. A execução `anon` é negada e `authenticated` é concedida sob verificação interna; as seis notificações do Security Advisor não indicam, isoladamente, bypass demonstrado.
- Buckets: `portfolio-public` (público) e `portfolio-private` (privado), limite **8 MB** cada, somente JPEG/PNG/WebP/SVG; ambos vazios. Não houve prova de upload/download por usuário autenticado.
- Consultas mostraram `USAGE` no schema `private` e permissão de execução em `private.is_portfolio_admin` para `anon`; revisar com dependências antes de qualquer revogação, **sem afirmar exposição pela Data API**.
- Security Advisor: **6** alertas de função `SECURITY DEFINER` e **1** aviso de proteção contra senhas vazadas desativada. Performance Advisor: **19** avisos de múltiplas políticas permissivas e **10** índices possivelmente não utilizados. Esses contadores não significam, por si só, incidentes.
- Duas decisões do proprietário permanecem fora do escopo de mudança: **não revogar o PAT histórico anteriormente exposto** e **não ativar Leaked Password Protection**. São riscos aceitos, não riscos corrigidos.

## Código e limitações da homologação

O editor usa `signInWithPassword`, verifica `admin_users`, apresenta oito módulos (Seções, Blocos, Coleções, Identidade, Mídia, Navegação, SEO e Revisões) e protege `/admin/preview`. O script `scripts/p5-admin-readonly.mjs` / workflow `P5 Admin Read-Only E2E` exige Secrets administrados no GitHub; nenhuma execução autenticada foi comprovada nesta auditoria.

O código da biblioteca privada possuía risco de objeto órfão se falhasse a gravação dos metadados, e de substituir os bytes antes de confirmar a atualização da linha. **A etapa 3 corrigiu pontualmente essas sequências** com compensação testada em unidade, mas a API Storage real com JWT administrativo ainda não foi homologada.

`content_revisions` e `audit_logs` tinham **2 registros cada**; as alterações diretas por SQL de 26/10 não demonstram mecanismo de histórico via interface. A restauração de snapshots pela UI ainda não foi implementada.

## Continuidade

A etapa 3 consolidou `is_placeholder=false` em `resultados/A`, `invest-rs/A` e `invest-rs/B` sem modificar o JSON editorial. Permaneceu `items[3].placeholder=true` para **Ativos visuais** na Invest RS, com a ausência de fotos reais registrada. As oito pendências abertas foram preservadas.

Estado vigente e resultados de regressão: [Auditoria consolidada](AUDITORIA_ETAPAS_1_A_3_ESTADO_ATUAL_2026-10-26.md). Este relatório é histórico e não autoriza alterações em dados, Auth ou permissões.

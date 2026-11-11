# Bloco 2 / P6 — Auditoria de funções privilegiadas (somente leitura)

**Data:** 02/11/2026. **Fonte:** consulta direta a `pg_proc`, `pg_namespace`, `has_function_privilege`, `pg_get_function_identity_arguments` e `pg_get_functiondef` no Supabase de produção, usando **exclusivamente SELECT**. Não foram realizadas alterações em permissões, Auth, schema, RLS ou configurações.

## Seis RPCs administrativas públicas

| Função | SECURITY DEFINER | search_path declarado | EXECUTE anon | EXECUTE authenticated | Referência a `private.require_portfolio_admin()` |
| --- | --- | --- | --- | --- | --- |
| `create_section_with_panels` | Sim | vazio | Não | Sim | Sim |
| `duplicate_section` | Sim | `public, private, pg_catalog` | Não | Sim | Sim |
| `publish_section` | Sim | vazio | Não | Sim | Sim |
| `save_content_block_atomic` | Sim | vazio | Não | Sim | Sim |
| `save_home_seo_atomic` | Sim | vazio | Não | Sim | Sim |
| `swap_section_order` | Sim | `public, private, pg_catalog` | Não | Sim | Sim |

As seis funções apresentam **referência textual** à guarda interna de administrador. Isso **não comprova** que todas as ramificações possíveis sejam seguras; executar verificações com JWT de administrador, usuário comum e anônimo no Supabase local continua necessário. Não revogar `EXECUTE` de `authenticated` sem verificar fluxos de CMS.

## Funções privadas de autorização

| Função | SECURITY DEFINER | search_path | EXECUTE anon | EXECUTE authenticated |
| --- | --- | --- | --- | --- |
| `private.is_portfolio_admin(check_user uuid)` | Sim | `public, pg_catalog` | **Sim** | Sim |
| `private.require_portfolio_admin()` | Sim | `public, pg_catalog` | Não | Sim |

**Observação para revisão:** `private.is_portfolio_admin` possui permissão de execução para `anon`, mas está em schema `private`. Uma permissão SQL **não demonstra** por si só exposição da função pelo PostgREST; é necessário verificar os schemas expostos e o alcance da função no staging local. A análise das permissões deve preservar a autenticação legítima do CMS e a integridade do site.

## Próximos passos sem alterar produção

- [x] Confirmar grants declarados de execução, `SECURITY DEFINER`, `search_path` e referência textual da guarda.
- [ ] Testar chamadas diretas com identidades diferentes **no stack local**.
- [ ] Revisar se parâmetros, IDOR, `search_path` e invocações internas permitem desvios em qualquer ramificação.
- [ ] Confirmar schemas expostos no local, confrontando permissões de `private`.
- [ ] Preparar proposta individual de hardening e rollback **apenas se houver evidência de falha**; sem aplicar mudanças sem aprovação.

**Demais alertas anteriores:** 19 políticas permissivas `SELECT` sobrepostas, 9 índices sem uso registrado e proteção de senhas vazadas desativada; permanecem decisões pendentes e não foram alterados.

[Checklist Bloco 2](CHECKLIST_BLOCO_2_P4_P5_P6_2026-11-02.md) · [Guia de Supabase local](SUPABASE_STAGING_LOCAL_ISOLADO_2026-11-02.md).

# Segurança, RLS, acessos e riscos
**Status:** controles registrados, alterações não autorizadas por este documento · **Revisão:** 11/11/2026.

## Controles comprovados
- **22/22 tabelas em `public` com RLS**, 41 policies.
- Admin: sessão Supabase Auth + vínculo `admin_users` + guarda administrativa nas RPCs. `authenticated` não equivale automaticamente a administrador.
- `anon` não possui EXECUTE em `save_section_block_atomic`; `authenticated` só a utiliza com validação de admin.
- Bucket `portfolio-private` não deve expor objetos. Frontend Vite só usa `VITE_SUPABASE_URL` e `VITE_SUPABASE_PUBLISHABLE_KEY`; **nunca `service_role`/secret/PAT**.
- Rotas administrativas têm sessão e `noindex` via Vercel.

## Supabase Advisors de 11/11
| Aviso | Quantidade | Referência |
|---|---:|---|
| `authenticated_security_definer_function_executable` | 7 WARN | [Guia](https://supabase.com/docs/guides/database/database-linter?lint=0029_authenticated_security_definer_function_executable) |
| `auth_leaked_password_protection` | 1 WARN | [Auth](https://supabase.com/docs/guides/auth/password-security#password-strength-and-leaked-password-protection) |
| `unused_index` | 8 INFO | [Índices](https://supabase.com/docs/guides/database/database-linter?lint=0005_unused_index) |
| `multiple_permissive_policies` | 19 WARN | [Policies](https://supabase.com/docs/guides/database/database-linter?lint=0006_multiple_permissive_policies) |
| Saúde | 0 | — |

Proteção de senhas vazadas segue desativada por escolha de custo já aceita pelo proprietário. Um **PAT pessoal anteriormente exposto** saiu do conteúdo atual, mas permanece possível no histórico público; a revogação não foi verificada e o proprietário já decidira não fazê-la. Risco aceito **não** é corrigido. Não recuperar, copiar ou usar credenciais históricas.

Para eventual revisão de RLS: analisar policies individualmente, testar usuário não administrador no local sintético e preparar rollback; não reduzir grants só para remover alertas.

[Supabase](SUPABASE.md) · [standby](../06-governanca/BACKLOG_STANDBY.md).

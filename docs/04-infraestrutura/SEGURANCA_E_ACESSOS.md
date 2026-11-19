# Segurança, RLS, acessos e riscos

## Revisão de PATs e eventos OAuth — 19/11/2026

Capturas das configurações GitHub apresentadas pelo proprietário mostram **três PATs fine-grained expirados** e **nenhum PAT clássico cadastrado** na inspeção. Isso não identifica qual registro, se algum, corresponde ao PAT histórico: **a identidade e a revogação específica do PAT anteriormente exposto permanecem não confirmadas**. Expiração não deve ser descrita como revogação comprovada.

Uma captura separada do Security log contém eventos `oauth_access.create`, `oauth_access.regenerate` e `oauth_authorization.create` associados aos aplicativos **Copilot Chat App** e **Copilot SWE Agent**. Esses são eventos de tokens/autorização OAuth de aplicativos GitHub; **não são evidência de criação, regeneração ou uso de PAT**. A captura não foi registrada aqui com IPs, sufixos ou valores de tokens.

Além disso, um **refresh token do Google foi compartilhado anteriormente na conversa** durante a configuração do rclone. Recomenda-se revogar a autorização do rclone na Conta Google e reconectar o remoto com autenticação nova e escopo somente leitura; não copiar nem reutilizar o valor compartilhado. A revogação/reconexão não foi executada nesta auditoria. Consulte [Backup e recuperação](../05-operacao/BACKUP_E_RECUPERACAO.md) para o estado de recuperação do Storage.

## Auditoria de funções e credenciais — 19/11/2026 (somente leitura)

**Serviço efetivo:** Supabase `portfolio` (`zfnrhzplwpjpdljraypt`), produção. O advisor `authenticated_security_definer_function_executable` continua retornando **7 WARN**; nenhuma permissão, função, RLS, Auth ou migration foi alterada. Leitura de `pg_proc`, `pg_policies` e privilégios efetivos mostrou que todas as sete RPCs abaixo são `SECURITY DEFINER`, **não executáveis por `anon`**, **executáveis por `authenticated`** e iniciam o corpo com `private.require_portfolio_admin()`:

| Função `public` | Guarda interna presente | `anon` EXECUTE | `authenticated` EXECUTE |
|---|---|---|---|
| `create_section_with_panels` | Sim | Não | Sim |
| `duplicate_section` | Sim | Não | Sim |
| `publish_section` | Sim | Não | Sim |
| `save_content_block_atomic` | Sim | Não | Sim |
| `save_home_seo_atomic` | Sim | Não | Sim |
| `save_section_block_atomic` | Sim | Não | Sim |
| `swap_section_order` | Sim | Não | Sim |

`private.require_portfolio_admin()` exige `private.is_portfolio_admin(auth.uid())`, que verifica a associação em `public.admin_users`. `admin_users` mantém RLS habilitada e policies `admin full access` (para escrita condicionada ao administrador) e `owner may read own admin membership` (somente `SELECT` da própria associação). O papel `authenticated` **não possui CREATE no schema `public`**. Os sete corpos apresentam `SET search_path` fixado, embora duas funções usem explicitamente `public, private, pg_catalog` e mereçam acompanhamento em testes sintéticos.

**Conclusão limitada:** análise estática de privilégios e guardas **SUCCESS**; não se constatou promoção direta de usuário não administrador a partir das policies inspecionadas. **Os 7 WARN permanecem ativos**, e um ensaio comportamental de usuário autenticado não administrador em Supabase CLI + Docker local com seed sintética **não foi executado**. Não classificar o risco como corrigido nem aplicar `REVOKE`/`SECURITY INVOKER` sem avaliar as chamadas legítimas do CMS e passar em regressão. [Advisor oficial](https://supabase.com/docs/guides/database/database-linter?lint=0029_authenticated_security_definer_function_executable).

**PAT histórico:** a última conferência visual documentada (18/11) encontrou três fine-grained expirados e nenhum classic listado. Os meios disponíveis nesta auditoria não expõem a identidade do segredo histórico e a inspeção não o recuperou. **Correspondência específica e revogação: NÃO CONFIRMADAS; token ativo identificado: nenhum na conferência anterior; nova auditoria pessoal de tokens: NÃO EXECUTADA.** Expiração não comprova revogação; o risco aceito no histórico permanece documentado. Uma comparação de identidade deve ocorrer apenas pelos metadados do Security log/tokens na conta do proprietário, **sem recuperar, copiar, autenticar ou publicar o token**. [Documentação GitHub de expiração e revogação](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/token-expiration-and-revocation).

## Reconfirmação de leitura — 18/11/2026

O Supabase `portfolio` possui **22/22** tabelas públicas com RLS e **41** políticas. O advisor de segurança retornou **7 WARN** em [`authenticated_security_definer_function_executable`](https://supabase.com/docs/guides/database/database-linter?lint=0029_authenticated_security_definer_function_executable) e **1 WARN** em [`auth_leaked_password_protection`](https://supabase.com/docs/guides/auth/password-security#password-strength-and-leaked-password-protection). São avisos **conhecidos e não corrigidos**, sujeitos às decisões e ao [standby](../06-governanca/BACKLOG_STANDBY.md). O aceite do PDF não os encerra nem autoriza mudança de RLS, grants ou Auth. Consultas executadas foram somente de leitura.

## Conferência visual dos PATs — 18/11/2026

Na conta GitHub inspecionada, a página de tokens
fine-grained apresentou três tokens, todos expirados.
A página de tokens clássicos não apresentou nenhum
token cadastrado.

Nenhum PAT ativo foi identificado nessas duas listas.
A correspondência entre esses registros e o PAT
historicamente exposto não foi comprovada.

A revogação específica do token histórico permanece
não confirmada. A expiração observada não deve ser
registrada como revogação.

Nenhum token foi criado, utilizado, renovado ou excluído.

---

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

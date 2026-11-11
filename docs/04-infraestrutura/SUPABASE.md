# Supabase — configuração de produção
**Status:** referência em 11/11/2026. Projeto `portfolio`, ref `zfnrhzplwpjpdljraypt`, região `us-east-1`, PostgreSQL 17, `ACTIVE_HEALTHY`.

22 tabelas públicas com RLS, 41 policies; Auth com vínculo em `admin_users`; Storage `portfolio-public` (72 objetos) e `portfolio-private` (56). Edge Function `portfolio-illustrative-import-20261026` permanecia ACTIVE v2; auditoria antiga aponta HTTP 410 sem importação, mas não remover sem avaliar dependências. Nenhuma branch cloud Supabase identificada.

## Ledger produtivo (12)
| Versão | Identificação |
|---|---|
| `202610220001` | `portfolio_cms` |
| `20261024044005` | `p0_01_atomic_content_block_save` |
| `20261024051406` | `p0_03_05_section_panels_publish_permissions` |
| `20261024052156` | `p0_05_pin_updated_at_search_path` |
| `20261024060432` | `p1_atomic_home_seo_save` |
| `20261025203559` | `p3_revoke_excess_table_privileges` |
| `20261025230446` | `p7_admin_rls_initplan_fk_indexes` |
| `20261025230528` | `p7_admin_users_own_select_initplan` |
| `20261105101829` | `delete_media_asset_everywhere` |
| `20261107042248` | `identity_catalog_stage2` |
| `20261109024100` | `p2_composite_section_block_save` |
| `20261110153000` | `remove_media_credit` |

**Baseline `202610220001` foi registrada somente no ledger após inspeção estrutural, sem reexecutar SQL.** `save_section_block_atomic` existe e requer guarda administrativa; `anon` sem EXECUTE, `authenticated` sob validação interna. `save_home_seo_atomic` controla persistência SEO. SQL não abrange bytes Storage.

Staging aprovado é Supabase CLI + Docker **local e sintético**, via [`config.toml`](../../supabase/config.toml) e `seed.local.synthetic.sql`. **Não executar `supabase/seed.sql`, `supabase link` ou `db push` como parte de testes locais.**

[Segurança](SEGURANCA_E_ACESSOS.md) · [Backup](../05-operacao/BACKUP_E_RECUPERACAO.md).

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

## Registro operacional de conteúdo desktop — 12/11/2026

**Serviço de produção:** projeto `portfolio` (`zfnrhzplwpjpdljraypt`), esquema `public`. O refinamento visual desktop alterou **somente `content_blocks.content_json` e `updated_at` de quatro blocos publicados**, encontrados por `sections.slug` + `content_blocks.sort_order` + `status='published'`. A escrita direta SQL verificou, antes do UPDATE, as cardinalidades de `items` e a ausência de valores `desktop` concorrentes, exigindo exatamente quatro blocos; a leitura posterior confirmou os dados.

| Bloco | Alteração JSONB confirmada |
|---|---|
| `perfil`/1 (5 itens) | `items[0].hero.desktop.introSize=24`; `items[1..4].desktop={titleSize:17,textSize:16,spacing:2}` |
| `perfil`/2 (11 itens) | `items[5..10].desktop.titleSize=23` |
| `formacao`/1 (3 itens) | `items[0..2].desktop.titleSize=30` |
| `formacao`/2 (2 itens) | `items[0..1].desktop.titleSize=29` |

A releitura de 12/11 confirmou os quatro blocos e nenhuma configuração `items[].mobile` adicionada; `resultados` e `sobre` permaneceram sem novas configurações desktop persistidas. **Não houve migration, DDL, RPC, permissão/RLS, Storage ou Auth alterados.** A geometria das seções restantes é tratada pelo código desktop. Essa intervenção não autoriza repetir SQL direto em futuras edições: preferir **CMS → `save_section_block_atomic`**, guardas administrativas e controle de concorrência. O P5 de homologação foi exclusivamente **read-only**; não declarar escrita testada via interface. [Modelo de dados](../03-cms/MODELO_DE_DADOS.md) · [CMS](../03-cms/GUIA_ADMINISTRATIVO.md).

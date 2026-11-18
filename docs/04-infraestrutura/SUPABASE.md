# Supabase — configuração de produção

## Inventário read-only verificado — 18/11/2026

Projeto `portfolio` (ref `zfnrhzplwpjpdljraypt`, `us-east-1`) em **ACTIVE_HEALTHY**, PostgreSQL 17. **22/22 tabelas `public` com RLS**, **41 policies**, **12 migrations**; 14 seções, 13 publicadas/visíveis, 42 painéis, 28 blocos, 56 placements, **87 `media_assets` publicados** e **4 `portfolio_projects` normalizados com `status=published` e `project_status=realizado`**. `resultados` tem dois registros `content_blocks` publicados, com arrays de **20 e 5 itens** repetidos nos placements por breakpoint. A alteração da contagem de mídia/projetos em relação aos snapshots de 11/16–11 é **fato novo de leitura**, sem atribuição de causa.

Buckets: `portfolio-public` continua público e `portfolio-private` privado. A conferência read-only de 18/11/2026 identificou **84 objetos em `portfolio-public` e 56 em `portfolio-private`**, totalizando **140 objetos Storage**. O catálogo contém **87 registros `media_assets` publicados**, sem correspondência obrigatória de 1:1 com os arquivos físicos. As contagens anteriores de 72 objetos públicos e 128 objetos totais permanecem históricas. A função `portfolio-illustrative-import-20261026` está **ACTIVE v2**, mas isso não comprova o comportamento HTTP. Nenhuma consulta executou INSERT/UPDATE/DELETE, Auth, RLS, Storage, DDL ou migration. [Modelo CMS](../03-cms/MODELO_DE_DADOS.md) · [PDF aprovado](../05-operacao/EXPORTACAO_PDF.md).

---

**Status:** referência de infraestrutura em 11/11/2026, com atualização editorial verificada em **16/11/2026**. Projeto `portfolio`, ref `zfnrhzplwpjpdljraypt`, região `us-east-1`, PostgreSQL 17. Estado `ACTIVE_HEALTHY` corresponde às consultas informadas; reconferir a saúde em intervenções futuras.

22 tabelas públicas com RLS, 41 policies; Auth com vínculo em `admin_users`; Storage `portfolio-public` (72 objetos) e `portfolio-private` (56). Edge Function `portfolio-illustrative-import-20261026` permanecia ACTIVE v2; auditoria antiga aponta HTTP 410 sem importação, mas não remover sem avaliar dependências. Nenhuma branch cloud Supabase identificada.

## Conteúdo publicado de Resultados — releitura de produção em 16/11/2026

**Releitura de produção em 16/11, repetida sem escrita na consolidação posterior:** o bloco A permanece com 20 itens (quatro selecionados para visão geral) e o B com cinco temas compactos, sem mudança de schema ou status. Os totais são contagens do conteúdo publicado, não validação externa dos números das campanhas.

A seção `resultados` manteve **dois registros publicados** em `content_blocks`: **bloco A com 20 itens** (quatro por categoria `corporativa`, `projetos`, `eventos`, `marketing`, `imprensa`) e **bloco B com cinco temas**, todos `themePresentation="metrics"`. Quatro métricas do A têm `showInOverview=true`, na ordem R$ 12 milhões, +225%, 100+ ao vivo e 25 eventos. No B, `corporativa` tem o eixo “Estratégia e Reputação”, título interno “Comunicação que conecta” e subtítulo editorial atualizado; os demais títulos temáticos foram mantidos. Os dados foram relidos após a atualização de produção.

A escrita inicial desses dois JSONB foi **UPDATE restrito em transação com guardas de `updated_at` e hash do estado anterior**, sem DDL, migration, alteração de grants, RLS, Auth, Storage ou novas tabelas. Os textos editoriais preexistentes dos temas foram preservados. Edições futuras devem seguir o fluxo normal de CMS/RPC `save_section_block_atomic`, com salvamento e controle de concorrência independentes por bloco; não presumir que editar A+B via painel seja transação única. [Modelo de dados](../03-cms/MODELO_DE_DADOS.md) · [guia administrativo](../03-cms/GUIA_ADMINISTRATIVO.md).

A coleção `career_experiences` mantém **seis registros publicados**; datas de atualização anteriores à revisão de indicadores desta conversa (Invest RS: 05/11; Vale, Prefeitura, Globo/SporTV e Grupo InPress: 31/10; CDI: 31/10). As descrições ainda precisam de **curadoria editorial** para reconciliar os relatos, valores e atribuições. Isso **não** é uma alteração já realizada na coleção. Indicadores publicados não substituem documentação comprobatória de suas fontes.

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

## Registro histórico de conteúdo desktop — 12/11/2026 (substituído parcialmente por ajustes de 16/11)

**Serviço de produção:** projeto `portfolio` (`zfnrhzplwpjpdljraypt`), esquema `public`. O refinamento visual desktop alterou **somente `content_blocks.content_json` e `updated_at` de quatro blocos publicados**, encontrados por `sections.slug` + `content_blocks.sort_order` + `status='published'`. A escrita direta SQL verificou, antes do UPDATE, as cardinalidades de `items` e a ausência de valores `desktop` concorrentes, exigindo exatamente quatro blocos; a leitura posterior confirmou os dados.

| Bloco | Alteração JSONB confirmada |
|---|---|
| `perfil`/1 (5 itens) | `items[0].hero.desktop.introSize=24`; `items[1..4].desktop={titleSize:17,textSize:16,spacing:2}` |
| `perfil`/2 (11 itens) | `items[5..10].desktop.titleSize=23` |
| `formacao`/1 (3 itens) | `items[0..2].desktop.titleSize=30` |
| `formacao`/2 (2 itens) | `items[0..1].desktop.titleSize=29` |

A releitura de 12/11 confirmou os quatro blocos e nenhuma configuração `items[].mobile` adicionada; `resultados` e `sobre` permaneceram sem novas configurações desktop persistidas. **Não houve migration, DDL, RPC, permissão/RLS, Storage ou Auth alterados.** A geometria das seções restantes é tratada pelo código desktop. Essa intervenção não autoriza repetir SQL direto em futuras edições: preferir **CMS → `save_section_block_atomic`**, guardas administrativas e controle de concorrência. O P5 de homologação foi exclusivamente **read-only**; não declarar escrita testada via interface. [Modelo de dados](../03-cms/MODELO_DE_DADOS.md) · [CMS](../03-cms/GUIA_ADMINISTRATIVO.md).

## Auditoria read-only de conectividade — 13/11/2026

**Ambiente consultado:** produção `portfolio` (ref `zfnrhzplwpjpdljraypt`, organização `tuliustsangaropulos` / `gupklckstcjwwitbnrdo`). O conector retornou `ACTIVE_HEALTHY` e o SQL somente de leitura `SELECT 1` respondeu com sucesso; PostgreSQL reportado pela conexão: **17.11**.

- A listagem atual do esquema `public` apresentou **22 tabelas**, todas com `rls_enabled=true`. Isso confirma a presença de RLS, **não** equivale a auditoria completa das políticas ou permissões efetivas.
- Consultas `COUNT(*)` read-only retornaram **1 página**, **1 registro** em `site_settings` e **28 blocos** em `content_blocks`, apenas como evidência de leitura e inventário pontual; nenhum conteúdo de registros foi publicado.
- `get_advisors(type=health)` retornou **0 avisos** (`lints=[]`). As contagens de policies/objetos Storage e a condição da Edge Function acima permanecem evidências históricas de 11/11 e não foram revalidadas neste teste.
- A organização continua denominada `tuliustsangaropulos`. A identidade da sessão Supabase e o papel de Owner de `tuliust@gmail.com` não puderam ser verificados por estes endpoints; **não declarar transferência concluída**.
- Nenhuma escrita, migration, RLS, Auth, Storage ou configuração foi alterada. Não executar teste de gravação no banco de produção para verificar conector.


## Ajustes editoriais do Perfil/Sobre em produção — 16/11/2026 (histórico do ciclo)

Intervenção aprovada no projeto `portfolio` (`zfnrhzplwpjpdljraypt`), restrita a três registros existentes de `content_blocks` via UPDATE JSONB sob verificações de `updated_at` e valores anteriores: Perfil/A (`hero.desktop.introSize` 16→15 e novo `yearsSize=55`); Perfil/B (seis `desktop.titleSize` 23→21); Sobre/B (cinco `desktop.textSize=14`). A intenção é manter a fonte única de verdade no CMS. Não há DDL, migration, alterações em RLS, Auth, Storage ou outros JSONB. A atualização foi tratada separadamente do ensaio autenticado de salvamento pelo admin. Para os valores realmente vigentes, conferir `content_json` na produção: os números da operação de 12/11 são históricos, pois parte deles foi alterada em 16/11.


## Tamanho editorial do Hero desktop — 16/11/2026

No projeto produtivo `portfolio`, o bloco publicado `perfil`/A (sort_order=1, ID `a2f4770b-7964-4f3c-b816-c778b66ac15c`) teve **somente** `content_json.items[0].hero.desktop.yearsSize` alterado de **55 para 51**, com verificação do `updated_at` e valores anteriores, preservando todas as demais propriedades JSONB e valores mobile. A alteração foi solicitada e é lida tanto pelo frontend quanto pelo controle existente do painel. A subida e redução discreta do selo são CSS, sem atualização de dados, Storage, Auth, RLS, schema ou migrations. A alteração foi conferida no ciclo original com registro de CI e publicação nos documentos de [homologação](../05-operacao/TESTES_E_HOMOLOGACAO.md). Este histórico não equivale a teste de salvamento pela interface administrativa nem a uma nova verificação desses valores nesta rodada.

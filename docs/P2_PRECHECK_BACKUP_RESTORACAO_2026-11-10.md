# P2 — Backup e pré-verificações: evidência de execução

**Data:** 10/11/2026. **Projeto:** PortfolioTulius · Supabase `zfnrhzplwpjpdljraypt` · PostgreSQL 17.

## O que foi efetivamente verificado

- Os dumps `roles.sql` (370 bytes), `schema.sql` (78.429 bytes) e `data.sql` (430.369 bytes) correspondem ao arquivo `SHA256SUMS.txt` pela leitura local dos arquivos obtidos do Google Drive. A cópia de segurança duplicada no mesmo Drive foi conferida por metadados/permissões, leitura e hashes.
- **22/22** tabelas do schema `public` tiveram contagens de linhas idênticas entre as instruções `COPY` do dump e consultas SQL somente leitura na produção. Também coincidem `auth.users` (1), `storage.buckets` (2), `storage.objects` (128): **25/25 comparações, sem divergências**.
- A análise de dump encontrou 55 blocos `COPY`, 22 tabelas de aplicação, e confirmou que `supabase_migrations` não está incluído no dump SQL padrão.
- O verificador Node.js, executado contra os três dumps, retornou hashes PASS e 25/25 contagens PASS. Um teste negativo com cópia adulterada de `data.sql` retornou erro `SHA-256 mismatch`, sem modificar os backups originais.
- Supabase: 9 migrations registradas, RPC P2 `public.save_section_block_atomic` inexistente e coluna `block_placements.updated_at` inexistente. **Nenhum DDL produtivo aplicado**.
- [P5 Local Transactional](https://github.com/tuliustsangaropulos/PortfolioTulius/actions/runs/42900885031), [Validate](https://github.com/tuliustsangaropulos/PortfolioTulius/actions/runs/42900885125), [CMS read-only](https://github.com/tuliustsangaropulos/PortfolioTulius/actions/runs/42900885373), [exportação](https://github.com/tuliustsangaropulos/PortfolioTulius/actions/runs/42900885241) e [P3 Lighthouse](https://github.com/tuliustsangaropulos/PortfolioTulius/actions/runs/42900884970) do SHA `9a9d4c6e` terminaram SUCCESS. O LCP mobile mediano mais recente foi **3.385,556 ms**, abaixo de 3.500 ms. Isso não apaga o risco histórico formalmente aceito.

## Mapa de migrations

| Estado | Arquivo / versão |
|---|---|
| 8 versões compartilhadas | Supabase remoto e GitHub `supabase/migrations` possuem nomes/versões coincidentes |
| Baseline local, não registrado remotamente | `202610220001_portfolio_cms.sql` |
| Mesmo nome funcional, versões divergentes | Git `20261105101500_delete_media_asset_everywhere.sql` versus remoto `20261105101829_delete_media_asset_everywhere` |
| Ainda não instalada | `20261109024100_p2_composite_section_block_save.sql` |

**Ação segura:** conservar o histórico real de cada lado; não introduzir backfill em `supabase_migrations.schema_migrations` nem executar o baseline antigo sobre a produção. Verificar equivalência de DDL do arquivo timestamp-divergente em um ambiente isolado, antes da P2.

## Inventário agregado de Storage (somente leitura, sem baixar objetos)

| Bucket | Objetos | Total de bytes informado nos metadados |
|---|---:|---:|
| `portfolio-private` | 56 | 2.840.299 |
| `portfolio-public` | 72 | 1.821.052 |
| **Total** | **128** | **4.661.351** |

- **75/75** mídias de `public.media_assets` possuem ponteiro correspondente em `storage.objects` (0 referências de catálogo faltantes).
- **53 objetos** de Storage não possuem correspondência em `media_assets`. Eles **não foram classificados como órfãos** nem excluídos: podem ser versões, uploads históricos ou objetos usados por outras referências. Devem integrar a cópia física dos dois buckets.
- Esta é uma verificação de inventário **por metadados**, não download nem hash dos conteúdos. Preservar integralmente até análise de dependências.

## O que NÃO foi provado

1. **Não houve restauração em PostgreSQL 17 isolado.** O runtime deste assistente não dispõe dos binários do servidor PostgreSQL e não consegue obter pacotes pela rede; o conector Supabase não importa arquivos `pg_dump` em um banco de teste. Portanto, backup integralmente **recuperável continua não comprovado**.
2. O dump conserva **metadados** de Storage, mas não os bytes dos 128 objetos. É necessário transferir e conferir separadamente os arquivos de ambos os buckets.
3. O dump padrão não recupera sozinho os registros `supabase_migrations`; esse histórico requer plano de reconstrução/reconciliação baseado na auditoria.
4. Não se executou rollback real da P2, pois a migration ainda não foi aplicada nem ensaiada com estes dados reais em ambiente isolado.
5. As duas cópias de Drive pertencem à mesma conta; não são defesa independente contra perda da conta. O dump contém dados pessoais de autenticação; manter privado e preferencialmente criptografado.

## Como repetir a conferência somente leitura

Execute no computador que contém a cópia local dos dumps e Node.js instalado:

```powershell
node scripts/hygiene/verify-supabase-backup.mjs --dir "$HOME\PortfolioTulius-backup" --expected docs/evidence/p2-backup-counts-2026-11-10.json
```

Esperado: `checksums: PASS`, `rowCountComparison: PASS`, `tablesCompared: 25`. É apenas uma checagem pré-restauração.

## Próximo gate obrigatório

1. Preparar uma instância PostgreSQL 17 **isolada e compatível com Supabase** (serviços `auth`, `storage`, `vault`, extensões e funções compatíveis), sem conexão de escrita com a produção.
2. Restaurar `roles.sql`, `schema.sql`, `data.sql` na instância isolada, com `psql --single-transaction --set ON_ERROR_STOP=1`, observando as particularidades de papéis/schemas do Supabase. Verificar dados, constraints, políticas, sequences, funções e 25 contagens.
3. Ensaio de aplicação e reversão da migration P2 na restauração, incluindo CAS, RLS, chamadas repetidas e falhas simuladas. Documentar retorno à versão anterior.
4. Inventariar e copiar os objetos físicos do Storage. Não realizar escrita produtiva ou migração antes da prova completa de recuperação.

## Observação de segurança adicional

O Supabase Security Advisor identificou seis avisos de funções `SECURITY DEFINER` executáveis por `authenticated` e proteção de senha vazada desativada. **Não se conclui vulnerabilidade automaticamente**: requer revisar as funções e suas verificações internas de admin; não foram alteradas nesta execução.

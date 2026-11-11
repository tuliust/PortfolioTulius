# PortfolioTulius — retomada verificada da restauração isolada (10/11/2026)

> Registro incremental de execução. **Não é prova de restauração concluída nem autorização para ignorar gates.** Repositório público: sem conteúdo dos dumps, credenciais ou dados pessoais.

## Escopo e baseline consultado

- GitHub `main`, HEAD pré-documental `ec754448c3ed0cbd973147bd3633adff3bfe12ba`, conforme API GitHub. `AGENTS.md` consultado; a branch de trabalho é `main`.
- Supabase `portfolio`, ref `zfnrhzplwpjpdljraypt`, ambiente **produtivo**, PostgreSQL 17.11, estado `ACTIVE_HEALTHY`; consultas exclusivamente `SELECT`.
- Nove migrations remotas. `20261105101829_delete_media_asset_everywhere` alinhada no GitHub. `202610220001_portfolio_cms.sql` continua somente no Git: **não executar novamente nem inserir linhas arbitrárias em `supabase_migrations.schema_migrations`**.
- RPC `public.save_section_block_atomic` ausente, coluna `public.block_placements.updated_at` ausente; P2 `20261109024100` **não aplicada**. Produção: 14 seções, 28 blocos, 56 placements, 75 mídias e 128 objetos de Storage; 60 linhas de mídia com `credit` preenchido. Nenhuma escrita produtiva nesta rodada.
- Vercel: deployment de Production `dpl_CRtSbmSYFY5RVbK1tbNM4ztQL9n9`, `READY`, commit `ec754448c3ed0cbd973147bd3633adff3bfe12ba`. GitHub Actions nesse SHA: [Validate #42904288247](https://github.com/tuliustsangaropulos/PortfolioTulius/actions/runs/42904288247) **success**, [P5 Local Transactional #42904288211](https://github.com/tuliustsangaropulos/PortfolioTulius/actions/runs/42904288211) **success**, [Export #42904288456](https://github.com/tuliustsangaropulos/PortfolioTulius/actions/runs/42904288456) **success**. Esses resultados **não migram automaticamente** para um SHA posterior.
- Os backups privados permanecem nas duas pastas Drive já documentadas. Integridade histórica SQL: 25/25 comparações entre os `COPY` exportados e a produção, **não** entre o banco restaurado e a produção.

## Diagnóstico específico de `roles.sql`

Os arquivos privados originais foram lidos a partir da pasta Drive aprovada, sem publicá-los. Hashes originais conferidos neste runtime:
- `roles.sql`: `168a95a9c745af5ed4679751f90419ac9dc434240a213b03e32a06d5664c2308`
- `schema.sql`: `779c6ac50d707453641922225cc719998c1980d4dcdf4639818367a8a70b4d86`
- `data.sql`: `b37bca458ce354e370d4a13a672d06fb577b5ff82150a0bf555a7977d6f3c2ac`

`roles.sql` possui 15 linhas e **um único** comando a adaptar localmente, na linha 13:

```sql
GRANT SET ON PARAMETER "log_min_messages" TO "supabase_realtime_admin";
```

Esse comando requer privilégio de concessão sobre o parâmetro no cluster PostgreSQL e foi recusado pelo papel usado no Supabase local 17.6. O comando configura uma prerrogativa de runtime da role de Realtime, **não carrega dados editoriais nem cria tabelas**. Para o ensaio local, pode-se gerar `roles.local.isolated.sql` a partir do original substituindo **somente esse comando por comentário**; preservar os três SQL originais, os hashes e o restante dos `ALTER ROLE ... statement_timeout`. Não executar nem reaplicar essa alteração no banco remoto. A ausência desse grant na restauração deve constar como ressalva de paridade de privilégios de cluster.

O `data.sql` possui **55 blocos COPY** e comandos de sequências; inicia com `SET session_replication_role = replica`, que exige papel local suficientemente privilegiado. Logo, o erro de `GRANT` não é garantia de que o arquivo completo restaurará: verificar superusuário efetivo, roles, extensões e schema Auth/Storage no local. O esquema exportado contém 22 tabelas públicas, extensões, policies, funções e triggers, além de dependências Supabase. A última tentativa anterior, interrompida por `ON_ERROR_STOP=1` e `--single-transaction`, não é comprovação de recuperação.

## Gates para reexecução **somente no Windows local**

Destino exclusivamente `supabase_db_PortfolioTulius-restore-isolado`, PostgreSQL 17, mapeamento **exato** `127.0.0.1:30002`; verificar com `docker inspect`, `docker port` e `psql` dentro do contêiner. Confirmar que esse destino não possui tabelas `public` da aplicação nem usuários/objetos reais; se houver, interromper **sem `DROP`, `TRUNCATE` ou reset**. Conferir todos os SHA-256 **antes** da cópia. Preferir um executor local que falhe se o container, a porta, o hash ou o papel esperado divergirem.

Executar com `psql -X -v ON_ERROR_STOP=1 --single-transaction` sobre a cópia local de roles, seguida de `schema.sql` e `data.sql`, na mesma conexão e no contêiner isolado. Se der erro, **não** ignorá-lo e **não** executar P2; registrar a mensagem localmente sem publicar valores do dump. Após o sucesso, conferir 25 contagens, roles, RLS nas 22 tabelas, funções, triggers, índices, sequências e integridade referencial, inclusive links Auth/Storage. Uma correspondência de contagens não valida automaticamente todos os FKs, bytes de Storage ou comportamento de RPCs.

Ensaiar a migration P2 e o retorno no mesmo ambiente isolado: erros após update parcial, CAS, concorrência, idempotência, RLS/autorização e preservação dos dados pré-existentes. Importante: rollback da P2 não deve desfazer **gravações editoriais legítimas ocorridas posteriormente**.

## Segurança e escopo não resolvido

- O restore local do Windows **não foi executado por este runtime**, que não tem conexão com Docker/psql na máquina do proprietário. Foi testada a preparação de uma cópia derivada de `roles.sql`: hash preservado, uma única instrução removida, execução repetida consistente. Esses testes de preparação não são prova de restore.
- O dump SQL não inclui os **bytes** dos 128 objetos físicos de Storage, nem o histórico completo de `supabase_migrations`. A cópia física e o plano de continuidade permanecem necessários.
- Security Advisor atual: 6 avisos de função `SECURITY DEFINER` exposta a autenticados (revisar guarda admin), 1 de proteção contra senha vazada desativada (risco histórico aceito); Performance Advisor: 8 índices ainda sem uso observado e 19 avisos de políticas permissivas múltiplas. **Nenhuma alteração automática de políticas/índices**. [Advisory de funções](https://supabase.com/docs/guides/database/database-linter?lint=0029_authenticated_security_definer_function_executable), [advisory de policies](https://supabase.com/docs/guides/database/database-linter?lint=0006_multiple_permissive_policies).
- A migration P2 já tem **aceite humano**; somente o **gate técnico de recuperação/rollback** impede sua aplicação. A decisão de eliminar `media_assets.credit` é definitiva, mas o `DROP COLUMN` e os 60 valores históricos ficam protegidos até prova de recuperação.
- Nenhuma mídia, texto, design, tipografia ou objeto de Storage foi modificado nesta rodada. Os documentos privados de produto/design e snapshots históricos não foram publicados no GitHub.

**Próxima ação indispensável:** executar o restore **no ambiente isolado já existente** e incorporar o relatório de execução assinado por logs/hashes, então ensaiar P2 e a reversão. Não declarar finalizado antes desses gates.

## Validação offline do relatório sanitizado

Após a execução local produzir `restore-p2-isolated-evidence.json`, validar somente esse JSON — nunca os dumps ou `restore-p2-isolated-error.log` — com:

```powershell
node scripts/hygiene/restore-evidence.mjs --evidence 'C:\Users\Tulius\PortfolioTulius-backup\restore-p2-isolated-evidence.json'
```

O validador exige restore `COMMITTED`, projeto correto, hashes originais PASS, PostgreSQL 17, 25/25 contagens, zero violações de chave estrangeira e os indicadores estruturais do snapshot. Campos extras são rejeitados para impedir que logs, caminhos ou diagnósticos privados sejam confundidos com evidência compartilhável. Uma aprovação gera apenas um resumo sanitizado e mantém explicitamente `storageBytesGate`, `migrationHistoryGate` e `p2ProductionGate` como `BLOCKED`.

## Validação offline da evidência física de Storage

Depois de concluir a cópia privada, gere e valide somente o resumo sanitizado. O manifesto e o diretório de objetos permanecem locais:

```powershell
node scripts/hygiene/storage-backup.mjs `
  --verify-backup 'C:\Users\Tulius\PortfolioTulius-backup\storage-objects' `
  --manifest 'C:\Users\Tulius\PortfolioTulius-backup\storage-manifest.json' |
  Set-Content -Encoding utf8 'C:\Users\Tulius\PortfolioTulius-backup\storage-backup-evidence.json'

node scripts/hygiene/storage-evidence.mjs `
  --evidence 'C:\Users\Tulius\PortfolioTulius-backup\storage-backup-evidence.json'
```

O segundo comando só aprova `storageBytesGate` com projeto `zfnrhzplwpjpdljraypt`, 128 objetos, 4.661.351 bytes, backup completo e vínculo ao manifesto. Campos extras são rejeitados para impedir exposição acidental de caminhos. Mesmo aprovado, banco, histórico, rollback e P2 continuam `BLOCKED`.

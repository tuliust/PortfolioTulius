
> **EXECUÇÃO AUTÔNOMA — 11/11/2026 15:41 BRT (ESTADO MAIS RECENTE):** backup e recuperação concluídos em ambiente local isolado, P2 e remoção de crédito aplicadas somente no Supabase `portfolio` (`zfnrhzplwpjpdljraypt`), com estado final relido. PostgreSQL 17.6 sem portas publicadas, rede Docker interna; restore COMMITTED: 25/25 contagens, 39 FKs sem violações, 22/22 tabelas públicas com RLS e 41 policies. Foram carregadas 829 linhas em 46 blocos COPY compatíveis; 9 blocos antigos sem linhas foram omitidos, campos Storage legados sem efeito foram adaptados, e o original permaneceu intacto. O grant de cluster `log_min_messages` é a única diferença explícita de privilégios. Backup físico Storage privado: 128/128 objetos, 4.661.351 bytes, manifesto completo, 53 pares SHA-256 iguais e zero pares divergentes; manifesto, nomes, hashes e bytes ficaram fora do Git. P2 foi aplicada e testada no restore com escrita, rollback atômico de payload inválido, CAS obsoleto, rejeição de usuário não administrador e rollback de schema preservando uma escrita posterior; o snapshot editorial original do clone foi restaurado. Também foi ensaiado o DROP local de `media_assets.credit` e o rollback recuperou exatamente 60 valores em 75 linhas. Em produção, P2 e `remove_media_credit` estão registradas nos timestamps exatos do Git (`20261109024100` e `20261110153000`); a ferramenta de aplicação inicialmente usou timestamps de execução e eles foram reconciliados em duas linhas exatas, sem reexecutar DDL ou tocar nas outras nove entradas.
>
> **SUPABASE PROD — RELEITURA PÓS-MIGRATIONS:** 11 migrations, incluindo as duas versões do Git e sem replay do baseline `202610220001`; RPC P2 presente, trigger e `block_placements.updated_at` preenchidos em 56/56 placements; 75 mídias e 128 objetos Storage mantidos; coluna `credit` ausente. `anon` não tem EXECUTE no RPC; `authenticated` tem, com guarda admin em função privada. Nenhum conteúdo editorial foi alterado em produção. Advisor após P2: 7 avisos de funções SECURITY DEFINER executáveis por autenticados (inclui P2, protegida pela guarda admin), 1 aviso de proteção contra senha vazada desativada; desempenho: 8 índices não usados e 19 grupos de policies permissivas; advisor de saúde sem avisos. Não foram alteradas policies, Auth ou índices.
>
> **VALIDAÇÃO DE APLICAÇÃO/PUBLICAÇÃO:** P5 Local #43080283012 SUCCESS (121/121; 8 base + 13 P2 + 87 UI/CMS + 8 mídia + 5 SEO); P5 Admin Read-Only #43080283005 SUCCESS. P3 #43080282952 SUCCESS, LCP móvel mediano 3.492,135 ms (score 89; teto 3.500 ms; amostras 3.593,147 / 3.327,197 / 3.492,135 ms, faixa 3.327–3.593 ms; a primeira excedeu o teto), desktop 926,951 ms (score 98). Vercel Production `dpl_Bwa6WbkgWpCEFE5i3YJPB42JNWDC` READY e domínio confirmou o SHA testado `83f60d179e0fc161fd80a3454df4f328004cefdd`. Validate #43080282993 e Export #43080282996 SUCCESS para o mesmo SHA. Os gates de Lighthouse usam a mediana de três amostras; a amostra acima do teto permanece registrada. Evidências detalhadas e arquivos de recuperação permanecem somente no diretório privado local; não publicar dumps, nomes de objetos, hashes individuais ou dados editoriais.
>
> **RESSALVAS VIGENTES:** `202610220001` permanece apenas no Git e explicitamente `DO_NOT_APPLY`; não executar `supabase db push` enquanto esse drift existir. O grant cluster-level não foi restaurado. A produção mantém os avisos de advisors citados acima. Esta atualização prevalece sobre estados históricos abaixo.
> **RETOMADA — 11/11/2026, 15:02 BRT:** HEAD atual de `main`: `80a2b38948abd334e67248e5132e080d74ec3b65` (documentação; código validado em `311981cdb7e4eee27420d416b61894dc391197cf`). Cópia física local privada dos 128 objetos Storage (72 públicos + 56 privados), 4.661.351 bytes; hashes SHA-256 computados por arquivo; verificação oficial cruzada com manifesto: `complete:true`, `manifestMatched:true`, `storageBytesGate PASS`. Manifesto, bytes, nomes e hashes por objeto ficaram fora do Git; evidência sanitizada local. Restore SQL real não iniciado: o container alvo original publica a porta em todas as interfaces, não exclusivamente loopback. Nenhuma migration/escrita Supabase foi executada. Validate #43073319942 e export #43073320015 SUCCESS para HEAD; P5 #43072561652 SUCCESS, **121/121** (8 base + 13 transacionais + 87 navegador/CMS + 8 mídia + 5 SEO), stack sintético local sem conexões cloud; o primeiro ensaio #43071207433 falhou por timeout transitório aguardando confirmação e a repetição passou sem mudança de código. P3 #43072567224 SUCCESS: mediana móvel **3.429 ms** (budget 3.500; score 90), desktop **900 ms** (score 99); a repetição passou após amostra anterior acima do limite. Vercel Production `READY` para HEAD atual. Recuperação do banco, rollback real, P2 e remoção de crédito seguem bloqueados.
# PortfolioTulius — retomada verificada da restauração isolada (10/11/2026)

> Registro incremental de execução. **Não é prova de restauração concluída nem autorização para ignorar gates.** Repositório público: sem conteúdo dos dumps, credenciais ou dados pessoais.

## Retomada local — 11/11/2026 14:30 BRT

- `main` foi buscada novamente e está em `9f9c624f90ecd0a8934968c951ac5f9006f15da7`, sem alterações concorrentes no início desta rodada. O status combinado do GitHub é SUCCESS; a Vercel confirma o deployment de Production `dpl_5dWrVycm4jXw35gD2F8GTVAK2JHv` como `READY` para o mesmo SHA.
- Os SHA-256 de `roles.sql`, `schema.sql` e `data.sql` na cópia local correspondem a `SHA256SUMS.txt`. A pasta contém somente esses três dumps e o arquivo de hashes; não contém `storage-objects`, manifesto físico nem evidência de cópia dos bytes dos 128 objetos.
- Após iniciar Docker Desktop, o contêiner alvo `supabase_db_PortfolioTulius-restore-isolado` respondeu como PostgreSQL `17.6`. A consulta somente leitura encontrou zero tabelas base no schema `public`, zero linhas em `auth.users` e zero linhas em `storage.objects`.
- **O restore foi deliberadamente interrompido antes de qualquer escrita:** `docker inspect` e `docker port` mostram o host port `30002` vinculado a `0.0.0.0` e `::`, não exclusivamente a `127.0.0.1` como exige o gate local previamente documentado. Não foram executados `psql` de importação, `DROP`, `TRUNCATE` ou reset. O contêiner não atende ao requisito de isolamento até que o vínculo de rede seja corrigido e confirmado sem perda de volumes ou dados locais.
- A CLI Supabase local lista projetos de uma conta diferente e não está vinculada ao ref `zfnrhzplwpjpdljraypt`; não foi vinculada nem usada para acessar Storage. A conexão MCP do projeto `portfolio` foi usada somente para confirmar identidade/estado e migrations. Nove versões remotas seguem registradas, e nenhuma das duas migrations pendentes foi aplicada.
- Resultado: gates de restore PostgreSQL, bytes/hash do Storage, histórico de migration no restore e ensaio real de rollback permanecem **BLOCKED**. Nenhuma escrita produtiva ocorreu. Próxima ação: ajustar ou substituir o ambiente isolado preservando seus dados/volumes, confirmar o vínculo estrito a loopback, executar o restore e então seguir os validadores e ensaios já documentados.

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

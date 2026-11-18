# Backups, restore e rollback

## Pendência física atual — inventário de 18/11/2026

Leitura de metadados de produção: **143 objetos Storage** (87 no bucket público, 56 no privado), 15.946.053 bytes agregados de metadados. **Não há comprovante de backup atual de 143/143 objetos**; o registro histórico de 128/128 abaixo não cobre novos uploads. A tentativa anterior de download individual via Supabase CLI `storage cp --remote` falhou com `Authorization failed for the access token and project ref pair`; não houve novo arquivo físico confirmado. Antes de baixar, validar privilégios legítimos do operador no projeto; não copiar tokens, alterar RLS/Storage nem assumir que inventário SQL equivale a backup. Exigir verificação independente de caminhos e tamanhos, manifesto SHA-256 calculado dos arquivos locais e segunda cópia protegida. Não versionar bytes, manifesto privado ou credenciais.

**Status:** evidência de recuperação histórica e procedimentos; **não é backup físico** · **Revisão:** 11/11/2026.

## Git e fontes
[Commit-base `0627947`](https://github.com/tuliustsangaropulos/PortfolioTulius/tree/0627947897f04635a1dfe720e4d771cf12e3e705) e [manifesto pré-consolidação](../historico/preconsolidacao-2026-11-11/ESTADO_PRE_CONSOLIDACAO.md), com [384 caminhos/hashes Git](../historico/preconsolidacao-2026-11-11/ARQUIVOS_GIT_PRE_CONSOLIDACAO.csv). O CSV **não copia os bytes do repositório**: manter clone/mirror controlado para recuperação independente.

Os oito Markdown privados anexados ao Projeto ChatGPT foram preservados em ZIP separado, **fora do GitHub público**.

## Supabase e Storage
Documentos de 11/11 registraram:
- Restore SQL em PostgreSQL **17.6 isolado**, 25/25 tabelas e 39 FKs válidas.
- Backup **128/128 objetos Storage, 4.661.351 bytes**, com manifesto/hash privados.
- Testes P2, CAS, rollback e recuperação de crédito no clone, antes da remoção produtiva da coluna.
- Baseline `202610220001` reconciliada só no ledger; não executar novamente seu SQL.

**Limite:** esses bytes privados e hashes individuais não foram reinspecionados na consolidação documental. Restore SQL não reconstitui sozinho objetos Storage, Auth, chaves ou Vercel.

## Protocolo de recuperação futura
Identificar SHA/ambiente/objeto do incidente; preservar logs e backups privados; restaurar em clone compatível isolado/loopback; conferir linhas, FKs, RLS, migrations, objetos/hashes; ensaiar rollback de operações SQL e compensação Storage. Somente então propor ação produtiva específica.

**Nunca usar** `supabase seed.sql`, `link`, `db push` ou exclusão para validar mera documentação. [Relatório anterior](../P2_RESTORE_CONTINUIDADE_2026-11-10.md) · [Supabase](../04-infraestrutura/SUPABASE.md).

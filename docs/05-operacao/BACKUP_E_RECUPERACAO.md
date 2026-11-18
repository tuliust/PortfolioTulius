# Backups, restore e rollback

## Backup físico atual — 18/11/2026 (evidência local do proprietário)

**Cópia física e conferência dos 143 objetos: SUCCESS, segundo o log PowerShell/rclone apresentado pelo proprietário às 08:33 (horário de Brasília).** Origem: Supabase Storage de produção acessado pelo remoto S3 já configurado; destino: pasta local **fora do repositório**. O `rclone copy` terminou com **87/87 arquivos públicos** e **56/56 privados** transferidos (143/143). Em seguida, `rclone check --download` releu os dois buckets e retornou **0 differences found**, **87 matching files** no público e **56 matching files** no privado. O inventário local contabilizou **15.946.053 bytes** totais, coincidentes com os metadados de produção consultados anteriormente. O script de verificação contou 143 arquivos e informou ter gerado o CSV de manifesto com SHA-256 por arquivo. Nenhum nome/caminho de arquivo privado, conteúdo ou hash foi incorporado a este documento.

**Segunda pasta local verificada em 18/11/2026, às 08:45 (horário de Brasília):** o proprietário apresentou nova execução `rclone check --download` sobre um segundo conjunto físico local dos mesmos buckets: **87/87 arquivos públicos e 56/56 privados correspondentes, 0 diferenças**. O segundo conjunto havia sido copiado via `rclone copy` e conferido previamente por tamanho (`--size-only`, 0 diferenças). **Integridade dos dois conjuntos locais: SUCCESS conforme logs apresentados.** Ambos permanecem sob o **mesmo volume local `C:`**; isso **não comprova uma cópia independente** em outro dispositivo/serviço. Inspeção independente do manifesto SHA-256, cópia protegida externa e ensaio isolado de restauração seguem **não executados ou não confirmados**, conforme o caso. Nenhum conteúdo, caminho privado de arquivos, hash ou credencial foi publicado.

**Alcance da evidência:** a execução local foi demonstrada por saída de terminal apresentada pelo proprietário; a cópia física e o manifesto não foram acessados diretamente por esta auditoria, nem ocorreu restauração de ensaio. Portanto, é comprovada a correspondência de conteúdo **na execução reportada** do `rclone check --download`, mas **segunda cópia protegida, restauração de teste e inspeção independente do manifesto permanecem pendentes**. Preservar o backup fora do Git e criar cópia adicional em mídia/volume distinto com acesso restrito; conferir a integridade novamente no destino secundário. O histórico anterior de 128/128 permanece como evidência datada, não substitui este conjunto de 143 objetos.

**Incidente anterior resolvido operacionalmente:** o `storage cp --remote` da Supabase CLI havia retornado `Authorization failed for the access token and project ref pair`. Não foi alterado Auth/RLS/Storage de produção para contornar esse erro; usou-se a conexão S3 já existente e funcional para acesso de leitura. Não confundir a alternativa de backup comprovada com correção das credenciais da CLI.

**Nota sobre a seção histórica abaixo:** o registro de 11/11/2026 documenta um backup anterior de 128 objetos e procedimentos de recuperação. Esse histórico não substitui o backup físico atual dos 143 objetos, evidenciado acima. **Revisão do histórico:** 11/11/2026.

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

# Backups, restore e rollback

## Plano de backup SQL atual — 19/11/2026 (a executar com VS Code local)

**Status: NÃO EXECUTADO.** Leitura pelos conectores confirmou Supabase `portfolio` `ACTIVE_HEALTHY` e organização no plano **Free**, sem backup diário gerenciado. Os dumps SQL históricos apresentados datam de 10/11/2026 e não constituem backup atual de produção. A evidência de Storage 143/143 (e ensaio isolado reportado) é independente do PostgreSQL.

Procedimento recomendado em máquina confiável, **fora do clone Git**: conferir a versão e o `supabase db dump --help`; obter a URL PostgreSQL no painel Supabase, sem a compartilhar na conversa ou versioná-la; exportar três arquivos datados usando `supabase db dump --db-url` com `-f roles.sql --role-only`, `-f schema.sql` e `-f data.sql --use-copy --data-only`. Seguir a [referência da CLI](https://supabase.com/docs/reference/cli/supabase-db-dump) e o [guia oficial de backup/restore](https://supabase.com/docs/guides/platform/migrating-within-supabase/backup-restore). Guardar com acesso restrito, hashes e uma segunda cópia protegida fora do mesmo volume.

**Verificação obrigatória:** a CLI omite schemas internos gerenciados como `auth` e `storage` no dump padrão. Conferir de forma explícita o que foi exportado, incluindo Auth, roles, grants, RLS, funções e metadados pertinentes, antes de classificar a cópia como integral. Objetos Storage não são reconstituídos por SQL. Um restore de dados reais exige ambiente PostgreSQL 17 segregado, procedimento compatível e autorização específica: **não misturar dados produtivos com a stack local sintética de testes P5**. Não executar `supabase link`, `db push` ou migrações para este procedimento. Nenhum segredo, conteúdo real ou caminho privado deve ir ao GitHub.

A integridade objeto a objeto da cópia Storage no Google Drive continua **não confirmada**, apesar das evidências por contagem/tamanho e do ensaio de recuperação isolado reportado pelo proprietário.


## Ensaio isolado do Storage — 19/11/2026

**Resultado reportado: SUCCESS, 143/143 objetos.** Os logs e capturas apresentados pelo proprietário indicam verificação com `rclone check` e restauração de ensaio em destino isolado para os buckets `portfolio-public` (87 objetos) e `portfolio-private` (56), totalizando 143 objetos. Esta evidência encerra a pendência de ensaio isolado **conforme a execução apresentada**; não significa que esta auditoria tenha acessado os arquivos restaurados ou repetido a comparação de hashes de cada objeto no Google Drive.

O backup externo no Google Drive continua comprovado por quantidade e soma de tamanhos (143 arquivos; 15.946.053 bytes). A igualdade criptográfica entre cada objeto do Drive e a origem continua **não confirmada**. Preservar os diretórios privados e manifesto fora do Git; nunca registrar nomes individuais, caminhos privados, hashes ou credenciais aqui.

## Conferência adicional de 19/11/2026 — inventário de produção

Consulta **somente leitura** à metadata `storage.objects` voltou a indicar **87 objetos públicos / 13.105.754 bytes** e **56 privados / 2.840.299 bytes** (total **143 / 15.946.053 bytes**). O catálogo `public.media_assets` registra **90 mídias publicadas**. Os valores coincidem com a soma de tamanhos e quantidades previamente confirmadas na cópia externa do Google Drive; **isso não é uma verificação de hash** nem um novo backup.

**Pendências ainda reais:** (1) executar comparação `rclone check --download` entre a cópia local íntegra e a pasta do Google Drive por conexão legítima de leitura; (2) realizar ensaio de recuperação isolado de objetos e, separadamente, homologar o ambiente Supabase CLI + Docker local **com seed sintética** para testes das RPCs, **sem restaurar produção no staging**. Nenhuma dessas duas execuções locais foi realizada por esta auditoria. Não utilizar `sync`, `delete`, `db push`, `supabase link` nem credenciais produtivas em ensaios.

## Cópia externa do Storage no Google Drive — 19/11/2026

**Estado: upload externo SUCCESS por inventário, quantidade e tamanho; verificação criptográfica de conteúdo NÃO EXECUTADA.** Na pasta privada `04 - Backup`, a subpasta `Storage_2026-11-18_143_objetos` foi preenchida pelo proprietário, mantendo os dois diretórios `portfolio-public` e `portfolio-private` e suas subpastas internas. A verificação de **todas as subpastas** pelo conector Google Drive confirmou:

- `portfolio-public`: **87 arquivos**, **13.105.754 bytes**.
- `portfolio-private`: **56 arquivos**, **2.840.299 bytes**.
- Total: **143 arquivos**, **15.946.053 bytes**, em correspondência com o inventário/tamanho dos dois conjuntos locais verificados anteriormente por `rclone check --download`.

A inspeção de metadados de permissões do diretório de backup existente, da pasta do Storage, das duas subpastas e de arquivos de amostra retornou **`shared=false`, apenas permissão `user:owner`**. O armazenamento no Google Drive é separado do volume `C:` onde estão os backups locais; assim, há agora uma cópia física **externa verificada por nomes de pastas, quantidades e soma de tamanhos**. As cópias históricas de `roles.sql`, `schema.sql`, `data.sql` e `SHA256SUMS.txt`, datadas de 10/11/2026, não foram sobrescritas.

**Limites:** o conector não realizou comparação byte a byte nem de SHA-256 entre cada objeto no Drive e o arquivo local; o manifesto SHA-256 local não foi inspecionado independentemente e não foi encontrado um manifesto adicional na raiz desta pasta do Storage. A equivalência exata de todos os caminhos relativos com a origem e uma **restauração isolada de ensaio** também não foram verificadas. Portanto, **integridade criptográfica e recuperabilidade externa permanecem NÃO CONFIRMADAS**. Não publicar no repositório dados dos arquivos, nomes individuais, hashes, caminhos locais privados nem links privados. Não reescrever/limpar o conteúdo histórico do Drive.

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

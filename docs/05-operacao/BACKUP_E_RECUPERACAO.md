# Backups, restore e rollback

## Confirmação do formato e presença de blocos de dados — 20/11/2026

**Resultado da inspeção local reportada pelo proprietário:** `data.sql` contém **57 instruções `COPY`** e **57 cabeçalhos de seção de dados**, subdivididos em **22 `COPY public.*`**, **26 `COPY auth.*`** e **9 `COPY storage.*`**. A soma 22 + 26 + 9 = 57. Os padrões pesquisados não encontraram `INSERT INTO` (0 no total). Os nomes das tabelas, linhas e conteúdo dos arquivos não foram compartilhados nem inspecionados por esta auditoria.

**Correção da avaliação anterior:** os zeros reportados na inspeção inicial eram um **falso negativo do padrão de busca**, não ausência de comandos. O `schema.sql` apresenta 22 declarações de tabelas `public` e 41 de políticas, e `roles.sql` apresentou 3 declarações de roles, conforme conferência anterior. A afirmação genérica de que "a CLI omite `auth` e `storage` dos três dumps" **não se aplica a `data.sql` efetivamente exportado**. A [referência de CLI](https://supabase.com/docs/reference/cli/supabase-db-dump) descreve filtros para objetos de esquemas gerenciados; o [guia oficial de backup e restauração](https://supabase.com/docs/guides/platform/migrating-within-supabase/backup-restore) prescreve separadamente `--data-only --use-copy`, tratamentos de histórico das migrations, customizações de `auth`/`storage`, chaves e arquivos físicos. A evidência local prevalece para dizer **o que existe no arquivo**, sem inferir a abrangência do `schema.sql` ou da recuperação dos serviços gerenciados.

**Comparação com produção — não conclusiva para completude:** o inventário catalogal apontou 22 tabelas `public`, 27 `auth` e 10 `storage`. O número de blocos `COPY` **não** equivale ao total de registros, à lista completa de tabelas restauráveis nem à existência de todas as dependências. Não presumir que a diferença de uma tabela em `auth` e `storage` seja erro de backup: pode decorrer de filtros, tipos de objeto ou de outras condições, ainda sem inspeção discriminada. Uma instrução `COPY` pode ter zero linhas de dados. **Restauração integral segue NÃO TESTADA.**

**Segurança:** `data.sql` pode conter dados pessoais de autenticação e metadados de Storage; preservar SQLs e manifesto fora do Git, em cópia criptografada e com senha separada. A próxima conferência local pode contabilizar somente linhas dentro dos blocos `COPY` por schema, sem divulgar nomes de tabelas nem valores. Não gerar novo dump nem restaurar em produção ou no P5 de seed sintética por inferência.


## Exportação SQL PostgreSQL — 19/11/2026 (evidência local do proprietário)

**Status: três dumps gerados; restauração integral NÃO CONFIRMADA.** O proprietário apresentou saída do PowerShell e da Supabase CLI **v3.0.0** com três comandos `db dump --db-url` dirigidos ao PostgreSQL de produção, terminando com mensagens de gravação bem-sucedida e três arquivos não vazios numa pasta local datada, fora do repositório: `roles.sql` (**297 bytes**, `--role-only`), `schema.sql` (**89.193 bytes**) e `data.sql` (**555.489 bytes**, `--data-only --use-copy`). **Total informado: 644.979 bytes.** Esse registro é evidência textual do terminal do proprietário: nenhum dump ou checksum foi lido por esta auditoria, nem foi feita verificação independente dos arquivos. O aviso `--db-url` *deprecated* não foi um erro; a CLI v3 recomenda `--remote=<db-url>` para usos futuros.

**Verificação SHA-256 informada pelo proprietário — 19/11/2026:** em saída posterior do PowerShell, os três dumps tiveram seus valores SHA-256 calculados e exibidos por `Get-FileHash`. O comando de gravação `Export-Csv` do manifesto local foi executado e retornou apenas um aviso de obsolescência de `-NoTypeInformation`, **sem erro aparente**. **Conferência posterior apresentada pelo proprietário:** o PowerShell importou o CSV com `Import-Csv` e, para cada um dos três arquivos, informou `NoManifesto=True` e `HashConfere=True` (resultado **3/3 SUCCESS** para correspondência dos hashes locais, sem duplicidade de registros por nome na verificação apresentada). Os valores individuais não são publicados neste repositório e os bytes dos arquivos/CSV não foram inspecionados independentemente. A comparação demonstra consistência entre os arquivos locais e seu manifesto **na data da execução**, não validade de uma segunda cópia, completude do backup ou capacidade de restauração. Permanecem necessários: conferir o conteúdo estrutural (especialmente `roles.sql`, de 297 bytes), manter a cópia externa privada no Drive, **preservar o arquivo `.7z` e os resultados da validação local reportada pelo proprietário**, e realizar ensaio de restauração **em ambiente isolado compatível**. Os três dumps não demonstram cobertura completa de `auth`, `storage`, grants, políticas RLS nem demais objetos gerenciados: a saída da CLI padrão e os esquemas efetivamente incluídos devem ser revisados antes de classificar como backup **integral**. Objetos binários do Supabase Storage exigem recuperação própria e não estão contidos nos arquivos SQL. A cópia externa Storage 143/143 é evidência separada.

**Procedimento seguro:** preservar os arquivos com acesso restrito, sem enviar a URL PostgreSQL, credenciais, hashes individuais, SQL, dados, caminhos privados ou nomes de objetos ao GitHub/ChatGPT. Para próximas execuções seguir [referência atual da CLI](https://supabase.com/docs/reference/cli/supabase-db-dump) e [guia oficial de backup/restore](https://supabase.com/docs/guides/platform/migrating-within-supabase/backup-restore). Qualquer teste com dados reais precisa de ambiente **segregado e autorização específica**; a stack Supabase CLI + Docker de P5 deve usar **somente seed sintética**. Não realizar `supabase link`, `db push`, alterações de RLS/Auth, migrações ou importação em produção para validar esses dumps.

A comparação criptográfica objeto a objeto da cópia do Storage no Google Drive permanece **não confirmada**.

## Cópia SQL externa no Google Drive — 19/11/2026

**Estado: upload/privacidade SUCCESS por metadados; teste do arquivo protegido e igualdade SHA-256 local↔Drive SUCCESS conforme declaração do proprietário.** Consulta direta ao Google Drive identificou **um arquivo com extensão `.7z` de 68.436 bytes** dentro da subpasta privada específica do backup PostgreSQL de 19/11/2026, sob a pasta de backup já existente. A pasta e o arquivo apresentam `shared=false`, com permissão listada exclusivamente como `user:owner`. O item não substituiu os backups históricos, e o projeto SQL local mantém evidência anterior de três dumps e manifesto com correspondência SHA-256 **3/3**.

**Validação local reportada pelo proprietário em 19/11/2026: SUCCESS.** Após instruções para abrir o `.7z` protegido no 7-Zip (solicitação de senha antes de listar nomes), executar **Testar**, baixar o arquivo do Drive e comparar o SHA-256 do pacote local com o da cópia baixada, o proprietário informou explicitamente: **“Tudo verificado. Tudo correto.”** A declaração é aceita como confirmação do procedimento local, **sem log dos hashes do arquivo `.7z` nem inspeção independente do conteúdo/algoritmo da criptografia nesta auditoria**. Os metadados do Drive foram reconferidos diretamente: arquivo de 68.436 bytes em pasta privada, ambos `shared=false`, permissões `user:owner`. Resultado operacional: **integridade da cópia externa CONFIRMADA PELO PROPRIETÁRIO**, não por auditoria criptográfica independente. Manter a senha segura e separada do backup; não incluir URLs privadas, IDs do Drive, nomes completos de arquivos particulares, conteúdo SQL ou hashes no GitHub. **A completude da exportação e a restauração integral do PostgreSQL, inclusive Auth/Storage gerenciado, permanecem NÃO CONFIRMADAS.**

## Inspeção estrutural local do dump — 20/11/2026 (evidência do proprietário)

**Resultado informado por PowerShell, sem acesso aos arquivos SQL pela auditoria:** `schema.sql` apresentou **22** linhas reconhecidas pela busca de `CREATE TABLE public`, coincidindo numericamente com as 22 tabelas `public` inventariadas na produção; o mesmo arquivo retornou **41** linhas de `CREATE POLICY`, coincidindo numericamente com as 41 policies da produção. `roles.sql` retornou **3** declarações reconhecidas por `CREATE ROLE` ou `ALTER ROLE`. Essas coincidências são evidência de **cardinalidade de instruções encontradas**, não demonstram nomes/definições equivalentes, dados completos, políticas aplicáveis ou restaurabilidade.

**Registro histórico da primeira busca (superado em 20/11):** a busca original por início de linha `COPY public.` retornou **0** blocos porque o padrão não reconheceu o formato efetivo. A nova inspeção encontrou **57 blocos `COPY`, inclusive 22 de `public`, 26 de `auth` e 9 de `storage`**. A presença de instruções não comprova o número de linhas de dados nem a restaurabilidade. O arquivo de 555.489 bytes permanece intacto e seu hash havia sido conferido; tamanho e hash não validam cobertura dos registros. A primeira busca também relatou **0** em `auth` e `storage`, valores **superados** pela identificação posterior de **26** e **9** instruções `COPY`, respectivamente. A exclusão de estruturas gerenciadas no dump padrão de schema não deve ser confundida com a presença de blocos de dados nesses schemas.

**Próxima prova segura (a executar somente no computador do proprietário):** contar, **sem imprimir linhas ou conteúdo SQL**, todas as instruções `COPY`, `INSERT INTO`, declarações de `COPY` com schema `public` citado/sem aspas e eventuais cabeçalhos de dados em `data.sql`. Registrar apenas contagens e status; não compartilhar registros pessoais, nomes dos objetos, SQL, credenciais ou hashes no repositório/chat. **O segundo exame de formato foi executado em 20/11 e identificou os 57 blocos `COPY`; continua pendente a contagem local de linhas de dados por schema e o exame de restaurabilidade.**

**Fontes privadas:** o proprietário informou ter **substituído manualmente os três snapshots atualizados**, preservando as duas outras fontes privadas já vigentes; conclusão declarada pelo proprietário, não inspeção da configuração interna do Projeto. Nenhuma nova fonte foi anexada ao Git e nenhuma configuração do site mudou.

## Avaliação de cobertura do PostgreSQL — 19/11/2026 (somente leitura; sem restore)

**Escopo efetivamente executado:** leitura dos catálogos de produção no SHA documental de referência [`ae3fbff`](https://github.com/tuliust/PortfolioTulius/commit/ae3fbff943dcfde7d6472c80d840edf53005f074), sem consultar linhas de usuários ou executar DDL/DML. Supabase `portfolio` permaneceu `ACTIVE_HEALTHY` (PostgreSQL 17); histórico de **12 migrations**. O catálogo retornou:

| Schema | Tabelas | Evidência relevante |
|---|---:|---|
| `public` | 22 | 41 policies; CMS e conteúdo existentes |
| `private` | 0 | 3 funções privadas |
| `auth` | 27 | Schema gerenciado; dados de autenticação não comprovados nos dumps |
| `storage` | 10 | 2 policies; metadados gerenciados não comprovados nos dumps |
| `realtime` | 3 | Schema gerenciado, verificar necessidade no restauro |
| `supabase_migrations` | 1 | Ledger a preservar/conferir separadamente |
| `vault` | 1 | Material criptográfico/segredos fora do escopo da cópia SQL validada |

Extensões identificadas por catálogo, sem leitura de dados ou segredos: `pg_stat_statements`, `pgcrypto`, `plpgsql`, `supabase_vault` e `uuid-ossp`. Contagens descrevem objetos **existentes em produção**, não presença correspondente nos arquivos exportados, nem distinguem automaticamente objetos personalizados de objetos gerenciados. O teste sintético P5 (14/14 RPCs no SHA funcional `226b234`) não constitui restauração dos dumps produtivos.

**Limite técnico confirmado na [CLI Supabase](https://supabase.com/docs/reference/cli/supabase-db-dump) e no [guia de migração](https://supabase.com/docs/guides/platform/migrating-within-supabase/backup-restore):** a exportação padrão de **estrutura** usa filtros para objetos gerenciados, mas o arquivo **de dados** efetivamente gerado contém blocos `COPY` em `auth` e `storage`. Os três dumps de 19/11 (roles, schema, data) são backups lógicos cuja **completude não foi comprovada**; não se deve classificá-los como ausência total de Auth/Storage nem como imagem integral do projeto. Mesmo com hashes locais 3/3 e pacote externo protegido com igualdade de SHA-256 confirmada pelo proprietário, **não** equivalem a snapshot completo de autenticação, políticas gerenciadas, dados gerenciados de Storage, configuração do serviço ou recuperação integral. O `roles.sql` de 297 bytes exige inspeção **local privada**, sem colar seu conteúdo em chats.

**Etapas para um procedimento futuro de recuperação, dependentes de autorização específica:**

1. **Inventariar localmente a cobertura real dos três arquivos**, sem compartilhar SQL, dados, IDs ou segredos: schemas, tabelas, funções, roles/grants, políticas, dependências, tamanho e integridade. Comparar com as 22 tabelas `public` e os objetos não gerenciados vigentes. A ausência de uma tabela ou role deve ser registrada como ausência, nunca compensada por suposição.
2. **Definir RPO/RTO e escopo de recuperação** antes de tocar dados: CMS/`public` e mídias separadas versus restauração integral de Auth/Storage/configurações. Revisar [migração de histórico `supabase_migrations`](https://supabase.com/docs/guides/platform/migrating-within-supabase/backup-restore), customizações em schemas gerenciados e dependências das extensões. Não executar `supabase link`, `db push` ou nova migration com base nesta avaliação.
3. **Somente com autorização explícita e ambiente real segregado**, preparar destino compatível com PostgreSQL 17 e permissões estritas, sem conexão com a stack P5 sintética, sem endereço público e sem contaminação do site atual. Validar previamente versão das ferramentas, extensões, papéis, grants, RLS e viabilidade de recuperação Auth. Não restaurar dados reais em cloud staging nem em produção por conveniência.
4. **Homologar após restore segregado**: objetos/schema esperados, integridade referencial, contagens e permissões, RPCs administrativas, navegação CMS autenticada, mídia pública/privada recuperada **se** incluída no ensaio autorizado, e evidência de limpeza segura do ambiente após a homologação. Não presumir equivalência de chaves, tokens de sessão ou configurações de serviços externos.

**Estado deste ciclo:** avaliação de cobertura e inventário catalogal **SUCCESS (somente leitura)**; criação de backup adicional de `auth`/`storage`: **NÃO EXECUTADA**; nova exportação SQL ou mutação produtiva: **NÃO EXECUTADA**; restauração integral com dados reais: **NÃO EXECUTADA**. O backup do Storage (143/143) é independente dos dumps; sua igualdade criptográfica no Drive permanece não confirmada. Nenhum item do [backlog standby](../06-governanca/BACKLOG_STANDBY.md) foi reaberto.

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

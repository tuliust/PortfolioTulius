# Backups, restore e rollback

## Novo remoto OAuth pessoal: leitura de inventário validada — 20/11/2026

**Evidência informada pelo proprietário:** após criar um novo cliente OAuth do Google no modo pessoal, tipo **aplicativo para computador**, configurou um remoto rclone separado do anterior e executou `rclone size --json` na pasta privada de cópia do Storage. A consulta retornou **`count=143`, `bytes=15946053`, `sizeless=0`**, com código de saída zero e mensagem explícita `SUCCESS` no PowerShell. Assim, a leitura de inventário pelo **novo remoto** foi **SUCCESS** e o bloqueio anterior de cota da API compartilhada **não ocorreu nesse teste**. O remoto antigo foi mantido; a identidade, a configuração secreta do cliente OAuth e o caminho privado não foram publicados.

**Limites:** a captura do novo cliente indica modo pessoal e tipo Desktop, mas a saída apresentada **não contém auditoria do escopo `drive.readonly` do novo remoto**, apenas do remoto anterior. A revogação da autorização Google antiga **continua não comprovada**. **SHA-256 por objeto da cópia no Drive: NÃO EXECUTADO**; a verificação seguinte deve conferir primeiro `drive.readonly` com `rclone config redacted` e depois calcular SHA-256 por leitura do conteúdo em ambos os lados, comparando 143 arquivos e caminhos relativos. O acesso confirmado à nova cópia remota não substitui o ensaio PostgreSQL isolado, ainda não autorizado nem executado. Não houve alteração em Supabase, dados do Drive ou backup local.


## Bloqueio de leitura Drive por cota da API — 20/11/2026

**Evidência local do proprietário (16h24 a 16h27, sem alterar arquivos):** tentativa de inventário por bucket via `rclone size --json` **interrompida antes do cálculo de hashes**. Primeiro ocorreu falha de resolução DNS para `www.googleapis.com`; em seguida, o teste `Resolve-DnsName` retornou **SUCCESS**, mas nova consulta `rclone size` ao diretório correto resultou em **HTTP 403 `RATE_LIMIT_EXCEEDED`** na API `drive.googleapis.com` (cota de *queries per minute*). A mensagem informou projeto consumidor compartilhado do Google; o próprio rclone v1.75.2 também alertou para descontinuação do `client_id` compartilhado durante 2026. A documentação oficial do rclone recomenda utilizar cliente OAuth próprio para reduzir a concorrência pela cota e evitar a interrupção futura: https://rclone.org/drive/#making-your-own-client-id.

**Interpretação e estado:** a falha decorreu de indisponibilidade temporária de resolução de nome e, após a recuperação do DNS, **cota da API excedida**, não de divergência de conteúdo ou de arquivos comprovadamente ausentes. O sucesso anterior no mesmo dia permanece limitado a **143 objetos, 15.946.053 bytes, `sizeless=0`** na pasta correta. **Comparação SHA-256 de 143/143: NÃO EXECUTADA**; não reinterpretar a falha HTTP como teste de integridade negativo. Não insistir em chamadas repetidas sob cota excedida. Planejar cliente OAuth privado, mantendo `drive.readonly`, sem divulgar ID/segredo/token; confirmar separadamente a revogação do OAuth antigo. **Nenhuma configuração do rclone foi modificada nesta rodada, nem houve escrita no Drive, Storage ou PostgreSQL.**


## Inventário remoto Storage novamente acessível — 20/11/2026

**Evidência apresentada pelo proprietário:** `rclone lsd` da pasta privada correta de Storage no Google Drive apresentou as subpastas `portfolio-private` e `portfolio-public`. Na sequência, `rclone size --json` aplicado à **pasta correta** retornou `count=143`, `bytes=15946053` e `sizeless=0`, valores coincidentes com o inventário anterior de 143 objetos (87 públicos e 56 privados; 15.946.053 bytes). A primeira tentativa da rotina de hashes interrompeu na etapa de inventário porque o caminho informado para o Drive era incorreto; o acesso foi testado depois com o caminho completo corrigido, sem divulgar o caminho privado no GitHub.

**Estado:** enumeração do diretório remoto e contagem/tamanho **SUCCESS na saída local apresentada**; identidade individual, conteúdo de cada objeto e comparação SHA-256 **NÃO EXECUTADOS/CONFIRMADOS** até novo resultado. O aviso do rclone sobre retirada de seu client_id compartilhado durante 2026 foi observado, não demonstrando falha atual de acesso, e requer acompanhamento para continuidade da conexão. Nenhuma escrita em Storage, Google Drive ou produção, reconexão OAuth ou restore foi confirmada. O acesso atual por rclone não comprova por si só a revogação do token Google histórico.


## Identificação das extensões e privilégios no SQL — 20/11/2026

**Resultado local fornecido pelo proprietário:** auditoria somente leitura de `schema.sql` e `roles.sql` de 19/11, com script PowerShell corrigido. As **4 extensões declaradas** em `CREATE EXTENSION` são `pg_stat_statements`, `pgcrypto`, `supabase_vault` e `uuid-ossp`; `plpgsql` **não está declarada**. O banco produtivo contém exatamente essas quatro e também `plpgsql` (linguagem procedural instalada por padrão no PostgreSQL). Assim, a diferença numérica 4 versus 5 **está identificada** e não demonstra por si só falha na exportação.

Contagens adicionais presentes em `schema.sql`: **1 `CREATE SCHEMA`**, **22 `CREATE INDEX`**, **0 `CREATE SEQUENCE`**, **0 `CREATE VIEW`**, **0 `CREATE TYPE`**, **12 `ALTER DEFAULT PRIVILEGES`**, **99 `GRANT`**, **12 `REVOKE`** e **37 `OWNER TO`**; não foram encontrados `ALTER ROLE ... SET` ou `ALTER DATABASE ... SET` no arquivo `schema.sql` pelos padrões usados. Em `roles.sql`, **0 `CREATE ROLE` e 3 `ALTER ROLE`**, não três criações de roles. A primeira tentativa do script de contagens encontrou um `ParserError`; somente a execução corrigida trouxe estas evidências. As contagens são **presença de instruções**, não prova de identidade das definições, configuração completa do PostgreSQL, escopo do backup gerenciado ou restaurabilidade. Nenhum valor sensível de roles ou permissões foi compartilhado.

**Storage/Google (somente verificação de configuração):** o proprietário informou que `portfolio-drive:` mostra `scope = drive.readonly` via `rclone config redacted`. Captura do painel Google mostra rclone com autorização **ativa** para ler e baixar arquivos do Drive, concedida em 19/11/2026 às 06:19 segundo o painel; não demonstra se a autorização antiga vinculada ao token anteriormente exposto foi efetivamente revogada. **Reconexão OAuth nova e SHA-256 objeto a objeto dos 143 arquivos no Drive: NÃO CONFIRMADOS nesta execução**. Comandos de verificação são apenas de leitura e não devem ser executados até existir conexão validada; nenhum restore de dados reais ou mudança produtiva foi realizado. As cinco fontes privadas permanecem para atualização consolidada no encerramento.


## Conciliação estrutural dos dumps SQL — 20/11/2026

**Evidência apresentada pelo proprietário, somente leitura dos arquivos locais do backup de 19/11:** `roles.sql` **297 bytes**, `schema.sql` **89.193 bytes** e `data.sql` **555.489 bytes**. Uma nova extração por expressões regulares, corrigindo o padrão inicialmente incompleto para `CREATE TABLE IF NOT EXISTS`, apurou **22 declarações `CREATE TABLE public`**, **10 funções `public`**, **3 funções `private`**, **41 `CREATE POLICY`**, **22 `ALTER TABLE ... ENABLE ROW LEVEL SECURITY`**, **14 cláusulas `FOREIGN KEY`**, **37 `CREATE TRIGGER` ligados a tabelas `public`**, **4 `CREATE EXTENSION`**, **99 `GRANT`** e **3 declarações `CREATE/ALTER ROLE`**. O diagnóstico adicional confirmou **22 `CREATE TABLE IF NOT EXISTS`** e **37 comandos `CREATE TRIGGER`** no arquivo. Os zeros reportados por padrões anteriores de tabela/trigger eram **falsos negativos de inspeção**, não evidência de ausência de comandos.

**Comparação com catálogos produtivos (somente `SELECT`, 20/11):** `public` tem **22 tabelas, 10 funções, 41 policies, 22 tabelas com RLS, 14 FKs e 37 triggers de usuário**, e `private` tem **3 funções**. Os sete totais são iguais aos do arquivo. O PostgreSQL 17.11 de produção tem cinco extensões instaladas: `pg_stat_statements`, `pgcrypto`, `plpgsql`, `supabase_vault` e `uuid-ossp`; o dump informa quatro declarações de extensão. **A ausência de declaração explícita de `plpgsql` é uma hipótese a confirmar**, não um defeito já comprovado. Ainda não foram comparados os nomes e definições completas das estruturas, conteúdos dos `GRANT`, características das roles, configurações do servidor, dependências de esquemas gerenciados ou um restore funcional.

**Ambiente local informado:** `git`, Supabase CLI, Docker e rclone disponíveis; `psql`, `pg_restore` e comando `7z` não encontrados no PATH. rclone v1.75.2 tem dois remotos configurados (`portfolio-s3:` e `portfolio-drive:`), mas **a reconexão OAuth, a aptidão de leitura e a comparação criptográfica dos 143 objetos do Drive NÃO foram testadas nesta rodada**. Nenhum segredo, caminho local, linha de dado, SQL, dump ou token foi publicado. **Nenhum restore, comando de escrita no PostgreSQL ou alteração de produção foi executado.** Os cinco snapshots privados só serão consolidados ao final, por decisão expressa do proprietário.


## Correspondência de nomes e contagens por tabela nos dumps — 20/11/2026

**Evidência local apresentada pelo proprietário:** PowerShell leu os 57 blocos `COPY` do arquivo `data.sql` exportado em 19/11, gerou, por schema, um resumo de **nomes de tabelas + quantidade de linhas por tabela**, ordenou os nomes ordinalmente e calculou SHA-256 do resumo, sem transmitir dados, nomes de tabelas ou o arquivo. As **três assinaturas comparadas com os resumos preparados previamente em leitura da produção conferiram integralmente (3/3 SUCCESS)**: `public` **22 tabelas/825 linhas**, `auth` **26/6**, `storage` **9/145**; total **57 tabelas/976 linhas**. Os valores das assinaturas individuais foram preservados fora do GitHub.

**Significado:** a igualdade dessas assinaturas, calculadas pelo mesmo algoritmo sobre nomes e contagens, evidencia **correspondência por tabela**, não apenas de soma por schema, entre o dump local reportado e a consulta produtiva de referência. A comparação considera as 57 tabelas de dados e **exclui os históricos gerenciados `auth.schema_migrations` e `storage.migrations`**, encontrados separadamente no banco produtivo com 84 e 81 linhas. A extração local não foi auditada independentemente e a produção foi consultada em outro instante, portanto a igualdade **não demonstra snapshot transacional comum**, conteúdo idêntico das linhas, integridade das chaves estrangeiras no restore, completude de objetos gerenciados/roles/grants/RLS/configurações, arquivos binários do Storage ou restaurabilidade.

**Estado:** correspondência de inventário de tabelas e linhas por tabela **SUCCESS conforme saída fornecida pelo proprietário**; completude do backup PostgreSQL e ensaio de recuperação **NÃO COMPROVADOS**. Próxima verificação: cobertura estrutural dos arquivos `schema.sql` e `roles.sql`, com saída apenas agregada e sem expor SQL ou credenciais. Nenhuma escrita em banco, alteração de Auth/Storage/RLS, migration, exportação adicional ou restore foi executada.


## Contraste agregado entre o backup e o PostgreSQL produtivo — 20/11/2026

**Nova consulta em produção, exclusivamente `SELECT COUNT(*)` em tabelas dos schemas `public`, `auth` e `storage`, sem acesso ao conteúdo das linhas:** 22 tabelas de `public` totalizaram **825 registros**, 27 tabelas de `auth` totalizaram **90 registros** e 10 tabelas de `storage` totalizaram **226 registros**. Dois históricos gerenciados foram conferidos separadamente: `auth.schema_migrations` com **84 linhas** e `storage.migrations` com **81 linhas**. Os totais **excluindo apenas essas duas tabelas** são, respectivamente, **825, 6 e 145**, exatamente os totais agregados de linhas `COPY` informados pelo proprietário no backup de 19/11. O inventário atual confirma ainda **143 linhas em `storage.objects`** e **2 em `storage.buckets`**; esses valores são contagens de metadados, não hashes de objetos físicos.

**Conclusão limitada:** conferência aritmética **SUCCESS**; as diferenças de 84 e 81 linhas são **numericamente explicadas** pelos dois históricos de migrations. Como não foram apresentados nomes de todas as tabelas `COPY` e contagens individuais do arquivo, **não está comprovado que essas sejam exatamente as tabelas omitidas pelo dump**, nem que cada tabela restante contenha as mesmas linhas. Além disso, produção em 20/11 e dump de 19/11 não constituem uma fotografia transacional comum. Não inferir completude, restauração das migrations de serviços gerenciados, equivalência de Auth/Storage ou recuperabilidade integral. **Nenhuma exportação, escrita ou restauração de produção foi executada.**


## Contagem de linhas de dados nos blocos `COPY` — 20/11/2026

**Evidência apresentada pelo proprietário:** execução local de um leitor sequencial PowerShell no `data.sql` do backup de **19/11/2026**, sem transmitir o arquivo nem registros ao repositório. O leitor reconheceu os blocos `COPY ... FROM stdin;`, somou as linhas até cada terminador `\.`, verificou o fechamento dos blocos e reportou **0 cabeçalhos não reconhecidos**.

| Schema | Blocos `COPY` | Com pelo menos uma linha | Vazios | Linhas de dados contadas |
|---|---:|---:|---:|---:|
| `public` | 22 | 22 | 0 | **825** |
| `auth` | 26 | 5 | 21 | **6** |
| `storage` | 9 | 2 | 7 | **145** |
| **Total** | **57** | **29** | **28** | **976** |

**Resultado da conferência aritmética: SUCCESS para a consistência das contagens reportadas** (57 = 22 + 26 + 9; 29 blocos com linhas; 28 vazios; 976 = 825 + 6 + 145). **Não houve inspeção independente dos bytes.** O contador mede linhas dentro dos `COPY`, não comprova equivalência registro a registro ou por tabela frente a uma fotografia consistente da produção. Permanecem **NÃO CONFIRMADOS**: completude do backup PostgreSQL (inclusive estrutura gerenciada, roles, grants, RLS, funções, dependências e configurações), comparação de inventário por tabela, compatibilidade das chaves e serviços Auth/Storage, e restaurabilidade. **Restore com dados reais: NÃO EXECUTADO**, sujeito à autorização específica e destino segregado. Nenhum dado, segredo, caminho local, dump ou manifesto foi publicado; nenhum serviço produtivo foi alterado.


## Presença de linhas nos blocos `COPY` — 20/11/2026 (confirmação local)

**Resultado informado pelo proprietário:** após analisar localmente o `data.sql` com um leitor sequencial que identifica cada bloco `COPY` até seu terminador `\.`, a contagem foi: **`public`: 22 blocos, 22 com pelo menos uma linha, 0 vazios; `auth`: 26 blocos, 5 com linhas, 21 vazios; `storage`: 9 blocos, 2 com linhas, 7 vazios; `outros`: 0**. **Total: 57 blocos, 29 com pelo menos uma linha e 28 vazios**. O proprietário apresentou somente a tabela agregada, sem enviar SQL nem dados pessoais. As contagens são do arquivo exportado, não de uma conexão atual com o banco. Não há contagem de linhas por tabela, comparação registro a registro ou validação independente dos bytes.

**Interpretação:** as **22 instruções de dados para `public` possuem linhas**, compatíveis numericamente com as 22 tabelas `public` existentes em produção; há também dados em **cinco blocos `auth`** e **dois `storage`**. Blocos vazios podem ser legítimos e não significam erro por si. A presença de linhas **não garante** quantidade total de registros, identidade dos objetos com o inventário, vínculos e dependências, preservação das chaves Auth, consistência entre datas de exportação ou restauração integral. **Integridade local de hashes e pacote externo foram confirmados pelo proprietário em etapas anteriores; ensaio integral de restore: NÃO EXECUTADO.**

**Fontes privadas — preferência vigente do proprietário:** não substituir as fontes Markdown anexadas ao Projeto após cada ação; **acumular as mudanças e consolidar os cinco snapshots apenas ao fim da sequência de execuções**, mediante encerramento indicado pelo proprietário. A documentação pública canônica deve continuar atualizada conforme protocolo, sem publicar dados privados nem os próprios snapshots.


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

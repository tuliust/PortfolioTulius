# Auditoria de higiene — três frentes (02/11/2026)

Projeto Supabase `portfolio` (`zfnrhzplwpjpdljraypt`); repositório `tuliustsangaropulos/PortfolioTulius` na `main`. Evidências de consultas SQL **somente leitura**, revisão de GitHub e verificações de CI. **Nenhuma exclusão de Storage, dados ou schema autorizada por este documento.**

## 1. Storage: inventário nominal e análise de risco

- 128 objetos Storage: 72 públicos e 56 privados. Biblioteca `media_assets`: 75 registros (72 públicos e três privados).
- **53 objetos privados sem catálogo** possuem par público de caminho, tamanho e ETag equivalentes (41 SVGs e 12 imagens rasterizadas). Não há hash SHA-256 independente dos bytes desses pares, portanto não estão comprovadamente duplicados.
- **28 arquivos públicos** são citados explicitamente por URL `/storage/v1/object/public/portfolio-public/` em blocos publicados de seções visíveis. **44 públicos** não são citados por essa URL, mas todos possuem registro na biblioteca e seu caminho aparece em revisões históricas.
- Os 28 caminhos dos arquivos privados pareados aparecem em blocos públicos somente porque o nome coincide com o do arquivo público. A busca exata por `portfolio-private/<nome>` nos blocos publicados retornou zero. Não equivale a uma prova universal de desuso.
- As 53 entradas privadas não são publicadas nominalmente neste repositório. O SQL em `scripts/hygiene/storage-inventory.sql` permite gerar o manifesto completo em local privado.

### 44 arquivos públicos candidatos à **revisão**, não à remoção

#### Uploads avulsos (3)

| Caminho público | Título editorial | Tamanho (bytes) |
|---|---|---:|
| `a1bf9f8f-dae0-4c6e-ab9a-8d75bba0adb7-2.png` | Vale — logotipo | 23.779 |
| `afb641b5-6eba-43af-816e-049135aa1278-tulius-contact.jpg` | Tulius — fotografia da seção Contato | 77.843 |
| `fbfb9c32-b973-4aa1-ba67-195f58a0e7e5-1.png` | Grupo InPress — logotipo | 4.961 |

#### Versões geradas (22)

| Caminho público | Título editorial | Tamanho (bytes) |
|---|---|---:|
| `portfolio-generated/2026-10-31-no-text/invest-rs-05.svg` | Invest RS — Materiais e apresentações institucionais · ilustração conceitual | 1.716 |
| `portfolio-generated/2026-10-31-no-text/prefeitura-sp-04.svg` | Prefeitura de São Paulo — Comunicação e participação pública · ilustração conceitual | 3.155 |
| `portfolio-generated/2026-10-31-no-text/vale-04.svg` | Vale — Painéis e indicadores de desempenho · ilustração conceitual | 1.412 |
| `portfolio-generated/2026-10-31/globo-sportv-01.svg` | TV Globo / SporTV — Produção de ponta a ponta · ilustração conceitual | 2.086 |
| `portfolio-generated/2026-10-31/globo-sportv-02.svg` | TV Globo / SporTV — Jornalista em Pequim · ilustração conceitual | 1.864 |
| `portfolio-generated/2026-10-31/globo-sportv-03.svg` | TV Globo / SporTV — Reportagens e entradas ao vivo · ilustração conceitual | 2.092 |
| `portfolio-generated/2026-10-31/inpress-01.svg` | Grupo InPress — Assessoria de imprensa · ilustração conceitual | 2.410 |
| `portfolio-generated/2026-10-31/inpress-02.svg` | Grupo InPress — Relações públicas · ilustração conceitual | 2.509 |
| `portfolio-generated/2026-10-31/inpress-03.svg` | Grupo InPress — Campanhas integradas · ilustração conceitual | 2.173 |
| `portfolio-generated/2026-10-31/invest-rs-01.svg` | Invest RS — Guia de Boas-Vindas · ilustração conceitual | 2.147 |
| `portfolio-generated/2026-10-31/invest-rs-02.svg` | Invest RS — Organização de eventos · ilustração conceitual | 1.888 |
| `portfolio-generated/2026-10-31/invest-rs-03.svg` | Invest RS — Plataforma de eventos e relacionamento · ilustração conceitual | 2.317 |
| `portfolio-generated/2026-10-31/invest-rs-04.svg` | Invest RS — Estratégia de CRM e mailing institucional · ilustração conceitual | 2.677 |
| `portfolio-generated/2026-10-31/invest-rs-05.svg` | Invest RS — Materiais e apresentações institucionais · ilustração conceitual | 2.702 |
| `portfolio-generated/2026-10-31/prefeitura-sp-01.svg` | Prefeitura de São Paulo — Planejamento de comunicação · ilustração conceitual | 4.005 |
| `portfolio-generated/2026-10-31/prefeitura-sp-02.svg` | Prefeitura de São Paulo — Conteúdo institucional e executivo · ilustração conceitual | 2.575 |
| `portfolio-generated/2026-10-31/prefeitura-sp-03.svg` | Prefeitura de São Paulo — Plataforma SUBPI · ilustração conceitual | 2.160 |
| `portfolio-generated/2026-10-31/prefeitura-sp-04.svg` | Prefeitura de São Paulo — Comunicação e participação pública · ilustração conceitual | 4.025 |
| `portfolio-generated/2026-10-31/vale-01.svg` | Vale — Projetos digitais de ponta a ponta · ilustração conceitual | 2.304 |
| `portfolio-generated/2026-10-31/vale-02.svg` | Vale — Comunicação executiva e reputação · ilustração conceitual | 4.001 |
| `portfolio-generated/2026-10-31/vale-03.svg` | Vale — Mídia paga e inteligência de dados · ilustração conceitual | 2.259 |
| `portfolio-generated/2026-10-31/vale-04.svg` | Vale — Painéis e indicadores de desempenho · ilustração conceitual | 2.259 |

#### Ilustrações históricas (19)

| Caminho público | Título editorial | Tamanho (bytes) |
|---|---|---:|
| `portfolio-illustrative/2026-10-26/cdi-01.svg` | CDI Comunicação — ilustração conceitual 01 (série histórica 26/10) | 3.118 |
| `portfolio-illustrative/2026-10-26/cdi-02.svg` | CDI Comunicação — ilustração conceitual 02 (série histórica 26/10) | 2.695 |
| `portfolio-illustrative/2026-10-26/cdi-03.svg` | CDI Comunicação — ilustração conceitual 03 (série histórica 26/10) | 3.107 |
| `portfolio-illustrative/2026-10-26/globo-sportv-01.svg` | TV Globo / SporTV — ilustração conceitual 01 (série histórica 26/10) | 3.033 |
| `portfolio-illustrative/2026-10-26/globo-sportv-02.svg` | TV Globo / SporTV — ilustração conceitual 02 (série histórica 26/10) | 3.051 |
| `portfolio-illustrative/2026-10-26/globo-sportv-03.svg` | TV Globo / SporTV — ilustração conceitual 03 (série histórica 26/10) | 2.845 |
| `portfolio-illustrative/2026-10-26/inpress-01.svg` | Grupo InPress — ilustração conceitual 01 (série histórica 26/10) | 2.832 |
| `portfolio-illustrative/2026-10-26/inpress-02.svg` | Grupo InPress — ilustração conceitual 02 (série histórica 26/10) | 2.960 |
| `portfolio-illustrative/2026-10-26/inpress-03.svg` | Grupo InPress — ilustração conceitual 03 (série histórica 26/10) | 3.100 |
| `portfolio-illustrative/2026-10-26/invest-rs-01.svg` | Invest RS — ilustração conceitual 01 (série histórica 26/10) | 3.091 |
| `portfolio-illustrative/2026-10-26/invest-rs-02.svg` | Invest RS — ilustração conceitual 02 (série histórica 26/10) | 4.674 |
| `portfolio-illustrative/2026-10-26/invest-rs-03.svg` | Invest RS — ilustração conceitual 03 (série histórica 26/10) | 3.112 |
| `portfolio-illustrative/2026-10-26/invest-rs-04.svg` | Invest RS — ilustração conceitual 04 (série histórica 26/10) | 3.617 |
| `portfolio-illustrative/2026-10-26/prefeitura-sp-01.svg` | Prefeitura de São Paulo — ilustração conceitual 01 (série histórica 26/10) | 3.862 |
| `portfolio-illustrative/2026-10-26/prefeitura-sp-02.svg` | Prefeitura de São Paulo — ilustração conceitual 02 (série histórica 26/10) | 2.987 |
| `portfolio-illustrative/2026-10-26/prefeitura-sp-03.svg` | Prefeitura de São Paulo — ilustração conceitual 03 (série histórica 26/10) | 3.620 |
| `portfolio-illustrative/2026-10-26/vale-01.svg` | Vale — ilustração conceitual 01 (série histórica 26/10) | 3.016 |
| `portfolio-illustrative/2026-10-26/vale-02.svg` | Vale — ilustração conceitual 02 (série histórica 26/10) | 2.960 |
| `portfolio-illustrative/2026-10-26/vale-03.svg` | Vale — ilustração conceitual 03 (série histórica 26/10) | 3.612 |

**Atenção:** os três uploads avulsos incluem logotipos e uma fotografia associados a conteúdo histórico. A ausência de referência na versão publicada não libera a exclusão, pois o acesso por URL, código, versões anteriores e uso externo não foi esgotado.

## 2. Banco: dependências, registros e oportunidades de simplificação

As **22 tabelas de `public` têm RLS habilitada e contêm registros**. Foram identificadas **14 chaves estrangeiras**. A varredura estática automatizada examinou **127 arquivos** em `src/`, `scripts/` e migrations/testes e registrou ocorrências por tabela e por campo. Ocorrência textual não prova uso de runtime; ausência textual não prova desuso dinâmico.

| Tabela | Registros (contagem exata) |
|---|---:|
| `admin_users` | 1 |
| `audit_logs` | 145 |
| `block_placements` | 56 |
| `career_experiences` | 6 |
| `contact_channels` | 4 |
| `content_blocks` | 28 |
| `content_revisions` | 145 |
| `design_tokens` | 12 |
| `editorial_issues` | 9 |
| `education` | 3 |
| `language_levels` | 2 |
| `media_assets` | 75 |
| `metrics` | 6 |
| `navigation_items` | 14 |
| `pages` | 1 |
| `portfolio_projects` | 4 |
| `section_panels` | 42 |
| `sections` | 14 |
| `site_settings` | 1 |
| `skills` | 7 |
| `testimonials` | 5 |
| `tool_categories` | 6 |

**Mapa relacional resumido:** `sections → pages`, `content_blocks → sections / media_assets`, `section_panels → sections`, `block_placements → content_blocks / section_panels`, `metrics / editorial_issues → sections`, `portfolio_projects → career_experiences`, `site_settings / testimonials → media_assets`, `admin_users / audit_logs / content_revisions → auth.users`. São 14 constraints FK. As funções `duplicate_section`, `publish_section` e `save_content_block_atomic` também referenciam o modelo editorial.

**Campos com evidências atuais:** `career_experiences.skills` tem seis arrays vazios em seis experiências; `media_assets.credit` tem **60 valores preenchidos** e deve ser preservado; `media_assets.width` e `height` têm 15 nulos cada; `content_blocks.media_id`, `testimonials.photo_media_id` e `site_settings.favicon_media_id` têm zero vínculos preenchidos, mas continuam definidos em FKs. `portfolio_projects.experience_id` está preenchido nos quatro projetos e `metrics.section_id` nas seis métricas. `audit_logs` e `content_revisions` contêm 145 registros cada.

**Decisão técnica:** nenhuma tabela ou coluna foi aprovada para `DROP`. A estrutura está interligada a histórico, RLS, triggers, admin e frontend. A próxima etapa de DDL exige plano de migração e rollback, dependências validadas e ensaio local com fixtures sintéticas.

## 3. Automação instalada — proteção contra exclusão inadvertida

- `scripts/hygiene/storage-inventory.sql`: exporta inventário JSON do Storage por SQL somente leitura; o **resultado contém caminhos privados e jamais deve ser commitado**.
- `scripts/hygiene/storage-plan.mjs`: classifica referências de um manifesto privado e impõe **`deletionCount: 0`** em qualquer cenário. Não se conecta à rede.
- `scripts/hygiene/storage-backup.mjs`: faz simulação offline por padrão; execução de backup real requer variável explícita `HYG_STORAGE_URL`, credencial privada `HYG_STORAGE_SERVICE_ROLE_KEY` e diretório absoluto `HYG_BACKUP_DIR` **fora da árvore do Git**. Faz download autenticado, confere tamanho, computa SHA-256, grava bytes com permissão restrita e índice. A execução pode ser retomada no mesmo diretório: reaproveita apenas arquivos determinísticos seguros e íntegros; se o manifesto não trouxer SHA-256, confirma o arquivo existente contra novo download antes de reutilizá-lo. Um índice completo válido resulta em no-op. Arquivos extras, links, corrupção ou divergência abortam sem sobrescrita. `--verify-backup` compara hashes e exige o manifesto para comprovar cobertura integral.
- `scripts/hygiene/schema-audit.mjs`: varre referências textuais em fonte e migrations, separando arquivos de teste, e marca todas as tabelas/colunas `safeToDrop: false`.
- `.github/workflows/hygiene-audit.yml`: testes isolados Node 24, dry-run de manifesto sintético e varredura estática; **sem segredos, sem downloads reais, sem Storage.remove e sem SQL de escrita**.

### Comandos de leitura/simulação disponíveis

```sh
node --test scripts/hygiene/*.nodecheck.mjs
node scripts/hygiene/storage-plan.mjs --manifest scripts/hygiene/fixtures/sample-manifest.json
node scripts/hygiene/storage-backup.mjs --manifest scripts/hygiene/fixtures/sample-manifest.json
node scripts/hygiene/schema-audit.mjs --summary-only
```

Antes de retomar uma transferência privada, é possível inspecionar o diretório parcial sem rede:

```sh
node scripts/hygiene/storage-backup.mjs --manifest CAMINHO_PRIVADO_DO_MANIFESTO.json --inspect-partial CAMINHO_PRIVADO_DO_BACKUP
```

O resultado informa quantos arquivos são reutilizáveis e quantos já estão vinculados a hashes do manifesto. Ele não substitui a verificação final com `--verify-backup` e o mesmo manifesto privado.

Para gerar um manifesto de produção, executar o SQL de inventário em sessão segura e guardar a saída exclusivamente fora do repositório. Não publicar o manifesto ou o índice do backup em Actions, Issues, commits ou artifacts. O backup de bytes **não** foi executado nesta rodada porque exigiria credencial e destino privado controlado.

## Restrições ainda vigentes

- Não remover objetos com `DELETE` SQL em `storage.objects`; a exclusão física requer Storage API e autorização específica.
- Não considerar `size`/ETag como prova de igualdade criptográfica.
- Não copiar conteúdo real para o staging; homologação transacional somente com Docker + Supabase CLI local, seed sintético e usuário fictício.
- Não executar migrações destrutivas, não remover arquivos em lote nem alterar credenciais/RLS nesta fase.

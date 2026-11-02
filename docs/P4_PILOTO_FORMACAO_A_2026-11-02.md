# P4.1 — Piloto Formação/A: seis diferenças antes da vinculação

**Bloco manual:** `1bc36dc9-c301-4873-8c53-21c3e048737b`; **coleção candidata:** `education`, com 3 registros publicados. Evidência: `SELECT` de `content_blocks` e `education` em 02/11/2026, comparados à projeção `collectionToItems("education")`. O bloco permanece manual.

Os 3 títulos, 3 etiquetas de grau e a ordem **coincidem**. A projeção altera **2 atributos por registro**: `meta` e `text`.

| Item / ID estável | `meta` atual — prevalece | `meta` da coleção | `text` adicionado pela coleção |
| --- | --- | --- | --- |
| 1. Comunicação Social — Jornalismo / `0a09485d-29a0-4e09-ae19-6822979071a4` | `UFRN · 2007–2012` | `2007 — 2012` | Universidade Federal do Rio Grande do Norte (UFRN) |
| 2. Comunicação Integrada e Marketing Digital / `29c35ec7-6140-4c0e-9e93-5d9b691e2823` | `UnP · 2013` | `2013 — 2013` | Universidade Potiguar (UnP) |
| 3. Marketing Digital, BI e Estratégia Data Driven / `2915e819-4974-4e80-8bb8-bb332567a4d3` | `PUCRS · 2020–2021` | `2020 — 2021` | Pontifícia Universidade Católica do Rio Grande do Sul (PUCRS) |

**Aprovações necessárias — 6 decisões, duas para cada item:**

- Para cada **`meta`**: **A** conservar exatamente o texto atual; **B** usar o valor projetado; **C** autorizar outro texto específico.
- Para cada **`text`**: **A** continuar sem campo; **B** acrescentar o nome completo da instituição; **C** definir apresentação diferente.

O adaptador precisará refletir cada escolha **antes** de ativar `source_collection=education`; aprovação do piloto como prioridade **não aprova essas diferenças**. A cópia `content_json.items` deve continuar recuperável, com a versão pública preservada até o aceite.

**Proteção no código:** `src/lib/collection-link-review.test.ts` utiliza snapshot correspondente e verifica que 6 diferenças são detectadas, sem mutar o conjunto manual; [CI](https://github.com/tuliustsangaropulos/PortfolioTulius/actions/runs/41394155842). Não é teste de gravação em produção.

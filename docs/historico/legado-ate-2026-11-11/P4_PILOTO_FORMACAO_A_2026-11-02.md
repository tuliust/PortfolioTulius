# P4.1 — Piloto Formação/A: seis decisões aprovadas, prévia aguardando homologação visual

**Bloco manual:** `1bc36dc9-c301-4873-8c53-21c3e048737b`; **coleção candidata:** `education`, com 3 registros publicados. Evidência: `SELECT` de `content_blocks` e `education` em 02/11/2026, comparados à projeção `collectionToItems("education")`. O bloco permanece manual.

Os 3 títulos, 3 etiquetas de grau e a ordem **coincidem**. A projeção altera **2 atributos por registro**: `meta` e `text`.

| Item / ID estável | `meta` atual — prevalece | `meta` da coleção | `text` adicionado pela coleção |
| --- | --- | --- | --- |
| 1. Comunicação Social — Jornalismo / `0a09485d-29a0-4e09-ae19-6822979071a4` | `UFRN · 2007–2012` | `2007 — 2012` | Universidade Federal do Rio Grande do Norte (UFRN) |
| 2. Comunicação Integrada e Marketing Digital / `29c35ec7-6140-4c0e-9e93-5d9b691e2823` | `UnP · 2013` | `2013 — 2013` | Universidade Potiguar (UnP) |
| 3. Marketing Digital, BI e Estratégia Data Driven / `2915e819-4974-4e80-8bb8-bb332567a4d3` | `PUCRS · 2020–2021` | `2020 — 2021` | Pontifícia Universidade Católica do Rio Grande do Sul (PUCRS) |

## Respostas editoriais recebidas — seis escolhas explícitas

| Item | `meta` | `text` | Situação |
| --- | --- | --- | --- |
| Jornalismo / UFRN | **A** — manter `UFRN · 2007–2012` | **B** — acrescentar nome completo da UFRN | Escolhas recebidas |
| Comunicação Integrada / UnP | **A** — manter `UnP · 2013` | **B** — acrescentar nome completo da UnP | Escolhas recebidas |
| Marketing Digital / PUCRS | **A** — manter `PUCRS · 2020–2021` | **B** — acrescentar nome completo da PUCRS | Escolhas recebidas |

Todos os campos `title`, `label`, `meta`, a ordem, os status e os arquivos editoriais existentes continuam preservados. **As únicas três diferenças entre o bloco original e a prévia aprovada são três adições de `text`** — não alterações de `meta`.

## Prévia de conteúdo para avaliação

1. **Comunicação Social — Jornalismo** · Graduação · `UFRN · 2007–2012`
   - Texto adicional: Universidade Federal do Rio Grande do Norte (UFRN)
2. **Comunicação Integrada e Marketing Digital** · Pós-graduação · `UnP · 2013`
   - Texto adicional: Universidade Potiguar (UnP)
3. **Marketing Digital, BI e Estratégia Data Driven** · MBA · `PUCRS · 2020–2021`
   - Texto adicional: Pontifícia Universidade Católica do Rio Grande do Sul (PUCRS)

**Estado da prévia:** a função isolada `buildApprovedFormationAPreview` em `src/lib/formation-pilot-preview.ts` verifica os três IDs estáveis, títulos, ordem, tipos, status, metadados originais e nomes de instituições. Se qualquer valor divergir do conjunto aprovado, ela **interrompe** a composição e exige nova revisão. Ela só cria objetos de prévia **na memória**; não atualiza `content_json`, não altera coleções e não atribui `source_collection`.

**Importante:** a prévia de conteúdo está preparada, mas **não foi publicada nem renderizada como prévia visual final no CMS**. A função ainda não foi conectada ao fluxo de vinculação. Antes de qualquer aplicação, será preciso integrar o contrato especificamente a Formação/A, visualizar em desktop/mobile, aprovar o resultado e somente então autorizar a alteração individual do bloco. Uma escolha de campos não é autorização de escrita.

**Testes:** `src/lib/formation-pilot-preview.test.ts` valida o conteúdo da prévia, imutabilidade do original e rejeição de divergências em ID, instituição, status e metadado. `src/lib/collection-link-review.test.ts` mantém a comparação bruta anterior de seis diferenças. Consulte o CI do commit do módulo ou do SHA final no checklist.

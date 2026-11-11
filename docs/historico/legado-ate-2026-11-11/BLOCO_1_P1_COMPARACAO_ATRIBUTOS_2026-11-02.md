# P1 — Matriz automática de diferenças entre painéis manuais e coleções

**Escopo:** comparação por `SELECT` em `content_blocks` e sete coleções publicadas (sem escrita), em 02/11/2026. Os campos de projeção correspondem à estrutura de `collectionToItems` do código; o cálculo por posição reproduz uma **troca genérica hipotética** de fonte. **Não é uma prévia editorial aprovada, tampouco uma autorização de vínculo.**

## Nove painéis com coleções candidatas

| Painel | Coleção proposta para análise | Itens atuais → projetados | Títulos na mesma posição | Diferenças por atributo | Campos e contagens |
| --- | --- | ---: | ---: | ---: | --- |
| Competências/A | `skills` | 2 → 7 | 0 | 14 | `title` 7; `text` 7 |
| Competências/B | `skills` | 3 → 7 | 0 | 14 | `title` 7; `text` 7 |
| Contato/B | `contact_channels` (primeiros 3) | 3 → 3 | 3 | 6 | `value` 3; `text` 3 |
| Ferramentas/A | `tool_categories` (itens 1–3) | 3 → 3 | 3 | 5 | `text` 2; `toolIcons` 3 |
| Ferramentas/B | `tool_categories` (itens 4–6) | 3 → 3 | 3 | 4 | `text` 1; `toolIcons` 3 |
| Formação/A | `education` | 3 → 3 | 3 | 6 | `meta` 3; `text` 3 |
| Formação/B | `language_levels` | 2 → 2 | 0 | 8 | `title` 2; `label` 2; `meta` 2; `text` 2 |
| Perfil/B | `career_experiences` (6 registros) | 11 → 6 | 0 | 50 | `title` 11; `meta` 11; `text` 11; `label` 6; `targetSlug` 6; `themeKey` 5 |
| Resultados/A | `metrics` | 4 → 6 | 0 | 32 | `title` 6; `text` 6; `meta` 6; `value` 6; `metricIcon` 4; `relatedThemeKeys` 4 |
| **Total** | **9 simulações** | | | **139** | **Diferenças, não erros** |

### Critérios adotados

O SQL comparou a união de chaves JSON de cada item, por posição e valor armazenado. Campos não representados numa coleção são contabilizados como diferenças; títulos idênticos em **outra posição** não são equivalência automática. As fatias de Ferramentas e Contato são **hipóteses do relatório**, não paginação gravada no CMS. Links aceitos na projeção de Contato são tratados como HTTPS ou mailto; mudanças nesses links exigem inspeção específica do adaptador de URL.

**Atenção a Formação/A:** as **seis diferenças** acima pertencem à **projeção genérica** de `education`. O proprietário já aprovou uma projeção especial: preservar os três `meta` antigos e adicionar os três nomes completos de instituições como `text`. Essa projeção especial foi implementada **somente na prévia protegida**, testada no CMS, mas **não** vinculada nem publicada.

## Outros 17 blocos manuais

Os 17 restantes não têm um contrato de substituição **integral** por coleção. Incluem, entre outros, Perfil/A, Sobre/A+B, Resultados/B, 12 painéis de seis experiências e Contato/A. São blocos heterogêneos contendo textos, imagens, tags, projetos, metadados, estados ocultos e galerias. A comparação segura precisa ser **por registro/atributo e com ID estável**, não por troca integral de `source_collection`.

## Semáforo de aplicação

- **Preparação técnica permitida:** relatórios por campo, testes sem gravação, prévias protegidas e simulações com cópias.
- **Bloqueado até aceite específico:** aplicar adaptador no site público, editar JSONB, associar fotos por ID, remover conteúdos, alterar ordem/estado de cards, publicar.
- **Não demonstrado:** equivalência visual em leitores de tela/dispositivos reais e LCP mobile ≤2,5 s.

**Evidência complementar:** [inventário original de 26 blocos](BLOCO_1_P1_INVENTARIO_2026-11-02.md) e [comparação das seis experiências](BLOCO_1_P1_EXPERIENCIAS_2026-11-02.md).

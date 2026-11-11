# P0 — Contratos de campos e fontes do CMS

Documento operacional da etapa P0. A verificação automatizada do código **não** equivale à homologação de criação/edição/publicação com JWT administrativo real.

## Fluxo arquitetural vigente

1. **Seções e blocos editoriais:** `src/components/admin/AdminApp.tsx` grava `sections`; `ContentStudio` grava `content_blocks` e `block_placements` pela RPC `save_content_block_atomic`.
2. **Coleções estruturadas:** `CollectionsStudio` persiste registros nas nove tabelas com seus próprios status. `src/lib/admin-collection-payload.ts` remove campos virtuais e valida dados obrigatórios, estados e URLs de contato antes da chamada.
3. **Vínculo de apresentação:** somente um `content_blocks.content_json.source_collection` explícito habilita a substituição em tempo de leitura dos itens manuais pelos dados publicados da coleção.
4. **Leitura pública e prévia:** `src/hooks/usePortfolio.ts` busca seções, blocos, placements e apenas as coleções vinculadas; `collectionToItems` mapeia registros; `resolveCollectionBlocks` materializa os cards sem gravar os arrays de backup.
5. **Publicação:** a página pública filtra registros `published`; a prévia protegida pode ler registros `draft` e `in_review`. Não exibe `archived`.
6. **Revisões:** `src/lib/revision-restore.ts` permite recuperação limitada de textos de seções e `content_json` dos blocos, sem alterar status, ordem, visibilidade nem arquivos.

## Matriz dos campos de coleção

| Acervo | Campos estruturados principais | Mapeamento em cards vinculados | Regra/limite |
| --- | --- | --- | --- |
| `career_experiences` | `company, role, description, location` | título, rótulo, texto, metadado | A descrição da pilha de experiências também tem leitura própria, ligada aos seis IDs editoriais existentes; título da seção permanece independente |
| `portfolio_projects` | `title, summary, project_status` | título, texto, metadado | Alterações não substituem cards manuais sem vínculo |
| `metrics` | `label, value_text, unit, context` | título, valor, metadado, texto | Novo registro criado no contexto da seção recebe `section_id`; demais seções só consomem a fonte quando vinculadas |
| `skills` | `name, category` | título, texto | Estados permitidos: `draft`, `published` |
| `education` | `course, degree_type, institution, start_date, end_date` | título, rótulo, texto, período | Datas são campos textuais editoriais no banco |
| `language_levels` | `language, level_label, evidence_note` | título, texto, metadado | Sem vínculo automático com os itens manuais |
| `tool_categories` | `title, tools` JSONB | título, lista de nomes | `tools_text` é campo virtual do formulário; estados: `draft`, `published` |
| `testimonials` | `author_name, author_role, quote_text` | título, metadado, texto | Dois blocos atuais ligados por `source_collection`; fotos históricas dependem da correspondência pelo nome do autor |
| `contact_channels` | `channel_type, label, value, url` | título, texto, URL segura | Estados: `draft`, `published`; contato público atual possui cards manuais |

## Pontos comprovados nesta rodada

- A versão inicial da etapa foi o SHA `120e0e3`, com CI aprovado; os commits desta rodada corrigem a associação de descrição de carreira, validação de registros e atualização do indicador de fonte vinculada.
- Os conversores das nove coleções possuem teste unitário de campos; os dados manuais devem permanecer imutáveis durante a resolução.
- O contrato de carreira preserva a associação dos seis registros **existentes** por ID, mesmo se o nome exibido for alterado; novos registros não recebem vínculo por ordem presumida.
- A interface de origem da coleção deve ser atualizada após salvar o vínculo em um bloco.
- Não houve alteração de schema, migration, RLS, Auth, registros editoriais, mídia ou Storage.

## Pendências que impedem declarar o P0 homologado

- Decisão editorial por seção sobre migrar ou manter os **26 blocos manuais**; nunca vincular automaticamente uma coleção substituindo conteúdo real.
- Associação estável entre `testimonials` e fotografias quando um autor for renomeado, sem adivinhar o destino da imagem; atualmente `photo_media_id` não está preenchido nos depoimentos publicados.
- Definir a política de novas experiências além dos seis IDs atuais, sem criar associação por posição.
- Verificar de ponta a ponta o CRUD real, estados, prévia, restauração, navegação, edição de blocos e erros usando JWT administrativo **em ambiente isolado previamente autorizado**.
- Aceite humano da experiência de edição e da aparência visual após testes automatizados.

Ações acima são limites de homologação, não autorização para gravar produção.

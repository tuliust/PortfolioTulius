# P0 — Decisões editoriais aprovadas pelo proprietário

Registro de decisões recebidas neste projeto, aplicáveis a partir da revisão operacional atual. **Não** são autorização para migrar automaticamente registros, fotografias ou texto publicado no Supabase.

| Decisão | Alternativa selecionada | Regra executiva |
| --- | --- | --- |
| 1. Fonte dos blocos | **B** | Vinculação gradual, bloco a bloco, com comparação e aprovação antes de trocar a origem |
| 2. Experiências | **C** | Campos a sincronizar serão escolhidos individualmente. Não ativar automaticamente título, cargo, datas, projetos, fotos ou outros campos |
| 3. Prioridade | **D** | Abrange todas as áreas em sequência; avaliar uma seção por vez e conservar o conteúdo aprovado |
| 4. Fotografias de depoimentos | **A** | Preferir vínculo explícito por ID após verificar correspondência real. Proibido presumir foto por posição, ordem ou semelhança de nome |
| 5. Divergências | **A** | O conteúdo público atual prevalece até o proprietário aprovar cada diferença. Imagens, links e apresentação também devem entrar na comparação |
| 6. Publicação | **A** | Manter o fluxo atual: editar um registro publicado pode atualizar o site ao salvar, desde que o bloco esteja explicitamente vinculado |

## Ordem operacional, sem migração automática

1. **Inventário e comparação de leitura:** listar blocos e coleções, fotografias, ordens e campos. O sistema tinha 28 blocos (26 manuais e 2 vinculados a depoimentos) na inspeção de referência; confirmar novamente antes de cada mudança.
2. **Formação e idiomas:** confrontar as seções `formacao/A` e `formacao/B` com `education` e `language_levels` sem trocar a fonte. Comparar itens, ordem, títulos e atributos visuais.
3. **Resultados:** confrontar `resultados/A` com `metrics`, respeitando `section_id` e sem substituir os cards de especialidades de `resultados/B` automaticamente.
4. **Ferramentas:** confrontar os dois painéis com `tool_categories`; preservar `toolIcons` e configurações por dispositivo.
5. **Experiências/projetos:** conservar descrição de trajetória por ID nos seis registros existentes; os campos adicionais só serão sincronizados após a escolha individual de quais campos de cada experiência. Nunca migrar galerias ou textos de projetos por coincidência de títulos.
6. **Depoimentos:** manter os 2 blocos atuais vinculados. Confirmar para cada autor que a fotografia aprovada pertence à mesma pessoa e localizar/criar referência de `media_assets.id` com consentimento específico; não atualizar `photo_media_id` automaticamente.
7. **Contato:** confrontar `contato/B` com `contact_channels`, preservando o painel A com a fotografia original; exigir aprovação de cada URL, rótulo e ordenação divergentes.
8. **Perfil, Sobre, Competências:** preservar integralmente seus blocos especiais; só propor vínculos quando existir correspondência comprovada e aprovação de diferenças, inclusive para a seção intencionalmente oculta.

## Contrato de aprovação por bloco

Antes de vincular uma fonte, comparar os **itens realmente exibidos** com a projeção da coleção filtrada por `published`. Cada diferença de texto, valor, link, fotografia, ordem ou atributo visual deve ser exibida e aceita explicitamente; cancelar deixa `content_json.source_collection` inalterado. A alteração de origem só vai ao Supabase quando o administrador salvar o bloco pelo mecanismo existente. O array editorial manual permanece no JSONB como cópia não destrutiva. Trocar a origem também requer revisão da paginação para não herdar limites indevidos.

Mesmo após uma vinculação aprovada, o fluxo de publicação do item 6 permanece o atual; não criar uma nova etapa obrigatória de rascunho e publicação. O comportamento público de coleções já vinculadas não deve mudar inadvertidamente.

## Pendências de autorização e decisão

- **Experiências:** obter seleção de campos específicos (empresa, cargo, localização, período, descrição, projetos, mídias), inclusive se a sincronização deve ser geral ou por experiência. Até lá, preservar o contrato vigente de descrição da trajetória.
- **Fotografias dos depoimentos:** os três registros publicados tinham `photo_media_id` vazio na leitura de referência; nenhuma referência deve ser preenchida sem confrontar o arquivo aprovado com uma pessoa. O catálogo de mídia não ofereceu correspondência segura por nome na consulta de referência.
- **Migração:** a escolha B **não** aprova nenhum bloco individual. Cada bloco requer comparação e aceite das diferenças antes do vínculo. Dados vivos não serão escritos apenas por este documento.
- **Homologação:** testes de gravação/recuperação com JWT administrativo real dependem de ambiente isolado com autorização própria. Testes unitários e CI não demonstram esse caminho integral.

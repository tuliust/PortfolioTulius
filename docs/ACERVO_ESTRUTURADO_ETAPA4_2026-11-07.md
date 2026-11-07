# Etapa 4 — Acervo Estruturado separado do Editor do Site

**Data da implementação:** 07/11/2026. **Autorização:** pedido expresso para executar a Etapa 4 do [plano](PLANO_PADRONIZACAO_CMS_2026-11-07.md). **Base anterior:** commit `8c7833bd23e24478e7dadc3d59c29ac043f151a3`.

## Resultado e limite de escopo

O CMS passa a oferecer **Acervo Estruturado** como módulo próprio no menu lateral, fora das abas do Editor do Site. O Editor mantém apenas **Informações da seção** e **Conteúdo**. A ação contextual nos blocos com `content_json.source_collection` continua encaminhando para a coleção correspondente no novo módulo, obedecendo à confirmação de alterações não salvas.

**Nenhum dado ou tabela do Supabase foi excluído, migrado ou editado.** Nenhum componente público, conteúdo editorial, CSS global, endereço, SEO, token de Identidade ou mídia foi alterado. O conteúdo do site continua a ser renderizado pelos contratos existentes.

## Evidência de uso efetivo — Supabase

Consulta `SELECT` em produção na data da execução:

| Tabela | Linhas | Origem pública verificada |
|---|---:|---|
| `testimonials` | 5 | Usada por dois blocos publicados de **Depoimentos**: A (`collection_start=0`, `collection_limit=2`) e B (`collection_start=2`) |
| `career_experiences` | 6 | Consumo **direto específico** de Experiências Profissionais pelo renderer; a Trajetória é editada nas seções correspondentes |
| `portfolio_projects` | 4 | Sem vínculo `source_collection` atual |
| `metrics` | 6 | Sem vínculo `source_collection` atual |
| `skills` | 7 | Sem vínculo `source_collection` atual |
| `education` | 3 | Sem vínculo `source_collection` atual |
| `language_levels` | 2 | Sem vínculo `source_collection` atual |
| `tool_categories` | 6 | Sem vínculo `source_collection` atual |
| `contact_channels` | 4 | Sem vínculo `source_collection` atual |

Portanto, **Depoimentos é a única coleção que integra a navegação compartilhada nesta base**. Não foi imposta uma lista fixa de tabelas: a interface identifica dinamicamente os vínculos de blocos publicados e seções visíveis, o que permite que outra coleção apareça se ela for vinculada e publicada futuramente.

## Comportamento do módulo

- O wrapper `SharedCollectionsEditor` verifica, em leituras autenticadas, `sections` e `content_blocks` e deriva apenas os vínculos explícitos por `source_collection`.
- **Falha de leitura não habilita edição nem apresenta as nove tabelas como fallback.** É exibido erro de consulta, preservando os dados.
- O filtro oferece apenas coleções com pelo menos um vínculo ativo em bloco/ seção publicados. Fontes não ligadas não aparecem.
- O painel superior informa **onde a coleção é utilizada** e a lista de registros identifica **a seção e o painel que exibem cada registro publicado**.
- O vínculo por registro considera o `status`, a ordenação por `sort_order`, o deslocamento `collection_start` e o `collection_limit`, de acordo com as regras `collectionToItems` / `resolveCollectionBlocks`. Registros não publicados, fora da janela ou de seção oculta mostram “Sem utilização publicada neste momento”.
- A seleção de “Novo registro” e “Salvar registro” continua usando `CollectionsStudio`, `buildCollectionSavePayload` e leitura de confirmação no Supabase, sem duplicar lógica de persistência.
- Alterações pendentes acionam o mecanismo administrativo de confirmação ao mudar de área. O registro global de salvamento respeita `recordDirty`.

## O que não foi movido nem duplicado

- **Trajetórias profissionais:** continuam usando `InlineCareerTrajectoryEditor` nas respectivas seções. Não há segundo formulário de Trajetória no Acervo, embora `career_experiences` continue existindo.
- **Editor do Site:** mantém textos, imagens, itens, posições, estilos, placements, experiência por empresa e as configurações de `source_collection`. A interface de Acervo não cria automaticamente um vínculo entre blocos e coleções.
- **Outras oito tabelas:** permanecem no Supabase, com integridade e dados originais; a ausência de ligação publicada não apaga registros.
- **Mídia, navegação, identidade, revisões e SEO:** nenhuma alteração.

## Alterações de código

- `src/components/admin/AdminApp.tsx`: menu principal, roteamento interno do módulo e eliminação da aba redundante do Editor.
- `src/components/admin/SharedCollectionsEditor.tsx`: visualização independente e filtro seguro baseado nas ligações reais.
- `src/components/admin/AdminModules.tsx`: opção `availableSources`, rótulos de uso por registro e salvamento condicionado a mudanças.
- `src/lib/shared-acervo.ts`: cálculo determinístico de vínculos e posições públicas.
- Testes: `shared-acervo.test.ts` e `admin-stage4-contract.test.ts`.

## Verificação e pontos pendentes

- Rodar formatação, TypeScript, Vitest e build no SHA final. Revisar somente arquivos pertinentes à Etapa 4.
- Confirmar o deployment de produção e seus aliases antes de declarar publicação.
- Validar o fluxo administrativo real com sessão autenticada: menu, alternância, edição de Depoimentos, salvamento/releitura e atalho contextual do Editor para o Acervo. **Não enviar gravações de teste para o banco de produção.**
- Comparações desktop/mobile da Etapa 5 continuam necessárias para homologação final, embora esta etapa não altere componentes públicos nem dados do site.

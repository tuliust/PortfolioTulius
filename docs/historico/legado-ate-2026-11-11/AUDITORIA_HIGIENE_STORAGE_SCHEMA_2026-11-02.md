# Higienização do Supabase — auditoria operacional de 02/11/2026

Projeto: `portfolio` (`zfnrhzplwpjpdljraypt`). Base analisada: `main` antes deste commit, SHA `5f33d515543369870a205a2fe41ad8bb0f55ca00`. **Este relatório não autoriza remoção automática de arquivos ou DDL em produção.**

## A. Evidências de produção somente leitura

- `storage.objects`: **128 objetos**, sendo **72 públicos** e **56 privados**.
- `media_assets`: **75 registros**, sendo 72 associados ao bucket público e 3 ao privado.
- **53 objetos privados sem registro próprio no catálogo** possuem um objeto de mesmo nome no bucket público, com tamanhos e valores de ETag correspondentes; isso é **indício forte**, não prova criptográfica independente dos bytes.
- No bucket público, **28/72 objetos** têm ocorrência textual do caminho em `content_blocks.content_json` de seções visíveis e publicadas; **44/72 não foram encontrados nesse teste** (19 de `portfolio-illustrative`, 22 de `portfolio-generated` e 3 uploads avulsos).
- As **72 mídias públicas e 56 privadas** foram encontradas por texto em `content_revisions.snapshot_json`, mas uma referência histórica não é prova de uso corrente.
- `content_blocks.media_id`, `testimonials.photo_media_id` e `site_settings.favicon_media_id` têm **zero valores não nulos** no instantâneo; continuam como campos com função no contrato e dependências FK. Não remover sem uma análise dos formulários e da restauração de revisões.
- Existiam **145 registros de revisões** e dois blocos com `source_collection` declarado, portanto `content_revisions` e as coleções estruturadas não podem ser presumidas descartáveis.

### Limitação do teste de caminho

Nomes iguais aparecem em ambos os buckets. Procurar somente o `storage.objects.name` pode retornar uma referência à cópia **pública**, mesmo quando a linha inspecionada é **privada**. Para aprovar a limpeza privada é preciso distinguir explicitamente URLs de bucket, comparar hashes de bytes e garantir backup das origens necessárias.

## B. Alterações de código desta etapa

- A Biblioteca de Mídia passa a mostrar o título editorial persistido, com fallback para o nome físico.
- O editor permite gravar título, `alt_text`, `credit` e ponto focal com validação; nunca altera `storage_path` ou `storage_bucket` nesse fluxo.
- A publicação de arquivo privado não reescreve mais o título editorial com o basename; o upload inicial usa o nome original do arquivo, sem prefixo UUID.
- O salvamento usa a versão `updated_at` lida para recusar sobrescritas concorrentes e mantém a seleção editorial status separada da disponibilidade física.
- Nenhuma mídia física, registro de catálogo, tabela, coluna, RLS ou Auth é excluído nesta etapa.

## C. Sequência autorizável de limpeza

1. Exportar manifesto **privado** com ID, bucket, caminho, MIME, tamanho, ETag, referência por bucket/URL e hash SHA-256 dos bytes. Não divulgar URLs ou caminhos privados no repositório público.
2. Fazer backup **recuperável** e testar download/reimportação de amostras. O ambiente local previamente estabelecido é exclusivamente Docker + Supabase CLI, com seed sintético e sem conectar ou copiar dados de produção.
3. Conferir referências ao bucket no `content_json`, `seo_json`, `fallback`, assets estáticos, galeria, revisões e possíveis links externos. Apenas ausência de texto em blocos não basta.
4. Autorizar cada lote nominalmente. Excluir via **Storage API** (não por SQL). Verificar objetos e integridade do site após cada lote.
5. Para registros cadastrados, revalidar referências por ID e histórico antes de excluir metadados. Preservar rastreabilidade fora de produção quando necessário.
6. Propor separadamente qualquer remoção de coluna/tabela com matriz código + consultas + RPC + FK + triggers + RLS + backups; homologar migration local e só então solicitar autorização de produção.

## D. O que segue pendente

- Os **53 privados** e **44 públicos** são grupos candidatos a investigação, **não** listas liberadas para exclusão.
- Os metadados editoriais no banco foram organizados anteriormente (75 títulos e textos alt não vazios); descrição de imagens/autorizações ainda depende de revisão humana.
- A edição real pelo CMS e o fluxo de publicação com sessão administrativa em produção **não foram homologados por escrita**. Aprovação de CI não equivale a esse teste.
- Nenhum backup de bytes ou hash independente foi realizado com os conectores disponíveis; a recuperação de backups ainda deve ser comprovada.
- O conector Supabase acessível não expõe remoção Storage API; não executar `DELETE` em `storage.objects`.

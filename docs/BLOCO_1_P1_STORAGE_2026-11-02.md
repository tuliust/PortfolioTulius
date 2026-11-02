# Bloco 1 / P1 — Triagem dos 53 objetos privados sem registro

**Fonte:** junção por `storage_bucket/storage_path` entre `storage.objects` e `public.media_assets`, somente SELECT. **Não houve leitura de conteúdo privado nem exclusão.**

| MIME declarado no Storage | Quantidade | Bytes somados | Classificação segura |
| --- | ---: | ---: | --- |
| `image/png` | 11 | 1.592.330 | Uploads privados não cadastrados; não provar duplicidade |
| `image/jpeg` | 1 | 77.843 | Uploads privados não cadastrados; não provar duplicidade |
| `image/svg+xml` | 41 | 89.587 | 41 em diretórios `portfolio-generated/`; outros uploads pendentes de revisão |

**Total:** 53 objetos, aproximadamente 1.68 MiB (conforme metadados). `53`.

### Investigação permitida e limites

- 41 SVG são recursos gráficos, muitos organizados sob diretórios de geração identificáveis; podem ser fontes/variantes de galerias. A ausência de catálogo não prova inutilização.
- 11 PNG e 1 JPEG são uploads históricos com nomes derivados de imagens/editoriais; não marcar como lixo ou duplicatas sem comparar bytes e vínculos efetivos.
- **Os bytes dos objetos não foram comparados**; porém uma nova consulta SELECT por caminho exato, em `content_blocks.content_json`, `content_revisions.snapshot_json` e `site_settings.seo_json`, encontrou os vínculos textuais descritos abaixo. Não foram alterados os objetos ou as revisões.
- Todos os 75 registros de `media_assets` estavam anteriormente associados a objetos reais; não alterar esses objetos.
- Arquivar/excluir/realocar arquivos exige avaliação humana de uso, histórico, galeria, privacidade e cópia de segurança.

**Resultado:** triagem por tipo e diretório concluída; determinação de uso real/duplicação e qualquer limpeza continuam pendentes.

## Auditoria complementar de referências — 02/11/2026

Foram verificados **145 registros históricos de revisão** (29 do tipo `content_blocks`) e o JSONB atual dos blocos. A consulta procurou literalmente o caminho `storage.objects.name`, sem abrir os arquivos privados.

| MIME | Total sem catálogo | Caminho encontrado em blocos atuais | Caminho encontrado no histórico | Caminho encontrado no SEO |
| --- | ---: | ---: | ---: | ---: |
| SVG | 41 | 19 | 41 | 0 |
| PNG | 11 | 9 | 11 | 0 |
| JPEG | 1 | 0 | 1 | 0 |
| **Total** | **53** | **28** | **53** | **0** |

**Consequência:** nenhum dos 53 objetos está comprovadamente sem referência histórica; **não** recomendar exclusão em lote. Os 28 caminhos encontrados nos blocos atuais exigem ainda mais cuidado. O histórico demonstra a presença de uma string, **não** que o arquivo esteja necessariamente ativo, visualizável, íntegro ou duplicado. Investigar bytes, revisões mais antigas, rascunhos e as ligações de mídia antes de qualquer aprovação de limpeza.

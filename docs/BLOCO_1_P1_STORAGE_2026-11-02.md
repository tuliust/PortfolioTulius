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
- **Não foram comparados os bytes** dos objetos, nem as referências privadas em revisões e rascunhos protegidos. O inventário público deste projeto não lista os nomes internos dos objetos privados.
- Todos os 75 registros de `media_assets` estavam anteriormente associados a objetos reais; não alterar esses objetos.
- Arquivar/excluir/realocar arquivos exige avaliação humana de uso, histórico, galeria, privacidade e cópia de segurança.

**Resultado:** triagem por tipo e diretório concluída; determinação de uso real/duplicação e qualquer limpeza continuam pendentes.

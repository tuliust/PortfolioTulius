# Workflows históricos retirados da execução — 11/11/2026

> **NÃO EXECUTAR.** Arquivos originais preservados byte a byte (blobs Git) e removidos de `.github/workflows/` para que não apareçam mais como gatilhos de Actions. Não foram executados ou migrados para um novo destino. Reativação futura requer demanda específica, revisão de credenciais, dependências e segurança.

| Arquivo arquivado | Motivo |
|---|---|
| [`p1-p3-isolated-preview.yml`](p1-p3-isolated-preview.yml) | Prévia de fase anterior; preservados scripts e gates atuais P3/P5, sem habilitar automação antiga |
| [`p2-transactional-staging.yml`](p2-transactional-staging.yml) | Staging cloud manual incompatível com diretriz posterior de stack Supabase local sintética |
| [`publish-experience-media-once.yml`](publish-experience-media-once.yml) | Publicação única de ilustrações que faz uploads/associações e não precisa permanecer executável |
| [`cdi-slide-remove-text.yml`](cdi-slide-remove-text.yml) | Manipulação e publicação de mídia CDI específica, com secrets administrativos |
| [`generate-approved-hero.yml`](generate-approved-hero.yml) | Geração pontual de retrato que utiliza permissão de escrita no Git |

Workflows operacionais preservados: `validate.yml`, `audit-p3-lighthouse.yml`, `p5-admin-readonly.yml`, `p5-local-transactional.yml`, `hygiene-audit.yml` e `export-docs-snapshot.yml`. **Scripts, código de aplicação e dados não foram excluídos.**

[Guia de CI atualizado](../../05-operacao/TESTES_E_HOMOLOGACAO.md) · [índice](../../README.md).

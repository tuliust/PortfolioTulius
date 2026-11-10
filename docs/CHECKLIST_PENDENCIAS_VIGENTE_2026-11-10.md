> **Atualização de verificação executada (10/11/2026):** os três dumps SQL passaram SHA-256, **22/22 tabelas públicas** e **3/3 contagens adicionais** `auth.users`, `storage.buckets`, `storage.objects` coincidem com a produção; 25/25 sem divergências. Ver [relatório pré-restauração](P2_PRECHECK_BACKUP_RESTORACAO_2026-11-10.md) e [verificador CLI](../scripts/hygiene/verify-supabase-backup.mjs). Todos os cinco workflows do SHA `9a9d4c6e` foram aprovados, inclusive P3 LCP mobile 3.385,556 ms (PASS). **Restauração isolada não executada**; Storage físico não exportado e histórico de migrations ausente do dump padrão. P2 não instalada.

---
# PortfolioTulius — Checklist de pendências vigente
**Atualizado em:** 10/11/2026 · **Fonte:** aceites expressos do proprietário, Google Drive e SELECT somente leitura do Supabase. **Preservar relatórios históricos**, que podem refletir etapas anteriores.

## Checklist de 12 itens

| # | Pendência original | Estado vigente | Evidência / condição de fechamento |
|---|---|---|---|
| 1 | Resolver ou aceitar LCP mobile | **ACEITE FORMAL CONCLUÍDO** | Risco residual aceito pelo proprietário, não implica PASS do Lighthouse nem flexibiliza teto de 3.500 ms. Último P3 do SHA `0154a10c`: mediana 3.610,834 ms, [FAIL](https://github.com/tuliustsangaropulos/PortfolioTulius/actions/runs/42891640178). |
| 2 | Homologar visual em dispositivos reais | **ACEITE HUMANO CONCLUÍDO** | Proprietário declarou homologação visual bem-sucedida; declaração humana, não nova evidência de testes instrumentados de zoom 200% / leitor de tela. |
| 3 | Comprovar backup recuperável Supabase | **PARCIAL — RESTAURAÇÃO PENDENTE** | `roles.sql` 370 B, `schema.sql` 78.429 B, `data.sql` 430.369 B; SHA-256 conferido com `SHA256SUMS.txt`, no Drive. **Sem restauração executada em PostgreSQL 17 isolado**; objetos físicos do Storage e histórico `supabase_migrations` exigem tratamento separado. |
| 4 | Criar e verificar segunda cópia privada | **CONCLUÍDO (CÓPIAS SQL)** | Pasta primária privada [04 - Backup](https://drive.google.com/drive/folders/1KYWGJVvrxDsCgKjahkqRtNeJztcTImd8), cópia privada [Copia_02](https://drive.google.com/drive/folders/1WR-5USAG380pmnbdcBhO6emJiO3XJKiZ); 4 arquivos em cada, mesmos tamanhos e hashes. Não foi comprovada criptografia em repouso controlada pelo usuário; ambas na mesma conta Google (não independentes de falha da conta). |
| 5 | Reconciliar histórico das migrations | **ANÁLISE FEITA, RECONCILIAÇÃO OPERACIONAL PENDENTE** | 11 SQL em Git; 9 versões remotas. 8 versões coincidem; baseline `202610220001` só no Git; `delete_media_asset_everywhere` com timestamp Git `20261105101500` vs remoto `20261105101829`; P2 nova ainda não aplicada. Preservar `schema_migrations` e resolver mapeamento antes do deploy. |
| 6 | Preparar recuperação e rollback produtivo | **PLANO PREPARADO, ENSAIO PENDENTE** | Plano operacional e SQL de rollback foram preparados; exigir teste de restauração, caminho de recuperação e validação de reversão em isolado antes da produção. |
| 7 | Autorizar especificamente a migration P2 | **AUTORIZADO PELO PROPRIETÁRIO** | Consentimento expresso para executar automaticamente quando as condições técnicas de segurança forem satisfeitas. |
| 8 | Aplicar e homologar P2 em produção | **BLOQUEADO PELA RESTAURAÇÃO** | SELECT atual: 14 sections / 28 content_blocks / 56 block_placements / 75 media_assets / 9 migrations. `public.save_section_block_atomic` ausente; `block_placements.updated_at` ausente. Nenhum DDL P2 aplicado. |
| 9 | Validar casos residuais de CMS e mídia | **RESERVADO PARA FASE SEGUINTE** | Cobertura sintética ampla já encerrada; faltam combinações residuais, referências não mapeadas e simulação distribuída de ACK perdido em renomeação. |
| 10 | Decidir crédito público de mídia | **DECISÃO CONCLUÍDA; REMOÇÃO PARCIAL** | Proprietário decidiu não usar crédito no público, admin/CMS nem Supabase. Commit [`28b8e2c8`](https://github.com/tuliustsangaropulos/PortfolioTulius/commit/28b8e2c8d77a4c45200f4faf7e78290c9ca1ed96) ocultou campo no CMS e removeu gravação pelo formulário. Coluna `media_assets.credit` e 60 valores históricos permanecem preservados até backup/restauração comprovada; remoção de schema/dados pendente se desejada. |
| 11 | Sincronizar documentação privada e evidências finais | **PENDENTE** | Documentação operacional no GitHub recebeu este checklist; arquivos privados do projeto (snapshots 08/11) ainda não foram substituídos/reconciliados. |
| 12 | Aceite e encerramento integral | **BLOQUEADO** | Executar etapas 3, 5, 6, 8, 9, 10 e 11 conforme escopo, então consolidar aceites e encerramento. |

## Hashes de controle — cópias do Drive

| Arquivo | SHA-256 |
|---|---|
| roles.sql | `168A95A9C745AF5ED4679751F90419AC9DC434240A213B03E32A06D5664C2308` |
| schema.sql | `779C6AC50D707453641922225CC719998C1980D4DCDF4639818367A8A70B4D86` |
| data.sql | `B37BCA458CE354E370D4A13A672D06FB577B5FF82150A0BF555A7977D6F3C2AC` |

Os três hashes foram conferidos contra os arquivos recebidos no Drive, nas duas cópias. **Hash correto não é prova de recuperação**. Os dumps SQL contêm dados sensíveis: não publicar no GitHub e proteger/encriptar o armazenamento.

## Próximos passos (ordem obrigatória)

1. Preparar PostgreSQL 17 **isolado**, com dependências e schemas compatíveis, sem conexão de escrita à produção. Restaurar `roles.sql`, `schema.sql` e `data.sql`; documentar erros e contagens, constraints, RLS, RPCs, índices, triggers, sequências e leitura dos dados. Se necessário, adequar o procedimento ao contexto gerenciado Supabase sem apagar o dump original. Obter evidência inequívoca de restauração.
2. Fazer backup separado dos **objetos físicos** Supabase Storage e conferir integridade; preservar/reconciliar o histórico real `supabase_migrations` sem alterar versões remotas arbitrariamente. A ausência desse histórico nos três dumps deve ser tratada explicitamente.
3. Ensaiar rollback e plano de continuidade P2 no isolado, incluindo comportamento de clientes antigos, migração reversível e validação sem escrita parcial. Rever diferenças Git/remoto de migration e validar compatibilidade.
4. Somente **após os gates anteriores**, aplicar `supabase/migrations/20261109024100_p2_composite_section_block_save.sql` no banco `portfolio` sob a autorização já recebida; confirmar assinatura RPC, coluna/trigger, CAS, RLS, atomicidade, concorrência e comportamento em erro com evidência de releitura. Não executar aqui antes de restauração.
5. Finalizar decisão técnica sobre a coluna `credit`, preservando dados até backup testado e sem expor o campo na UI. Validar casos residuais CMS/mídia; sincronizar documentação privada; apresentar relatório de encerramento ao proprietário.

## Situação confirmada ao encerrar esta atualização

- **Backup SQL:** exportado, com duas cópias no Drive e integridade verificada.
- **Recuperabilidade:** não comprovada até restauração isolada.
- **Ambiente produtivo:** consulta somente leitura; migration P2 não executada.
- **LCP mobile:** o workflow continua `FAIL`; o risco foi aceito formalmente, sem mascarar o desvio.
- **Aceite visual humano:** concedido.
- **Próxima fase:** restrita aos casos residuais CMS/mídia, documentação privada e encerramento **depois** dos gates produtivos.

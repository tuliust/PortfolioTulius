> **PROVA FÍSICA DE STORAGE ENDURECIDA — 11/11/2026 02:57 BRT:** HEAD publicado [`2b81ec6c`](https://github.com/tuliustsangaropulos/PortfolioTulius/commit/2b81ec6c662375a2da1d1ade1e9a2978944152d8). O verificador agora cruza o backup com o manifesto privado de origem: quantidade exata, identidade bucket/path, tamanho e SHA-256 quando disponível. Um índice truncado, mas internamente coerente, é rejeitado; verificação sem manifesto informa explicitamente `manifestMatched:false` e não deve ser usada como prova dos 128 objetos. Testes locais: 260/260 aplicação e 10/10 higiene; [Validate #42968968980](https://github.com/tuliustsangaropulos/PortfolioTulius/actions/runs/42968968980) e [Hygiene #42968968984](https://github.com/tuliustsangaropulos/PortfolioTulius/actions/runs/42968968984) **SUCCESS**. Vercel Production `dpl_Dk3P9ksVVqYQZFZLQkEkKYHdz5DK` READY para o mesmo SHA. O backup físico ainda não foi executado: esta melhoria é preparação verificada, não prova de recuperação. Supabase permaneceu somente leitura, com 9 migrations, P2 ausente e 60 créditos preservados.

> **P3 DO SHA DOCUMENTAL — 11/11/2026 00:56 BRT: REPROVADO.** [Audit P3 #42955635610](https://github.com/tuliustsangaropulos/PortfolioTulius/actions/runs/42955635610) terminou **FAILURE** somente no budget mobile: amostras LCP 5.012,148 / 3.654,468 / 3.439,778 ms; mediana **3.654,468 ms > 3.500 ms**. O primeiro ensaio teve TBT 1.785 ms; isso é diagnóstico, não motivo para descartar a amostra. Desktop LCP 955,223 ms PASS; browser, 38 capturas, RLS, quatro falhas parciais e SEO PASS. O código do produto não mudou desde o P3 anterior aprovado, mas este resultado permanece não conforme e não foi rerodado para selecionar amostra favorável.

> **ATUALIZAÇÃO VIGENTE — 11/11/2026 00:51 BRT:** HEAD publicado `de797804639e91703c40db134231590aad466027`; [Validate #42949578058](https://github.com/tuliustsangaropulos/PortfolioTulius/actions/runs/42949578058) e [P5 #42949578076](https://github.com/tuliustsangaropulos/PortfolioTulius/actions/runs/42949578076) **SUCCESS na primeira tentativa**. P5 isolado **121/121** = 8 base + 13 P2 + 87 navegador/CMS + 8 mídia + 5 SEO, endpoint loopback e `cloudConnections: 0`. Os 13 contratos P2 agora incluem escrita por cliente legado após a migration e preservação de escrita posterior diante de replay obsoleto. Último P3 integral permanece [#42938878493](https://github.com/tuliustsangaropulos/PortfolioTulius/actions/runs/42938878493) **SUCCESS**, LCP mobile mediano **3.439,002 ms**, sem alteração posterior no código do produto. Vercel Production `dpl_9SvTASXspRKTVgXnS6bjUymB52b3` READY para esse SHA. Supabase produtivo somente leitura: 9 migrations, 14 seções, 28 blocos, 56 placements, 75 mídias, 60 créditos; RPC/coluna P2 ausentes e coluna `credit` presente. Restore PostgreSQL 17, bytes dos 128 objetos Storage e ensaio sobre o restore real continuam gates; P2 e remoção de crédito não aplicadas.

## Checklist incremental das oito frentes — 11/11/2026 00:51 BRT

| Frente | Estado | Evidência / gate restante |
|---|---|---|
| 1. Backups | **PARCIAL** | Três SQLs, hashes e duas cópias privadas conferidos; restore PG17 e bytes/hash dos 128 objetos Storage não comprovados. |
| 2. Migrations | **PARCIAL** | Nove remotas confirmadas; mídia `20261105101829` alinhada; baseline `202610220001` somente Git; nenhuma alteração em `schema_migrations`. |
| 3. Recuperação/rollback | **PARCIAL** | P2 sintético 13/13 cobre CAS, falhas, autorização, cliente legado, retry e escrita posterior; falta repetir sobre restore real. |
| 4. P2 produção | **BLOQUEADO** | Autorização humana existe; gates objetivos de restore, Storage e rollback real incompletos. |
| 5. CMS/mídia | **CONCLUÍDO NO ESCOPO VIGENTE** | P5 atual 121/121; último P3 integral aprovado e código do produto inalterado desde então. |
| 6. Crédito | **PARCIAL** | Consumidores removidos e migration staged; coluna e 60 valores preservados até recuperação comprovada. |
| 7. Docs/evidências | **CONCLUÍDO NESTA RODADA** | Estado corrente e evidências convergidos; históricos preservados abaixo. |
| 8. Encerramento integral | **BLOQUEADO** | Depende de restore real, Storage físico, rollback, P2 e remoção final do crédito. |

---

> **ATUALIZAÇÃO VIGENTE — 10/11/2026 22:24 BRT:** o SHA funcional `67bb01d02b4da7cc7d2f5f212c3e3a56716de0c5` foi publicado e aprovado em [Validate #42936867997](https://github.com/tuliustsangaropulos/PortfolioTulius/actions/runs/42936867997) e [P3 #42936867884](https://github.com/tuliustsangaropulos/PortfolioTulius/actions/runs/42936867884). O P3 terminou **SUCCESS**: quatro cenários públicos de falha parcial PASS, 38 capturas sem falha, RLS/SEO PASS e LCP mobile mediano **3.447,363 ms**, mantendo o teto ≤3.500 ms. A falha anterior era sincronização do teste com a leitura tardia `pages`, corrigida sem mudar UI, dados ou asserções. Produção Supabase permaneceu somente leitura: 9 migrations; 14 seções / 28 blocos / 56 placements / 75 mídias; 60 créditos preservados; 128 objetos Storage (72 públicos + 56 privados); P2 ausente. Restore PostgreSQL 17, bytes do Storage e rollback continuam gates obrigatórios.

## Checklist incremental das oito frentes — 10/11/2026 22:24 BRT

| Frente | Estado | Evidência / gate restante |
|---|---|---|
| 1. Backups | **PARCIAL** | SQLs e duas cópias privadas com hashes conferidos; restore PG17 e bytes/hash dos 128 objetos Storage não comprovados. |
| 2. Migrations | **PARCIAL** | 9 remotas; mídia `20261105101829` alinhada; baseline `202610220001` somente Git; não fazer replay/backfill arbitrário. |
| 3. Recuperação/rollback | **BLOQUEADO** | Falta ensaio no restore real: CAS, falha pós-escrita, idempotência, autorização, cliente legado e preservação de escritas posteriores. |
| 4. P2 produção | **BLOQUEADO** | Autorização humana existe; gates objetivos 1 e 3 continuam incompletos. Migration `20261109024100` não aplicada. |
| 5. CMS/mídia | **CONCLUÍDO NO ESCOPO VIGENTE** | P5 sintético 119/119 no SHA anterior relevante e P3 público completo no SHA funcional `67bb01d0` SUCCESS. |
| 6. Crédito | **PARCIAL** | Consumidores removidos e migration staged; coluna e 60 valores preservados até recuperação comprovada. |
| 7. Docs/evidências | **CONCLUÍDO NESTA RODADA** | Checklist, estado e issues sincronizados em commit documental único; fontes privadas preservadas separadamente. |
| 8. Encerramento integral | **BLOQUEADO** | Depende de restore, Storage físico, rollback, P2 e remoção final do crédito. |

---

> **Atualização verificada 10/11/2026 — continuidade da restauração:** HEAD pré-documental `ec754448`, GitHub Actions Validate/P5/Export concluídos com sucesso, Vercel Production READY; Supabase confirmado em leitura sem RPC P2 nem coluna `block_placements.updated_at`, 9 migrations, 60 créditos históricos. O arquivo original `roles.sql` foi inspecionado e o bloqueio do `GRANT SET ON PARAMETER log_min_messages` foi isolado; cópia adaptada **somente local** preparada/testada, sem restauração executada. Storage físico, teste de recuperação e rollback ainda são gates obrigatórios. Ver [diagnóstico de retomada](P2_RESTORE_CONTINUIDADE_2026-11-10.md). Não reaplicar baseline, não remover `credit` e não aplicar P2 antes dos gates. Os estados históricos abaixo permanecem preservados.\n\n---\n\n> **Migration de mídia reconciliada (10/11/2026):** o registro remoto `supabase_migrations.schema_migrations` versão `20261105101829` contém um único SQL de 7.899 caracteres, **idêntico byte a byte** ao arquivo Git anteriormente nomeado `20261105101500_delete_media_asset_everywhere.sql`. O arquivo Git foi **renomeado sem alterar conteúdo** para `20261105101829_delete_media_asset_everywhere.sql`, alinhando o versionamento ao que de fato foi aplicado. Nenhum comando SQL ou migration foi executado no remoto. O baseline `202610220001` permanece pendente de resolução segura e P2 continua não aplicada.

---
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

> **Inventário Storage:** 56 objetos privados (2.840.299 B) + 72 públicos (1.821.052 B) = 128 objetos (4.661.351 B). Catálogo: 75 referências existentes, zero faltantes; 53 objetos sem cadastro editorial, **não excluir** e incluir no backup físico. Ver [relatório](P2_PRECHECK_BACKUP_RESTORACAO_2026-11-10.md).

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

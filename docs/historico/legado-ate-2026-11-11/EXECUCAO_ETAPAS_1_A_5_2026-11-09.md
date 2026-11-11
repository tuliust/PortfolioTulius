# Execução conectada — etapas 1 a 5 do P2/P4, 09/11/2026

**Escopo autorizado:** GitHub, Vercel e Supabase em leitura. **Sem migration produtiva, escrita em tabelas/Storage de produção ou deploy manual.** Todos os testes de escrita usaram somente Supabase CLI/Docker isolado em `127.0.0.1:54321` e dados inteiramente fictícios. A Vercel publica automaticamente os commits de `main`.

## Baseline, código e status de aceitação

- **Baseline auditado:** `c3b8c6954257440f007c3fbd4c883a7a71123727`. [Validate #42562931930](https://github.com/tuliustsangaropulos/PortfolioTulius/actions/runs/42562931930) SUCCESS; [P5 #42562931933](https://github.com/tuliustsangaropulos/PortfolioTulius/actions/runs/42562931933) SUCCESS 38/38; [P3 #42562931895](https://github.com/tuliustsangaropulos/PortfolioTulius/actions/runs/42562931895) **FAIL**, mobile LCP 3.768,041 / 3.876,691 / 3.884,447 ms, **mediana 3.876,691 ms > 3.500 ms**.
- **Mudança P3:** `c75e5626` carrega a mesma folha Google Fonts, com mesmas famílias e pesos, por stylesheet preload assíncrono no HTML e `noscript`; não altera CSS público nem design final. **Hipótese de performance, não resultado Lighthouse confirmado.** P3 [#42564639180](https://github.com/tuliustsangaropulos/PortfolioTulius/actions/runs/42564639180) FAIL porque o domínio avançou de SHA durante outros commits; também registrou falha de browser. Não usá-lo como medição do experimento no SHA estável.
- **Mudança P4 mídia:** `66a9a15c` expõe campo `Crédito (opcional)` na Biblioteca; `128128b3` corrige formatação; o campo `credit` já existia no draft, validadores e tabela. Não há legenda pública automática de `credit`.
- **E2E incremental:** `f713467c` introduziu cinco cenários reais de UI de mídia ([P5 #42564855326](https://github.com/tuliustsangaropulos/PortfolioTulius/actions/runs/42564855326), **43/43 PASS**). `c2713b14` adicionou conflito composto e navegação ([P5 #42565670711](https://github.com/tuliustsangaropulos/PortfolioTulius/actions/runs/42565670711), **48/48 PASS**). `f9e48dcb8188ebce57b6b5b80149c0a6606e3cb7` adicionou Hero A/B e renderer ([P5 #42566409424](https://github.com/tuliustsangaropulos/PortfolioTulius/actions/runs/42566409424), **52/52 PASS**; [Validate #42566409385](https://github.com/tuliustsangaropulos/PortfolioTulius/actions/runs/42566409385) **SUCCESS**).
- Falhas intermediárias preservadas: Validate `66a9a15c`/`f713467c` apenas formatação; P5 `d1a042ca` por fixture navegacional incompatível com índice único `target_slug`; P5 `63933c10` por corrida ao trocar de aba após salvar o Hero A. Ambas as falhas sintéticas foram corrigidas e reconfirmadas em P5 `c2713b14` / `f9e48dcb`. **Não confundir essas falhas com sucesso inicial.**
- Este arquivo/documentação gera SHA posterior ao funcional `f9e48dcb`. **Validar Validate, P5, P3, fingerprint `/p3-deployment.json` e deployment `READY` desse SHA documental antes de conceder qualquer aceite final.**

## Matriz comprovada no mesmo runner P5 (código `f9e48dcb`)

| Grupo de provas | Cenários PASS | Evidência e limites |
|---|---:|---|
| P5 originais | 8 | Auth/RLS, sections, tokens, bloco atômico, restauração |
| P2 RPC composta | 11 | Versão/CAS e rollback em migration somente no banco sintético |
| P4 navegador autenticado | **20** | 6 básicos + 5 mídia + 5 conflito/navegação + 4 Hero |
| P4 Storage/Auth/media API | 8 | Buckets, RLS, renomeação, compensação, promoção e exclusão |
| SEO sintético | 5 | RPC, rollback, HTML do build, canonical/robots/sitemap e publicação |
| **Total** | **52/52** | `http://127.0.0.1:54321/`, **0 escritas cloud** |

Casos novos de UI efetivamente demonstrados: upload real de arquivo sintético e índice público, edição `alt_text`/`credit`/`focal_point.zoom`, CAS obsoleto sem sobrescrita, fechar/reabrir e excluir objeto+catálogo sem órfãos; erro de versão de `sections` após alteração concorrente com RPC composta; guarda de alterações não salvas; ordem, rótulo e destino da navegação em DB e menu desktop/mobile; Hero A mensagem e selo, Hero B título/destaques, reordenação preservando o `hero` do item 0; renderer Hero desktop/mobile com valor fictício salvo. Cada teste de renderer mostra apenas a cadeia específica que assertou, **não** o catálogo inteiro.

## Verificações Supabase produção, SOMENTE leitura

- Consulta `pg_proc`: `public.save_section_block_atomic` **não instalada**. Funções existentes: `save_content_block_atomic`, `save_home_seo_atomic`, `swap_section_order`, `delete_media_asset_everywhere`.
- `list_migrations`: **9 versões registradas**, sem `20261109024100_p2_composite_section_block_save.sql`.
- RLS `relrowsecurity=true` inspecionado em `sections`, `content_blocks`, `block_placements`, `career_experiences`, `media_assets`, `navigation_items`, `testimonials`, `pages`, `site_settings`, `content_revisions`. Isso prova habilitação, não equivalência a uma auditoria de segurança completa.
- Buckets `portfolio-public` (público) e `portfolio-private` (privado), limite 8.000.000 bytes; nenhuma escrita ou operação mutável cloud.

## Gatilhos restantes / pendências

1. **P3 LCP mobile:** validar experimentalmente *três amostras* Lighthouse no mesmo SHA publicado, mediana ≤3500 ms; conferir capturas, CLS, acessibilidade, SEO e navegador. A edição de fonte não é aprovação de performance. Se reprovar, manter P3 pendente e revisar ou reverter experimento sem alterar aparência.
2. **P4 matriz completa:** os 20 testes UI não cobrem todos os campos dos dois Heros, estilos/placements desktop-mobile, navegação complexa, coleções completas, Trajetória, depoimentos, revisão/restauração, tokens, falhas de rede incertas, compensação de erro após SQL pela UI e precedência global `focal_point` versus `mediaFraming`.
3. **SEO real:** o SEO estático muda após build/deploy. A aprovação sintética não testa uma edição editorial no banco cloud (proibida) nem comprova alteração de SEO real sem esse fluxo autorizado.
4. **P2 produção:** aplicação da migration e eventual rollback dependem de **autorização escrita separada do proprietário**. Não foi autorizada nem executada aqui.
5. **Manual:** conferir visual final desktop/mobile e aprovar UX/editorial; substituir as Fontes privadas do ChatGPT por versões atualizadas; emitir aceite operacional somente com todos os gates cumpridos.

A documentação não se substitui à evidência publicada por GitHub Actions. Nunca declarar P2/P4 concluído por este arquivo, pelo Validate isolado ou pelo simples estado Vercel READY.

# P1 — Contrato de integração editorial

Atualizado em 2026-10-24. Branch principal: `main`.

## Navegação
- O conteúdo e a ordem das seções continuam definidos em `sections`. Ocultar um item de `navigation_items` **não** oculta a seção, apenas a entrada do menu.
- A lista do menu é gerada de `navigation_items` com `status=published`, `is_visible=true`, ordenada por `sort_order`, deduplicando `target_slug` e exigindo seção publicada/visível.
- `group_name` cria separadores editoriais; os links continuam apontando para as âncoras das seções.

## Coleções e blocos
- Fonte padrão: `content_blocks.content_json.items`. Todos os blocos existentes continuam manuais até decisão editorial explícita.
- `content_json.source_collection` pode apontar para uma das nove coleções autorizadas no editor de Blocos. A opção não aparece para a seção `perfil`, protegendo o herói inicial.
- Com vínculo ativo, o site lê exclusivamente registros publicados da coleção. Na prévia autenticada, também lê rascunhos/em revisão, mas nunca arquivados. A propriedade `items` manual do bloco fica preservada como origem reversível.
- Não existe reconciliação automática de equivalência semântica entre os antigos itens manuais e os registros estruturados. A ativação de cada vínculo exige revisão editorial e validação visual.
- Mudanças no CMS chegam ao site via carregamento do Supabase; recarregar a página pública após publicar um registro.
- Adaptadores: `src/lib/collections.ts`. Vinculação: `src/hooks/usePortfolio.ts`. Testes: `src/lib/collections.test.ts`.

## SEO
- `index.html` contém metadados estáticos alinhados à versão editorial aprovada.
- `scripts/generate-seo.mjs` roda **após** `vite build` e usa apenas credenciais publicáveis de ambiente (quando presentes) para ler `pages` e `site_settings` já publicados. Se o banco estiver indisponível, usa metadados seguros estáticos.
- O build gera `dist/robots.txt` e `dist/sitemap.xml`. Rotas `/admin/` recebem `X-Robots-Tag: noindex` pela Vercel.
- Alterações de SEO no CMS aparecem no documento do navegador durante o carregamento e somente alteram o HTML servido diretamente a crawlers **após um novo deployment**.
- A gravação de `pages` e `site_settings` agora usa a RPC administrativa transacional `save_home_seo_atomic`.

## Mídia
- Novos arquivos entram em `portfolio-private`.
- Substituição direta de objeto já público foi bloqueada para não publicar imagens de revisão.
- Para uma nova versão de mídia pública, enviar uma nova mídia privada, revisar créditos e descrição e publicar.
- O fluxo de promoção entre Storage e banco ainda não é uma transação única; erros e cópias órfãs devem ser monitorados. A API tenta limpar uma cópia pública caso a atualização de metadados falhe.

## Homologação pendente
1. `pnpm.cmd typecheck`, `pnpm.cmd test`, `pnpm.cmd build` na `main`.
2. Inspecionar tela inicial desktop e responsiva, navegação por grupos e âncoras.
3. Confirmar listagem/ocultação de itens do menu via CMS (reversível).
4. Vincular inicialmente **um bloco não crítico**, em prévia, depois conferir conteúdo publicado; evitar ativar vínculos nos demais blocos sem reconciliação editorial.
5. Testar gravação SEO com usuário administrador e geração no próximo build.
6. Testar upload de mídia privada e comportamento de bloqueio ao substituir mídia pública, sem enviar conteúdo sensível.

Não atualizar as 9 pendências editoriais sem validação humana dos fatos.

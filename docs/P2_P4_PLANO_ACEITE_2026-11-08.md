# P2/P4 — Plano de aceite versionado (referência e atualização)

> **Atualização operacional em 09/11/2026:** o conteúdo abaixo é o contrato de 08/11 (SHA `2c01b7d9`) preservado como especificação. Desde então, `save_section_block_atomic` foi implementada em migration incremental, validada em 11 cenários sintéticos e integrada aos editores; **não foi aplicada em produção**. Também ocorreram seis E2E básicos de UI, cinco de SEO e oito cenários adicionais reais de Auth/Storage sintéticos. A meta Lighthouse mobile falhou em 09/11 e exige novo resultado de três amostras antes de aceite. Consultar também `P2_P4_RELATORIO_EXECUCAO_2026-11-09.md` e `ESTADO_ATUAL_VIGENTE.md` para evidências e limites atuais.

# P2 e P4 — Plano de execução, testes e aceite técnico

**Registrado em:** 08/11/2026 (Brasília). **Baseline técnico:** [`2c01b7d9`](https://github.com/tuliustsangaropulos/PortfolioTulius/commit/2c01b7d92bdb0161e056e8b3ba0b86de4986e5aa).  
**Natureza:** especificação de trabalho **ainda não executada integralmente**. A criação deste Markdown não autoriza writes no Supabase remoto, mudanças de visual, credenciais, deploy manual ou aplicação de migrations.  
**Documentos de apoio:** [CMS](ADMIN_CMS.md), [mapa de campos](MAPA_CAMPOS_CMS_RENDERER.md), [staging local](SUPABASE_STAGING_LOCAL_ISOLADO_2026-11-02.md), [estado](ESTADO_ATUAL_VIGENTE.md) e [pendências](OPEN_ISSUES.md).

## 1. O que já foi demonstrado

| Gate | Evidência do SHA `2c01b7d9` | Situação |
|---|---|---|
| Validação estática, testes, build | [Validate #42544506760](https://github.com/tuliustsangaropulos/PortfolioTulius/actions/runs/42544506760) | PASS: 237 testes/54 arquivos, formatação, TypeScript, build, smoke |
| CMS com autenticação de produção, **sem escrita** | [P5 Read-Only #42544506774](https://github.com/tuliustsangaropulos/PortfolioTulius/actions/runs/42544506774) | PASS: 19/19 verificações, 0 mutações |
| Navegador, performance e SEO público | [P3 Lighthouse #42544506866](https://github.com/tuliustsangaropulos/PortfolioTulius/actions/runs/42544506866) | PASS: 0 falhas de browser, 38 capturas, SEO paridade, LCP mobile mediano 3.352,59 ms |
| JWTs e operações reais em Supabase **sintético** | [P5 Local Transactional #42357365026](https://github.com/tuliustsangaropulos/PortfolioTulius/actions/runs/42357365026) | PASS em **SHA anterior**, não comprovação da versão final |
| Edição, gravação, releitura e renderer por campo | Sem run E2E integral do formulário | **PENDENTE** |

O `READY` do deployment, o sucesso de Lighthouse e as 19 verificações de UI read-only **não** demonstram escrita no banco. O teste P5 Local com oito cenários comprova RPC/API em ambiente sintético, mas não executa os formulários completos do navegador.

## 2. P2 — Persistência consistente

### 2.1 Limitação atual

- Em `src/components/admin/AdminModules.tsx`, alterações de `sections.title/eyebrow/intro` são salvas por PostgREST antes de `public.save_content_block_atomic(...)` atualizar bloco e placements. Falha entre ambos confirma apenas a primeira parte; a interface avisa, mas não dá rollback.
- Em `src/components/admin/AdminApp.tsx`, atualizações de `sections.animation_preset` e metadados administrativos em `content_blocks.content_json` também podem ocorrer em chamadas separadas.
- `save_content_block_atomic` protege **um bloco e seus placements**, não uma seção editorial inteira, e não recebe uma versão esperada para todos os campos do bloco.
- A RPC `save_home_seo_atomic` já é atômica para `pages` + `site_settings`. Sua atomicidade não se estende ao build/deploy SEO.

### 2.2 Alteração recomendada

1. Projetar e versionar **nova migration incremental**, sem reaplicar o baseline original. Definir RPC de gravação composta cujo contrato contenha ID de seção, ID de bloco, payloads de campos realmente alterados, alterações de placements, versões esperadas (`updated_at`) e resposta de conflito compreensível.
2. Dentro de **uma única transação PostgreSQL**: validar papel administrativo usando proteção `private` existente; validar inputs; bloquear linhas necessárias; comparar versões esperadas; aplicar update de seção/bloco; aplicar upserts de placements; deixar triggers de revisão/auditoria operarem normalmente; elevar exceção para rollback completo.
3. Preservar salvamentos exclusivos de texto/seção sem regravar JSONB ou placements desnecessariamente. Manter `editorTitle`, `editorAnchor` e `hero.rootBackground` sob o mesmo protocolo de consistência quando forem gravados em conjunto.
4. Atualizar componentes admin com novas chamadas, feedback de sucesso **após releitura** e indicação explícita de conflitos/perdas de conexão.
5. Cobrir erro forçado após update da seção, concorrência com duas sessões, input inválido, replay, timeout e leitura posterior. Em falha, conferir **zero gravações parciais**.
6. Não modificar banco cloud até que o proprietário **autorize especificamente a aplicação** da migration e o plano de rollback/monitoramento.

**Alternativa aceitável somente por decisão explícita:** manter RPC separada e registrar risco de parcialidade como aceito. Nesse caso, P2 não poderá ser descrita como transacionalmente atômica.

### 2.3 Contratos de mídia

- Para `media_assets.alt_text`, continuar a usar `src/lib/media-alt-sync.ts` para sobrepor as cópias de JSONB na leitura de imagens publicadas, incluindo campos `alt`, `aboutDesktopAlt`, `mobileEditorial.mobileAlt`, `logoAlt`, `slides[].alt`. As cópias legadas podem permanecer para fallback. Testar atualização de catálogo, reload desktop/mobile, imagem externa/privada e catálogo indisponível.
- Para `media_assets.focal_point`, **não presumir** propagação automática: o hook público atualmente busca apenas `storage_path,alt_text`, enquanto os componentes interpretam `mediaFraming`/`mobileFraming` guardados nos usos. Decidir se o catálogo deve fornecer default e a precedência de overrides.
- Para `media_assets.credit`, documentar se é apenas catálogo ou legenda pública; não inventar renderização inexistente.
- Para Storage: upload, promoção, renomeação de privado e exclusão combinam API de objetos e banco; não constituem transação distribuída. Testar compensação, resultado incerto e retry/idempotência com arquivos fictícios.

## 3. P4 — Matriz de testes ponta a ponta

Em **stack sintético**, cada grupo de controles deve executar: **editar na UI → salvar → fechar/reabrir → reler por PostgREST autenticado → montar versão pública → verificar desktop/mobile**, mantendo os dados antes/depois e logs. Para campos sem representação pública, registrar de forma explícita **“somente administrativo”** em vez de inventar efeito no renderer.

| Grupo | Campos prioritários | Banco | Teste negativo |
|---|---|---|---|
| Seção e Hero A | title, eyebrow, intro, fundo, foto, selo, apresentação, style/format | `sections`, `content_blocks` | Falha após primeira escrita, CAS e rollback |
| Hero B | cinco botões, `targetSlug`, reordenação, `hero` no item 0, títulos/formatos, destaques, próxima âncora | `content_blocks` | Reordenação mantém globals; seção oculta rejeitada |
| Desktop/mobile | estilo, ordem, visibilidade, motion e composição editorial 360° | `block_placements`, JSONB | Overrides isolados entre dispositivos |
| Navegação | label, destino, ordem, visibilidade | `navigation_items` | Destino inválido e item oculto |
| Coleções/Trajetória | itens publicados e `career_experiences` com `updated_at` | tabelas próprias | Usuário não-admin, concorrência |
| Mídia | alt, título, crédito, focal point, URL/Storage | `media_assets`, Storage, referências JSON | Erro após SQL, falha de publicação e exclusão |
| SEO | title, description, OG, locale, robots, canonical, status | `pages`, `site_settings`, `dist/index.html` | Falha de RPC e ausência de novo build |
| Revisões/Prévia | histórico permitido, confirmação e modo 390 × 844 | `content_revisions`, UI protegida | Restauração indevida e acesso anônimo |

Asserções que dependem de visuais devem testar propriedades, texto, posição e disponibilidade da imagem com dados determinísticos, evitando aprovação apenas por captura screenshot.

## 4. Ambiente de teste permitido

O projeto decidiu usar **Supabase CLI + Docker local, sem novo projeto cloud**. Existe workflow GitHub Actions com runner Docker, de modo que o usuário não precisa necessariamente rodar tudo no VS Code:

- [`.github/workflows/p5-local-transactional.yml`](https://github.com/tuliustsangaropulos/PortfolioTulius/blob/main/.github/workflows/p5-local-transactional.yml) usa Supabase CLI v3 e `supabase/config.toml` com **somente** `seed.local.synthetic.sql` em `http://127.0.0.1:54321/`.
- [`scripts/p5-local-transactional.mjs`](https://github.com/tuliustsangaropulos/PortfolioTulius/blob/main/scripts/p5-local-transactional.mjs) testa 8 verificações de integração reais, incluindo Auth local, RLS, seção, tokens, RPC de bloco e restauração.
- A suíte sintética não substitui automaticamente os testes de UI do navegador, nem os cenários de mídia e SEO; ampliar os testes mantendo o destino em loopback.
- O workflow antigo `p2-transactional-staging.yml` exige **projeto Supabase cloud isolado**; não utilizá-lo para o staging local escolhido.

**Atenção:** `supabase/tests/rls.sql` contém um requisito histórico de 14 seções públicas, que não corresponde ao seed local exclusivamente fictício. Não rodá-lo como se fosse o aceite local vigente; criar/adaptar teste isolado compatível.

## 5. Gate de publicação, SEO e performance

1. Conferir `main`, fingerprint em `/p3-deployment.json`, estado Vercel `READY` e GitHub Actions do **mesmo SHA**.
2. Após mudança autorizada nos campos de SEO de produção, executar o fluxo de **novo build/deploy** e verificar HTML, Open Graph, robots, canonical e sitemap no domínio; não declarar atualização instantânea por salvar no CMS.
3. P3 Lighthouse deve passar em browser/responsividade, SEO e meta **LCP mobile ≤3,5 s**, mediana de três execuções equivalentes. Capturas antigas pertencem aos SHAs antigos.
4. Uma comparação física humana em celular real complementa, mas não substitui testes de persistência com JWT sintético.
5. Registrar evidências finais em `docs/ESTADO_ATUAL_VIGENTE.md` e atualizar `docs/OPEN_ISSUES.md` apenas quando um gate passar no SHA final.

## 6. Quem faz o quê

| Operação | Automação/conector | Usuário |
|---|---|---|
| Investigar e produzir patch de código, testes, migration **não aplicada** e docs | GitHub e sandbox de CI | Revisar escopo e diff |
| Validar código, SQL sintético, browser público, Lighthouse | GitHub Actions, Vercel, Supabase local Docker | Pode acompanhar sem VS Code |
| Acionar workflow_dispatch quando indisponível no conector | Interface GitHub Actions | Clicar `Run workflow` na `main` |
| Testar no Windows se desejado | `pnpm check`, Docker Desktop e Supabase CLI | Preservar alterações locais e seguir `AGENTS.md` |
| Aplicar migration na produção | Supabase, **após aprovação específica** | Autorizar e aprovar plano de rollback |
| Conferir visual e fluxo editorial real | Capturas automáticas + aceite humano | Aceitar visualmente após revisão |
| Substituir fontes anexadas ao Projeto ChatGPT | Preparação de arquivos | Fazer substituição manual na interface do Projeto |

## 7. Portões finais (marcar apenas após execução)

- [ ] Teste transacional sintético executado no SHA final e link do run registrado.
- [ ] Nova RPC composta implementada, integrada e testada com rollback e concorrência, **ou** risco residual formalmente aceito.
- [ ] Contratos de mídia alt/crédito/enquadramento/Storage com casos positivos e negativos automatizados.
- [ ] E2E autenticado **com escrita sintética** nos formulários relevantes, com releitura e verificação do renderer.
- [ ] SEO estático confirmado após build/deploy correto, sem alegar atualização instantânea.
- [ ] CI, P3 Lighthouse e produção no mesmo SHA; aceite visual de alterações quando apropriado.
- [ ] Documentação operacional atualizada com resultados reais, evidências e riscos aceitos.

**Até todos os gates aplicáveis serem cumpridos: P2 = parcial; P4 = parcialmente homologada.**
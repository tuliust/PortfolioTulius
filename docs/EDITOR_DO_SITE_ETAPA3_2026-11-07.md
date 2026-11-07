# Etapa 3 — Editor do Site com campos intuitivos e correspondência pública

**Data de implementação:** 07/11/2026. **Escopo autorizado:** Etapa 3 do [plano](PLANO_PADRONIZACAO_CMS_2026-11-07.md). **Etapa 4 (Acervo Estruturado) e Etapa 5 (homologação final) não iniciadas.**

## Alterações no Editor do Site

- **Título** da seção Perfil é a fonte única para o nome monumental desktop, versão mobile legada, nome da área inferior do Editorial 360°, marca textual do header e descrição acessível. O título editorial "CONEXÕES / AUTÊNTICAS. / INOVAÇÃO." é independente, preservado. Um helper `splitProfileTitle` separa a primeira palavra do restante, com caixa-alta e fallback. O CMS continua persistindo `sections.title`.
- **Tema** e **Layout** deixaram de aparecer como campos editáveis. Seus valores continuam no Supabase e na renderização; o salvamento de Informações da seção não os sobrescreve.
- **Transições** mostra exclusivamente `none`, `fade-in`, `fade-up`, `stagger`, `image-reveal`, `metric-count` — mesmos valores aceitos por `sections_animation_preset_check`; nenhuma migração de constraint é necessária. Efeitos antigos que continuam apenas no CSS não foram adicionados ao seletor.
- **Exibir no site** foi retirado. **Arquivar** coloca `status=archived` e `is_visible=false`; para seções ocultas/arquivadas a ação aparece como **Exibir**, diferenciada visualmente, e restaura `status=published` + `is_visible=true`. O diálogo deixa explícito quando a ação publica uma seção. Preservam-se IDs, âncoras, ordem, conteúdo e blocos. O header e o skip link apontam ao primeiro elemento existente quando o Perfil não estiver publicado.
- A área **Conteúdo e painéis** passou a chamar-se **Conteúdo**. Os toggles internos identificam os blocos pela posição **Esquerda** e **Direita**; quando empilhados no mobile, indicam primeiro/segundo painel. Os IDs A/B, `mobile_panel` e placements não foram renomeados.

## Seletores da biblioteca Identidade

O componente administrativo `EditorIdentityFields` lê uma vez por edição `design_tokens` e oferece fallback nos defaults seguros da Etapa 2:

- Cores são selecionadas **pelo nome com amostra**, sem `type=color` nos controles do Editor do Site.
- Fontes da abertura Editorial 360° são selecionadas **pelo nome cadastrado**, em vez de texto livre.
- Tamanhos tipográficos são escolhidos em **lista numérica de px**, incluindo limites particulares do CSS. A opção **Padrão (responsivo)** mantém o valor ausente, respeitando a regra CSS de cada componente.
- Controles de espaço, posição, crop, dimensões e movimento continuam numéricos: **não são tamanhos de fonte**.
- Valores legados são preservados ao carregar; se um valor ainda não pertencer ao catálogo, surge **Valor existente (preservado)** e nenhum ajuste automático é gravado.

### Como funciona o vínculo com Identidade

Ao selecionar uma cor pelo nome, o Editor do Site grava uma referência CSS como `var(--orange)` ou `var(--ink)`. Ela passa a acompanhar a cor global quando Identidade for alterada, respeitando as variáveis já usadas pelo site. A cor branca usa a variável `--white` com valor inicial `#FFFFFF`.

As fontes selecionadas na abertura mobile são registradas como chaves `font.heading`, `font.body` ou `font.serif` no JSONB existente. O renderer as converte para `var(--font-heading)`, `var(--font-body)` e `var(--font-serif)`, mantendo o fallback original quando há valor legado. Georgia segue como família serifada autorizada. Nenhum registro anterior é substituído automaticamente.

**Tamanhos numéricos são overrides locais**, não atualização automática em cascata de todos os títulos. Os sete estilos em `typography.*` fornecem nomes e referências para seleção, enquanto as regras `clamp()` existentes permanecem no CSS. Isso evita que 159 valores distintos sejam padronizados forçadamente.

## Persistência e segurança

- `SectionsEditor` só altera os campos textuais e a transição em seu fluxo normal de salvamento; mudanças de publicação exigem uma ação separada e confirmação.
- `ContentStudio` continua usando `save_content_block_atomic` para persistir o JSONB do conteúdo e dos placements, sem tabelas ou migrations adicionais nesta etapa.
- Campos editoriais antigos são preservados até nova seleção. Ao selecionar cor/fonte, as referências passam a ser armazenadas no JSONB com a mesma estrutura anterior; não foram introduzidas novas colunas.
- Ações de salvamento e publicação exigem retorno de linha de banco; nenhuma gravação é assumida concluída com base apenas em evento local.
- A restauração de uma seção arquivada usa publicação explícita. Se houver edição pendente, o usuário precisa decidir salvar ou descartar antes de publicar/arquivar.

## Verificação / critérios

- Verificar `pnpm format:check`, TypeScript, Vitest e build no SHA final.
- Conferir no Supabase que as seções preservam valores de `theme` e `layout_variant` quando forem editadas.
- Testar manualmente em sessão administrativa: Título, Transições, Arquivar/Exibir e os seletores de cor/fonte/tamanho, com releitura após salvar.
- Revisar screenshots desktop/mobile usando o baseline anterior. **Não confundir CI aprovado com homologação visual.**
- Não alterar o Acervo Estruturado, fluxos de mídia ou seções não relacionadas nesta etapa.

## Evidência de publicação e ajuste editorial pontual

- **Código funcional validado:** `41827c399503edeab9ecfb5746a143743ec292ee`. GitHub Actions [Validate PortfolioTulius — sucesso](https://github.com/tuliustsangaropulos/PortfolioTulius/actions/runs/42339484271) com formatação, TypeScript, 193 testes e build.
- **Produção:** deployment Vercel `dpl_BjxrNqyqavJKrAFooseb7tyNqJuV` com estado `READY` e aliases `tulius.work` / `www.tulius.work`, conferidos em 07/11/2026.
- **Correção de conteúdo autorizada pelo escopo Título:** no Supabase de produção, `sections.slug='perfil'` foi alterado sob guarda `title='Tulius Tsangaropuloss'`, passando para `title='Tulius Tsangaropulos'`, com `UPDATE ... RETURNING` confirmando somente a linha do Perfil. Os valores `status='published'`, `is_visible=true`, `theme='paper'`, `layout_variant='hero'`, `animation_preset='fade-up'` permaneceram iguais. Consulte o SQL idempotente em [docs/sql](sql/2026-11-07-perfil-titulo-etapa3.sql).
- **Auditoria visual:** o workflow P3 executado em commits intermediários não substitui teste visual do SHA final com sessão autenticada. A Etapa 5 permanece pendente.
- **Banco, leitura final:** 21 tokens de design, 28 blocos publicados e 56 placements; nenhuma outra correção editorial foi executada no Supabase.

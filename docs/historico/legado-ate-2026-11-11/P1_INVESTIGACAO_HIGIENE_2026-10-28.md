# PortfolioTulius — P1: investigação de higiene técnica e proveniência

**Conferência:** 28/10/2026 (horário Brasil). **Natureza:** leitura e análise de código, GitHub e Supabase, seguida apenas de documentação. **Nenhuma exclusão, migração, alteração em CMS/Storage, mudança de Auth/RLS, deploy manual ou reorganização de branches foi autorizada/executada.**

**Base de código:** `main`, SHA [`d8d0e4eb2bd11af16afd6eb2af5cd06168a00a22`](https://github.com/tuliustsangaropulos/PortfolioTulius/commit/d8d0e4eb2bd11af16afd6eb2af5cd06168a00a22), anterior ao commit deste relatório; Supabase `portfolio` (`zfnrhzplwpjpdljraypt`). Novo commit documental exige conferência específica de CI e Vercel.

## 1. Veredicto e classificação

| Item | Resultado da inspeção | Encaminhamento |
|---|---|---|
| 2 PNGs privados sem `media_assets` | Mesmos caminhos, tamanhos e valores de `eTag` dos PNGs correspondentes no bucket público; inspeção de código explica a retenção da origem privada após promoção. | **Preservar** até aprovação de uma política de retenção/limpeza e testes P2. Não são candidatos a exclusão automática. |
| `portfolio-illustrative-import-20261026` | Função implantada `ACTIVE` (v2), `verify_jwt=true`; seu código atual sempre devolve HTTP **410** e não executa importação. | Manter por enquanto. A exclusão é possível somente após confirmação de dependências, janela de logs e autorização. |
| 19 SVGs de galeria | Todos publicados e catalogados, mas os objetos do Storage **não são byte a byte idênticos** aos 19 SVGs de nomes correspondentes em `public/media/editorial-*.svg` no GitHub: **19/19 tamanhos divergentes**. | Preservar **ambas** as coleções. Resolver a proveniência e versão editorial escolhida, sem publicar/substituir arquivos por inferência. |
| 2 PNGs públicos | Usados como logotipos nos blocos `inpress/A` e `vale/A`, com `alt` preenchido e `credit=NULL`. | Solicitar comprovação de origem, direito de uso e aprovação visual; não assumir que são logotipos oficiais licenciados. |
| Branch `fix/header-hero-section-navigation-20261025` | Quatro commits exclusivos examinados, 205 commits atrás da `main` nesta conferência. Funcionalidades centrais identificadas no código atual. | Preservar como referência até decisão expressa de arquivamento/exclusão; **não fazer cherry-pick automático**. |
| Branch `fix/p3-motion-units-20261024` | 0 commits exclusivos e 261 commits atrás da `main`. | Candidata tecnicamente a arquivamento, mas manter até aprovação. |

## 2. Dois objetos privados: identidade e explicação do ciclo

Foram examinadas as linhas de `storage.objects`, `media_assets` e a rotina ativa de publicação `promote()` em `src/components/admin/AdminModules.tsx`.

| Par observado (mesmo path nos dois buckets) | Origem privada (UTC) | Cópia pública (UTC) | Tamanho / `eTag` | Uso da versão pública |
|---|---|---|---|---|
| `fbfb9c32-…-1.png` | 26/10 09:06:11 | 26/10 09:07:15 | 4.961 bytes; `fe0444557bf72d7e6fe8f3ef41d55070` nos dois | Logo da seção **InPress** |
| `a1bf9f8f-…-2.png` | 26/10 10:04:03 | 26/10 10:04:18 | 23.779 bytes; `ba6a5173addcf8880d068bfd6c930685` nos dois | Logo da seção **Vale** |

**Causalidade de código verificada:** `promote()` faz `download` do arquivo privado, `upload` no bucket público e `UPDATE media_assets SET storage_bucket='portfolio-public', status='published'`. Quando a atualização funciona, **não há etapa para excluir o objeto privado original**. A limpeza compensatória do código remove a cópia **pública** somente se a atualização do metadado falhar. Assim, a presença de cópias privadas sem `media_assets` é coerente com a implementação, não prova corrupção ou falha de upload.

**Limite:** tamanhos e `eTag` coincidentes fornecem forte indício de mesmos bytes; não foi feito download autenticado ou cálculo independente de hash criptográfico do par. A existência de origem privada pode ter valor para recuperação, embora a política de retenção ainda não esteja definida. Não apagar objetos privados, não alterar ponteiros públicos nem executar limpeza SQL diretamente.

**Condição para limpeza futura:** homologar upload/promoção/reversão pelo CMS com JWT real (P2), definir retenção de originais e backup dos bytes, comprovar integridade de cada cópia e obter aprovação específica do proprietário.

## 3. Mídias públicas: proveniência e discrepância de versões

A consulta ao banco e aos objetos confirmou **21 assets publicados** com arquivo correspondente: **19 SVGs** e **2 PNGs**. Todos têm `alt_text`; **23 objetos** físicos (21 públicos e 2 privados). As galerias das seis experiências apontam para o Storage; os PNGs estão no campo `content_json.experienceMedia.logo` de InPress e Vale. Os outros quatro logos de experiências continuam sem URL registrada nesta inspeção.

**Distinção crítica:** existem duas séries com 19 SVGs identificáveis por empresa/índice:

- **GitHub:** `public/media/editorial-*.svg`, com descrições internas de **síntese editorial baseada no currículo e materiais enviados**, e aviso de que não é fotografia ou captura original. Exemplo `editorial-invest-rs-01.svg`: **3.327 bytes**.
- **Supabase Storage público:** `portfolio-illustrative/2026-10-26/*.svg`, com metadados de `media_assets` como **“Ilustração fictícia”**, crédito de **“arte vetorial de demonstração”** e `alt_text` genérico de ilustração conceitual não documental. Exemplo `invest-rs-01.svg`: **3.091 bytes**.

As **19 correspondências por nome têm tamanhos diferentes**; consequentemente, não são cópias byte a byte. Os bytes dos SVGs do Storage não foram inspecionados diretamente pelo conector nesta análise; a diferença visual/textual concreta entre as duas versões deve ser validada antes de concluir se são equivalentes semanticamente. **Não declarar as imagens publicadas idênticas às versões do Git** nem substituir uma coleção pela outra sem decisão editorial.

Ambas as séries se apresentam como material **ilustrativo**, não como fotografia de projetos, evidência documental independente ou logotipo oficial. O relatório [`CONTINUIDADE_INCORPORACAO_CONTEUDO_2026-10-26.md`](CONTINUIDADE_INCORPORACAO_CONTEUDO_2026-10-26.md) descreve a origem textual em CV/infográficos, mas não contém licença/autorização que permita certificar todos os direitos. Confirmar a versão intencional, a adequação dos textos alternativos e os créditos, sem inventar autoria. Os dois PNGs públicos têm títulos `inpress` e `vale`, `alt_text` **Grupo InPress** e **Vale**, e crédito não preenchido: uso real no site não equivale a licença comprovada.

## 4. Função de importação encerrada: código, logs e dependências

- Identidade: `portfolio-illustrative-import-20261026`, v2, status Supabase **ACTIVE**, opção `verify_jwt=true`.
- Código implantado atual (v2): `Deno.serve(() => new Response("Import completed. Endpoint disabled.", { status: 410, headers: { "Cache-Control": "no-store" } }))`. **Não contém ação de escrita nem importação.**
- Janela de logs **26/10/2026 UTC**: registro de uma chamada `GET` à versão **1**, resposta HTTP **200** às 09:31:21Z, relacionado à fase de importação. Não é chamada à versão 2.
- Janela **27/10/2026 UTC**: nenhum evento `function_edge_logs` para esse ID retornado pela consulta. Isto **não prova ausência absoluta de uso fora da janela ou nas fontes de logs não consultadas**.
- Busca textual pelo nome da função no índice de código da `main` não retornou referência; não é auditoria exaustiva de todas as integrações externas.

**Parecer:** a função está **desativada logicamente, mas ainda implantada**. Não há evidência de necessidade funcional corrente nos componentes examinados, porém a remoção de deployment é uma operação de infraestrutura distinta de inativação HTTP 410. Sem autorizações de limpeza, **manter**. Antes de eventual remoção: inspecionar dependências externas/agendamentos, retenção de logs, modo de recuperação e obter autorização explícita.

## 5. Revisão dos quatro commits exclusivos da branch de navegação

Base comum `9e7bb341b182d77c4f24bef961e3506585a6a086`; branch 4 à frente / 205 atrás da `main` no SHA-base do relatório. Os commits exclusivos, em ordem:

1. [`62230b6`](https://github.com/tuliustsangaropulos/PortfolioTulius/commit/62230b6a4e5ec6f01ba5cd6bc0d7d3e34e506b14) — contraste/tema do header sem blend mode, retirada dos contadores no cabeçalho.
2. [`d12baba`](https://github.com/tuliustsangaropulos/PortfolioTulius/commit/d12babad9a0049a35db95be98407927fc39dc201) — botão de descida do perfil e remoção adicional dos contadores de seções/painéis.
3. [`a60f106`](https://github.com/tuliustsangaropulos/PortfolioTulius/commit/a60f10649c968f9cdc21add4b41e73c1f090d07b) — refinamentos CSS de contraste, coluna esquerda do hero, tamanhos e CTA inferior.
4. [`c5d17f4`](https://github.com/tuliustsangaropulos/PortfolioTulius/commit/c5d17f4ee9041ae59f03691585a1ea60b1c06d9f) — refactor de legibilidade da seleção do tema no menu.

A `main` atual contém `activeSection`, tema `header-${theme}`, estilos de contraste por tema, CTA `profile-next-section` e não contém o contador antigo no header. Os aspectos fundamentais da branch estão assim **representados em código atual**; sua apresentação foi evoluída posteriormente. **Não foi feita comparação visual ou linha a linha de toda a árvore histórica para certificar equivalência perfeita de CSS**, mas não foi identificado um recurso independente que justifique cherry-pick. Integrar estes commits antigos em bloco é arriscado e pode regredir o código novo.

A branch `fix/p3-motion-units-20261024` está inteiramente atrás da `main`, sem commits exclusivos (**0 à frente / 261 atrás**). Ambas permanecem no remoto, sem rebase, reset, merge ou exclusão. Para eventual limpeza, apresentar proposta explícita ao proprietário e guardar links aos SHAs.

## 6. Recomendações e critérios de saída

**Encerrado nesta P1:** inventário dos dois objetos; explicação causal pelo código de promoção; rastreabilidade dos PNGs ao site; comparação de tamanhos dos 19 pares SVG; inspeção do código ativo da função e janela de logs; leitura dos quatro commits exclusivos e da segunda branch. Resultado **somente leitura**, sem mudança funcional.

**Aprovação/insumos ainda necessários antes de limpeza material:**

1. Retenção dos dois originais privados: decidir política e validar recuperação/upload/rollback em P2 antes de apagar qualquer objeto.
2. Coleções SVG divergentes: comparar conteúdo visual entre Git e Storage, escolher versão aprovada, documentar autoria e contexto, revisar `alt` genérico e proibir apresentação como fotografia original.
3. PNGs InPress/Vale: conferir autoria, licenciamento e permissão de exibir marcas; preencher créditos somente com informação validada pelo proprietário.
4. Função encerrada: confirmar não utilização externa, logs suficientes, plano de reversão e autorização para eventual undeploy.
5. Branches históricas: solicitar autorização para arquivar/excluir após decisão; não mesclar os quatro commits por padrão.

**Preservados:** as 8 pendências editoriais abertas, 21 mídias catalogadas, 23 objetos Storage, seções e blocos, tabelas, RLS, migrations, dados publicados, autenticação, históricos, duas branches e a Edge Function. **P2 com JWT real continua independente e pendente.**

## Evidências operacionais

- [Código de promoção e biblioteca do CMS](../src/components/admin/AdminModules.tsx) — `promote()` copia bytes privados para público, atualiza `media_assets` e deixa origem privada.
- [Utilitário de compensação](../src/lib/media-operations.ts) — `stagePrivateMediaChange` protege uploads privados em substituições, mas não é remoção pós-promoção.
- [SVG editorial do Git](../public/media/editorial-invest-rs-01.svg) e [registro de incorporação](CONTINUIDADE_INCORPORACAO_CONTEUDO_2026-10-26.md).
- [Projeto Supabase](https://supabase.com/dashboard/project/zfnrhzplwpjpdljraypt) — consultas somente leitura em `storage.objects`, `public.media_assets`, `content_blocks` e logs da função.
- [Comparação de branches](https://github.com/tuliustsangaropulos/PortfolioTulius/compare/9e7bb341b182d77c4f24bef961e3506585a6a086...c5d17f4ee9041ae59f03691585a1ea60b1c06d9f) — quatro commits próprios da branch histórica.

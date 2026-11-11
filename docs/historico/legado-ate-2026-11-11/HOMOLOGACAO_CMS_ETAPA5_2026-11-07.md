# Homologação da padronização do CMS — Etapa 5

**Data:** 07/11/2026. **Solicitação:** executar a Etapa 5 do [plano completo](PLANO_PADRONIZACAO_CMS_2026-11-07.md). **Situação:** **execução realizada; aprovação integral ainda pendente**. Este relatório distingue testes concluídos, testes apenas de leitura, ensaio transacional isolado, auditoria pública e comparações visuais inconclusivas.

## 1. Escopo e segurança

- Produto: PortfolioTulius, produção `https://tulius.work`.
- Ponto anterior ao plano: commit [`207327b`](https://github.com/tuliustsangaropulos/PortfolioTulius/commit/207327b1ebe974e768a81f752fe1184249d210ba).
- Ponto funcional após Etapa 4: [`d40be70`](https://github.com/tuliustsangaropulos/PortfolioTulius/commit/d40be704e06c5a8934102004375c2527b0cf6591).
- Primeira rodada de QA público: [`5f510b6`](https://github.com/tuliustsangaropulos/PortfolioTulius/commit/5f510b64f319abca9b1e0901365f458478f0e9b2).
- Rodada administrativa autenticada aprovada: [`9b738a5`](https://github.com/tuliustsangaropulos/PortfolioTulius/commit/9b738a5945ab79487d79e3418e47da6c6babedbf).
- As mudanças deste ciclo de homologação estão restritas a roteiros de teste, workflows CI e documentação. **Não alterar schema nem conteúdo do Supabase de produção para testar**; toda escrita de teste foi executada contra Supabase **local sintético** em `127.0.0.1`.
- O arquivo `src/index.css` conserva exatamente o blob Git `b3a05b9e1f93bcbb9c4a3a9b10d57235a8656242`, igual à Etapa 1. As diferenças em `PublicSite.tsx` e `Navigation.tsx` das Etapas anteriores correspondem ao vínculo do nome público ao campo Título e a variáveis herdadas; exigem auditoria de renderização, não equivalência presumida.
- O workflow de testes autenticados está protegido por uma checagem do SHA efetivamente servido na produção; sem coincidência do SHA, não atribui resultados à versão testada.

## 2. Código, testes e publicação

- `Validate PortfolioTulius`: formatação, TypeScript, testes unitários, build de produção, smoke offline e sintaxe de scripts. Sucesso em [run 42342209035](https://github.com/tuliustsangaropulos/PortfolioTulius/actions/runs/42342209035), SHA `9b738a5`.
- Deploy da versão validada `9b738a5`: Vercel `dpl_D5MiukCxy9pyqyGEUQnAwB4Vqmj9` em estado `READY`. A publicação das alterações de QA posteriores segue o Git integrado à Vercel; cada novo SHA deve ser confirmado antes de homologá-lo.
- O teste automatizado nunca precisou alterar registros publicados.
- Não foi tentada gravação de produção com credenciais administrativas, para evitar mudanças visíveis ou resquícios de teste.

## 3. CMS autenticado — 11/11 aprovação, sem escrita

A suíte [P5 Admin Read-Only E2E, run 42342208800](https://github.com/tuliustsangaropulos/PortfolioTulius/actions/runs/42342208800) foi executada com sessão administrativa **real**, segredos injetados pelo GitHub Actions sem expô-los, em SHA `9b738a5`, com `P5_DEPLOYMENT_GATE MATCH` e **11/11 verificações aprovadas; `cmsWrites=0`**.

| Área | Evidência |
|---|---|
| Acesso | Login real e navegação pelos 9 módulos |
| Identidade | Leitura de 7 cores, 3 fontes e 7 estilos; nomes e tamanhos em seletores |
| Rascunho de Identidade | Guardião de alterações pendentes; cancelamento; descarte seguido de releitura intacta |
| Acervo Estruturado | Somente 1 fonte vinculada (**Depoimentos**), 5 registros, 3 registros utilizados nas janelas atuais |
| Rascunho do Acervo | Descarte sem persistir e recuperação do valor original |
| Editor do Site | Título do Perfil, 6 presets de transição, Esquerda/Direita, campos redundantes ausentes |
| Publicação | Botão Arquivar abre confirmação, que foi cancelada sem gravação |
| Transições | Alteração local descartada com valor original recuperado |
| Responsividade admin | 390 × 844 px sem overflow |
| Sessão | Logout e bloqueio da prévia após sair |

**Limite:** este teste prova leitura, UX, controles, estado local e ausência de mutação; ele não prova um `UPDATE` real. Essa parte é testada isoladamente abaixo.

## 4. Operações transacionais em Supabase **local**, com dados fictícios

O ambiente é iniciado via GitHub Actions com Supabase CLI, Docker do runner, `supabase/config.toml` e exclusivamente `supabase/seed.local.synthetic.sql`. Testes em loopback não usam credenciais, mídias ou textos reais do site.

O roteiro `scripts/p5-local-transactional.mjs` testa oito operações de integração **reais** com PostgREST/Auth/RPC em banco sintético, e restaura registros:

1. O leitor anônimo não enxerga a página fictícia em rascunho.
2. Criação de uma identidade fictícia com papel administrativo autorizado (`owner`) e login.
3. Gravação de título e transição de uma seção, com releitura autenticada.
4. Arquivar e depois Exibir a seção, conferindo `status` e `is_visible`.
5. Atualizar nome e tamanho mobile de um token tipográfico e reler.
6. Editar JSONB do bloco via RPC `save_content_block_atomic` e reler.
7. Rejeitar a mesma escrita RPC de usuário não administrador.
8. Reverter seção, token e bloco aos valores anteriores e confirmar a restauração.

**Evidência:** [workflow P5 Local Transactional Homologation, run 42343202187](https://github.com/tuliustsangaropulos/PortfolioTulius/actions/runs/42343202187). A primeira rodada de CLI antiga não conseguiu aplicar migration histórica com múltiplos comandos; a CLI v3 executou o schema. Na primeira execução funcional, os 8 testes passaram, mas o agregador incorretamente esperava 7; essa contagem foi corrigida. **A conclusão formal deve ser obtida da rodada 42343202187.** Este ensaio não equivale a testar gravações em produção (que não foram realizadas por segurança).

## 5. Layout público, responsividade e performance

- [P3 run 42341645173](https://github.com/tuliustsangaropulos/PortfolioTulius/actions/runs/42341645173), SHA `5f510b6`: **LCP mobile mediana 3.296,597 ms (PASS)** e desktop 976,052 ms (PASS), em três medições cada. Acessibilidade, melhores práticas e SEO marcavam 100 nas capturas Lighthouse, porém a suíte P3 como conjunto falhou por **quatro verificações de browser**.
- [P3 run 42342208813](https://github.com/tuliustsangaropulos/PortfolioTulius/actions/runs/42342208813), SHA `9b738a5`: **LCP mobile mediana 3.515,095 ms (FAIL)**, 15,095 ms acima da meta de ≤3.500 ms; desktop 877,467 ms (PASS). A11y e SEO permaneceram em 100. Logo, desempenho mobile está **instável próximo ao limite**, não homologado.
- Nas duas rodadas, o **Perfil Editorial 360° mobile** passou nas larguras **320, 360, 375, 390, 414 e 430 px**: título editorial e selo presentes, foto carregada, sem conflito de áreas e seta acessível.
- **Quatro falhas de browser P3 fora da primeira dobra** continuam: (a) área de leitura/sticky nas Experiências mobile, (b) encaixe Sobre/Invest na área de retrato, (c) alternância Projetos/Trajetória das Experiências e (d) sincronização da galeria de projetos. Há registros dessas mesmas classes de falha desde a auditoria anterior às alterações do CMS.
- Não foi declarado aceite total de P3. Nem foi relaxada a meta de LCP.

## 6. Comparação de capturas ANTES/DEPOIS

Referência ANTES: [P3/P4 do SHA `207327b`](baselines/2026-11-07/REFERENCIAS_VISUAIS.md), 17 + 38 PNG. Referência DEPOIS: [P3 run 42341645173](https://github.com/tuliustsangaropulos/PortfolioTulius/actions/runs/42341645173), mesmos 55 nomes de captura, dimensões idênticas e SHA funcional `5f510b6`.

Comparação matemática: **33 de 55 capturas idênticas pixel a pixel**; **41 de 55** com **menos de 1%** de pixels cuja diferença RGB exceda 16; **12** com diferença acima de 5% nessa medida. `p4-desktop-01-perfil-desktop.png` e `p4-mobile-01-perfil-a.png` são idênticas pixel a pixel. Capturas com diferença elevada incluem `p3-390x844.png` e `p4-mobile-01-perfil-b.png`.

**Interpretação:** não é correto considerar as 55 homologadas. As imagens mostram estados não necessariamente equivalentes de scroll, sticky header ou instante de animação e alguns deslocamentos no layout; a comparação sozinha não prova que houve alteração deliberada de estilo nem que a visualização é igual. São necessárias capturas determinísticas (mesmo viewport/scroll, estado do header, fontes carregadas e relógio de animação congelado) e revisão humana para fechar essas 12 divergências.

Os ZIPs P3/P4 originais e novos foram preservados na entrega do chat, juntamente com o JSON das métricas e montagens selecionadas. A documentação GitHub registra apenas links e hashes; as capturas não são incorporadas ao repositório público.

## 7. Integridade da produção

Uma consulta `SELECT` antes e depois da homologação autenticada confirmou igualdade exata dos hashes canônicos das tabelas de uso do CMS:

| Relação | Contagem | Hash de comparação MD5 (antes = depois) |
|---|---:|---|
| `sections` | 14 | `8000e013797dd0e30f513ac6a171936f` |
| `content_blocks` | 28 | `7c1a109f7aa15c45052f557ec2a2baca` |
| `design_tokens` | 21 | `d45588cee5e127063ce13b9f8f4110c4` |
| `testimonials` | 5 | `80bdcffd9beffd371f673d86c276f798` |
| `block_placements` | 56 | `bad88f60226de399c1c842cd58f664e9` |

A comparação é um checksum de linhas com ordenação estável, não backup integral. Ela demonstra que **não houve alteração de conteúdo dessas tabelas durante os ensaios**.

## 8. Pendências antes de declarar homologação integral

- [ ] Resolver ou reclassificar com evidência as quatro falhas P3 (sticky, encaixe Sobre/Invest, switch Projetos/Trajetória, galeria) sem alterar desnecessariamente a composição aprovada.
- [ ] Repetir três Lighthouse mobile no mesmo SHA e demonstrar mediana **≤3.500 ms** com margem operacional, sem relaxar o limite.
- [ ] Capturar os 12 casos visuais discordantes com determinismo de estado e conferir com o proprietário antes de aprovar equivalência.
- [ ] Homologar zoom/aumento de texto e `prefers-reduced-motion` em sessão de navegador com evidência específica; a presença das regras CSS não é teste de execução.
- [ ] Verificar em ambiente isolado que o salvamento pelo **formulário React** (além dos RPCs/REST diretos) alcança e relê os valores. A suíte autenticada de produção validou os controles sem gravar; a suíte local validou os contratos de persistência sem interação pelo browser.
- [ ] Conferir novamente CI, Vercel e integridade do banco após os ajustes futuros.

**Status:** Etapa 5 executada com sucesso no núcleo do CMS e operação sintética isolada, **homologação final pendente** nos pontos acima. Não há base para declarar P3 ou equivalência visual completa aprovados.

# Estado atual — adendo mais recente

## Atualização operacional comprovada — 09/11/2026 (SHA funcional `b2c732213ba34789b7e04761dfff84fb91fcbc7f`)

> Adendo de continuidade, sem modificação do código público ou de dados produtivos. O SHA deste registro documental será posterior ao SHA funcional citado; **não atribuir a ele sucesso automático** de workflows anteriores. Consultar as execuções do commit documental antes de homologar a convergência.

- **Etapa 2 / CMS: PARCIAL, com cobertura sintética ampliada comprovada.** [P5 #42682410740, tentativa 2](https://github.com/tuliustsangaropulos/PortfolioTulius/actions/runs/42682410740) terminou `success`, incluindo 57/57 cenários de navegador autenticado. Hero A/B, reordenação e globals, navegação, Trajetória, depoimentos, sete coleções normalizadas, placements desktop e mobile A, tipografia independente, Identidade e revisões foram exercitados com dados fictícios, gravação/releitura no PostgREST local quando assertada, renderer desktop/mobile nos casos especificados e conflitos CAS. **Não equivale** a CRUD completo (criar, editar, despublicar, reabrir, concorrer) individualmente em todas as nove coleções, nem a matriz exaustiva de cores, estilos nomeados, alinhamentos e painel mobile B. Esses gates permanecem parciais.
- **Etapa 3 / Biblioteca: PARCIAL, ampla cobertura positiva e negativa demonstrada.** O mesmo P5 confirma upload/publicação, alt/título/crédito/ponto focal, persistência ao reabrir, CAS, renomeação privada com promoção, exclusão sem órfãos e injeções HTTP `503` em PATCH SQL/PostgREST e POST Storage com preservação sintética de rascunho/ausência de objetos órfãos. Restam conferir via navegador a precedência de enquadramento global e por uso em Hero, Sobre e galerias, referências de conteúdo em casos de exclusão e os estados de resposta incerta; **`credit` é metadado de catálogo, sem legenda pública automática comprovada**.
- **P5 agregado: 89/89 PASS** = 8 cenários originais + 11 P2/RPC/CAS/rollback + 57 navegador + 8 Storage/API + 5 SEO, todos com endereço `127.0.0.1:54321` e `cloudConnections: 0` nos grupos que reportam esse campo. Erros de instrumentação e uma falha Docker na primeira tentativa foram históricos; o resultado final da tentativa 2 é `success`, não um sucesso retroativo das tentativas falhas.
- **Validate #42682411152: SUCCESS** no mesmo SHA funcional: formatação, TypeScript, **258/258 testes Vitest (56 arquivos)**, build, smoke e sintaxe dos testes de navegador.
- **P3 Lighthouse: BLOQUEIO ainda aberto.** A execução mais recente localizada antes desta atualização, [#42677818677](https://github.com/tuliustsangaropulos/PortfolioTulius/actions/runs/42677818677), era de **outro SHA** (`06105c35013c7bd8b483c4d14ac0390ef7d9a16d`) e falhou com LCP mobile mediano **3.648,364 ms > 3.500 ms**, apesar de navegador sem falhas, SEO em paridade e Lighthouse acessibilidade/boas práticas/SEO 100. **Não há P3 aprovado atribuível ao SHA `b2c7322` nesta conferência**. Não afrouxar o orçamento.
- **Vercel:** consulta autenticada identificou deploy de produção `dpl_BGTbvqwWkckcczUuePdZ3euVm6et` em estado `READY`, commit `b2c7322`, com alias `tulius.work`. A leitura HTTP do JSON de fingerprint do domínio não foi concluída nesta auditoria; não equivaler o metadata do Vercel à leitura da resposta HTTP.
- **Supabase de produção: somente leitura, zero alterações realizadas nesta execução.** SELECT confirmou 14 seções, 28 blocos, 56 placements, 75 mídias; consulta a `pg_proc` retornou **zero** funções `public.save_section_block_atomic`; listagem de migrations: nove versões, sem `20261109024100`. Não houve inserts, updates, deletes, alterações em Storage ou migrations remotas.
- **Etapa 5: PARCIAL/BLOQUEADA.** Validate e P5 do SHA funcional passaram, mas P3 do mesmo SHA e aceite visual final faltam. O commit documental que incorpora este adendo deve acionar Validate, P5 e P3 por path filter; os resultados **ainda precisam ser observados**. Não declarar convergência até validar os IDs e SHA efetivos.
- **Etapa 6: DEPENDENTE DE AUTORIZAÇÃO ESPECÍFICA, NÃO EXECUTADA.** Arquivo: `supabase/migrations/20261109024100_p2_composite_section_block_save.sql`; adiciona `block_placements.updated_at` e seu trigger, além da RPC `public.save_section_block_atomic` (gravação composta com CAS/rollback e verificação de administrador). Nenhuma migration pode ser aplicada sem autorização separada, snapshot/backup e plano de recuperação. A implantação não reescreve conteúdo editorial como efeito normal, mas muda o contrato de persistência e deve ser monitorada.

Consulte os detalhes do [relatório P2/P4](P2_P4_RELATORIO_EXECUCAO_2026-11-09.md) e [pendências vigentes](OPEN_ISSUES.md).

---

## Documentação anterior preservada

# Estado operacional — atualização das etapas 1 a 5

> **Adendo auditável — 09/11/2026.** Informação mais recente que os snapshots abaixo. Fonte: [execução conectada das etapas 1–5](EXECUCAO_ETAPAS_1_A_5_2026-11-09.md), commit funcional `f9e48dcb`, CI e SELECT de produção. Preserve os documentos originais logo abaixo como histórico, sem atribuir a eles o estado atual.

- **P2:** RPC composta implementada/testada com 11 cenários sintéticos; não instalada em produção (nove migrations remotas sem a nova). Caminho legado continua, sem atomicidade conjunta em produção.
- **P3:** baseline LCP mobile mediana 3.876,691 ms **FAIL**. Carregamento assíncrono da folha de fontes preserva pesos e famílias finais, mas o novo resultado de Lighthouse **não estava verificado** no momento deste adendo. Exigir CI P3 do SHA final e verificação do domínio.
- **P4:** E2E navegador **20/20 PASS** e suíte local total **52/52 PASS** em [P5 #42566409424](https://github.com/tuliustsangaropulos/PortfolioTulius/actions/runs/42566409424). Inclui UI de mídia, navegação, conflito de seção e subset Hero A/B; não cobre toda a matriz do CMS.
- **Validate:** [#42566409385](https://github.com/tuliustsangaropulos/PortfolioTulius/actions/runs/42566409385) SUCCESS no commit funcional `f9e48dcb`. Este adendo requer um novo gate para o SHA documental final.
- **Produção:** Supabase consultado somente em leitura, sem migrations ou Storage/cloud writes; Vercel auto-deployment associado a `main`. Aceite visual e aprovação de migration P2 continuam decisões manuais.

---

## Histórico anterior preservado

# Atualização operacional — P2/P4, 09/11/2026

> **Atualização de continuidade — 09/11/2026.** Este trecho prevalece sobre quaisquer snapshots datados abaixo. Código inicialmente auditado em `7e8d7f82`, agora incluindo correção de fallback P2 (`4e739dbf`), suíte de mídia sintética (`630fb712`) e experimentos de prioridade da consulta inicial de Perfil (`b3dc0a5f` e `93176222`). **Não foi aplicada migration nem houve escrita de ensaio no Supabase de produção.** A migration `20261109024100_p2_composite_section_block_save.sql` existe em Git, mas `public.save_section_block_atomic` está **ausente no banco produtivo** (SELECT em `pg_proc`); usar o caminho legado até autorização separada. Veja [relatório de execução](P2_P4_RELATORIO_EXECUCAO_2026-11-09.md), [plano de aceite](P2_P4_PLANO_ACEITE_2026-11-08.md) e [mapa CMS → renderer](MAPA_CAMPOS_CMS_RENDERER.md).

## Situação P1–P5 em 09/11/2026
- **P1:** concluída tecnicamente; regressão de TypeScript, Vitest e build passou no Validate #42562429153.
- **P2:** implementação/RPC e 11 cenários CAS/rollback sintéticos aprovados; o fallback não aceita erro SQL interno `42883` como ausência de função; **produção ainda usa RPC anterior e não recebeu nova migration**.
- **P3:** mediana LCP mobile referência 3.684,469 ms (**FAIL**, teto ≤3.500). Experimento `b3dc0a5f` mediana 3.613,587 ms (**FAIL**); segundo experimento `93176222` medido em #42562429184, decisão depende da mediana. Identidade visual, fotos e CSS preservados.
- **P4 editor:** 6/6 UI básicas com escrita/releitura/renderer sintético; matriz ampla Hero, navegação, coleções e revisões pendente.
- **P4 mídia:** 8/8 novas verificações reais de Auth/Storage/metadados/compensações sintéticas em #42561707707; UI da Biblioteca completa pendente. `alt_text` canônico já refletido na composição em testes unitários; `credit` e `focal_point` são metadados, sem efeito público global automático comprovado.
- **P4 SEO:** 5/5 sintéticos, HTML estático só após novo build/deploy.
- **P5:** 30/30 referência #42556090560; mais 8 de mídia no workflow #42561707707. Não atribuir sucesso de run antigo ao SHA final.

---

## Documento anterior preservado para rastreabilidade

# PortfolioTulius — estado operacional vigente

**Snapshot conferido:** 05/11/2026 · **Fonte:** `main`, GitHub Actions e Vercel. A visão pública exibida hoje é o **baseline visual a preservar integralmente**. Não interpretar este Markdown como monitoramento em tempo real. O [estado acumulado anterior, com todos os marcos e métricas](historico/ESTADO_ATUAL_VIGENTE_ANTES_REORGANIZACAO_2026-11-05.md), foi preservado.

## Versões e evidências, sem misturar escopos

| Item | Comprovação |
|---|---|
| **Último commit funcional antes desta reorganização** | [`79aa3c07ce6c9106b1d504c1f574731bf70fb5d2`](https://github.com/tuliustsangaropulos/PortfolioTulius/commit/79aa3c07ce6c9106b1d504c1f574731bf70fb5d2) |
| **Validação de código** | [Validate #42020574434](https://github.com/tuliustsangaropulos/PortfolioTulius/actions/runs/42020574434): **success** (formatação, TypeScript, testes, build, smoke e sintaxe) |
| **Produção** | Vercel **READY**, `https://tulius.work/p3-deployment.json` apontando para **`79aa3c07`** durante a consulta |
| **Última auditoria P3 localizada** | [#42020342275](https://github.com/tuliustsangaropulos/PortfolioTulius/actions/runs/42020342275), commit anterior **`0873eeff`**, **failure global**, apesar de deployment do próprio SHA confirmado |
| **Detalhamento P3 anterior** | **7 falhas** no navegador; mediana LCP mobile sintético de **3.536,634 ms**, acima do limite **3.500 ms**. P4 produziu **38 capturas sem falhas automáticas** e P5 público foi validado separadamente. São métricas **desse SHA**, não do `79aa3c07` |
| **P3 para `79aa3c07`** | **Não localizada** nesta auditoria. O CI verde do último commit não substitui P3 |
| **Experiência real com CMS** | Operações autenticadas de salvar/reler campos, upload e exclusão não foram homologadas nesta rodada documental |

**Importante:** qualquer commit **somente documental** após `79aa3c07` pode gerar novo SHA e nova execução do build, sem alteração de conteúdo funcional. Não promover o SHA documental a evidência de aceite visual ou P3.

## Contrato público e CMS implementados

- A identidade visual, a fotografia, as cores, tipografia, cortes, animações e composição **estão aprovadas como exibição atual** e não devem ser modificadas por tarefas documentais.
- O perfil mobile foi compactado para trazer a seta à primeira dobra; o bloco duplicado “Experiência em destaque” foi ocultado apenas no mobile. A seção **Olá** contém o retrato sem cortes laterais no desktop e muda para fundo grafite apenas após a foto no mobile.
- **Ferramentas** mobile usa distribuição mais alta/espaçada; em **Experiências**, a faixa de logos muda para laranja somente ao ficar sticky. A renderização mobile concentra a experiência ativa e preserva a navegação pelos seis logos.
- No **Editor do Site**, os botões de criação de seção/bloco/item foram retirados da UI; abas **Editar seção / Acervo estruturado** ficaram compactas no cabeçalho; o botão **Salvar** utiliza o registro agregado de ações pendentes.
- **Trajetória** da experiência é editada na mesma página (Empresa, Cargo, Local, Início, Fim, Ordem, Status e Descrição). O tooltip ao lado de “Slides relacionados aos projetos” substitui as explicações extensas; o atalho para Coleções foi retirado. Os dados continuam em `career_experiences`.
- A **Biblioteca de Mídia** é o local da edição do alt e do enquadramento; o Editor não apresenta entradas locais. As cópias de alt em JSONB não têm atualização retroativa confirmada.
- A **Prévia** administrativa possui modo mobile com razão **390:844**. Os valores SEO só são refletidos no HTML estático **após um novo build**. Domínio canonical: **`https://tulius.work/`**.

Referências de implementação: [CMS](ADMIN_CMS.md), [layout responsivo](RESPONSIVE_LAYOUT.md) e [auditoria dos pedidos](AUDITORIA_PEDIDOS_CHAT_2026-11-05.md).

## Inventário de banco — somente snapshot anterior

Consulta somente leitura registrada em 05/11: **14 seções** (14 publicadas, 13 visíveis), **14 entradas de navegação** (14 publicadas), **75 mídias catalogadas** (72 públicas, 3 privadas), **128 objetos físicos** no Storage (72 públicos, 56 privados), e **0 `editorial_issues` abertas** naquele momento. Um snapshot anterior tinha 76 mídias e 129 objetos; **não há atribuição comprovada para a diferença**. Esses totais **não são atualizados automaticamente**; nenhuma gravação no Supabase foi feita nesta reorganização.

## Encerramento histórico e verificações técnicas

Em 05/11/2026 o proprietário declarou encerrada a frente anterior por **decisão administrativa e aceite visual**. [Registro de encerramento](ENCERRAMENTO_OPERACIONAL_2026-11-05.md). Isso não converte testes não executados em sucesso, nem significa que uma nova solicitação seja automaticamente um backlog antigo reaberto. Para lacunas restantes, consultar [Verificações técnicas](OPEN_ISSUES.md).

**Hierarquia operacional:** código e dados do SHA vigente → CI e deployment desse SHA → evidência de navegador / CMS específica → aceite estético do proprietário. [Índice documental](README.md) · [Arquivo completo da versão anterior](historico/ESTADO_ATUAL_VIGENTE_ANTES_REORGANIZACAO_2026-11-05.md).


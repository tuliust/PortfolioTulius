# Bloco 1 — Evidências de prévia, rede e integridade

**Executado em:** 02/11/2026; **SHA funcional:** `9d8288ee0d014cf063f7df5a5b1ee39af21b8a9d`.
**Workflow [P1–P3 #41402653744](https://github.com/tuliustsangaropulos/PortfolioTulius/actions/runs/41402653744)**: concluído com sucesso.

## P2 — Formação/A: antes e depois no DOM de teste

A automação abre `https://tulius.work/` sem credenciais e mantém os dados carregados do Supabase. Ela acrescenta os três nomes das instituições **exclusivamente aos elementos HTML da sessão do Chromium**, preservando o texto `meta` atual e o layout existente, captura o antes/depois e encerra sem salvar.

| Device | Resolução | Novas linhas | Meta original preservada | Overflow horizontal | Mutação | Resultado |
| --- | --- | ---: | --- | --- | ---: | --- |
| Desktop | 1440 × 900 | 3 | Sim | Não | 0 | PASS |
| Mobile | 390 × 844 | 3 | Sim | Não | 0 | PASS |
| Mobile compacto | 360 × 800 | 3 | Sim | Não | 0 | PASS |

**Arquivos:** artefato `p4-formation-isolated-preview` com seis PNGs no [workflow](https://github.com/tuliustsangaropulos/PortfolioTulius/actions/runs/41402653744) (três antes e três depois). Os testes estruturais automatizados **não** equivalem a aprovação humana de leitura, composição vertical e estética. A prévia está fora do CMS, não é uma mudança de conteúdo público e não vincula `source_collection`.

**Dados sintéticos:** `scripts/p2-synthetic-fixtures.mjs` produz payloads fictícios para página, seção, bloco, experiência, projeto, formação, depoimento e mídia. Teste nativo `scripts/p2-synthetic-fixtures.check.mjs` garante unicidade, estado draft e ausência de nomes reais escolhidos. Não foi utilizado para gravar nada no banco.

## P3 — Contagem de consultas públicas GET

A instrumentação registra apenas `pathname` (tabela), método GET e contagem. Nenhum token ou parâmetro de autorização é exibido.

| Tabela / endpoint | Desktop | Mobile 390 | Mobile 360 |
| --- | ---: | ---: | ---: |
| `sections` | 2 | 2 | 2 |
| `block_placements` | 1 | 1 | 1 |
| `career_experiences` | 1 | 1 | 1 |
| `design_tokens` | 1 | 1 | 1 |
| `navigation_items` | 1 | 1 | 1 |
| `pages` | 1 | 1 | 1 |
| `section_panels` | 1 | 1 | 1 |
| `site_settings` | 1 | 1 | 1 |
| `testimonials` | 1 | 1 | 1 |
| **Total de GETs** | **10** | **10** | **10** |

A primeira consulta a `sections` antecipa o Perfil para a primeira dobra; a segunda resolve todas as seções. Essa duplicação decorre da arquitetura atual, não demonstra por si só desperdício corrigível. Em eventual experimento, conservar a primeira renderização e medir se houve melhoria verdadeira antes de simplificar.

**Referência de LCP móvel:** ~3,419 s de mediana simulada no ensaio anterior; não houve nova rodada de três medidas Lighthouse neste ensaio, portanto a meta ≤2,5 s **segue pendente**.

## Restrições

Não houve mudança de fotografias, textos ou dados publicados. Nenhum link `source_collection` foi criado. A auditoria foi um ensaio controlado do navegador em três tamanhos, não uma alteração visual de produção.

[Checklist Bloco 1](CHECKLIST_BLOCO_1_P1_P2_P3_2026-11-02.md).

## Continuação: prévia real do CMS e auditorias repetidas

- **Código:** o editor do site agora oferece um checkbox optativo somente na seção Formação, na aba **Prévia**; a rota `/admin/preview?formationPilot=1#formacao` mantém a guarda de administrador. O comportamento comum da página pública `/` não consulta nem aplica a sobreposição.
- **Preparação dos dados:** o hook carrega `education` apenas no modo de prévia protegido, usa os IDs e valores das seis escolhas de Formação/A e preserva exatamente as demais seções/placements. Em inconsistência, exibe aviso e mantém o conteúdo salvo.
- **E2E autenticado:** [P5 Admin Read-Only #41404376390](https://github.com/tuliustsangaropulos/PortfolioTulius/actions/runs/41404376390) **SUCCESS 7/7**, incluindo `P5_FORMATION_PROTECTED_PREVIEW` em **mobile e desktop**, 3 registros aprovados e **0 mutações**; login e logout também validados. A prévia não foi publicada como origem estruturada.
- **P3/P4:** [Audit #41404082087](https://github.com/tuliustsangaropulos/PortfolioTulius/actions/runs/41404082087) **SUCCESS**: navegador com 0 falhas, 38 capturas editoriais sem violações detectadas, SEO estático 8/8. Lighthouse 13.5.0 mobile, três amostras **3313,643 / 3450,876 / 3290,066 ms**, mediana **3313,643 ms = 3,314 s**. Acessibilidade mobile 100. A mediana anterior era ~3,419 s, mas a diferença laboratorial **não comprova ganho causal** e a meta de 2,5 s continua pendente.
- **Próximo aceite:** revisão visual humana do modo de prévia no CMS, sem alterar a fonte de dados ou confirmar publicação por antecipação.

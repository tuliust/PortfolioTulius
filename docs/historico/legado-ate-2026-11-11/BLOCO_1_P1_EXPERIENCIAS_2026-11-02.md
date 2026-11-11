# Bloco 1 / P1 — Comparação das seis experiências (somente leitura)

**Fonte:** `career_experiences`, `portfolio_projects`, `sections` e `content_blocks`, todos em modo SELECT. **Data:** 02/11/2026. Os mesmos seis grupos de campos adicionais foram aprovados para as seis empresas; os **valores individuais não**.

## Identificadores estáveis e presença de dados

| Empresa | ID (prefixo) | Cargo estruturado | Localização estruturada | Período estruturado | Projetos publicados | Correspondência literal de projetos | Slides atuais |
| --- | --- | --- | --- | --- | ---: | --- | ---: |
| Invest RS | `73235f75` | Assessor Executivo \| Núcleo de Comunicação | Porto Alegre, RS | jul/2026 → atual | 2 | 2/2 | 4 |
| Prefeitura de São Paulo | `31d0afd1` | Coordenador de Comunicação (Diretor I) | São Paulo, SP | nov/2024 → jan/2026 | 1 | 1/1 | 3 |
| Vale | `83b94934` | Analista Sênior de Comunicação | São Paulo, SP | jun/2020 → out/2024 | 1 | 1/1 | 3 |
| Grupo InPress | `a5ef45bb` | Analista de Comunicação e Atendimento Sênior | São Paulo, SP | nov/2019 → jun/2020 | 0 | 0/0 | 3 |
| TV Globo/SporTV | `d2d19ae8` | Trainee, Repórter, Produtor, Editor e Correspondente | Rio de Janeiro, Pequim e São Paulo | out/2015 → out/2019 | 0 | 0/0 | 3 |
| CDI Comunicação | `9b38d29f` | Analista de Comunicação e Atendimento Pleno | São Paulo, SP | nov/2014 → set/2015 | 0 | 0/0 | 3 |

Todos os seis registros têm `description` publicada e `skills=[]`; a descrição já alimenta a trajetória pelo vínculo estável no código. Os cargos, locais e períodos aparecem também nos metadados das seções, mas com capitalização, abreviação e composição editorial próprias; **não substituir automaticamente `intro` e `eyebrow`**. Em `TV Globo/SporTV`, a seção usa o título de exibição `TV Globo / SporTV`; diferença textual deliberada a preservar.

## Projetos: comparação item a item

Exatamente **quatro projetos** estão publicados em `portfolio_projects`, vinculados a três das seis experiências. Uma correspondência por título **não significa que o resumo da coleção seja o mesmo texto do card**.

| Experiência | Projeto estruturado | Estado do projeto | Título encontrado no bloco | Card atualmente oculto | Texto do card igual ao resumo | Resumo estruturado (trecho) | Texto atual do card (trecho) |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Invest RS | Guia de Boas-Vindas | editorial | Sim | Não | Não | Estrutura editorial para atualização do guia institucional | Organização editorial e estrutura de atualização do guia institucional, com apoio à integração… |
| Invest RS | Plataforma de eventos e relacionamento | proposta | Sim | Não | Não | Concepção de fluxo para convites, inscrições e check-in | Proposta de solução digital com convites, inscrições, check-in, segmentação de públicos e rela… |
| Prefeitura de São Paulo | Plataforma SUBPI | concebido | Sim | Sim | Não | Portal interno concebido para cerca de 900 colaboradores | Portal interno concebido para cerca de 900 colaboradores, com comunicados, informações e indic… |
| Vale | Projetos digitais de ponta a ponta | realizado | Sim | Não | Não | Planejamento, briefing, governança e coordenação | Briefing, planejamento, coordenação de equipe e agências, governança, produção e KPIs. |

- **Invest RS:** dois projetos publicados na tabela. Outros cards de planejamento no painel B estão ocultos e não têm correspondência publicada na tabela; preservar.
- **Prefeitura de São Paulo:** `Plataforma SUBPI` tem correspondência por título, mas o card é `isHidden`; a publicação da coleção não autoriza tornar o card visível.
- **Vale:** `Projetos digitais de ponta a ponta` coincide em título, mas resumo e texto editorial divergem.
- **Grupo InPress, TV Globo/SporTV e CDI Comunicação:** não têm linhas publicadas em `portfolio_projects`; isto **não** indica ausência de conteúdo de realizações nos blocos editoriais.

## Campos comuns aprovados: contratos e limites

| Grupo de campos | Fonte estruturada | Fonte editorial pública a preservar | Bloqueio atual |
| --- | --- | --- | --- |
| Empresa | `career_experiences.company` | `sections.title` e navegação | nomes de exibição não necessariamente idênticos |
| Cargo | `career_experiences.role` | `sections.intro` e `eyebrow` | texto composto, com redação editorial |
| Localização | `career_experiences.location` | `sections.intro` / cards | algumas seções não a exibem no intro |
| Período | `start_date`, `end_date` | `sections.intro` | abreviações/caixa e separadores próprios |
| Projetos e realizações | `portfolio_projects` por `experience_id` | `content_json.items`, `isHidden` | quatro estruturados, estados/editoriais diferentes |
| Fotos, logos e galerias | sem colunas equivalentes em `career_experiences` | `content_json.experienceMedia` + cards | requer contrato de referência por ID e aceite visual |

## Mídia preservada

As seis experiências possuem logo atual e total de **19 slides** nos blocos, auditados anteriormente como presentes no Storage e com descrição/legenda. Nenhuma imagem ou slide foi substituído nesta análise.

**Decisões necessárias antes de sincronizar:** campo de destino, política de formatação/visibilidade por empresa, modelo de mídia, manutenção de cards ocultos e comparação visual em desktop/mobile. A uniformidade dos campos escolhidos **não** implica igualdade de textos ou quantidade de projetos.

[Inventário dos 26 blocos](BLOCO_1_P1_INVENTARIO_2026-11-02.md).
